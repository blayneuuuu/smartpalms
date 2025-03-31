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
    Datepicker,
  } from "flowbite-svelte";
  import {lockers, loading, errors} from "$lib/stores/admin";
  import {fetchLockers, fetchDashboardStats} from "$lib/services/admin";
  import type {LockerSize} from "$lib/server/db/schema";

  let showCreateDialog = $state(false);
  let showChangeOwnerDialog = $state(false);
  let showEditDialog = $state(false);
  
  // Define newLocker with $state for reactivity
  let newLocker = $state({
    number: "",
    size: "" as LockerSize,
  });
  
  // Reset function to ensure proper reset
  function resetNewLocker() {
    newLocker = {
      number: "",
      size: "" as LockerSize,
    };
    console.log("Reset newLocker:", newLocker);
  }
  
  let selectedLocker = $state<any>(null);
  let editingLocker = $state<any>(null);
  let newOwnerId = $state("");
  let creatingLocker = false;
  let updatingOwnership = false;
  let updatingLocker = $state(false);
  let users = $state<any[]>([]);
  let loadingUsers = $state(false);
  let fixingOccupationStatus = $state(false);
  let fixResults = $state<any>(null);
  
  // New subscription state
  let subscriptionTypes = $state<any[]>([]);
  let loadingSubscriptionTypes = $state(false);
  let selectedSubscriptionTypeId = $state("");
  let expiryDate = $state("");
  
  // Sorting state
  let sortColumn = $state("number");
  let sortDirection = $state<"asc" | "desc">("asc");

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
    console.log("handleCreateLocker called with:", newLocker);
    
    if (!newLocker.number || !newLocker.size) {
      console.log("Validation failed - missing data:", newLocker);
      alert("Please enter both locker number and size");
      return;
    }
    
    creatingLocker = true;

    console.log("Creating locker with data:", newLocker);
    
    try {
      console.log("Sending POST request to /api/admin/lockers");
      const response = await fetch("/api/admin/lockers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocker),
      });

      console.log("Response received:", response.status, response.statusText);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create locker");
      }

      console.log("Locker created successfully");
      
      showCreateDialog = false;
      resetNewLocker();

      // Refresh data after successful action
      console.log("Refreshing locker data...");
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
      console.log("Data refresh complete");
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

  // Fetch subscription types for subscription assignment
  async function fetchSubscriptionTypes() {
    loadingSubscriptionTypes = true;
    try {
      const response = await fetch("/api/subscription-types");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription types");
      }
      const data = await response.json();
      subscriptionTypes = data.subscriptionTypes || [];
    } catch (error) {
      console.error("Error fetching subscription types:", error);
    } finally {
      loadingSubscriptionTypes = false;
    }
  }

  $effect(() => {
    // Fetch all users and subscription types when component initializes
    fetchAllUsers();
    fetchSubscriptionTypes();
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
  
  // Sort lockers function
  function handleSort(column: string) {
    if (sortColumn === column) {
      // If clicking the same column, toggle direction
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      // If clicking a different column, set it as new sort column with asc direction
      sortColumn = column;
      sortDirection = "asc";
    }
  }
  
  // Get sorted lockers
  const sortedLockers = $derived([...$lockers].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === "number") {
      // Sort by locker number (as number if possible)
      const aNum = parseInt(a.number);
      const bNum = parseInt(b.number);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = a.number.localeCompare(b.number);
      }
    } else if (sortColumn === "size") {
      // Sort by size (small, medium, large)
      const sizeOrder = { small: 1, medium: 2, large: 3 };
      comparison = (sizeOrder[a.size] || 0) - (sizeOrder[b.size] || 0);
    } else if (sortColumn === "status") {
      // Sort by occupied status
      comparison = (a.userId ? 1 : 0) - (b.userId ? 1 : 0);
    } else if (sortColumn === "user") {
      // Sort by user name
      const aName = a.userName || "";
      const bName = b.userName || "";
      comparison = aName.localeCompare(bName);
    }
    
    // Reverse if descending
    return sortDirection === "desc" ? -comparison : comparison;
  }));

  // Function to fix occupation status
  async function fixOccupationStatus() {
    fixingOccupationStatus = true;
    fixResults = null;
    
    try {
      const response = await fetch("/api/admin/lockers/fix-occupation");
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fix occupation status");
      }
      
      const data = await response.json();
      console.log("Fix occupation status response:", data);
      
      fixResults = data.results;
      
      // Refresh data after successful fix
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
      
      // Show success alert
      if (data.results.updated > 0) {
        alert(`Fixed ${data.results.updated} lockers with incorrect occupation status.`);
      } else {
        alert("All lockers have correct occupation status.");
      }
    } catch (err) {
      console.error("Error fixing occupation status:", err);
      alert(err instanceof Error ? err.message : "Failed to fix occupation status");
    } finally {
      fixingOccupationStatus = false;
    }
  }

  // Test direct locker creation
  async function testCreateLocker() {
    console.log("Testing direct locker creation");
    const testLocker = {
      number: "T" + Math.floor(Math.random() * 1000),
      size: "small" as LockerSize
    };
    
    console.log("Creating test locker:", testLocker);
    
    try {
      const response = await fetch("/api/admin/lockers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testLocker),
      });

      console.log("Response status:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create test locker");
      }
      
      alert(`Test locker created: #${testLocker.number}`);
      
      // Refresh data
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
    } catch (err) {
      console.error("Error creating test locker:", err);
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }

  function openCreateDialog() {
    console.log("Opening create locker dialog");
    resetNewLocker(); // Make sure we start clean
    showCreateDialog = true;
    console.log("showCreateDialog is now:", showCreateDialog);
  }

  // NEW FUNCTION: Open edit dialog for a locker
  function openEditDialog(locker: Locker) {
    editingLocker = { ...locker };
    newOwnerId = locker.userId || "";
    
    // Set subscription defaults
    selectedSubscriptionTypeId = "";
    
    // Set default expiry date (30 days from now)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    expiryDate = thirtyDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    showEditDialog = true;
    
    // Fetch users and subscription types
    fetchUsers();
    fetchSubscriptionTypes();
  }
  
  // NEW FUNCTION: Handle edit locker submission
  async function handleEditLocker() {
    if (!editingLocker) return;
    
    updatingLocker = true;
    try {
      console.log("Updating locker:", editingLocker.id);
      
      const response = await fetch(`/api/admin/lockers/${editingLocker.id}`, {
        method: "PUT", // Use PUT for full updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: editingLocker.number,
          size: editingLocker.size,
          userId: newOwnerId || null,
          subscriptionTypeId: selectedSubscriptionTypeId || null,
          expiresAt: expiryDate || null
        }),
      });

      // Check if response is ok before attempting to parse JSON
      if (!response.ok) {
        // Try to get error message from JSON if possible
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Server error: ${response.status}`;
        } catch (parseError) {
          // If JSON parsing fails, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
          console.error("Response was not JSON:", await response.text());
        }
        throw new Error(errorMessage);
      }
      
      // Only try to parse JSON if response is OK
      const data = await response.json();
      console.log("Locker update response:", data);

      showEditDialog = false;
      editingLocker = null;
      newOwnerId = "";
      selectedSubscriptionTypeId = "";
      expiryDate = "";

      // Refresh data after successful action
      await Promise.all([fetchLockers(), fetchDashboardStats()]);
    } catch (err) {
      console.error("Error updating locker:", err);
      alert(err instanceof Error ? err.message : "Failed to update locker");
    } finally {
      updatingLocker = false;
    }
  }
</script>

{#if $errors.lockers}
  <Alert color="red" class="mb-4">
    {$errors.lockers}
  </Alert>
{/if}

<div class="flex justify-between mb-4">
  <div>
    <Button 
      color="red" 
      disabled={fixingOccupationStatus}
      on:click={fixOccupationStatus}
      class="mr-2"
    >
      {#if fixingOccupationStatus}
        <Spinner class="mr-2" size="4" />
      {/if}
      Fix Occupation Status
    </Button>
    
    {#if fixResults}
      <span class="text-sm text-gray-600 ml-2">
        Fixed: {fixResults.updated}, Already correct: {fixResults.alreadyCorrect}
      </span>
    {/if}
  </div>
  
  <Button color="green" on:click={openCreateDialog}>Create Locker</Button>
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
        <TableHeadCell class="cursor-pointer" on:click={() => handleSort("number")}>
          Number
          {#if sortColumn === "number"}
            <span class="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          {/if}
        </TableHeadCell>
        <TableHeadCell class="cursor-pointer" on:click={() => handleSort("size")}>
          Size
          {#if sortColumn === "size"}
            <span class="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          {/if}
        </TableHeadCell>
        <TableHeadCell class="cursor-pointer" on:click={() => handleSort("status")}>
          Status
          {#if sortColumn === "status"}
            <span class="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          {/if}
        </TableHeadCell>
        <TableHeadCell class="hidden sm:table-cell cursor-pointer" on:click={() => handleSort("user")}>
          User
          {#if sortColumn === "user"}
            <span class="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          {/if}
        </TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each sortedLockers as locker}
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
                <Button 
                  color="light" 
                  size="xs" 
                  class="text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-2.5"
                  on:click={() => openEditDialog(locker)}
                >
                  Edit Locker
                </Button>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if}

<!-- Create Locker Dialog -->
{#if showCreateDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Create New Locker
        </h3>
        <button 
          class="text-gray-500 hover:text-gray-700"
          on:click={() => {
            showCreateDialog = false;
            resetNewLocker();
          }}
        >
          ✕
        </button>
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
          <Label>Size</Label>
          
          <!-- Size selection buttons -->
          <div class="flex gap-2 mt-2">
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {newLocker.size === 'small' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                newLocker.size = 'small';
              }}
            >
              Small
            </button>
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {newLocker.size === 'medium' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                newLocker.size = 'medium';
              }}
            >
              Medium
            </button>
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {newLocker.size === 'large' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                newLocker.size = 'large';
              }}
            >
              Large
            </button>
          </div>
          
          <!-- Keep the dropdown as a fallback -->
          <Select 
            id="lockerSize" 
            bind:value={newLocker.size}
            class="mt-2"
          >
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
            resetNewLocker();
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
    </div>
  </div>
{/if}

<!-- Change Owner Dialog -->
{#if showChangeOwnerDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Change Locker Owner
        </h3>
        <button 
          class="text-gray-500 hover:text-gray-700"
          on:click={() => {
            showChangeOwnerDialog = false;
            selectedLocker = null;
            newOwnerId = "";
          }}
        >
          ✕
        </button>
      </div>
  
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
    </div>
  </div>
{/if}

<!-- Edit Locker Dialog -->
{#if showEditDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Edit Locker
        </h3>
        <button 
          class="text-gray-500 hover:text-gray-700"
          on:click={() => {
            showEditDialog = false;
            editingLocker = null;
            newOwnerId = "";
            selectedSubscriptionTypeId = "";
            expiryDate = "";
          }}
        >
          ✕
        </button>
      </div>
  
      <div class="space-y-4">
        <!-- Locker Number -->
        <div>
          <Label for="editLockerNumber">Locker Number</Label>
          <Input
            id="editLockerNumber"
            placeholder="Enter locker number"
            bind:value={editingLocker.number}
          />
        </div>

        <!-- Locker Size -->
        <div>
          <Label>Size</Label>
          
          <!-- Size selection buttons -->
          <div class="flex gap-2 mt-2">
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {editingLocker?.size === 'small' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                if (editingLocker) editingLocker.size = 'small';
              }}
            >
              Small
            </button>
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {editingLocker?.size === 'medium' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                if (editingLocker) editingLocker.size = 'medium';
              }}
            >
              Medium
            </button>
            <button 
              type="button"
              class="px-4 py-2 rounded text-sm font-medium border {editingLocker?.size === 'large' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}"
              on:click={() => {
                if (editingLocker) editingLocker.size = 'large';
              }}
            >
              Large
            </button>
          </div>
        </div>

        <!-- Ownership -->
        <div>
          <Label for="editOwner">Owner</Label>
          {#if loadingUsers}
            <div class="flex justify-center py-4">
              <Spinner size="4" />
            </div>
          {:else}
            <Select id="editOwner" bind:value={newOwnerId}>
              <option value="">None (Remove Ownership)</option>
              {#each users as user}
                <option value={user.id}>{user.name} ({user.email})</option>
              {/each}
            </Select>
          {/if}
        </div>

        <!-- Subscription Section - Only show if an owner is selected -->
        {#if newOwnerId}
          <div class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Subscription Details</h4>
            
            <!-- Subscription Type -->
            <div class="mb-3">
              <Label for="subscriptionType">Subscription Plan</Label>
              {#if loadingSubscriptionTypes}
                <div class="flex justify-center py-2">
                  <Spinner size="4" />
                </div>
              {:else}
                <Select id="subscriptionType" bind:value={selectedSubscriptionTypeId}>
                  <option value="">Select a subscription plan</option>
                  {#each subscriptionTypes.filter(type => !editingLocker || type.size === editingLocker.size) as type}
                    <option value={type.id}>{type.name} - ₱{type.amount} ({type.duration})</option>
                  {/each}
                </Select>
                {#if editingLocker}
                  <p class="text-xs text-gray-500 mt-1">Showing plans for {editingLocker.size} lockers only</p>
                {/if}
              {/if}
            </div>
            
            <!-- Expiry Date -->
            <div>
              <Label for="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                bind:value={expiryDate}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        {/if}

        <!-- Current Status -->
        <div class="mt-4 border-t pt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Current Status</h4>
          <div class="bg-gray-50 p-3 rounded">
            <p class="text-sm">
              <span class="font-medium">Owner:</span> 
              {editingLocker?.userName || 'None'}
            </p>
            <p class="text-sm mt-1">
              <span class="font-medium">Status:</span>
              <Badge color={editingLocker?.userId ? "red" : "green"} class="ml-2">
                {editingLocker?.userId ? "Occupied" : "Available"}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <Button
          color="alternative"
          disabled={updatingLocker}
          on:click={() => {
            showEditDialog = false;
            editingLocker = null;
            newOwnerId = "";
            selectedSubscriptionTypeId = "";
            expiryDate = "";
          }}
        >
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={!!updatingLocker || !editingLocker?.number || !editingLocker?.size || (!!newOwnerId && (!selectedSubscriptionTypeId || !expiryDate))}
          on:click={handleEditLocker}
        >
          {updatingLocker ? 'Updating...' : 'Update Locker'}
        </Button>
      </div>
    </div>
  </div>
{/if} 