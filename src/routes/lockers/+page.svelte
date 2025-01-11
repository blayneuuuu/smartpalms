<!-- routes/lockers/+page.svelte -->
<script lang="ts">
    
    import type { Locker } from '$lib/server/db/schema';
    import {
    Button,
    buttonVariants
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  
  
    
    

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

<style>
    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; /* Adjust column widths: Small, Medium, Large */
      grid-template-rows: auto auto; /* Two rows */
      grid-gap: 16px;
      grid-template-areas:
        "locker-3 locker-2 locker-1"
        "locker-3 locker-2 locker-1"; /* Large lockers span both rows */
    }
  
    .locker-group:nth-of-type(1) {
      grid-area: locker-1; /* Large lockers (right column, spans rows) */
    }
  
    .locker-group:nth-of-type(2) {
      grid-area: locker-2; /* Medium lockers (middle column) */
    }
  
    .locker-group:nth-of-type(3) {
      grid-area: locker-3; /* Small lockers (left column) */
    }
  </style>
  
  
  
  


<div class="container mx-auto p-4 ">
    <div class="grid grid-cols-3 justify-between items-center">
        <h1></h1>
        <h1 class="text-2xl font-bold grid-col-start-2 text-center">Available Lockers</h1>
    <a href="/dashboard" class="grid col-start-3 text-right bg-blue-500 hover:bg-blue-600 text-white w-42 justify-self-end py-2 px-4 rounded text-sm font-semibold">Back to Dashboard</a>
    </div>

    <div class="grid grid-layout gap-4 mt-20">
        {#if data.error}
          <div class="bg-red-100 text-red-700 p-4 rounded area-error">
            {data.error}
          </div>
        {/if}
      
        {#each Object.entries(lockersBySize) as [size, sizeLockers], index}
          <div class="locker-group" style="grid-area: locker-{index + 1};">
            <h2 class="text-xl font-semibold mb-4 capitalize">{size} Lockers</h2>
            
            <div class="grid grid-cols-1 gap-4 gap-y-4 w-full">
                {#each sizeLockers as locker}
                  <div class="border rounded-lg p-4 {locker.isAvailable ? 'bg-gray-200' : 'bg-red-50'}">
                    <div class="text-lg font-medium">Locker #{locker.number}</div>
                    <div class="text-sm text-gray-600 mt-1">Size: {locker.size}</div>
                    <div class="text-sm mt-2 flex items-center justify-between" class:text-green-600={locker.isAvailable} class:text-red-600={!locker.isAvailable}>
                      {#if locker.isAvailable}
                        Available
                        <Dialog.Root>
                          <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
                            <span class="text-green-600 font-semibold">RENT</span>
                          </Dialog.Trigger>
                          <Dialog.Content class="sm:max-w-[425px]">
                            <Dialog.Header>
                              <Dialog.Title>Edit profile</Dialog.Title>
                              <Dialog.Description>
                                Make changes to your profile here. Click save when you're done.
                              </Dialog.Description>
                            </Dialog.Header>
                            <div class="grid gap-4 py-4">
                              <div class="grid grid-cols-4 items-center gap-4">
                                <!-- Add inputs or other components here -->
                              </div>
                              <div class="grid grid-cols-4 items-center gap-4">
                                <!-- Add inputs or other components here -->
                              </div>
                            </div>
                            <Dialog.Footer>
                              <Button type="submit">Save changes</Button>
                            </Dialog.Footer>
                          </Dialog.Content>
                        </Dialog.Root>
                      {/if}
                      {#if !locker.isAvailable}
                        Occupied
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
              
          </div>
        {/each}
      </div>

      
      
      
      
      
</div>

