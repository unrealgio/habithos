import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errorHandler } from "./error-handler";
import { validateBody } from "./validate-body";

const petSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  age: z.number().int().min(0, "A idade não pode ser negativa."),
});

const testApp = express();
testApp.use(express.json());
testApp.post("/pets", validateBody(petSchema), (req, res) => {
  res.json({ received: req.body, nameLength: req.body.name.length });
});
testApp.use(errorHandler);

describe("validateBody", () => {
  it("passes the parsed body to the next handler", async () => {
    const response = await request(testApp).post("/pets").send({ name: "  Rex  ", age: 3 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: { name: "Rex", age: 3 }, nameLength: 3 });
  });

  it("strips fields that are not in the schema", async () => {
    const response = await request(testApp)
      .post("/pets")
      .send({ name: "Rex", age: 3, isAdmin: true });

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual({ name: "Rex", age: 3 });
  });

  it("responds 400 with the errors of each invalid field", async () => {
    const response = await request(testApp).post("/pets").send({ name: "   ", age: -1 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Alguns campos estão inválidos.",
        fieldErrors: {
          name: ["Informe o nome."],
          age: ["A idade não pode ser negativa."],
        },
      },
    });
  });

  it("responds 400 when the body is missing", async () => {
    const response = await request(testApp).post("/pets");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
