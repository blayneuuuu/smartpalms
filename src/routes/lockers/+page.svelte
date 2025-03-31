<!-- routes/lockers/+page.svelte -->
<script lang="ts">
    import type { Locker } from '$lib/server/db/schema';
    import { Button, Card, Label, Input, Alert, Modal, Select, Badge } from 'flowbite-svelte';

    type LockerWithAvailability = Locker & {
        isAvailable: boolean;
        hasPendingRequest?: boolean;
    };

    type PageData = {
        lockers: LockerWithAvailability[];
        subscriptionTypes: Array<{
            id: string;
            name: string;
            duration: string;
            amount: number;
        }>;
        error?: string;
    };

    const { data } = $props<{ data: PageData }>();

    // State management
    let selectedLocker: LockerWithAvailability | null = $state(null);
    let selectedSubscriptionType: string = $state('');
    let proofOfPaymentBase64: string | null = $state(null);
    let loading: boolean = $state(false);
    let error: string | null = $state(null);
    let showRentDialog: boolean = $state(false);

    // Group lockers by size - only small and large
    function getLockersBySize() {
        return {
            small: data.lockers.filter((l: LockerWithAvailability) => l.size.toLowerCase() === 'small'),
            large: data.lockers.filter((l: LockerWithAvailability) => l.size.toLowerCase() === 'large')
        };
    }

    // Dialog handlers
    function openRentDialog(locker: LockerWithAvailability) {
        if (locker.hasPendingRequest) return;
        selectedLocker = locker;
        selectedSubscriptionType = '';
        proofOfPaymentBase64 = null;
        error = null;
        showRentDialog = true;
    }

    function closeRentDialog() {
        showRentDialog = false;
        selectedLocker = null;
        selectedSubscriptionType = '';
        proofOfPaymentBase64 = null;
        error = null;
    }

    // File handling
    async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            error = 'File size must be less than 5MB';
            return;
        }

        try {
            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            proofOfPaymentBase64 = base64String;
            error = null;
        } catch (err) {
            console.error('Error reading file:', err);
            error = 'Failed to read file';
        }
    }

    // Form submission
    async function handleSubmit() {
        if (!selectedLocker || !selectedSubscriptionType || !proofOfPaymentBase64) {
            error = 'Please fill in all required fields';
            return;
        }

        loading = true;
        error = null;

        try {
            const response = await fetch('/api/lockers/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    lockerId: selectedLocker.id,
                    subscriptionTypeId: selectedSubscriptionType,
                    proofOfPayment: proofOfPaymentBase64,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    window.location.href = '/';
                    return;
                }
                throw new Error(data.message || 'Failed to submit request');
            }

            closeRentDialog();
            window.location.reload();
        } catch (err) {
            console.error('Error:', err);
            error = err instanceof Error ? err.message : 'Failed to submit request';
        } finally {
            loading = false;
        }
    }
</script>

