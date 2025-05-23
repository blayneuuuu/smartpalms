<script lang="ts">
	import { Button, Input, Label, Alert, Spinner, Checkbox } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let passwordVisible = false;
	let confirmPasswordVisible = false;
	let registrationSuccess = false;
	let loading = false;
	let agreeToTerms = false;
</script>

<div class="flex-grow flex items-center justify-center w-full z-10">
	<div class="w-full max-w-md bg-orange-100 rounded-3xl shadow-md m-4 overflow-hidden">
		<h1 class="text-xl sm:text-2xl text-center text-gray-900 pt-6">Create Account</h1>
		
		{#if form?.success}
			<div class="p-6">
				<Alert color="green" class="mb-4">
					{form.message}
				</Alert>
				<div class="text-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					<p class="mb-4">We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.</p>
					<p class="mb-4 text-orange-700 text-sm italic">If you don't see the email in your inbox, please check your spam or junk folder.</p>
					<div class="flex flex-col space-y-2">
						<a href="/">
							<Button class="w-full bg-black text-white rounded-full">Return to Login</Button>
						</a>
						<a href="/manual-verify" class="text-orange-600 hover:underline text-sm">
							Enter Verification Token Manually
						</a>
					</div>
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
					<Label for="name" class="mb-2">Name</Label>
					<Input
						class="bg-orange-500 border-none rounded-full text-black placeholder-black"
						type="text"
						name="name"
						id="name"
						placeholder="Full Name"
						required
						bind:value={name}
					/>
				</div>
				<div>
					<Label for="email" class="mb-2">Email</Label>
					<Input
						class="bg-orange-300 border-none rounded-full text-black placeholder-black"
						type="email"
						name="email"
						id="email"
						placeholder="name@company.com"
						required
						bind:value={email}
					/>
				</div>
				<div>
					<Label for="password" class="mb-2">Password</Label>
					<div class="relative">
						<Input
							class="bg-orange-300 border-none rounded-full text-black pr-10 placeholder-black"
							type={passwordVisible ? "text" : "password"}
							name="password"
							id="password"
							placeholder="••••••••"
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
				</div>
				<div>
					<Label for="confirmPassword" class="mb-2">Confirm password</Label>
					<div class="relative">
						<Input
							class="bg-orange-300 border-none rounded-full text-black pr-10 placeholder-black"
							type={confirmPasswordVisible ? "text" : "password"}
							name="confirmPassword"
							id="confirmPassword"
							placeholder="••••••••"
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
				</div>

				<div class="flex items-start">
					<Checkbox id="terms" name="terms" bind:checked={agreeToTerms} class="text-orange-600" required />
					<label for="terms" class="ml-2 block text-sm text-gray-900">
						I agree to the <a href="/terms" class="text-orange-600 hover:underline">Terms and Conditions</a>
					</label>
				</div>

				<Button type="submit" class="w-full bg-black text-white rounded-full" disabled={loading || !agreeToTerms}>
					{#if loading}
						<Spinner class="mr-2" size="4" color="white" />
						Creating Account...
					{:else}
						Create Account
					{/if}
				</Button>
			</form>
			<div class="border-t border-black p-4 text-center">
				<p class="text-sm text-gray-600">
					or
					<a href="/" class="text-orange-600 hover:underline">Sign In</a>
				</p>
			</div>
		{/if}
	</div>
</div>