import { hash } from "bcryptjs";
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";
import type { RegisterInput } from "@habithos/shared";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import type { User } from "../../db/schema";
import { AppError } from "../../errors/app-error";

const PASSWORD_HASH_COST = 12;
const UNIQUE_VIOLATION = "23505";

export type PublicUser = Pick<User, "id" | "email" | "displayName" | "timezone">;

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof DrizzleQueryError &&
    error.cause instanceof DatabaseError &&
    error.cause.code === UNIQUE_VIOLATION
  );
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const passwordHash = await hash(input.password, PASSWORD_HASH_COST);

  try {
    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        displayName: input.displayName,
        timezone: input.timezone,
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        timezone: users.timezone,
      });

    return user;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(409, "EMAIL_TAKEN", "Este e-mail já está cadastrado.");
    }

    throw error;
  }
}
