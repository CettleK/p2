from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Patient, UserEngagement
from dotenv import load_dotenv
from pydantic import BaseModel
import subprocess
import bcrypt
import jwt
import datetime
import os
import uuid
import logging
from passlib.context import CryptContext
from database import get_db
from models import User, Patient

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")  # Replace with a secure key


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ClickEvent(BaseModel):
    link: str
    
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str 
    password: str 
    full_name: str
    fhir_id: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# def get_fhir_reference_from_data():
#     epic_fhir_id = "erXuFYUfucBZaryVksYEcMg3"  # Replace with logic to extract from test data if dynamic
#     aetna_fhir_id = "2e897e49-61e0-4449-b470-c9909dc3ec1c"
#     athena_fhir_id= "a-80000.E-14545"
#     return aetna_fhir_id

@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    
    email = request.email
    password = request.password
    full_name = request.full_name

    logger.info(f"Attempting to register user: {email}")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        logger.warning(f"Registration failed: Email {email} already registered")
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(password)
    new_user = User(id=str(uuid.uuid4()), email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()

    # Get FHIR reference from test data instead of generating a new one
    fhir_reference = request.fhir_id

    new_patient = Patient(id=str(uuid.uuid4()), user_id=new_user.id, full_name=full_name, fhir_reference=fhir_reference)
    db.add(new_patient)
    db.commit()

    script_map = {
    "2e897e49-61e0-4449-b470-c9909dc3ec1c": "aetna.py",
    "a-80000.E-14545": "athena.py",
    "erXuFYUfucBZaryVksYEcMg3": "epic.py"
    }

    if fhir_reference in script_map:
        script_path = script_map[fhir_reference]
        logger.info(f"Executing data import script: {script_path}")
        try:
            subprocess.run(["python", script_path], check=True)
        except subprocess.CalledProcessError as e:
            logger.error(f"Error executing {script_path}: {e}")

    logger.info(f"New user registered: {email}, Patient FHIR Reference: {fhir_reference}")

    return {"message": "User registered successfully", "user_id": new_user.id, "patient_id": new_patient.id, "fhir_reference": fhir_reference}

@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    email = request.email
    password = request.password

    logger.info(f"User {email} attempting to log in")
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        logger.warning(f"Login failed: Email {email} not found")
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    
    if not bcrypt.checkpw(password.encode(), user.hashed_password.encode()):
        logger.warning(f"Login failed: Incorrect password for {email}")
        raise HTTPException(status_code=401, detail="Email or password is incorrect")

    # Generate JWT Token
    token_payload = {
        "sub": user.email,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
    logger.info(f"Generated token for {email}: {token}")

    user_engagement = db.query(UserEngagement).filter(UserEngagement.user_id == user.id).first()
    if user_engagement:
        user_engagement.last_login = datetime.datetime.utcnow()
        user_engagement.login_count += 1
        logger.info(f"Updated login count for {email}: {user_engagement.login_count}")
    else:
        user_engagement = UserEngagement(
            id=str(uuid.uuid4()),
            user_id=user.id,
            last_login=datetime.datetime.utcnow(),
            login_count=1
        )
        db.add(user_engagement)
        logger.info(f"Created new engagement record for {email}")

    db.commit()


    logger.info(f"User {email} logged in successfully")
    # ✅ Return token with "Bearer " prefix to match expected Authorization format
    return {"token": f"Bearer {token}", "email": user.email}

@router.get("/current_user")
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        logger.warning("🚨 Authorization header missing. Using default guest mode.")
        return None

    logger.info(f"🛠 Extracted Authorization Header: {authorization}")

    # 🔥 Fix: Ensure there's only ONE "Bearer"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        logger.error(f"❌ Invalid Authorization header format: {authorization}")
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = parts[1]  # ✅ Extract the correct token
    logger.info(f"🔑 Extracted Token: {token}")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        logger.info(f"✅ Successfully authenticated user: {user.email}")
        return {"id": user.id, "email": user.email}
    
    except jwt.ExpiredSignatureError:
        logger.error("JWT token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")

    except jwt.InvalidTokenError:
        logger.error("Invalid JWT token")
        raise HTTPException(status_code=401, detail="Invalid token")   

@router.post("/track_click")
def track_click(request: dict, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    """
    Logs the links clicked by the user.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: No user found")

    user_id = user["id"]
    link = request.get("link")  # Extract link from request body

    user_engagement = db.query(UserEngagement).filter(UserEngagement.user_id == user_id).first()
    
    if user_engagement:
        # Ensure clicked_links is a list before appending
        if not isinstance(user_engagement.clicked_links, list):
            user_engagement.clicked_links = []
        user_engagement.clicked_links.append(link)  
        db.commit()
    else:
        # Create a new engagement record
        user_engagement = UserEngagement(
            id=str(uuid.uuid4()),
            user_id=user_id,
            clicked_links=[link],  # Initialize with a list
            last_login=datetime.datetime.utcnow()  # Keep last_login tracking
        )
        db.add(user_engagement)
        db.commit()

    return {"message": "Link click logged successfully"}


# @router.get("/")
# def auth_home():
#     return {"message": "Authentication API is running"}