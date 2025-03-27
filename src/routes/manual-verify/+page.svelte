<script lang="ts">
  import { Button, Input, Alert } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { goto } from '$app/navigation';

  export let form: ActionData;
  let token = '';
  
  function goToLogin() {
    goto('/');
  }
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
  <div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 overflow-hidden">
    <h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Manual Verification</h1>
    
    {#if form?.success}
      <div class="p-6 text-center">
        <Alert color="green" class="mb-4">
          {form.message}
        </Alert>
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="mb-4">Your account is now active. You can log in.</p>
        <Button class="bg-black text-white rounded-full" on:click={goToLogin}>Go to Login</Button>
      </div>
    {:else}
      {#if form?.error}
        <Alert color="red" class="mx-4 mt-4">
          {form.error}
        </Alert>
      {/if}
      <form method="POST" use:enhance class="space-y-4 p-6">
        <div>
          <p class="mb-4 text-gray-700">
            Enter your verification token below. This token was sent to your email when you registered.
          </p>
          <Input
            class="bg-orange-300 border-none rounded-full text-black placeholder-black"
            type="text"
            name="token"
            id="token"
            placeholder="Verification Token"
            required
            bind:value={token}
          />
        </div>
        <Button type="submit" class="w-full bg-black text-white rounded-full">Verify Account</Button>
      </form>
      <div class="border-t border-black p-4 text-center">
        <p class="text-sm text-gray-600">
          or
          <a href="/resend-verification" class="text-orange-600 hover:underline">Resend Verification Email</a>
        </p>
      </div>
    {/if}
  </div>
</div> 