import type { Request, Response } from "express";
import type { RegisterInput } from "@habithos/shared";
import { registerUser } from "./auth.service";
import type { PublicUser } from "./auth.service";

type UserResponse = {
  user: PublicUser;
};

export async function register(
  req: Request<Record<string, string>, unknown, RegisterInput>,
  res: Response<UserResponse>,
): Promise<void> {
  const user = await registerUser(req.body);

  res.status(201).json({ user });
}
