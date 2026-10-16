import { Router } from "express";
import { loginSchema, registerSchema } from "@habithos/shared";
import { requireAuth } from "../../middlewares/require-auth";
import { validateBody } from "../../middlewares/validate-body";
import { login, logout, me, register } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
