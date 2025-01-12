# API Fundamentals

This document explains the fundamental API concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [API Design Principles](#api-design-principles)
2. [RESTful Architecture](#restful-architecture)
3. [Request/Response Patterns](#request-response-patterns)
4. [Middleware](#middleware)
5. [Error Handling](#error-handling)

## API Design Principles

### Type-Safe Endpoints

```typescript
// src/routes/api/lockers/+server.ts
import type {RequestHandler} from "./$types";
import {json} from "@sveltejs/kit";
import {db} from "$lib/server/db";

export const GET: RequestHandler = async ({url}) => {
  const status = url.searchParams.get("status");
  const lockers = await db.query.smartLockers.findMany({
    where: status ? eq(smartLockers.status, status) : undefined,
  });
  return json(lockers);
};
```

### Response Consistency

```typescript
// src/lib/types/api.ts
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Usage in endpoint
export const POST: RequestHandler = async ({request}) => {
  try {
    const data = await request.json();
    const locker = await createLocker(data);
    return json({data: locker});
  } catch (err) {
    return json(
      {
        error: {
          code: "CREATION_FAILED",
          message: err.message,
        },
      },
      {status: 400}
    );
  }
};
```

## RESTful Architecture

### Resource-Based Routes

```plaintext
/api/
├── lockers/
│   ├── +server.ts           # GET, POST /api/lockers
│   └── [id]/
│       ├── +server.ts       # GET, PUT, DELETE /api/lockers/[id]
│       └── assign/
│           └── +server.ts   # POST /api/lockers/[id]/assign
└── users/
    ├── +server.ts           # GET, POST /api/users
    └── [id]/
        └── +server.ts       # GET, PUT, DELETE /api/users/[id]
```

### HTTP Methods

```typescript
// Example of all CRUD operations for a resource
export const GET: RequestHandler = async ({params}) => {
  const {id} = params;
  const locker = await getLocker(id);
  return json(locker);
};

export const POST: RequestHandler = async ({request}) => {
  const data = await request.json();
  const locker = await createLocker(data);
  return json(locker, {status: 201});
};

export const PUT: RequestHandler = async ({params, request}) => {
  const {id} = params;
  const data = await request.json();
  const locker = await updateLocker(id, data);
  return json(locker);
};

export const DELETE: RequestHandler = async ({params}) => {
  const {id} = params;
  await deleteLocker(id);
  return new Response(null, {status: 204});
};
```

## Request/Response Patterns

### Input Validation

```typescript
// src/lib/validation/locker.ts
import {z} from "zod";

export const createLockerSchema = z.object({
  number: z.string().min(1).max(10),
  locationId: z.string().uuid(),
  status: z.enum(["available", "maintenance"]).default("available"),
});

// Usage in endpoint
export const POST: RequestHandler = async ({request}) => {
  const data = await request.json();

  try {
    const validated = createLockerSchema.parse(data);
    const locker = await createLocker(validated);
    return json(locker, {status: 201});
  } catch (err) {
    if (err instanceof z.ZodError) {
      return json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: err.errors,
          },
        },
        {status: 400}
      );
    }
    throw err;
  }
};
```

### Response Formatting

```typescript
// src/lib/api/response.ts
export function createResponse<T>(data: T): ApiResponse<T> {
  return {data};
}

export function createErrorResponse(
  code: string,
  message: string,
  status = 400
): Response {
  return json(
    {
      error: {code, message},
    },
    {status}
  );
}

// Usage
export const GET: RequestHandler = async ({params}) => {
  try {
    const locker = await getLocker(params.id);
    if (!locker) {
      return createErrorResponse("NOT_FOUND", "Locker not found", 404);
    }
    return json(createResponse(locker));
  } catch (err) {
    return createErrorResponse("INTERNAL_ERROR", "Failed to fetch locker", 500);
  }
};
```

## Middleware

### Authentication

```typescript
// src/hooks.server.ts
import {sequence} from "@sveltejs/kit/hooks";
import {handleClerk} from "@clerk/sveltekit";

export const handle = sequence(handleClerk(), async ({event, resolve}) => {
  // Protect API routes
  if (event.url.pathname.startsWith("/api")) {
    const {userId} = event.locals.auth;
    if (!userId) {
      return json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        {status: 401}
      );
    }
  }
  return resolve(event);
});
```

### Request Logging

```typescript
// src/lib/middleware/logging.ts
export async function logRequest({event, resolve}) {
  const start = Date.now();

  try {
    const response = await resolve(event);
    const duration = Date.now() - start;

    console.log({
      path: event.url.pathname,
      method: event.request.method,
      status: response.status,
      duration,
    });

    return response;
  } catch (err) {
    console.error({
      path: event.url.pathname,
      method: event.request.method,
      error: err,
    });
    throw err;
  }
}
```

## Error Handling

### Global Error Handler

```typescript
// src/hooks.server.ts
export const handleError = ({error, event}) => {
  console.error({
    path: event.url.pathname,
    error: error,
    stack: error.stack,
  });

  return {
    message: "An unexpected error occurred",
    code: error?.code ?? "INTERNAL_ERROR",
  };
};
```

### Error Types

```typescript
// src/lib/errors.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super("NOT_FOUND", message, 404);
  }
}

// Usage
export const GET: RequestHandler = async ({params}) => {
  const locker = await getLocker(params.id);
  if (!locker) {
    throw new NotFoundError("Locker not found");
  }
  return json(locker);
};
```

## Next Steps

- Learn about frontend integration in [03_FUNDAMENTALS_FRONTEND.md](./03_FUNDAMENTALS_FRONTEND.md)
- Study authentication in [04_CORE_AUTHENTICATION.md](./04_CORE_AUTHENTICATION.md)
- Explore state management in [05_CORE_STATE.md](./05_CORE_STATE.md)
