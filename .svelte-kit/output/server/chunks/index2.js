import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { p as private_env } from "./shared-server.js";
const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
});
sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  userId: text("user_id").notNull(),
  lockerId: text("locker_id")
    .notNull()
    .references(() => lockers.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});
const lockers = sqliteTable("lockers", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  size: text("size").notNull(),
  userId: text("user_id").notNull(),
  otp: text("otp"),
});
sqliteTable("transactions", {
  id: text("id").primaryKey(),
  amount: text("amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
if (!private_env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!private_env.DATABASE_AUTH_TOKEN)
  throw new Error("DATABASE_AUTH_TOKEN is not set");
const client = createClient({
  url: private_env.DATABASE_URL,
  authToken: private_env.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client);
export { admins as a, db as d, lockers as l };
