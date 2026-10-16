import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { db, pool } from "../../db/client";
import { users } from "../../db/schema";

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
});
