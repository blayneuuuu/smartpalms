<script lang="ts">
  import { Button, Badge } from "flowbite-svelte";
  import SessionTimeout from "$lib/components/SessionTimeout.svelte";
  import Notifications from "$lib/components/Notifications.svelte";

  export let title = "Dashboard";
  export let userName = "";
  export let userType: "admin" | "user" = "user";
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Notifications -->
  <Notifications />
  
  <header class="bg-white shadow-sm">
    <div class="flex flex-col sm:flex-row justify-between py-4 px-4 md:px-6 lg:px-8 xl:px-16 items-center space-y-2 sm:space-y-0">
      <div class="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-1">
        <div class="flex items-center">
          <img src="/logo.png" alt="SmartPalms Logo" class="h-32 mr-3" />
        </div>
        <h2 class="text-lg sm:text-xl sm:ml-2 font-light text-gray-900">
          {title}
        </h2>
      </div>
      <div class="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 sm:gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm sm:text-base font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
            {userName}
          </span>
          {#if userType === "admin"}
            <Badge color="red">Admin</Badge>
          {/if}
        </div>
        <div class="flex gap-1 sm:gap-2">
          <Button size="xs" class="sm:hidden" href="/profile" color="light">Profile</Button>
          <Button size="sm" class="hidden sm:inline-flex" href="/profile" color="light">Profile</Button>
          <Button size="xs" class="sm:hidden" href="/logout" color="light">Sign out</Button>
          <Button size="sm" class="hidden sm:inline-flex" href="/logout" color="light">Sign out</Button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-8 max-w-7xl">
    <slot />
  </main>
  
  <!-- Session timeout component -->
  <SessionTimeout />
</div> 