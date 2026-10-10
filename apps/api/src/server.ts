import express from "express";
import { APP_NAME } from "@habithos/shared";
import { env } from "./config/env";
import { isDatabaseReachable } from "./db/client";

const app = express();

app.get("/api/health", async (_req, res) => {
  const databaseUp = await isDatabaseReachable();

  res.json({ status: "ok", app: APP_NAME, database: databaseUp ? "up" : "down" });
});

app.listen(env.PORT, () => {
  console.log(`${APP_NAME} API running on http://localhost:${env.PORT}`);
});
