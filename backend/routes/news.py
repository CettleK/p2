from fastapi import APIRouter, Depends, HTTPException
import requests
import os
import logging
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db
from models import User, Patient, Condition
from routes.auth import get_current_user
from uuid import UUID


# Load environment variables
load_dotenv()


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


router = APIRouter(prefix = "/news", tags = ["News"])

GOOGLE_NEWS_API = "https://newsapi.org/v2/everything"

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Set a limit on the number of conditions used in the query
MAX_CONDITIONS = 1


#Checks for user conditions
def get_user_conditions(db: Session, user_id: UUID):
    """Retrieve the health conditions of a user from the database."""
    
    logger.info(f"🔍 Searching for conditions for user ID: {user_id}")
    try:
        # Find the patient associated with the user_id
        patient = db.query(Patient).filter(Patient.user_id == user_id).first()
        if not patient:
            logger.warning(f"⚠️ No patient found for user ID: {user_id}.")
            return []

        # Fetch conditions linked to the patient_id
        conditions = db.query(Condition).filter(Condition.patient_id == patient.id).all()
        condition_names = [condition.name for condition in conditions]
        
        logger.info(f"✅ Retrieved conditions for user {user_id}: {condition_names}")
        return condition_names
    except Exception as e:
        logger.error(f"❌ Error fetching conditions for user ID {user_id}: {e}")
        return []

@router.get("/", tags=["News"])
def get_health_news(user: dict = Depends(get_current_user), db: Session = Depends(get_db), category: str = None):
    """Fetch personalized health-related news based on user conditions."""
    logger.info("News API key loaded successfully.")

    search_keywords = "health"  # Default search term

    if user:
        logger.info(f"User detected: {user}")  # Debugging user retrieval
        user_id = user.get("id")

        if not user_id:
            logger.warning("User ID is missing in user data. Defaulting to general health news.")
        else:
            logger.info(f"Fetching conditions for user ID: {user_id}")
            conditions = get_user_conditions(db, user_id)

            if conditions:
                limited_conditions = conditions[:MAX_CONDITIONS]  # ✅ Apply limit
                search_keywords = " OR ".join(limited_conditions)  # ✅ Construct search query with user conditions
                logger.info(f"User conditions found (limited to {MAX_CONDITIONS}): {search_keywords}")
            else:
                logger.warning("No conditions found for user. Using default health news.")

    # ✅ Apply category filter if provided
    if category:
        search_keywords += f" AND {category}"
        logger.info(f"Applying category filter: {category}")

    logger.info(f"Querying news API with keywords: {search_keywords}")
    
    try:
        response = requests.get(
            GOOGLE_NEWS_API,
            params={"q": search_keywords, "apiKey": NEWS_API_KEY},
        )
        response.raise_for_status()
        news_data = response.json()
        logger.info("News API request successful.")
        return {"articles": news_data.get("articles", [])}

    except requests.RequestException as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving news")
    
@router.get("/insights", response_model=dict)
def get_health_insights(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Retrieves tailored health insights based on the user's conditions.
    """
    logger.info(f"Fetching insights for user: {user}")

    if not user:
        logger.warning("No user logged in. Providing general health insights.")
        return {"insights": ["Stay hydrated", "Exercise regularly", "Maintain a balanced diet"]}

    user_id = user.get("id")
    if not user_id:
        logger.warning("User ID missing. Providing general insights.")
        return {"insights": ["Stay hydrated", "Exercise regularly", "Maintain a balanced diet"]}

    try:
        # ✅ Fetch conditions correctly from the database
        conditions = get_user_conditions(db, user_id)
        logger.info(f"✅ User conditions for insights: {conditions}")

        if not conditions:
            return {"insights": ["Stay hydrated", "Exercise regularly", "Maintain a balanced diet", "Get enough sleep", "Manage stress effectively"]}

        # ✅ Define condition-specific insights
        condition_insights = {
            "Diabetes mellitus": "Monitor your blood sugar regularly.",
            "Hypertension": "Reduce sodium intake and exercise regularly.",
            "Hyperlipidemia": "Avoid trans fats and maintain a healthy diet.",
            "Depressive disorder": "Consider mindfulness exercises and regular therapy sessions.",
            "Heart Disease": "Maintain a balanced diet and engage in moderate exercise.",
            "Obesity": "Follow a calorie-controlled diet and engage in physical activities.",
        }

        # ✅ Retrieve insights for the first 5 conditions of the user
        insights = [condition_insights.get(cond, None) for cond in conditions[:5] if cond in condition_insights]

        # ✅ Fill missing slots with generic insights
        general_insights = [
            "Stay proactive about your health.",
            "Eat a variety of nutritious foods.",
            "Prioritize mental health and relaxation.",
            "Ensure you get enough sleep every night.",
            "Stay hydrated and drink plenty of water."
        ]

        while len(insights) < 5:
            insights.append(general_insights.pop(0))

        logger.info(f"✅ Personalized insights for user: {insights}")

        return {"insights": insights}

    except Exception as e:
        logger.error(f"❌ Error fetching insights: {e}")
        return {"insights": ["Error retrieving insights, please try again later."]}

