export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type Locker = {
  id: string;
  size: "small" | "medium" | "large";
  status: "available" | "occupied" | "pending";
  rentedBy?: string;
  rentDuration?: string;
  rentEndDate?: string;
};

export type Transaction = {
  id: string;
  userId: string;
  lockerId: string;
  duration: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export const users: User[] = [
  {id: "1", name: "John Doe", email: "john@example.com", role: "user"},
  {id: "2", name: "Jane Smith", email: "jane@example.com", role: "user"},
  {id: "3", name: "Admin User", email: "admin@smartpalms.com", role: "admin"},
];

export const lockers: Locker[] = [
  {id: "L1", size: "large", status: "available"},
  {
    id: "L2",
    size: "large",
    status: "occupied",
    rentedBy: "1",
    rentDuration: "1 month",
    rentEndDate: "2023-07-15",
  },
  {id: "M1", size: "medium", status: "available"},
  {id: "M2", size: "medium", status: "pending", rentedBy: "2"},
  {id: "S1", size: "small", status: "available"},
  {id: "S2", size: "small", status: "available"},
  {
    id: "S3",
    size: "small",
    status: "occupied",
    rentedBy: "1",
    rentDuration: "1 week",
    rentEndDate: "2023-06-22",
  },
  {id: "S4", size: "small", status: "available"},
];

export const transactions: Transaction[] = [
  {
    id: "T1",
    userId: "1",
    lockerId: "L2",
    duration: "1 month",
    amount: 100,
    status: "approved",
    createdAt: "2023-06-15",
  },
  {
    id: "T2",
    userId: "2",
    lockerId: "M2",
    duration: "1 week",
    amount: 30,
    status: "pending",
    createdAt: "2023-06-18",
  },
  {
    id: "T3",
    userId: "1",
    lockerId: "S3",
    duration: "1 week",
    amount: 20,
    status: "approved",
    createdAt: "2023-06-15",
  },
];
