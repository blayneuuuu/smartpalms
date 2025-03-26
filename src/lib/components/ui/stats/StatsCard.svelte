<script lang="ts">
  import {Card} from "flowbite-svelte";

  export let title = "";
  export let value = 0;
  export let loading = false;
  export let color = "gray-700";
</script>

<Card padding="sm" class="h-full">
  <div class="flex flex-col items-center justify-center h-full">
    <h3 class="text-base sm:text-lg font-semibold text-gray-900 text-center">{title}</h3>
    {#if loading}
      <div class="animate-pulse h-6 sm:h-8 w-12 sm:w-16 bg-gray-200 rounded mt-2" />
    {:else}
      <p class="text-xl sm:text-2xl md:text-3xl font-bold text-{color} mt-1">{value}</p>
    {/if}
  </div>
</Card> 