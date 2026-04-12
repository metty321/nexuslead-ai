from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

# This schema is used when reading a User from the database (it includes the ID and timestamps)
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = True
    

class UserCreate(UserBase):
    password: str # You should NEVER return the password, so it's only in the "Create" schema

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResetPassword(BaseModel):
    email : EmailStr
    password : str
    confirm_password : str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # This tells Pydantic to read data from SQLAlchemy objects, not just dicts
class WorkspaceBase(BaseModel):
    name: str
    credits_remaining: Optional[int] = 0
class WorkspaceCreate(WorkspaceBase):
    pass
class WorkspaceResponse(WorkspaceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # This tells Pydantic to read data from SQLAlchemy objects, not just dicts   