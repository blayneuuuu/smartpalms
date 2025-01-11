<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Table from "$lib/components/ui/table";
    

    export const Requests = [{
        fullName: 'John Doe',
        email: '8y0oY@example.com',
        imageUrl: 'https://via.placeholder.com/150'
    }, {
        fullName: 'John Doe',
        email: '8y0oY@example.com',
        imageUrl: 'https://via.placeholder.com/150'
    }, {
        fullName: 'John Doe',
        email: '8y0oY@example.com',
        imageUrl: 'https://via.placeholder.com/150'
    }, {
        fullName: 'John Doe',
        email: '8y0oY@example.com',
        imageUrl: 'https://via.placeholder.com/150'
    }, {
        fullName: 'John Doe',
        email: '8y0oY@example.com',
        imageUrl: 'https://via.placeholder.com/150'
    }]

</script>

<div class="flex flex-col space-y-2 bg-gray-100 py-2 mx-10 rounded-sm">
    
    <div class="w-full flex flex-col space-y-4 p-2 items-left">
        <Table.Caption>List of Requests</Table.Caption>
        
        <Table.Root>
            <Table.Header>
             <Table.Row class="mb-2">
              <Table.Head class="w-[100px] text-center">Profile</Table.Head>
              <Table.Head class="text-center">Name</Table.Head>
              <Table.Head class="text-center">Email</Table.Head>
              <Table.Head></Table.Head>
             </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each Requests as request}
             <Table.Row>
              <Table.Cell class="font-medium">{request.imageUrl}</Table.Cell>
              <Table.Cell class="text-center">{request.fullName}</Table.Cell>
              <Table.Cell class="text-center">{request.email}</Table.Cell>
              <Table.Cell class="text-center"><Button>Accept</Button></Table.Cell>
             </Table.Row>
             {/each}
            </Table.Body>
           </Table.Root>
    
    </div>
    
</div>