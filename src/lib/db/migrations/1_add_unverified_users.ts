import {SQLiteDialect} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export async function migrate(db: SQLiteDialect) {
  // Create unverified_users table
  await db.run(sql`
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
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS unverified_email_idx ON unverified_users (email);`
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS token_idx ON unverified_users (verification_token);`
  );

  console.log("Unverified users table migration completed successfully");
}
