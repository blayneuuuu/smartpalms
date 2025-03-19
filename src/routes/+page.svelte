<script lang="ts">
	import { Button, Input, Label, Alert } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = '';
	let password = '';
</script>

<div class="w-screen h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
	<div class="w-full max-w-md p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-md">
		<h1 class="text-xl sm:text-2xl font-bold text-center text-gray-900">Welcome to Smart Palms</h1>
		{#if form?.error}
			<Alert color="red" class="mt-4">
				{form.error}
			</Alert>
		{/if}
		<form method="POST" use:enhance class="space-y-4">
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
			<Button type="submit" class="w-full">Sign in</Button>
		</form>
		<p class="text-sm text-center text-gray-600">
			Don't have an account?
			<a href="/register" class="text-blue-600 hover:underline">Sign up</a>
		</p>
	</div>
</div>