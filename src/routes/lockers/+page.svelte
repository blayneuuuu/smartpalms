<!-- routes/lockers/+page.svelte -->
<script lang="ts">
    import type { Locker } from '$lib/server/db/schema';

    type LockerWithAvailability = Locker & {
        isAvailable: boolean;
    };

    type PageData = {
        lockers: LockerWithAvailability[];
        error?: string;
    };

    export let data: PageData;

    type LockersBySize = Record<string, LockerWithAvailability[]>;

    $: lockersBySize = data.lockers.reduce((acc: LockersBySize, locker) => {
        if (!acc[locker.size]) {
            acc[locker.size] = [];
        }
        acc[locker.size].push(locker);
        return acc;
    }, {} as LockersBySize);
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Available Lockers</h1>

    {#if data.error}
        <div class="bg-red-100 text-red-700 p-4 rounded">
            {data.error}
        </div>
    {/if}

    {#each Object.entries(lockersBySize) as [size, sizeLockers]}
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4 capitalize">{size} Lockers</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each sizeLockers as locker}
                    <div class="border rounded-lg p-4 {locker.isAvailable ? 'bg-green-50' : 'bg-red-50'}">
                        <div class="text-lg font-medium">Locker #{locker.number}</div>
                        <div class="text-sm text-gray-600 mt-1">Size: {locker.size}</div>
                        <div class="text-sm mt-2 {locker.isAvailable ? 'text-green-600' : 'text-red-600'}">
                            {locker.isAvailable ? 'Available' : 'Occupied'}
                            
                        </div>
                    </div>
                {/each}
            </div>
            
        </div>
    {/each}
    <a href="/dashboard">Back to Dashboard</a>
</div>