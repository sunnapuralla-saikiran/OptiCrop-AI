"""
OptiCropAI 2.0 - Weather Tool Definition
"""
from typing import Dict, Any
from ...gateway.schemas import ToolDefinition
from .service import WeatherService

TOOL_NAME = "weather"

INPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "location": {"type": "string", "description": "City or field location name."},
        "manual_data": {"type": "object", "description": "Manual environmental readings fallback."}
    }
}

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "is_live_api": {"type": "boolean"},
        "location": {"type": "string"},
        "temperature": {"type": "number"},
        "humidity": {"type": "number"},
        "rainfall": {"type": "number"},
        "source": {"type": "string"},
        "status_note": {"type": "string"}
    }
}

def execute_weather_tool(arguments: Dict[str, Any]) -> Dict[str, Any]:
    return WeatherService.get_weather(
        location=arguments.get("location"),
        manual_data=arguments.get("manual_data")
    )

def get_tool_definition() -> ToolDefinition:
    return ToolDefinition(
        name=TOOL_NAME,
        description="Retrieves live telemetry or verified manual environmental parameters for the field site.",
        input_schema=INPUT_SCHEMA,
        output_schema=OUTPUT_SCHEMA,
        executor_func=execute_weather_tool,
        enabled=True,
        category="meteorology"
    )
