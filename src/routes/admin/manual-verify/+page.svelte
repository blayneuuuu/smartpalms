<script lang="ts">
  import { Alert, Button, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Table } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<div class="container mx-auto p-4">
  <h1 class="text-xl md:text-2xl font-bold mb-6">Manual User Verification</h1>

  {#if form?.success}
    <Alert color="green" class="mb-4">
      {form.message}
    </Alert>
  {:else if form?.error}
    <Alert color="red" class="mb-4">
      {form.error}
    </Alert>
  {/if}

  {#if data.pendingUsers && data.pendingUsers.length > 0}
    <div class="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <Table striped={true}>
        <TableHead>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Created At</TableHeadCell>
          <TableHeadCell>Token Expiry</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableHead>
        <tbody>
          {#each data.pendingUsers as user}
            <TableBodyRow>
              <TableBodyCell>{user.name}</TableBodyCell>
              <TableBodyCell>{user.email}</TableBodyCell>
              <TableBodyCell>{new Date(user.createdAt).toLocaleString()}</TableBodyCell>
              <TableBodyCell>{new Date(user.tokenExpiry).toLocaleString()}</TableBodyCell>
              <TableBodyCell>
                <form method="POST" use:enhance>
                  <input type="hidden" name="userId" value={user.id} />
                  <Button type="submit" color="green" size="xs">Verify User</Button>
                </form>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        </tbody>
      </Table>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <p class="text-gray-700">No pending users found.</p>
    </div>
  {/if}
</div> 