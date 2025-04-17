import { type Database } from "@/db";
import { hearts } from "@/schema";
import type { User } from "better-auth";
import { count } from "drizzle-orm";

export async function addHeart(
  { db }: { db: Database },
  { user }: { user: User }
) {
  return await db
    .insert(hearts)
    .values({ id: crypto.randomUUID(), userId: user.id });
}

export async function getNrOfHearts({ db }: { db: Database }) {
  return (await db.select({ count: count() }).from(hearts))[0]?.count ?? 0;
}
