"""
OptiCropAI 2.0 - Tool Gateway Route
Controlled API interface for tool discovery, schema inspection, and execution.
"""
from flask import Blueprint, request, jsonify
from ..gateway.gateway import ToolGateway

tools_bp = Blueprint("tools", __name__, url_prefix="/api/tools")
gateway = ToolGateway.get_instance()

@tools_bp.route("", methods=["GET"])
def list_available_tools():
    """Returns list of registered tools with schemas."""
    tools = gateway.list_tools()
    return jsonify({
        "count": len(tools),
        "tools": tools
    }), 200

@tools_bp.route("/<string:tool_name>", methods=["GET"])
def get_tool_details(tool_name):
    """Returns metadata and contract for a specific tool."""
    info = gateway.get_tool_info(tool_name)
    if not info:
        return jsonify({"error": f"Tool '{tool_name}' not found in registry."}), 404
    return jsonify(info), 200

@tools_bp.route("/execute", methods=["POST"])
def execute_tool_endpoint():
    """
    Executes a registered tool under the gateway's validation and auditing umbrella.
    """
    if not request.is_json:
        return jsonify({"error": "Payload must be JSON."}), 400

    payload = request.get_json() or {}
    tool_name = payload.get("tool")
    arguments = payload.get("arguments", {})

    if not tool_name:
        return jsonify({"error": "Missing 'tool' parameter in request body."}), 400

    response = gateway.execute_tool(tool_name, arguments)

    if not response.success:
        return jsonify(response.to_dict()), 422

    return jsonify(response.to_dict()), 200

@tools_bp.route("/logs", methods=["GET"])
def get_tool_audit_logs():
    """Returns recent tool execution logs."""
    limit = min(int(request.args.get("limit", 50)), 100)
    logs = gateway.get_logs(limit)
    return jsonify({
        "count": len(logs),
        "logs": logs
    }), 200
