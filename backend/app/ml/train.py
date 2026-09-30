"""
OptiCropAI 2.0 - ML Training Pipeline
Evaluates candidate classifiers, selects best performing model, extracts empirical crop profiles,
and saves artifacts with full reproducibility.
"""
import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import cross_val_score

from .preprocessing import clean_and_prepare_dataset, split_and_scale_data, FEATURE_NAMES, TARGET_NAME
from .evaluate import evaluate_model_performance

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "models"))
DATA_RAW = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "raw", "crop_recommendation.csv"))

def compute_empirical_crop_profiles(df: pd.DataFrame) -> dict:
    """
    Computes statistical parameter profiles (min, 25%, mean, median, 75%, max, std)
    for each crop directly from the verified dataset.
    Used by the Explainable Recommendation Engine and Soil Health Service.
    """
    profiles = {}
    for crop_name, group in df.groupby(TARGET_NAME):
        crop_stats = {}
        for feature in FEATURE_NAMES:
            crop_stats[feature] = {
                "min": round(float(group[feature].min()), 2),
                "q25": round(float(group[feature].quantile(0.25)), 2),
                "mean": round(float(group[feature].mean()), 2),
                "median": round(float(group[feature].median()), 2),
                "q75": round(float(group[feature].quantile(0.75)), 2),
                "max": round(float(group[feature].max()), 2),
                "std": round(float(group[feature].std()), 2)
            }
        profiles[crop_name] = crop_stats
    return profiles

def train_and_select_best_model(csv_path: str = DATA_RAW):
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("[ML Pipeline] Cleaning and inspecting dataset...")
    df, clean_meta = clean_and_prepare_dataset(csv_path)

    print(f"[ML Pipeline] Processed {len(df)} valid records. Generating train/test splits...")
    (
        X_train_scaled,
        X_test_scaled,
        y_train,
        y_test,
        scaler,
        label_encoder,
        X_train_raw,
        X_test_raw
    ) = split_and_scale_data(df, test_size=0.2, random_state=42)

    target_names = list(label_encoder.classes_)

    # Candidate Models Dictionary
    candidates = {
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=12, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42),
        "GaussianNB": GaussianNB()
    }

    evaluations = {}
    best_model_name = None
    best_f1 = -1.0
    best_trained_estimator = None

    print("[ML Pipeline] Training and evaluating candidate models...")
    for name, model in candidates.items():
        # Fit on scaled train
        model.fit(X_train_scaled, y_train)

        # 5-fold cross-validation on train
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring="f1_weighted")
        mean_cv_f1 = float(np.mean(cv_scores))

        # Test set evaluation
        metrics = evaluate_model_performance(model, X_test_scaled, y_test, target_names)
        metrics["cv_f1_mean"] = round(mean_cv_f1, 4)
        evaluations[name] = metrics

        print(f" -> {name:18s} | Test Acc: {metrics['accuracy']:.4f} | Test F1 (weighted): {metrics['f1_weighted']:.4f} | CV F1: {mean_cv_f1:.4f}")

        if metrics["f1_weighted"] > best_f1:
            best_f1 = metrics["f1_weighted"]
            best_model_name = name
            best_trained_estimator = model

    print(f"[ML Pipeline] Champion Model selected: {best_model_name} with F1-Score: {best_f1:.4f}")

    # Compute empirical crop profiles for explainability
    crop_profiles = compute_empirical_crop_profiles(df)

    # Save artifacts
    model_artifact_path = os.path.join(MODEL_DIR, "crop_model.joblib")
    preprocessor_artifact_path = os.path.join(MODEL_DIR, "preprocessing_meta.joblib")
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    profiles_path = os.path.join(MODEL_DIR, "crop_profiles.json")

    joblib.dump(best_trained_estimator, model_artifact_path)
    joblib.dump({
        "scaler": scaler,
        "label_encoder": label_encoder,
        "feature_names": FEATURE_NAMES,
        "target_names": target_names,
        "model_name": best_model_name,
        "model_version": "2.0.0"
    }, preprocessor_artifact_path)

    with open(profiles_path, "w", encoding="utf-8") as f:
        json.dump(crop_profiles, f, indent=2)

    summary_metrics = {
        "champion_model": best_model_name,
        "version": "2.0.0",
        "dataset_metadata": clean_meta,
        "candidate_comparisons": evaluations,
        "champion_metrics": evaluations[best_model_name]
    }

    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(summary_metrics, f, indent=2)

    print(f"[ML Pipeline] All artifacts saved successfully in {MODEL_DIR}")
    return summary_metrics

if __name__ == "__main__":
    train_and_select_best_model()
