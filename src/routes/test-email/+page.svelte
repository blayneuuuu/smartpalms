<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Alert } from 'flowbite-svelte';
  
  let status: string | null = null;
  let loading = false;
  let error: string | null = null;
  
  async function testEmail() {
    loading = true;
    status = null;
    error = null;
    
    try {
      const response = await fetch('/api/test-email');
      const result = await response.json();
      
      if (result.success) {
        status = result.message;
      } else {
        error = result.error || 'Failed to send test email';
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-6 max-w-md">
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="bg-orange-500 text-white p-4">
      <h1 class="text-xl font-bold">Email Configuration Test</h1>
    </div>
    
    <div class="p-6">
      <p class="mb-4 text-gray-700">
        Click the button below to test the email configuration by sending a test email.
      </p>
      
      {#if status}
        <Alert color="green" class="mb-4">
          {status}
        </Alert>
      {/if}
      
      {#if error}
        <Alert color="red" class="mb-4">
          {error}
        </Alert>
      {/if}
      
      <Button 
        type="button" 
        class="w-full bg-black text-white rounded-full"
        on:click={testEmail}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </Button>
    </div>
  </div>
</div> 