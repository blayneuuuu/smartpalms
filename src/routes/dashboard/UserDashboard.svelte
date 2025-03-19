<script lang="ts">
  import {
    Button,
    Card,
    Badge,
    Alert,
    Spinner,
    Tabs,
    TabItem,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import {formatDate, formatTimestamp} from "$lib/utils/date";
  import {goto} from "$app/navigation";

  type UserData = {
    id: string;
    email: string;
    name: string;
    type: "admin" | "user";
  };

  let {userData} = $props<{userData: UserData}>();
  let loading = $state(false);
  let error = $state<string | null>(null);
  let otpMap = $state<Record<string, {otp: string; expiryDate: string}>>({});

  type LockerData = {
    subscriptionsCount: number;
    requestsCount: number;
    subscriptions: Array<{
      id: string;
      lockerId: string;
      lockerNumber: string;
      lockerSize: string;
      expiresAt: string;
      status: string;
    }>;
    requests: Array<{
      id: string;
      lockerId: string;
      lockerNumber: string;
      lockerSize: string;
      status: string;
      rejectionReason?: string;
      requestedAt: string;
      subscriptionName: string;
      proofOfPayment: string;
    }>;
  };

  let lockerData = $state<LockerData>({
    subscriptionsCount: 0,
    requestsCount: 0,
    subscriptions: [],
    requests: [],
  });

  type AccessHistory = {
    id: string;
    lockerId: string;
    lockerNumber: string;
    accessType: string;
    otp: string | null;
    status: string;
    accessedAt: string;
  };

  let accessHistory = $state<AccessHistory[]>([]);

  async function fetchLockerData() {
    loading = true;
    error = null;
    try {
      const response = await fetch(`/api/lockers/user/${userData.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch locker data");
      }
      const data = await response.json();
      console.log("Received locker data:", data);
      lockerData = data;
      console.log("Updated locker data:", lockerData);
    } catch (err) {
      console.error("Error fetching locker data:", err);
      error =
        err instanceof Error ? err.message : "Failed to fetch locker data";
    } finally {
      loading = false;
    }
  }

  async function generateOTP(lockerId: string) {
    loading = true;
    error = null;
    try {
      const response = await fetch(`/api/lockers/${lockerId}/otp`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to generate OTP");
      }
      const data = await response.json();
      otpMap[lockerId] = data;
      otpMap = otpMap; // Trigger reactivity
    } catch (err) {
      console.error("Error generating OTP:", err);
      error = err instanceof Error ? err.message : "Failed to generate OTP";
    } finally {
      loading = false;
    }
  }

  async function resubmitRequest(requestId: string) {
    try {
      const response = await fetch(
        `/api/lockers/request/${requestId}/resubmit`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resubmit request");
      }

      await fetchLockerData();
    } catch (error) {
      console.error("Error resubmitting request:", error);
    }
  }

  async function handleSignOut() {
    try {
      const response = await fetch("/api/auth/signout", {method: "POST"});
      if (response.ok) {
        goto("/");
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  }

  async function fetchAccessHistory() {
    try {
      const response = await fetch(
        `/api/lockers/user/${userData.id}/access-history`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch access history");
      }
      const data = await response.json();
      accessHistory = data.history;
    } catch (err) {
      console.error("Error fetching access history:", err);
    }
  }

  // Call fetchLockerData and fetchAccessHistory when the component mounts
  $effect(() => {
    if (userData.id) {
      console.log("Fetching locker data for user:", userData.id);
      fetchLockerData();
      fetchAccessHistory();
    }
  });
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm">
    <div
      class="flex flex-col sm:flex-row justify-between py-4 px-4 md:px-6 lg:px-20 items-center space-y-2 sm:space-y-0"
    >
      <div class="flex items-center justify-between w-full">
        <h1 class="text-3xl sm:text-3xl font-extrabold text-orange-500">
          Smartpalms
        </h1>
        <h1 class="text-xl sm:text-xl font-light text-gray-900">Dashboard</h1>
      </div>
      <div
        class="flex flex-row items-center space-x-2 sm:space-x-4 justify-between lg:justify-end w-full"
      >
        <div class="flex items-center space-x-2 sm:space-x-3">
          <span
            class="text-sm sm:text-lg font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none"
            >{userData.name}</span
          >
        </div>
        <div>
          <Button size="sm" href="/profile" color="light">Profile</Button>
          <Button size="sm" color="light" on:click={handleSignOut}
            >Sign out</Button
          >
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
    <div class="space-y-4 sm:space-y-6">
      {#if error}
        <Alert color="red">
          <span class="font-medium">{error}</span>
          <Button
            color="red"
            class="ml-2 sm:ml-4"
            on:click={() => {
              error = null;
              fetchLockerData();
            }}>Retry</Button
          >
        </Alert>
      {/if}

      <Tabs style="underline">
        <TabItem open title="My Lockers">
          <div class="w-full flex flex-col">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0"
            >
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                Active Lockers
              </h2>
              <Button href="/lockers" color="blue">Rent a Locker</Button>
            </div>

            {#if loading}
              <div class="flex justify-center py-4">
                <Spinner size="8" />
              </div>
            {:else if !lockerData.subscriptions || lockerData.subscriptions.length === 0}
              <p class="text-gray-600">
                You don't have any active locker subscriptions.
              </p>
            {:else}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each lockerData.subscriptions as subscription (subscription.id)}
                  <div class="bg-white shadow-md rounded-lg p-4">
                    <div class="flex flex-col space-y-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <h3 class="text-lg font-semibold">
                            Locker #{subscription.lockerNumber}
                          </h3>
                          <p class="text-sm text-gray-600">
                            Size: {subscription.lockerSize}
                          </p>
                          <p class="text-sm text-gray-600">
                            Valid until: {formatDate(
                              subscription.expiresAt,
                              true
                            )}
                          </p>
                        </div>
                        <Badge
                          color={subscription.status === "active"
                            ? "green"
                            : "red"}
                        >
                          {subscription.status}
                        </Badge>
                      </div>

                      {#if subscription.status === "active"}
                        <div class="flex flex-col space-y-2">
                          {#if otpMap[subscription.lockerId] && !loading}
                            <Alert color="green">
                              <span class="text-lg"
                                >OTP: <span class="font-bold tracking-widest"
                                  >{otpMap[subscription.lockerId].otp}</span
                                ></span
                              >
                              <p class="text-sm">
                                Expires at: {formatDate(
                                  otpMap[subscription.lockerId].expiryDate,
                                  true
                                )}
                              </p>
                            </Alert>
                          {/if}
                          <Button
                            size="sm"
                            on:click={() => generateOTP(subscription.lockerId)}
                          >
                            {#if loading}
                              <Spinner class="mr-3" size="4" />
                              Loading...
                            {:else}
                              Generate OTP
                            {/if}
                          </Button>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </TabItem>

        <TabItem title="Requests">
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-xl font-bold text-gray-900">Requests</h2>
            {#if lockerData.requestsCount > 0}
              <Badge color="blue">{lockerData.requestsCount}</Badge>
            {/if}
          </div>
          {#if loading}
            <div class="flex justify-center py-4">
              <Spinner size="8" />
            </div>
          {:else if !lockerData.requests || lockerData.requests.length === 0}
            <p class="text-gray-600">You don't have any pending requests.</p>
          {:else}
            <div class="space-y-4">
              {#each lockerData.requests as request}
                <Card>
                  <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
                  >
                    <div>
                      <h3 class="text-lg font-semibold">
                        Locker #{request.lockerNumber}
                      </h3>
                      <p class="text-sm text-gray-600">
                        Size: {request.lockerSize}
                      </p>
                      <p class="text-sm text-gray-600">
                        Subscription: {request.subscriptionName}
                      </p>
                      <p class="text-sm text-gray-600">
                        Requested on: {formatDate(request.requestedAt, true)}
                      </p>
                      {#if request.status === "rejected" && request.rejectionReason}
                        <p class="text-sm text-red-600">
                          Reason: {request.rejectionReason}
                        </p>
                      {/if}
                    </div>
                    <div class="flex items-center space-x-4">
                      <Badge
                        color={request.status === "pending"
                          ? "yellow"
                          : request.status === "approved"
                            ? "green"
                            : "red"}
                      >
                        {request.status}
                      </Badge>
                      {#if request.status === "rejected"}
                        <Button
                          size="sm"
                          on:click={() => resubmitRequest(request.id)}
                        >
                          Resubmit
                        </Button>
                      {/if}
                    </div>
                  </div>
                </Card>
              {/each}
            </div>
          {/if}
        </TabItem>

        <TabItem title="Access History">
          {#if loading}
            <div class="flex justify-center py-4">
              <Spinner size="8" />
            </div>
          {:else if !accessHistory || accessHistory.length === 0}
            <p class="text-gray-600">No access history available.</p>
          {:else}
            <div class="space-y-4">
              <div class="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableHeadCell>Locker #</TableHeadCell>
                    <TableHeadCell>Access Type</TableHeadCell>
                    <TableHeadCell class="hidden sm:table-cell"
                      >OTP</TableHeadCell
                    >
                    <TableHeadCell>Access Date-Time</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                  </TableHead>
                  <TableBody tableBodyClass="divide-y">
                    {#each accessHistory as access}
                      <TableBodyRow>
                        <TableBodyCell>{access.lockerNumber}</TableBodyCell>
                        <TableBodyCell
                          >{access.accessType === "otp"
                            ? "OTP"
                            : "Subscription"}</TableBodyCell
                        >
                        <TableBodyCell class="hidden sm:table-cell">
                          {#if access.otp}
                            {access.otp}
                          {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                          <span class="whitespace-nowrap"
                            >{formatTimestamp(access.accessedAt)}</span
                          >
                        </TableBodyCell>
                        <TableBodyCell>
                          <Badge
                            color={access.status === "success"
                              ? "green"
                              : "red"}
                          >
                            {access.status}
                          </Badge>
                        </TableBodyCell>
                      </TableBodyRow>
                    {/each}
                  </TableBody>
                </Table>
              </div>
            </div>
          {/if}
        </TabItem>
      </Tabs>
    </div>
  </main>
</div>
