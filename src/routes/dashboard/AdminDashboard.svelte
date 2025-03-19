<script lang="ts">
  import {
    Button,
    Card,
    Badge,
    Alert,
    Spinner,
    Tabs,
    TabItem,
  } from "flowbite-svelte";
  import StatsCard from "./components/StatsCard.svelte";
  import RequestsTab from "./components/RequestsTab.svelte";
  import LockersTab from "./components/LockersTab.svelte";
  import UsersTab from "./components/UsersTab.svelte";
  import SubscriptionTypesTab from "./components/SubscriptionTypesTab.svelte";
  import SubscriptionsTab from "./components/SubscriptionsTab.svelte";
  import {stats, loading, errors} from "$lib/stores/admin";
  import {
    fetchDashboardStats,
    fetchRequests,
    fetchLockers,
    fetchUsers,
    fetchSubscriptionTypes,
  } from "$lib/services/admin";

  type UserData = {
    id: string;
    email: string;
    name: string;
    type: "admin" | "user";
  };

  let {userData} = $props<{userData: UserData}>();
  let activeTab = $state("requests");

  // Create a type for tab IDs to ensure type safety
  type TabId = "requests" | "lockers" | "users" | "subscription-types" | "subscriptions";
  
  // Store the last loaded time for each tab
  const tabLoadTimestamps = $state<Record<TabId, number>>({
    "requests": 0,
    "lockers": 0,
    "users": 0,
    "subscription-types": 0,
    "subscriptions": 0
  });
  
  // Set a cache timeout (5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Initial data loading handler
  function loadInitialData() {
    return Promise.all([
      fetchDashboardStats(),
      fetchRequests(),
      fetchLockers(),
      fetchUsers(),
      fetchSubscriptionTypes(),
    ]).catch((err) => {
      console.error("Error fetching initial data:", err);
    });
  }

  // Load data based on active tab
  function loadTabData(tab: string) {
    const now = Date.now();
    // Use type assertion to ensure type safety
    const tabId = tab as TabId;
    const lastLoadTime = tabLoadTimestamps[tabId] || 0;
    const timeSinceLastLoad = now - lastLoadTime;
    
    // Skip loading if data was loaded recently (within CACHE_TIMEOUT)
    if (timeSinceLastLoad < CACHE_TIMEOUT) {
      console.log(`Skipping data load for ${tab}, last loaded ${timeSinceLastLoad}ms ago`);
      return Promise.resolve();
    }
    
    // Update the timestamp before loading
    tabLoadTimestamps[tabId] = now;
    
    switch (tab) {
      case "requests":
        return fetchRequests();
      case "lockers":
        return fetchLockers();
      case "users":
        return fetchUsers();
      case "subscription-types":
        return fetchSubscriptionTypes();
      case "subscriptions":
        // No specific data loading for subscriptions tab as it loads its own data
        return Promise.resolve();
      default:
        return Promise.resolve();
    }
  }

  // Initial data fetch
  $effect(() => {
    loadInitialData();
  });

  // Fetch data when tab changes
  $effect(() => {
    loadTabData(activeTab);
  });

  function handleTabChange(e: CustomEvent<{tabId: string}>) {
    activeTab = e.detail.tabId;
  }

  function handleRetry() {
    fetchDashboardStats();
  }
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm">
    <div class="flex flex-col sm:flex-row justify-between py-4 px-4 md:px-6 lg:px-8 xl:px-16 items-center space-y-2 sm:space-y-0">
      <div class="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-1">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-orange-500">
          Smartpalms
        </h1>
        <h2 class="text-lg sm:text-xl sm:ml-2 font-light text-gray-900">Admin Dashboard</h2>
      </div>
      <div class="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2 sm:gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm sm:text-base font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{userData.name}</span>
          <Badge color="red">Admin</Badge>
        </div>
        <div class="flex gap-1 sm:gap-2">
          <Button size="xs" class="sm:hidden" href="/profile" color="light">Profile</Button>
          <Button size="sm" class="hidden sm:inline-flex" href="/profile" color="light">Profile</Button>
          <Button size="xs" class="sm:hidden" href="/logout" color="light">Sign out</Button>
          <Button size="sm" class="hidden sm:inline-flex" href="/logout" color="light">Sign out</Button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-8 max-w-7xl">
    <div class="space-y-3 sm:space-y-5">
      {#if $errors.stats}
        <Alert color="red" class="text-sm sm:text-base">
          {$errors.stats}
          <Button color="red" class="ml-2 text-xs sm:text-sm" on:click={handleRetry}>
            Retry
          </Button>
        </Alert>
      {/if}

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <StatsCard
          title="Total Lockers"
          value={$stats.totalLockers}
          loading={$loading.stats}
        />
        <StatsCard
          title="Occupied Lockers"
          value={$stats.occupiedLockers}
          loading={$loading.stats}
        />
        <StatsCard
          title="Total Users"
          value={$stats.totalUsers}
          loading={$loading.stats}
        />
        <StatsCard
          title="Pending Requests"
          value={$stats.pendingRequests}
          loading={$loading.stats}
        />
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <Tabs style="underline" class="overflow-x-auto scrollbar-none" on:change={handleTabChange}>
          <TabItem open title="Requests" class="text-xs sm:text-sm md:text-base">
            <div class="p-1 sm:p-2 md:p-4">
              <RequestsTab />
            </div>
          </TabItem>

          <TabItem title="Lockers" class="text-xs sm:text-sm md:text-base">
            <div class="p-1 sm:p-2 md:p-4">
              <LockersTab />
            </div>
          </TabItem>

          <TabItem title="Users" class="text-xs sm:text-sm md:text-base">
            <div class="p-1 sm:p-2 md:p-4">
              <UsersTab />
            </div>
          </TabItem>

          <TabItem title="Subscriptions" class="text-xs sm:text-sm md:text-base">
            <div class="p-1 sm:p-2 md:p-4">
              <SubscriptionsTab />
            </div>
          </TabItem>

          <TabItem title="Sub. Types" id="subscription-types" class="text-xs sm:text-sm md:text-base hidden sm:block">
            <div class="p-1 sm:p-2 md:p-4">
              <SubscriptionTypesTab />
            </div>
          </TabItem>
          
          <TabItem title="Types" id="subscription-types" class="text-xs sm:text-sm md:text-base sm:hidden">
            <div class="p-1 sm:p-2 md:p-4">
              <SubscriptionTypesTab />
            </div>
          </TabItem>
        </Tabs>
      </div>
    </div>
  </main>
</div>
