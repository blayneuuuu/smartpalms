import {sql} from "drizzle-orm";
import {sqliteTable, text, integer, primaryKey} from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullname: text("fullname"),
  address: text("address"),
  type: text("type").notNull(),
});

// Subscriptions table
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  lockerId: text("locker_id")
    .notNull()
    .references(() => lockers.id),
  createdAt: integer("created_at", {mode: "timestamp"})
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
});

// Lockers table
export const lockers = sqliteTable("lockers", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  size: text("size").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  otp: text("otp"),
});

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  amount: text("amount").notNull(),
  createdAt: integer("created_at", {mode: "timestamp"})
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Types for your entities
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Locker = typeof lockers.$inferSelect;
export type NewLocker = typeof lockers.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
