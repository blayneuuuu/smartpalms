"use client";

import {lockers, users} from "@/lib/mockData";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function AdminMonitor() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Locker Monitor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lockers.map((locker) => {
          const user = users.find((u) => u.id === locker.rentedBy);
          return (
            <Card
              key={locker.id}
              className={`${
                locker.status === "occupied"
                  ? "bg-green-100"
                  : locker.status === "pending"
                  ? "bg-yellow-100"
                  : "bg-gray-100"
              }`}
            >
              <CardHeader>
                <CardTitle>
                  {locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}{" "}
                  Locker - {locker.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {locker.status}</p>
                {locker.rentedBy && (
                  <>
                    <p>Rented by: {user?.name}</p>
                    <p>Duration: {locker.rentDuration}</p>
                    <p>End Date: {locker.rentEndDate}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
