<script lang="ts">
	import { Button, Input, Label, Alert } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let name = data.user.name;
	let email = data.user.email;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let showPasswordFields = false;
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-2xl mx-auto px-4">
		<div class="bg-white rounded-lg shadow p-8">
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

			<form method="POST" use:enhance class="space-y-6">
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
					<Button type="submit">Save Changes</Button>
				</div>
			</form>
		</div>
	</div>
</div> 