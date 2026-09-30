"""
OptiCropAI 2.0 - Soil Health Assessment Service
Scientific evaluation of soil fertility, nutrient stoichiometry, and soil reaction (pH).
Computes a scientifically defensible Soil Health Index (SHI) with full transparency.
"""
from typing import Dict, Any, List
from ..utils.thresholds import SOIL_NUTRIENT_THRESHOLDS, SOIL_PH_THRESHOLDS

class SoilHealthService:
    @staticmethod
    def assess_soil_health(parameters: Dict[str, float]) -> Dict[str, Any]:
        """
        Analyzes N, P, K, and pH to produce nutrient status, concerns, and Soil Health Index.
        Formula for Soil Health Index (0 - 100):
            SHI = 25 * S_N + 25 * S_P + 25 * S_K + 25 * S_pH
        Where S_x is a normalized score in [0.0, 1.0] representing proximity to optimal agronomic range.
        """
        n_val = parameters.get("N", 0.0)
        p_val = parameters.get("P", 0.0)
        k_val = parameters.get("K", 0.0)
        ph_val = parameters.get("ph", 7.0)

        # 1. Nutrient Status Evaluation
        nutrients = {}
        concerns = []
        suggestions = []

        # Nitrogen Score
        n_cfg = SOIL_NUTRIENT_THRESHOLDS["N"]
        if n_val < n_cfg["low_cutoff"]:
            n_status = "Low"
            n_score = max(0.2, n_val / n_cfg["low_cutoff"])
            concerns.append("Soil is deficient in available Nitrogen. Vegetative growth and chlorophyll formation will be constrained.")
            suggestions.append("Apply nitrogenous fertilizers (e.g. neem-coated urea) in split basal and top-dressing doses, or incorporate legume green manures.")
        elif n_val > n_cfg["high_cutoff"]:
            n_status = "High"
            n_score = max(0.5, 1.0 - (n_val - n_cfg["high_cutoff"]) / 100.0)
            concerns.append("Soil possesses high Nitrogen concentrations. Risk of excessive foliage, crop lodging, and delayed maturity.")
            suggestions.append("Curtail synthetic nitrogen inputs to reduce vegetative lodging and groundwater nitrate leaching.")
        else:
            n_status = "Optimal"
            n_score = 1.0

        nutrients["N"] = {
            "value": n_val,
            "unit": "kg/ha",
            "status": n_status,
            "score": round(n_score, 2),
            "ideal_range": f"{n_cfg['low_cutoff']} - {n_cfg['high_cutoff']} kg/ha",
            "description": n_cfg["deficiency_indicator"] if n_status == "Low" else (n_cfg["excess_indicator"] if n_status == "High" else n_cfg["sufficiency_indicator"])
        }

        # Phosphorus Score
        p_cfg = SOIL_NUTRIENT_THRESHOLDS["P"]
        if p_val < p_cfg["low_cutoff"]:
            p_status = "Low"
            p_score = max(0.2, p_val / p_cfg["low_cutoff"])
            concerns.append("Phosphorus availability is sub-optimal. Root establishment and early flowering vigor will be hindered.")
            suggestions.append("Apply Single Superphosphate (SSP) or DAP as a basal band near the seed furrow.")
        elif p_val > p_cfg["high_cutoff"]:
            p_status = "High"
            p_score = max(0.6, 1.0 - (p_val - p_cfg["high_cutoff"]) / 100.0)
            concerns.append("Elevated phosphorus levels may antagonize micronutrient assimilation (specifically Zinc and Iron).")
            suggestions.append("Omit supplemental phosphorus fertilizers; conduct foliar testing for Zinc deficiency.")
        else:
            p_status = "Optimal"
            p_score = 1.0

        nutrients["P"] = {
            "value": p_val,
            "unit": "kg/ha",
            "status": p_status,
            "score": round(p_score, 2),
            "ideal_range": f"{p_cfg['low_cutoff']} - {p_cfg['high_cutoff']} kg/ha",
            "description": p_cfg["deficiency_indicator"] if p_status == "Low" else (p_cfg["excess_indicator"] if p_status == "High" else p_cfg["sufficiency_indicator"])
        }

        # Potassium Score
        k_cfg = SOIL_NUTRIENT_THRESHOLDS["K"]
        if k_val < k_cfg["low_cutoff"]:
            k_status = "Low"
            k_score = max(0.2, k_val / k_cfg["low_cutoff"])
            concerns.append("Potassium levels are low. Plant stomatal conductance, water stress resistance, and stem strength are reduced.")
            suggestions.append("Apply Muriate of Potash (MOP) or organic potassium-rich biomass compost.")
        elif k_val > k_cfg["high_cutoff"]:
            k_status = "High"
            k_score = max(0.6, 1.0 - (k_val - k_cfg["high_cutoff"]) / 150.0)
            concerns.append("High potassium concentration can suppress plant uptake of divalent cations (Calcium and Magnesium).")
            suggestions.append("Moderate potash applications and ensure adequate soil moisture to buffer osmotic potential.")
        else:
            k_status = "Optimal"
            k_score = 1.0

        nutrients["K"] = {
            "value": k_val,
            "unit": "kg/ha",
            "status": k_status,
            "score": round(k_score, 2),
            "ideal_range": f"{k_cfg['low_cutoff']} - {k_cfg['high_cutoff']} kg/ha",
            "description": k_cfg["deficiency_indicator"] if k_status == "Low" else (k_cfg["excess_indicator"] if k_status == "High" else k_cfg["sufficiency_indicator"])
        }

        # 2. pH Evaluation
        if ph_val < 5.5:
            ph_category = "Strongly Acidic"
            ph_score = max(0.2, ph_val / 5.5)
            concerns.append(f"Soil pH ({ph_val}) is strongly acidic. Heavy metal toxicity (Al, Mn) and phosphorus fixation are prevalent.")
            suggestions.append(SOIL_PH_THRESHOLDS["strongly_acidic"]["action"])
        elif ph_val < 6.5:
            ph_category = "Moderately Acidic"
            ph_score = 0.8
            suggestions.append(SOIL_PH_THRESHOLDS["moderately_acidic"]["action"])
        elif ph_val <= 7.5:
            ph_category = "Neutral / Optimal"
            ph_score = 1.0
            suggestions.append(SOIL_PH_THRESHOLDS["neutral_optimal"]["action"])
        elif ph_val <= 8.5:
            ph_category = "Moderately Alkaline"
            ph_score = 0.8
            concerns.append(f"Soil pH ({ph_val}) is moderately alkaline. Micronutrients such as Fe, Mn, Zn, and Cu become less soluble.")
            suggestions.append(SOIL_PH_THRESHOLDS["moderately_alkaline"]["action"])
        else:
            ph_category = "Strongly Alkaline / Sodic"
            ph_score = max(0.2, 1.0 - (ph_val - 8.5) / 2.0)
            concerns.append(f"Soil pH ({ph_val}) indicates sodic or saline conditions. Soil flocculation and hydraulic conductivity are impaired.")
            suggestions.append(SOIL_PH_THRESHOLDS["strongly_alkaline"]["action"])

        ph_status_dict = {
            "value": ph_val,
            "category": ph_category,
            "score": round(ph_score, 2),
            "ideal_range": "6.5 - 7.5",
            "action": suggestions[-1] if suggestions else "Maintain current soil management."
        }

        # 3. Overall Soil Health Index Calculation
        # Weighted aggregate: N (25%) + P (25%) + K (25%) + pH (25%)
        shi_raw = (n_score * 0.25 + p_score * 0.25 + k_score * 0.25 + ph_score * 0.25) * 100.0
        shi = round(min(100.0, max(0.0, shi_raw)), 1)

        if shi >= 85:
            grade = "Excellent Fertility"
        elif shi >= 70:
            grade = "Good / Productive"
        elif shi >= 50:
            grade = "Moderate / Needs Amelioration"
        else:
            grade = "Degraded / Significant Deficiencies"

        return {
            "soil_health_index": shi,
            "health_grade": grade,
            "calculation_basis": "Weighted Agronomic Fertility Model: 25% N + 25% P + 25% K + 25% pH alignment with ICAR/FAO reference ranges.",
            "nutrients": nutrients,
            "ph_status": ph_status_dict,
            "concerns": concerns,
            "actionable_suggestions": suggestions
        }
