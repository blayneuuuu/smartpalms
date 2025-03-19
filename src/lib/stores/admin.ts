import {writable} from "svelte/store";
import type {
  User,
  Locker,
  LockerRequest,
  SubscriptionType,
  Transaction,
} from "$lib/server/db/schema";

// Types
export type DashboardStats = {
  totalLockers: number;
  occupiedLockers: number;
  totalUsers: number;
  pendingRequests: number;
};

export type AdminRequest = LockerRequest & {
  userName: string;
  lockerNumber: string;
  lockerSize: string;
  subscriptionName: string;
};

export type AdminLocker = Locker & {
  userName: string | null;
  userEmail: string | null;
};

export type AdminTransaction = Transaction & {
  userName: string;
  subscriptionName: string;
};

export type StoreKey =
  | "stats"
  | "requests"
  | "lockers"
  | "users"
  | "subscriptionTypes"
  | "transactions";

// Stores
export const stats = writable<DashboardStats>({
  totalLockers: 0,
  occupiedLockers: 0,
  totalUsers: 0,
  pendingRequests: 0,
});

export const requests = writable<AdminRequest[]>([]);
export const lockers = writable<AdminLocker[]>([]);
export const users = writable<User[]>([]);

// Create a custom store for subscription types with logging
function createSubscriptionTypesStore() {
  const {subscribe, set, update} = writable<SubscriptionType[]>([]);

  return {
    subscribe,
    set: (data: SubscriptionType[]) => {
      console.log("Store: Setting subscription types", data);
      set(data);
    },
    update,
  };
}

export const subscriptionTypes = createSubscriptionTypesStore();
export const transactions = writable<AdminTransaction[]>([]);

// Loading states
export const loading = writable<Record<StoreKey, boolean>>({
  stats: false,
  requests: false,
  lockers: false,
  users: false,
  subscriptionTypes: false,
  transactions: false,
});

// Error states
export const errors = writable<Record<StoreKey, string | null>>({
  stats: null,
  requests: null,
  lockers: null,
  users: null,
  subscriptionTypes: null,
  transactions: null,
});
