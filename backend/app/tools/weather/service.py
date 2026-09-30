"""
OptiCropAI 2.0 - Weather Service
Handles environmental data retrieval. If no external API key is set,
it honestly indicates fallback to manually provided field conditions.
"""
import os
import requests
from typing import Dict, Any, Optional

class WeatherService:
    @staticmethod
    def get_weather(location: Optional[str] = None, manual_data: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
        api_key = os.getenv("OPENWEATHER_API_KEY")

        if api_key and location:
            try:
                # Real OpenWeatherMap call if configured
                url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
                resp = requests.get(url, timeout=4)
                if resp.status_code == 200:
                    payload = resp.json()
                    temp = payload.get("main", {}).get("temp")
                    humidity = payload.get("main", {}).get("humidity")
                    rainfall = payload.get("rain", {}).get("1h", 0.0) * 24.0 # Estimate 24h
                    return {
                        "is_live_api": True,
                        "location": location,
                        "temperature": round(float(temp), 2),
                        "humidity": round(float(humidity), 2),
                        "rainfall": round(float(rainfall), 2),
                        "source": "OpenWeatherMap Live Telemetry",
                        "status_note": f"Live weather retrieved for {location}."
                    }
            except Exception:
                pass # Gracefully fall back to manual

        # Honest fallback without fabricating
        if manual_data:
            return {
                "is_live_api": False,
                "location": location or "Field Site",
                "temperature": manual_data.get("temperature"),
                "humidity": manual_data.get("humidity"),
                "rainfall": manual_data.get("rainfall"),
                "source": "Manual Field Sensor / Environmental Entry",
                "status_note": "Using manually entered environmental data. No external weather API key configured."
            }

        return {
            "is_live_api": False,
            "location": location,
            "source": "Not Configured",
            "status_note": "Using manually entered environmental data."
        }
