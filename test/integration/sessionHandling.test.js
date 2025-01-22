const supertest = require("supertest");
const { app } = require("../../src/app");
const pool = require("../../src/config/db");
const { generateToken } = require('../../src/utils/token');

const mockUser = {
    email: "session@example.com",
    name: "Jane Doe",
    password: "Password123",
    role: "user",
    sessionToken: "mock-session-token",
  };
  
  describe("User with session request resource, after user logout then try again request the resource", () => {
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
  
    describe("given a valid token request profile, logout and ask again for the profile", () => {
      it("should return the user profile first and then a invalid token message", async () => {
        const profileResponse = await supertest(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
  
        expect(profileResponse.statusCode).toBe(200);
        expect(profileResponse.body.user).toEqual({
          id: userId,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        });
        const logoutResponse = await supertest(app)
        .post("/api/logout")
        .set("Authorization", `Bearer ${token}`);

        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body.status).toEqual("success");
        expect(logoutResponse.body.message).toEqual("User logout")

        const profileAfterLogoutResponse = await supertest(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
        expect(profileAfterLogoutResponse.statusCode).toBe(403);
        expect(profileAfterLogoutResponse.body.message).toBe("Invalid or expired session")
      });
    });

  });
