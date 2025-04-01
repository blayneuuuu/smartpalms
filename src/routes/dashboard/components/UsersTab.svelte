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
  import {formatDate, formatTimestamp} from "$lib/utils/date";
  import {users, loading, errors} from "$lib/stores/admin";
  import { Dialog } from "bits-ui";

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
  <div class="overflow-x-auto">
    <Table striped={true}>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell class="hidden sm:table-cell">Email</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Created At</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each $users.filter(user => user.type !== "admin") as user}
          <TableBodyRow>
            <TableBodyCell class="font-medium">{user.name}</TableBodyCell>
            <TableBodyCell class="hidden sm:table-cell">
              <span class="truncate max-w-[150px] md:max-w-none block">{user.email}</span>
            </TableBodyCell>
            <TableBodyCell class="hidden md:table-cell">{formatTimestamp(user.createdAt)}</TableBodyCell>
            <TableBodyCell>

              <!-- Dialog  -->
              <Dialog.Root>
                <Dialog.Trigger class="btn" on:click={() => openUserDetails(user)}>
                  <Button size="sm">View Details</Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay
                  transitionConfig={{ duration: 150 }}
                  class="fixed inset-0 z-50 bg-black/80"
                />
                <Dialog.Content
                  class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-4 sm:p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
                >
                  <Dialog.Title><h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-5">User Details</h3></Dialog.Title>
                  
                  <Dialog.Description class="text-sm text-foreground-alt">
                    {#if selectedUser}
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p class="text-sm text-gray-500">Name</p>
            <p class="font-medium">{selectedUser.name}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium break-words">{selectedUser.email}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Created At</p>
            <p class="font-medium">{formatTimestamp(selectedUser.createdAt)}</p>
          </div>
        </div>
      </div>
    {/if}
                  </Dialog.Description>
                  <div class="flex w-full justify-between mt-6 sm:mt-10">
                    <Dialog.Close>
                      <Button>Close</Button>
                    </Dialog.Close>
                    
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
              </Dialog.Root>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if}
