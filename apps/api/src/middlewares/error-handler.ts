import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import type { ErrorResponse } from "../errors/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }

  if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "O corpo da requisição não é um JSON válido." },
    });
    return;
  }

  console.error("Unexpected error:", error);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Erro interno do servidor. Tente novamente mais tarde.",
    },
  });
}
