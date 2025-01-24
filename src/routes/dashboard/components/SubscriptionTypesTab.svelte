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
  import {subscriptionTypes, loading, errors} from "$lib/stores/admin";
  import {
    createSubscriptionType,
    updateSubscriptionType,
    deleteSubscriptionType,
  } from "$lib/services/admin";

  let showDialog = false;
  let isEditing = false;
  let selectedId = "";
  let formData = $state({
    name: "",
    duration: "",
    amount: 0,
  });
  let processing = false;

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

    processing = true;
    try {
      await deleteSubscriptionType(id);
    } catch (err) {
      console.error("Error deleting subscription type:", err);
    } finally {
      processing = false;
    }
  }
</script>

{#if $errors.subscriptionTypes}
  <Alert color="red" class="mb-4">
    {$errors.subscriptionTypes}
  </Alert>
{/if}

<div class="flex justify-end mb-4">
  <Button color="blue" on:click={openCreateDialog}>
    Create Subscription Type
  </Button>
</div>

{#if $loading.subscriptionTypes}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $subscriptionTypes.length === 0}
  <p class="text-gray-600">No subscription types found.</p>
{:else}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Duration</TableHeadCell>
      <TableHeadCell>Amount</TableHeadCell>
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
          <TableBodyCell>₱{type.amount}</TableBodyCell>
          <TableBodyCell>{formatDate(type.createdAt, true)}</TableBodyCell>
          <TableBodyCell>
            <div class="flex space-x-2">
              <Button size="xs" on:click={() => openEditDialog(type)}>
                Edit
              </Button>
              <Button
                size="xs"
                color="red"
                on:click={() => handleDelete(type.id)}
              >
                Delete
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
    <Button
      color="alternative"
      disabled={processing}
      on:click={() => {
        showDialog = false;
      }}
    >
      Cancel
    </Button>
    <Button
      color="blue"
      disabled={!formData.name || !formData.duration || formData.amount <= 0 || processing}
      on:click={handleSubmit}
    >
      {isEditing ? "Save" : "Create"}
    </Button>
  </div>
</Modal> 