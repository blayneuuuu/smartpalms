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
    Input,
    Label,
    Textarea,
    Card,
    Avatar,
  } from "flowbite-svelte";
  import { formatDate, formatTimestamp } from "$lib/utils/date";
  import { onMount } from "svelte";
  import type { MessageThread } from "$lib/services/core/message.service";

  let loading = $state(true);
  let error = $state<string | null>(null);
  let threads = $state<MessageThread[]>([]);
  let selectedThread = $state<MessageThread | null>(null);
  let replyContent = $state("");
  let showReplyModal = $state(false);
  let sendingReply = $state(false);
  let totalUnreadCount = $state(0);

  async function loadMessages() {
    loading = true;
    error = null;
    try {
      const response = await fetch("/api/admin/messages");
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

  function openReplyModal(thread: MessageThread) {
    selectedThread = thread;
    replyContent = "";
    showReplyModal = true;
    
    // Mark the thread as read if it was unread
    if (thread.unreadCount > 0) {
      markAsRead(thread.id);
    }
  }

  async function markAsRead(messageId: string) {
    try {
      await fetch(`/api/admin/messages/${messageId}/read`, {
        method: "PATCH",
      });
      
      // Update the thread in the UI
      threads = threads.map(thread => {
        if (thread.id === messageId) {
          return {
            ...thread,
            isRead: true,
            unreadCount: 0
          };
        }
        return thread;
      });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  }

  async function sendReply() {
    if (!selectedThread || !replyContent.trim()) return;
    
    sendingReply = true;
    try {
      const response = await fetch(`/api/admin/messages/${selectedThread.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: replyContent
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to send reply");
      }
      
      const data = await response.json();
      
      // Refresh messages to get the updated thread
      await loadMessages();
      
      // Close the modal
      showReplyModal = false;
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      sendingReply = false;
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
  });
</script>

<div class="mb-4 flex justify-between items-center">
  <h2 class="text-2xl font-bold flex items-center">
    Messages 
    {#if totalUnreadCount > 0}
      <span class="relative flex h-3 w-3 ml-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
      </span>
    {/if}
  </h2>
  <Button color="blue" on:click={loadMessages}>
    Refresh
  </Button>
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
    No messages found.
  </Alert>
{:else}
  <div class="grid grid-cols-1 gap-4">
    {#each threads as thread}
      <Card class={thread.unreadCount > 0 ? 'border-blue-500 border-2' : ''}>
        <div class="flex justify-between items-start">
          <div class="flex items-start gap-4">
            <Avatar class="hidden sm:block" />
            <div>
              <h5 class="text-lg font-bold flex items-center gap-2">
                {thread.userName}
                {#if thread.unreadCount > 0}
                  <Badge color="blue">{thread.unreadCount} New</Badge>
                {/if}
              </h5>
              <p class="text-sm text-gray-500">
                {getTimeAgo(thread.createdAt)}
                {#if thread.lockerNumber}
                  • Locker #{thread.lockerNumber}
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
          </div>
          <Button size="sm" on:click={() => openReplyModal(thread)}>
            {thread.unreadCount > 0 ? 'View & Reply' : 'Reply'}
          </Button>
        </div>
      </Card>
    {/each}
  </div>
{/if}

{#if showReplyModal && selectedThread}
  <Modal bind:open={showReplyModal} size="lg" autoclose={false}>
    <h3 class="text-xl font-bold">
      Message from {selectedThread.userName}
      {#if selectedThread.lockerNumber}
        <span class="text-sm font-normal ml-2">• Locker #{selectedThread.lockerNumber}</span>
      {/if}
    </h3>
    <p class="text-sm text-gray-500 mb-4">{formatTimestamp(selectedThread.createdAt)}</p>
    
    <div class="bg-gray-50 p-3 rounded-lg mb-4">
      <p>{selectedThread.content}</p>
    </div>
    
    {#if selectedThread.replies.length > 0}
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-2">Conversation:</h4>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          {#each selectedThread.replies as reply}
            <div class="p-3 rounded-lg {reply.userId === selectedThread.userId ? 'bg-gray-50 ml-6' : 'bg-blue-50 mr-6'}">
              <div class="flex justify-between">
                <p class="font-semibold text-sm">
                  {reply.userId === selectedThread.userId ? selectedThread.userName : 'Admin'}
                </p>
                <p class="text-xs text-gray-500">{formatTimestamp(reply.createdAt)}</p>
              </div>
              <p class="mt-1">{reply.content}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="mb-4">
      <Label for="replyContent">Reply:</Label>
      <Textarea 
        id="replyContent" 
        bind:value={replyContent} 
        rows={4} 
        placeholder="Type your reply here..."
      />
    </div>
    
    <div class="flex justify-end space-x-3">
      <Button 
        color="alternative" 
        on:click={() => (showReplyModal = false)}
      >
        Close
      </Button>
      <Button 
        color="blue" 
        disabled={!replyContent.trim() || sendingReply} 
        on:click={sendReply}
      >
        {sendingReply ? 'Sending...' : 'Send Reply'}
      </Button>
    </div>
  </Modal>
{/if} 