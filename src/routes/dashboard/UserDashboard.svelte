<script lang="ts">
	import { UserButton } from 'svelte-clerk';
	import { Card } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogFooter,
	} from "$lib/components/ui/dialog";
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	
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
	let showRentDialog = $state(false);
	let selectedLocker = $state<{id: string; number: string} | null>(null);
	let selectedSubscriptionType = $state<string | null>(null);
	let proofOfPayment = $state<string | null>(null);
	let subscriptionTypes = $state<Array<{
		id: string;
		name: string;
		duration: string;
		amount: number;
	}>>([]);

	// Mock subscription types until API is ready
	subscriptionTypes = [
		{ id: "1", name: "1 Day Access", duration: "1_day", amount: 5000 },
		{ id: "2", name: "7 Days Access", duration: "7_days", amount: 30000 },
		{ id: "3", name: "30 Days Access", duration: "30_days", amount: 100000 },
	];

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

	function formatAmount(amount: number): string {
		return `₱${(amount / 100).toFixed(2)}`;
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		const reader = new FileReader();

		reader.onload = () => {
			proofOfPayment = reader.result as string;
		};

		reader.readAsDataURL(file);
	}

	async function handleRentSubmit() {
		if (!selectedLocker || !selectedSubscriptionType || !proofOfPayment || !userData.id) {
			error = "Please fill in all required fields";
			return;
		}

		try {
			// Create locker request
			const response = await fetch('/api/lockers/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: userData.id,
					lockerId: selectedLocker.id,
					subscriptionTypeId: selectedSubscriptionType,
					proofOfPayment,
				}),
			});

			if (!response.ok) throw new Error('Failed to submit rental request');

			// Reset form
			showRentDialog = false;
			selectedLocker = null;
			selectedSubscriptionType = null;
			proofOfPayment = null;

			// Refresh locker data
			fetchRentedLockers();
		} catch (err) {
			console.error('Error submitting rental request:', err);
			error = err instanceof Error ? err.message : 'Failed to submit rental request';
		}
	}

	function openRentDialog(locker: {id: string; number: string}) {
		selectedLocker = locker;
		showRentDialog = true;
	}

	// Fetch data when component mounts
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

		<Dialog bind:open={showRentDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rent Locker {selectedLocker?.number}</DialogTitle>
					<DialogDescription>
						Please select a subscription plan and upload your proof of payment.
					</DialogDescription>
				</DialogHeader>

				<div class="grid gap-4 py-4">
					<div class="grid gap-2">
						<Label for="subscription">Subscription Plan</Label>
						<Select onValueChange={(value) => selectedSubscriptionType = value}>
							<SelectTrigger>
								<SelectValue placeholder="Select a plan" />
							</SelectTrigger>
							<SelectContent>
								{#each subscriptionTypes as type}
									<SelectItem value={type.id}>
										{type.name} - {formatAmount(type.amount)}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>

					<div class="grid gap-2">
						<Label for="proof">Proof of Payment</Label>
						<Input
							id="proof"
							type="file"
							accept="image/*"
							on:change={handleFileUpload}
						/>
						{#if proofOfPayment}
							<img 
								src={proofOfPayment} 
								alt="Proof of Payment Preview"
								class="mt-2 max-h-48 rounded-lg"
							/>
						{/if}
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" on:click={() => showRentDialog = false}>
						Cancel
					</Button>
					<Button
						on:click={handleRentSubmit}
						disabled={!selectedSubscriptionType || !proofOfPayment}
					>
						Submit Request
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		<div class="bg-white shadow rounded-lg p-6">
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