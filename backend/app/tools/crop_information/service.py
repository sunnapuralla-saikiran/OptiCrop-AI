"""
OptiCropAI 2.0 - Crop Information Service
Combines agronomic cultivation parameters with empirical statistical ranges from the trained dataset.
"""
import os
import json
from typing import Dict, Any
from ...ml.model_manager import ModelManager

BASIC_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "basic_information", "data"))

class CropInformationService:
    @staticmethod
    def get_crop_details(crop: str) -> Dict[str, Any]:
        clean_crop = crop.strip().lower()

        # 1. Load agronomic profile from crops.json
        crops_path = os.path.join(BASIC_DATA_DIR, "crops.json")
        if not os.path.exists(crops_path):
            raise FileNotFoundError(f"Crops reference file not found at {crops_path}")

        with open(crops_path, "r", encoding="utf-8") as f:
            crops_catalog = json.load(f).get("crops", {})

        agronomic_info = crops_catalog.get(clean_crop)
        if not agronomic_info:
            available = list(crops_catalog.keys())
            raise ValueError(f"Crop '{crop}' not found in agronomic database. Available: {', '.join(sorted(available))}")

        # 2. Load empirical data distributions from model profiles
        manager = ModelManager.get_instance()
        empirical_profiles = manager.get_crop_profiles()
        empirical_stats = empirical_profiles.get(clean_crop, {})

        return {
            "crop": clean_crop,
            "agronomic_profile": agronomic_info,
            "empirical_parameter_ranges": empirical_stats,
            "source": "OptiCropAI Agronomic Knowledge & Statistical Model Profiles"
        }
