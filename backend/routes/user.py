from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models import User, Condition, Patient
from routes.auth import get_current_user
import random

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/tracker/")
def get_dummy_tracker_stats(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return {
        "blood_pressure": f"{random.randint(110, 140)}/{random.randint(70, 90)} mmHg",
        "heart_rate": f"{random.randint(60, 100)} BPM",
        "blood_sugar": f"{random.randint(80, 130)} mg/dL",
        "daily_steps": f"{random.randint(3000, 10000)} steps",
        "water_intake": f"{round(random.uniform(1.5, 3.5), 1)} L"
    }

@router.get("/")
def get_user_profile(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieves the user's profile information including name, active conditions, and inactive/unknown conditions.
    """
    patient = db.query(Patient).filter(Patient.user_id == user["id"]).first()

    active_conditions = db.query(Condition.name).filter(
        Condition.patient_id == patient.id,
        func.lower(Condition.status) == "active"
    ).all()

    inactive_conditions = db.query(Condition.name).filter(
        Condition.patient_id == patient.id,
        func.lower(Condition.status).in_(["inactive", "unknown"])
    ).all()

    # Convert conditions from list of tuples to list of strings
    active_conditions = [c[0] for c in active_conditions]
    inactive_conditions = [c[0] for c in inactive_conditions]

    return {
        "name": patient.full_name,
        "active_conditions": active_conditions,
        "inactive_conditions": inactive_conditions
    }