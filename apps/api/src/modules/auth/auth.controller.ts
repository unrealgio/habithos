import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "@habithos/shared";
import { getAuthenticatedUserId, unauthenticated } from "../../middlewares/require-auth";
import { authenticateUser, findPublicUserById, registerUser } from "./auth.service";
import type { PublicUser } from "./auth.service";
import { endSession, startSession } from "./session";

type UserResponse = {
  user: PublicUser;
};

export async function register(
  req: Request<Record<string, string>, unknown, RegisterInput>,
  res: Response<UserResponse>,
): Promise<void> {
  const user = await registerUser(req.body);

  startSession(res, user.id);
  res.status(201).json({ user });
}

export async function login(
  req: Request<Record<string, string>, unknown, LoginInput>,
  res: Response<UserResponse>,
): Promise<void> {
  const user = await authenticateUser(req.body);

  startSession(res, user.id);
  res.json({ user });
}

export function logout(_req: Request, res: Response): void {
  endSession(res);
  res.status(204).end();
}

export async function me(req: Request, res: Response<UserResponse>): Promise<void> {
  const user = await findPublicUserById(getAuthenticatedUserId(req));

  if (!user) {
    endSession(res);
    throw unauthenticated();
  }

  res.json({ user });
}
