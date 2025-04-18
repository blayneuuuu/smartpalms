<!-- 
  SessionTimeout.svelte
  This component tracks user activity and warns about upcoming session expiration
-->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Alert, Button } from "flowbite-svelte";
  import { browser } from "$app/environment";
  
  export let warningTime = 30 * 60 * 1000; // 30 minutes before session expiry
  export let logoutUrl = "/logout";
  
  let showWarning = false;
  let countdown = 0;
  let timer: NodeJS.Timeout;
  let countdownTimer: NodeJS.Timeout;
  let idle = false;
  let lastActivity = Date.now();
  
  // Session timeout is 8 hours (defined in server)
  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; 
  const CHECK_INTERVAL = 60 * 1000; // Check every minute
  
  // Reset activity timer on user interaction
  function resetActivity() {
    lastActivity = Date.now();
    idle = false;
    
    if (showWarning) {
      // If user becomes active during warning, extend session
      extendSession();
    }
  }
  
  function checkTimeout() {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    
    // If inactive for nearly the session timeout, show warning
    if (timeSinceLastActivity >= SESSION_TIMEOUT - warningTime) {
      if (!showWarning) {
        showWarning = true;
        countdown = Math.floor(warningTime / 1000);
        
        // Start countdown
        countdownTimer = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            // Time's up, logout
            clearInterval(countdownTimer);
            logout();
          }
        }, 1000);
      }
    } else if (showWarning) {
      // Cancel warning if user has been active
      showWarning = false;
      clearInterval(countdownTimer);
    }
    
    // If inactive for session timeout, logout automatically
    if (timeSinceLastActivity >= SESSION_TIMEOUT) {
      idle = true;
      logout();
    }
  }
  
  function extendSession() {
    // Reset the warning
    showWarning = false;
    clearInterval(countdownTimer);
    
    // Reset activity timer
    lastActivity = Date.now();
    
    // Call an API endpoint to extend the session cookie on the server
    fetch("/api/session/extend", { method: "POST" })
      .then(response => {
        if (response.ok) {
          console.log("Session extended successfully");
        }
      })
      .catch(error => {
        console.error("Failed to extend session:", error);
      });
  }
  
  function logout() {
    // Navigate to logout URL
    goto(logoutUrl);
  }
  
  onMount(() => {
    // Skip if not in browser environment
    if (!browser) return;
    
    // Initialize session activity tracking
    
    // Set up event listeners for user activity
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetActivity);
    });
    
    // Set up interval to check for timeout
    timer = setInterval(checkTimeout, CHECK_INTERVAL);
    
    // Initial activity reset
    resetActivity();
  });
  
  onDestroy(() => {
    // Skip if not in browser environment
    if (!browser) return;
    
    // Clean up event listeners and timers
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    activityEvents.forEach(event => {
      window.removeEventListener(event, resetActivity);
    });
    
    clearInterval(timer);
    clearInterval(countdownTimer);
  });
  
  // Subscribe to page changes to reset activity
  $: if (browser && $page) resetActivity();
</script>

{#if browser && showWarning}
  <div class="fixed bottom-4 right-4 z-50 w-96 max-w-full">
    <Alert color="yellow" dismissable={false}>
      <span class="font-medium">Session timeout warning!</span>
      <p>Your session will expire in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}.</p>
      <div class="flex justify-end mt-3 space-x-2">
        <Button size="xs" color="alternative" on:click={logout}>Logout</Button>
        <Button size="xs" color="yellow" on:click={extendSession}>Stay logged in</Button>
      </div>
    </Alert>
  </div>
{/if} 