<script lang="ts">
	import UserProfile from 'clerk-sveltekit/client/UserProfile.svelte'
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte'
    export let data;

    console.log(data.user);
    
    
</script>

<div>
    <UserButton afterSignOutUrl="/"/>
	<UserProfile/>
</div>