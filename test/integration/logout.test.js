const supertest = require("supertest");
const { app } = require("../../src/app");
const pool = require("../../src/config/db");
const { generateToken } = require('../../src/utils/token');

const mockUser = {
    email: "logout@example.com",
    name: "Jane Doe",
    password: "Password123",
    role: "user",
    sessionToken: "mock-logout-token",
  };
  
  describe("POST /api/logout", () => {
    let userId;
    let token;
  
    beforeAll(async () => {
      const result = await pool.query(
        `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
        [mockUser.name, mockUser.email, mockUser.password, mockUser.role, mockUser.sessionToken]
      );
  
      userId = result.rows[0].id;
      token = generateToken(userId, mockUser.role, mockUser.sessionToken);
    });
  
    afterAll(async () => {
      await pool.query("TRUNCATE TABLE public.user RESTART IDENTITY CASCADE;");
      await pool.end();
    });
  
    describe("given a valid request", () => {
      it("should return a success message", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/api/logout")
          .set("Authorization", `Bearer ${token}`);
  
        expect(statusCode).toBe(200);
        expect(body.status).toEqual("success");
        expect(body.message).toEqual("User logout");
      });
    });
});
