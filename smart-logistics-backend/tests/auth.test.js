const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret-key";
  process.env.ALLOWED_ORIGINS = "http://localhost:5173";

  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  app = require("../server").app;

  await new Promise((resolve) => setTimeout(resolve, 800));
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

describe("Auth routes", () => {
  it("should signup and return token", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "Seller One",
      email: "seller1@example.com",
      password: "strongpass123",
      role: "seller",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe("seller");
  });

  it("should signin and return token", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Seller Two",
      email: "seller2@example.com",
      password: "strongpass123",
      role: "seller",
    });

    const response = await request(app).post("/api/auth/signin").send({
      email: "seller2@example.com",
      password: "strongpass123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
