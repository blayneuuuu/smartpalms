<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  // Mock data
  const mockSubscriptions = [
    {
      id: "sub_1",
      userId: "user_1",
      userName: "John Doe",
      lockerId: "locker_1",
      lockerNumber: "A101",
      status: "active",
      plan: "monthly",
      amount: 29.99,
      createdAt: new Date("2024-01-01"),
      expiresAt: new Date("2024-02-01")
    },
    {
      id: "sub_2",
      userId: "user_2",
      userName: "Jane Smith",
      lockerId: "locker_2",
      lockerNumber: "A102",
      status: "active",
      plan: "yearly",
      amount: 299.99,
      createdAt: new Date("2024-01-01"),
      expiresAt: new Date("2025-01-01")
    },
    {
      id: "sub_3",
      userId: "user_3",
      userName: "Bob Johnson",
      lockerId: "locker_3",
      lockerNumber: "B101",
      status: "expired",
      plan: "monthly",
      amount: 29.99,
      createdAt: new Date("2023-12-01"),
      expiresAt: new Date("2024-01-01")
    },
    {
      id: "sub_4",
      userId: "user_4",
      userName: "Alice Brown",
      lockerId: "locker_4",
      lockerNumber: "B102",
      status: "cancelled",
      plan: "monthly",
      amount: 29.99,
      createdAt: new Date("2023-12-15"),
      expiresAt: new Date("2024-01-15")
    }
  ];

  const stats = {
    active: mockSubscriptions.filter(sub => sub.status === "active").length,
    expired: mockSubscriptions.filter(sub => sub.status === "expired").length,
    cancelled: mockSubscriptions.filter(sub => sub.status === "cancelled").length,
    totalRevenue: mockSubscriptions
      .filter(sub => sub.status === "active")
      .reduce((sum, sub) => sum + sub.amount, 0)
  };

  function getStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  }

  function getDaysRemaining(expiresAt: Date): number {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
</script>

<div class="space-y-4">
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card class="p-6">
      <h3 class="text-lg font-semibold">Active Subscriptions</h3>
      <p class="text-3xl font-bold">{stats.active}</p>
    </Card>
    
    <Card class="p-6">
      <h3 class="text-lg font-semibold">Expired</h3>
      <p class="text-3xl font-bold">{stats.expired}</p>
    </Card>
    
    <Card class="p-6">
      <h3 class="text-lg font-semibold">Cancelled</h3>
      <p class="text-3xl font-bold">{stats.cancelled}</p>
    </Card>

    <Card class="p-6">
      <h3 class="text-lg font-semibold">Monthly Revenue</h3>
      <p class="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
    </Card>
  </div>

  <Card>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Subscription List</h3>
        <Button variant="outline">Export</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Locker</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each mockSubscriptions as subscription}
            <TableRow>
              <TableCell>{subscription.userName}</TableCell>
              <TableCell>{subscription.lockerNumber}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {subscription.plan}
                </Badge>
              </TableCell>
              <TableCell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(subscription.status)}">
                  {subscription.status}
                </span>
              </TableCell>
              <TableCell>{subscription.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                {#if subscription.status === "active"}
                  <span class="text-sm">
                    {getDaysRemaining(subscription.expiresAt)} days left
                  </span>
                {:else}
                  <span class="text-sm text-muted-foreground">
                    Expired {subscription.expiresAt.toLocaleDateString()}
                  </span>
                {/if}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  {#if subscription.status === "active"}
                    <Button variant="ghost" size="sm">Extend</Button>
                    <Button variant="ghost" size="sm" class="text-destructive">Cancel</Button>
                  {:else}
                    <Button variant="ghost" size="sm">Renew</Button>
                  {/if}
                </div>
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </Card>
</div>
