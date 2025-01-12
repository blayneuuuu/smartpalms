# Error Handling Core

This document explains the core error handling concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Error Handling Strategy](#error-handling-strategy)
2. [Error Types and Classification](#error-types-and-classification)
3. [Error Boundaries](#error-boundaries)
4. [Logging and Monitoring](#logging-and-monitoring)
5. [Recovery Patterns](#recovery-patterns)

## Error Handling Strategy

### Base Error Types

```typescript
// src/lib/errors/base.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}
```

### Error Guards

```typescript
// src/lib/errors/guards.ts
import type {AppError} from "./base";

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && "code" in error && "status" in error;
}

export function assertAppError(error: unknown): asserts error is AppError {
  if (!isAppError(error)) {
    throw new Error("Expected AppError");
  }
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, "INTERNAL_ERROR", 500, {
      originalError: error,
    });
  }

  return new AppError("An unexpected error occurred", "INTERNAL_ERROR", 500, {
    originalError: error,
  });
}
```

## Error Types and Classification

### Domain Errors

```typescript
// src/lib/errors/domain.ts
import {AppError} from "./base";

export class LockerNotAvailableError extends AppError {
  constructor(lockerId: string) {
    super("Locker is not available", "LOCKER_NOT_AVAILABLE", 400, {lockerId});
    this.name = "LockerNotAvailableError";
  }
}

export class DuplicateRequestError extends AppError {
  constructor(userId: string, lockerId: string) {
    super(
      "User already has a pending request for this locker",
      "DUPLICATE_REQUEST",
      400,
      {userId, lockerId}
    );
    this.name = "DuplicateRequestError";
  }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(currentStatus: string, newStatus: string, entityType: string) {
    super(
      `Invalid status transition from ${currentStatus} to ${newStatus}`,
      "INVALID_STATUS_TRANSITION",
      400,
      {currentStatus, newStatus, entityType}
    );
    this.name = "InvalidStatusTransitionError";
  }
}
```

## Error Boundaries

### Component Error Boundary

```svelte
<!-- src/lib/components/error/ErrorBoundary.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { errorStore } from '$lib/stores/error';
  import { Button } from '$lib/components/ui';

  let error: Error | null = null;
  let hasError = false;

  onMount(() => {
    const unsubscribe = errorStore.subscribe(state => {
      error = state.error;
      hasError = !!error;
    });

    return unsubscribe;
  });

  function handleRetry() {
    hasError = false;
    error = null;
    errorStore.clear();
  }
</script>

{#if hasError}
  <div class="rounded-md bg-destructive/15 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Error icon -->
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-destructive">
          {error?.name ?? 'Error'}
        </h3>
        <div class="mt-2 text-sm text-destructive/90">
          <p>{error?.message ?? 'An unexpected error occurred'}</p>
        </div>
        <div class="mt-4">
          <Button
            variant="outline"
            size="sm"
            on:click={handleRetry}
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <slot />
{/if}
```

### Route Error Boundary

```typescript
// src/routes/+error.svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui';

  $: error = $page.error;
  $: status = $page.status;
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold">{status}</h1>
    <p class="mt-2 text-lg text-muted-foreground">
      {error?.message ?? 'An unexpected error occurred'}
    </p>
    <div class="mt-6">
      <Button href="/">
        Return Home
      </Button>
    </div>
  </div>
</div>
```

## Logging and Monitoring

### Error Store

```typescript
// src/lib/stores/error.ts
import {writable} from "svelte/store";
import type {AppError} from "$lib/errors/base";

interface ErrorState {
  error: AppError | null;
  timestamp: number | null;
}

function createErrorStore() {
  const {subscribe, set, update} = writable<ErrorState>({
    error: null,
    timestamp: null,
  });

  return {
    subscribe,
    set: (error: AppError) =>
      set({
        error,
        timestamp: Date.now(),
      }),
    clear: () =>
      set({
        error: null,
        timestamp: null,
      }),
  };
}

export const errorStore = createErrorStore();
```

### Error Logger

```typescript
// src/lib/utils/logger.ts
import type {AppError} from "$lib/errors/base";

interface LogEntry {
  level: "error" | "warn" | "info";
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

class Logger {
  private entries: LogEntry[] = [];

  log(
    level: LogEntry["level"],
    message: string,
    details?: Record<string, any>
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      details,
    };

    this.entries.push(entry);
    this.persist(entry);

    if (level === "error") {
      this.notify(entry);
    }
  }

  error(error: unknown) {
    if (error instanceof AppError) {
      this.log("error", error.message, {
        code: error.code,
        status: error.status,
        details: error.details,
      });
    } else if (error instanceof Error) {
      this.log("error", error.message, {
        name: error.name,
        stack: error.stack,
      });
    } else {
      this.log("error", "An unexpected error occurred", {
        error,
      });
    }
  }

  private persist(entry: LogEntry) {
    // Persist to local storage or send to server
    const logs = JSON.parse(localStorage.getItem("error_logs") ?? "[]");
    logs.push(entry);
    localStorage.setItem(
      "error_logs",
      JSON.stringify(
        logs.slice(-100) // Keep last 100 entries
      )
    );
  }

  private notify(entry: LogEntry) {
    // Send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(entry);
    }
  }
}

export const logger = new Logger();
```

## Recovery Patterns

### Retry Logic

```typescript
// src/lib/utils/retry.ts
interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {maxAttempts = 3, delay = 1000, backoff = true} = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// Usage
async function fetchWithRetry() {
  return retry(
    async () => {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    },
    {maxAttempts: 3, delay: 1000, backoff: true}
  );
}
```

### Fallback Strategies

```typescript
// src/lib/utils/fallback.ts
type FallbackStrategy<T> = {
  attempt: () => Promise<T>;
  fallback: () => Promise<T>;
  shouldFallback: (error: unknown) => boolean;
};

export async function withFallback<T>(
  strategy: FallbackStrategy<T>
): Promise<T> {
  try {
    return await strategy.attempt();
  } catch (error) {
    if (strategy.shouldFallback(error)) {
      return await strategy.fallback();
    }
    throw error;
  }
}

// Usage
const result = await withFallback({
  attempt: async () => {
    // Try to fetch from API
    const response = await fetch("/api/data");
    return response.json();
  },
  fallback: async () => {
    // Fall back to cached data
    const cached = localStorage.getItem("cached_data");
    return cached ? JSON.parse(cached) : null;
  },
  shouldFallback: (error) => {
    // Fall back on network errors
    return (
      error instanceof TypeError && error.message.includes("Failed to fetch")
    );
  },
});
```

## Next Steps

- Study TypeScript patterns in [07_ADVANCED_TYPESCRIPT.md](./07_ADVANCED_TYPESCRIPT.md)
- Learn about testing in [08_ADVANCED_TESTING.md](./08_ADVANCED_TESTING.md)
- Explore deployment in [09_ADVANCED_DEPLOYMENT.md](./09_ADVANCED_DEPLOYMENT.md)
