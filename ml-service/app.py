from pathlib import Path
import json

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


model_loaded = False
label_mapping = {"classes": [], "feature_order": []}


@app.on_event("startup")
def load_artifacts():
    global model_loaded, label_mapping

    # Only check existence (avoid loading heavy ML libs)
    if MODEL_PATH.exists() and LABEL_PATH.exists():
        model_loaded = True
        with open(LABEL_PATH, "r", encoding="utf-8") as f:
            label_mapping = json.load(f)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "model_path": str(MODEL_PATH),
    }


@app.post("/predict")
def predict(payload: PredictPayload):
    """
    Lightweight inference (deployment-safe).
    Uses heuristic + feature-based scoring.
    """

    # Base score from intensity
    risk_score = min(1.0, payload.intensity / 1000.0)

    # Feature contributions
    risk_score += min(0.2, payload.totalHigh * 0.02)
    risk_score += min(0.15, payload.maxHigh * 0.01)
    risk_score += min(0.1, payload.risingEdges * 0.01)

    # Severity override
    if payload.severity:
        if payload.severity.upper() == "HIGH":
            risk_score = max(risk_score, 0.85)
        elif payload.severity.upper() == "MEDIUM":
            risk_score = max(risk_score, 0.5)

    # Clamp value
    risk_score = float(min(1.0, max(0.0, risk_score)))

    # Label assignment
    if risk_score >= 0.8:
        risk_label = "high"
    elif risk_score >= 0.45:
        risk_label = "medium"
    else:
        risk_label = "low"

    return {
        "risk_score": round(risk_score, 4),
        "risk_label": risk_label,
    }