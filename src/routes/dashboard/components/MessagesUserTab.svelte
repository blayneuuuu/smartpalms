<script lang="ts">
  import {
    Card,
    Button,
    Modal,
    Alert,
    Spinner,
    Input,
    Label,
    Textarea,
    Badge,
    Select,
  } from "flowbite-svelte";
  import { formatDate, formatTimestamp } from "$lib/utils/date";
  import { onMount } from "svelte";
  import type { MessageThread } from "$lib/services/core/message.service";

  let loading = $state(true);
  let error = $state<string | null>(null);
  let threads = $state<MessageThread[]>([]);
  let selectedThread = $state<MessageThread | null>(null);
  let newMessageContent = $state("");
  let sendingMessage = $state(false);
  let showMessageModal = $state(false);
  let showNewMessageModal = $state(false);
  let userLockers = $state<Array<{id: string; number: string}>>([]);
  let selectedLockerId = $state<string | null>(null);
  let totalUnreadCount = $state(0);

  async function loadMessages() {
    loading = true;
    error = null;
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error("Failed to load messages");
      }
      
      const data = await response.json();
      threads = data.threads;
      
      // Calculate total unread count
      totalUnreadCount = threads.reduce((acc, thread) => acc + (thread.unreadCount || 0), 0);
    } catch (err) {
      console.error("Error loading messages:", err);
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }

  async function loadUserLockers() {
    try {
      // Get current user ID
      const userResponse = await fetch("/api/me");
      const userData = await userResponse.json();
      
      if (!userData.success) {
        throw new Error("Failed to get user data");
      }
      
      // Get user's lockers
      const lockersResponse = await fetch(`/api/lockers/user/${userData.user.id}`);
      const lockersData = await lockersResponse.json();
      
      if (!lockersData.success) {
        throw new Error("Failed to get locker data");
      }
      
      userLockers = lockersData.lockers || [];
    } catch (err) {
      console.error("Error loading user lockers:", err);
    }
  }

  function openMessageThread(thread: MessageThread) {
    selectedThread = thread;
    showMessageModal = true;
    
    // Mark messages as read
    if (thread.unreadCount > 0) {
      markAsRead(thread.id);
    }
  }

  function openNewMessageModal() {
    newMessageContent = "";
    selectedLockerId = null;
    showNewMessageModal = true;
  }

  async function markAsRead(messageId: string) {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH",
      });
      
      // Update threads in UI
      threads = threads.map(thread => {
        if (thread.id === messageId) {
          return {
            ...thread,
            unreadCount: 0
          };
        }
        return thread;
      });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  }

  async function sendNewMessage() {
    if (!newMessageContent.trim()) return;
    
    sendingMessage = true;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: newMessageContent.trim(),
          lockerId: selectedLockerId || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      // Refresh messages
      await loadMessages();
      
      // Close modal
      showNewMessageModal = false;
      newMessageContent = "";
      selectedLockerId = null;
      
      // Show success message
      alert("Message sent successfully!");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      sendingMessage = false;
    }
  }

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return formatDate(date);
    }
  }

  onMount(() => {
    loadMessages();
    loadUserLockers();
  });
</script>

