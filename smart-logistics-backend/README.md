# IntelliShip Backend

Node/Express API for authentication, shipment lifecycle management, IoT event ingestion, analytics, and public tracking.

## Status Conventions

### Lifecycle (`shipment.status`)

- `CREATED`
- `PACKED`
- `IN_TRANSIT`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `DAMAGED`

### Condition (`shipment.condition`)

- `SAFE`
- `RISK`
- `DAMAGED`

## Key Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/verify`
- `POST /api/auth/logout`

### Shipments

- `POST /api/shipments`
- `PATCH /api/shipments/:id/status`
- `POST /api/shipments/:id/start-monitoring`
- `GET /api/shipments`
- `POST /api/shipments/track`
- `GET /api/shipments/:id`

### Events

- `POST /api/events`
- `GET /api/events/:shipment_id`

### Analytics

- `GET /api/analytics`

## Event Payload

```json
{
  "shipment_id": "SHIP12345678ABC12",
  "event_type": "VIBRATION",
  "severity": "HIGH",
  "intensity": 91.4,
  "pulseCount": 13,
  "maxHigh": 134,
  "totalHigh": 802,
  "risingEdges": 24,
  "avgHigh": 61.7
}
```

## Environment

Use `.env.example` and ensure:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ALLOWED_ORIGINS`
- `FRONTEND_BASE_URL`
- `RESEND_API_KEY`
- `ML_SERVICE_URL`
- `HIGH_EVENT_DAMAGE_THRESHOLD`
- `RATE_LIMIT`

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```
