<script lang="ts">
	import {UserProfile} from 'svelte-clerk'
	import {UserButton} from 'svelte-clerk'
    export let data;

    console.log(data.user);
    
    
</script>

<div>
    <UserButton afterSignOutUrl="/"/>
	<UserProfile/>
</div>