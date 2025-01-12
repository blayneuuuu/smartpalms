# Database Fundamentals

This document explains the fundamental database concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Database Design Principles](#database-design-principles)
2. [Schema Design](#schema-design)
3. [Query Patterns](#query-patterns)
4. [Data Integrity](#data-integrity)
5. [Performance Optimization](#performance-optimization)

## Database Design Principles

### Type Safety with Drizzle ORM

```typescript
// Example of type-safe schema definition
import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: integer("created_at", {mode: "timestamp"}).notNull(),
});
```

### Naming Conventions

- Table names: plural, snake_case (e.g., `smart_lockers`)
- Column names: singular, snake_case (e.g., `created_at`)
- Foreign keys: `entity_id` format (e.g., `user_id`)
- Indexes: `idx_table_column` format

## Schema Design

### Core Tables

```typescript
// Smart Palms core schema
export const smartLockers = sqliteTable("smart_lockers", {
  id: text("id").primaryKey(),
  number: text("number").notNull().unique(),
  status: text("status", {enum: ["available", "occupied", "maintenance"]})
    .notNull()
    .default("available"),
  lastAccessed: integer("last_accessed", {mode: "timestamp"}),
});

export const lockerAssignments = sqliteTable("locker_assignments", {
  id: text("id").primaryKey(),
  lockerId: text("locker_id")
    .notNull()
    .references(() => smartLockers.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  assignedAt: integer("assigned_at", {mode: "timestamp"}).notNull(),
  expiresAt: integer("expires_at", {mode: "timestamp"}),
});
```

### Relationships

- One-to-Many relationships using foreign keys
- Many-to-Many relationships using junction tables
- Proper indexing on foreign key columns

## Query Patterns

### Basic CRUD Operations

```typescript
// Create
const newLocker = await db
  .insert(smartLockers)
  .values({
    id: crypto.randomUUID(),
    number: "A123",
  })
  .returning();

// Read
const locker = await db.query.smartLockers.findFirst({
  where: eq(smartLockers.number, "A123"),
  with: {
    assignments: true,
  },
});

// Update
await db
  .update(smartLockers)
  .set({status: "maintenance"})
  .where(eq(smartLockers.id, lockerId));

// Delete
await db.delete(smartLockers).where(eq(smartLockers.id, lockerId));
```

### Complex Queries

```typescript
// Example: Find available lockers with no recent assignments
const availableLockers = await db.query.smartLockers.findMany({
  where: and(
    eq(smartLockers.status, "available"),
    not(
      exists(
        db
          .select()
          .from(lockerAssignments)
          .where(
            and(
              eq(lockerAssignments.lockerId, smartLockers.id),
              gt(
                lockerAssignments.assignedAt,
                dayjs().subtract(1, "day").toDate()
              )
            )
          )
      )
    )
  ),
});
```

## Data Integrity

### Constraints

```typescript
// Example of constraints
export const smartLockers = sqliteTable("smart_lockers", {
  id: text("id").primaryKey(),
  number: text("number").notNull().unique(),
  status: text("status", {enum: ["available", "occupied", "maintenance"]})
    .notNull()
    .default("available"),
  locationId: text("location_id")
    .notNull()
    .references(() => locations.id, {onDelete: "restrict"}),
});
```

### Transactions

```typescript
// Example of transaction usage
await db.transaction(async (tx) => {
  const [locker] = await tx
    .update(smartLockers)
    .set({status: "occupied"})
    .where(eq(smartLockers.id, lockerId))
    .returning();

  await tx.insert(lockerAssignments).values({
    id: crypto.randomUUID(),
    lockerId: locker.id,
    userId,
    assignedAt: new Date(),
  });
});
```

## Performance Optimization

### Indexing Strategy

```typescript
// Example of index creation
export const smartLockers = sqliteTable(
  "smart_lockers",
  {
    // ... columns
  },
  (table) => ({
    numberIdx: index("idx_locker_number").on(table.number),
    statusIdx: index("idx_locker_status").on(table.status),
    locationStatusIdx: index("idx_location_status").on(
      table.locationId,
      table.status
    ),
  })
);
```

### Query Optimization

```typescript
// Example of optimized query with proper index usage
const lockers = await db.query.smartLockers.findMany({
  where: and(
    eq(smartLockers.locationId, locationId),
    eq(smartLockers.status, "available")
  ),
  columns: {
    id: true,
    number: true,
    status: true,
  },
  limit: 10,
});
```

## Next Steps

- Explore API implementation in [02_FUNDAMENTALS_API.md](./02_FUNDAMENTALS_API.md)
- Learn about frontend integration in [03_FUNDAMENTALS_FRONTEND.md](./03_FUNDAMENTALS_FRONTEND.md)
- Study authentication implementation in [04_CORE_AUTHENTICATION.md](./04_CORE_AUTHENTICATION.md)
