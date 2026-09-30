"""
OptiCropAI 2.0 - Basic Information Tool Service
Retrieves verified agronomic reference data from controlled JSON knowledge stores.
Separates data access from tool execution logic.
"""
import os
import json
from typing import Dict, Any

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))

TOPIC_FILE_MAP = {
    "nitrogen": "nitrogen.json",
    "n": "nitrogen.json",
    "phosphorus": "phosphorus.json",
    "p": "phosphorus.json",
    "potassium": "potassium.json",
    "k": "potassium.json",
    "ph": "ph.json",
    "soil_ph": "ph.json",
    "temperature": "temperature.json",
    "temp": "temperature.json",
    "humidity": "humidity.json",
    "rainfall": "rainfall.json",
    "precipitation": "rainfall.json",
    "soil_concepts": "soil_concepts.json",
    "crops": "crops.json"
}

class BasicInformationService:
    @staticmethod
    def get_information(topic: str) -> Dict[str, Any]:
        """
        Retrieves verified reference data for agricultural topic.
        """
        clean_topic = topic.strip().lower()
        file_name = TOPIC_FILE_MAP.get(clean_topic)

        if not file_name:
            available_topics = list(set(TOPIC_FILE_MAP.keys()))
            raise ValueError(f"Topic '{topic}' is not in the verified reference database. Available topics: {', '.join(sorted(available_topics))}")

        file_path = os.path.join(DATA_DIR, file_name)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Knowledge asset missing for topic '{clean_topic}' at {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return {
            "topic": clean_topic,
            "source": "OptiCropAI Scientific Reference Knowledge Store",
            "reference_file": file_name,
            "content": data
        }
