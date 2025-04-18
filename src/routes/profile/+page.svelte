<script lang="ts">
	import { Button, Input, Label, Alert, Spinner, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Badge } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { formatDate } from '$lib/utils/date';

	export let data: PageData;
	export let form: ActionData;

	let name = data.user.name;
	let email = data.user.email;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let showPasswordFields = false;
	let loading = false;
	let activeTab = 'profile'; // 'profile' or 'subscriptions'

	// Define a function to get the status badge color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'active': return 'green';
			case 'expired': return 'red';
			case 'cancelled': return 'dark';
			default: return 'gray';
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-4xl mx-auto px-4">
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<!-- Tab Navigation -->
			<div class="flex border-b">
				<button 
					class={"py-4 px-6 font-medium text-sm focus:outline-none " + (activeTab === 'profile' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700')}
					on:click={() => activeTab = 'profile'}
				>
					Profile Settings
				</button>
				<button 
					class={"py-4 px-6 font-medium text-sm focus:outline-none " + (activeTab === 'subscriptions' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700')}
					on:click={() => activeTab = 'subscriptions'}
				>
					Subscription History
				</button>
			</div>

			<!-- Profile Tab -->
			{#if activeTab === 'profile'}
				<div class="p-8">
					<h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

					{#if form?.success}
						<Alert color="green" class="mb-6">
							{form.success}
						</Alert>
					{:else if form?.error}
						<Alert color="red" class="mb-6">
							{form.error}
						</Alert>
					{/if}

					<form method="POST" use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							update();
						};
					}} class="space-y-6">
						<div>
							<Label for="name">Full Name</Label>
							<Input type="text" id="name" name="name" required bind:value={name} />
						</div>

						<div>
							<Label for="email">Email Address</Label>
							<Input type="email" id="email" name="email" required bind:value={email} />
						</div>

						<div class="border-t pt-6">
							<Button
								type="button"
								color="light"
								class="mb-4"
								on:click={() => (showPasswordFields = !showPasswordFields)}
							>
								{showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
							</Button>

							{#if showPasswordFields}
								<div class="space-y-4">
									<div>
										<Label for="currentPassword">Current Password</Label>
										<Input
											type="password"
											id="currentPassword"
											name="currentPassword"
											bind:value={currentPassword}
										/>
									</div>

									<div>
										<Label for="newPassword">New Password</Label>
										<Input
											type="password"
											id="newPassword"
											name="newPassword"
											bind:value={newPassword}
										/>
									</div>

									<div>
										<Label for="confirmPassword">Confirm New Password</Label>
										<Input
											type="password"
											id="confirmPassword"
											name="confirmPassword"
											bind:value={confirmPassword}
										/>
									</div>
								</div>
							{/if}
						</div>

						<div class="flex justify-end space-x-4">
							<Button href="/dashboard" color="light">Cancel</Button>
							<Button type="submit" disabled={loading}>
								{#if loading}
									<Spinner class="mr-2" size="4" color="white" />
									Saving...
								{:else}
									Save Changes
								{/if}
							</Button>
						</div>
					</form>
				</div>
			{:else if activeTab === 'subscriptions'}
				<!-- Subscriptions Tab -->
				<div class="p-8">
					<h1 class="text-2xl font-bold text-gray-900 mb-6">Subscription History</h1>
					
					{#if data.subscriptions && data.subscriptions.length > 0}
						<div class="overflow-x-auto">
							<Table striped={true}>
								<TableHead>
									<TableHeadCell>Locker</TableHeadCell>
									<TableHeadCell>Size</TableHeadCell>
									<TableHeadCell>Status</TableHeadCell>
									<TableHeadCell>Start Date</TableHeadCell>
									<TableHeadCell>Expiration Date</TableHeadCell>
								</TableHead>
								<TableBody>
									{#each data.subscriptions as subscription}
										<TableBodyRow>
											<TableBodyCell>
												{subscription.lockerNumber || 'N/A'}
											</TableBodyCell>
											<TableBodyCell class="capitalize">
												{subscription.lockerSize || 'N/A'}
											</TableBodyCell>
											<TableBodyCell>
												<Badge color={getStatusColor(subscription.status)}>
													{subscription.status}
												</Badge>
											</TableBodyCell>
											<TableBodyCell>
												{formatDate(subscription.createdAt)}
											</TableBodyCell>
											<TableBodyCell>
												{formatDate(subscription.expiresAt)}
											</TableBodyCell>
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>
						</div>
					{:else}
						<div class="text-center py-8 text-gray-500">
							<p>You don't have any subscription history yet.</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div> 