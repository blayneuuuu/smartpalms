<script lang="ts">
    import AdminDashboard from './AdminDashboard.svelte';
    import UserDashboard from './UserDashboard.svelte';
    import { useClerkContext } from 'svelte-clerk';
    let loading = $state(true);
    let admin = $state(null);
    let userData = $state({
        email: "",
        fullName: "",
        imageUrl: ""});

    const ctx = useClerkContext();
    const data = $derived(ctx);
    
    const id = $derived(data?.user?.id);
    const email = $derived(data?.user?.emailAddresses[0].emailAddress);
    const fullName = $derived(data?.user?.fullName);
    const imageUrl = $derived(data?.user?.imageUrl);

    userData = {
        email: email || "", 
        fullName: fullName || "",
        imageUrl: imageUrl || ""
    }


    const authenticate = async () => {
                
               try {
                const adminResponse = await fetch(`/api/admin/${id}`);
                const adminCheck = await adminResponse.json();
                if (adminCheck && adminResponse) {
                    admin = adminCheck.authenticated;
                }
               } catch (error) {
               if (error) {
                   console.log(error);
               }
               } finally {
                   loading = false;
               }
            }

    $effect(() => {
       if (id) {
        authenticate();
       }

    });
</script>

{#if loading}
    <p>Loading...</p>
{:else}
    {#if admin === true}
    <AdminDashboard data={userData}/>
    {:else if admin === false}
    <UserDashboard data={userData}/>
    {/if}
{/if}