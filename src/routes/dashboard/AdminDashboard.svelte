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
  import SalesTab from "./components/SalesTab.svelte";
  import MessagesTab from "./components/MessagesTab.svelte";
  import { stats, loading, errors } from "$lib/stores/admin";
  import {
    fetchDashboardStats,
    fetchRequests,
    fetchLockers,
    fetchUsers,
    fetchSubscriptionTypes,
    fetchAccessHistory,
    fetchTransactions,
  } from "$lib/services/admin";
  import { onMount } from "svelte";
  import { notifications } from "$lib/stores/notification";
  
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
  type TabId = "requests" | "lockers" | "users" | "subscription-types" | "access-history" | "sales" | "messages";
  
  // Store the last loaded time for each tab
  const tabLoadTimestamps = $state<Record<TabId, number>>({
    "requests": 0,
    "lockers": 0,
    "users": 0,
    "subscription-types": 0,
    "access-history": 0,
    "sales": 0,
    "messages": 0
  });
  
  // Set a cache timeout (5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Unread messages count
  let unreadMessagesCount = $state(0);
  let previousUnreadCount = $state(0);

  // Fetch unread messages count periodically
  async function fetchUnreadMessagesCount() {
    try {
      const response = await fetch("/api/admin/messages/unread-count");
      if (response.ok) {
        const data = await response.json();
        const newCount = data.count || 0;
        
        // Check if there are new messages
        if (newCount > previousUnreadCount && previousUnreadCount !== 0) {
          // Show notification for new messages
          notifications.add({
            message: `You have ${newCount - previousUnreadCount} new message${newCount - previousUnreadCount > 1 ? 's' : ''}`,
            type: 'info',
            timeout: 5000,
          });
        }
        
        previousUnreadCount = unreadMessagesCount;
        unreadMessagesCount = newCount;
      }
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    }
  }

  // Initial data loading handler
  function loadInitialData() {
    return Promise.all([
      fetchDashboardStats(),
      fetchRequests(),
      fetchLockers(),
      fetchUsers(),
      fetchSubscriptionTypes(),
      fetchAccessHistory(),
      fetchUnreadMessagesCount(),
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
      case "sales":
        return fetchTransactions?.() || Promise.resolve(); // Optional chaining in case not implemented
      case "messages":
        return fetchUnreadMessagesCount();
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

  // Set up a periodic check for unread messages (every 30 seconds)
  let checkInterval: NodeJS.Timeout;
  
  onMount(() => {
    // Check for unread messages every 30 seconds
    checkInterval = setInterval(fetchUnreadMessagesCount, 30000);
    
    return () => {
      // Clear interval on component destroy
      clearInterval(checkInterval);
    };
  });
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

      <TabItem title="Sales Report" id="sales" class="text-xs sm:text-sm md:text-base">
        <div class="p-1 sm:p-2 md:p-4">
          <SalesTab />
        </div>
      </TabItem>

      <TabItem title={`Messages ${unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}`} id="messages" class="text-xs sm:text-sm md:text-base">
        <div class="p-1 sm:p-2 md:p-4">
          <MessagesTab />
        </div>
      </TabItem>
    </Tabs>
  </div>
</DashboardLayout>
