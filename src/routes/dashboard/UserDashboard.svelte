<script lang="ts" >
	import {UserButton} from 'svelte-clerk'
    export let data = {};
</script>

<div>
    <div class="flex flex-row justify-between py-2 px-20 items-center">
        <h1 class="text-2xl font-extrabold">Dashboard</h1>
        <div class="flex flex-row items-center space-x-4">
            <h1 class="text-lg font-semibold">{data.fullName}</h1>
            <UserButton afterSignOutUrl="/"/>
        </div>
    </div>

    <!-- Nav menu  -->

    <div class="flex flex-col justify-center space-y-2 items-center bg-gray-100 py-2 mx-10 mt-10 rounded-sm">
        <div class="border rounded-lg w-3/4 h-96 flex flex-col space-y-2 px-2">
            <h1 class="text-xl text-gray-500">Rented Lockers: <span class="text-black">0</span></h1>
            <a href="/lockers" class="bg-blue-500 hover:bg-blue-700 text-white text-xl w-48 py-2 px-4 rounded text-center self-center">Rent a Locker</a>
        </div>
        
    </div>

    
</div>