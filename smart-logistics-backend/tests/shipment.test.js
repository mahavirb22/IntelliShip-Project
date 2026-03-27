const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;
let app;
let token;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key";
  process.env.ALLOWED_ORIGINS = "http://localhost:5173";

  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  app = require("../server").app;

  await new Promise((resolve) => setTimeout(resolve, 800));

  const signup = await request(app).post("/api/auth/signup").send({
    name: "Shipment Seller",
    email: "shipment-seller@example.com",
    password: "strongpass123",
    role: "seller",
  });

  token = signup.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

describe("Shipment routes", () => {
  it("should create shipment with CREATED status history", async () => {
    const response = await request(app)
      .post("/api/shipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_name: "Glass Vase",
        device_id: "ESP32_TEST_001",
        fragility_level: "High",
        customer_name: "John Customer",
        customer_email: "john@example.com",
        customer_phone: "9876543210",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.shipment.status).toBe("CREATED");
    expect(response.body.shipment.statusHistory.length).toBe(1);
  });

  it("should release device only after post-delivery safe verification", async () => {
    const createResponse = await request(app)
      .post("/api/shipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        product_name: "Laptop",
        device_id: "ESP32_TEST_002",
        fragility_level: "High",
        customer_name: "Alice Customer",
        customer_email: "alice@example.com",
        customer_phone: "9123456781",
      });

    expect(createResponse.status).toBe(201);
    const shipmentId = createResponse.body.shipment.shipment_id;

    await request(app)
      .post(`/api/shipments/${shipmentId}/start-monitoring`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    await request(app)
      .patch(`/api/shipments/${shipmentId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "OUT_FOR_DELIVERY" });

    const deliveredResponse = await request(app)
      .patch(`/api/shipments/${shipmentId}/delivered`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(deliveredResponse.status).toBe(200);
    expect(deliveredResponse.body.data.status).toBe("DELIVERED");
    expect(deliveredResponse.body.data.active).toBe(true);
    expect(deliveredResponse.body.data.device_id).toBe("ESP32_TEST_002");

    const verifyResponse = await request(app)
      .patch(`/api/shipments/${shipmentId}/verify-safe`)
      .send({});

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.data.status).toBe("COMPLETED");
    expect(verifyResponse.body.data.verificationStatus).toBe("SAFE");
    expect(verifyResponse.body.data.active).toBe(false);
    expect(verifyResponse.body.data.device_id).toBeNull();
  });
});
