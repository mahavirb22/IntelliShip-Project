# 🚀 IntelliShip Backend - Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] Create `.env` file from `.env.example`
- [ ] Set `MONGO_URI` with MongoDB Atlas connection string
- [ ] Generate strong `JWT_SECRET` (use `openssl rand -base64 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with frontend domain(s)
- [ ] Verify no hardcoded credentials in code
- [ ] Ensure `.env` is in `.gitignore`

### ✅ MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create new cluster
- [ ] Create database user with password
- [ ] Whitelist IP addresses (or allow from anywhere for cloud deployment)
- [ ] Get connection string
- [ ] Test connection locally
- [ ] Verify database indexes are created (run app once to create)

### ✅ Code Quality

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Check for errors: No TypeScript/linting errors
- [ ] Verify all routes are working
- [ ] Test health check endpoint: `GET /health`
- [ ] Test ESP32 event endpoint: `POST /api/events`
- [ ] Verify authentication works
- [ ] Test pagination on events endpoint

### ✅ Security Hardening

- [ ] No hardcoded JWT secrets (should fail if `JWT_SECRET` not set)
- [ ] CORS configured with specific origins (not `*`)
- [ ] Request body size limited to 1MB
- [ ] Password hashing enabled (bcrypt)
- [ ] JWT tokens expire after 30 days
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info

### ✅ Performance Optimization

- [ ] Database indexes created:
  - Event: `{ shipment_id: 1, timestamp: -1 }`
  - Shipment: `{ shipment_id: 1 }`
  - Shipment: `{ seller_id: 1, created_at: -1 }`
- [ ] Pagination enabled on event listing
- [ ] MongoDB connection pooling configured
- [ ] Graceful shutdown implemented

---

## Deployment Steps (Render)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production-ready backend with security improvements"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your backend

### Step 3: Configure Build Settings

**General:**

- Name: `intelliship-backend`
- Branch: `main`
- Root Directory: `smart-logistics-backend`
- Runtime: `Node`

**Build & Deploy:**

- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**

- Choose "Free" for testing or "Starter" for production

### Step 4: Add Environment Variables

In Render dashboard, add these variables:

| Key               | Value                           | Example                                                   |
| ----------------- | ------------------------------- | --------------------------------------------------------- |
| `MONGO_URI`       | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/intelliship` |
| `JWT_SECRET`      | Random 32-byte base64 string    | Generate with `openssl rand -base64 32`                   |
| `NODE_ENV`        | `production`                    | `production`                                              |
| `ALLOWED_ORIGINS` | Frontend URL(s) comma-separated | `https://yourapp.com,https://www.yourapp.com`             |
| `PORT`            | Leave empty (Render sets this)  | -                                                         |

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Note the deployed URL: `https://intelliship-backend.onrender.com`

### Step 6: Verify Deployment

**Test Health Check:**

```bash
curl https://intelliship-backend.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-03-08T10:30:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

**Test Event Creation (ESP32):**

```bash
curl -X POST https://intelliship-backend.onrender.com/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_id": "SHIP001",
    "event_type": "Safe",
    "risingEdges": 2,
    "avgHigh": 45.5
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Event stored successfully",
  "event_id": "..."
}
```

---

## Post-Deployment Verification

### ✅ Health & Monitoring

- [ ] `/health` endpoint returns 200 OK
- [ ] Database connection status shows "connected"
- [ ] Server uptime is increasing
- [ ] No error logs in Render dashboard

### ✅ API Testing

- [ ] POST `/api/auth/signup` - Create test account
- [ ] POST `/api/auth/signin` - Login with test account
- [ ] POST `/api/shipments` - Create test shipment (with JWT token)
- [ ] GET `/api/shipments/:id` - Fetch shipment details
- [ ] POST `/api/events` - Send test event from ESP32
- [ ] GET `/api/events/:shipment_id` - Fetch events with pagination

### ✅ Frontend Integration

- [ ] Update frontend API base URL to deployed backend
- [ ] Test login/signup from frontend
- [ ] Test shipment creation from frontend
- [ ] Test shipment tracking from frontend
- [ ] Verify CORS is working (no browser errors)

### ✅ ESP32 Integration

- [ ] Update ESP32 firmware with deployed backend URL
- [ ] Test event sending from physical ESP32 device
- [ ] Verify events are stored in MongoDB
- [ ] Check shipment status updates correctly
- [ ] Monitor event rate and server performance

### ✅ Database Verification

- [ ] Login to MongoDB Atlas
- [ ] Check `intelliship` database exists
- [ ] Verify collections: `users`, `shipments`, `events`
- [ ] Check indexes are created (Performance tab)
- [ ] Monitor query performance
- [ ] Set up database alerts for errors

---

## MongoDB Atlas Setup (Detailed)

### 1. Create Cluster

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Choose AWS/GCP region closest to Render deployment
4. Cluster name: `intelliship-cluster`

### 2. Create Database User

1. Security → Database Access → Add New User
2. Authentication: Password
3. Username: `intelliship-admin`
4. Password: Generate strong password
5. Built-in Role: `Read and write to any database`

### 3. Network Access

1. Security → Network Access → Add IP Address
2. Option 1: Allow Access from Anywhere (0.0.0.0/0) - for cloud deployment
3. Option 2: Add specific Render IP addresses

### 4. Get Connection String

1. Click "Connect" on cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   ```
   mongodb+srv://intelliship-admin:<password>@intelliship-cluster.xxxxx.mongodb.net/intelliship?retryWrites=true&w=majority
   ```
5. Replace `<password>` with actual password
6. Replace `intelliship` with your database name

### 5. Verify Connection

Test locally before deploying:

```bash
# Set in .env
MONGO_URI=mongodb+srv://...

# Start server
npm start

