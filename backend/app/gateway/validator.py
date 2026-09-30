"""
OptiCropAI 2.0 - Tool Request Validator
Validates tool requests, parameters, and input schemas before execution.
"""
from typing import Dict, Any, Tuple, Optional
from .registry import ToolRegistry

class ToolValidator:
    def __init__(self, registry: ToolRegistry):
        self.registry = registry

    def validate_request(self, tool_name: str, arguments: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """
        Validates whether tool exists, is active, and parameters adhere to its contract.
        """
        if not tool_name or not isinstance(tool_name, str):
            return False, "Tool name must be a non-empty string."

        tool_def = self.registry.get_tool(tool_name)
        if not tool_def:
            return False, f"Tool '{tool_name}' is not registered in the Tool Gateway."

        if not tool_def.enabled:
            return False, f"Tool '{tool_name}' is currently disabled in the Tool Gateway."

        if not isinstance(arguments, dict):
            return False, f"Arguments for tool '{tool_name}' must be provided as a JSON key-value dictionary."

        # Validate against input_schema
        schema = tool_def.input_schema
        required_fields = schema.get("required", [])
        properties = schema.get("properties", {})

        for field in required_fields:
            if field not in arguments:
                return False, f"Missing required parameter '{field}' for tool '{tool_name}'."
            if arguments[field] is None or str(arguments[field]).strip() == "":
                return False, f"Parameter '{field}' cannot be empty for tool '{tool_name}'."

        # Optional type checking for schema properties
        for key, val in arguments.items():
            if key in properties:
                prop_type = properties[key].get("type")
                if prop_type == "string" and not isinstance(val, str):
                    return False, f"Parameter '{key}' must be of type string."
                elif prop_type == "number" and not isinstance(val, (int, float)):
                    return False, f"Parameter '{key}' must be a number."
                elif prop_type == "integer" and not isinstance(val, int):
                    return False, f"Parameter '{key}' must be an integer."
                elif prop_type == "boolean" and not isinstance(val, bool):
                    return False, f"Parameter '{key}' must be a boolean."

        return True, None
