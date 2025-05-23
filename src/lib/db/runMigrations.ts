import {createClient} from "@libsql/client";
import {sql} from "drizzle-orm";
import {drizzle} from "drizzle-orm/libsql";
import {DATABASE_URL, DATABASE_AUTH_TOKEN} from "$env/static/private";

export async function runUnverifiedUsersMigration() {
  const client = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client);

  try {
    // Create unverified_users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS unverified_users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        verification_token TEXT NOT NULL,
        token_expiry INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    // Create indices
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS unverified_email_idx ON unverified_users (email);`
    );
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS token_idx ON unverified_users (verification_token);`
    );

    console.log("Unverified users table migration completed successfully");
  } catch (error) {
    console.error("Error running unverified users migration:", error);
  } finally {
    await client.close();
  }
}
