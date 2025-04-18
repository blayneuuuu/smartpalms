<script lang="ts">
  import { notifications, type Notification } from '$lib/stores/notification';
  import { fly, fade } from 'svelte/transition';
  import { Alert } from 'flowbite-svelte';
  import { ExclamationCircleSolid, CheckCircleSolid, InfoCircleSolid, XSolid } from 'flowbite-svelte-icons';

  let hoveredNotification: string | null = $state(null);

  function getAlertColor(type: Notification['type']) {
    switch (type) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'warning': return 'yellow';
      case 'info': 
      default: return 'blue';
    }
  }
  
  function getIcon(type: Notification['type']) {
    switch (type) {
      case 'success': return CheckCircleSolid;
      case 'error': return XSolid;
      case 'warning': return ExclamationCircleSolid;
      case 'info': 
      default: return InfoCircleSolid;
    }
  }
</script>

<div class="fixed top-4 right-4 z-50 w-auto max-w-sm space-y-2 pointer-events-none">
  {#each $notifications as notification (notification.id)}
    <div
      transition:fly={{ x: 20, duration: 300 }}
      class="pointer-events-auto"
      on:mouseenter={() => hoveredNotification = notification.id}
      on:mouseleave={() => hoveredNotification = null}
    >
      <Alert 
        color={getAlertColor(notification.type)} 
        dismissable
        on:dismiss={() => notifications.remove(notification.id)}
      >
        <svelte:component this={getIcon(notification.type)} slot="icon" />
        <span class="font-medium">{notification.message}</span>
      </Alert>
    </div>
  {/each}
</div> 