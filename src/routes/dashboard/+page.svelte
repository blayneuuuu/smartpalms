<script lang="ts">
	import AdminDashboard from './AdminDashboard.svelte';
	import UserDashboard from './UserDashboard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { userData } = data;
</script>

{#if userData.type === 'admin'}
	<AdminDashboard {userData} />
{:else}
	<UserDashboard {userData} />
{/if}