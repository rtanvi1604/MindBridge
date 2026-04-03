import os
from dotenv import load_dotenv

load_dotenv()

# HuggingFace model config
EMOTION_MODEL = os.getenv("EMOTION_MODEL", "j-hartmann/emotion-english-distilroberta-base")
SENTIMENT_MODEL = os.getenv("SENTIMENT_MODEL", "distilbert-base-uncased-finetuned-sst-2-english")

# Google Translate (optional)
GOOGLE_TRANSLATE_API_KEY = os.getenv("GOOGLE_TRANSLATE_API_KEY", "")

# Firebase (optional for persistence)
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS", "")

# App settings
APP_ENV = os.getenv("APP_ENV", "development")
PORT = int(os.getenv("PORT", 8000))
