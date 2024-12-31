"use client";

import {transactions, users, lockers} from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

export default function AdminRequests() {
  const handleApprove = (id: string) => {
    console.log("Approved transaction", id);
    // Here you would typically update the transaction status in your backend
  };

  const handleReject = (id: string) => {
    console.log("Rejected transaction", id);
    // Here you would typically update the transaction status in your backend
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Locker</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const user = users.find((u) => u.id === transaction.userId);
            const locker = lockers.find((l) => l.id === transaction.lockerId);
            return (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{user?.name}</TableCell>
                <TableCell>
                  {locker?.id} ({locker?.size})
                </TableCell>
                <TableCell>{transaction.duration}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  {transaction.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(transaction.id)}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(transaction.id)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
