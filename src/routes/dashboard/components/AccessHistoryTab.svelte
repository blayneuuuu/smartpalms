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
  
  // Function to format SQLite timestamp
  function formatSQLiteTimestamp(timestamp: number | string): string {
    // If timestamp is a string, convert it to a number
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Check if the timestamp needs multiplication (SQLite stores timestamps in seconds)
    const milliseconds = timestampNum < 10000000000 ? timestampNum * 1000 : timestampNum;
    
    const d = new Date(milliseconds);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
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
        <TableHeadCell>User</TableHeadCell>
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
              {#if entry.userName}
                <div class="flex flex-col">
                  <span class="font-medium">{entry.userName}</span>
                  <span class="text-xs text-gray-500">{entry.userEmail}</span>
                </div>
              {:else}
                <span class="text-gray-500">Unknown User</span>
              {/if}
            </TableBodyCell>
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
              {formatSQLiteTimestamp(entry.accessedAt)}
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if} 