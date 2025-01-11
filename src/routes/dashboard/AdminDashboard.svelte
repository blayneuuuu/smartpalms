<script lang="ts" >
    import {UserButton} from 'svelte-clerk'
    import Request from './dashboardComponents/Request.svelte';
    export let data = {};
    let index = 0
</script>

<div>
    <div class="flex flex-row justify-between py-2 px-20 items-center">
        <h1 class="text-2xl font-extrabold">Admin Dashboard</h1>
        <div class="flex flex-row items-center space-x-4">
            <h1 class="text-lg font-semibold">{data.fullName}</h1>
            <UserButton afterSignOutUrl="/"/>
        </div>
    </div>

    <!-- Nav menu  -->
    <div class="flex flex-row space-x-6 ml-10 mt-10">
    </div>
    <Request />
    
    
</div>