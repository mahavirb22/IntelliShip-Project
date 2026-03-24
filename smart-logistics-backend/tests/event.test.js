const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;
let app;
let token;
let shipmentId;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key";
  process.env.ALLOWED_ORIGINS = "http://localhost:5173";
  process.env.HIGH_EVENT_DAMAGE_THRESHOLD = "2";

  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  app = require("../server").app;

  await new Promise((resolve) => setTimeout(resolve, 800));

  const signup = await request(app).post("/api/auth/signup").send({
    name: "Event Seller",
    email: "event-seller@example.com",
    password: "strongpass123",
    role: "seller",
  });

  token = signup.body.token;

  const createShipment = await request(app)
    .post("/api/shipments")
    .set("Authorization", `Bearer ${token}`)
    .send({
      product_name: "Electronic Device",
      fragility_level: "High",
      customer_name: "Jane Customer",
      customer_email: "jane@example.com",
      customer_phone: "9123456780",
    });

  shipmentId = createShipment.body.shipment.shipment_id;

  await request(app)
    .post(`/api/shipments/${shipmentId}/start-monitoring`)
    .set("Authorization", `Bearer ${token}`)
    .send({});
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

describe("Event ingestion", () => {
  it("should mark shipment damaged after multiple high events", async () => {
    await request(app).post("/api/events").send({
      shipment_id: shipmentId,
      intensity: 90,
      risingEdges: 20,
      avgHigh: 120,
    });

    const second = await request(app).post("/api/events").send({
      shipment_id: shipmentId,
      intensity: 92,
      risingEdges: 22,
      avgHigh: 130,
    });

    expect(second.status).toBe(201);
    expect(second.body.shipment_status).toBe("DAMAGED");
    expect(second.body.shipment_condition).toBe("DAMAGED");
  });
});
