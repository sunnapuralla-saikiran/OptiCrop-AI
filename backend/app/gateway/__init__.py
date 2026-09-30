"""
OptiCropAI 2.0 - Tool Gateway Package
"""
from .gateway import ToolGateway
from .schemas import ToolDefinition, ToolResponse
from ..tools.basic_information.tool import get_tool_definition as get_basic_info_def
from ..tools.crop_information.tool import get_tool_definition as get_crop_info_def
from ..tools.weather.tool import get_tool_definition as get_weather_def

def init_default_tools():
    """Initializes and registers standard agricultural decision tools."""
    gateway = ToolGateway.get_instance()
    gateway.register_tool(get_basic_info_def())
    gateway.register_tool(get_crop_info_def())
    gateway.register_tool(get_weather_def())

__all__ = ["ToolGateway", "ToolDefinition", "ToolResponse", "init_default_tools"]
