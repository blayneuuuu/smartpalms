<script lang="ts">
	import { UserButton } from 'svelte-clerk';
	
	type UserData = {
		email: string;
		fullName: string;
		imageUrl: string;
		id: string | null;
	}

	let { userData } = $props<{userData: UserData}>();

	let rentedLockers = $state(0);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchRentedLockers() {
		if (!userData.id) return;
		
		loading = true;
		error = null;
		try {
			const response = await fetch(`/api/lockers/user/${userData.id}`);
			if (!response.ok) throw new Error('Failed to fetch locker data');
			const data = await response.json();
			rentedLockers = data.count ?? 0;
		} catch (err) {
			console.error('Error fetching locker data:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch locker data';
			rentedLockers = 0;
		} finally {
			loading = false;
		}
	}

	// Fetch data immediately when component mounts
	if (userData.id) {
		fetchRentedLockers();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm">
		<div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center">
			<h1 class="text-2xl font-extrabold text-gray-900">Dashboard</h1>
			<div class="flex flex-row items-center space-x-4">
				<div class="flex items-center space-x-3">
					<span class="text-lg font-semibold text-gray-700">{userData.fullName}</span>
				</div>
				<UserButton afterSignOutUrl="/"/>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="bg-white shadow rounded-lg p-6">
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
					<p>{error}</p>
					<button 
						class="bg-red-100 text-red-800 px-3 py-1 rounded mt-2 hover:bg-red-200"
						on:click={fetchRentedLockers}
					>
						Retry
					</button>
				</div>
			{/if}

			<div class="border rounded-lg p-6">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-xl text-gray-700">
						Rented Lockers: 
						{#if loading}
							<span class="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse"></span>
						{:else}
							<span class="font-semibold text-black">{rentedLockers}</span>
						{/if}
					</h2>
					<a 
						href="/lockers" 
						class="bg-blue-500 hover:bg-blue-600 text-white text-lg px-6 py-2 rounded-md transition-colors duration-200 inline-flex items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
						</svg>
						Rent a Locker
					</a>
				</div>
				
				{#if !loading && rentedLockers > 0}
					<div class="mt-4">
						<!-- We can add a list of rented lockers here -->
					</div>
				{:else if !loading}
					<p class="text-gray-500 text-center py-8">
						You haven't rented any lockers yet. Click the button above to get started!
					</p>
				{/if}
			</div>
		</div>
	</main>
</div>