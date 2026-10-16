import { compare, hash, hashSync } from "bcryptjs";
import { DrizzleQueryError, eq } from "drizzle-orm";
import { DatabaseError } from "pg";
import type { LoginInput, RegisterInput } from "@habithos/shared";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import type { User } from "../../db/schema";
import { AppError } from "../../errors/app-error";

const PASSWORD_HASH_COST = 12;
const UNIQUE_VIOLATION = "23505";
const DUMMY_PASSWORD_HASH = hashSync("habithos-dummy-password", PASSWORD_HASH_COST);

export type PublicUser = Pick<User, "id" | "email" | "displayName" | "timezone">;

const publicUserColumns = {
  id: users.id,
  email: users.email,
  displayName: users.displayName,
  timezone: users.timezone,
};

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
      .returning(publicUserColumns);

    return user;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(409, "EMAIL_TAKEN", "Este e-mail já está cadastrado.");
    }

    throw error;
  }
}

export async function authenticateUser(input: LoginInput): Promise<PublicUser> {
  const [user] = await db
    .select({ ...publicUserColumns, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, input.email));

  // Compares against a dummy hash when the email is unknown, so both cases take the same time.
  const passwordMatches = await compare(input.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!user || !passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "E-mail ou senha incorretos.");
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    timezone: user.timezone,
  };
}

export async function findPublicUserById(userId: string): Promise<PublicUser | null> {
  const [user] = await db.select(publicUserColumns).from(users).where(eq(users.id, userId));

  return user ?? null;
}
