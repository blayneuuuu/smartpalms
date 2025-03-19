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
    Select,
    Alert,
    Spinner,
    Input,
  } from "flowbite-svelte";
  import { formatDate } from "$lib/utils/date";
  
  // Type definitions
  type Subscription = {
    id: string;
    status: 'active' | 'expired' | 'cancelled';
    lockerId: string;
    lockerNumber: string;
    lockerSize: 'small' | 'medium' | 'large';
    userId: string;
    userName: string;
    userEmail: string;
    expiresAt: string;
    createdAt: string;
  };
  
  type Locker = {
    id: string;
    number: string;
    size: 'small' | 'medium' | 'large';
    isOccupied: boolean;
    userId: string | null;
    userName?: string | null;
    userEmail?: string | null;
  };
  
  type User = {
    id: string;
    name: string;
    email: string;
    type: 'admin' | 'user';
  };
  
  type NewSubscription = {
    userId: string;
    lockerId: string;
    expiresAt: string;
    status: 'active' | 'expired' | 'cancelled';
  };
  
  // State management
  let subscriptions = $state<Subscription[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);
  
  // Add subscription dialog
  let showAddDialog = $state(false);
  let newSubscription = $state<NewSubscription>({
    userId: "",
    lockerId: "",
    expiresAt: "",
    status: "active"
  });
  let processingAdd = $state(false);
  
  // User and locker data
  let users = $state<User[]>([]);
  let lockers = $state<Locker[]>([]);
  let loadingUsers = $state(false);
  let loadingLockers = $state(false);
  
  // Fetch subscriptions
  async function fetchSubscriptions() {
    loading = true;
    error = null;
    try {
      const response = await fetch("/api/admin/subscriptions");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch subscriptions");
      }
      const data = await response.json();
      console.log("Fetched subscriptions:", data);
      subscriptions = data.subscriptions;
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      error = err instanceof Error ? err.message : "Failed to fetch subscriptions";
    } finally {
      loading = false;
    }
  }
  
  // Fetch users
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
  
  // Fetch available lockers
  async function fetchLockers() {
    loadingLockers = true;
    try {
      const response = await fetch("/api/admin/lockers");
      if (!response.ok) {
        throw new Error("Failed to fetch lockers");
      }
      const data = await response.json();
      lockers = data.lockers;
    } catch (error) {
      console.error("Error fetching lockers:", error);
    } finally {
      loadingLockers = false;
    }
  }
  
  // Delete subscription
  async function deleteSubscription(subscriptionId: string) {
    if (!confirm("Are you sure you want to delete this subscription? This will remove the user's access to the locker.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete subscription");
      }
      
      // Refresh the data
      await fetchSubscriptions();
    } catch (err) {
      console.error("Error deleting subscription:", err);
      alert(err instanceof Error ? err.message : "Failed to delete subscription");
    }
  }
  
  // Open add subscription dialog
  function openAddDialog() {
    newSubscription = {
      userId: "",
      lockerId: "",
      expiresAt: "",
      status: "active"
    };
    showAddDialog = true;
    fetchUsers();
    fetchLockers();
  }
  
  // Add subscription
  async function handleAddSubscription() {
    if (!newSubscription.userId || !newSubscription.lockerId || !newSubscription.expiresAt) {
      alert("Please fill out all required fields");
      return;
    }
    
    processingAdd = true;
    try {
      console.log("Sending subscription data:", JSON.stringify(newSubscription));
      
      const response = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSubscription)
      });
      
      const data = await response.json();
      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.message || "Failed to add subscription");
      }
      
      console.log("API Success Response:", data);
      
      showAddDialog = false;
      // Refresh data
      await fetchSubscriptions();
    } catch (err) {
      console.error("Error adding subscription:", err);
      alert(err instanceof Error ? err.message : "Failed to add subscription");
    } finally {
      processingAdd = false;
    }
  }
  
  // Initial data fetch
  $effect(() => {
    fetchSubscriptions();
  });
</script>

