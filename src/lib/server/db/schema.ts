import {sql} from "drizzle-orm";
import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";

export type Status = "active" | "expired" | "cancelled";
export type LockerSize = "small" | "medium" | "large";
export type RequestStatus = "pending" | "approved" | "rejected";

// Admin table
export const admins = sqliteTable(
  "admins",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

// Lockers table
export const lockers = sqliteTable(
  "lockers",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    size: text("size", {enum: ["small", "medium", "large"]}).notNull(),
    userId: text("user_id"), // Nullable - if null, locker is available
    otp: text("otp"),
    isOccupied: integer("is_occupied", {mode: "boolean"})
      .notNull()
      .default(false),
    lastAccessedAt: integer("last_accessed_at", {mode: "timestamp"}),
  },
  (table) => ({
    numberIdx: index("number_idx").on(table.number),
    userIdIdx: index("locker_user_id_idx").on(table.userId),
    sizeIdx: index("size_idx").on(table.size),
  })
);

// Locker Requests table
export const lockerRequests = sqliteTable(
  "locker_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    lockerId: text("locker_id")
      .notNull()
      .references(() => lockers.id),
    status: text("status", {
      enum: ["pending", "approved", "rejected"],
    })
      .notNull()
      .default("pending"),
    requestedAt: integer("requested_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    processedAt: integer("processed_at", {mode: "timestamp"}),
    processedBy: text("processed_by").references(() => admins.id),
  },
  (table) => ({
    userIdIdx: index("request_user_id_idx").on(table.userId),
    lockerIdIdx: index("request_locker_id_idx").on(table.lockerId),
    statusIdx: index("request_status_idx").on(table.status),
  })
);

// Subscriptions table
export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    status: text("status", {
      enum: ["active", "expired", "cancelled"],
    }).notNull(),
    userId: text("user_id").notNull(),
    lockerId: text("locker_id")
      .notNull()
      .references(() => lockers.id, {onDelete: "cascade"}),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text("expires_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("sub_user_id_idx").on(table.userId),
    lockerIdIdx: index("locker_id_idx").on(table.lockerId),
    statusIdx: index("status_idx").on(table.status),
  })
);

// Transactions table
export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    amount: text("amount").notNull(),
    userId: text("user_id").notNull(),
    subscriptionId: text("subscription_id").references(() => subscriptions.id),
    status: text("status", {enum: ["success", "failed", "pending"]}).notNull(),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("trans_user_id_idx").on(table.userId),
    subscriptionIdIdx: index("subscription_id_idx").on(table.subscriptionId),
    statusIdx: index("trans_status_idx").on(table.status),
  })
);

// Types for your entities
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Locker = typeof lockers.$inferSelect;
export type NewLocker = typeof lockers.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type LockerRequest = typeof lockerRequests.$inferSelect;
export type NewLockerRequest = typeof lockerRequests.$inferInsert;
