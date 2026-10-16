import { Router } from "express";
import { registerSchema } from "@habithos/shared";
import { validateBody } from "../../middlewares/validate-body";
import { register } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
