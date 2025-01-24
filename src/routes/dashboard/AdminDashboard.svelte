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

  // Initial data fetch
  $effect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchRequests(),
      fetchLockers(),
      fetchUsers(),
      fetchSubscriptionTypes(),
    ]).catch((err) => {
      console.error("Error fetching initial data:", err);
    });
  });

  // Fetch data when tab changes
  $effect(() => {
    switch (activeTab) {
      case "requests":
        fetchRequests();
        break;
      case "lockers":
        fetchLockers();
        break;
      case "users":
        fetchUsers();
        break;
      case "subscription-types":
        fetchSubscriptionTypes();
        break;
    }
  });

  function handleTabChange(e: CustomEvent<{tabId: string}>) {
    activeTab = e.detail.tabId;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm">
    <div class="flex flex-row justify-between py-4 px-6 md:px-20 items-center">
      <h1 class="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
      <div class="flex flex-row items-center space-x-4">
        <div class="flex items-center space-x-3">
          <span class="text-lg font-semibold text-gray-700">{userData.name}</span>
          <Badge color="red">Admin</Badge>
        </div>
        <Button href="/profile" color="light">Profile</Button>
        <Button href="/logout" color="light">Sign out</Button>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <div class="space-y-6">
      {#if $errors.stats}
        <Alert color="red">
          {$errors.stats}
          <Button color="red" class="ml-4" on:click={fetchDashboardStats}>
            Retry
          </Button>
        </Alert>
      {/if}

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <TabItem open title="Requests" activeClasses={activeTab === "requests" ? "text-blue-600 border-blue-600" : ""}>
          <RequestsTab />
        </TabItem>

        <TabItem title="Lockers" activeClasses={activeTab === "lockers" ? "text-blue-600 border-blue-600" : ""}>
          <LockersTab />
        </TabItem>

        <TabItem title="Users" activeClasses={activeTab === "users" ? "text-blue-600 border-blue-600" : ""}>
          <UsersTab />
        </TabItem>

        <TabItem title="Subscription Types" activeClasses={activeTab === "subscription-types" ? "text-blue-600 border-blue-600" : ""}>
          <SubscriptionTypesTab />
        </TabItem>
      </Tabs>
    </div>
  </main>
</div>
