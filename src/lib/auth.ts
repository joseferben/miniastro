import { betterAuth } from "better-auth";
import { BETTER_AUTH_SECRET } from "astro:env/server";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/schema";
import { GOOGLE_CLIENT_ID } from "astro:env/client";
import { GOOGLE_CLIENT_SECRET } from "astro:env/server";

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
    schema: {
      users: schema.users,
      sessions: schema.sessions,
      accounts: schema.accounts,
      verifications: schema.verifications,
    },
  }),
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
});
