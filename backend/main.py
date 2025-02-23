from fastapi import FastAPI
from routes import news, auth
from fastapi.middleware.cors import CORSMiddleware
from database import init_db

#venv\Scripts\Activate.bat 
#venv\Scripts\Deactivate.bat
#pip install -r requirements.txt
#python -m uvicorn main:app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(news.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return{"message": "FastAPI Backend is Running!"}