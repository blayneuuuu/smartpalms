import {sql} from "drizzle-orm";
import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";

export type Status = "active" | "expired" | "cancelled";
export type LockerSize = "small" | "medium" | "large";
export type RequestStatus = "pending" | "approved" | "rejected";
export type SubscriptionDuration = "1_day" | "7_days" | "30_days";
export type UserType = "admin" | "user";

// Users table
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    type: text("type", {enum: ["admin", "user"]})
      .notNull()
      .default("user"),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    typeIdx: index("type_idx").on(table.type),
  })
);

// Lockers table
export const lockers = sqliteTable(
  "lockers",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    size: text("size", {enum: ["small", "medium", "large"]}).notNull(),
    userId: text("user_id").references(() => users.id), // Nullable - if null, locker is available
    otp: text("otp"),
    isOccupied: integer("is_occupied", {mode: "boolean"})
      .notNull()
      .default(false),
    lastAccessedAt: integer("last_accessed_at", {mode: "timestamp"}),
    otpExpiresAt: integer("otp_expires_at", {mode: "timestamp"}),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    lockerId: text("locker_id")
      .notNull()
      .references(() => lockers.id),
    subscriptionTypeId: text("subscription_type_id")
      .notNull()
      .references(() => subscriptionTypes.id),
    status: text("status", {
      enum: ["pending", "approved", "rejected"],
    })
      .notNull()
      .default("pending"),
    proofOfPayment: text("proof_of_payment", {length: 4294967295}),
    rejectionReason: text("rejection_reason"),
    requestedAt: integer("requested_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    processedAt: integer("processed_at", {mode: "timestamp"}),
    processedBy: text("processed_by").references(() => users.id),
  },
  (table) => ({
    userIdIdx: index("request_user_id_idx").on(table.userId),
    lockerIdIdx: index("request_locker_id_idx").on(table.lockerId),
    statusIdx: index("request_status_idx").on(table.status),
    subscriptionTypeIdx: index("subscription_type_idx").on(
      table.subscriptionTypeId
    ),
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
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
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
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    subscriptionId: text("subscription_id").references(() => subscriptions.id),
    status: text("status", {enum: ["success", "failed", "pending"]}).notNull(),
    proofOfPayment: text("proof_of_payment"), // Base64 image for proof of payment
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

// Subscription Types table
export const subscriptionTypes = sqliteTable(
  "subscription_types",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    duration: text("duration", {
      enum: ["1_day", "7_days", "30_days"],
    }).notNull(),
    amount: integer("amount").notNull(), // Amount in cents (e.g., 5000 for 50 PHP)
    isActive: integer("is_active", {mode: "boolean"}).notNull().default(true),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    durationIdx: index("duration_idx").on(table.duration),
  })
);

// Access History table
export const accessHistory = sqliteTable(
  "access_history",
  {
    id: text("id").primaryKey(),
    lockerId: text("locker_id")
      .notNull()
      .references(() => lockers.id),
    userId: text("user_id").references(() => users.id),
    accessedAt: integer("accessed_at", {mode: "timestamp"})
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    accessType: text("access_type", {enum: ["otp", "external"]}).notNull(),
    otp: text("otp"),
    status: text("status", {enum: ["success", "failed"]}).notNull(),
  },
  (table) => ({
    lockerIdIdx: index("access_locker_id_idx").on(table.lockerId),
    userIdIdx: index("access_user_id_idx").on(table.userId),
    accessedAtIdx: index("accessed_at_idx").on(table.accessedAt),
  })
);

// Types for your entities
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Locker = typeof lockers.$inferSelect;
export type NewLocker = typeof lockers.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type LockerRequest = typeof lockerRequests.$inferSelect;
export type NewLockerRequest = typeof lockerRequests.$inferInsert;

export type SubscriptionType = typeof subscriptionTypes.$inferSelect;
export type NewSubscriptionType = typeof subscriptionTypes.$inferInsert;

export type AccessHistory = typeof accessHistory.$inferSelect;
export type NewAccessHistory = typeof accessHistory.$inferInsert;
