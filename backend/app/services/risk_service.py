"""
OptiCropAI 2.0 - Risk Analysis Engine
Evaluates agricultural hazard levels across hydrological, nutritional, edaphic, and climatic vectors.
"""
from typing import Dict, Any, List
from ..utils.thresholds import CLIMATE_THRESHOLDS, SOIL_NUTRIENT_THRESHOLDS, SOIL_PH_THRESHOLDS

class RiskService:
    @staticmethod
    def assess_risks(parameters: Dict[str, float], recommended_crop: str = None) -> List[Dict[str, Any]]:
        risks = []

        rainfall = parameters.get("rainfall", 0.0)
        temp = parameters.get("temperature", 25.0)
        humidity = parameters.get("humidity", 60.0)
        ph = parameters.get("ph", 6.5)
        n = parameters.get("N", 50.0)
        p = parameters.get("P", 50.0)
        k = parameters.get("K", 50.0)

        # 1. Hydrological / Rainfall Risks
        if rainfall > CLIMATE_THRESHOLDS["rainfall"]["waterlogging_risk"]:
            risks.append({
                "category": "Water Management",
                "risk": "Severe Waterlogging / Root Hypoxia Risk",
                "severity": "High",
                "reason": f"Observed rainfall ({rainfall} mm) exceeds 220 mm. Saturated soil pore spaces induce root oxygen starvation for non-aquatic crops.",
                "action": "Ensure surface drainage trenches, create raised planting beds, or confirm target crop is flood-tolerant (e.g. rice)."
            })
        elif rainfall < CLIMATE_THRESHOLDS["rainfall"]["drought_risk"]:
            risks.append({
                "category": "Water Management",
                "risk": "Atmospheric & Soil Drought Hazard",
                "severity": "High",
                "reason": f"Observed precipitation ({rainfall} mm) is under 50 mm, presenting acute water deficit for vegetative growth.",
                "action": "Deploy micro-irrigation (drip/sprinkler) or apply organic mulch to retain soil profile moisture."
            })
        elif rainfall < CLIMATE_THRESHOLDS["rainfall"]["semi_arid"]:
            risks.append({
                "category": "Water Management",
                "risk": "Moderate Moisture Deficit",
                "severity": "Moderate",
                "reason": f"Rainfall level ({rainfall} mm) is in the semi-arid band (50-75 mm). Supplemental irrigation will be necessary at flowering.",
                "action": "Schedule timely supplemental irrigation during critical developmental stages."
            })

        # 2. Thermal / Climate Risks
        if temp >= CLIMATE_THRESHOLDS["temperature"]["heat_stress"]:
            risks.append({
                "category": "Climate & Temperature",
                "risk": "Extreme Heat Stress",
                "severity": "High",
                "reason": f"Temperature ({temp}°C) exceeds 38°C. Threatens pollen viability, accelerates transpiration, and triggers flower abortion.",
                "action": "Provide light evening irrigations to induce microclimate cooling; avoid midday chemical spraying."
            })
        elif temp <= CLIMATE_THRESHOLDS["temperature"]["frost_risk"]:
            risks.append({
                "category": "Climate & Temperature",
                "risk": "Chilling / Frost Injury Risk",
                "severity": "High",
                "reason": f"Temperature ({temp}°C) is below 10°C. Halts vegetative enzyme kinetics and risks chilling injury in warm-season crops.",
                "action": "Consider polytunnel covering or light smoke cover during coldest nocturnal hours."
            })

        # 3. Humidity / Disease Risks
        if humidity >= CLIMATE_THRESHOLDS["humidity"]["fungal_risk"]:
            risks.append({
                "category": "Pathogen & Climate",
                "risk": "Elevated Foliar Fungal Disease Pressure",
                "severity": "Moderate",
                "reason": f"High relative humidity ({humidity}%) combined with warm ambient conditions facilitates spore germination of rusts and blights.",
                "action": "Widen row spacing to facilitate canopy ventilation and apply preventative bio-fungicides."
            })
        elif humidity < CLIMATE_THRESHOLDS["humidity"]["arid_dry"]:
            risks.append({
                "category": "Pathogen & Climate",
                "risk": "Excessive Vapor Pressure Deficit (VPD)",
                "severity": "Low",
                "reason": f"Atmospheric humidity ({humidity}%) is dry (<30%), driving extreme evapotranspiration demand.",
                "action": "Monitor soil moisture tensiometers and irrigate to prevent leaf wilting."
            })

        # 4. Edaphic / pH Risks
        if ph < 5.5:
            risks.append({
                "category": "Edaphic / Soil Chemistry",
                "risk": "Severe Soil Acidification & Aluminum Toxicity",
                "severity": "High",
                "reason": f"Soil pH ({ph}) induces solubilization of toxic aluminum (Al3+) ions and immobilizes phosphorus.",
                "action": "Incorporate calibrated agricultural lime (calcium carbonate) 4 weeks prior to planting."
            })
        elif ph > 8.5:
            risks.append({
                "category": "Edaphic / Soil Chemistry",
                "risk": "High Soil Alkalinity & Sodic Dispersion",
                "severity": "High",
                "reason": f"Soil pH ({ph}) severely suppresses iron, zinc, and manganese bioavailability and impairs soil aggregation.",
                "action": "Apply agricultural gypsum with deep plowing and organic green manuring."
            })

        # 5. Nutritional Risks
        if n < SOIL_NUTRIENT_THRESHOLDS["N"]["low_cutoff"]:
            risks.append({
                "category": "Nutrient Deficiency",
                "risk": "Critical Nitrogen Depletion",
                "severity": "Moderate",
                "reason": f"Available Nitrogen ({n} kg/ha) is deficient for high-biomass crops.",
                "action": "Incorporate legume intercrops or split nitrogen fertilizer applications."
            })
        if p < SOIL_NUTRIENT_THRESHOLDS["P"]["low_cutoff"]:
            risks.append({
                "category": "Nutrient Deficiency",
                "risk": "Phosphorus Depletion / Poor Rooting",
                "severity": "Moderate",
                "reason": f"Phosphorus ({p} kg/ha) is inadequate for robust seedling root anchoring.",
                "action": "Apply band-placed basal phosphatic fertilizer or phosphate-solubilizing biofertilizer."
            })

        # If no severe hazards found, emit a low baseline status
        if not risks:
            risks.append({
                "category": "General Agronomy",
                "risk": "Favorable Environmental Profile",
                "severity": "Low",
                "reason": "All soil and atmospheric parameters fall within safe agronomic margins.",
                "action": "Follow standard crop cultivation protocol and maintain continuous crop surveillance."
            })

        return risks
