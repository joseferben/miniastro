import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/better-sqlite3";
import BetterSqliteDatabase from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "@/schema";
import { addHeart, getNrOfHearts } from "./hearts";
import type { Database } from "@/db";
import { eq } from "drizzle-orm";

describe("Heart Domain Functions", () => {
  let db: Database;
  let sqlite: BetterSqliteDatabase.Database;

  // Mock user for testing addHeart
  const mockUser: schema.User = {
    id: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    emailVerified: true, // Added required field
    image: null, // Added optional field
    stripeCustomerId: null, // Added optional field
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    console.log("Setting up in-memory database for hearts tests...");
    // Initialize in-memory SQLite database
    sqlite = new BetterSqliteDatabase(":memory:");
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("synchronous = normal");
    db = drizzle(sqlite, { schema });

    console.log("Running migrations on in-memory database...");
    // Apply migrations
    migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations complete.");
  });

  afterAll(() => {
    console.log("Closing in-memory database connection...");
    // Close the database connection
    sqlite.close();
    console.log("Database connection closed.");
  });

  beforeEach(async () => {
    console.log("Resetting hearts table before each test...");
    // Clear the hearts table before each test to ensure isolation
    await db.delete(schema.hearts);
    console.log("Hearts table reset.");
  });

  it("getNrOfHearts should return 0 initially", async () => {
    console.log("Running test: getNrOfHearts initial state");
    const count = await getNrOfHearts({ db });
    expect(count).toBe(0);
    console.log("Test finished: getNrOfHearts initial state");
  });

  it("addHeart should add a heart to the database", async () => {
    console.log("Running test: addHeart functionality");
    // Add a heart
    await addHeart({ db }, { user: mockUser });

    // Verify the heart was added by checking the count
    const count = await getNrOfHearts({ db });
    expect(count).toBe(1);

    // Optionally, verify the inserted data directly
    const insertedHeart = await db
      .select()
      .from(schema.hearts)
      .where(eq(schema.hearts.userId, mockUser.id))
      .limit(1);
    expect(insertedHeart).toHaveLength(1);
    expect(insertedHeart[0]?.userId).toBe(mockUser.id);
    expect(insertedHeart[0]?.id).toEqual(expect.any(String)); // Check if UUID was generated
    console.log("Test finished: addHeart functionality");
  });

  it("getNrOfHearts should return the correct count after adding multiple hearts", async () => {
    console.log("Running test: getNrOfHearts after multiple adds");
    // Add multiple hearts
    await addHeart({ db }, { user: mockUser });
    await addHeart({ db }, { user: { ...mockUser, id: "test-user-456" } }); // Simulate different user

    const count = await getNrOfHearts({ db });
    expect(count).toBe(2);
    console.log("Test finished: getNrOfHearts after multiple adds");
  });
});
