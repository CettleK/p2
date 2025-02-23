from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv
import random

load_dotenv()

router = APIRouter(prefix = "/news", tags = ["News"])

GOOGLE_NEWS_API = "https://newsapi.org/v2/everything"

# news_type = ["health", "sports", "weather", "politics", "finance"]
# random_q = random.randint(0, 4)
# news_type[random_q]


@router.get("/")
def get_health_news(q: str = "health"):
    api_key = os.getenv("NEWS_API_KEY")
    url = f"{GOOGLE_NEWS_API}?q={q}&apiKey={api_key}"

    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Unable to fetch news"}



