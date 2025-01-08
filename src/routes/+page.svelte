<script lang="ts">
    import { goto } from '$app/navigation';
    import { Card, Button, Label, Input } from 'flowbite-svelte';
  
    let email = '';
    let password = '';
    let error = '';
  
    function handleSubmit() {
      error = '';
      console.log(email, password);
    }
  </script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 text-black">
    <Card class="w-full max-w-md">
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-6">
        <h3 class="text-2xl font-bold text-gray-900 mx-auto">Welcome to Smart Palms</h3>
        <Label class="space-y-2">
          <span>Email</span>
          <Input class="text-black" type="email" placeholder="name@company.com" bind:value={email} required />
        </Label>
        <Label class="space-y-2">
          <span>Password</span>
          <Input type="password" placeholder="•••••" bind:value={password} required />
        </Label>
        {#if error}
          <p class="text-red-500">{error}</p>
        {/if}

        <Button type="submit" class="w-1/2 bg-gray-600 mx-auto rounded-md text-white py-2">Login</Button>
      </form>
      <span class="mx-auto">Don't have an account? <a href="/register" class="text-blue-500">Register</a></span>
    </Card>
  </div>