import {
  stats,
  requests,
  lockers,
  users,
  subscriptionTypes,
  transactions,
  loading,
  errors,
  accessHistory,
  type StoreKey,
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
  console.log("Service: Starting fetchSubscriptionTypes");
  setLoading("subscriptionTypes", true);
  try {
    console.log(
      "Service: Sending fetch request to /api/admin/subscription-types"
    );
    const response = await fetch("/api/admin/subscription-types", {
      // Add cache-busting query parameter to prevent cached responses
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    console.log("Service: Response received", {status: response.status});

    if (!response.ok) {
      const data = await response.json();
      console.error("Service: Error response", data);
      throw new Error(data.message || "Failed to fetch subscription types");
    }

    const data = await response.json();
    console.log("Service: Success response", data);

    if (!Array.isArray(data.subscriptionTypes)) {
      console.error("Service: Invalid data format, expected array", data);
      throw new Error("Invalid data format received from server");
    }

    console.log(
      `Service: Setting ${data.subscriptionTypes.length} subscription types to store`,
      data.subscriptionTypes
    );

    // Clear the store first, then set the new data to ensure complete refresh
    subscriptionTypes.set([]);
    setTimeout(() => {
      subscriptionTypes.set(data.subscriptionTypes);
    }, 10);

    errors.update((e) => ({...e, subscriptionTypes: null}));
    return data.subscriptionTypes;
  } catch (error) {
    console.error("Service: Error in fetchSubscriptionTypes", error);
    handleError("subscriptionTypes", error);
    throw error;
  } finally {
    console.log("Service: Finished fetchSubscriptionTypes");
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
    return data;
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
    return {success: true, deleted: true};
  } catch (error) {
    handleError("requests", error);
    throw error;
  }
}

// Create subscription type
export async function createSubscriptionType(data: {
  name: string;
  duration: string;
  size: string;
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
    size: string;
    amount: number;
    isActive?: boolean;
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
    console.log(
      `[deleteSubscriptionType] Starting deletion of subscription type ${id}`
    );
    const response = await fetch(`/api/admin/subscription-types/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`[deleteSubscriptionType] Response status: ${response.status}`);

    const result = await response.json();
    console.log(`[deleteSubscriptionType] Response data:`, result);

    if (!response.ok) {
      console.error(`[deleteSubscriptionType] Error response:`, result);
      throw new Error(result.message || "Failed to delete subscription type");
    }

    console.log(
      `[deleteSubscriptionType] Successfully deleted, now fetching updated list`
    );
    await fetchSubscriptionTypes();
    console.log(
      `[deleteSubscriptionType] Updated subscription types list after deletion`
    );
    return result;
  } catch (error) {
    console.error(`[deleteSubscriptionType] Exception caught:`, error);
    handleError("subscriptionTypes", error);
    throw error;
  }
}

// Fetch access history
export async function fetchAccessHistory() {
  setLoading("accessHistory", true);
  try {
    const response = await fetch("/api/admin/access-history");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch access history");
    }
    const data = await response.json();
    accessHistory.set(data.history);
    errors.update((e) => ({...e, accessHistory: null}));
  } catch (error) {
    handleError("accessHistory", error);
  } finally {
    setLoading("accessHistory", false);
  }
}

// Remove subscription and make locker available
export async function removeSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to remove subscription");
    }

    // Refresh data after successful action
    await Promise.all([fetchLockers(), fetchDashboardStats()]);
    return {success: true};
  } catch (error) {
    handleError("lockers", error);
    throw error;
  }
}
