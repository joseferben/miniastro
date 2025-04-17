import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import BetterSqliteDatabase from "better-sqlite3";
import * as schema from "./schema";

/** Runs script before starting the server */
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const sqlite = new BetterSqliteDatabase(process.env.DATABASE_URL);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("synchronous = normal");
  const db = drizzle(sqlite, { schema });
  console.log("Running migrations");
  migrate(db, { migrationsFolder: "./migrations" });
  console.log("Migrations done");
}

void main();
