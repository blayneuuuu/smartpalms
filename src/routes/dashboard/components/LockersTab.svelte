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
  let showChangeOwnerDialog = false;
  let newLocker = {
    number: "",
    size: "" as LockerSize,
  };
  let selectedLocker = $state<any>(null);
  let newOwnerId = $state("");
  let creatingLocker = false;
  let updatingOwnership = false;
  let users = $state<any[]>([]);
  let loadingUsers = $state(false);

  const lockerSizes: LockerSize[] = ["small", "medium", "large"];

  // Define a type for locker
  type Locker = {
    id: string;
    number: string;
    size: LockerSize;
    isOccupied: boolean;
    userId: string | null;
    userName: string | null;
    userEmail?: string | null;
  }

  // Fetch users for owner selection
  async function fetchUsers() {
    loadingUsers = true;
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      users = data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      loadingUsers = false;
    }
  }

  // Open change owner dialog
  function openChangeOwnerDialog(locker: Locker) {
    try {
      console.log("Opening change owner dialog for locker:", locker);
      selectedLocker = locker;
      newOwnerId = locker.userId || "";
      showChangeOwnerDialog = true;
      console.log("Modal should be open now, showChangeOwnerDialog =", showChangeOwnerDialog);
      fetchUsers();
    } catch (error) {
      console.error("Error in openChangeOwnerDialog:", error);
      alert("Failed to open change owner dialog. Check console for details.");
    }
  }

  // Handle change owner
  async function handleChangeOwner() {
    if (!selectedLocker) return;
    
    updatingOwnership = true;
    try {
      console.log("Changing ownership for locker:", selectedLocker.id, "to user:", newOwnerId || "none");
      
      const response = await fetch(`/api/admin/lockers/${selectedLocker.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: newOwnerId || null,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.message || "Failed to update locker ownership");
      }
      
      console.log("Ownership update response:", data);

      showChangeOwnerDialog = false;
      selectedLocker = null;
      newOwnerId = "";

      // Refresh data after successful action
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
    } catch (err) {
      console.error("Error updating locker ownership:", err);
      alert(err instanceof Error ? err.message : "Failed to update ownership");
    } finally {
      updatingOwnership = false;
    }
  }

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
      alert(err instanceof Error ? err.message : "Failed to create locker");
    } finally {
      creatingLocker = false;
    }
  }

  // Direct change owner (bypassing modal)
  async function onDirectChangeOwner(locker: Locker, newUserId: string | null) {
    try {
      console.log("Directly changing ownership for locker:", locker.id, "to user:", newUserId || "none");
      
      const response = await fetch(`/api/admin/lockers/${locker.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: newUserId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.message || "Failed to update locker ownership");
      }
      
      console.log("Ownership update response:", data);

      // Refresh data after successful action
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
      alert("Locker ownership updated successfully");
    } catch (err) {
      console.error("Error updating locker ownership:", err);
      alert(err instanceof Error ? err.message : "Failed to update ownership");
    }
  }

  $effect(() => {
    // Fetch all users when component initializes
    fetchAllUsers();
  });
  
  // Fetch all users immediately on component initialization
  async function fetchAllUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      users = data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users. Some features may not work properly.");
    }
  }
</script>

{#if $errors.lockers}
  <Alert color="red" class="mb-4">
    {$errors.lockers}
  </Alert>
{/if}

<div class="flex justify-end mb-4">
  <Button color="green" class="mr-2" on:click={() => Promise.all([fetchLockers(), fetchDashboardStats()])}>
    Refresh
  </Button>
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
  <div class="overflow-x-auto">
    <Table striped={true} class="text-xs sm:text-sm md:text-base">
      <TableHead>
        <TableHeadCell>Number</TableHeadCell>
        <TableHeadCell>Size</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell class="hidden sm:table-cell">User</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
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
              <div class="flex flex-col gap-1">
                <Badge color={locker.userId ? "red" : "green"}>
                  {locker.userId ? "Occupied" : "Available"}
                </Badge>
                
                <!-- Mobile user info (visible only on small screens) -->
                {#if locker.userId}
                  <div class="sm:hidden mt-1 text-xs">
                    <span class="font-semibold">Owner:</span>
                    <div class="truncate max-w-[120px]">{locker.userName}</div>
                  </div>
                {/if}
              </div>
            </TableBodyCell>
            <TableBodyCell class="hidden sm:table-cell">
              {#if locker.userId}
                <div class="flex flex-col">
                  <span class="truncate max-w-[150px] md:max-w-none">{locker.userName}</span>
                  <span class="text-sm text-gray-500 truncate max-w-[150px] md:max-w-none">{locker.userEmail}</span>
                </div>
              {:else}
                <span class="text-gray-500">-</span>
              {/if}
            </TableBodyCell>
            <TableBodyCell>
              <div class="flex flex-col gap-1">
                {#if !locker.userId}
                  <Button 
                    color="light" 
                    size="xs" 
                    class="text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-2.5"
                    on:click={() => {
                      console.log("Change Owner button clicked for locker:", locker);
                      openChangeOwnerDialog(locker);
                    }}
                  >
                    Change Owner
                  </Button>
                  
                  <div class="mt-1">
                    <Select 
                      id={`quickOwner-${locker.id}`} 
                      size="sm"
                      class="text-xs py-1"
                      on:change={(e) => {
                        const target = e.target as HTMLSelectElement;
                        const userId = target?.value;
                        if (userId) {
                          onDirectChangeOwner(locker, userId);
                        }
                      }}
                    >
                      <option value="">Quick assign...</option>
                      {#each users as user}
                        <option value={user.id}>{user.name}</option>
                      {/each}
                    </Select>
                  </div>
                {:else}
                  <Button 
                    color="red" 
                    size="xs"
                    class="text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-2.5"
                    on:click={() => onDirectChangeOwner(locker, null)}
                  >
                    Remove Owner
                  </Button>
                {/if}
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
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

<!-- Change Owner Dialog -->
<Modal bind:open={showChangeOwnerDialog} size="md" autoclose={false}>
  <svelte:fragment slot="header">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
      Change Locker Owner
    </h3>
  </svelte:fragment>
  
  <div class="text-center mb-5">
    {#if selectedLocker}
      <p class="mb-2 text-sm">
        Locker #{selectedLocker.number} ({selectedLocker.size})
      </p>
      <p class="mb-5 text-sm">
        Current owner: {selectedLocker.userId ? selectedLocker.userName : 'None'}
      </p>
    {/if}
  </div>

  <div class="space-y-4">
    <div>
      <Label for="newOwner">New Owner</Label>
      {#if loadingUsers}
        <div class="flex justify-center py-4">
          <Spinner size="4" />
        </div>
      {:else}
        <Select id="newOwner" bind:value={newOwnerId}>
          <option value="">None (Remove Ownership)</option>
          {#each users as user}
            <option value={user.id}>{user.name} ({user.email})</option>
          {/each}
        </Select>
      {/if}
    </div>
  </div>

  <div class="flex justify-end gap-4 mt-6">
    <Button
      color="alternative"
      disabled={updatingOwnership}
      on:click={() => {
        showChangeOwnerDialog = false;
        selectedLocker = null;
        newOwnerId = "";
      }}
    >
      Cancel
    </Button>
    <Button
      color="blue"
      disabled={updatingOwnership}
      on:click={handleChangeOwner}
    >
      {updatingOwnership ? 'Updating...' : 'Update Owner'}
    </Button>
  </div>
</Modal> 