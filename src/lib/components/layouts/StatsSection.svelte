<script lang="ts">
  import { Alert, Button } from "flowbite-svelte";
  import StatsCard from "$lib/components/ui/stats/StatsCard.svelte";
  
  export let stats = {
    totalLockers: 0,
    occupiedLockers: 0,
    totalUsers: 0,
    pendingRequests: 0
  };
  
  export let loading = false;
  export let error: string | null = null;
  export let onRetry = () => {};
</script>

{#if error}
  <Alert color="red" class="text-sm sm:text-base mb-4">
    {error}
    <Button color="red" class="ml-2 text-xs sm:text-sm" on:click={onRetry}>
      Retry
    </Button>
  </Alert>
{/if}

<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4">
  <StatsCard
    title="Total Lockers"
    value={stats.totalLockers}
    loading={loading}
  />
  <StatsCard
    title="Occupied Lockers"
    value={stats.occupiedLockers}
    loading={loading}
  />
  <StatsCard
    title="Total Users"
    value={stats.totalUsers}
    loading={loading}
  />
  <StatsCard
    title="Pending Requests"
    value={stats.pendingRequests}
    loading={loading}
  />
</div> 