<script lang="ts">
// hello 
	import { Button, Input, Alert, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	export let form: ActionData;

	let email = '';
	let password = '';
	let passwordVisible = false;
	let loading = false;
	
	// If form has success and redirect property, navigate to the redirect URL
	$: if (form?.success && form?.redirect) {
		goto(form.redirect);
	}
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
	<div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 overflow-hidden">
		<h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Log In</h1>
		{#if form?.error}
			<Alert color="red" class="mx-4 mt-4">
				{form.error}
				{#if form.error.includes('verify your email')}
					<div class="mt-2">
						<a href="/resend-verification" class="text-red-800 font-semibold hover:underline">Resend verification email</a>
					</div>
				{/if}
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
				<Input
					class="bg-orange-500 border-none rounded-full text-black placeholder-black"
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					required
					bind:value={email}
				/>
			</div>
			<div>
				<div class="relative">
					<Input
						class="bg-orange-300 border-none rounded-full text-black pr-10 placeholder-black"
						type={passwordVisible ? "text" : "password"}
						name="password"
						id="password"
						placeholder="Password"
						required
						bind:value={password}
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
				<div class="flex items-center justify-between mt-2">
					<div class="flex items-center">
						<input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
						<label for="remember" class="ml-2 block text-sm text-gray-900">Remember me</label>
					</div>
					<div class="text-sm">
						<a href="/forgot-password" class="text-orange-600 hover:underline">Forgot password?</a>
					</div>
				</div>
			</div>
			<Button type="submit" class="w-full bg-black text-white rounded-full" disabled={loading}>
				{#if loading}
					<Spinner class="mr-2" size="4" color="white" />
					Signing In...
				{:else}
					Sign In
				{/if}
			</Button>
		</form>
		<div class="border-t border-black p-4 text-center">
			<p class="text-sm text-gray-600">
				or
				<a href="/register" class="text-orange-600 hover:underline">Sign Up</a>
			</p>
		</div>
	</div>
</div>