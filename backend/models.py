from sqlalchemy import Column, String, Date, ForeignKey, Text, UUID, DateTime, Integer
from sqlalchemy.orm import relationship
from database import Base, engine
from datetime import datetime
import uuid

# User Table
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(Text, nullable=False)

    # Relationship to link patients to a user
    patients = relationship("Patient", back_populates="user")
    engagement = relationship("UserEngagement", back_populates="user", uselist=False)


# Patient Table
class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    full_name = Column(String, nullable=False)
    fhir_reference = Column(String, unique=True, nullable=True)
    gender = Column(String)
    birth_date = Column(Date)
    address = Column(Text)
    phone = Column(String)
    email = Column(String)

    user = relationship("User", back_populates="patients")
    conditions = relationship("Condition", back_populates="patient", cascade="all, delete")
    allergies = relationship("Allergy", back_populates="patient", cascade="all, delete")
    care_plans = relationship("CarePlan", back_populates="patient", cascade="all, delete")
    diagnostic_reports = relationship("DiagnosticReport", back_populates="patient", cascade="all, delete")
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete")
    observations = relationship("Observation", back_populates="patient", cascade="all, delete")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete")


# Condition Table
class Condition(Base):
    __tablename__ = "conditions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    verification_status = Column(String, nullable=False)
    onset_date = Column(Date, nullable=True)
    recorded_date = Column(Date, nullable=True)

    patient = relationship("Patient", back_populates="conditions")


# Allergy Table
class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    allergy_name = Column(String, nullable=False)
    reaction = Column(Text)
    severity = Column(String)
    verification_status = Column(String)

    patient = relationship("Patient", back_populates="allergies")


# CarePlan Table
class CarePlan(Base):
    __tablename__ = 'care_plans'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey('patients.id'), nullable=False)
    status = Column(String, nullable=False)
    # intent = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(String, nullable=True)  # Added field
    period_start = Column(DateTime, nullable=True)  # Newly added field
    period_end = Column(DateTime, nullable=True)

    created_date = Column(DateTime, nullable=True)

    patient = relationship("Patient", back_populates="care_plans")


# DiagnosticReport Table
class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    test_name = Column(Text)
    test_code = Column(String)
    test_result = Column(Text)
    recorded_date = Column(Date)
    report_type = Column(String)
    status = Column(String)
    issued_date = Column(Date)
    results = Column(Text)  # Added field for test data compatibility

    patient = relationship("Patient", back_populates="diagnostic_reports")


# Encounter Table
class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    encounter_type = Column(String)
    encounter_status = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)

    patient = relationship("Patient", back_populates="encounters")


# Observation Table
class Observation(Base):
    __tablename__ = "observations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    observation_name = Column(String, nullable=False)
    value = Column(String, nullable=True)
    unit = Column(String, nullable=True)
    recorded_date = Column(Date, nullable=True)

    patient = relationship("Patient", back_populates="observations")


# Medication Table
class Medication(Base):
    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    medication_name = Column(String, nullable=False)
    dosage = Column(String)
    status = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)

    patient = relationship("Patient", back_populates="medications")

class UserEngagement(Base):
    __tablename__ = "user_engagement"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    last_login = Column(DateTime, default=datetime.utcnow)
    login_count = Column(Integer, default=0)
    clicked_links = Column(Text, nullable=True)

    user = relationship("User", back_populates="engagement")


# Drop all tables except `users`, then recreate them
# def reset_database():
#     print("Resetting database...")
#     Base.metadata.drop_all(bind=engine, tables=[
#         User.__table__,
#         Patient.__table__,
#         Condition.__table__,
#         Allergy.__table__,
#         CarePlan.__table__,
#         DiagnosticReport.__table__,
#         Encounter.__table__,
#         Observation.__table__,
#         Medication.__table__,
#     ])
#     Base.metadata.create_all(bind=engine)
#     print("Database reset complete!")


# if __name__ == "__main__":
#     reset_database()
