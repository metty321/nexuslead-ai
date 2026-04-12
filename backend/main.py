from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import schemas
import utils.auth
from pydantic import BaseModel
from uuid import UUID



    
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}




@app.post("/register")
def register_user(user: schemas.UserCreate):
    db = SessionLocal()
    db_workspace = models.Workspaces(
        name=f"{user.first_name}'s Workspace" if user.first_name else "Personal Workspace",
        credits_remaining=100, # Give them 100 free AI credits to start!
    )

    db.add(db_workspace)
    db.commit() 
    db.refresh(db_workspace)

    db_user = models.User(
        email=user.email,
        workspace_id=db_workspace.id,   
        first_name=user.first_name,
        last_name=user.last_name,
        password_hash=utils.auth.hash_password(user.password), # Note: this should be hashed, not plain!
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()

    db.refresh(db_user) 
    db.close()
    return db_user

@app.put("/reset-password")
def reset_user_password(user: schemas.UserResetPassword):
    db = SessionLocal()
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    db_user.password_hash = utils.auth.hash_password(user.password)
    db.commit()
    db.refresh(db_user)
    db.close()
    return db_user

@app.post("/new-workspaces")
def new_workspace(workspace: schemas.WorkspaceCreate):
    db = SessionLocal()
    db_workspace = models.Workspaces(
        name=workspace.name,
        credits_remaining=100,
    )
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    db.close()
    return db_workspace

@app.delete("/delete-workspace")
def delete_workspace(id : UUID):
    db = SessionLocal()
    db_workspace = db.query(models.Workspaces).filter(models.Workspaces.id == id and models.Workspaces.is_deleted == False).first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db_workspace.is_deleted = True
    db.commit()
    db.close()
    return {"message": "Workspace deleted successfully"}

@app.get("/paginated-workspaces")
def paginated_workspaces(page: int = 1, limit: int = 10, disable_pagination: bool = False): 
    db = SessionLocal()
    if disable_pagination:
        db_workspaces = db.query(models.Workspaces).filter(models.Workspaces.is_deleted == False).all()
    else:
        db_workspaces = db.query(models.Workspaces).filter(models.Workspaces.is_deleted == False).offset((page - 1) * limit).limit(limit).all()
    db.close()
    return db_workspaces

@app.get("/workspace-detail")
def workspace_detail(id : UUID): 
    db = SessionLocal()
    db_workspace = db.query(models.Workspaces).filter(models.Workspaces.id == id and models.Workspaces.is_deleted == False).first()
    db.close()
    return db_workspace

@app.post("/login") 
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # 1. Get user from Postgres
    db_user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    # 2. Verify password
    if not utils.auth.verify_password(user_credentials.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    # 3. Create JWT token
    return {"access_token": utils.auth.create_access_token(data={"sub": db_user.email}), "token_type": "bearer"}

@app.post("/logout")
def logout():
    # In a stateless JWT architecture, the frontend simply discards the token.
    # We include this endpoint to keep the API documentation complete and 
    # to support future expansions (like token blacklisting or clearing HTTP-only cookies).
    return {"message": "Successfully logged out"}


