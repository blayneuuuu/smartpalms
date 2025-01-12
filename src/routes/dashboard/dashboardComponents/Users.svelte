<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Search } from "lucide-svelte";

  // Mock data
  const mockUsers = [
    {
      id: "user_1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      lastActive: new Date("2024-01-15"),
      status: "active"
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      lastActive: new Date("2024-01-14"),
      status: "active"
    },
    {
      id: "user_3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "user",
      lastActive: new Date("2024-01-13"),
      status: "inactive"
    },
    {
      id: "user_4",
      name: "Alice Brown",
      email: "alice.brown@example.com",
      role: "user",
      lastActive: new Date("2024-01-12"),
      status: "active"
    }
  ];

  let searchQuery = "";
  $: filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getStatusColor(status: string): string {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  }

  function getRoleColor(role: string): string {
    return role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  }
</script>

<Card>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold">Users</h3>
        <p class="text-sm text-muted-foreground">Manage user accounts and permissions</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            class="pl-8 w-[250px]"
            bind:value={searchQuery}
          />
        </div>
        <Button variant="outline">Export</Button>
        <Button>Add User</Button>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each filteredUsers as user}
            <TableRow>
              <TableCell class="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getRoleColor(user.role)}">
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(user.status)}">
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{user.lastActive.toLocaleDateString()}</TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" class="text-destructive">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </div>
</Card>