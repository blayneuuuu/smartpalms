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
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import {formatDate} from "$lib/utils/date";
  import {users, loading, errors} from "$lib/stores/admin";

  let showUserDetailsDialog = false;
  let selectedUser = $state<(typeof $users)[0] | null>(null);

  function openUserDetails(user: (typeof $users)[0]) {
    selectedUser = user;
    showUserDetailsDialog = true;
  }
</script>

{#if $errors.users}
  <Alert color="red" class="mb-4">
    {$errors.users}
  </Alert>
{/if}

{#if $loading.users}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $users.length === 0}
  <p class="text-gray-600">No users found.</p>
{:else}
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Email</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
      <TableHeadCell>Created At</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $users as user}
        <TableBodyRow>
          <TableBodyCell>{user.name}</TableBodyCell>
          <TableBodyCell>{user.email}</TableBodyCell>
          <TableBodyCell>
            <Badge color={user.type === "admin" ? "red" : "blue"}>
              {user.type}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>{formatDate(user.createdAt, true)}</TableBodyCell>
          <TableBodyCell>
            <Button size="xs" on:click={() => openUserDetails(user)}>
              View Details
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}

<!-- User Details Dialog -->
<Modal bind:open={showUserDetailsDialog} size="md">
  {#if selectedUser}
    <div class="space-y-4">
      <h3 class="text-xl font-semibold">User Details</h3>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Name</p>
          <p class="font-medium">{selectedUser.name}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="font-medium">{selectedUser.email}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Type</p>
          <Badge color={selectedUser.type === "admin" ? "red" : "blue"}>
            {selectedUser.type}
          </Badge>
        </div>
        <div>
          <p class="text-sm text-gray-500">Created At</p>
          <p class="font-medium">{formatDate(selectedUser.createdAt, true)}</p>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <Button
          color="alternative"
          on:click={() => {
            showUserDetailsDialog = false;
            selectedUser = null;
          }}
        >
          Close
        </Button>
      </div>
    </div>
  {/if}
</Modal> 