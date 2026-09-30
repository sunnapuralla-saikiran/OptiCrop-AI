"""
OptiCropAI 2.0 - Field Action Plan & Advisory Service
Formulates actionable, categorized agricultural guidance for farmers and agronomists.
"""
from typing import Dict, Any, List

class AdvisoryService:
    @staticmethod
    def generate_action_plan(
        parameters: Dict[str, float],
        recommended_crop: str,
        soil_health: Dict[str, Any],
        risks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        actions = []

        ph = parameters.get("ph", 7.0)
        rainfall = parameters.get("rainfall", 100.0)
        humidity = parameters.get("humidity", 60.0)
        n = parameters.get("N", 50.0)
        p = parameters.get("P", 50.0)
        k = parameters.get("K", 50.0)

        # 1. SOIL CATEGORY
        if ph < 6.0:
            actions.append({
                "category": "SOIL",
                "issue": f"Acidic Soil Reaction (pH {ph})",
                "action": "Broadcast agricultural limestone or dolomite at 1.5 - 2.5 tonnes/ha according to buffering capacity.",
                "reason": "Neutralizes toxic soluble aluminum, raises base saturation, and enhances nutrient bioavailability.",
                "priority": "High"
            })
        elif ph > 8.0:
            actions.append({
                "category": "SOIL",
                "issue": f"Alkaline/Calcareous Soil Reaction (pH {ph})",
                "action": "Incorporate organic farmyard manure (FYM) along with gypsum and elemental sulfur.",
                "reason": "Lowers exchangeable sodium percentage and frees tied-up micronutrients (Fe, Zn).",
                "priority": "High"
            })
        else:
            actions.append({
                "category": "SOIL",
                "issue": "Optimal pH Maintenance",
                "action": "Preserve current soil physical structure with minimal tillage and crop residue retention.",
                "reason": "Soil reaction is well within prime buffer range (6.0 - 7.5).",
                "priority": "Routine"
            })

        # 2. WATER CATEGORY
        if rainfall > 200.0 and recommended_crop != "rice":
            actions.append({
                "category": "WATER",
                "issue": f"Excess Rainfall Volume ({rainfall} mm)",
                "action": "Carve out field perimeter drainage channels and cultivate on raised beds.",
                "reason": f"Prevents water stagnation and root rot in {recommended_crop.capitalize()}.",
                "priority": "Immediate"
            })
        elif rainfall < 60.0:
            actions.append({
                "category": "WATER",
                "issue": f"Low Precipitation ({rainfall} mm)",
                "action": "Install drip fertigation emitters or schedule furrow irrigations at critical growth stages.",
                "reason": "Ensures crop transpiration demand is met without depleting capillary soil moisture.",
                "priority": "High"
            })
        else:
            actions.append({
                "category": "WATER",
                "issue": "Moisture Regime Management",
                "action": "Follow standard crop-specific irrigation intervals according to soil moisture tensiometer readings.",
                "reason": "Water availability matches typical cultivation requirements.",
                "priority": "Medium"
            })

        # 3. NUTRIENTS CATEGORY
        if n < 40.0:
            actions.append({
                "category": "NUTRIENTS",
                "issue": f"Available Nitrogen Deficit ({n} kg/ha)",
                "action": "Apply balanced basal urea/ammonium sulfate complemented with top dressing at active tillering.",
                "reason": "Promotes vigorous leaf elongation and chlorophyll formation.",
                "priority": "High"
            })
        elif n > 90.0:
            actions.append({
                "category": "NUTRIENTS",
                "issue": f"High Nitrogen Reserve ({n} kg/ha)",
                "action": "Withhold supplementary nitrogen fertilizers; maintain balanced potassium applications.",
                "reason": "Guards against excessive vegetative rank growth and pathogen susceptibility.",
                "priority": "Medium"
            })

        if p < 30.0:
            actions.append({
                "category": "NUTRIENTS",
                "issue": f"Low Phosphorus Reserve ({p} kg/ha)",
                "action": "Place Single Super Phosphate (SSP) directly into seed furrow during sowing.",
                "reason": "Ensures immediate root contact for early seedling root branching.",
                "priority": "High"
            })

        if k < 30.0:
            actions.append({
                "category": "NUTRIENTS",
                "issue": f"Low Potassium ({k} kg/ha)",
                "action": "Apply Muriate of Potash (MOP) prior to final land preparation.",
                "reason": "Strengthens cellular walls and enhances vascular nutrient and sugar transport.",
                "priority": "Medium"
            })

        # 4. CROP PLANNING CATEGORY
        actions.append({
            "category": "CROP PLANNING",
            "issue": f"Target Crop Establishment ({recommended_crop.capitalize()})",
            "action": f"Procure certified high-germination seed stocks of recommended {recommended_crop.capitalize()} varieties adapted to your agro-climatic zone.",
            "reason": "Certified seed ensures disease resistance, varietal purity, and uniform canopy stand.",
            "priority": "High"
        })

        # 5. MONITORING CATEGORY
        if humidity > 80.0:
            actions.append({
                "category": "MONITORING",
                "issue": f"High Atmospheric Humidity ({humidity}%)",
                "action": "Conduct bi-weekly scoutings of lower leaf surfaces for signs of fungal downy mildew, leaf blast, or rust.",
                "reason": "High humidity accelerates fungal spore germination.",
                "priority": "Immediate"
            })
        else:
            actions.append({
                "category": "MONITORING",
                "issue": "Field Health Surveillance",
                "action": "Inspect crop emergence 10-14 days post-sowing and test leaf color chart (LCC) for in-season nutrient tuning.",
                "reason": "Early detection of nutrient stress allows corrective foliar spray interventions.",
                "priority": "Routine"
            })

        return actions
