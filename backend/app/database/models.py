"""
OptiCropAI 2.0 - SQLAlchemy Database Models
"""
import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from .database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    field_name = Column(String(120), default="Field Plot", nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    location = Column(String(150), nullable=True)

    # Soil & Environmental Parameters
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)

    # Recommendation Results
    recommended_crop = Column(String(80), nullable=False)
    confidence = Column(Float, nullable=False)
    confidence_percentage = Column(Float, nullable=False)
    soil_health_score = Column(Float, nullable=True)
    soil_health_rating = Column(String(50), nullable=True)
    risk_level = Column(String(50), nullable=True)

    # Serialized Full Analysis (Agent Insights, Action Plan, Risk Matrix, etc.)
    full_analysis_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        full_analysis = {}
        if self.full_analysis_json:
            try:
                full_analysis = json.loads(self.full_analysis_json)
            except Exception:
                full_analysis = {}

        return {
            "id": str(self.id),
            "field_name": self.field_name,
            "state": self.state or "",
            "district": self.district or "",
            "location": self.location or "",
            "recommended_crop": self.recommended_crop,
            "confidence": round(self.confidence, 4) if self.confidence else 0.0,
            "confidence_percentage": round(self.confidence_percentage, 2) if self.confidence_percentage else 0.0,
            "soil_health_score": round(self.soil_health_score, 1) if self.soil_health_score else None,
            "soil_health_rating": self.soil_health_rating or "Moderate",
            "risk_level": self.risk_level or "Low",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "parameters": {
                "N": self.nitrogen,
                "P": self.phosphorus,
                "K": self.potassium,
                "ph": self.ph,
                "temperature": self.temperature,
                "humidity": self.humidity,
                "rainfall": self.rainfall
            },
            "full_analysis": full_analysis
        }
