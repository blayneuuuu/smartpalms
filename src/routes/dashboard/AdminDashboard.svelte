<script lang="ts">
	import Request from './dashboardComponents/Request.svelte';
	import Users from './dashboardComponents/Users.svelte';
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	type UserData = {
		id: string;
		email: string;
		name: string;
		type: 'admin' | 'user';
	};

	let { userData } = $props<{ userData: UserData }>();

	type DashboardTab = 'requests' | 'lockers' | 'users';
	let activeTab = $state<DashboardTab>('requests');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let stats = $state({
		totalLockers: 0,
		occupiedLockers: 0,
		totalUsers: 0,
		pendingRequests: 0
	});

	async function fetchDashboardStats() {
		loading = true;
		error = null;
		try {
			const response = await fetch('/api/admin/stats');
			if (!response.ok) throw new Error('Failed to fetch dashboard stats');
			const data = await response.json();
			stats = data;
		} catch (err) {
			console.error('Error fetching dashboard stats:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
		} finally {
			loading = false;
		}
	}

	async function handleSignOut() {
		try {
			const response = await fetch('/api/auth/signout', { method: 'POST' });
			if (response.ok) {
				goto('/');
			}
		} catch (err) {
			console.error('Sign out failed:', err);
		}
	}

	// Fetch stats immediately when component mounts
	fetchDashboardStats();
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm">
		<div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center">
			<h1 class="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
			<div class="flex flex-row items-center space-x-4">
				<div class="flex items-center space-x-3">
					<span class="text-lg font-semibold text-gray-700">{userData.name}</span>
				</div>
				<Button href="/profile" color="light">Profile</Button>
				<Button color="light" on:click={handleSignOut}>Sign out</Button>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			{#each Object.entries(stats) as [key, value]}
				<div class="bg-white rounded-lg shadow p-6">
					<h3 class="text-gray-500 text-sm font-medium">
						{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
					</h3>
					{#if loading}
						<div class="mt-2 h-8 bg-gray-200 rounded animate-pulse" />
					{:else}
						<p class="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
					{/if}
				</div>
			{/each}
		</div>

		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
				<p>{error}</p>
				<button
					class="bg-red-100 text-red-800 px-3 py-1 rounded mt-2 hover:bg-red-200"
					on:click={fetchDashboardStats}
				>
					Retry
				</button>
			</div>
		{/if}

		<!-- Tab Navigation -->
		<div class="bg-white shadow rounded-lg">
			<div class="border-b border-gray-200">
				<nav class="flex space-x-8 px-6" aria-label="Tabs">
					<button
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'requests'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						on:click={() => (activeTab = 'requests')}
					>
						Requests
					</button>
					<button
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'lockers'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						on:click={() => (activeTab = 'lockers')}
					>
						Lockers
					</button>
					<button
						class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'users'
							? 'border-blue-500 text-blue-600'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						on:click={() => (activeTab = 'users')}
					>
						Users
					</button>
				</nav>
			</div>

			<div class="p-6">
				{#if activeTab === 'requests'}
					<Request />
				{:else if activeTab === 'lockers'}
					<!-- Locker management component will go here -->
					<p class="text-gray-500 text-center py-4">Locker management coming soon</p>
				{:else}
					<!-- User management component will go here -->
					<Users />
				{/if}
			</div>
		</div>
	</main>
</div>