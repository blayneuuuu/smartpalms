"use client";

import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {users, lockers, transactions} from "@/lib/mockData";

export default function AdminDashboard() {
  const totalUsers = users.length;
  const totalLockers = lockers.length;
  const occupiedLockers = lockers.filter((l) => l.status === "occupied").length;
  const pendingRequests = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Lockers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalLockers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Occupied Lockers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{occupiedLockers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pendingRequests}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
