<script lang="ts">
  import {
    Tabs,
    TabItem,
  } from "flowbite-svelte";
  import RequestsTab from "./components/RequestsTab.svelte";
  import LockersTab from "./components/LockersTab.svelte";
  import UsersTab from "./components/UsersTab.svelte";
  import SubscriptionTypesTab from "./components/SubscriptionTypesTab.svelte";
  import AccessHistoryTab from "./components/AccessHistoryTab.svelte";
  import { stats, loading, errors } from "$lib/stores/admin";
  import {
    fetchDashboardStats,
    fetchRequests,
    fetchLockers,
    fetchUsers,
    fetchSubscriptionTypes,
    fetchAccessHistory,
  } from "$lib/services/admin";
  
  // Import shared components
  import DashboardLayout from "$lib/components/layouts/DashboardLayout.svelte";
  import StatsSection from "$lib/components/layouts/StatsSection.svelte";

  type UserData = {
    id: string;
    email: string;
    name: string;
    type: "admin" | "user";
  };

  let {userData} = $props<{userData: UserData}>();
  let activeTab = $state("requests");

  // Create a type for tab IDs to ensure type safety
  type TabId = "requests" | "lockers" | "users" | "subscription-types" | "access-history";
  
  // Store the last loaded time for each tab
  const tabLoadTimestamps = $state<Record<TabId, number>>({
    "requests": 0,
    "lockers": 0,
    "users": 0,
    "subscription-types": 0,
    "access-history": 0
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
      fetchAccessHistory(),
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
      case "access-history":
        return fetchAccessHistory();
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

<DashboardLayout title="Admin Dashboard" userName={userData.name} userType="admin">
  <StatsSection 
    stats={$stats} 
    loading={$loading.stats} 
    error={$errors.stats} 
    onRetry={handleRetry} 
  />

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

      <TabItem title="Plans" id="subscription-types" class="text-xs sm:text-sm md:text-base">
        <div class="p-1 sm:p-2 md:p-4">
          <SubscriptionTypesTab />
        </div>
      </TabItem>
      
      <TabItem title="Access History" id="access-history" class="text-xs sm:text-sm md:text-base">
        <div class="p-1 sm:p-2 md:p-4">
          <AccessHistoryTab />
        </div>
      </TabItem>
    </Tabs>
  </div>
</DashboardLayout>
