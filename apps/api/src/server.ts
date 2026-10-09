import express from "express";
import { APP_NAME } from "@habithos/shared";
import { isDatabaseReachable } from "./db/client";

const app = express();

const PORT = 3333;

app.get("/api/health", async (_req, res) => {
  const databaseUp = await isDatabaseReachable();

  res.json({ status: "ok", app: APP_NAME, database: databaseUp ? "up" : "down" });
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} API running on http://localhost:${PORT}`);
});
