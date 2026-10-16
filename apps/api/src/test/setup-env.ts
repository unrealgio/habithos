import { loadTestDatabaseUrl } from "./test-database-url";

process.env.DATABASE_URL = loadTestDatabaseUrl();
process.env.NODE_ENV = "test";
