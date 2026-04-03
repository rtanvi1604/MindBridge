from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes.assessment import router as assessment_router
from routes.mood import router as mood_router

app = FastAPI(
    title="MindBridge API",
    description="AI-powered mental health first responder for India",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(assessment_router, prefix="/api/assess", tags=["Assessment"])
app.include_router(mood_router, prefix="/api/mood", tags=["Mood"])

@app.get("/")
def root():
    return {"message": "MindBridge API is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "ok"}
