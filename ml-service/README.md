# IntelliShip ML Service

FastAPI microservice for shipment vibration risk inference.

## Endpoints

- `GET /health`
- `POST /predict`

## Run

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Predict Payload

```json
{
  "intensity": 88,
  "pulseCount": 10,
  "maxHigh": 120,
  "totalHigh": 630,
  "risingEdges": 23,
  "avgHigh": 63,
  "severity": "HIGH"
}
```

Backend integration uses `ML_SERVICE_URL`, for example:

```env
ML_SERVICE_URL=http://localhost:8000
```
