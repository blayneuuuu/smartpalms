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

            <!-- Dialog  -->
            <Dialog.Root>
              <Dialog.Trigger class="btn" on:click={() => openUserDetails(user)}>
                <Button>View Details</Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay
                transitionConfig={{ duration: 150 }}
                class="fixed inset-0 z-50 bg-black/80"
              />
              <Dialog.Content
                
                class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
              >
                <Dialog.Title><h3 class="text-xl font-semibold mb-5">User Details</h3></Dialog.Title>
                
                <Dialog.Description class="text-sm text-foreground-alt">
                  {#if selectedUser}
    <div class="space-y-4">
      

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
    </div>
  {/if}
                </Dialog.Description>
                <div class="flex w-full justify-between mt-10">
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
{/if}
