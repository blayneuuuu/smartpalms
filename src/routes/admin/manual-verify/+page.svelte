<script lang="ts">
  import { Alert, Button, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Table, Spinner } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
  
  // Track loading state for each user
  let loadingUsers = new Map<string, boolean>();
  
  function handleSubmit(userId: string) {
    return () => {
      loadingUsers.set(userId, true);
      loadingUsers = loadingUsers; // Force reactivity update
      
      return async ({ update }: { update: () => Promise<void> }) => {
        loadingUsers.set(userId, false);
        loadingUsers = loadingUsers; // Force reactivity update
        update();
      };
    };
  }
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
                <form method="POST" use:enhance={handleSubmit(user.id)}>
                  <input type="hidden" name="userId" value={user.id} />
                  <Button type="submit" color="green" size="xs" disabled={loadingUsers.get(user.id)}>
                    {#if loadingUsers.get(user.id)}
                      <Spinner size="3" color="white" class="mr-1" />
                      Verifying...
                    {:else}
                      Verify User
                    {/if}
                  </Button>
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