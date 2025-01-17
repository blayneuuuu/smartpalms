<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Search } from "lucide-svelte";

    type Request = {
        id: string;
        userId: string;
        userName: string;
        lockerId: string;
        lockerNumber: string;
        subscriptionTypeId: string;
        subscriptionName: string;
        amount: number;
        proofOfPayment: string;
        status: string;
        requestedAt: Date;
        rejectionReason?: string;
    };

    let requests = $state<Request[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);
    let searchQuery = $state("");
    let selectedRequest = $state<Request | null>(null);
    let showDetailsDialog = $state(false);
    let showRejectDialog = $state(false);
    let rejectionReason = $state("");

    // Fetch requests on component mount
    async function fetchRequests() {
        loading = true;
        error = null;
        try {
            const response = await fetch('/api/admin/requests');
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            requests = data.requests;
        } catch (err) {
            console.error('Error fetching requests:', err);
            error = err instanceof Error ? err.message : 'Failed to fetch requests';
        } finally {
            loading = false;
        }
    }

    // Handle request actions
    async function handleAction(requestId: string, action: 'approve' | 'reject') {
        try {
            const response = await fetch(`/api/admin/requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: action,
                    ...(action === 'reject' && { rejectionReason })
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || `Failed to ${action} request`);
            }

            // Close dialogs and refresh requests
            showDetailsDialog = false;
            showRejectDialog = false;
            rejectionReason = "";
            await fetchRequests();
        } catch (err) {
            console.error(`Error ${action}ing request:`, err);
            error = err instanceof Error ? err.message : `Failed to ${action} request`;
        }
    }

    function openDetailsDialog(request: Request) {
        selectedRequest = request;
        showDetailsDialog = true;
    }

    function openRejectDialog() {
        showDetailsDialog = false;
        showRejectDialog = true;
    }

    function formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    }

    // Filter requests based on search query
    $effect(() => {
        fetchRequests();
    });

    $effect.root(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            requests = requests.filter(request => 
                request.userName.toLowerCase().includes(query) ||
                request.lockerNumber.toLowerCase().includes(query)
            );
        }
    });
</script>

<Card>
    <div class="p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-semibold">Locker Requests</h3>
                <p class="text-sm text-muted-foreground">Manage locker rental requests</p>
            </div>
            <div class="relative">
                <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search requests..."
                    class="pl-8 w-[250px]"
                    bind:value={searchQuery}
                />
            </div>
        </div>

        {#if error}
            <div class="bg-red-100 text-red-700 p-4 rounded mb-4">
                {error}
                <Button variant="outline" class="ml-2" on:click={fetchRequests}>Retry</Button>
            </div>
        {/if}

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Locker</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#if loading}
                        <TableRow>
                            <TableCell colspan={7} class="text-center py-4">
                                <div class="flex justify-center">
                                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                </div>
                            </TableCell>
                        </TableRow>
                    {:else if requests.length === 0}
                        <TableRow>
                            <TableCell colspan={7} class="text-center py-4 text-muted-foreground">
                                No requests found
                            </TableCell>
                        </TableRow>
                    {:else}
                        {#each requests as request}
                            <TableRow>
                                <TableCell>{request.userName}</TableCell>
                                <TableCell>#{request.lockerNumber}</TableCell>
                                <TableCell>{request.subscriptionName}</TableCell>
                                <TableCell>{formatAmount(request.amount)}</TableCell>
                                <TableCell>{formatDate(request.requestedAt)}</TableCell>
                                <TableCell>
                                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                        {request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                         request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                         'bg-red-100 text-red-800'}">
                                        {request.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        on:click={() => openDetailsDialog(request)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        {/each}
                    {/if}
                </TableBody>
            </Table>
        </div>
    </div>
</Card>

<!-- Request Details Dialog -->
<Dialog.Root bind:open={showDetailsDialog}>
    <Dialog.Content class="sm:max-w-[600px]">
        <Dialog.Header>
            <Dialog.Title>Request Details</Dialog.Title>
            <Dialog.Description>
                Review the request details and proof of payment
            </Dialog.Description>
        </Dialog.Header>

        {#if selectedRequest}
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label>User</Label>
                        <p class="text-sm font-medium">{selectedRequest.userName}</p>
                    </div>
                    <div>
                        <Label>Locker Number</Label>
                        <p class="text-sm font-medium">#{selectedRequest.lockerNumber}</p>
                    </div>
                    <div>
                        <Label>Subscription</Label>
                        <p class="text-sm font-medium">{selectedRequest.subscriptionName}</p>
                    </div>
                    <div>
                        <Label>Amount</Label>
                        <p class="text-sm font-medium">{formatAmount(selectedRequest.amount)}</p>
                    </div>
                    <div>
                        <Label>Requested At</Label>
                        <p class="text-sm font-medium">{formatDate(selectedRequest.requestedAt)}</p>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <p class="text-sm font-medium capitalize">{selectedRequest.status}</p>
                    </div>
                </div>

                <div>
                    <Label>Proof of Payment</Label>
                    <div class="mt-2 border rounded-lg p-2">
                        <img 
                            src={`data:image/jpeg;base64,${selectedRequest.proofOfPayment}`}
                            alt="Proof of Payment"
                            class="max-h-48 mx-auto rounded"
                        />
                    </div>
                </div>
            </div>

            <Dialog.Footer>
                <Button variant="outline" on:click={() => showDetailsDialog = false}>
                    Close
                </Button>
                {#if selectedRequest && selectedRequest.status === 'pending'}
                    <div class="flex gap-2">
                        <Button variant="outline" class="text-red-600" on:click={openRejectDialog}>
                            Reject
                        </Button>
                        <Button variant="default" on:click={() => handleAction(selectedRequest?.id || '', 'approve')}>
                            Approve
                        </Button>
                    </div>
                {/if}
            </Dialog.Footer>
        {/if}
    </Dialog.Content>
</Dialog.Root>

<!-- Reject Dialog -->
<Dialog.Root bind:open={showRejectDialog}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Reject Request</Dialog.Title>
            <Dialog.Description>
                Please provide a reason for rejecting this request
            </Dialog.Description>
        </Dialog.Header>

        <div class="grid gap-4 py-4">
            <div class="grid gap-2">
                <Label for="reason">Rejection Reason</Label>
                <Input
                    id="reason"
                    bind:value={rejectionReason}
                    placeholder="Enter rejection reason..."
                />
            </div>
        </div>

        <Dialog.Footer>
            <Button variant="outline" on:click={() => showRejectDialog = false}>
                Cancel
            </Button>
            <Button 
                variant="destructive"
                disabled={!rejectionReason}
                on:click={() => selectedRequest && handleAction(selectedRequest.id, 'reject')}
            >
                Reject Request
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>