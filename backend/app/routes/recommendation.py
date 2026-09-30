"""
OptiCropAI 2.0 - Recommendation API Route
Coordinates input validation, Agent orchestration, and history persistence.
"""
from flask import Blueprint, request, jsonify
from ..utils.validators import validate_soil_environment_input
from ..agent.agent import AgriculturalAnalysisAgent
from ..database.repository import AnalysisRepository

recommendation_bp = Blueprint("recommendation", __name__, url_prefix="/api")
agent = AgriculturalAnalysisAgent()

@recommendation_bp.route("/recommend", methods=["POST"])
def recommend_crop():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    payload = request.get_json() or {}

    # Support either flat structure or nested features/field_meta
    raw_features = payload.get("features", payload)
    field_meta = payload.get("field_meta", {})
    save_to_db = payload.get("save_to_history", True)

    # 1. Validation
    is_valid, errors, cleaned_features = validate_soil_environment_input(raw_features)
    if not is_valid:
        return jsonify({
            "error": "Validation failed on soil/environmental inputs.",
            "details": errors
        }), 422

    # 2. Agent Execution
    try:
        agent_result = agent.analyze_field(cleaned_features, field_meta)

        # 3. Optional Persistence to History
        analysis_id = None
        if save_to_db:
            db_record = AnalysisRepository.save_analysis(
                field_meta=field_meta,
                parameters=cleaned_features,
                recommendation=agent_result["recommendation"],
                full_analysis_dict=agent_result
            )
            analysis_id = db_record.id
            agent_result["analysis_id"] = analysis_id

        return jsonify(agent_result), 200

    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred during agronomic analysis.",
            "message": str(e)
        }), 500
