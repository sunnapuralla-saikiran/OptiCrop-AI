"""
OptiCropAI 2.0 - General Helpers
"""
import os
import json
from datetime import datetime

def format_timestamp(dt: datetime = None) -> str:
    """Returns ISO format or human readable timestamp."""
    if dt is None:
        dt = datetime.now()
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def get_project_root() -> str:
    """Returns absolute path to project root directory."""
    current_file = os.path.abspath(__file__)
    # backend/app/utils/helpers.py -> project root is 3 levels up
    return os.path.abspath(os.path.join(current_file, "..", "..", "..", ".."))

def load_json_file(file_path: str) -> dict:
    """Safe loading of JSON file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"JSON file not found at: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
