import {
  stats,
  requests,
  lockers,
  users,
  subscriptionTypes,
  transactions,
  loading,
  errors,
} from "$lib/stores/admin";
import type {DashboardStats} from "$lib/stores/admin";

// Helper function to handle API errors
function handleError(key: keyof typeof errors, error: unknown) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  errors.update((e) => ({...e, [key]: message}));
  console.error(`Error in ${key}:`, error);
}

// Helper function to set loading state
function setLoading(key: keyof typeof loading, value: boolean) {
  loading.update((l) => ({...l, [key]: value}));
}

// Fetch dashboard stats
export async function fetchDashboardStats() {
  setLoading("stats", true);
  try {
    const response = await fetch("/api/admin/stats");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch stats");
    }
    const data = await response.json();

    // Validate data
    if (
      typeof data.totalLockers !== "number" ||
      typeof data.occupiedLockers !== "number" ||
      typeof data.totalUsers !== "number" ||
      typeof data.pendingRequests !== "number"
    ) {
      throw new Error("Invalid stats data received");
    }

    stats.set(data as DashboardStats);
    errors.update((e) => ({...e, stats: null}));
  } catch (error) {
    handleError("stats", error);
  } finally {
    setLoading("stats", false);
  }
}

// Fetch requests
export async function fetchRequests() {
  setLoading("requests", true);
  try {
    const response = await fetch("/api/admin/requests");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch requests");
    }
    const data = await response.json();
    requests.set(data.requests);
    errors.update((e) => ({...e, requests: null}));
  } catch (error) {
    handleError("requests", error);
  } finally {
    setLoading("requests", false);
  }
}

// Fetch lockers
export async function fetchLockers() {
  setLoading("lockers", true);
  try {
    const response = await fetch("/api/admin/lockers");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch lockers");
    }
    const data = await response.json();
    lockers.set(data.lockers);
    errors.update((e) => ({...e, lockers: null}));
  } catch (error) {
    handleError("lockers", error);
  } finally {
    setLoading("lockers", false);
  }
}

// Fetch users
export async function fetchUsers() {
  setLoading("users", true);
  try {
    const response = await fetch("/api/admin/users");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch users");
    }
    const data = await response.json();
    users.set(data.users);
    errors.update((e) => ({...e, users: null}));
  } catch (error) {
    handleError("users", error);
  } finally {
    setLoading("users", false);
  }
}

// Fetch subscription types
export async function fetchSubscriptionTypes() {
  setLoading("subscriptionTypes", true);
  try {
    const response = await fetch("/api/admin/subscription-types");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch subscription types");
    }
    const data = await response.json();
    subscriptionTypes.set(data.subscriptionTypes);
    errors.update((e) => ({...e, subscriptionTypes: null}));
  } catch (error) {
    handleError("subscriptionTypes", error);
  } finally {
    setLoading("subscriptionTypes", false);
  }
}

// Fetch transactions
export async function fetchTransactions() {
  setLoading("transactions", true);
  try {
    const response = await fetch("/api/admin/transactions");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch transactions");
    }
    const data = await response.json();
    transactions.set(data.transactions);
    errors.update((e) => ({...e, transactions: null}));
  } catch (error) {
    handleError("transactions", error);
  } finally {
    setLoading("transactions", false);
  }
}

// Process request (approve/reject)
export async function processRequest(
  requestId: string,
  action: "approve" | "reject",
  rejectionReason?: string
) {
  try {
    const response = await fetch(`/api/admin/requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: action,
        rejectionReason,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to process request");
    }

    // Refresh data after successful action
    await Promise.all([fetchRequests(), fetchDashboardStats(), fetchLockers()]);
  } catch (error) {
    handleError("requests", error);
    throw error;
  }
}

// Create subscription type
export async function createSubscriptionType(data: {
  name: string;
  duration: string;
  amount: number;
}) {
  try {
    const response = await fetch("/api/admin/subscription-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        responseData.message || "Failed to create subscription type"
      );
    }

    await fetchSubscriptionTypes();
  } catch (error) {
    handleError("subscriptionTypes", error);
    throw error;
  }
}

// Update subscription type
export async function updateSubscriptionType(
  id: string,
  data: {
    name: string;
    duration: string;
    amount: number;
  }
) {
  try {
    const response = await fetch(`/api/admin/subscription-types/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(
        responseData.message || "Failed to update subscription type"
      );
    }

    await fetchSubscriptionTypes();
  } catch (error) {
    handleError("subscriptionTypes", error);
    throw error;
  }
}

// Delete subscription type
export async function deleteSubscriptionType(id: string) {
  try {
    const response = await fetch(`/api/admin/subscription-types/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete subscription type");
    }

    await fetchSubscriptionTypes();
  } catch (error) {
    handleError("subscriptionTypes", error);
    throw error;
  }
}
