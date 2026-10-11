import express from "express";
import { healthRouter } from "./modules/health/health.routes";

export const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);
