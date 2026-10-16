import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { loadTestDatabaseUrl } from "./test-database-url";

export default async function setup(): Promise<void> {
  const pool = new Pool({ connectionString: loadTestDatabaseUrl() });

  try {
    await migrate(drizzle({ client: pool }), {
      migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)),
    });
  } catch (error) {
    throw new Error(
      "Could not prepare the test database. Is Docker running (npm run db:up) and does habithos_test exist?",
      { cause: error },
    );
  } finally {
    await pool.end();
  }
}