<div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-center mb-4 sm:mb-0">Available Lockers</h1>
        <Button href="/dashboard" color="blue">Back to Dashboard</Button>
    </div>

    <!-- Error message -->
    {#if data.error}
        <Alert color="red" class="mb-8">{data.error}</Alert>
    {/if}

    <!-- Lockers grid -->
    {#if data.lockers}
        {@const lockersBySize = getLockersBySize()}
        <div class="flex flex-col lg:flex-row justify-center gap-20">
            <!-- Small lockers -->
            <div class="flex flex-col h-full w-50">
                <h2 class="text-xl font-semibold mb-4">Small Lockers (12" H x 16" W x 16" D)</h2>
                {#if lockersBySize.small.length > 0}
                    <div class="space-y-4 flex-grow">
                        {#each lockersBySize.small as locker}
                            <Card padding="sm" class="transition-all hover:shadow-md">
                                <div class="text-lg font-medium">Locker #{locker.number}</div>
                                <div class="mt-2 flex items-center justify-between">
                                    <Badge color={locker.hasPendingRequest ? 'yellow' : locker.isAvailable ? 'green' : 'red'}>
                                        {#if locker.hasPendingRequest}
                                            Pending Request
                                        {:else if locker.isAvailable}
                                            Available
                                        {:else}
                                            Occupied
                                        {/if}
                                    </Badge>
                                    {#if locker.isAvailable && !locker.hasPendingRequest}
                                        <Button color="light" on:click={() => openRentDialog(locker)}>Rent</Button>
                                    {/if}
                                </div>
                            </Card>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500 italic">No small lockers available</p>
                {/if}
            </div>

            <!-- Large lockers -->
            <div class="flex flex-col h-full w-50">
                <h2 class="text-xl font-semibold mb-4">Large Lockers (24" H x 16" W x 16" D):</h2>
                {#if lockersBySize.large.length > 0}
                    <div class="space-y-4 flex-grow">
                        {#each lockersBySize.large as locker}
                            <Card padding="sm" class="transition-all hover:shadow-md">
                                <div class="text-lg font-medium">Locker #{locker.number}</div>
                                <div class="mt-2 flex items-center justify-between">
                                    <Badge color={locker.hasPendingRequest ? 'yellow' : locker.isAvailable ? 'green' : 'red'}>
                                        {#if locker.hasPendingRequest}
                                            Pending Request
                                        {:else if locker.isAvailable}
                                            Available
                                        {:else}
                                            Occupied
                                        {/if}
                                    </Badge>
                                    {#if locker.isAvailable && !locker.hasPendingRequest}
                                        <Button color="light" on:click={() => openRentDialog(locker)}>Rent</Button>
                                    {/if}
                                </div>
                            </Card>
                        {/each}
                    </div>
                {:else}
                    <p class="text-gray-500 italic">No large lockers available</p>
                {/if}
            </div>
        </div>
    {/if}
</div>

<!-- Rent Dialog -->
<Modal bind:open={showRentDialog} size="md" autoclose>
    <div class="text-center">
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Rent Locker #{selectedLocker?.number}</h3>
        <p class="mb-5 text-sm text-gray-500">Select a subscription plan and upload your proof of payment.</p>
    </div>

    {#if error}
        <Alert color="red" class="mb-4">{error}</Alert>
    {/if}

    <div class="grid gap-4 py-4">
        <!-- Subscription Plan -->
        <div class="flex flex-col items-center mb-4">
            <p class="text-sm text-gray-700 mb-2">Gcash QR Code:</p>
            <img src="/qr.jpg" alt="QR Code for payment" class="w-48 h-auto mx-auto border rounded-lg shadow-sm" />
            <p class="text-xs text-gray-500 mt-2">After payment, upload your receipt below</p>
        </div>
        <div class="grid gap-2">
            <Label for="plan">Subscription Plan</Label>
            <Select id="plan" bind:value={selectedSubscriptionType}>
                <option value="">Select a plan</option>
                {#each data.subscriptionTypes.filter(type => !selectedLocker || type.size === selectedLocker.size) as type}
                    <option value={type.id}>{type.name} - ₱{type.amount} ({type.duration})</option>
                {/each}
            </Select>
            {#if selectedLocker}
                <p class="text-xs text-gray-500 mt-1">Showing plans for {selectedLocker.size} lockers only</p>
            {/if}
        </div>

        <!-- Proof of Payment -->
        <div class="grid gap-2">
            <Label for="proof">Proof of Payment</Label>
            <Input id="proof" type="file" accept="image/*" on:change={handleFileChange} />
            <p class="text-sm text-gray-500">Upload a screenshot or photo of your payment receipt (Max 5MB)</p>
        </div>
    </div>

    <div class="flex justify-end gap-4">
        <Button color="alternative" on:click={closeRentDialog}>Cancel</Button>
        <Button color="blue" disabled={!selectedSubscriptionType || !proofOfPaymentBase64 || loading} on:click={handleSubmit}>
            {#if loading}<span class="mr-2">Processing...</span>{:else}Submit Request{/if}
        </Button>
    </div>
</Modal>

