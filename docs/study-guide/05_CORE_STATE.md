# State Management Core

This document explains the core state management concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [State Management Principles](#state-management-principles)
2. [Store Implementation](#store-implementation)
3. [Data Flow Patterns](#data-flow-patterns)
4. [State Synchronization](#state-synchronization)
5. [Performance Optimization](#performance-optimization)

## State Management Principles

### Store Architecture

```typescript
// src/lib/stores/base.ts
import { writable, type Writable } from "svelte/store";

export interface StoreState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function createStore<T>(initialData: T | null = null) {
  const state: StoreState<T> = {
    data: initialData,
    loading: false,
    error: null,
  };

  const store = writable(state);

  function setLoading(loading: boolean) {
    store.update((state) => ({ ...state, loading }));
  }

  function setError(error: Error | null) {
    store.update((state) => ({ ...state, error }));
  }

  function setData(data: T | null) {
    store.update((state) => ({ ...state, data }));
  }

  return {
    subscribe: store.subscribe,
    setLoading,
    setError,
    setData,
  };
}
```

### Store Types

```typescript
// src/lib/stores/types.ts
export interface Locker {
  id: string;
  number: string;
  status: "available" | "occupied" | "maintenance";
  userId?: string;
  lastAccessed?: Date;
}

export interface LockerRequest {
  id: string;
  lockerId: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface StoreActions<T> {
  fetch: () => Promise<void>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}
```

## Store Implementation

### Feature Store

```typescript
// src/lib/stores/locker.ts
import { derived } from "svelte/store";
import { createStore, type StoreState } from "./base";
import type { Locker, StoreActions } from "./types";

function createLockerStore() {
  const store = createStore<Locker[]>([]);

  const actions: StoreActions<Locker> = {
    async fetch() {
      store.setLoading(true);
      try {
        const response = await fetch("/api/lockers");
        const data = await response.json();
        store.setData(data);
      } catch (err) {
        store.setError(
          err instanceof Error ? err : new Error("Failed to fetch lockers"),
        );
      } finally {
        store.setLoading(false);
      }
    },

    async create(data) {
      const response = await fetch("/api/lockers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const locker = await response.json();
      store.update((state) => ({
        ...state,
        data: [...(state.data || []), locker],
      }));

      return locker;
    },

    async update(id, data) {
      const response = await fetch(`/api/lockers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const locker = await response.json();
      store.update((state) => ({
        ...state,
        data:
          state.data?.map((item) =>
            item.id === id ? { ...item, ...locker } : item,
          ) || [],
      }));

      return locker;
    },

    async remove(id) {
      await fetch(`/api/lockers/${id}`, { method: "DELETE" });
      store.update((state) => ({
        ...state,
        data: state.data?.filter((item) => item.id !== id) || [],
      }));
    },
  };

  return {
    subscribe: store.subscribe,
    ...actions,
  };
}

export const lockerStore = createLockerStore();

// Derived stores
export const availableLockers = derived(
  lockerStore,
  ($store) =>
    $store.data?.filter((locker) => locker.status === "available") || [],
);

export const occupiedLockers = derived(
  lockerStore,
  ($store) =>
    $store.data?.filter((locker) => locker.status === "occupied") || [],
);
```

### Request Store

```typescript
// src/lib/stores/request.ts
import { derived } from "svelte/store";
import { createStore } from "./base";
import type { LockerRequest, StoreActions } from "./types";

function createRequestStore() {
  const store = createStore<LockerRequest[]>([]);

  const actions: StoreActions<LockerRequest> = {
    async fetch() {
      store.setLoading(true);
      try {
        const response = await fetch("/api/requests");
        const data = await response.json();
        store.setData(data);
      } catch (err) {
        store.setError(
          err instanceof Error ? err : new Error("Failed to fetch requests"),
        );
      } finally {
        store.setLoading(false);
      }
    },

    async create(data) {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const request = await response.json();
      store.update((state) => ({
        ...state,
        data: [...(state.data || []), request],
      }));

      return request;
    },

    async update(id, data) {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const request = await response.json();
      store.update((state) => ({
        ...state,
        data:
          state.data?.map((item) =>
            item.id === id ? { ...item, ...request } : item,
          ) || [],
      }));

      return request;
    },

    async remove(id) {
      await fetch(`/api/requests/${id}`, { method: "DELETE" });
      store.update((state) => ({
        ...state,
        data: state.data?.filter((item) => item.id !== id) || [],
      }));
    },
  };

  return {
    subscribe: store.subscribe,
    ...actions,
  };
}

export const requestStore = createRequestStore();

// Derived stores
export const pendingRequests = derived(
  requestStore,
  ($store) =>
    $store.data?.filter((request) => request.status === "pending") || [],
);
```

## Data Flow Patterns

### Store Usage in Components

```svelte
<!-- src/routes/dashboard/lockers/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { lockerStore, availableLockers } from '$lib/stores/locker';
  import { LockerCard } from '$lib/components/features';
  import { Button } from '$lib/components/ui';

  let loading = false;

  onMount(() => {
    lockerStore.fetch();
  });

  async function handleCreate() {
    loading = true;
    try {
      await lockerStore.create({
        number: `A${Math.floor(Math.random() * 1000)}`,
        status: 'available'
      });
    } finally {
      loading = false;
    }
  }
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Lockers</h1>
    <Button {loading} on:click={handleCreate}>
      Add Locker
    </Button>
  </div>

  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each $availableLockers as locker (locker.id)}
      <LockerCard {locker} />
    {/each}
  </div>
</div>
```

### Store Composition

```typescript
// src/lib/stores/dashboard.ts
import { derived } from "svelte/store";
import { lockerStore, availableLockers, occupiedLockers } from "./locker";
import { requestStore, pendingRequests } from "./request";

export const dashboardStats = derived(
  [availableLockers, occupiedLockers, pendingRequests],
  ([$available, $occupied, $pending]) => ({
    totalLockers: $available.length + $occupied.length,
    availableLockers: $available.length,
    occupiedLockers: $occupied.length,
    pendingRequests: $pending.length,
    occupancyRate: $occupied.length / ($available.length + $occupied.length),
  }),
);
```

## State Synchronization

### WebSocket Updates

```typescript
// src/lib/stores/sync.ts
import { lockerStore } from "./locker";
import { requestStore } from "./request";

interface WebSocketMessage {
  type: "locker" | "request";
  action: "create" | "update" | "delete";
  data: any;
}

export function initializeSync() {
  const ws = new WebSocket("wss://api.smartpalms.com/ws");

  ws.addEventListener("message", (event) => {
    const message: WebSocketMessage = JSON.parse(event.data);

    switch (message.type) {
      case "locker":
        handleLockerUpdate(message);
        break;
      case "request":
        handleRequestUpdate(message);
        break;
    }
  });

  return {
    disconnect: () => ws.close(),
  };
}

function handleLockerUpdate(message: WebSocketMessage) {
  const { action, data } = message;

  switch (action) {
    case "create":
      lockerStore.update((state) => ({
        ...state,
        data: [...(state.data || []), data],
      }));
      break;
    case "update":
      lockerStore.update((state) => ({
        ...state,
        data:
          state.data?.map((item) =>
            item.id === data.id ? { ...item, ...data } : item,
          ) || [],
      }));
      break;
    case "delete":
      lockerStore.update((state) => ({
        ...state,
        data: state.data?.filter((item) => item.id !== data.id) || [],
      }));
      break;
  }
}

function handleRequestUpdate(message: WebSocketMessage) {
  const { action, data } = message;

  switch (action) {
    case "create":
      requestStore.update((state) => ({
        ...state,
        data: [...(state.data || []), data],
      }));
      break;
    case "update":
      requestStore.update((state) => ({
        ...state,
        data:
          state.data?.map((item) =>
            item.id === data.id ? { ...item, ...data } : item,
          ) || [],
      }));
      break;
    case "delete":
      requestStore.update((state) => ({
        ...state,
        data: state.data?.filter((item) => item.id !== data.id) || [],
      }));
      break;
  }
}
```

## Performance Optimization

### Store Memoization

```typescript
// src/lib/stores/memo.ts
import { derived, type Readable } from "svelte/store";

export function memoize<T, U>(
  store: Readable<T>,
  selector: (value: T) => U,
  isEqual: (a: U, b: U) => boolean = (a, b) => a === b,
): Readable<U> {
  let previousValue: U;

  return derived(store, ($value, set) => {
    const nextValue = selector($value);
    if (!previousValue || !isEqual(previousValue, nextValue)) {
      previousValue = nextValue;
      set(nextValue);
    }
  });
}

// Usage
const expensiveComputation = memoize(
  lockerStore,
  ($store) => {
    // Expensive computation here
    return $store.data?.reduce(
      (acc, locker) => {
        // Complex calculations
        return acc;
      },
      {} as Record<string, number>,
    );
  },
  (a, b) => JSON.stringify(a) === JSON.stringify(b),
);
```

### Store Persistence

```typescript
// src/lib/stores/persist.ts
import { get } from "svelte/store";
import type { Writable } from "svelte/store";

export function persist<T>(store: Writable<T>, key: string): Writable<T> {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      store.set(JSON.parse(storedValue));
    } catch {
      localStorage.removeItem(key);
    }
  }

  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

// Usage
export const settings = persist(
  writable({
    theme: "light",
    notifications: true,
  }),
  "app_settings",
);
```

## Next Steps

- Explore error handling in [06_CORE_ERROR_HANDLING.md](./06_CORE_ERROR_HANDLING.md)
- Study TypeScript patterns in [07_ADVANCED_TYPESCRIPT.md](./07_ADVANCED_TYPESCRIPT.md)
- Learn about testing in [08_ADVANCED_TESTING.md](./08_ADVANCED_TESTING.md)
