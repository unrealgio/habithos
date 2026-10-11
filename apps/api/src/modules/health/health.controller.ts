import type { Request, Response } from "express";
import { APP_NAME } from "@habithos/shared";
import { isDatabaseReachable } from "../../db/client";

type HealthResponse = {
  status: "ok";
  app: string;
  database: "up" | "down";
};

export async function getHealth(_req: Request, res: Response<HealthResponse>): Promise<void> {
  const databaseUp = await isDatabaseReachable();

  res.json({ status: "ok", app: APP_NAME, database: databaseUp ? "up" : "down" });
}
