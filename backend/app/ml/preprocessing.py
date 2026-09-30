"""
OptiCropAI 2.0 - ML Preprocessing & Data Cleaning Pipeline
Implements rigorous data cleaning, validation, outlier profiling, scaling, and serialization.
"""
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET_NAME = "label"

def clean_and_prepare_dataset(csv_path: str):
    """
    Executes end-to-end data cleaning and verification pipeline on crop dataset.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")

    # 1. Load dataset
    df = pd.read_csv(csv_path)
    initial_rows = len(df)

    # 2. Check for null values
    null_counts = df.isnull().sum().to_dict()

    # 3. Deduplication
    df = df.drop_duplicates()
    duplicates_removed = initial_rows - len(df)

    # 4. Strip whitespace from target labels
    df[TARGET_NAME] = df[TARGET_NAME].astype(str).str.strip().str.lower()

    # 5. Type enforcement
    for col in FEATURE_NAMES:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Drop any row that failed numeric coercion
    df = df.dropna()

    # 6. Biological range sanity checks
    # N: [0, 200], P: [0, 200], K: [0, 300], temp: [0, 55], humidity: [5, 100], pH: [3, 10], rainfall: [0, 500]
    valid_mask = (
        (df["N"] >= 0) & (df["N"] <= 200) &
        (df["P"] >= 0) & (df["P"] <= 200) &
        (df["K"] >= 0) & (df["K"] <= 300) &
        (df["temperature"] >= 0) & (df["temperature"] <= 55) &
        (df["humidity"] >= 5) & (df["humidity"] <= 100) &
        (df["ph"] >= 3.0) & (df["ph"] <= 10.0) &
        (df["rainfall"] >= 0) & (df["rainfall"] <= 500)
    )
    df = df[valid_mask]

    # 7. Outlier analysis summary (IQR method for reporting)
    outlier_report = {}
    for col in FEATURE_NAMES:
        q25 = df[col].quantile(0.25)
        q75 = df[col].quantile(0.75)
        iqr = q75 - q25
        lower_bound = q25 - 1.5 * iqr
        upper_bound = q75 + 1.5 * iqr
        outlier_count = int(((df[col] < lower_bound) | (df[col] > upper_bound)).sum())
        outlier_report[col] = {
            "q25": float(q25),
            "q75": float(q75),
            "iqr": float(iqr),
            "outlier_count": outlier_count
        }

    # Save cleaned dataset to data/processed
    processed_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed"))
    os.makedirs(processed_dir, exist_ok=True)
    cleaned_path = os.path.join(processed_dir, "crop_recommendation_cleaned.csv")
    df.to_csv(cleaned_path, index=False)

    return df, {
        "initial_rows": initial_rows,
        "cleaned_rows": len(df),
        "duplicates_removed": duplicates_removed,
        "null_counts": null_counts,
        "outlier_report": outlier_report
    }

def split_and_scale_data(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """
    Splits features and target, fits StandardScaler and LabelEncoder.
    Returns:
        X_train_scaled, X_test_scaled, y_train_encoded, y_test_encoded, scaler, label_encoder
    """
    X = df[FEATURE_NAMES]
    y = df[TARGET_NAME]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=test_size, random_state=random_state, stratify=y_encoded
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return (
        X_train_scaled,
        X_test_scaled,
        y_train,
        y_test,
        scaler,
        label_encoder,
        X_train,
        X_test
    )
