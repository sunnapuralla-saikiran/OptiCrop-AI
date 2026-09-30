"""
OptiCropAI 2.0 - Analysis History Blueprint
"""
from flask import Blueprint, request, jsonify
from ..database.repository import AnalysisRepository

history_bp = Blueprint("history", __name__, url_prefix="/api/history")

@history_bp.route("", methods=["GET"])
def get_history():
    limit = min(int(request.args.get("limit", 50)), 100)
    offset = max(int(request.args.get("offset", 0)), 0)

    records = AnalysisRepository.list_analyses(limit=limit, offset=offset)
    return jsonify({
        "count": len(records),
        "limit": limit,
        "offset": offset,
        "analyses": records
    }), 200

@history_bp.route("/stats", methods=["GET"])
def get_stats():
    stats = AnalysisRepository.get_dashboard_stats()
    return jsonify(stats), 200

@history_bp.route("/<string:analysis_id>", methods=["GET"])
def get_single_analysis(analysis_id):
    record = AnalysisRepository.get_analysis_by_id(analysis_id)
    if not record:
        return jsonify({"error": f"Analysis with ID '{analysis_id}' not found."}), 404
    return jsonify(record), 200

@history_bp.route("/<string:analysis_id>", methods=["DELETE"])
def delete_single_analysis(analysis_id):
    success = AnalysisRepository.delete_analysis(analysis_id)
    if not success:
        return jsonify({"error": f"Analysis with ID '{analysis_id}' not found."}), 404
    return jsonify({"success": True, "message": f"Analysis '{analysis_id}' deleted successfully."}), 200
