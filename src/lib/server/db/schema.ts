import {sql} from "drizzle-orm";
import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
export type Status = "active" | "expired" | "cancelled";
export type LockerSize = "small" | "large";
export type RequestStatus = "pending" | "approved" | "rejected";
export type SubscriptionDuration = "1_day" | "3_days" | "7_days" | "30_days";
export type UserType = "admin" | "user";
export type UserStatus =
  | "inactive"
  | "subscribed"
  | "for_renewal"
  | "suspended"
  | "blocked";

// Users table
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    type: text("type", {length: 10})
      .$type<"admin" | "user">()
      .notNull()
      .default("user"),
    status: text("status", {length: 15})
      .$type<UserStatus>()
      .notNull()
      .default("inactive"),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    typeIdx: index("type_idx").on(table.type),
    statusIdx: index("user_status_idx").on(table.status),
  })
);

// Unverified Users table - for email verification workflow
export const unverifiedUsers = sqliteTable(
  "unverified_users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    verificationToken: text("verification_token").notNull(),
    tokenExpiry: integer("token_expiry", {mode: "timestamp"}).notNull(),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    emailIdx: index("unverified_email_idx").on(table.email),
    tokenIdx: index("verification_token_idx").on(table.verificationToken),
  })
);

// Lockers table
export const lockers = sqliteTable(
  "lockers",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    size: text("size", {length: 10}).$type<"small" | "large">().notNull(),
    isOccupied: integer("is_occupied", {mode: "boolean"})
      .notNull()
      .default(sql`0`),
    userId: text("user_id").references(() => users.id),
    otp: text("otp"),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    numberIdx: index("locker_number_idx").on(table.number),
    userIdIdx: index("locker_user_id_idx").on(table.userId),
    sizeIdx: index("locker_size_idx").on(table.size),
  })
);

// Subscription Types table
export const subscriptionTypes = sqliteTable(
  "subscription_types",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    duration: text("duration", {length: 10})
      .$type<"1_day" | "3_days" | "7_days" | "30_days">()
      .notNull(),
    size: text("size", {length: 10})
      .$type<"small" | "large">()
      .notNull()
      .default("small"),
    amount: integer("amount").notNull(), // Amount in cents (e.g., 5000 for 50 PHP)
    isActive: integer("is_active", {mode: "boolean"})
      .notNull()
      .default(sql`1`),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    durationIdx: index("sub_type_duration_idx").on(table.duration),
    sizeIdx: index("sub_type_size_idx").on(table.size),
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
    status: text("status", {length: 10})
      .$type<"pending" | "approved" | "rejected">()
      .notNull()
      .default("pending"),
    proofOfPayment: text("proof_of_payment", {length: 4294967295}),
    rejectionReason: text("rejection_reason"),
    requestedAt: integer("requested_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
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
    status: text("status", {length: 10})
      .$type<"active" | "expired" | "cancelled">()
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    lockerId: text("locker_id")
      .notNull()
      .references(() => lockers.id, {onDelete: "cascade"}),
    expiresAt: text("expires_at").notNull(),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
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
    status: text("status", {length: 10})
      .$type<"success" | "failed" | "pending">()
      .notNull(),
    proofOfPayment: text("proof_of_payment"), // Base64 image for proof of payment
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userIdIdx: index("trans_user_id_idx").on(table.userId),
    subscriptionIdIdx: index("subscription_id_idx").on(table.subscriptionId),
    statusIdx: index("trans_status_idx").on(table.status),
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
      .default(sql`(strftime('%s', 'now'))`),
    accessType: text("access_type", {length: 15})
      .$type<"otp" | "subscription">()
      .notNull(),
    otp: text("otp"),
    status: text("status", {length: 10})
      .$type<"success" | "failed">()
      .notNull(),
  },
  (table) => ({
    lockerIdIdx: index("access_locker_id_idx").on(table.lockerId),
    userIdIdx: index("access_user_id_idx").on(table.userId),
    accessedAtIdx: index("accessed_at_idx").on(table.accessedAt),
  })
);

// Messages table for user-admin communication
export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    lockerId: text("locker_id").references(() => lockers.id),
    content: text("content", {length: 1000}).notNull(),
    isRead: integer("is_read", {mode: "boolean"})
      .notNull()
      .default(sql`0`),
    createdAt: integer("created_at", {mode: "timestamp"})
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    // For admin replies - we'll store the parent message ID as text without a formal FK constraint
    parentId: text("parent_id"),
  },
  (table) => ({
    userIdIdx: index("message_user_id_idx").on(table.userId),
    lockerIdIdx: index("message_locker_id_idx").on(table.lockerId),
    createdAtIdx: index("message_created_at_idx").on(table.createdAt),
    parentIdIdx: index("message_parent_id_idx").on(table.parentId),
  })
);

// Types for your entities
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UnverifiedUser = typeof unverifiedUsers.$inferSelect;
export type NewUnverifiedUser = typeof unverifiedUsers.$inferInsert;

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

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
