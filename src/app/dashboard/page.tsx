"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getCurrentUser} from "@/lib/auth";
import {lockers} from "@/lib/mockData";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();
  const [otp, setOtp] = useState<string | null>(null);
  const user = getCurrentUser();
  const userLocker = lockers.find((locker) => locker.rentedBy === user?.id);

  useEffect(() => {
    if (!userLocker) {
      router.push("/lockers");
    }
  }, [userLocker, router]);

  const generateOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
  };

  if (!userLocker) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Locker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Locker ID: {userLocker.id}</p>
          <p>Size: {userLocker.size}</p>
          <p>Rent Duration: {userLocker.rentDuration}</p>
          <p>Rent End Date: {userLocker.rentEndDate}</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Open Locker</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={generateOTP}>Generate OTP</Button>
          {otp && <p className="mt-2">Your OTP: {otp}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
