<script lang="ts">
  import { page } from '$app/stores';
  import { Button, Alert } from 'flowbite-svelte';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img src="/logo.png" alt="SmartPalms Logo" class="mx-auto h-16 w-auto">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Account Status
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if $page.data.user?.status === 'suspended'}
        <Alert color="yellow" class="mb-6">
          <span class="font-semibold">Account Suspended</span>
        </Alert>
        <p class="text-sm text-gray-600 mb-6">
          Your account has been temporarily suspended. This may be due to a payment issue or a violation of our terms of service.
          Please contact our support team for assistance.
        </p>
      {:else if $page.data.user?.status === 'blocked'}
        <Alert color="red" class="mb-6">
          <span class="font-semibold">Account Blocked</span>
        </Alert>
        <p class="text-sm text-gray-600 mb-6">
          Your account has been blocked. This is usually due to multiple violations of our terms of service or 
          other serious issues. Please contact our support team if you believe this is an error.
        </p>
      {:else}
        <Alert color="blue" class="mb-6">
          <span class="font-semibold">Account Status Issue</span>
        </Alert>
        <p class="text-sm text-gray-600 mb-6">
          There appears to be an issue with your account status. Please contact our support team for assistance.
        </p>
      {/if}

      <div class="flex flex-col space-y-3">
        <Button href="mailto:support@smartpalms.ph" color="blue">
          Contact Support
        </Button>
        <Button href="/logout" color="light">
          Sign Out
        </Button>
      </div>
    </div>
  </div>
</div> 