<div>
  {#if error}
    <Alert color="red" class="mb-4">
      {error}
      <Button color="red" class="ml-2" on:click={fetchSubscriptions}>
        Retry
      </Button>
    </Alert>
  {/if}
  
  <div class="flex justify-end mb-4">
    <Button color="green" class="mr-2" on:click={fetchSubscriptions}>
      Refresh
    </Button>
    <Button color="blue" on:click={openAddDialog}>
      Add Subscription
    </Button>
  </div>
  
  {#if loading}
    <div class="flex justify-center py-8">
      <Spinner size="8" />
    </div>
  {:else if subscriptions.length === 0}
    <p class="text-gray-600">No subscriptions found.</p>
  {:else}
    <div class="overflow-x-auto">
      <Table striped={true}>
        <TableHead>
          <TableHeadCell>Locker</TableHeadCell>
          <TableHeadCell>User</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell class="hidden sm:table-cell">Expires</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each subscriptions as subscription}
            <TableBodyRow>
              <TableBodyCell>
                #{subscription.lockerNumber} ({subscription.lockerSize})
              </TableBodyCell>
              <TableBodyCell>
                <div class="flex flex-col">
                  <span class="truncate max-w-[150px] md:max-w-none">{subscription.userName}</span>
                  <span class="text-sm text-gray-500 truncate max-w-[150px] md:max-w-none">{subscription.userEmail}</span>
                </div>
              </TableBodyCell>
              <TableBodyCell>
                <Badge 
                  color={subscription.status === 'active' 
                    ? 'green' 
                    : subscription.status === 'expired' 
                    ? 'yellow' 
                    : 'red'}
                >
                  {subscription.status}
                </Badge>
              </TableBodyCell>
              <TableBodyCell class="hidden sm:table-cell">
                {formatDate(subscription.expiresAt, true)}
              </TableBodyCell>
              <TableBodyCell>
                <Button 
                  color="red" 
                  size="xs" 
                  on:click={() => deleteSubscription(subscription.id)}
                >
                  Delete
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  {/if}
</div>

<!-- Add Subscription Dialog -->
<Modal bind:open={showAddDialog} size="md" autoclose={false}>
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Add New Subscription
    </h3>
  </div>
  
  <div class="space-y-4">
    <!-- User -->
    <div>
      <Label for="user">User</Label>
      {#if loadingUsers}
        <div class="flex justify-center py-4">
          <Spinner size="4" />
        </div>
      {:else}
        <Select id="user" bind:value={newSubscription.userId}>
          <option value="">Select user</option>
          {#each users as user}
            <option value={user.id}>{user.name} ({user.email})</option>
          {/each}
        </Select>
      {/if}
    </div>
    
    <!-- Locker -->
    <div>
      <Label for="locker">Locker</Label>
      {#if loadingLockers}
        <div class="flex justify-center py-4">
          <Spinner size="4" />
        </div>
      {:else}
        <Select id="locker" bind:value={newSubscription.lockerId}>
          <option value="">Select locker</option>
          {#each lockers as locker}
            <option value={locker.id} disabled={locker.isOccupied && (!locker.userId || locker.userId !== newSubscription.userId)}>
              #{locker.number} ({locker.size}) {locker.isOccupied ? '- Occupied' : ''}
            </option>
          {/each}
        </Select>
      {/if}
    </div>
    
    <!-- Expiry Date -->
    <div>
      <Label for="expiresAt">Expires At</Label>
      <Input id="expiresAt" type="date" bind:value={newSubscription.expiresAt} />
    </div>
    
    <!-- Status -->
    <div>
      <Label for="status">Status</Label>
      <Select id="status" bind:value={newSubscription.status}>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="cancelled">Cancelled</option>
      </Select>
    </div>
  </div>
  
  <div class="flex justify-end gap-4 mt-6">
    <Button
      color="alternative"
      disabled={processingAdd}
      on:click={() => {
        showAddDialog = false;
      }}
    >
      Cancel
    </Button>
    <Button
      color="blue"
      disabled={!newSubscription.userId || !newSubscription.lockerId || !newSubscription.expiresAt || processingAdd}
      on:click={handleAddSubscription}
    >
      {processingAdd ? 'Processing...' : 'Add Subscription'}
    </Button>
  </div>
</Modal> 