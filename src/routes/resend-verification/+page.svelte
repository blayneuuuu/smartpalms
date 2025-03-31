<script lang="ts">
  import { Button, Input, Alert, Spinner } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
  let email = '';
  let loading = false;
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
  <div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 overflow-hidden">
    <h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Resend Verification Email</h1>
    
    {#if form?.success}
      <div class="p-6">
        <Alert color="green" class="mb-4">
          {form.message}
        </Alert>
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p class="mb-4">Please check your email inbox for the verification link.</p>
          <p class="mb-4 text-orange-700 text-sm italic">If you don't see the email in your inbox, please check your spam or junk folder.</p>
          <a href="/">
            <Button class="bg-black text-white rounded-full">Return to Login</Button>
          </a>
        </div>
      </div>
    {:else}
      {#if form?.error}
        <Alert color="red" class="mx-4 mt-4">
          {form.error}
        </Alert>
      {/if}
      <form method="POST" use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          update();
        };
      }} class="space-y-4 p-6">
        <div>
          <p class="mb-4 text-gray-700">
            Enter your email address and we'll send a new verification link.
          </p>
          <Input
            class="bg-orange-300 border-none rounded-full text-black placeholder-black"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            bind:value={email}
          />
        </div>
        <Button type="submit" class="w-full bg-black text-white rounded-full" disabled={loading}>
          {#if loading}
            <Spinner class="mr-2" size="4" color="white" />
            Sending...
          {:else}
            Send Verification Link
          {/if}
        </Button>
      </form>
      <div class="border-t border-black p-4 text-center">
        <p class="text-sm text-gray-600">
          or
          <a href="/manual-verify" class="text-orange-600 hover:underline">Enter Verification Token Manually</a>
        </p>
      </div>
    {/if}
  </div>
</div> 