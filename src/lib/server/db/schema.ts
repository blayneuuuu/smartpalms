import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Admin table
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
});

// Subscriptions table
export const subscriptions = sqliteTable("subscriptions", {
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

// Lockers table
export const lockers = sqliteTable("lockers", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  size: text("size").notNull(),
  userId: text("user_id").notNull(),
  otp: text("otp"),
});

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  amount: text("amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Types for your entities
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Locker = typeof lockers.$inferSelect;
export type NewLocker = typeof lockers.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
