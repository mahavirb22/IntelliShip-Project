from pathlib import Path
import json

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "model_artifacts"
MODEL_PATH = ARTIFACTS_DIR / "decision_tree_model.joblib"
LABEL_PATH = ARTIFACTS_DIR / "label_mapping.json"

app = FastAPI(title="IntelliShip ML Inference Service", version="1.0.0")


class PredictPayload(BaseModel):
    intensity: float = Field(ge=0)
    pulseCount: float = Field(default=0, ge=0)
    maxHigh: float = Field(default=0, ge=0)
    totalHigh: float = Field(default=0, ge=0)
    risingEdges: float = Field(default=0, ge=0)
    avgHigh: float = Field(default=0, ge=0)
    severity: str | None = None


model = None
label_mapping = {"classes": [], "feature_order": []}


@app.on_event("startup")
def load_artifacts():
    global model, label_mapping

    if MODEL_PATH.exists() and LABEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        with open(LABEL_PATH, "r", encoding="utf-8") as f:
            label_mapping = json.load(f)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH),
    }


@app.post("/predict")
def predict(payload: PredictPayload):
    if model is None:
        # Fallback heuristic when artifact is not trained yet.
        fallback = min(1.0, payload.intensity / 100.0)
        return {
            "risk_score": round(float(fallback), 4),
            "risk_label": "high" if fallback >= 0.8 else "medium" if fallback >= 0.45 else "low",
            "source": "heuristic",
        }

    feature_order = label_mapping.get("feature_order", [])
    features = {
        "pulseCount": payload.pulseCount,
        "maxHigh": payload.maxHigh,
        "totalHigh": payload.totalHigh,
        "risingEdges": payload.risingEdges,
        "avgHigh": payload.avgHigh,
    }

    vector = np.array([[features.get(name, 0) for name in feature_order]], dtype=float)

    probabilities = model.predict_proba(vector)[0]
    predicted_idx = int(np.argmax(probabilities))
    classes = label_mapping.get("classes", [])
    predicted_label = classes[predicted_idx] if predicted_idx < len(classes) else "unknown"

    high_keywords = {"severe", "high", "critical", "damaged", "risk"}
    risk_score = max(
        float(probabilities[predicted_idx]),
        min(1.0, payload.intensity / 100.0),
    )

    if str(predicted_label).lower() in high_keywords:
        risk_score = max(risk_score, 0.8)

    if payload.severity and payload.severity.upper() == "HIGH":
        risk_score = max(risk_score, 0.85)

    if payload.severity and payload.severity.upper() == "MEDIUM":
        risk_score = max(risk_score, 0.45)

    risk_score = float(min(1.0, max(0.0, risk_score)))

    if risk_score >= 0.8:
        risk_label = "high"
    elif risk_score >= 0.45:
        risk_label = "medium"
    else:
        risk_label = "low"

    return {
        "risk_score": round(risk_score, 4),
        "risk_label": risk_label,
        "predicted_class": predicted_label,
        "source": "model",
    }
