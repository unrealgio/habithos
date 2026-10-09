import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Copy .env.example to .env at the repository root.");
}

export const pool = new Pool({ connectionString: databaseUrl });

pool.on("error", (error) => {
  console.error("Idle database connection lost:", error.message);
});

export const db = drizzle({ client: pool });

export async function isDatabaseReachable(): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}
