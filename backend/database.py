from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Replace user, password, host, port, dbname with your Docker PostgreSQL credentials
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/auth-tutorial-db"

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a sessionmaker which will be used to create actual database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your SQLAlchemy models
Base = declarative_base()
