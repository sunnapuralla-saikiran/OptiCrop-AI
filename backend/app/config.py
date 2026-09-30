"""
OptiCropAI 2.0 - Configuration Module
"""
import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "opticrop_2.db")

class Config:
    PROJECT_NAME = "OptiCropAI"
    VERSION = "2.0.0"
    HOST = os.environ.get("FLASK_HOST", "0.0.0.0")
    PORT = int(os.environ.get("FLASK_PORT", 5000))
    SECRET_KEY = os.environ.get("SECRET_KEY", "opticrop-ai-v2-super-secret-key-2026")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OPENWEATHERMAP_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY", "")
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1")
    MODELS_DIR = os.path.join(BASE_DIR, "models")
    REPORTS_DIR = os.path.join(BASE_DIR, "reports")
