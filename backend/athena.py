from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Patient, Condition, Allergy, CarePlan, DiagnosticReport
import json
import logging

logging.basicConfig(level=logging.INFO)
session = SessionLocal()

def log_patients(session):
    """ Log existing patients in the database before processing FHIR data. """
    patients = session.query(Patient).all()
    logging.info(f"Found {len(patients)} patients in the database.")
    for patient in patients:
        logging.info(f"Patient: {patient.id}, FHIR Reference: {patient.fhir_reference}")

def extract_patient_reference(resource):
    """ Extracts the patient reference ID from a FHIR resource. """
    if isinstance(resource, dict) and "subject" in resource and "reference" in resource["subject"]:
        ref = resource["subject"]["reference"].replace("Patient/", "").strip()
        logging.info(f"Normalized Extracted Patient Reference: {ref}")
        return ref
    return None

def process_fhir_data(file_path):
    """ Process the FHIR data file and insert records into the database. """
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            fhir_data = [json.loads(line.strip()) for line in file if line.strip()]
        
        logging.info(f"Loaded {len(fhir_data)} records from {file_path}")

        for i, resource in enumerate(fhir_data):
            resource_type = resource.get("resourceType", "Unknown")
            logging.info(f"Processing record {i + 1}: {resource_type}")

            extracted_patient_ref = extract_patient_reference(resource)
            if not extracted_patient_ref:
                logging.warning(f"Skipping record {i + 1}: No patient reference found")
                continue

            patient = session.query(Patient).filter_by(fhir_reference=extracted_patient_ref).first()
            if not patient:
                logging.warning(f"No patient found with FHIR reference {extracted_patient_ref}, skipping record.")
                continue

            # Insert data into the appropriate table
            if resource_type == "Condition":
                new_entry = Condition(
                    patient_id=patient.id,
                    name=resource.get("code", {}).get("text", "Unknown"),
                    status=resource.get("clinicalStatus", {}).get("text", "Unknown"),
                    verification_status=resource.get("verificationStatus", {}).get("text", "Unknown"),
                    onset_date=resource.get("onsetDateTime"),
                    recorded_date=resource.get("recordedDate"),
                )
            elif resource_type == "AllergyIntolerance":
                new_entry = Allergy(
                    patient_id=patient.id,
                    allergy_name=resource.get("code", {}).get("text", "Unknown"),
                    reaction=json.dumps(resource.get("reaction", [])),
                    severity=resource.get("criticality", "Unknown"),
                    verification_status=resource.get("verificationStatus", {}).get("text", "Unknown"),
                )
            elif resource_type == "DiagnosticReport":
                new_entry = DiagnosticReport(
                    patient_id=patient.id,
                    report_type=resource.get("code", {}).get("text", "Unknown"),
                    status=resource.get("status", "Unknown"),
                    issued_date=resource.get("issued"),
                    results=json.dumps(resource.get("result", [])),
                )
            elif resource_type == "CarePlan":
                new_entry = CarePlan(
                    patient_id=patient.id,
                    description=resource.get("title", "Unknown"),
                    status=resource.get("status", "Unknown"),
                    period_start=resource.get("period", {}).get("start"),
                    period_end=resource.get("period", {}).get("end"),
                )
            else:
                logging.info(f"Skipping unsupported resource type: {resource_type}")
                continue

            session.add(new_entry)
            logging.info(f"Added {resource_type} for patient {patient.id}")
            
        session.commit()
    except Exception as e:
        logging.error(f"Error processing FHIR data: {e}")
        session.rollback()
    finally:
        session.close()

log_patients(session)
# Process the Athena test data
process_fhir_data("tests/Athena Test Data.txt")
