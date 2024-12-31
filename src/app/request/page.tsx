"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {lockers} from "@/lib/mockData";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";

const durations = [
  {value: "1day", label: "1 Day", price: 10},
  {value: "1week", label: "1 Week", price: 50},
  {value: "1month", label: "1 Month", price: 150},
  {value: "1year", label: "1 Year", price: 1500},
];

export default function Request() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lockerId = searchParams.get("lockerId");
  const locker = lockers.find((l) => l.id === lockerId);

  const [duration, setDuration] = useState(durations[0].value);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the request to your backend
    console.log(
      "Submitted request for locker",
      lockerId,
      "with duration",
      duration,
      "and file",
      file
    );
    router.push("/dashboard");
  };

  if (!locker) return <div>Locker not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rent Request</h1>
      <Card>
        <CardHeader>
          <CardTitle>Locker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Locker ID: {locker.id}</p>
          <p>Size: {locker.size}</p>
          <form onSubmit={handleSubmit} className="mt-4">
            <Select onValueChange={setDuration} defaultValue={duration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label} - ${d.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-4"
            />
            <Button type="submit" className="mt-4">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
