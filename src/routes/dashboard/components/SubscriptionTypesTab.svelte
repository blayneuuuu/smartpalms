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
  import {formatDate} from "$lib/utils/date";
  import {
    subscriptionTypes, 
    loading, 
    errors
  } from "$lib/stores/admin";
  import {
    createSubscriptionType,
    updateSubscriptionType,
    deleteSubscriptionType,
    fetchSubscriptionTypes,
  } from "$lib/services/admin";
  import { Dialog } from "bits-ui";

  let showDialog = false;
  let isEditing = false;
  let selectedId = "";
  let formData = $state({
    name: "",
    duration: "",
    size: "small",
    amount: 0,
  });
  let processing = false;
  // Add operation-specific processing state
  let processingDelete = $state<string | null>(null);
  let processingToggle = $state<string | null>(null);

  // Fetch subscription types when component mounts - using a more controlled approach
  let initialLoadDone = $state(false);
  
  $effect(() => {
    // Only load data on initial mount, not on every render
    if (!initialLoadDone) {
      console.log("SubscriptionTypesTab: Initial data loading");
      initialLoadDone = true;
      
      fetchSubscriptionTypes()
        .then(() => {
          console.log("SubscriptionTypes loaded successfully");
        })
        .catch(err => {
          console.error("Error loading subscription types:", err);
        });
    }
  });

  // Remove all the other automatic data loading functions and direct fetch implementation
  async function refreshData() {
    console.log("Manual refresh requested");
    return fetchSubscriptionTypes();
  }

  const durations = [
    {value: "1_day", label: "1 Day"},
    {value: "7_days", label: "7 Days"},
    {value: "30_days", label: "30 Days"},
  ];

  function openCreateDialog() {
    isEditing = false;
    selectedId = "";
    formData = {
      name: "",
      duration: "",
      size: "small",
      amount: 0,
    };
    showDialog = true;
  }

  function openEditDialog(type: (typeof $subscriptionTypes)[0]) {
    isEditing = true;
    selectedId = type.id;
    formData = {
      name: type.name,
      duration: type.duration,
      size: type.size || "small",
      amount: type.amount,
    };
    showDialog = true;
  }

  async function handleSubmit() {
    if (!formData.name || !formData.duration || formData.amount <= 0) return;

    processing = true;
    try {
      if (isEditing) {
        await updateSubscriptionType(selectedId, formData);
      } else {
        await createSubscriptionType(formData);
      }
      showDialog = false;
    } catch (err) {
      console.error("Error saving subscription type:", err);
    } finally {
      processing = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this subscription type?")) return;

    processingDelete = id; // Track which item is being deleted
    try {
      const result = await deleteSubscriptionType(id);
      console.log("Deletion result:", result);
      
      // Force refresh by explicitly fetching subscription types
      await fetchSubscriptionTypes();
      
      // Double check if the subscription type was actually removed from the UI
      if ($subscriptionTypes.some(type => type.id === id)) {
        console.log("UI did not update properly, reloading page");
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting subscription type:", err);
      
      // Check for specific error messages about pending requests
      if (err instanceof Error && err.message.includes("pending requests")) {
        alert("Cannot delete this subscription type because it has pending locker requests. Process or reject these requests first.");
      } else {
        alert("Failed to delete subscription type: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    } finally {
      processingDelete = null;
    }
  }

  async function toggleActiveStatus(type: (typeof $subscriptionTypes)[0]) {
    processingToggle = type.id; // Track which item is being toggled
    try {
      await updateSubscriptionType(type.id, {
        name: type.name,
        duration: type.duration,
        size: type.size || "small",
        amount: type.amount,
        isActive: !type.isActive
      });
    } catch (err) {
      console.error("Error toggling subscription type status:", err);
      alert("Failed to update status: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      processingToggle = null;
    }
  }

  // Array of locker sizes for the dropdown
  const lockerSizes = ["small", "medium", "large"];
</script>

{#if $errors.subscriptionTypes}
  <Alert color="red" class="mb-4">
    {$errors.subscriptionTypes}
    {#if $errors.subscriptionTypes?.includes("not an admin")}
      <p class="mt-2">You need to be logged in as an admin to view subscription types.</p>
    {/if}
  </Alert>
{/if}

<div class="flex justify-end mb-4">
  <div class="flex space-x-2">
    <Button color="green" class="mr-2" on:click={() => refreshData()}>
      Refresh
    </Button>

    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="blue" on:click={openCreateDialog}>
          Create Subscription Type
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          transitionConfig={{ duration: 150 }}
          class="fixed inset-0 z-50 bg-black/80"
        />
        <Dialog.Content
          class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
        >
          <Dialog.Description class="text-sm text-foreground-alt">
            <div class="text-center">
              <h3 class="mb-5 text-lg font-normal text-gray-500">
                {isEditing ? "Edit" : "Create"} Subscription Type
              </h3>
            </div>
          
            <div class="space-y-4">
              <div>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter subscription name"
                  bind:value={formData.name}
                />
              </div>
          
              <div>
                <Label for="duration">Duration</Label>
                <Select id="duration" bind:value={formData.duration}>
                  <option value="">Select duration</option>
                  {#each durations as {value, label}}
                    <option {value}>{label}</option>
                  {/each}
                </Select>
              </div>
          
              <div>
                <Label for="size">Size</Label>
                <Select id="size" bind:value={formData.size}>
                  <option value="">Select size</option>
                  {#each lockerSizes as size}
                    <option value={size}>{size}</option>
                  {/each}
                </Select>
              </div>
          
              <div>
                <Label for="amount">Amount (₱)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter amount"
                  bind:value={formData.amount}
                />
              </div>
            </div>
          
            <div class="flex justify-end gap-4 mt-6">
              <Dialog.Close>
                <Button
                color="alternative"
                disabled={processing}
                on:click={() => {
                  showDialog = false;
                }}
              >
                Cancel
              </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                color="blue"
                disabled={!formData.name || !formData.duration || formData.amount <= 0 || processing}
                on:click={handleSubmit}
              >
                {isEditing ? "Save" : "Create"}
              </Button>
              </Dialog.Close>
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</div>

{#if $loading.subscriptionTypes}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $subscriptionTypes.length === 0}
  <p class="text-gray-600">No subscription types found via the store.</p>
{:else}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Duration</TableHeadCell>
      <TableHeadCell>Size</TableHeadCell>
      <TableHeadCell>Amount</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Created At</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      
      {#each $subscriptionTypes as type}
        <TableBodyRow>
          <TableBodyCell>{type.name}</TableBodyCell>
          <TableBodyCell>
            <Badge
              color={type.duration === "1_day"
                ? "blue"
                : type.duration === "7_days"
                ? "yellow"
                : "red"}
            >
              {type.duration.replace("_", " ")}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>{type.size}</TableBodyCell>
          <TableBodyCell>₱{type.amount}</TableBodyCell>
          <TableBodyCell>
            <Badge color={type.isActive ? "green" : "dark"}>
              {type.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>{formatDate(type.createdAt, true)}</TableBodyCell>
          <TableBodyCell>
            <div class="flex space-x-2">
              

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button size="xs" on:click={() => openEditDialog(type)}>
                    Edit
                  </Button>
              </Dialog.Trigger>
            
              <Dialog.Portal>
                <Dialog.Overlay
                  transitionConfig={{ duration: 150 }}
                  class="fixed inset-0 z-50 bg-black/80"
                />
                <Dialog.Content
                  
                  class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
                >
                 
                  
                  <Dialog.Description class="text-sm text-foreground-alt">
                    <div class="text-center">
                      <h3 class="mb-5 text-lg font-normal text-gray-500">
                        {isEditing ? "Edit" : "Create"} Subscription Type
                      </h3>
                    </div>
                  
                    <div class="space-y-4">
                      <div>
                        <Label for="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter subscription name"
                          bind:value={formData.name}
                        />
                      </div>
                  
                      <div>
                        <Label for="duration">Duration</Label>
                        <Select id="duration" bind:value={formData.duration}>
                          <option value="">Select duration</option>
                          {#each durations as {value, label}}
                            <option {value}>{label}</option>
                          {/each}
                        </Select>
                      </div>
                  
                      <div>
                        <Label for="size">Size</Label>
                        <Select id="size" bind:value={formData.size}>
                          <option value="">Select size</option>
                          {#each lockerSizes as size}
                            <option value={size}>{size}</option>
                          {/each}
                        </Select>
                      </div>
                  
                      <div>
                        <Label for="amount">Amount (₱)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Enter amount"
                          bind:value={formData.amount}
                        />
                      </div>
                    </div>
                  
                    <div class="flex justify-end gap-4 mt-6">
                      <Dialog.Close>
                        <Button
                        color="alternative"
                        disabled={processing}
                        on:click={() => {
                          showDialog = false;
                        }}
                      >
                        Cancel
                      </Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button
                        color="blue"
                        disabled={!formData.name || !formData.duration || formData.amount <= 0 || processing}
                        on:click={handleSubmit}
                      >
                        {isEditing ? "Save" : "Create"}
                      </Button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Description>
                  
                </Dialog.Content>
              </Dialog.Portal>
              </Dialog.Root>

              <Button
                size="xs"
                color="red"
                disabled={processingDelete === type.id}
                on:click={() => handleDelete(type.id)}
              >
                {processingDelete === type.id ? 'Deleting...' : 'Delete'}
              </Button>
              
              <Button
                size="xs"
                color={type.isActive ? "dark" : "green"}
                disabled={processingToggle === type.id}
                on:click={() => toggleActiveStatus(type)}
              >
                {processingToggle === type.id 
                  ? (type.isActive ? 'Deactivating...' : 'Activating...') 
                  : (type.isActive ? 'Deactivate' : 'Activate')}
              </Button>
            </div>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}

<!-- Create/Edit Dialog -->
<Modal bind:open={showDialog} size="md" autoclose>

</Modal> 