<div class="mb-4 flex justify-between items-center">
  <h2 class="text-2xl font-bold flex items-center">
    My Messages
    {#if totalUnreadCount > 0}
      <span class="relative flex h-3 w-3 ml-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
      </span>
    {/if}
  </h2>
  <div class="flex gap-2">
    <Button color="blue" on:click={loadMessages}>
      Refresh
    </Button>
    <Button color="green" on:click={openNewMessageModal}>
      New Message
    </Button>
  </div>
</div>

{#if error}
  <Alert color="red" class="mb-4">
    {error}
  </Alert>
{/if}

{#if loading}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if threads.length === 0}
  <Alert color="blue" class="mb-4">
    You have no messages. Use the "New Message" button to contact an administrator.
  </Alert>
{:else}
  <div class="grid grid-cols-1 gap-4">
    {#each threads as thread}
      <Card class={thread.unreadCount > 0 ? 'border-blue-500 border-2' : ''}>
        <div class="flex justify-between items-start">
          <div>
            <h5 class="text-lg font-medium flex items-center gap-2">
              Message to Admin
              {#if thread.unreadCount > 0}
                <Badge color="blue">{thread.unreadCount} New</Badge>
              {/if}
            </h5>
            <p class="text-sm text-gray-500">
              {getTimeAgo(thread.createdAt)}
              {#if thread.lockerNumber}
                • About Locker #{thread.lockerNumber}
              {/if}
            </p>
            <p class="mt-2">{thread.content}</p>
            
            {#if thread.replies.length > 0}
              <div class="mt-3 pl-4 border-l-2 border-gray-200">
                <p class="text-sm text-gray-500">
                  {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
                </p>
                <p class="text-sm">
                  Last reply: {thread.replies[thread.replies.length - 1].content.substring(0, 50)}
                  {thread.replies[thread.replies.length - 1].content.length > 50 ? '...' : ''}
                </p>
              </div>
            {/if}
          </div>
          <Button size="sm" on:click={() => openMessageThread(thread)}>
            View {thread.unreadCount > 0 ? '(New)' : ''}
          </Button>
        </div>
      </Card>
    {/each}
  </div>
{/if}

<!-- Message Thread Modal -->
{#if showMessageModal && selectedThread}
  <Modal bind:open={showMessageModal} size="lg" autoclose={false}>
    <h3 class="text-xl font-bold">
      Message Thread
      {#if selectedThread.lockerNumber}
        <span class="text-sm font-normal ml-2">• About Locker #{selectedThread.lockerNumber}</span>
      {/if}
    </h3>
    <p class="text-sm text-gray-500 mb-4">{formatTimestamp(selectedThread.createdAt)}</p>
    
    <div class="bg-gray-50 p-3 rounded-lg mb-4">
      <p class="font-semibold text-sm">You:</p>
      <p>{selectedThread.content}</p>
    </div>
    
    {#if selectedThread.replies.length > 0}
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Conversation:</h4>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          {#each selectedThread.replies as reply}
            <!-- Admin replies are always in response to a user message -->
            <div class="p-3 rounded-lg bg-blue-50 ml-6">
              <div class="flex justify-between">
                <p class="font-semibold text-sm">
                  Admin
                </p>
                <p class="text-xs text-gray-500">{formatTimestamp(reply.createdAt)}</p>
              </div>
              <p class="mt-1">{reply.content}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="flex justify-end space-x-3 mt-4">
      <Button 
        color="alternative" 
        on:click={() => (showMessageModal = false)}
      >
        Close
      </Button>
    </div>
  </Modal>
{/if}

<!-- New Message Modal -->
{#if showNewMessageModal}
  <Modal bind:open={showNewMessageModal} size="md" autoclose={false}>
    <h3 class="text-xl font-bold mb-4">New Message to Admin</h3>
    
    {#if userLockers.length > 0}
      <div class="mb-4">
        <Label for="locker">Related to Locker (Optional):</Label>
        <Select id="locker" bind:value={selectedLockerId} class="mt-1">
          <option value="">No specific locker</option>
          {#each userLockers as locker}
            <option value={locker.id}>Locker #{locker.number}</option>
          {/each}
        </Select>
      </div>
    {/if}
    
    <div class="mb-4">
      <Label for="messageContent">Message:</Label>
      <Textarea 
        id="messageContent" 
        bind:value={newMessageContent} 
        rows={4} 
        placeholder="Type your message here..."
      />
    </div>
    
    <div class="flex justify-end space-x-3">
      <Button 
        color="alternative" 
        on:click={() => (showNewMessageModal = false)}
      >
        Cancel
      </Button>
      <Button 
        color="green" 
        disabled={!newMessageContent.trim() || sendingMessage} 
        on:click={sendNewMessage}
      >
        {sendingMessage ? 'Sending...' : 'Send'}
      </Button>
    </div>
  </Modal>
{/if} 