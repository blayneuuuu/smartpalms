<!-- routes/lockers/+page.svelte -->
<script lang="ts">
    import type { Locker } from '$lib/server/db/schema';
    import {
        Button,
        buttonVariants
    } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

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

    // Group lockers by size
    function getLockersBySize() {
        return {
            small: data.lockers.filter((l: LockerWithAvailability) => l.size.toLowerCase() === 'small'),
            medium: data.lockers.filter((l: LockerWithAvailability) => l.size.toLowerCase() === 'medium'),
            large: data.lockers.filter((l: LockerWithAvailability) => l.size.toLowerCase() === 'large')
        };
    }

    // Dialog handlers
    function openRentDialog(locker: LockerWithAvailability) {
        if (locker.hasPendingRequest) return; // Don't allow renting if there's a pending request
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

    // File upload handler
    async function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (!file) {
            error = "Please select a file";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            error = "File size must be less than 5MB";
            return;
        }

        if (!file.type.startsWith('image/')) {
            error = "Please upload an image file";
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
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });

            proofOfPaymentBase64 = base64String;
            error = null;
        } catch (err) {
            console.error('Error reading file:', err);
            error = "Failed to process image";
        }
    }

    // Submit rental request
    async function handleRentSubmit() {
        if (!selectedLocker || !selectedSubscriptionType || !proofOfPaymentBase64) {
            error = "Please fill in all required fields";
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
                body: JSON.stringify({
                    lockerId: selectedLocker.id,
                    subscriptionTypeId: selectedSubscriptionType,
                    proofOfPayment: proofOfPaymentBase64
                })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
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
    <div class="grid grid-cols-3 items-center mb-8">
        <div></div>
        <h1 class="text-2xl font-bold text-center">Available Lockers</h1>
        <a href="/dashboard" class="justify-self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold">
            Back to Dashboard
        </a>
    </div>

    <!-- Error message -->
    {#if data.error}
        <div class="bg-red-100 text-red-700 p-4 rounded mb-8">
            {data.error}
        </div>
    {/if}

    <!-- Lockers grid -->
    {#if data.lockers}
        {@const lockersBySize = getLockersBySize()}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Small lockers -->
            <div>
                <h2 class="text-xl font-semibold mb-4">Small Lockers ({lockersBySize.small.length})</h2>
                <div class="space-y-4">
                    {#each lockersBySize.small as locker}
                        <div class="border rounded-lg p-4 {locker.hasPendingRequest ? 'bg-yellow-50' : locker.isAvailable ? 'bg-gray-100' : 'bg-red-50'}">
                            <div class="text-lg font-medium">Locker #{locker.number}</div>
                            <div class="text-sm text-gray-600">Size: {locker.size}</div>
                            <div class="mt-2 flex items-center justify-between">
                                <span class="{locker.hasPendingRequest ? 'text-yellow-600' : locker.isAvailable ? 'text-green-600' : 'text-red-600'}">
                                    {#if locker.hasPendingRequest}
                                        Pending Request
                                    {:else if locker.isAvailable}
                                        Available
                                    {:else}
                                        Occupied
                                    {/if}
                                </span>
                                {#if locker.isAvailable && !locker.hasPendingRequest}
                                    <Button variant="outline" on:click={() => openRentDialog(locker)}>
                                        Rent
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Medium lockers -->
            <div>
                <h2 class="text-xl font-semibold mb-4">Medium Lockers ({lockersBySize.medium.length})</h2>
                <div class="space-y-4">
                    {#each lockersBySize.medium as locker}
                        <div class="border rounded-lg p-4 {locker.hasPendingRequest ? 'bg-yellow-50' : locker.isAvailable ? 'bg-gray-100' : 'bg-red-50'}">
                            <div class="text-lg font-medium">Locker #{locker.number}</div>
                            <div class="text-sm text-gray-600">Size: {locker.size}</div>
                            <div class="mt-2 flex items-center justify-between">
                                <span class="{locker.hasPendingRequest ? 'text-yellow-600' : locker.isAvailable ? 'text-green-600' : 'text-red-600'}">
                                    {#if locker.hasPendingRequest}
                                        Pending Request
                                    {:else if locker.isAvailable}
                                        Available
                                    {:else}
                                        Occupied
                                    {/if}
                                </span>
                                {#if locker.isAvailable && !locker.hasPendingRequest}
                                    <Button variant="outline" on:click={() => openRentDialog(locker)}>
                                        Rent
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Large lockers -->
            <div>
                <h2 class="text-xl font-semibold mb-4">Large Lockers ({lockersBySize.large.length})</h2>
                <div class="space-y-4">
                    {#each lockersBySize.large as locker}
                        <div class="border rounded-lg p-4 {locker.hasPendingRequest ? 'bg-yellow-50' : locker.isAvailable ? 'bg-gray-100' : 'bg-red-50'}">
                            <div class="text-lg font-medium">Locker #{locker.number}</div>
                            <div class="text-sm text-gray-600">Size: {locker.size}</div>
                            <div class="mt-2 flex items-center justify-between">
                                <span class="{locker.hasPendingRequest ? 'text-yellow-600' : locker.isAvailable ? 'text-green-600' : 'text-red-600'}">
                                    {#if locker.hasPendingRequest}
                                        Pending Request
                                    {:else if locker.isAvailable}
                                        Available
                                    {:else}
                                        Occupied
                                    {/if}
                                </span>
                                {#if locker.isAvailable && !locker.hasPendingRequest}
                                    <Button variant="outline" on:click={() => openRentDialog(locker)}>
                                        Rent
                                    </Button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Rent Dialog -->
<Dialog.Root open={showRentDialog} onOpenChange={(open) => !open && closeRentDialog()}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Rent Locker #{selectedLocker?.number}</Dialog.Title>
            <Dialog.Description>
                Select a subscription plan and upload your proof of payment.
            </Dialog.Description>
        </Dialog.Header>

        {#if error}
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <div class="grid gap-4 py-4">
            <!-- Subscription Plan -->
            <div class="grid gap-2">
                <Label for="plan">Subscription Plan</Label>
                <select 
                    id="plan"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    bind:value={selectedSubscriptionType}
                >
                    <option value="">Select a plan</option>
                    {#each data.subscriptionTypes as type}
                        <option value={type.id}>
                            {type.name} - ₱{type.amount} ({type.duration})
                        </option>
                    {/each}
                </select>
            </div>

            <!-- Proof of Payment -->
            <div class="grid gap-2">
                <Label for="proof">Proof of Payment</Label>
                <Input 
                    id="proof" 
                    type="file" 
                    accept="image/*"
                    on:change={handleFileChange}
                />
                <p class="text-sm text-gray-500">
                    Upload a screenshot or photo of your payment receipt (Max 5MB)
                </p>
            </div>
        </div>

        <Dialog.Footer>
            <Button 
                disabled={loading || !selectedSubscriptionType || !proofOfPaymentBase64}
                on:click={handleRentSubmit}
            >
                {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

