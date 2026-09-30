"""
OptiCropAI 2.0 - Agent Execution Planner
Determines which external tools and knowledge lookups must be orchestrated through the Tool Gateway.
"""
from typing import Dict, Any, List
from .schemas import AgentPlanStep

class AgentPlanner:
    @staticmethod
    def create_plan(
        features: Dict[str, float],
        field_meta: Dict[str, Any],
        preliminary_crop: str
    ) -> List[AgentPlanStep]:
        steps = []
        step_id = 1

        # Step 1: Crop Specific Agronomic Profile via Tool Gateway
        steps.append(AgentPlanStep(
            step_id=step_id,
            action_type="tool_query",
            target="crop_agronomy",
            tool_name="crop_information",
            tool_arguments={"crop": preliminary_crop}
        ))
        step_id += 1

        # Step 2: In-depth Knowledge Lookup for Deviating Soil Nutrients
        ph = features.get("ph", 7.0)
        n = features.get("N", 50.0)
        p = features.get("P", 50.0)
        k = features.get("K", 50.0)

        if ph < 6.0 or ph > 8.0:
            steps.append(AgentPlanStep(
                step_id=step_id,
                action_type="tool_query",
                target="soil_ph_amelioration",
                tool_name="basic_information",
                tool_arguments={"topic": "ph"}
            ))
            step_id += 1

        if n < 40.0 or n > 90.0:
            steps.append(AgentPlanStep(
                step_id=step_id,
                action_type="tool_query",
                target="nitrogen_management",
                tool_name="basic_information",
                tool_arguments={"topic": "nitrogen"}
            ))
            step_id += 1

        if p < 30.0:
            steps.append(AgentPlanStep(
                step_id=step_id,
                action_type="tool_query",
                target="phosphorus_management",
                tool_name="basic_information",
                tool_arguments={"topic": "phosphorus"}
            ))
            step_id += 1

        # Step 3: Location or Weather Verification via Tool Gateway
        location = field_meta.get("location") or field_meta.get("district")
        if location:
            steps.append(AgentPlanStep(
                step_id=step_id,
                action_type="tool_query",
                target="environmental_telemetry",
                tool_name="weather",
                tool_arguments={
                    "location": location,
                    "manual_data": {
                        "temperature": features.get("temperature"),
                        "humidity": features.get("humidity"),
                        "rainfall": features.get("rainfall")
                    }
                }
            ))

        return steps
