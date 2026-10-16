import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { notFound } from "./middlewares/not-found";
import { authRouter } from "./modules/auth/auth.routes";
import { healthRouter } from "./modules/health/health.routes";

export const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);
