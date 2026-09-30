"""
OptiCropAI 2.0 - Basic Information Tool Definition
Registers the Basic Information Tool with the Tool Gateway.
"""
from typing import Dict, Any
from ...gateway.schemas import ToolDefinition
from .service import BasicInformationService

TOOL_NAME = "basic_information"

INPUT_SCHEMA = {
    "type": "object",
    "required": ["topic"],
    "properties": {
        "topic": {
            "type": "string",
            "description": "Agricultural topic or nutrient to look up (e.g., 'nitrogen', 'phosphorus', 'potassium', 'ph', 'temperature', 'humidity', 'rainfall', 'crops', 'soil_concepts')"
        }
    }
}

OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "topic": {"type": "string"},
        "source": {"type": "string"},
        "content": {"type": "object"}
    }
}

def execute_basic_information_tool(arguments: Dict[str, Any]) -> Dict[str, Any]:
    topic = arguments.get("topic")
    return BasicInformationService.get_information(topic)

def get_tool_definition() -> ToolDefinition:
    return ToolDefinition(
        name=TOOL_NAME,
        description="Provides verified agronomic knowledge and definitions for soil nutrients, pH, climatic variables, and concepts.",
        input_schema=INPUT_SCHEMA,
        output_schema=OUTPUT_SCHEMA,
        executor_func=execute_basic_information_tool,
        enabled=True,
        category="knowledge_base"
    )
