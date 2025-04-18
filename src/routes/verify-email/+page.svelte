<script lang="ts">
  import { Alert, Button } from 'flowbite-svelte';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  
  export let data: PageData;
  
  function goToLogin() {
    goto('/');
  }
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
  <div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 p-6">
    <h1 class="text-xl sm:text-2xl text-center text-gray-900 mb-6">Email Verification</h1>
    
    {#if data.success}
      <div class="text-center">
        <Alert color="green" class="mb-4">
          {data.message || 'Your email has been verified successfully!'}
        </Alert>
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="mb-4">Your account is now active. You can continue to login or dashboard.</p>
        
        <form method="POST" use:enhance>
          <Button type="submit" class="bg-black text-white rounded-full mr-2">Continue to Dashboard</Button>
          <Button class="bg-gray-500 text-white rounded-full" on:click={goToLogin}>Go to Login</Button>
        </form>
      </div>
    {:else}
      <Alert color="red" class="mb-4">
        {data.error}
      </Alert>
      
      <div class="text-center">
        <p class="mb-4">Your verification link may have expired or is invalid.</p>
        <a href="/register">
          <Button class="bg-black text-white rounded-full">Register Again</Button>
        </a>
      </div>
    {/if}
  </div>
</div> 