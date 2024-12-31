"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {lockers} from "@/lib/mockData";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function Lockers() {
  const router = useRouter();
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);

  const rentLocker = () => {
    if (selectedLocker) {
      router.push(`/request?lockerId=${selectedLocker}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Lockers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lockers.map((locker) => (
          <Card
            key={locker.id}
            className={`cursor-pointer ${
              selectedLocker === locker.id ? "border-blue-500" : ""
            }`}
            onClick={() => setSelectedLocker(locker.id)}
          >
            <CardHeader>
              <CardTitle>
                {locker.size.charAt(0).toUpperCase() + locker.size.slice(1)}{" "}
                Locker - {locker.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {locker.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-4" onClick={rentLocker} disabled={!selectedLocker}>
        Rent Locker
      </Button>
    </div>
  );
}
