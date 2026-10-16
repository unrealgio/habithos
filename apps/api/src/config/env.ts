import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must have at least 32 characters"),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Invalid environment variables. Check the .env file at the repository root.\n${z.prettifyError(result.error)}`,
  );
}

export const env: Env = result.data;
