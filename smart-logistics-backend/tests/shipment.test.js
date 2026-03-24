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
});
