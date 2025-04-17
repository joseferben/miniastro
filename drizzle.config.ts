import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL && !process.env.KNIP) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
