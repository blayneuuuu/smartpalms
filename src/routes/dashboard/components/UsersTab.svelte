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
    Select,
    Input,
    Label,
    Textarea,
  } from "flowbite-svelte";
  import {formatDate, formatTimestamp} from "$lib/utils/date";
  import {users, loading, errors} from "$lib/stores/admin";
  import { Dialog } from "bits-ui";
  import type { UserStatus } from "$lib/server/db/schema";
  import { onMount } from "svelte";

  let showUserDetailsDialog = false;
  let selectedUser = $state<NonNullable<(typeof $users)[0]> | null>(null);
  let showEmailDialog = $state(false);
  let emailSubject = $state("");
  let emailContent = $state("");
  let sendingEmail = $state(false);
  let refreshingUsers = $state(false);
  let lastRefresh = $state(new Date());
  let updatingStatus = $state<Record<string, boolean>>({});

  // Status options with badge colors that match Flowbite
  const statusOptions: { value: UserStatus; label: string; color: "green" | "yellow" | "red" | "dark" | "blue" }[] = [
    { value: "inactive", label: "Inactive", color: "blue" },
    { value: "subscribed", label: "Subscribed", color: "green" },
    { value: "for_renewal", label: "For Renewal", color: "yellow" },
    { value: "suspended", label: "Suspended", color: "red" },
    { value: "blocked", label: "Blocked", color: "dark" },
  ];

  function openUserDetails(user: (typeof $users)[0]) {
    selectedUser = user;
    showUserDetailsDialog = true;
  }

  function openEmailDialog(user: (typeof $users)[0]) {
    if (!user) return;
    selectedUser = user;
    emailSubject = "";
    emailContent = "";
    showEmailDialog = true;
  }

  async function refreshUsers() {
    refreshingUsers = true;
    try {
      // Add a cache-busting parameter to ensure we get fresh data
      const response = await fetch("/api/admin/users?refresh=true&cache=" + Date.now());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to refresh users");
      }
      const data = await response.json();
      
      // Debug log to check what we're getting back
      console.log("Refreshed user data:", data.users);
      
      // Check if we have the status field in the returned users
      const hasStatusField = data.users.some((user: any) => 'status' in user);
      if (!hasStatusField) {
        console.warn("User statuses are missing in the API response!");
      }
      
      // Set the users in the store
      users.set(data.users);
      lastRefresh = new Date();
    } catch (error) {
      console.error("Error refreshing users:", error);
      alert("Failed to refresh users: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      refreshingUsers = false;
    }
  }

  async function handleStatusChange(userId: string, newStatus: UserStatus) {
    updatingStatus = { ...updatingStatus, [userId]: true };
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      users.update((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status: " + (error instanceof Error ? error.message : "Unknown error"));
      
      await refreshUsers();
    } finally {
      updatingStatus = { ...updatingStatus, [userId]: false };
    }
  }

  async function sendEmail() {
    if (!selectedUser) return;
    if (!emailSubject || !emailContent) return;

    const userId = selectedUser.id; // Store ID in case selectedUser changes
    
    sendingEmail = true;
    try {
      const response = await fetch(`/api/admin/users/${userId}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send email");
      }

      alert("Email sent successfully!");
      showEmailDialog = false;
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      sendingEmail = false;
    }
  }

  function getStatusBadgeColor(status: UserStatus | undefined): "green" | "yellow" | "red" | "dark" | "blue" {
    return statusOptions.find(option => option.value === status)?.color || "blue";
  }

  onMount(() => {
    // Refresh users on component mount to ensure we have the latest statuses
    refreshUsers();
  });
</script>

{#if $errors.users}
  <Alert color="red" class="mb-4">
    {$errors.users}
  </Alert>
{/if}

<div class="flex justify-between items-center mb-4">
  <h2 class="text-xl font-semibold">User Management</h2>
  <Button color="blue" size="sm" on:click={refreshUsers} disabled={refreshingUsers}>
    {#if refreshingUsers}
      <Spinner size="sm" class="mr-2" />Refreshing...
    {:else}
      Refresh Users
    {/if}
  </Button>
</div>

<div class="text-sm text-gray-500 mb-4">
  Last refreshed: {lastRefresh.toLocaleTimeString()}
</div>

{#if $loading.users && !refreshingUsers}
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
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each $users.filter(user => user.type !== "admin") as user}
          <TableBodyRow>
            <TableBodyCell class="font-medium">{user.name}</TableBodyCell>
            <TableBodyCell class="hidden sm:table-cell">
              <span class="truncate max-w-[150px] md:max-w-none block">{user.email}</span>
            </TableBodyCell>
            <TableBodyCell>
              <Badge color={getStatusBadgeColor(user.status as UserStatus)}>
                {statusOptions.find(opt => opt.value === user.status)?.label || "Inactive"}
              </Badge>
              
              <div class="mt-2">
                <Select 
                  size="sm" 
                  value={user.status || "inactive"}
                  disabled={updatingStatus[user.id]}
                  on:change={(e) => {
                    const target = e.target as HTMLSelectElement;
                    handleStatusChange(user.id, target.value as UserStatus);
                  }}
                >
                  {#each statusOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </Select>
                
                {#if updatingStatus[user.id]}
                  <div class="mt-1 text-xs flex items-center text-blue-600">
                    <Spinner size="4" class="mr-1"/> Updating...
                  </div>
                {/if}
              </div>
            </TableBodyCell>
            <TableBodyCell>
              <div class="flex space-x-2">
                <!-- View Details Button -->
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button size="sm" on:click={() => { selectedUser = user; }}>View Details</Button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay
                      transitionConfig={{ duration: 150 }}
                      class="fixed inset-0 z-50 bg-black/80"
                    />
                    <Dialog.Content
                      class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-4 sm:p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
                    >
                      <Dialog.Title>User Details</Dialog.Title>
                      {#if selectedUser}
                        <div class="space-y-4 p-4">
                          <div>
                            <Label>User ID</Label>
                            <p class="text-sm">{selectedUser.id}</p>
                          </div>
                          <div>
                            <Label>Name</Label>
                            <p class="text-sm">{selectedUser.name}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p class="text-sm">{selectedUser.email}</p>
                          </div>
                          <div>
                            <Label>Account Type</Label>
                            <p class="text-sm capitalize">{selectedUser.type}</p>
                          </div>
                          <div>
                            <Label>Status</Label>
                            <p class="text-sm capitalize">
                              {#if selectedUser.status}
                                <Badge color={getStatusBadgeColor(selectedUser.status as UserStatus)}>
                                  {statusOptions.find(opt => opt.value === selectedUser.status)?.label || "Unknown"}
                                </Badge>
                              {:else}
                                <Badge color="blue">Inactive</Badge>
                              {/if}
                            </p>
                          </div>
                          <div>
                            <Label>Created At</Label>
                            <p class="text-sm">{formatTimestamp(selectedUser.createdAt)}</p>
                          </div>
                          <div>
                            <Label>Updated At</Label>
                            <p class="text-sm">{formatTimestamp(selectedUser.updatedAt)}</p>
                          </div>
                        </div>
                      {:else}
                        <div class="p-4">
                          <p>No user details available</p>
                        </div>
                      {/if}
                      <div class="mt-4 flex justify-end">
                        <Dialog.Close>
                          <Button>Close</Button>
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                
                <!-- Email Button -->
                <Button size="sm" color="blue" on:click={() => openEmailDialog(user)}>
                  Send Email
                </Button>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if}

<!-- Email Dialog -->
{#if showEmailDialog && selectedUser}
  <Modal bind:open={showEmailDialog} size="md" autoclose={false}>
    <h3 class="text-xl font-medium text-gray-900 mb-4">Send Email to {selectedUser.name}</h3>
    <div class="space-y-4">
      <div>
        <Label for="emailSubject">Subject</Label>
        <Input 
          id="emailSubject" 
          bind:value={emailSubject} 
          placeholder="Enter email subject"
        />
      </div>
      <div>
        <Label for="emailContent">Message</Label>
        <Textarea 
          id="emailContent" 
          bind:value={emailContent} 
          rows={6} 
          placeholder="Enter your message here"
        />
      </div>
    </div>
    <div class="flex justify-end space-x-3 mt-6">
      <Button 
        color="alternative" 
        on:click={() => {
          showEmailDialog = false;
          selectedUser = null;
        }}
      >
        Cancel
      </Button>
      <Button 
        color="blue" 
        disabled={!emailSubject || !emailContent || sendingEmail} 
        on:click={sendEmail}
      >
        {sendingEmail ? 'Sending...' : 'Send'}
      </Button>
    </div>
  </Modal>
{/if}
