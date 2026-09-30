"""
OptiCropAI 2.0 - Tool Executor & Audit Logger
Executes registered tools in a sandboxed, timed, audited lifecycle.
"""
import time
import uuid
from typing import Dict, Any, List
from datetime import datetime
from .schemas import ToolResponse, ToolExecutionLog
from .registry import ToolRegistry
from .validator import ToolValidator

class ToolExecutor:
    def __init__(self, registry: ToolRegistry, validator: ToolValidator):
        self.registry = registry
        self.validator = validator
        self.logs: List[ToolExecutionLog] = []
        self.max_logs = 200

    def execute(self, tool_name: str, arguments: Dict[str, Any]) -> ToolResponse:
        start_time = time.perf_counter()
        exec_id = str(uuid.uuid4())[:8]

        # 1. Validation phase
        is_valid, validation_err = self.validator.validate_request(tool_name, arguments)
        if not is_valid:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            self._record_log(exec_id, tool_name, arguments, False, duration_ms, validation_err)
            return ToolResponse(
                success=False,
                tool=tool_name,
                error=validation_err,
                execution_time_ms=duration_ms
            )

        # 2. Execution phase
        tool_def = self.registry.get_tool(tool_name)
        try:
            raw_result = tool_def.executor_func(arguments)
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            self._record_log(exec_id, tool_name, arguments, True, duration_ms, None)
            return ToolResponse(
                success=True,
                tool=tool_name,
                data=raw_result,
                execution_time_ms=duration_ms
            )
        except Exception as e:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            err_msg = f"Tool execution failed: {str(e)}"
            self._record_log(exec_id, tool_name, arguments, False, duration_ms, err_msg)
            return ToolResponse(
                success=False,
                tool=tool_name,
                error=err_msg,
                execution_time_ms=duration_ms
            )

    def _record_log(self, exec_id: str, tool: str, args: dict, success: bool, duration_ms: float, error: str):
        log_entry = ToolExecutionLog(
            execution_id=exec_id,
            tool=tool,
            arguments=args,
            success=success,
            execution_time_ms=duration_ms,
            timestamp=datetime.now().isoformat(),
            error=error
        )
        self.logs.append(log_entry)
        if len(self.logs) > self.max_logs:
            self.logs.pop(0)

    def get_recent_logs(self, limit: int = 50) -> List[dict]:
        return [
            {
                "execution_id": l.execution_id,
                "tool": l.tool,
                "arguments": l.arguments,
                "success": l.success,
                "execution_time_ms": l.execution_time_ms,
                "timestamp": l.timestamp,
                "error": l.error
            }
            for l in reversed(self.logs[-limit:])
        ]
