# Authentication Core

This document explains the core authentication concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Authentication Strategy](#authentication-strategy)
2. [User Management](#user-management)
3. [Session Handling](#session-handling)
4. [Role-Based Access Control](#role-based-access-control)
5. [Security Best Practices](#security-best-practices)

## Authentication Strategy

### Clerk Integration

```typescript
// src/app.d.ts
/// <reference types="@clerk/sveltekit" />
declare global {
  namespace App {
    interface Locals {
      auth: import("@clerk/sveltekit").SvelteKitAuthObject;
    }
  }
}

export {};
```

### Environment Configuration

```plaintext
# .env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### SvelteKit Configuration

```typescript
// src/hooks.server.ts
import {sequence} from "@sveltejs/kit/hooks";
import {handleClerk} from "@clerk/sveltekit";
import {authGuard} from "$lib/server/auth";

export const handle = sequence(handleClerk(), authGuard);
```

## User Management

### User Types

```typescript
// src/lib/types/user.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  imageUrl?: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}
```

### User Store

```typescript
// src/lib/stores/user.ts
import {writable, derived} from "svelte/store";
import type {User} from "$lib/types";

function createUserStore() {
  const {subscribe, set, update} = writable<User | null>(null);

  return {
    subscribe,
    set,
    update,
    clear: () => set(null),
    updateProfile: (data: Partial<User>) =>
      update((user) => (user ? {...user, ...data} : null)),
  };
}

export const user = createUserStore();

export const isAdmin = derived(user, ($user) => $user?.role === "admin");
```

### User Profile Management

```svelte
<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
  import { user } from '$lib/stores/user';
  import { Button, Input } from '$lib/components/ui';

  let loading = false;
  let fullName = $user?.fullName ?? '';

  async function updateProfile() {
    loading = true;
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName })
      });

      if (response.ok) {
        const data = await response.json();
        user.updateProfile(data);
      }
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={updateProfile}>
  <Input
    label="Full Name"
    bind:value={fullName}
    required
  />

  <Button type="submit" {loading}>
    Update Profile
  </Button>
</form>
```

## Session Handling

### Session Store

```typescript
// src/lib/stores/session.ts
import {writable, derived} from "svelte/store";

interface Session {
  token: string;
  expiresAt: Date;
}

function createSessionStore() {
  const {subscribe, set, update} = writable<Session | null>(null);

  return {
    subscribe,
    set,
    update,
    clear: () => {
      set(null);
      localStorage.removeItem("session");
    },
    restore: () => {
      const stored = localStorage.getItem("session");
      if (stored) {
        try {
          const session = JSON.parse(stored);
          if (new Date(session.expiresAt) > new Date()) {
            set(session);
            return true;
          }
        } catch {
          localStorage.removeItem("session");
        }
      }
      return false;
    },
  };
}

export const session = createSessionStore();

export const isAuthenticated = derived(
  session,
  ($session) => !!$session && new Date($session.expiresAt) > new Date()
);
```

### Session Management

```typescript
// src/lib/server/auth.ts
import {redirect, type Handle} from "@sveltejs/kit";

export const authGuard: Handle = async ({event, resolve}) => {
  const {auth} = event.locals;
  const publicPaths = ["/auth/sign-in", "/auth/sign-up"];

  if (!auth.userId && !publicPaths.includes(event.url.pathname)) {
    throw redirect(303, "/auth/sign-in");
  }

  return resolve(event);
};
```

## Role-Based Access Control

### Role Types

```typescript
// src/lib/types/roles.ts
export type Role = "user" | "admin";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RoleConfig {
  permissions: string[];
  allowedRoutes: string[];
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  user: {
    permissions: ["locker:view", "locker:request"],
    allowedRoutes: ["/dashboard", "/profile"],
  },
  admin: {
    permissions: ["locker:manage", "user:manage", "admin:access"],
    allowedRoutes: ["/admin", "/dashboard"],
  },
};
```

### Role Guards

```typescript
// src/lib/server/guards.ts
import {error} from "@sveltejs/kit";
import type {RequestEvent} from "@sveltejs/kit";
import {ROLE_CONFIG} from "$lib/types/roles";

export async function requirePermission(
  event: RequestEvent,
  permission: string
) {
  const {auth} = event.locals;
  const user = await auth.validateUser();

  if (!user) {
    throw error(401, "Unauthorized");
  }

  const userPermissions = ROLE_CONFIG[user.role].permissions;
  if (!userPermissions.includes(permission)) {
    throw error(403, "Forbidden");
  }

  return user;
}
```

### Role-Based Components

```svelte
<!-- src/lib/components/auth/RequirePermission.svelte -->
<script lang="ts">
  import { user } from '$lib/stores/user';
  import { ROLE_CONFIG } from '$lib/types/roles';

  export let permission: string;

  $: hasPermission = $user && ROLE_CONFIG[$user.role].permissions.includes(permission);
</script>

{#if hasPermission}
  <slot />
{/if}
```

## Security Best Practices

### CSRF Protection

```typescript
// src/hooks.server.ts
import {sequence} from "@sveltejs/kit/hooks";
import {handleClerk} from "@clerk/sveltekit";
import {csrfProtect} from "$lib/server/security";

export const handle = sequence(handleClerk(), csrfProtect);

// src/lib/server/security.ts
import {error} from "@sveltejs/kit";
import type {Handle} from "@sveltejs/kit";

export const csrfProtect: Handle = async ({event, resolve}) => {
  if (event.request.method === "GET") {
    return resolve(event);
  }

  const token = event.request.headers.get("x-csrf-token");
  if (!token || token !== event.locals.auth.sessionId) {
    throw error(403, "Invalid CSRF token");
  }

  return resolve(event);
};
```

### Rate Limiting

```typescript
// src/lib/server/security.ts
import {error} from "@sveltejs/kit";
import {Redis} from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

interface RateLimitConfig {
  window: number;
  max: number;
}

export async function rateLimit(key: string, config: RateLimitConfig) {
  const now = Date.now();
  const windowStart = now - config.window;

  const [count] = await redis
    .pipeline()
    .zremrangebyscore(key, 0, windowStart)
    .zadd(key, now, now.toString())
    .zcard(key)
    .expire(key, Math.ceil(config.window / 1000))
    .exec();

  if (count > config.max) {
    throw error(429, "Too many requests");
  }
}
```

### Password Reset Flow

```typescript
// src/routes/auth/reset-password/+server.ts
import {error, json} from "@sveltejs/kit";
import {sendResetEmail} from "$lib/server/email";
import {createResetToken} from "$lib/server/auth";

export const POST: RequestHandler = async ({request}) => {
  const {email} = await request.json();

  try {
    const token = await createResetToken(email);
    await sendResetEmail(email, token);

    return json({message: "Reset email sent"});
  } catch (err) {
    throw error(400, "Failed to initiate password reset");
  }
};
```

## Next Steps

- Learn about state management in [05_CORE_STATE.md](./05_CORE_STATE.md)
- Explore error handling in [06_CORE_ERROR_HANDLING.md](./06_CORE_ERROR_HANDLING.md)
- Study TypeScript patterns in [07_ADVANCED_TYPESCRIPT.md](./07_ADVANCED_TYPESCRIPT.md)
