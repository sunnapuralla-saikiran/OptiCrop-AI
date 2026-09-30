"""
OptiCropAI 2.0 - Centralized Agronomic Thresholds
Standard scientific agronomic reference ranges based on ICAR & FAO soil science classifications.
Centralizing these constants ensures single-source-of-truth across ML, Rule-Engine, Soil Health, and Agent.
"""

# Feature Ranges for Input Validation
FEATURE_BOUNDS = {
    "N": {"min": 0.0, "max": 200.0, "unit": "kg/ha", "label": "Nitrogen"},
    "P": {"min": 0.0, "max": 200.0, "unit": "kg/ha", "label": "Phosphorus"},
    "K": {"min": 0.0, "max": 300.0, "unit": "kg/ha", "label": "Potassium"},
    "temperature": {"min": 0.0, "max": 55.0, "unit": "°C", "label": "Temperature"},
    "humidity": {"min": 5.0, "max": 100.0, "unit": "%", "label": "Humidity"},
    "ph": {"min": 3.0, "max": 10.0, "unit": "pH scale", "label": "Soil pH"},
    "rainfall": {"min": 0.0, "max": 500.0, "unit": "mm", "label": "Rainfall"},
}

# Soil Nutrient Status Classifications (ICAR standard for Indian Agricultural Soils in kg/ha)
SOIL_NUTRIENT_THRESHOLDS = {
    "N": {
        "low_cutoff": 40.0,
        "high_cutoff": 90.0,
        "ideal_range": [40.0, 90.0],
        "units": "kg/ha",
        "deficiency_indicator": "Low available Nitrogen (<40 kg/ha). Stunted vegetative growth and chlorosis likely.",
        "sufficiency_indicator": "Adequate Nitrogen (40-90 kg/ha). Healthy leaf foliage and protein synthesis.",
        "excess_indicator": "Excessive Nitrogen (>90 kg/ha). Risk of delayed maturity and susceptibility to pests."
    },
    "P": {
        "low_cutoff": 30.0,
        "high_cutoff": 75.0,
        "ideal_range": [30.0, 75.0],
        "units": "kg/ha",
        "deficiency_indicator": "Low Phosphorus (<30 kg/ha). Restricted root establishment and poor flowering.",
        "sufficiency_indicator": "Optimal Phosphorus (30-75 kg/ha). Strong root system and reproductive energy transfer.",
        "excess_indicator": "High Phosphorus (>75 kg/ha). May hinder uptake of micro-nutrients like Zinc and Iron."
    },
    "K": {
        "low_cutoff": 30.0,
        "high_cutoff": 80.0,
        "ideal_range": [30.0, 80.0],
        "units": "kg/ha",
        "deficiency_indicator": "Low Potassium (<30 kg/ha). Reduced drought tolerance and weakened stalk strength.",
        "sufficiency_indicator": "Balanced Potassium (30-80 kg/ha). Robust stomatal regulation and disease resistance.",
        "excess_indicator": "High Potassium (>80 kg/ha). May induce Magnesium and Calcium deficiency."
    }
}

# Soil pH Classification (FAO standard)
SOIL_PH_THRESHOLDS = {
    "strongly_acidic": {"max": 5.5, "label": "Strongly Acidic", "risk": "High", "action": "Apply agricultural lime (calcium carbonate) to buffer acidity."},
    "moderately_acidic": {"min": 5.5, "max": 6.5, "label": "Slightly/Moderately Acidic", "risk": "Moderate", "action": "Monitor sensitivity of target crop; add organic compost."},
    "neutral_optimal": {"min": 6.5, "max": 7.5, "label": "Optimal Neutral", "risk": "Low", "action": "Maintain soil organic matter via balanced crop rotation."},
    "moderately_alkaline": {"min": 7.5, "max": 8.5, "label": "Moderately Alkaline", "risk": "Moderate", "action": "Apply gypsum and sulfur-enriched compost to reduce alkalinity."},
    "strongly_alkaline": {"min": 8.5, "label": "Strongly Alkaline / Sodic", "risk": "High", "action": "Implement gypsum remediation and improve soil drainage."}
}

# Environmental Stress Thresholds
CLIMATE_THRESHOLDS = {
    "temperature": {
        "frost_risk": 10.0,
        "optimal_min": 18.0,
        "optimal_max": 33.0,
        "heat_stress": 38.0
    },
    "humidity": {
        "arid_dry": 30.0,
        "optimal_min": 40.0,
        "optimal_max": 85.0,
        "fungal_risk": 88.0
    },
    "rainfall": {
        "drought_risk": 50.0,
        "semi_arid": 75.0,
        "moderate_optimal": 150.0,
        "waterlogging_risk": 220.0
    }
}
