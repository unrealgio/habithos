import type { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export const SESSION_COOKIE = "habithos_session";

const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};

export function createSessionToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    algorithm: "HS256",
    subject: userId,
    expiresIn: SESSION_DURATION_SECONDS,
  });
}

export function readSessionToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}

export function startSession(res: Response, userId: string): void {
  res.cookie(SESSION_COOKIE, createSessionToken(userId), {
    ...sessionCookieOptions,
    maxAge: SESSION_DURATION_SECONDS * 1000,
  });
}

export function endSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
}
