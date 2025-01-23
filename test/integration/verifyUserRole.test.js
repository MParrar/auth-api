const supertest = require("supertest");
const { app } = require("../../src/app");
const pool = require("../../src/config/db");
const { generateToken } = require('../../src/utils/token');

const userData = {
    email: "roles@example.com",
    name: "Jane Doe",
    password: "Password123",
    role: "user",
    sessionToken: "mock-verify-token",
  };
  
  describe("User with 'user' role try to get a admin endpoint", () => {
    let userId;
    let token;
  
    beforeAll(async () => {
      const result = await pool.query(
        `
        INSERT INTO public.user (name, email, password, role, session_token)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `,
        [userData.name, userData.email, userData.password, userData.role, userData.sessionToken]
      );
  
      userId = result.rows[0].id;
      token = generateToken(userId, userData.role, userData.sessionToken);
    });
  
    afterAll(async () => {
      await pool.query(`DELETE FROM public.user WHERE id = $1;`, [userId]
      );
      await pool.end();
    });
  
  
      it("should return access denied for the user role", async () => {
        const {statusCode, body} = await supertest(app)
        .get("/api/admin/logs")
        .set("Authorization", `Bearer ${token}`);
  
        expect(statusCode).toBe(403);
        expect(body.message).toBe("Access Denied")
    
      });

  });
