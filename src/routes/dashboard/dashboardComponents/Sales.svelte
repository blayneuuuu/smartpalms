<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";

  // Mock data
  const mockTransactions = [
    {
      id: "tx_1",
      amount: 299.99,
      status: "success",
      createdAt: new Date("2024-01-15"),
      userId: "user_1",
      subscriptionId: "sub_1"
    },
    {
      id: "tx_2",
      amount: 199.99,
      status: "success",
      createdAt: new Date("2024-01-14"),
      userId: "user_2",
      subscriptionId: "sub_2"
    },
    {
      id: "tx_3",
      amount: 299.99,
      status: "pending",
      createdAt: new Date("2024-01-13"),
      userId: "user_3",
      subscriptionId: "sub_3"
    },
    {
      id: "tx_4",
      amount: 199.99,
      status: "failed",
      createdAt: new Date("2024-01-12"),
      userId: "user_4",
      subscriptionId: "sub_4"
    }
  ];

  const totalSales = mockTransactions
    .filter(tx => tx.status === "success")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlySales = mockTransactions
    .filter(tx => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return tx.status === "success" && tx.createdAt >= thirtyDaysAgo;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
</script>

<div class="space-y-4">
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card class="p-6">
      <h3 class="text-lg font-semibold">Total Sales</h3>
      <p class="text-3xl font-bold">{formatCurrency(totalSales)}</p>
    </Card>
    
    <Card class="p-6">
      <h3 class="text-lg font-semibold">Monthly Sales</h3>
      <p class="text-3xl font-bold">{formatCurrency(monthlySales)}</p>
    </Card>

    <Card class="p-6">
      <h3 class="text-lg font-semibold">Success Rate</h3>
      <p class="text-3xl font-bold">
        {Math.round((mockTransactions.filter(tx => tx.status === "success").length / mockTransactions.length) * 100)}%
      </p>
    </Card>
  </div>

  <Card>
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each mockTransactions as transaction}
            <TableRow>
              <TableCell class="font-mono">{transaction.id}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusColor(transaction.status)}">
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell>{transaction.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  </Card>
</div>
