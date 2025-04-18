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
    <h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Forgot Password</h1>
    
    {#if form?.success}
      <Alert color="green" class="mx-4 mt-4">
        {form.message}
      </Alert>
    {:else if form?.error}
      <Alert color="red" class="mx-4 mt-4">
        {form.error}
      </Alert>
    {/if}
    
    <div class="p-6">
      <p class="text-gray-600 mb-4">Please enter your email address. We'll send you a link to reset your password.</p>
      
      <form method="POST" use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          update();
        };
      }}>
        <div class="mb-6">
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
            Send Reset Link
          {/if}
        </Button>
      </form>
      
      <div class="mt-4 text-center">
        <a href="/" class="text-orange-600 hover:underline">Back to Login</a>
      </div>
    </div>
  </div>
</div> 