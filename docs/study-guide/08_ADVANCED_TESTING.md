# Advanced Testing Strategies

This document explains the advanced testing strategies and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Integration Testing](#integration-testing)
3. [End-to-End Testing](#end-to-end-testing)
4. [Performance Testing](#performance-testing)
5. [Test Automation](#test-automation)

## Testing Strategy

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
      ],
    },
  },
});

// src/test/setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/svelte";
import { vi } from "vitest";
import { db } from "$lib/server/db";

// Mock fetch
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Reset database between tests
afterEach(async () => {
  await db.transaction(async (tx) => {
    await tx.delete(lockers).execute();
    await tx.delete(requests).execute();
  });
});
```

### Test Utilities

```typescript
// src/test/utils.ts
import type { ComponentType } from "svelte";
import { render, type RenderResult } from "@testing-library/svelte";
import { get } from "svelte/store";
import type { Mock } from "vitest";

export function mockFetch(response: any) {
  (fetch as Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => response,
  });
}

export function mockFetchError(status: number, message: string) {
  (fetch as Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({
      error: { message },
    }),
  });
}

export async function renderWithContext<T>(
  Component: ComponentType<T>,
  props?: Partial<T>,
): Promise<RenderResult> {
  const result = render(Component, {
    props: props as T,
  });

  // Wait for next tick to allow stores to update
  await tick();

  return result;
}

export function getStoreValue<T>(store: { subscribe: Function }) {
  return get(store as { subscribe: Function }) as T;
}
```

## Integration Testing

### API Integration Tests

```typescript
// src/routes/api/lockers/+server.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "./+server";
import { db } from "$lib/server/db";
import { createTestContext } from "$test/context";
import type { Locker } from "$lib/types";

