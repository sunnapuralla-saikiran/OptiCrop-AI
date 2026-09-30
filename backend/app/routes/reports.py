"""
OptiCropAI 2.0 - Report Generation Route
Supports POST and GET for generating and downloading PDF dossiers.
"""
import os
from flask import Blueprint, request, jsonify, send_file
from ..services.report_service import ReportService
from ..database.repository import AnalysisRepository

reports_bp = Blueprint("reports", __name__, url_prefix="/api")

@reports_bp.route("/report", methods=["POST", "GET"])
@reports_bp.route("/report/generate", methods=["POST", "GET"])
@reports_bp.route("/reports/generate", methods=["POST", "GET"])
def generate_report_endpoint():
    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        analysis_id = payload.get("analysis_id") or request.args.get("analysis_id")
        raw_data = payload.get("analysis_data")
    else:
        payload = {}
        analysis_id = request.args.get("analysis_id")
        raw_data = None

    analysis_payload = None

    if analysis_id:
        record = AnalysisRepository.get_analysis_by_id(analysis_id)
        if not record:
            return jsonify({"error": f"Record with ID '{analysis_id}' not found."}), 404
        analysis_payload = record.get("full_analysis", {})
    elif raw_data:
        analysis_payload = raw_data
    else:
        # Fallback to the latest analysis if neither ID nor raw_data is passed
        recent = AnalysisRepository.list_analyses(limit=1)
        if recent:
            analysis_payload = recent[0].get("full_analysis", {})
        else:
            return jsonify({"error": "Either 'analysis_id' or 'analysis_data' must be supplied."}), 400

    try:
        pdf_path = ReportService.generate_pdf(analysis_payload)
        filename = os.path.basename(pdf_path)

        return send_file(
            pdf_path,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({
            "error": "Failed to generate agronomic PDF report.",
            "message": str(e)
        }), 500

