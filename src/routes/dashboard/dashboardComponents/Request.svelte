<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
        DialogFooter,
    } from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    let requests = $state<Array<{
        id: string;
        userId: string;
        lockerId: string;
        lockerNumber: string;
        requestedAt: string;
        status: string;
        proofOfPayment: string | null;
    }>>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let rejectionReason = $state("");
    let selectedRequestId = $state<string | null>(null);
    let showRejectDialog = $state(false);

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

    async function handleAction(requestId: string, action: string) {
        if (action === 'reject') {
            selectedRequestId = requestId;
            showRejectDialog = true;
            return;
        }

        try {
            const response = await fetch(`/api/admin/requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: action === 'approve' ? 'approved' : 'rejected',
                    ...(action == 'reject' && { rejectionReason })
                })
            });
            
            if (!response.ok) throw new Error(`Failed to ${action} request`);
            
            // Reset state if successful
            if (action == 'reject') {
                showRejectDialog = false;
                rejectionReason = "";
                selectedRequestId = null;
            }

            // Refresh requests after action
            fetchRequests();
        } catch (err) {
            console.error(`Error ${action}ing request:`, err);
            error = err instanceof Error ? err.message : `Failed to ${action} request`;
        }
    }

    function handleReject() {
        if (selectedRequestId) {
            handleAction(selectedRequestId, 'reject');
        }
    }

    // Fetch requests when component mounts
    fetchRequests();
</script>

<div class="space-y-4">
    {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <p>{error}</p>
            <button 
                class="bg-red-100 text-red-800 px-3 py-1 rounded mt-2 hover:bg-red-200"
                on:click={fetchRequests}
            >
                Retry
            </button>
        </div>
    {/if}

    <Dialog bind:open={showRejectDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogDescription>
                    Please provide a reason for rejecting this request.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label for="reason">Rejection Reason</Label>
                    <Input
                        id="reason"
                        bind:value={rejectionReason}
                        placeholder="Enter reason for rejection..."
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" on:click={() => showRejectDialog = false}>
                    Cancel
                </Button>
                <Button 
                    variant="destructive" 
                    on:click={handleReject}
                    disabled={!rejectionReason.trim()}
                >
                    Reject Request
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Card>
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Pending Requests</h3>
                <Button variant="outline" on:click={fetchRequests}>Refresh</Button>
            </div>

            {#if loading}
                <div class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            {:else if requests.length === 0}
                <p class="text-center py-8 text-gray-500">No pending requests</p>
            {:else}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Locker Number</TableHead>
                            <TableHead>Requested At</TableHead>
                            <TableHead>Proof of Payment</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {#each requests as request}
                            <TableRow>
                                <TableCell class="font-mono text-sm">{request.id}</TableCell>
                                <TableCell>{request.lockerNumber}</TableCell>
                                <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    {#if request.proofOfPayment}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">View Proof</Button>
                                            </DialogTrigger>
                                            <DialogContent class="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Proof of Payment</DialogTitle>
                                                    <DialogDescription>
                                                        Request ID: {request.id}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div class="mt-4">
                                                    <img 
                                                        src={request.proofOfPayment} 
                                                        alt="Proof of Payment"
                                                        class="max-w-full rounded-lg shadow-lg"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    {:else}
                                        <Badge variant="outline" class="bg-yellow-100 text-yellow-800">
                                            No proof uploaded
                                        </Badge>
                                    {/if}
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="bg-green-100 text-green-800 hover:bg-green-200"
                                            on:click={() => handleAction(request.id, 'approve')}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="bg-red-100 text-red-800 hover:bg-red-200"
                                            on:click={() => handleAction(request.id, 'reject')}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            {/if}
        </div>
    </Card>
</div>