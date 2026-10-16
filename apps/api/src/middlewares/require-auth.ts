import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { readSessionToken, SESSION_COOKIE } from "../modules/auth/session";

export function unauthenticated(): AppError {
  return new AppError(401, "UNAUTHENTICATED", "Faça login para continuar.");
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token: unknown = req.cookies[SESSION_COOKIE];
  const userId = typeof token === "string" ? readSessionToken(token) : null;

  if (!userId) {
    throw unauthenticated();
  }

  req.userId = userId;
  next();
}

export function getAuthenticatedUserId(req: Request): string {
  if (!req.userId) {
    throw unauthenticated();
  }

  return req.userId;
}
