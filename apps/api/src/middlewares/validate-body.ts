import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../errors/app-error";

export function validateBody<T>(
  schema: z.ZodType<T>,
): RequestHandler<Record<string, string>, unknown, T> {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        400,
        "VALIDATION_ERROR",
        "Alguns campos estão inválidos.",
        z.flattenError(result.error).fieldErrors,
      );
    }

    req.body = result.data;
    next();
  };
}
