<script lang="ts">
  import { Button, Input, Alert, Spinner } from 'flowbite-svelte';
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import { page } from '$app/stores';

  export let form: ActionData;
  export let data: PageData;

  let newPassword = '';
  let confirmPassword = '';
  let loading = false;
  let passwordVisible = false;
  let confirmPasswordVisible = false;
  
  // Get token from URL query parameter
  $: token = $page.url.searchParams.get('token') || '';
  $: passwordsMatch = newPassword === confirmPassword;
  $: passwordMinLength = newPassword.length >= 8;
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
  <div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 overflow-hidden">
    <h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Reset Password</h1>
    
    {#if data.invalidToken}
      <Alert color="red" class="mx-4 my-4">
        Invalid or expired reset token. Please request a new password reset link.
        <div class="mt-2">
          <a href="/forgot-password" class="text-red-800 font-semibold hover:underline">
            Request new link
          </a>
        </div>
      </Alert>
    {:else if form?.success}
      <Alert color="green" class="mx-4 mt-4">
        {form.message}
        <div class="mt-2">
          <a href="/" class="text-green-800 font-semibold hover:underline">
            Back to login
          </a>
        </div>
      </Alert>
    {:else if form?.error}
      <Alert color="red" class="mx-4 mt-4">
        {form.error}
      </Alert>
    {:else}
      <div class="p-6">
        <p class="text-gray-600 mb-4">Please enter a new password for your account.</p>
        
        <form method="POST" use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            update();
          };
        }}>
          <input type="hidden" name="token" value={token}>
          
          <div class="mb-4">
            <div class="relative">
              <Input
                class="bg-orange-300 border-none rounded-full text-black pr-10 placeholder-black"
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                placeholder="New Password"
                required
                bind:value={newPassword}
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                on:click={() => passwordVisible = !passwordVisible}
              >
                {#if passwordVisible}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                {/if}
              </button>
            </div>
            {#if newPassword && !passwordMinLength}
              <p class="text-red-600 text-sm mt-1">Password must be at least 8 characters</p>
            {/if}
          </div>
          
          <div class="mb-6">
            <div class="relative">
              <Input
                class="bg-orange-300 border-none rounded-full text-black pr-10 placeholder-black"
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                required
                bind:value={confirmPassword}
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                on:click={() => confirmPasswordVisible = !confirmPasswordVisible}
              >
                {#if confirmPasswordVisible}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                {/if}
              </button>
            </div>
            {#if confirmPassword && !passwordsMatch}
              <p class="text-red-600 text-sm mt-1">Passwords do not match</p>
            {/if}
          </div>
          
          <Button 
            type="submit" 
            class="w-full bg-black text-white rounded-full" 
            disabled={loading || !newPassword || !confirmPassword || !passwordsMatch || !passwordMinLength}
          >
            {#if loading}
              <Spinner class="mr-2" size="4" color="white" />
              Resetting Password...
            {:else}
              Reset Password
            {/if}
          </Button>
        </form>
      </div>
    {/if}
    
    <div class="border-t border-black p-4 text-center">
      <p class="text-sm text-gray-600">
        Remember your password? <a href="/" class="text-orange-600 hover:underline">Log In</a>
      </p>
    </div>
  </div>
</div> 