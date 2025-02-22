from fastapi import FastAPI
from routes import news
from fastapi.middleware.cors import CORSMiddleware

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

app.include_router(news.router)

@app.get("/")
def home():
    return{"message": "FastAPI Backend is Running!"}