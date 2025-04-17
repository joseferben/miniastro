import { drizzle } from "drizzle-orm/better-sqlite3";
import BetterSqliteDatabase from "better-sqlite3";
import { DATABASE_URL } from "astro:env/server";
import * as schema from "@/schema";

const sqlite = new BetterSqliteDatabase(DATABASE_URL);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("synchronous = normal");
export const db = drizzle(sqlite, { schema });
