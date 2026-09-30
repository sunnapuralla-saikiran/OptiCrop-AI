"""
OptiCropAI 2.0 - Agricultural Analysis Agent
Coordinates the complete decision-support workflow:
Calls ML/recommendation services -> Plans knowledge requirements ->
Requests data strictly through the Tool Gateway -> Synthesizes verified insights.
"""
from typing import Dict, Any, List
from datetime import datetime

from ..services.recommendation_service import RecommendationService
from ..gateway.gateway import ToolGateway
from .planner import AgentPlanner

class AgriculturalAnalysisAgent:
    def __init__(self):
        self.recommendation_service = RecommendationService()
        self.gateway = ToolGateway.get_instance()

    def analyze_field(
        self,
        features: Dict[str, float],
        field_meta: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Coordinates the multi-stage agentic analysis process.
        """
        if field_meta is None:
            field_meta = {}

        # Stage 1: Call Primary ML Recommendation & Agronomic Engine
        primary_rec = self.recommendation_service.generate_full_recommendation(features, field_meta)
        crop = primary_rec["recommended_crop"]

        # Stage 2: Create Action Plan for Additional Tool Retrieval
        plan_steps = AgentPlanner.create_plan(features, field_meta, crop)

        # Stage 3: Request Additional Information Through Tool Gateway
        # Note: The agent NEVER accesses tool internals or files directly!
        agent_insights = []
        executed_steps = []

        for step in plan_steps:
            tool_resp = self.gateway.execute_tool(step.tool_name, step.tool_arguments)
            step_record = {
                "step_id": step.step_id,
                "action": step.action_type,
                "target": step.target,
                "tool": step.tool_name,
                "arguments": step.tool_arguments,
                "success": tool_resp.success,
                "execution_time_ms": tool_resp.execution_time_ms
            }

            if tool_resp.success:
                step.status = "completed"
                # Synthesize insight based on retrieved tool data
                insight = self._synthesize_tool_insight(step.target, tool_resp.data)
                if insight:
                    agent_insights.append(insight)
            else:
                step.status = "failed"
                step_record["error"] = tool_resp.error

            executed_steps.append(step_record)

        # Stage 4: Combine Verified Results into Final Structured Output
        final_payload = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "field_meta": field_meta,
            "input_parameters": features,
            "recommendation": primary_rec,
            "agent_metadata": {
                "agent_name": "OptiCropAI Agronomic Analysis Agent",
                "version": "2.0.0",
                "gateway_invocations": len(executed_steps),
                "plan_execution": executed_steps,
                "verified_tool_insights": agent_insights
            }
        }

        return final_payload

    def _synthesize_tool_insight(self, target: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Translates raw tool gateway output into high-level agent advisory notes.
        """
        if target == "crop_agronomy":
            agronomy = data.get("agronomic_profile", {})
            return {
                "type": "Crop Agronomic Profile",
                "headline": f"Botanical Characteristics of {data.get('crop', '').capitalize()}",
                "summary": f"Duration: {agronomy.get('growth_duration_days', 'N/A')} | Water Demand: {agronomy.get('water_demand', 'N/A')}",
                "detail": agronomy.get("soil_preference", ""),
                "key_nutrients": agronomy.get("key_nutrients", "")
            }

        elif target == "soil_ph_amelioration":
            content = data.get("content", {})
            remediation = content.get("remediation", {})
            return {
                "type": "Edaphic pH Guidance",
                "headline": "Targeted Soil pH Amelioration",
                "summary": "Verified treatment protocols retrieved from Agricultural Knowledge Gateway.",
                "remediation_actions": remediation
            }

        elif target in ["nitrogen_management", "phosphorus_management"]:
            content = data.get("content", {})
            practices = content.get("management_practices", [])
            return {
                "type": "Nutrient Efficiency Advisory",
                "headline": f"{content.get('name', 'Nutrient')} Agronomic Management",
                "summary": content.get("importance", ""),
                "best_practices": practices
            }

        elif target == "environmental_telemetry":
            return {
                "type": "Environmental Telemetry",
                "headline": f"Atmospheric Profile for {data.get('location')}",
                "summary": data.get("status_note", ""),
                "telemetry_source": data.get("source", "")
            }

        return None
