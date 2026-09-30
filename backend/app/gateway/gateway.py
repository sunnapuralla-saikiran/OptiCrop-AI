"""
OptiCropAI 2.0 - Tool Gateway Facade
Central entry point and boundary controller governing all AI agent and API tool interactions.
"""
from typing import Dict, Any, List, Optional
from .registry import ToolRegistry
from .validator import ToolValidator
from .executor import ToolExecutor
from .schemas import ToolDefinition, ToolResponse

class ToolGateway:
    _instance = None

    def __init__(self):
        self.registry = ToolRegistry.get_instance()
        self.validator = ToolValidator(self.registry)
        self.executor = ToolExecutor(self.registry, self.validator)

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> ToolResponse:
        """Controlled execution of a tool via the gateway."""
        return self.executor.execute(tool_name, arguments)

    def list_tools(self, include_disabled: bool = False) -> List[Dict[str, Any]]:
        """Discovers all tools registered in the gateway."""
        return self.registry.list_tools(include_disabled)

    def get_tool_info(self, tool_name: str) -> Optional[Dict[str, Any]]:
        """Returns details for a specific registered tool."""
        tool = self.registry.get_tool(tool_name)
        if not tool:
            return None
        return {
            "name": tool.name,
            "description": tool.description,
            "category": tool.category,
            "enabled": tool.enabled,
            "input_schema": tool.input_schema,
            "output_schema": tool.output_schema
        }

    def register_tool(self, definition: ToolDefinition) -> None:
        """Registers a tool with the gateway."""
        self.registry.register(definition)

    def get_logs(self, limit: int = 50) -> List[dict]:
        """Returns audit execution history."""
        return self.executor.get_recent_logs(limit)
