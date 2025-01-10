<script lang="ts">
	import {UserProfile} from 'svelte-clerk'
	import {UserButton} from 'svelte-clerk'
    import { useClerkContext } from 'svelte-clerk';


// Do not destructure context or you'll lose reactivity!
    const ctx = useClerkContext();
    const data = $derived(ctx);
    
    const id = $derived(data?.user?.id);
    const email = $derived(data?.user?.emailAddresses[0].emailAddress);
    const fullName = $derived(data?.user?.fullName || "User");
</script>

<div>
    <span>{fullName}</span>
    <span>{email}</span>
    <span>{id}</span>
    <UserButton afterSignOutUrl="/"/>
</div>