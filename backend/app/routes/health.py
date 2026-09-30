"""
OptiCropAI 2.0 - Health Check Blueprint
"""
from flask import Blueprint, jsonify
from ..ml.model_manager import ModelManager
from ..gateway.gateway import ToolGateway
from ..config import Config

health_bp = Blueprint("health", __name__, url_prefix="/api")

@health_bp.route("/health", methods=["GET"])
def health_check():
    """
    Returns platform diagnostics, ML model status, and Tool Gateway status.
    """
    ml_status = "unloaded"
    model_name = None
    try:
        manager = ModelManager.get_instance()
        prep = manager.get_preprocessor()
        model_name = prep.get("model_name")
        ml_status = "ready"
    except Exception as e:
        ml_status = f"unavailable: {str(e)}"

    gateway = ToolGateway.get_instance()
    registered_tools = [t["name"] for t in gateway.list_tools()]

    return jsonify({
        "status": "healthy",
        "service": Config.PROJECT_NAME,
        "version": Config.VERSION,
        "ml_engine": {
            "status": ml_status,
            "champion_model": model_name
        },
        "tool_gateway": {
            "status": "active",
            "registered_tools_count": len(registered_tools),
            "tools": registered_tools
        }
    }), 200
