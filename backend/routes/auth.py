from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from dotenv import load_dotenv
from pydantic import BaseModel
import bcrypt
import jwt
import datetime
import os

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY")  # Replace with a secure key

class LoginRequest(BaseModel):
    email: str
    password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(email: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}

@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not bcrypt.checkpw(request.password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="Email or password is incorrect")

    # Generate JWT Token
    token_payload = {
        "sub": user.email,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)  # Token expires in 2 hours
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

    return {"token": token, "email": user.email}


# @router.get("/")
# def auth_home():
#     return {"message": "Authentication API is running"}