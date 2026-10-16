import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "./app";
import { isDatabaseReachable } from "./db/client";

vi.mock("./db/client", () => ({
  isDatabaseReachable: vi.fn(),
}));

const mockedIsDatabaseReachable = vi.mocked(isDatabaseReachable);

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe("GET /api/health", () => {
  it("reports the database as up when it is reachable", async () => {
    mockedIsDatabaseReachable.mockResolvedValue(true);

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", app: "Habithos", database: "up" });
  });

  it("still responds 200 and reports the database as down when it is unreachable", async () => {
    mockedIsDatabaseReachable.mockResolvedValue(false);

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", app: "Habithos", database: "down" });
  });
});

describe("error handling", () => {
  it("responds 404 with the standard error body for unknown routes", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: "NOT_FOUND", message: "Rota não encontrada." },
    });
  });

  it("responds 400 when the request body is malformed JSON", async () => {
    const response = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send("{invalid");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: { code: "INVALID_JSON", message: "O corpo da requisição não é um JSON válido." },
    });
  });

  it("responds 500 without leaking internal details on unexpected errors", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedIsDatabaseReachable.mockRejectedValue(new Error("secret internal detail"));

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "Erro interno do servidor. Tente novamente mais tarde.",
      },
    });
    expect(response.text).not.toContain("secret internal detail");
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
