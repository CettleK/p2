from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv() 

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "health_feed"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

users_collection = db["users"]
conditions_collection = db["conditions"]