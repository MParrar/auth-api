const supertest = require("supertest");
const { app } = require("../../src/app");
const pool = require("../../src/config/db");
const bcrypt = require("bcryptjs");

const mockUser = {
  email: "login@example.com",
  name: "Jane Doe",
  password: "Password123",
  role: "user",
  sessionToken: "mock-log-token",
};

describe("POST /api/login", () => {
  beforeAll(async () => {
    await pool.query(
      `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
      [
        mockUser.name,
        mockUser.email,
        await bcrypt.hash(mockUser.password, 10),
        mockUser.role,
        mockUser.sessionToken,
      ]
    );
  });

  afterAll(async () => {
    await pool.query("TRUNCATE TABLE public.user RESTART IDENTITY CASCADE;");
    await pool.end();
  });

  describe("Successfully login", () => {
    it("should return the token", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });
      expect(statusCode).toBe(200);
      expect(body.status).toEqual("success");
    });
  });
  describe("Wrong credentials", () => {
    it("should return an error", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/login")
        .send({
          email: mockUser.email,
          password: "BadPassword",
        });

      expect(statusCode).toBe(400);
      expect(body.message).toEqual("Email or password wrong");
    });
  });
});
