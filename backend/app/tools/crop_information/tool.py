"""
OptiCropAI 2.0 - Crop Information Tool Definition
"""
from typing import Dict, Any
from ...gateway.schemas import ToolDefinition
from .service import CropInformationService

TOOL_NAME = "crop_information"

INPUT_SCHEMA = {
    "type": "object",
    "required": ["crop"],
    "properties": {
        "crop": {
            "type": "string",
            "description": "Name of the crop to look up (e.g., 'rice', 'maize', 'chickpea', 'cotton', 'coffee', 'banana')"
        }
    }
}

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "crop": {"type": "string"},
        "agronomic_profile": {"type": "object"},
        "empirical_parameter_ranges": {"type": "object"},
        "source": {"type": "string"}
    }
}

def execute_crop_information_tool(arguments: Dict[str, Any]) -> Dict[str, Any]:
    crop = arguments.get("crop")
    return CropInformationService.get_crop_details(crop)

def get_tool_definition() -> ToolDefinition:
    return ToolDefinition(
        name=TOOL_NAME,
        description="Provides crop-specific agronomic requirements, botanical classification, growth duration, and statistical parameter profiles.",
        input_schema=INPUT_SCHEMA,
        output_schema=OUTPUT_SCHEMA,
        executor_func=execute_crop_information_tool,
        enabled=True,
        category="crop_science"
    )
