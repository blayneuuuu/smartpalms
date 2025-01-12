<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Table from "$lib/components/ui/table";
    
    type Request = {
        id: string;
        userId: string;
        fullName: string;
        email: string;
        imageUrl: string;
        lockerId: string;
        lockerNumber: string;
        requestedAt: string;
        status: 'pending' | 'approved' | 'rejected';
    }

    let requests = $state<Request[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function fetchRequests() {
        try {
            loading = true;
            error = null;
            const response = await fetch('/api/admin/requests');
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            requests = data;
        } catch (err) {
            console.error('Error fetching requests:', err);
            error = err instanceof Error ? err.message : 'Failed to fetch requests';
        } finally {
            loading = false;
        }
    }

    async function handleRequest(requestId: string, action: 'approve' | 'reject') {
        try {
            const response = await fetch(`/api/admin/requests/${requestId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            
            if (!response.ok) throw new Error('Failed to process request');
            
            // Update the local state
            requests = requests.map(req => 
                req.id === requestId 
                    ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
                    : req
            );
        } catch (err) {
            console.error('Error processing request:', err);
            error = err instanceof Error ? err.message : 'Failed to process request';
        }
    }

    // Initial fetch
    $effect(() => {
        fetchRequests();
    });
</script>

{#if loading}
    <div class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
{:else if error}
    <div class="bg-red-50 p-4 rounded-md">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error loading requests</h3>
                <p class="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <div class="ml-auto pl-3">
                <button 
                    class="inline-flex text-red-400 hover:text-red-500"
                    on:click={fetchRequests}
                >
                    Retry
                </button>
            </div>
        </div>
    </div>
{:else if requests.length === 0}
    <div class="text-center py-8">
        <p class="text-gray-500">No pending requests found</p>
    </div>
{:else}
    <div class="overflow-x-auto">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>User</Table.Head>
                    <Table.Head>Locker</Table.Head>
                    <Table.Head>Requested At</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Actions</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each requests as request}
                    <Table.Row>
                        <Table.Cell>
                            <div class="flex items-center space-x-3">
                                <img 
                                    src={request.imageUrl} 
                                    alt={request.fullName}
                                    class="h-8 w-8 rounded-full"
                                />
                                <div>
                                    <p class="font-medium">{request.fullName}</p>
                                    <p class="text-sm text-gray-500">{request.email}</p>
                                </div>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <span class="font-medium">#{request.lockerNumber}</span>
                        </Table.Cell>
                        <Table.Cell>
                            <time datetime={request.requestedAt}>
                                {new Date(request.requestedAt).toLocaleDateString()}
                            </time>
                        </Table.Cell>
                        <Table.Cell>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                {request.status}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            {#if request.status === 'pending'}
                                <div class="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        on:click={() => handleRequest(request.id, 'approve')}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-red-600 hover:text-red-700"
                                        on:click={() => handleRequest(request.id, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            {:else}
                                <span class="text-gray-500">Processed</span>
                            {/if}
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
{/if}