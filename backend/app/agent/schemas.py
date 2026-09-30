"""
OptiCropAI 2.0 - Agent Execution Schemas
"""
from dataclasses import dataclass, field
from typing import Dict, Any, Optional

@dataclass
class AgentPlanStep:
    step_id: int
    action_type: str
    target: str
    tool_name: str
    tool_arguments: Dict[str, Any] = field(default_factory=dict)
    rationale: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "step_id": self.step_id,
            "action_type": self.action_type,
            "target": self.target,
            "tool_name": self.tool_name,
            "tool_arguments": self.tool_arguments,
            "rationale": self.rationale,
        }
