export function loadTestDatabaseUrl(): string {
  process.loadEnvFile(new URL("../../../../.env", import.meta.url));

  const testDatabaseUrl = process.env.TEST_DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error(
      "TEST_DATABASE_URL is missing. Add it to the .env file at the repository root.",
    );
  }

  if (!new URL(testDatabaseUrl).pathname.endsWith("_test")) {
    throw new Error(
      "TEST_DATABASE_URL must point to a database whose name ends with _test, because tests delete data.",
    );
  }

  return testDatabaseUrl;
}
