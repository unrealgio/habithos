import express from "express";
import { APP_NAME } from "@habithos/shared";

const app = express();

// Temporary: the port will come from validated environment variables in Phase 5.
const PORT = 3333;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: APP_NAME });
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} API running on http://localhost:${PORT}`);
});
