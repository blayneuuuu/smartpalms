<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Badge,
    Button,
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import { accessHistory, loading, errors } from "$lib/stores/admin";
  import { fetchAccessHistory } from "$lib/services/admin";
  import { formatTimestamp } from "$lib/utils/date";
  
  // Load data when the component is mounted
  $effect(() => {
    fetchAccessHistory();
  });
  
  function refreshData() {
    fetchAccessHistory();
  }
</script>

{#if $errors.accessHistory}
  <Alert color="red" class="mb-4">
    {$errors.accessHistory}
  </Alert>
{/if}

<div class="flex justify-end mb-4">
  <Button color="blue" on:click={refreshData}>
    Refresh
  </Button>
</div>

{#if $loading.accessHistory}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $accessHistory.length === 0}
  <p class="text-gray-600">No access history found.</p>
{:else}
  <div class="overflow-x-auto">
    <Table striped={true}>
      <TableHead>
        <TableHeadCell>Locker #</TableHeadCell>
        <TableHeadCell>Access Type</TableHeadCell>
        <TableHeadCell>OTP</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Date & Time</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each $accessHistory as entry}
          <TableBodyRow>
            <TableBodyCell>{entry.lockerNumber}</TableBodyCell>
            <TableBodyCell>
              <Badge
                color={entry.accessType === "otp" ? "blue" : "green"}
              >
                {entry.accessType === "otp" ? "OTP" : "Subscription"}
              </Badge>
            </TableBodyCell>
            <TableBodyCell>
              {entry.otp || "—"}
            </TableBodyCell>
            <TableBodyCell>
              <Badge
                color={entry.status === "success" ? "green" : "red"}
              >
                {entry.status}
              </Badge>
            </TableBodyCell>
            <TableBodyCell>
              {formatTimestamp(entry.accessedAt)}
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if} 