import {apiGet, apiPost, apiPatch} from "./fetch";
import type {LockerSize} from "$lib/server/db/schema";

/**
 * Type definitions for Locker data
 */
export type Locker = {
  id: string;
  number: string;
  size: LockerSize;
  isOccupied: boolean;
  userId: string | null;
  userName: string | null;
  userEmail?: string | null;
  createdAt: string;
};

export type LockerRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lockerId: string;
  lockerNumber: string;
  lockerSize: LockerSize;
  subscriptionTypeId: string;
  subscriptionName: string;
  status: "pending" | "approved" | "rejected";
  proofOfPayment: string | null;
  rejectionReason: string | null;
  requestedAt: string;
  processedAt: string | null;
};

export type Subscription = {
  id: string;
  status: "active" | "expired" | "cancelled";
  userId: string;
  lockerId: string;
  lockerNumber: string;
  lockerSize: LockerSize;
  expiresAt: string;
  createdAt: string;
};

export type SubscriptionType = {
  id: string;
  name: string;
  duration: "1_day" | "7_days" | "30_days";
  amount: number;
  isActive: boolean;
  createdAt: string;
};

/**
 * Fetch all lockers
 */
export function fetchLockers() {
  return apiGet<{lockers: Locker[]}>("/api/admin/lockers");
}

/**
 * Fetch locker by ID
 */
export function fetchLocker(id: string) {
  return apiGet<{locker: Locker}>(`/api/admin/lockers/${id}`);
}

/**
 * Create a new locker
 */
export function createLocker(data: {number: string; size: LockerSize}) {
  return apiPost<{locker: Locker}>("/api/admin/lockers", data);
}

/**
 * Update locker details
 */
export function updateLocker(id: string, data: {userId?: string | null}) {
  return apiPatch<{locker: Locker}>(`/api/admin/lockers/${id}`, data);
}

/**
 * Fetch pending requests
 */
export function fetchRequests() {
  return apiGet<{requests: LockerRequest[]}>("/api/admin/requests");
}

/**
 * Process a request (approve/reject)
 */
export function processRequest(
  requestId: string,
  action: "approve" | "reject",
  rejectionReason?: string
) {
  return apiPatch<{success: boolean}>(`/api/admin/requests/${requestId}`, {
    status: action,
    rejectionReason,
  });
}

/**
 * Fetch all subscription types
 */
export function fetchSubscriptionTypes() {
  return apiGet<{subscriptionTypes: SubscriptionType[]}>(
    "/api/admin/subscription-types"
  );
}

/**
 * Create subscription type
 */
export function createSubscriptionType(data: {
  name: string;
  duration: "1_day" | "7_days" | "30_days";
  amount: number;
}) {
  return apiPost<{subscriptionType: SubscriptionType}>(
    "/api/admin/subscription-types",
    data
  );
}

/**
 * Update subscription type
 */
export function updateSubscriptionType(
  id: string,
  data: {
    name?: string;
    duration?: "1_day" | "7_days" | "30_days";
    amount?: number;
    isActive?: boolean;
  }
) {
  return apiPatch<{subscriptionType: SubscriptionType}>(
    `/api/admin/subscription-types/${id}`,
    data
  );
}

/**
 * Generate OTP for locker access
 */
export function generateOTP(lockerId: string) {
  return apiPost<{otp: string; expiryDate: string}>(
    `/api/lockers/${lockerId}/otp`,
    {}
  );
}
