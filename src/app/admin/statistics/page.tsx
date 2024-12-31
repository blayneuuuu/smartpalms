"use client";

import {transactions} from "@/lib/mockData";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function AdminStatistics() {
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (t.status === "approved" ? t.amount : 0),
    0
  );
  const approvedTransactions = transactions.filter(
    (t) => t.status === "approved"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{approvedTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pendingTransactions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
