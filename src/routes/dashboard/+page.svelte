<script lang="ts">
	import {UserProfile} from 'svelte-clerk'
	import {UserButton} from 'svelte-clerk'
    import { useClerkContext } from 'svelte-clerk';

    let id = $state("");
    let email = $state("");
    let fullName = $state("");

// Do not destructure context or you'll lose reactivity!
    const ctx = useClerkContext();
    const data = $derived(ctx);
    
    if (data.user){
    id = data.user.id;
    email = data?.user.emailAddresses[0].emailAddress;
    fullName = data?.user.fullName || "User";
    }
</script>

<div>
    <span>{fullName}</span>
    <span>{email}</span>
    <span>{id}</span>
    <UserButton afterSignOutUrl="/"/>
</div>