# Should see: ✅ MongoDB Connected Successfully
```

---

## ESP32 Firmware Configuration

Update ESP32 code with deployed backend URL:

```cpp
// In arduino_code.ino
const char* serverUrl = "https://intelliship-backend.onrender.com/api/events";

void sendVibrationEvent(String shipmentId, String eventType, int edges, float avgHigh) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"shipment_id\":\"" + shipmentId + "\",";
  payload += "\"event_type\":\"" + eventType + "\",";
  payload += "\"risingEdges\":" + String(edges) + ",";
  payload += "\"avgHigh\":" + String(avgHigh);
  payload += "}";

  int httpCode = http.POST(payload);

  if(httpCode == 201) {
    Serial.println("✅ Event sent successfully");
  } else {
    Serial.println("❌ Error: " + String(httpCode));
  }

  http.end();
}
```

---

## Frontend Configuration

Update frontend API base URL:

```javascript
// src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://intelliship-backend.onrender.com/api";
```

Add to frontend `.env`:

```env
VITE_API_URL=https://intelliship-backend.onrender.com/api
```

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Check Render logs for errors
- [ ] Monitor MongoDB Atlas metrics
- [ ] Verify event ingestion rate
- [ ] Check API response times

### Weekly Checks

- [ ] Review MongoDB storage usage
- [ ] Check for failed API requests
- [ ] Review security logs
- [ ] Update dependencies if needed

### Monthly Checks

- [ ] Rotate JWT secrets (optional)
- [ ] Review database indexes
- [ ] Analyze query performance
- [ ] Check for MongoDB upgrades

---

## Troubleshooting

### Issue: Server won't start

**Symptom:** Render logs show "JWT_SECRET environment variable is not defined"

**Solution:**

1. Go to Render dashboard → Environment
2. Add `JWT_SECRET` variable
3. Trigger manual deploy

---

### Issue: Database connection failed

**Symptom:** Health check shows `database: "disconnected"`

**Solution:**

1. Check `MONGO_URI` is correct in Render env vars
2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
3. Test connection string locally
4. Check MongoDB Atlas cluster is running

---

### Issue: CORS error from frontend

**Symptom:** Browser console shows "blocked by CORS policy"

**Solution:**

1. Add frontend domain to `ALLOWED_ORIGINS` in Render
2. Format: `https://yourapp.com,https://www.yourapp.com`
3. No trailing slashes
4. Redeploy backend

---

### Issue: ESP32 events not storing

**Symptom:** ESP32 returns 400 or 404 error

**Solution:**

1. Check shipment exists in database
2. Verify ESP32 JSON format matches schema
3. Check event_type is "Safe", "Moderate", or "Severe"
4. Test with Postman/curl first

---

## Performance Benchmarks

Expected performance on Render Free/Starter tier:

| Operation       | Expected Time | Notes               |
| --------------- | ------------- | ------------------- |
| Health check    | < 100ms       | Simple response     |
| Create shipment | < 300ms       | With DB write       |
| Get shipment    | < 150ms       | Indexed query       |
| Store event     | < 200ms       | Fast insert         |
| Get events (50) | < 250ms       | Paginated, indexed  |
| Login           | < 400ms       | bcrypt hash compare |

If response times exceed 1 second:

- Check MongoDB Atlas region (should be close to Render)
- Verify indexes are created
- Consider upgrading Render instance type

---

## Security Best Practices

✅ **Implemented:**

- JWT authentication with 30-day expiration
- Password hashing with bcrypt (12 rounds)
- CORS whitelist (configurable origins)
- Request body size limits (1MB)
- Input validation on all fields
- Enum constraints on event types
- Environment variable configuration
- Graceful error handling

🔶 **Recommended Additions:**

- Rate limiting (100 requests/15 min per IP)
- Helmet.js for security headers
- Winston logger for production logging
- Redis caching for frequent queries
- API key authentication for ESP32 devices
- Request ID tracking for debugging
- MongoDB query monitoring

---

## Backup Strategy

### MongoDB Atlas Automatic Backups

Free tier (M0): No automatic backups
Paid tiers: Point-in-time restore available

**Manual Backup:**

```bash
# Export collections
mongodump --uri="mongodb+srv://..." --collection=shipments
mongodump --uri="mongodb+srv://..." --collection=events
mongodump --uri="mongodb+srv://..." --collection=users
```

**Restore:**

```bash
mongorestore --uri="mongodb+srv://..." --collection=shipments dump/
```

---

## Scaling Considerations

### When to Upgrade

**Render Instance:**

- Free tier: Good for testing, 100 requests/min
- Starter ($7/mo): Production, 500 requests/min
- Standard ($25/mo): High traffic, 2000+ requests/min

**MongoDB Atlas:**

- M0 (Free): 512MB storage, shared CPU
- M10 ($57/mo): 10GB storage, dedicated CPU
- M20 ($117/mo): 20GB storage, better performance

### Horizontal Scaling

For high-traffic scenarios:

1. Add load balancer (Render supports this)
2. Deploy multiple backend instances
3. Use Redis for session storage
4. Implement MongoDB replica sets
5. Add CDN for static assets

---

## 🎉 Deployment Complete!

Your IntelliShip backend is now production-ready and deployed!

**Next Steps:**

1. ✅ Update frontend with backend URL
2. ✅ Flash ESP32 with production URL
3. ✅ Create test shipments
4. ✅ Monitor logs for 24 hours
5. ✅ Set up MongoDB alerts
6. ✅ Document API for team

---

**Need Help?**

- Check Render logs: Dashboard → Logs
- MongoDB Atlas: Dashboard → Metrics
- API Testing: Use Postman collection
- Health Check: `https://your-backend.onrender.com/health`

**🚀 Good luck with your IoT logistics platform!**
