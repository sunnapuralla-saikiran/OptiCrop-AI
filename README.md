# 🌾 OptiCropAI 2.0 — Precision Agricultural Decision Platform

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-black.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-orange.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> **"Analyze soil and environmental conditions and provide explainable crop recommendations, soil-health insights, risk analysis, and actionable agricultural guidance."**

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Objectives](#objectives)
4. [Key Features](#key-features)
5. [System Architecture](#system-architecture)
6. [Tool Gateway Architecture](#tool-gateway-architecture)
7. [Technology Stack](#technology-stack)
8. [Dataset & Data Cleaning Pipeline](#dataset--data-cleaning-pipeline)
9. [Machine Learning Engine & Benchmark](#machine-learning-engine--benchmark)
10. [Agricultural Analysis Agent](#agricultural-analysis-agent)
11. [Soil Health & Risk Engines](#soil-health--risk-engines)
12. [REST API Endpoints](#rest-api-endpoints)
13. [Project Structure](#project-structure)
14. [Installation & Setup](#installation--setup)
15. [Running the Application](#running-the-application)
16. [Automated Testing](#automated-testing)
17. [PDF Report Generation](#pdf-report-generation)

---

## 1. Project Overview

**OptiCropAI 2.0** is an enterprise-grade agricultural decision-support platform. Unlike superficial demos that treat crop recommendation as a simplistic black-box prediction, OptiCropAI 2.0 combines **Machine Learning classification**, **empirical physiological profile matching**, a **sandboxed Tool Gateway**, and an **Agricultural Reasoning Agent** to deliver trustworthy, actionable agronomic advice.

The platform answers four essential questions for any field:
1. **What crop is suitable?** (Multi-class Random Forest ML recommendation with genuine probability confidence)
2. **Why is it suitable?** (Empirical multi-factor compatibility percentages derived from physiological thresholds)
3. **What constraints exist in my soil or environment?** (Scientifically weighted Soil Health Index and 4-axis hazard risk matrix)
4. **What should I do next?** (Categorized 5-phase field action plan across Soil, Water, Nutrients, Crop Planning, and Monitoring)

---

## 2. Problem Statement

Conventional farming often relies on guesswork or rigid historical habits. Farmers frequently face:
- **Imbalanced fertilization**: Over-application of Nitrogen and under-application of Phosphorus or Potassium, leading to soil degradation, altered pH, and groundwater pollution.
- **Unpredictable climatic stress**: Planting water-intensive crops in drought-prone zones or sensitive crops without adequate drainage in high-rainfall belts.
- **Unexplainable advice**: Generic mobile apps that output a crop name with zero justification, zero nutrient analysis, and fabricated confidence scores.

---

## 3. Objectives

- **Scientific Rigor**: Use empirical agronomic reference thresholds (ICAR and FAO) rather than arbitrary hard-coded heuristics.
- **Zero Hallucination / Zero Fabrication**: Never display fake confidence percentages, fabricated statistics, or fictitious weather telemetry.
- **Sandboxed Agent Architecture**: Decouple the reasoning agent from internal tool implementations via a secure **Tool Gateway**.
- **Publication-Grade Dossiers**: Generate comprehensive PDF reports detailing field metadata, soil diagnostics, and action roadmaps.
- **Production-Ready Usability**: Responsive React 18 interface with interactive Recharts visualizations and complete SQLite persistence.

---

## 4. Key Features

- **Field Analysis Console**: Biological range validation for 7 parameters: Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Soil pH, Temperature, Humidity, and Rainfall.
- **Champion ML Classifier**: 99.55% test accuracy Random Forest classifier trained on 2,200 verified observation records.
- **Empirical Explainability**: Physiological match percentages calculated via $Z$-score distance from crop-specific empirical requirements.
- **Transparent Soil Health Index (SHI)**: Transparent weighted formula ($25\% S_N + 25\% S_P + 25\% S_K + 25\% S_{pH}$) with explicit nutrient deficiency/excess indicators.
- **Hazard & Risk Matrix**: Evaluates waterlogging, drought, heat stress, frost, fungal pathogen pressure, and soil salinity/acidification.
- **Categorized Field Action Plan**: Pragmatic steps divided into *Soil*, *Water*, *Nutrients*, *Crop Planning*, and *Monitoring*.
- **Tool Gateway with Audit Trail**: Sandboxed execution, schema contracts, and millisecond execution tracking.
- **Historical Archive & Analytics**: SQLite database with pagination, search, and dashboard crop frequency charts.
- **One-Click PDF Export**: Clean, styled PDF reports ready for print or farmer advisory sharing.

---

## 5. System Architecture

```
                         USER / FARMER
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │  (Vite + Tailwind CSS + Recharts)
                    └──────────┬──────────┘
                               │ REST / JSON
                               ▼
                    ┌─────────────────────┐
                    │  Flask REST API     │  (Modular Blueprints + CORS)
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Agricultural AI     │  (Coordinates Reasoning & Planning)
                    │      Agent          │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │ ML Prediction │  │  Soil Health  │  │  Risk Engine  │
    │ Random Forest │  │ Weighted Model│  │ 4 Hazard Axes │
    └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    TOOL GATEWAY     │  (Controlled Boundary & Audit Log)
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │ Basic Info    │  │ Crop Info     │  │ Weather Tool  │
    │     Tool      │  │     Tool      │  │ Live/Fallback │
    └───────┬───────┘  └───────┬───────┘  └───────────────┘
            │                  │
            ▼                  ▼
      JSON Reference      Empirical Crop
      Knowledge Base         Profiles
```

---

## 6. Tool Gateway Architecture

The **Tool Gateway** (`backend/app/gateway/`) establishes a controlled abstraction layer:
1. **Registry**: Maintains definitions, JSON schemas, and execution functions.
2. **Validator**: Enforces argument types and required fields before executing any tool.
3. **Sandboxed Executor**: Captures execution errors, calculates execution duration in milliseconds, and appends to an audit log.
4. **Controlled Access**: Prevents arbitrary Python code execution; only registered tools can be invoked.

### Registered Tools
- `basic_information`: Retrieves verified agronomic reference data (`nitrogen.json`, `phosphorus.json`, `potassium.json`, `ph.json`, `temperature.json`, `humidity.json`, `rainfall.json`, `crops.json`, `soil_concepts.json`).
- `crop_information`: Retrieves botanical taxonomy, duration, water demand, and empirical parameter ranges for 22 crops.
- `weather`: Honest telemetry handler that connects to live OpenWeatherMap if configured, or cleanly flags manual entry mode without fabricating data.

---

## 7. Technology Stack

| Domain | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend UI** | React | 18.x | Dynamic, componentized user interface |
| **Build Tool** | Vite | 6.x | High-speed frontend development & bundling |
| **Styling** | Tailwind CSS | 3.4.x | Agricultural design system & responsive layout |
| **Visualizations** | Recharts | 2.x | Parameter alignment & crop frequency charts |
| **Icons** | Lucide React | Latest | Clean, modern iconography |
| **Backend Server** | Python / Flask | 3.13 / 3.1 | Modular RESTful API with Blueprints |
| **Machine Learning** | scikit-learn | 1.4+ | Multi-class Random Forest & pipeline preprocessing |
| **Data Processing** | pandas & NumPy | Latest | Dataset cleaning, normalization & statistics |
| **Database** | SQLite + SQLAlchemy | 2.0+ | Relational history persistence |
| **Reporting** | ReportLab Platypus | 5.0+ | Automated PDF dossier compilation |

---

## 8. Dataset & Data Cleaning Pipeline

The system is trained on 2,200 verified observation records covering 22 crops (`data/raw/crop_recommendation.csv`):
- **Features**: `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall`
- **Target**: `label` (22 classes, 100 samples per class)

### Cleaning & Validation (`backend/app/ml/preprocessing.py`)
1. **Deduplication**: Verified zero duplicate records.
2. **Missing Values**: Verified zero missing/null values.
3. **Biological Range Filtering**: Enforced biological boundaries (e.g. pH in $[3.0, 10.0]$).
4. **IQR Outlier Profiling**: Quantiles (25%, 75%, IQR) computed for all 7 features.
5. **Preprocessing Serialization**: Standard scaling and label encodings saved to `models/preprocessing_meta.joblib`.

---

## 9. Machine Learning Engine & Benchmark

Candidate models were evaluated on an 80/20 stratified split with 5-fold cross-validation:

| Algorithm | Test Accuracy | Weighted F1 | 5-Fold CV F1 | Status |
|---|---|---|---|---|
| **Random Forest (100 trees)** | **99.55%** | **0.9955** | **0.9943** | **Selected Champion** |
| Gaussian Naive Bayes | 99.55% | 0.9954 | 0.9943 | Evaluated Candidate |
| Decision Tree (depth 12) | 97.95% | 0.9794 | 0.9828 | Evaluated Candidate |
| K-Nearest Neighbors ($k=5$) | 97.95% | 0.9793 | 0.9654 | Evaluated Candidate |
| Logistic Regression | 97.27% | 0.9725 | 0.9674 | Evaluated Candidate |

All artifacts (`crop_model.joblib`, `preprocessing_meta.joblib`, `metrics.json`, and `crop_profiles.json`) are stored in `models/`.

---

## 10. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System diagnostics, ML model status, and Tool Gateway health |
| `POST` | `/api/recommend` | Validates input, executes AI agent, and returns recommendation |
| `GET` | `/api/history` | Lists saved field analyses (supports `limit` and `offset`) |
| `GET` | `/api/history/stats` | Computes un-fabricated dashboard statistics |
| `GET` | `/api/history/<id>` | Retrieves full details for a single saved analysis |
| `DELETE`| `/api/history/<id>` | Deletes an analysis record from SQLite |
| `POST` | `/api/report` | Generates and streams publication-ready PDF dossier |
| `GET` | `/api/tools` | Discovers registered tools and their input/output schemas |
| `GET` | `/api/tools/<name>` | Returns detailed contract for a specific tool |
| `POST` | `/api/tools/execute` | Executes a tool strictly through the Tool Gateway |
| `GET` | `/api/tools/logs` | Retrieves Tool Gateway audit execution history |

---

## 11. Project Structure

```
OptiCropAI/
├── frontend/                        # React 18 + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/              # Navbar, Sidebar, Footer, etc.
│   │   ├── layouts/                 # AppLayout shell
│   │   ├── pages/                   # Landing, Dashboard, Analyze, Results, etc.
│   │   ├── services/                # Centralized api.js client
│   │   ├── App.jsx                  # React Router configuration
│   │   ├── main.jsx                 # React root entry
│   │   └── index.css                # Tailwind directives & theme
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                         # Flask Backend Platform
│   ├── app/
│   │   ├── __init__.py              # Application factory & CORS
│   │   ├── config.py                # Environment configuration
│   │   ├── routes/                  # Modular Flask Blueprints
│   │   ├── services/                # Recommendation, Soil Health, Risk, Advisory, Report
│   │   ├── agent/                   # Agent orchestrator, planner, schemas
│   │   ├── gateway/                 # Tool Gateway (Registry, Validator, Executor)
│   │   ├── tools/                   # Basic Info, Crop Info, Weather tools
│   │   ├── ml/                      # Preprocessing, Train, Predict, Evaluate
│   │   ├── database/                # SQLAlchemy models & repository
│   │   └── utils/                   # Thresholds, biological validators, helpers
│   ├── tests/                       # Automated pytest suite
│   ├── requirements.txt
│   └── run.py                       # Server entry point
│
├── data/
│   ├── raw/                         # Raw 2,200 row dataset & legacy backup
│   ├── processed/                   # Cleaned datasets
│   └── opticrop_2.db                # SQLite database
│
├── models/                          # Trained models, scalers, and empirical profiles
├── reports/                         # Generated PDF dossiers
├── docs/                            # Architectural documentation
├── .env.example
├── .gitignore
├── README.md
└── run_project.bat                  # One-click startup script
```

---

## 12. Installation & Setup

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.13)
- **Node.js**: Version 18+ (tested on Node 24.17)

### 1. Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 13. Running the Application

### Option A: Using the One-Click Script (Windows)
Double-click `run_project.bat` or run:
```cmd
.\run_project.bat
```

### Option B: Running Manually

**Terminal 1 — Backend Flask API:**
```bash
python backend/run.py
# Backend runs on http://127.0.0.1:5000
```

**Terminal 2 — Frontend Vite Server:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## 14. Automated Testing

Run the automated backend test suite using `pytest`:
```bash
python -m pytest backend/tests/test_backend.py -v
```

All 6 integration tests verify:
- Health check and Tool Gateway registry discovery
- Valid field payload recommendation and agent execution
- Biological range validation and rejection (e.g. impossible pH or Nitrogen)
- Missing parameter handling
- Tool Gateway discovery, schema inspection, and execution
- Analysis persistence, listing, detail view, PDF report compilation, and deletion.

---

## 15. PDF Report Generation

OptiCropAI 2.0 compiles formal agronomic dossiers using ReportLab:
- Custom styling with agricultural color palette (`forest`, `light_bg`)
- Field identification and executive summary
- Tabulated input parameters with unit indicators
- Recommendation rationale and empirical $Z$-score factors
- Soil Health Index (0-100) and nutrient breakdown
- 4-axis Hazard and Risk Matrix
- Categorized 5-phase field action plan.

Generated PDF reports are saved to `reports/` and can be downloaded directly from the **Results** or **History** interfaces.

---

## 16. Legacy Project Preservation

In compliance with project directives, the legacy application was completely backed up to:
`OptiCropAI_Legacy_Backup/`
The active project has been completely rebuilt from scratch into **OptiCropAI 2.0**.

