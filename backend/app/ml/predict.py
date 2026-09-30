"""
OptiCropAI 2.0 - ML Prediction Engine
Performs production inference using fitted scaler and champion classifier.
Extracts mathematically rigorous probability confidence and alternative candidates.
"""
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from .model_manager import ModelManager
from .preprocessing import FEATURE_NAMES

class CropPredictor:
    def __init__(self):
        self.manager = ModelManager.get_instance()

    def predict(self, input_features: Dict[str, float]) -> Dict[str, Any]:
        """
        Runs inference on validated input parameters.
        Returns:
            Dictionary containing recommended crop, confidence, alternatives, and model version.
        """
        model = self.manager.get_model()
        preprocessor = self.manager.get_preprocessor()

        scaler = preprocessor["scaler"]
        label_encoder = preprocessor["label_encoder"]
        target_names = preprocessor["target_names"]

        # Ensure exact feature order in a named DataFrame to preserve scaler feature names
        feature_df = pd.DataFrame([[input_features[feat] for feat in FEATURE_NAMES]], columns=FEATURE_NAMES)

        # Apply identical StandardScaler transformation
        scaled_vector = scaler.transform(feature_df)

        # Main prediction
        pred_encoded = model.predict(scaled_vector)[0]
        recommended_crop = label_encoder.inverse_transform([pred_encoded])[0]

        # Confidence & Alternative Crops extraction
        confidence = None
        confidence_pct = None
        alternatives = []

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(scaled_vector)[0]
            confidence = float(np.max(probabilities))
            confidence_pct = round(confidence * 100.0, 1)

            # Sort top indices descending
            top_indices = np.argsort(probabilities)[::-1]

            # Alternatives (top 2nd, 3rd, 4th if probability > 0.02)
            for idx in top_indices[1:4]:
                crop_label = target_names[idx]
                crop_prob = float(probabilities[idx])
                if crop_prob >= 0.01:
                    alternatives.append({
                        "crop": crop_label,
                        "probability": round(crop_prob, 4),
                        "confidence_percentage": round(crop_prob * 100.0, 1)
                    })

        return {
            "recommended_crop": recommended_crop,
            "confidence": round(confidence, 4) if confidence is not None else None,
            "confidence_percentage": confidence_pct,
            "alternatives": alternatives,
            "model_name": preprocessor.get("model_name", "RandomForest"),
            "model_version": preprocessor.get("model_version", "2.0.0")
        }
