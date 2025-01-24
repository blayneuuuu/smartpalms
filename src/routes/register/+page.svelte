<script lang="ts">
	import { Button, Input, Label, Alert } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';

	export let form: ActionData;

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';

	$: if (form?.success) {
		goto(form.location);
	}
</script>

<div class="w-screen h-screen flex flex-col justify-center items-center bg-gray-50">
	<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
		{#if form?.error}
			<Alert color="red" class="mt-4">
				{form.error}
			</Alert>
		{/if}
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<Label for="name" class="mb-2">Full Name</Label>
				<Input
					type="text"
					name="name"
					id="name"
					placeholder="John Doe"
					required
					bind:value={name}
				/>
			</div>
			<div>
				<Label for="email" class="mb-2">Email</Label>
				<Input
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
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="••••••••"
					required
					bind:value={password}
				/>
			</div>
			<div>
				<Label for="confirmPassword" class="mb-2">Confirm Password</Label>
				<Input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					placeholder="••••••••"
					required
					bind:value={confirmPassword}
				/>
			</div>
			<Button type="submit" class="w-full">Create Account</Button>
		</form>
		<p class="text-sm text-center text-gray-600">
			Already have an account?
			<a href="/" class="text-blue-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>