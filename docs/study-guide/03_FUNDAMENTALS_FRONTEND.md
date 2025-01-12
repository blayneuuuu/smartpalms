# Frontend Fundamentals

This document explains the fundamental frontend concepts and implementation patterns used in the Smart Palms project.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Routing](#routing)
3. [State Management Basics](#state-management-basics)
4. [UI Components](#ui-components)
5. [Performance Fundamentals](#performance-fundamentals)

## Component Architecture

### Base Components

```svelte
<!-- src/lib/components/ui/Button.svelte -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';
  import { Loader2 } from 'lucide-svelte';

  type $$Props = HTMLButtonAttributes & {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
  };

  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'md';
  export let loading = false;
  export let disabled = false;

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg'
  };
</script>

<button
  class={cn(
    baseStyles,
    variants[variant],
    sizes[size],
    $$props.class
  )}
  {disabled}
  on:click
  {...$$restProps}
>
  {#if loading}
    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
  {/if}
  <slot />
</button>
```

### Feature Components

```svelte
<!-- src/lib/components/features/LockerCard.svelte -->
<script lang="ts">
  import { Button } from '$lib/components/ui';
  import type { Locker } from '$lib/types';

  export let locker: Locker;
  export let onAssign: (id: string) => Promise<void>;

  let loading = false;

  async function handleAssign() {
    loading = true;
    try {
      await onAssign(locker.id);
    } finally {
      loading = false;
    }
  }
</script>

<div class="rounded-lg border p-4 shadow-sm">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-medium">Locker {locker.number}</h3>
      <p class="text-sm text-muted-foreground">
        Status: {locker.status}
      </p>
    </div>

    {#if locker.status === 'available'}
      <Button
        variant="outline"
        size="sm"
        {loading}
        on:click={handleAssign}
      >
        Assign
      </Button>
    {/if}
  </div>
</div>
```

## Routing

### File-Based Routing

```plaintext
src/routes/
├── +layout.svelte           # Root layout
├── +page.svelte            # Home page
├── dashboard/
│   ├── +layout.svelte      # Dashboard layout
│   ├── +page.svelte        # Dashboard home
│   └── lockers/
│       └── +page.svelte    # Lockers management
└── auth/
    ├── sign-in/
    │   └── +page.svelte    # Sign in page
    └── sign-up/
        └── +page.svelte    # Sign up page
```

### Layout Files

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { ClerkProvider } from '@clerk/svelte';
  import '../app.css';

  export let data;
</script>

<ClerkProvider {data}>
  <div class="min-h-screen bg-background">
    <slot />
  </div>
</ClerkProvider>

<!-- src/routes/dashboard/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { UserButton } from '@clerk/svelte';
  import { Sidebar } from '$lib/components/dashboard';

  export let data;
</script>

<div class="grid min-h-screen grid-cols-[240px_1fr]">
  <Sidebar currentPath={$page.url.pathname} />

  <div class="flex flex-col">
    <header class="border-b px-6 py-3">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-medium">
          Dashboard
        </h1>
        <UserButton />
      </div>
    </header>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</div>
```

### Route Guards

```typescript
// src/routes/dashboard/+layout.ts
import {redirect} from "@sveltejs/kit";
import type {LayoutLoad} from "./$types";

export const load: LayoutLoad = async ({parent}) => {
  const {user} = await parent();

  if (!user) {
    throw redirect(303, "/auth/sign-in");
  }

  return {
    user,
  };
};
```

## State Management Basics

### Reactive Declarations

```svelte
<script lang="ts">
  export let items: number[] = [];

  // Reactive values update automatically
  $: total = items.reduce((sum, item) => sum + item, 0);
  $: average = items.length ? total / items.length : 0;

  // Reactive statements
  $: if (total > 100) {
    console.log('Total exceeds 100!');
  }
</script>

<div>
  <p>Total: {total}</p>
  <p>Average: {average}</p>
</div>
```

### Component State

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui';
  import type { Locker } from '$lib/types';

  export let initialLockers: Locker[] = [];

  let lockers = initialLockers;
  let searchQuery = '';
  let loading = false;

  $: filteredLockers = lockers.filter(locker =>
    locker.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function refreshLockers() {
    loading = true;
    try {
      const response = await fetch('/api/lockers');
      lockers = await response.json();
    } finally {
      loading = false;
    }
  }
</script>

<div>
  <div class="flex gap-4 mb-4">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search lockers..."
      class="px-3 py-2 border rounded"
    />
    <Button
      variant="outline"
      {loading}
      on:click={refreshLockers}
    >
      Refresh
    </Button>
  </div>

  <div class="grid gap-4">
    {#each filteredLockers as locker (locker.id)}
      <LockerCard {locker} />
    {/each}
  </div>
</div>
```

## UI Components

### Component Library Setup

```typescript
// src/lib/components/ui/index.ts
export {default as Button} from "./Button.svelte";
export {default as Card} from "./Card.svelte";
export {default as Input} from "./Input.svelte";
export {default as Select} from "./Select.svelte";
export {default as Spinner} from "./Spinner.svelte";
```

### Styling with Tailwind

```typescript
// tailwind.config.js
import {fontFamily} from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other color variables
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### Form Components

```svelte
<!-- src/lib/components/ui/Input.svelte -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLInputAttributes;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<input
  class={cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...$$restProps}
/>
```

## Performance Fundamentals

### Code Splitting

```typescript
// src/routes/dashboard/+page.ts
export const load = async () => {
  // Dynamic imports for code splitting
  const [{default: Chart}, {default: DataGrid}] = await Promise.all([
    import("$lib/components/Chart.svelte"),
    import("$lib/components/DataGrid.svelte"),
  ]);

  return {
    components: {
      Chart,
      DataGrid,
    },
  };
};
```

### Loading States

```svelte
<!-- src/lib/components/ui/AsyncData.svelte -->
<script lang="ts">
  import { Spinner } from '$lib/components/ui';

  export let loading = false;
  export let error: Error | null = null;
</script>

{#if loading}
  <div class="flex justify-center p-4">
    <Spinner />
  </div>
{:else if error}
  <div class="rounded-md bg-destructive/15 p-4 text-destructive">
    {error.message}
  </div>
{:else}
  <slot />
{/if}
```

## Next Steps

- Study authentication in [04_CORE_AUTHENTICATION.md](./04_CORE_AUTHENTICATION.md)
- Learn about state management in [05_CORE_STATE.md](./05_CORE_STATE.md)
- Explore error handling in [06_CORE_ERROR_HANDLING.md](./06_CORE_ERROR_HANDLING.md)
