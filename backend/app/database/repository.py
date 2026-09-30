"""
OptiCropAI 2.0 - Analysis Database Repository
Provides CRUD and aggregation helpers for historical field evaluations.
"""
import json
from typing import Dict, Any, List, Optional
from sqlalchemy import func, desc

from .database import db_session
from .models import Analysis

class AnalysisRepository:
    @staticmethod
    def save_analysis(
        field_meta: Dict[str, Any],
        parameters: Dict[str, float],
        recommendation: Dict[str, Any],
        full_analysis_dict: Dict[str, Any]
    ) -> Analysis:
        """
        Persists a newly computed field analysis to SQLite.
        """
        # Extract risk level
        risks = recommendation.get("risks", [])
        overall_risk = "Low"
        if any(r.get("severity") == "High" for r in risks):
            overall_risk = "High"
        elif any(r.get("severity") == "Moderate" for r in risks):
            overall_risk = "Moderate"

        soil_health = recommendation.get("soil_health", {})
        field_name = field_meta.get("field_name") or "Primary Field"

        record = Analysis(
            field_name=field_name,
            state=field_meta.get("state"),
            district=field_meta.get("district"),
            location=field_meta.get("location"),
            nitrogen=float(parameters.get("N", 0)),
            phosphorus=float(parameters.get("P", 0)),
            potassium=float(parameters.get("K", 0)),
            ph=float(parameters.get("ph", 7.0)),
            temperature=float(parameters.get("temperature", 25.0)),
            humidity=float(parameters.get("humidity", 70.0)),
            rainfall=float(parameters.get("rainfall", 100.0)),
            recommended_crop=recommendation.get("recommended_crop", "Unknown"),
            confidence=float(recommendation.get("confidence", 0.0)),
            confidence_percentage=float(recommendation.get("confidence_percentage", 0.0)),
            soil_health_score=float(soil_health.get("soil_health_score", 0.0)) if soil_health else None,
            soil_health_rating=soil_health.get("rating", "Moderate") if soil_health else "Moderate",
            risk_level=overall_risk,
            full_analysis_json=json.dumps(full_analysis_dict)
        )

        db_session.add(record)
        db_session.commit()
        return record

    @staticmethod
    def list_analyses(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        query = db_session.query(Analysis).order_by(desc(Analysis.created_at)).offset(offset).limit(limit)
        return [record.to_dict() for record in query.all()]

    @staticmethod
    def get_analysis_by_id(analysis_id: Any) -> Optional[Dict[str, Any]]:
        try:
            aid = int(analysis_id)
        except (ValueError, TypeError):
            return None

        record = db_session.query(Analysis).filter(Analysis.id == aid).first()
        return record.to_dict() if record else None

    @staticmethod
    def delete_analysis(analysis_id: Any) -> bool:
        try:
            aid = int(analysis_id)
        except (ValueError, TypeError):
            return False

        record = db_session.query(Analysis).filter(Analysis.id == aid).first()
        if record:
            db_session.delete(record)
            db_session.commit()
            return True
        return False

    @staticmethod
    def get_dashboard_stats() -> Dict[str, Any]:
        total_count = db_session.query(func.count(Analysis.id)).scalar() or 0

        avg_score = db_session.query(func.avg(Analysis.soil_health_score)).scalar()
        avg_soil_health = round(float(avg_score), 1) if avg_score else 0.0

        high_risk_count = db_session.query(func.count(Analysis.id)).filter(
            Analysis.risk_level == "High"
        ).scalar() or 0

        # Most frequent recommended crop
        top_crop_row = (
            db_session.query(Analysis.recommended_crop, func.count(Analysis.id).label("count"))
            .group_by(Analysis.recommended_crop)
            .order_by(desc("count"))
            .first()
        )
        top_crop = top_crop_row[0] if top_crop_row else "None"

        # Crop distribution
        crop_counts = (
            db_session.query(Analysis.recommended_crop, func.count(Analysis.id).label("count"))
            .group_by(Analysis.recommended_crop)
            .order_by(desc("count"))
            .limit(8)
            .all()
        )
        crop_distribution = [{"crop": c, "count": cnt} for c, cnt in crop_counts]

        recent_query = db_session.query(Analysis).order_by(desc(Analysis.created_at)).limit(5)
        recent_analyses = [r.to_dict() for r in recent_query.all()]

        return {
            "total_analyses": total_count,
            "average_soil_health": avg_soil_health,
            "high_risk_alerts": high_risk_count,
            "top_recommended_crop": top_crop,
            "crop_distribution": crop_distribution,
            "recent_analyses": recent_analyses
        }
