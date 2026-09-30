"""
OptiCropAI 2.0 - Input Validation Engine
Validates payload data types, presence, and physiological biological bounds.
"""
from typing import Dict, Any, Tuple, List
from .thresholds import FEATURE_BOUNDS

REQUIRED_FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

def validate_soil_environment_input(data: Dict[str, Any]) -> Tuple[bool, List[str], Dict[str, float]]:
    """
    Validates the 7 soil and climate parameters.
    Returns:
        (is_valid, error_list, cleaned_numerical_data)
    """
    errors = []
    cleaned = {}

    if not isinstance(data, dict):
        return False, ["Payload must be a JSON object."], {}

    for feature in REQUIRED_FEATURES:
        if feature not in data:
            errors.append(f"Missing required parameter: '{feature}'.")
            continue

        raw_val = data[feature]
        if raw_val is None or str(raw_val).strip() == "":
            errors.append(f"Parameter '{feature}' cannot be empty.")
            continue

        try:
            val = float(raw_val)
        except (ValueError, TypeError):
            errors.append(f"Parameter '{feature}' must be a numeric value, got: '{raw_val}'.")
            continue

        bounds = FEATURE_BOUNDS.get(feature)
        if bounds:
            if val < bounds["min"] or val > bounds["max"]:
                errors.append(
                    f"Parameter '{feature}' ({bounds['label']}) value {val} is outside realistic biological range "
                    f"[{bounds['min']} - {bounds['max']} {bounds['unit']}]."
                )
            else:
                cleaned[feature] = round(val, 2)

    is_valid = len(errors) == 0
    return is_valid, errors, cleaned
