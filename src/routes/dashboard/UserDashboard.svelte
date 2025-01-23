<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	type UserData = {
		id: string;
		email: string;
		name: string;
		type: 'admin' | 'user';
	};

	let { userData } = $props<{ userData: UserData }>();

	type LockerData = {
		subscriptions: Array<{
			id: string;
			lockerId: string;
			expiresAt: string;
			lockerNumber: string;
			lockerSize: string;
			status: string;
		}>;
		requests: Array<{
			id: string;
			lockerId: string;
			lockerNumber: string;
			lockerSize: string;
			status: string;
			rejectionReason?: string;
			requestedAt: string;
			subscriptionName: string;
			proofOfPayment: string | null;
		}>;
		subscriptionsCount: number;
		requestsCount: number;
	};

	let lockerData = $state<LockerData>({
		subscriptions: [],
		requests: [],
		subscriptionsCount: 0,
		requestsCount: 0
	});
	let loading = $state(true);
	let error = $state<string | null>(null);
	let otpStates = $state<Record<string, { otp: string; expiresAt: string } | null>>({});

	async function fetchLockerData() {
		if (!userData.id) return;

		loading = true;
		error = null;
		try {
			const response = await fetch(`/api/lockers/user/${userData.id}`);
			if (!response.ok) throw new Error('Failed to fetch locker data');
			const data = await response.json();
			lockerData = data;
		} catch (err) {
			console.error('Error fetching locker data:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch locker data';
			lockerData = { subscriptions: [], requests: [], subscriptionsCount: 0, requestsCount: 0 };
		} finally {
			loading = false;
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function generateOTP(lockerId: string) {
		try {
			const response = await fetch(`/api/lockers/${lockerId}/otp`, {
				method: 'POST'
			});

			if (!response.ok) throw new Error('Failed to generate OTP');

			const data = await response.json();
			otpStates[lockerId] = data;
		} catch (err) {
			console.error('Error generating OTP:', err);
			error = err instanceof Error ? err.message : 'Failed to generate OTP';
		}
	}

	async function resubmitRequest(requestId: string, newProofOfPayment: string | null = null) {
		try {
			const response = await fetch(`/api/lockers/request/${requestId}/resubmit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ proofOfPayment: newProofOfPayment })
			});

			if (!response.ok) throw new Error('Failed to resubmit request');

			await fetchLockerData();
		} catch (err) {
			console.error('Error resubmitting request:', err);
			error = err instanceof Error ? err.message : 'Failed to resubmit request';
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

	// Fetch data when component mounts
	$effect(() => {
		if (userData.id) {
			fetchLockerData();
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm">
		<div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center">
			<h1 class="text-2xl font-extrabold text-gray-900">Dashboard</h1>
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
		{#if error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
				<p>{error}</p>
				<button
					class="bg-red-100 text-red-800 px-3 py-1 rounded mt-2 hover:bg-red-200"
					on:click={fetchLockerData}
				>
					Retry
				</button>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Rented Lockers Section -->
			<div class="bg-white shadow rounded-lg p-6">
				<div class="border rounded-lg p-6">
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-xl text-gray-700">
							Rented Lockers:
							{#if loading}
								<span class="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
							{:else}
								<span class="font-semibold text-black">{lockerData.subscriptionsCount}</span>
							{/if}
						</h2>
						<a
							href="/lockers"
							class="bg-blue-500 hover:bg-blue-600 text-white text-lg px-6 py-2 rounded-md transition-colors duration-200 inline-flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
									clip-rule="evenodd"
								/>
							</svg>
							Rent a Locker
						</a>
					</div>

					{#if !loading && lockerData.subscriptionsCount > 0}
						<div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each lockerData.subscriptions as subscription}
								<div class="bg-white rounded-lg shadow p-4 border border-gray-200">
									<div class="flex justify-between items-start mb-2">
										<div>
											<h3 class="text-lg font-semibold">Locker #{subscription.lockerNumber}</h3>
											<p class="text-sm text-gray-500 capitalize">{subscription.lockerSize} Size</p>
										</div>
										<span
											class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
										>
											Active
										</span>
									</div>
									<div class="mt-4 space-y-3">
										<p class="text-sm text-gray-600">
											<span class="font-medium">Expires:</span>
											{formatDate(subscription.expiresAt)}
										</p>

										{#if otpStates[subscription.lockerId]}
											<div class="bg-blue-50 p-3 rounded-md">
												<p class="text-sm font-medium text-blue-900">
													OTP: {otpStates[subscription.lockerId]?.otp || 'N/A'}
												</p>
											</div>
										{/if}

										<Button
											variant="outline"
											class="w-full"
											on:click={() => generateOTP(subscription.lockerId)}
										>
											{otpStates[subscription.lockerId] ? 'Generate New OTP' : 'Generate OTP'}
										</Button>
									</div>
								</div>
							{/each}
						</div>
					{:else if !loading}
						<p class="text-gray-500 text-center py-8">
							You haven't rented any lockers yet. Click the button above to get started!
						</p>
					{/if}
				</div>
			</div>

			<!-- Locker Requests Section -->
			{#if lockerData.requestsCount > 0}
				<div class="bg-white shadow rounded-lg p-6">
					<div class="border rounded-lg p-6">
						<h2 class="text-xl text-gray-700 mb-6">Locker Requests</h2>
						<div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each lockerData.requests as request}
								<div class="bg-white rounded-lg shadow p-4 border border-gray-200">
									<div class="flex justify-between items-start mb-2">
										<div>
											<h3 class="text-lg font-semibold">Locker #{request.lockerNumber}</h3>
											<p class="text-sm text-gray-500 capitalize">{request.lockerSize} Size</p>
										</div>
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
											{request.status === 'pending'
												? 'bg-yellow-100 text-yellow-800'
												: request.status === 'approved'
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'}"
										>
											{request.status}
										</span>
									</div>
									<div class="mt-4 space-y-3">
										<p class="text-sm text-gray-600">
											<span class="font-medium">Subscription:</span>
											{request.subscriptionName}
										</p>
										<p class="text-sm text-gray-600">
											<span class="font-medium">Requested:</span>
											{formatDate(request.requestedAt)}
										</p>
										{#if request.status === 'rejected'}
											<div class="bg-red-50 p-3 rounded-md">
												<p class="text-sm text-red-800">
													<span class="font-medium">Reason:</span>
													{request.rejectionReason}
												</p>
												<Button
													variant="outline"
													class="w-full mt-2"
													on:click={() => resubmitRequest(request.id)}
												>
													Resubmit Request
												</Button>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>