<script lang="ts">
  import {Card} from "flowbite-svelte";

  let {title, value, loading} = $props<{
    title: string;
    value: number;
    loading: boolean;
  }>();
</script>

<Card padding="sm">
  <div class="flex flex-col items-center">
    <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
    {#if loading}
      <div class="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2" />
    {:else}
      <p class="text-3xl font-bold text-gray-700">{value}</p>
    {/if}
  </div>
</Card> 