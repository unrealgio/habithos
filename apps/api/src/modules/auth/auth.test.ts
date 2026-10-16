import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { env } from "../../config/env";
import { db, pool } from "../../db/client";
import { users } from "../../db/schema";
import { SESSION_COOKIE } from "./session";

function getSessionCookie(response: request.Response): string | undefined {
  const cookies = response.get("Set-Cookie") ?? [];

  return cookies.find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
}

const validRegister = {
  email: "gio@example.com",
  password: "correct-horse",
  displayName: "Gio",
  timezone: "America/Sao_Paulo",
};

beforeEach(async () => {
  await db.delete(users);
});

afterAll(async () => {
  await pool.end();
});

describe("POST /api/auth/register", () => {
  it("creates the user and responds 201 with the public fields only", async () => {
    const response = await request(app).post("/api/auth/register").send(validRegister);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        email: "gio@example.com",
        displayName: "Gio",
        timezone: "America/Sao_Paulo",
      },
    });
    expect(response.text).not.toContain("password");
  });

  it("stores a bcrypt hash instead of the plain password", async () => {
    await request(app).post("/api/auth/register").send(validRegister);

    const [stored] = await db.select().from(users).where(eq(users.email, validRegister.email));

    expect(stored.passwordHash).not.toBe(validRegister.password);
    expect(stored.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(await compare(validRegister.password, stored.passwordHash)).toBe(true);
  });

  it("normalizes the email before saving", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validRegister, email: "  Gio@Example.COM " });

    expect(response.body.user.email).toBe("gio@example.com");
  });

  it("responds 409 when the email is already registered, ignoring case", async () => {
    await request(app).post("/api/auth/register").send(validRegister);

    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validRegister, email: "GIO@example.com", displayName: "Outro" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: { code: "EMAIL_TAKEN", message: "Este e-mail já está cadastrado." },
    });
    expect(await db.$count(users)).toBe(1);
  });

  it("responds 400 with field errors and saves nothing when the input is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validRegister, email: "gio@", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(Object.keys(response.body.error.fieldErrors)).toEqual(["email", "password"]);
    expect(await db.$count(users)).toBe(0);
  });

  it("logs the new user in with an httpOnly session cookie", async () => {
    const response = await request(app).post("/api/auth/register").send(validRegister);
    const cookie = getSessionCookie(response);

    expect(cookie).toBeDefined();
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).not.toContain("Secure");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(validRegister);
  });

  it("responds 200 with the user and a session cookie for valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: " GIO@example.com", password: validRegister.password });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("gio@example.com");
    expect(getSessionCookie(response)).toBeDefined();
  });

  it("responds 401 with the same message for a wrong password and an unknown email", async () => {
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: validRegister.email, password: "wrong-password" });
    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: validRegister.password });

    const expectedBody = {
      error: { code: "INVALID_CREDENTIALS", message: "E-mail ou senha incorretos." },
    };
    expect(wrongPassword.status).toBe(401);
    expect(wrongPassword.body).toEqual(expectedBody);
    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body).toEqual(expectedBody);
    expect(getSessionCookie(wrongPassword)).toBeUndefined();
  });
});

describe("GET /api/auth/me and POST /api/auth/logout", () => {
  const unauthenticatedBody = {
    error: { code: "UNAUTHENTICATED", message: "Faça login para continuar." },
  };

  it("responds 401 without a session cookie", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual(unauthenticatedBody);
  });

  it("returns the logged-in user and forgets them after logout", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/register").send(validRegister);

    const meResponse = await agent.get("/api/auth/me");
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.displayName).toBe("Gio");

    const logoutResponse = await agent.post("/api/auth/logout");
    expect(logoutResponse.status).toBe(204);

    const afterLogout = await agent.get("/api/auth/me");
    expect(afterLogout.status).toBe(401);
  });

  it("rejects a tampered token", async () => {
    const register = await request(app).post("/api/auth/register").send(validRegister);
    const token = getSessionCookie(register)?.split(";")[0].split("=")[1] ?? "";
    const tampered = `${token.slice(0, -2)}xx`;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${SESSION_COOKIE}=${tampered}`);

    expect(response.status).toBe(401);
  });

  it("rejects an expired token", async () => {
    const register = await request(app).post("/api/auth/register").send(validRegister);
    const expired = jwt.sign({}, env.JWT_SECRET, {
      subject: register.body.user.id,
      expiresIn: -10,
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${SESSION_COOKIE}=${expired}`);

    expect(response.status).toBe(401);
  });

  it("rejects a valid token whose user no longer exists", async () => {
    const register = await request(app).post("/api/auth/register").send(validRegister);
    const cookie = getSessionCookie(register)?.split(";")[0] ?? "";
    await db.delete(users);

    const response = await request(app).get("/api/auth/me").set("Cookie", cookie);

    expect(response.status).toBe(401);
  });
});
