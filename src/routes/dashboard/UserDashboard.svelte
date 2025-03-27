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
    Heading,
  } from "flowbite-svelte";
  import {formatDate, formatTimestamp} from "$lib/utils/date";
  import {goto} from "$app/navigation";
  
  // Import shared components
  import DashboardLayout from "$lib/components/layouts/DashboardLayout.svelte";
  import { apiGet, apiPost } from "$lib/services/api";
  import { lockerService } from "$lib/services/api";

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
      daysUntilExpiration?: number;
      isExpiringSoon?: boolean;
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
      const result = await apiGet<LockerData>(`/api/lockers/user/${userData.id}`);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch locker data");
      }
      lockerData = result.data as LockerData;
    } catch (err) {
      console.error("Error fetching locker data:", err);
      error = err instanceof Error ? err.message : "Failed to fetch locker data";
    } finally {
      loading = false;
    }
  }

  async function generateOTP(lockerId: string) {
    loading = true;
    error = null;
    try {
      const result = await lockerService.generateOTP(lockerId);
      if (!result.success) {
        throw new Error(result.error || "Failed to generate OTP");
      }
      otpMap[lockerId] = result.data as {otp: string; expiryDate: string};
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
      const result = await apiPost(`/api/lockers/request/${requestId}/resubmit`, {});
      if (!result.success) {
        throw new Error(result.error || "Failed to resubmit request");
      }
      await fetchLockerData();
    } catch (error) {
      console.error("Error resubmitting request:", error);
    }
  }

  async function handleSignOut() {
    try {
      const result = await apiPost("/api/auth/signout", {});
      if (result.success) {
        goto("/");
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  }

  async function fetchAccessHistory() {
    try {
      const result = await apiGet<{history: AccessHistory[]}>(`/api/lockers/user/${userData.id}/access-history`);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch access history");
      }
      accessHistory = result.data?.history || [];
    } catch (err) {
      console.error("Error fetching access history:", err);
    }
  }

  // Sort subscriptions by status
  function getSortedLockers() {
    if (!lockerData.subscriptions) return [];
    return [...lockerData.subscriptions].sort((a, b) => {
      // Active subscriptions first
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      // Then sort by locker number
      return a.lockerNumber.localeCompare(b.lockerNumber);
    });
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

<DashboardLayout title="User Dashboard" userName={userData.name} userType="user">
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
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                My Rented Lockers
              </h2>
              {#if lockerData.subscriptionsCount > 0}
                <p class="text-sm text-gray-600">
                  You have {lockerData.subscriptionsCount} active {lockerData.subscriptionsCount === 1 ? 'subscription' : 'subscriptions'}
                </p>
              {/if}
            </div>
            <Button href="/lockers" color="blue">Rent a Locker</Button>
          </div>

          {#if loading}
            <div class="flex justify-center py-4">
              <Spinner size="8" />
            </div>
          {:else if !lockerData.subscriptions || lockerData.subscriptions.length === 0}
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <Heading tag="h3" class="mb-2">No Active Lockers</Heading>
              <p class="text-gray-600 mb-4">
                You don't have any active locker subscriptions.
              </p>
              <Button href="/lockers" color="blue">Browse Available Lockers</Button>
            </div>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each getSortedLockers() as subscription (subscription.id)}
                <Card padding="xl" class="h-full border-t-4 {subscription.status === 'active' ? 'border-t-green-500' : 'border-t-red-500'}">
                  <div class="flex flex-col h-full">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <Heading tag="h3" class="text-xl">
                          Locker #{subscription.lockerNumber}
                        </Heading>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <Badge color="purple">{subscription.lockerSize} size</Badge>
                          <Badge
                            color={subscription.status === "active"
                              ? "green"
                              : "red"}
                          >
                            {subscription.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-2 mb-4 text-gray-700">
                      <div class="flex justify-between border-b pb-2 mb-2">
                        <span>Locker Size:</span>
                        <span class="font-medium">{subscription.lockerSize}</span>
                      </div>
                      <div class="flex justify-between border-b pb-2 mb-2">
                        <span>Status:</span>
                        <span class="font-medium">{subscription.status}</span>
                      </div>
                      <div class="flex justify-between border-b pb-2 mb-2">
                        <span>Expires:</span>
                        <span class="font-medium">{formatDate(subscription.expiresAt, true)}</span>
                      </div>
                      {#if subscription.daysUntilExpiration !== undefined}
                        <div class="flex justify-between">
                          <span>Time Remaining:</span>
                          <span class="font-medium {subscription.isExpiringSoon ? 'text-red-600 font-bold' : ''}">
                            {subscription.daysUntilExpiration} days
                            {#if subscription.isExpiringSoon}
                              <span class="text-xs ml-1 text-red-600">(Expiring soon!)</span>
                            {/if}
                          </span>
                        </div>
                      {/if}
                    </div>

                    {#if subscription.status === "active"}
                      <div class="mt-auto flex flex-col space-y-2">
                        {#if otpMap[subscription.lockerId] && !loading}
                          <Alert color="green" class="mb-2">
                            <div class="flex flex-col items-center">
                              <span class="text-sm mb-1">Your OTP code:</span>
                              <span class="text-2xl font-bold tracking-widest">{otpMap[subscription.lockerId].otp}</span>
                              <span class="text-xs mt-1">
                                Valid until: {formatDate(otpMap[subscription.lockerId].expiryDate, true)}
                              </span>
                            </div>
                          </Alert>
                        {/if}
                        <Button
                          class="w-full"
                          color="blue"
                          on:click={() => generateOTP(subscription.lockerId)}
                        >
                          {#if loading}
                            <Spinner class="mr-3" size="4" />
                            Loading...
                          {:else}
                            Generate Access OTP
                          {/if}
                        </Button>
                      </div>
                    {/if}
                  </div>
                </Card>
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
</DashboardLayout>
