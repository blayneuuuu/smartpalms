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
    Modal,
    Label,
    Input,
    Select,
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import {lockers, loading, errors} from "$lib/stores/admin";
  import {fetchLockers, fetchDashboardStats} from "$lib/services/admin";
  import type {LockerSize} from "$lib/server/db/schema";

  let showCreateDialog = false;
  let newLocker = {
    number: "",
    size: "" as LockerSize,
  };
  let creatingLocker = false;

  const lockerSizes: LockerSize[] = ["small", "medium", "large"];

  async function handleCreateLocker() {
    if (!newLocker.number || !newLocker.size) return;
    creatingLocker = true;
    try {
      const response = await fetch("/api/admin/lockers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocker),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create locker");
      }

      showCreateDialog = false;
      newLocker = {
        number: "",
        size: "" as LockerSize,
      };

      // Refresh data after successful action
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
    } catch (err) {
      console.error("Error creating locker:", err);
    } finally {
      creatingLocker = false;
    }
  }
</script>

{#if $errors.lockers}
  <Alert color="red" class="mb-4">
    {$errors.lockers}
  </Alert>
{/if}

<div class="flex justify-end mb-4">
  <Button color="blue" on:click={() => (showCreateDialog = true)}>
    Create Locker
  </Button>
</div>

{#if $loading.lockers}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $lockers.length === 0}
  <p class="text-gray-600">No lockers found.</p>
{:else}
  <Table>
    <TableHead>
      <TableHeadCell>Number</TableHeadCell>
      <TableHeadCell>Size</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>User</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $lockers as locker}
        <TableBodyRow>
          <TableBodyCell>#{locker.number}</TableBodyCell>
          <TableBodyCell>
            <Badge
              color={locker.size === "small"
                ? "blue"
                : locker.size === "medium"
                ? "yellow"
                : "red"}
            >
              {locker.size}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>
            <Badge color={locker.userId ? "red" : "green"}>
              {locker.userId ? "Occupied" : "Available"}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>
            {#if locker.userId}
              <div class="flex flex-col">
                <span>{locker.userName}</span>
                <span class="text-sm text-gray-500">{locker.userEmail}</span>
              </div>
            {:else}
              <span class="text-gray-500">-</span>
            {/if}
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}

<!-- Create Locker Dialog -->
<Modal bind:open={showCreateDialog} size="md" autoclose>
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Create New Locker
    </h3>
  </div>

  <div class="space-y-4">
    <div>
      <Label for="lockerNumber">Locker Number</Label>
      <Input
        id="lockerNumber"
        placeholder="Enter locker number"
        bind:value={newLocker.number}
      />
    </div>

    <div>
      <Label for="lockerSize">Size</Label>
      <Select id="lockerSize" bind:value={newLocker.size}>
        <option value="">Select size</option>
        {#each lockerSizes as size}
          <option value={size}>{size}</option>
        {/each}
      </Select>
    </div>
  </div>

  <div class="flex justify-end gap-4 mt-6">
    <Button
      color="alternative"
      disabled={creatingLocker}
      on:click={() => {
        showCreateDialog = false;
        newLocker = {
          number: "",
          size: "" as LockerSize,
        };
      }}
    >
      Cancel
    </Button>
    <Button
      color="blue"
      disabled={!newLocker.number || !newLocker.size || creatingLocker}
      on:click={handleCreateLocker}
    >
      {creatingLocker ? 'Creating...' : 'Create'}
    </Button>
  </div>
</Modal> 