describe("Locker API", () => {
  const ctx = createTestContext();

  beforeEach(async () => {
    await db.delete(lockers).execute();
  });

  describe("GET /api/lockers", () => {
    it("should return all lockers", async () => {
      // Arrange
      const testLockers: Locker[] = [
        {
          id: "1",
          number: "A1",
          status: "available",
        },
        {
          id: "2",
          number: "A2",
          status: "occupied",
        },
      ];

      await db.insert(lockers).values(testLockers);

      // Act
      const response = await GET(ctx.createRequest());
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data).toEqual(expect.arrayContaining(testLockers));
    });

    it("should filter by status", async () => {
      // Arrange
      const testLockers: Locker[] = [
        {
          id: "1",
          number: "A1",
          status: "available",
        },
        {
          id: "2",
          number: "A2",
          status: "occupied",
        },
      ];

      await db.insert(lockers).values(testLockers);

      // Act
      const response = await GET(ctx.createRequest({ status: "available" }));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe("available");
    });
  });

  describe("POST /api/lockers", () => {
    it("should create a new locker", async () => {
      // Arrange
      const newLocker = {
        number: "A1",
        status: "available",
      };

      // Act
      const response = await POST(ctx.createRequest(newLocker));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toMatchObject(newLocker);
      expect(data.id).toBeDefined();

      // Verify database
      const stored = await db.query.lockers.findFirst({
        where: eq(lockers.id, data.id),
      });
      expect(stored).toMatchObject(newLocker);
    });

    it("should validate input", async () => {
      // Arrange
      const invalidLocker = {
        number: "",
        status: "invalid",
      };

      // Act
      const response = await POST(ctx.createRequest(invalidLocker));
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
```

### Store Integration Tests

```typescript
// src/lib/stores/locker.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { lockerStore } from "./locker";
import { mockFetch, getStoreValue } from "$test/utils";

describe("Locker Store", () => {
  beforeEach(() => {
    lockerStore.reset();
  });

  describe("fetch", () => {
    it("should fetch and store lockers", async () => {
      // Arrange
      const testLockers = [
        { id: "1", number: "A1", status: "available" },
        { id: "2", number: "A2", status: "occupied" },
      ];
      mockFetch(testLockers);

      // Act
      await lockerStore.fetch();
      const state = getStoreValue(lockerStore);

      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(testLockers);
    });

    it("should handle fetch errors", async () => {
      // Arrange
      mockFetchError(500, "Server error");

      // Act
      await lockerStore.fetch();
      const state = getStoreValue(lockerStore);

      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBeDefined();
      expect(state.error?.message).toBe("Server error");
      expect(state.data).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and store a new locker", async () => {
      // Arrange
      const newLocker = {
        number: "A1",
        status: "available",
      };
      const createdLocker = {
        ...newLocker,
        id: "1",
      };
      mockFetch(createdLocker);

      // Act
      const result = await lockerStore.create(newLocker);
      const state = getStoreValue(lockerStore);

      // Assert
      expect(result).toEqual(createdLocker);
      expect(state.data).toContainEqual(createdLocker);
    });
  });
});
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
  },
  testDir: "tests/e2e",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "webkit",
      use: { browserName: "webkit" },
    },
  ],
};

export default config;
```

### E2E Test Cases

```typescript
// tests/e2e/locker-request.test.ts
import { test, expect } from "@playwright/test";
import { createTestUser, loginAsUser } from "./helpers";

test.describe("Locker Request Flow", () => {
  test.beforeEach(async ({ page }) => {
    const user = await createTestUser();
    await loginAsUser(page, user);
  });

  test("should allow user to request a locker", async ({ page }) => {
    // Navigate to lockers page
    await page.goto("/lockers");

    // Find available locker
    const lockerCard = page
      .locator('[data-testid="locker-card"]')
      .filter({ hasText: "Available" })
      .first();

    // Click request button
    await lockerCard.locator("button", { hasText: "Request" }).click();

    // Fill request form
    await page
      .locator('[data-testid="request-form"]')
      .locator('input[name="duration"]')
      .fill("7");
    await page.locator("button", { hasText: "Submit" }).click();

    // Verify success message
    await expect(page.locator('[role="alert"]')).toHaveText(
      /Request submitted successfully/,
    );

    // Verify request appears in user's requests
    await page.goto("/requests");
    await expect(page.locator('[data-testid="request-list"]')).toContainText(
      "Pending",
    );
  });

  test("should prevent duplicate requests", async ({ page }) => {
    // Navigate to lockers page
    await page.goto("/lockers");

    // Request same locker twice
    const lockerCard = page
      .locator('[data-testid="locker-card"]')
      .filter({ hasText: "Available" })
      .first();

    // First request
    await lockerCard.locator("button", { hasText: "Request" }).click();
    await page
      .locator('[data-testid="request-form"]')
      .locator('input[name="duration"]')
      .fill("7");
    await page.locator("button", { hasText: "Submit" }).click();

    // Try second request
    await lockerCard.locator("button", { hasText: "Request" }).click();

    // Verify error message
    await expect(page.locator('[role="alert"]')).toHaveText(
      /already have a pending request/,
    );
  });
});
```

## Performance Testing

### Load Testing

```typescript
// tests/performance/load.test.ts
import { check } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up
    { duration: "1m", target: 20 }, // Stay at peak
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% can fail
  },
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const responses = http.batch([
    ["GET", `${BASE_URL}/api/lockers`],
    ["GET", `${BASE_URL}/api/requests`],
  ]);

  check(responses[0], {
    "lockers status 200": (r) => r.status === 200,
    "lockers response time OK": (r) => r.timings.duration < 500,
  });

  check(responses[1], {
    "requests status 200": (r) => r.status === 200,
    "requests response time OK": (r) => r.timings.duration < 500,
  });
}
```

### Component Performance

```typescript
// src/lib/components/LockerGrid.test.ts
import { describe, it, expect } from "vitest";
import { renderWithContext } from "$test/utils";
import LockerGrid from "./LockerGrid.svelte";
import { performance } from "perf_hooks";

describe("LockerGrid Performance", () => {
  it("should render large lists efficiently", async () => {
    // Arrange
    const lockers = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      number: `A${i}`,
      status: "available",
    }));

    // Act
    const start = performance.now();
    const { container } = await renderWithContext(LockerGrid, {
      lockers,
    });
    const duration = performance.now() - start;

    // Assert
    expect(duration).toBeLessThan(100); // Should render in under 100ms
    expect(
      container.querySelectorAll('[data-testid="locker-card"]'),
    ).toHaveLength(1000);
  });

  it("should handle frequent updates efficiently", async () => {
    // Arrange
    const { component } = await renderWithContext(LockerGrid, {
      lockers: [],
    });

    // Act
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      component.$set({
        lockers: [{ id: "1", number: "A1", status: "available" }],
      });
      await tick();
    }
    const duration = performance.now() - start;

    // Assert
    expect(duration).toBeLessThan(500); // Updates should be fast
  });
});
```

## Test Automation

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: |
            coverage/
            playwright-report/

  performance:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v2

      - name: Setup k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load tests
        run: k6 run tests/performance/load.test.ts
```

## Next Steps

- Explore deployment in [09_ADVANCED_DEPLOYMENT.md](./09_ADVANCED_DEPLOYMENT.md)
- Study security patterns in [10_ADVANCED_SECURITY.md](./10_ADVANCED_SECURITY.md)
- Review error handling in [06_CORE_ERROR_HANDLING.md](./06_CORE_ERROR_HANDLING.md)
