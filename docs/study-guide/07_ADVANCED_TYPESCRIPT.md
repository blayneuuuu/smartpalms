# Advanced TypeScript Patterns

This document explains the advanced TypeScript patterns and implementation strategies used in the Smart Palms project.

## Table of Contents

1. [Advanced Type System](#advanced-type-system)
2. [Generic Patterns](#generic-patterns)
3. [Type Guards and Assertions](#type-guards-and-assertions)
4. [Utility Types](#utility-types)
5. [Performance Considerations](#performance-considerations)

## Advanced Type System

### Discriminated Unions

```typescript
// src/lib/types/events.ts
interface BaseEvent {
  timestamp: number;
  userId: string;
}

interface LockerAssignedEvent extends BaseEvent {
  type: "locker_assigned";
  lockerId: string;
}

interface LockerReleasedEvent extends BaseEvent {
  type: "locker_released";
  lockerId: string;
}

interface RequestCreatedEvent extends BaseEvent {
  type: "request_created";
  requestId: string;
  lockerId: string;
}

interface RequestProcessedEvent extends BaseEvent {
  type: "request_processed";
  requestId: string;
  status: "approved" | "rejected";
}

type SystemEvent =
  | LockerAssignedEvent
  | LockerReleasedEvent
  | RequestCreatedEvent
  | RequestProcessedEvent;

// Event handler
function handleEvent(event: SystemEvent) {
  switch (event.type) {
    case "locker_assigned":
      return handleLockerAssigned(event);
    case "locker_released":
      return handleLockerReleased(event);
    case "request_created":
      return handleRequestCreated(event);
    case "request_processed":
      return handleRequestProcessed(event);
  }
}
```

### Mapped Types

```typescript
// src/lib/types/api.ts
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type APIEndpoints = {
  "/lockers": {
    GET: {
      response: Locker[];
      query: { status?: LockerStatus };
    };
    POST: {
      body: CreateLockerDTO;
      response: Locker;
    };
  };
  "/lockers/:id": {
    GET: {
      response: Locker;
      params: { id: string };
    };
    PUT: {
      body: UpdateLockerDTO;
      response: Locker;
      params: { id: string };
    };
    DELETE: {
      params: { id: string };
      response: void;
    };
  };
};

type EndpointConfig<
  Path extends keyof APIEndpoints,
  Method extends keyof APIEndpoints[Path],
> = APIEndpoints[Path][Method];

type APIResponse<
  Path extends keyof APIEndpoints,
  Method extends keyof APIEndpoints[Path],
> = EndpointConfig<Path, Method>["response"];

// Usage
async function apiRequest<
  Path extends keyof APIEndpoints,
  Method extends keyof APIEndpoints[Path],
>(
  path: Path,
  method: Method,
  config?: Omit<EndpointConfig<Path, Method>, "response">,
): Promise<APIResponse<Path, Method>> {
  // Implementation
}
```

## Generic Patterns

### Higher-Order Components

```typescript
// src/lib/hoc/withLoading.ts
import type { ComponentType } from "svelte";

export interface WithLoadingProps {
  loading?: boolean;
}

export function withLoading<T extends WithLoadingProps>(
  Component: ComponentType<T>,
) {
  return function LoadingWrapper(
    props: Omit<T, keyof WithLoadingProps> & WithLoadingProps,
  ) {
    const { loading = false, ...rest } = props;

    if (loading) {
      return {
        component: Spinner,
        props: {},
      };
    }

    return {
      component: Component,
      props: rest as T,
    };
  };
}

// Usage
const LoadingButton = withLoading(Button);
```

### Generic Store Factory

```typescript
// src/lib/stores/factory.ts
import { writable, derived, type Readable } from "svelte/store";

interface EntityState<T> {
  items: Record<string, T>;
  ids: string[];
  loading: boolean;
  error: Error | null;
}

export function createEntityStore<T extends { id: string }>() {
  const initialState: EntityState<T> = {
    items: {},
    ids: [],
    loading: false,
    error: null,
  };

  const store = writable(initialState);

  function upsertOne(entity: T) {
    store.update((state) => {
      const items = { ...state.items, [entity.id]: entity };
      const ids = Array.from(new Set([...state.ids, entity.id]));
      return { ...state, items, ids };
    });
  }

  function upsertMany(entities: T[]) {
    store.update((state) => {
      const items = entities.reduce(
        (acc, entity) => ({ ...acc, [entity.id]: entity }),
        { ...state.items },
      );
      const ids = Array.from(
        new Set([...state.ids, ...entities.map((e) => e.id)]),
      );
      return { ...state, items, ids };
    });
  }

  function removeOne(id: string) {
    store.update((state) => {
      const { [id]: removed, ...items } = state.items;
      const ids = state.ids.filter((i) => i !== id);
      return { ...state, items, ids };
    });
  }

  const selectors = {
    selectAll: derived(store, ($store) =>
      $store.ids.map((id) => $store.items[id]),
    ),
    selectById: (id: string): Readable<T | undefined> =>
      derived(store, ($store) => $store.items[id]),
    selectIds: derived(store, ($store) => $store.ids),
    selectLoading: derived(store, ($store) => $store.loading),
    selectError: derived(store, ($store) => $store.error),
  };

  return {
    subscribe: store.subscribe,
    upsertOne,
    upsertMany,
    removeOne,
    ...selectors,
  };
}

// Usage
const lockerStore = createEntityStore<Locker>();
const requestStore = createEntityStore<LockerRequest>();
```

## Type Guards and Assertions

### Advanced Type Guards

```typescript
// src/lib/types/guards.ts
type Primitive = string | number | boolean | null | undefined;

export function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function hasProperty<K extends string>(
  value: unknown,
  property: K,
): value is Record<K, unknown> {
  return isRecord(value) && property in value;
}

export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

// Usage
function processEvent(event: unknown): SystemEvent {
  if (
    isRecord(event) &&
    hasProperty(event, "type") &&
    typeof event.type === "string"
  ) {
    switch (event.type) {
      case "locker_assigned":
        if (
          hasProperty(event, "lockerId") &&
          typeof event.lockerId === "string"
        ) {
          return event as LockerAssignedEvent;
        }
        break;
      // ... other cases
    }
  }
  throw new Error("Invalid event format");
}
```

## Utility Types

### Advanced Utility Types

```typescript
// src/lib/types/utils.ts
export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequireOnlyOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends Record<string, any>
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends Record<string, any>
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

// Usage
interface UpdateLockerDTO {
  number?: string;
  status?: LockerStatus;
  userId?: string | null;
}

type RequiredUpdateLockerDTO = RequireAtLeastOne<UpdateLockerDTO>;

function updateLocker(id: string, data: RequiredUpdateLockerDTO) {
  // At least one field must be provided
}
```

## Performance Considerations

### Type-Level Computation

```typescript
// src/lib/types/compute.ts
type ComputeDeep<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<ComputeDeep<U>>
    : T extends Record<string, any>
      ? { [K in keyof T]: ComputeDeep<T[K]> }
      : T;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// Usage with complex types
type ComplexType = ComputeDeep<
  DeepPartial<Locker> & { metadata: Record<string, unknown> }
>;

type CombinedConfig = UnionToIntersection<
  | { database: { url: string } }
  | { api: { endpoint: string } }
  | { auth: { key: string } }
>;
```

### Type Inference

```typescript
// src/lib/types/inference.ts
type InferEventType<T> = T extends { type: infer U } ? U : never;

type InferResponseType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : never;

type InferStoreValue<T> = T extends Readable<infer U> ? U : never;

// Usage
type EventTypes = InferEventType<SystemEvent>; // Union of all event types

async function fetchData() {
  return { value: 42 };
}
type FetchResult = InferResponseType<typeof fetchData>; // { value: number }

type UserStoreValue = InferStoreValue<typeof userStore>; // User | null
```

## Next Steps

- Learn about testing in [08_ADVANCED_TESTING.md](./08_ADVANCED_TESTING.md)
- Explore deployment in [09_ADVANCED_DEPLOYMENT.md](./09_ADVANCED_DEPLOYMENT.md)
- Study security patterns in [10_ADVANCED_SECURITY.md](./10_ADVANCED_SECURITY.md)
