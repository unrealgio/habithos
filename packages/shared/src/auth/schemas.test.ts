import { describe, expect, it } from "vitest";
import { z } from "zod";
import { loginSchema, registerSchema } from "./schemas";

const validRegister = {
  email: "gio@example.com",
  password: "correct-horse",
  displayName: "Gio",
  timezone: "America/Sao_Paulo",
};

function getFieldErrors(input: unknown) {
  const result = registerSchema.safeParse(input);

  return result.success ? {} : z.flattenError(result.error).fieldErrors;
}

describe("registerSchema", () => {
  it("accepts valid input", () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
  });

  it("trims and lowercases the email", () => {
    const result = registerSchema.parse({ ...validRegister, email: "  Gio@Example.COM " });

    expect(result.email).toBe("gio@example.com");
  });

  it("rejects an invalid email", () => {
    expect(getFieldErrors({ ...validRegister, email: "gio@" })).toEqual({
      email: ["Informe um e-mail válido."],
    });
  });

  it("requires a password with at least 8 characters", () => {
    expect(getFieldErrors({ ...validRegister, password: "1234567" })).toEqual({
      password: ["A senha deve ter pelo menos 8 caracteres."],
    });
  });

  it("limits the password to 72 bytes, counting accented letters as 2 bytes", () => {
    expect(registerSchema.safeParse({ ...validRegister, password: "a".repeat(72) }).success).toBe(
      true,
    );
    expect(registerSchema.safeParse({ ...validRegister, password: "é".repeat(36) }).success).toBe(
      true,
    );
    expect(getFieldErrors({ ...validRegister, password: "é".repeat(37) })).toEqual({
      password: ["A senha é longa demais."],
    });
  });

  it("trims the display name and enforces 2 to 50 characters", () => {
    expect(registerSchema.parse({ ...validRegister, displayName: "  Gio  " }).displayName).toBe(
      "Gio",
    );
    expect(getFieldErrors({ ...validRegister, displayName: " G " })).toEqual({
      displayName: ["O nome deve ter pelo menos 2 caracteres."],
    });
    expect(getFieldErrors({ ...validRegister, displayName: "x".repeat(51) })).toEqual({
      displayName: ["O nome deve ter no máximo 50 caracteres."],
    });
  });

  it("accepts real time zones and rejects unknown ones", () => {
    expect(registerSchema.safeParse({ ...validRegister, timezone: "UTC" }).success).toBe(true);
    expect(getFieldErrors({ ...validRegister, timezone: "Mars/Olympus_Mons" })).toEqual({
      timezone: ["Fuso horário inválido."],
    });
  });

  it("reports every invalid field at once", () => {
    expect(Object.keys(getFieldErrors({}))).toEqual([
      "email",
      "password",
      "displayName",
      "timezone",
    ]);
  });
});

describe("loginSchema", () => {
  it("normalizes the email like the register schema", () => {
    const result = loginSchema.parse({ email: " Gio@Example.com", password: "x" });

    expect(result.email).toBe("gio@example.com");
  });

  it("requires a password but does not apply the register rules", () => {
    expect(loginSchema.safeParse({ email: "gio@example.com", password: "123" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "gio@example.com", password: "" }).success).toBe(false);
  });
});
