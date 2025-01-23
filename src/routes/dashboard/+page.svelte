<script lang="ts">
	import AdminDashboard from './AdminDashboard.svelte';
	import UserDashboard from './UserDashboard.svelte';
	import { error } from '@sveltejs/kit';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	type UserData = {
		id: string;
		email: string;
		name: string;
		type: 'admin' | 'user';
	};

	let authError = $state<Error | null>(null);
	let userData = $state<UserData>(data.user);
</script>

{#if !userData}
	<div class="flex justify-center items-center h-screen">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
	</div>
{:else if authError}
	<div class="p-4 bg-red-100 text-red-700 rounded-md">
		<p>Error: {authError.message}</p>
	</div>
{:else}
	{#if userData.type === 'admin'}
		<AdminDashboard {userData} />
	{:else}
		<UserDashboard {userData} />
	{/if}
{/if}