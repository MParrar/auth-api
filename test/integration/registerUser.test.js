const supertest = require("supertest");
const { app } = require("../../src/app");
const pool = require("../../src/config/db");

const userInput = {
  email: "register@example.com",
  name: "Jane Doe",
  password: "Password123",
  role: "user",
};

describe("POST /api/users/register", () => {
  afterAll(async () => {
    await pool.query("TRUNCATE TABLE public.user");
    await pool.end();
  });
  describe("user registration", () => {
    describe("given the email, name, password and role are valid", () => {
      it("should return the user payload", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/api/users/register")
          .send(userInput);

        expect(statusCode).toBe(201);
        expect(body.user.id).toEqual(expect.any(Number));
        expect(body.user.email).toEqual(userInput.email);
        expect(body.user.name).toEqual(userInput.name);
      });
    });
  });
  describe("given an empty payload", () => {
    it("should return a 400", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/users/register")
        .send({});
        expect(statusCode).toBe(400);
        expect(body.status).toEqual("error");
        expect(body.message).toEqual("You need to provide name, email and password");
    });
  });
  describe("given an short password", () => {
    it("should return a 400", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/users/register")
        .send({
            ...userInput,
            password: '1234567'
        });
        expect(statusCode).toBe(400);
        expect(body.status).toEqual("error");
        expect(body.message).toEqual("The password must contain at least 8 characters");
    });
  });
});