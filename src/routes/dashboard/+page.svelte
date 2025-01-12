<script lang="ts">
    import AdminDashboard from './AdminDashboard.svelte';
    import UserDashboard from './UserDashboard.svelte';
    import { useClerkContext } from 'svelte-clerk';
    import { error } from '@sveltejs/kit';

    type UserData = {
        email: string;
        fullName: string;
        imageUrl: string;
        id: string | null;
    }

    let authError = $state<Error | null>(null);
    let isAdmin = $state(false);
    let userData = $state<UserData>({
        email: "",
        fullName: "",
        imageUrl: "",
        id: null
    });

    const ctx = useClerkContext();
    const user = $derived(ctx?.user);
    let currentUserId = $state<string | null>(null);

    $effect(() => {
        if (user?.id && user.id !== currentUserId) {
            currentUserId = user.id;
            userData = {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress ?? "",
                fullName: user.fullName ?? "",
                imageUrl: user.imageUrl ?? ""
            };
            checkAdminStatus(user.id);
        }
    });

    async function checkAdminStatus(userId: string) {
        try {
            const response = await fetch(`/api/admin/${userId}`);
            if (!response.ok) {
                throw error(response.status, 'Failed to verify admin status');
            }
            const data = await response.json();
            isAdmin = data.authenticated ?? false;
        } catch (err) {
            console.error('Admin verification failed:', err);
            authError = err instanceof Error ? err : new Error('Failed to verify admin status');
            isAdmin = false;
        }
    }
</script>

{#if !user}
    <div class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
{:else if authError}
    <div class="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Error: {authError.message}</p>
        <button 
            class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            on:click={() => checkAdminStatus(user.id)}
        >
            Retry
        </button>
    </div>
{:else}
    {#if isAdmin}
        <AdminDashboard {userData} />
    {:else}
        <UserDashboard {userData} />
    {/if}
{/if}