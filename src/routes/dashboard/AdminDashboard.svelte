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
    switch (tab) {
      case "requests":
        return fetchRequests();
      case "lockers":
        return fetchLockers();
      case "users":
        return fetchUsers();
      case "subscription-types":
        return fetchSubscriptionTypes();
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
    <div class="flex flex-col sm:flex-row justify-between py-4 px-4 md:px-6 lg:px-20 items-center space-y-2 sm:space-y-0">
      <div class="flex items-center justify-between w-full">
        <h1 class="text-3xl sm:text-3xl font-extrabold text-orange-500">
          Smartpalms
        </h1>
        <h1 class="text-xl sm:text-xl font-light text-gray-900">Admin Dashboard</h1>
      </div>
      <div class="flex flex-row items-center space-x-2 sm:space-x-4 justify-between lg:justify-end w-full">
        <div class="flex items-center space-x-2 sm:space-x-3">
          <span class="text-sm sm:text-lg font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none">{userData.name}</span>
          <Badge color="red">Admin</Badge>
        </div>
        <div>
          <Button size="sm" href="/profile" color="light">Profile</Button>
          <Button size="sm" href="/logout" color="light">Sign out</Button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
    <div class="space-y-4 sm:space-y-6">
      {#if $errors.stats}
        <Alert color="red">
          {$errors.stats}
          <Button color="red" class="ml-2 sm:ml-4" on:click={handleRetry}>
            Retry
          </Button>
        </Alert>
      {/if}

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
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
      <Tabs style="underline" on:change={handleTabChange}>
        <TabItem open title="Requests">
          <RequestsTab />
        </TabItem>

        <TabItem title="Lockers" >
          <LockersTab />
        </TabItem>

        <TabItem title="Users" >
          <UsersTab />
        </TabItem>

        <TabItem title="Subscription Types" >
          <SubscriptionTypesTab />
        </TabItem>
      </Tabs>
    </div>
  </main>
</div>
