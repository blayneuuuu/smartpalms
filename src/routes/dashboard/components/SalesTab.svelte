<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Badge,
    Button,
    Alert,
    Spinner,
    Input,
    Label,
    Card,
    Select,
  } from "flowbite-svelte";
  import {formatDate, formatTimestamp} from "$lib/utils/date";
  import Chart from "chart.js/auto";
  import {onMount} from "svelte";
  // Import html2pdf conditionally to avoid SSR issues
  import {browser} from '$app/environment';
  let html2pdf: any;
  
  let transactions = $state<any[]>([]);
  let stats = $state<{
    total: number;
    success: number;
    failed: number;
    pending: number;
    totalAmount: number;
  }>({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    totalAmount: 0,
  });
  let chartData = $state<{month: string; count: number; amount: number}[]>([]);
  
  let loading = $state(false);
  let error = $state<string | null>(null);
  let generatingPdf = $state(false);
  
  // Filter states
  let startDate = $state("");
  let endDate = $state("");
  let statusFilter = $state("all");
  
  // Chart reference
  let salesChartCanvas: HTMLCanvasElement;
  let salesChart: Chart | null = null;
  let reportContainer: HTMLDivElement;
  
  onMount(async () => {
    // Import html2pdf dynamically only in the browser
    if (browser) {
      html2pdf = (await import('html2pdf.js')).default;
    }
    
    fetchTransactions();
  });
  
  async function fetchTransactions() {
    loading = true;
    error = null;
    
    try {
      // Build URL with query params
      let url = "/api/admin/transactions";
      const params = new URLSearchParams();
      
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch transactions");
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch transactions");
      }
      
      transactions = data.transactions;
      stats = data.stats;
      chartData = data.chartData;
      
      // Update the chart
      updateChart();
    } catch (err) {
      console.error("Error fetching transactions:", err);
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }
  
  function updateChart() {
    if (!salesChartCanvas) return;
    
    // Destroy previous chart instance if it exists
    if (salesChart) {
      salesChart.destroy();
    }
    
    const ctx = salesChartCanvas.getContext("2d");
    if (!ctx) return;
    
    const months = chartData.map(d => d.month);
    const amounts = chartData.map(d => d.amount);
    const counts = chartData.map(d => d.count);
    
    salesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Total Sales (PHP)",
            data: amounts,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgb(53, 162, 235)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Number of Transactions",
            data: counts,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
            type: "line",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Amount (PHP)",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: "Number of Transactions",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    });
  }
  
  function resetFilters() {
    startDate = "";
    endDate = "";
    statusFilter = "all";
    fetchTransactions();
  }
  
  function exportCSV() {
    if (!transactions.length) return;
    
    // Create CSV content
    const headers = ["ID", "Date", "User", "Amount", "Status", "Subscription"];
    
    const rows = transactions.map(t => [
      t.id,
      formatTimestamp(t.createdAt),
      t.userName,
      t.amount,
      t.status,
      t.subscriptionName || "N/A",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");
    
    // Create a download link
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  async function generatePDF() {
    if (!transactions.length) return;
    
    generatingPdf = true;
    
    try {
      // Wait for chart to redraw
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a title with date range
      let title = "SmartPalms Sales Report";
      if (startDate && endDate) {
        title += ` (${startDate} to ${endDate})`;
      } else if (startDate) {
        title += ` (from ${startDate})`;
      } else if (endDate) {
        title += ` (until ${endDate})`;
      }
      
      // Get current date for the report
      const today = new Date().toLocaleDateString();
      
      // Configure PDF options
      const options = {
        margin: 10,
        filename: `smartpalms_sales_report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Create a clone of the report section for PDF generation
      const reportClone = reportContainer.cloneNode(true) as HTMLElement;
      
      // Add report header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; color: #333;">${title}</h1>
          <p style="font-size: 14px; color: #666;">Generated on ${today}</p>
        </div>
      `;
      reportClone.prepend(header);
      
      // Add a summary section
      const summary = document.createElement('div');
      summary.innerHTML = `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px; font-weight: bold;">Total Transactions:</td>
              <td style="padding: 5px;">${stats.total}</td>
              <td style="padding: 5px; font-weight: bold;">Successful:</td>
              <td style="padding: 5px;">${stats.success}</td>
            </tr>
            <tr>
              <td style="padding: 5px; font-weight: bold;">Pending:</td>
              <td style="padding: 5px;">${stats.pending}</td>
              <td style="padding: 5px; font-weight: bold;">Failed:</td>
              <td style="padding: 5px;">${stats.failed}</td>
            </tr>
            <tr>
              <td style="padding: 5px; font-weight: bold;">Total Sales:</td>
              <td style="padding: 5px;" colspan="3">₱ ${stats.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      `;
      reportClone.children[0].insertAdjacentElement('afterend', summary);
      
      // Generate and download the PDF
      await html2pdf().from(reportClone).set(options).save();
      
    } catch (err) {
      console.error("Error generating PDF:", err);
      error = "Failed to generate PDF report";
    } finally {
      generatingPdf = false;
    }
  }
  
  function formatAmount(amount: string): string {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  }
  
  // Add this improved date formatting function to handle invalid dates
  function safeFormatTimestamp(timestamp: any): string {
    if (!timestamp) return "N/A";
    
    try {
      // For numeric timestamps (Unix seconds)
      if (typeof timestamp === 'number') {
        return new Date(timestamp * 1000).toLocaleString();
      }
      
      // For ISO strings or other string formats
      if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
        return date.toLocaleString();
      }
      
      return "Invalid Date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }
  
  // Export as PDF
  async function exportPDF() {
    if (!transactions.length) return;
    if (!browser || !html2pdf) {
      console.error("html2pdf is not available");
      return;
    }
    
    try {
      generatingPdf = true;
      const element = reportContainer;
      const opt = {
        margin: 1,
        filename: `sales_report_${formatDate(new Date())}.pdf`,
        image: {type: "jpeg", quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: {unit: "in", format: "letter", orientation: "portrait"},
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      generatingPdf = false;
    }
  }
</script>

<div class="space-y-6" bind:this={reportContainer}>
  <!-- Error message -->
  {#if error}
    <Alert color="red" class="mb-4">
      {error}
    </Alert>
  {/if}
  
  <!-- Filter Section -->
  <div class="w-full mb-20">
    <h3 class="text-lg font-semibold mb-4">Filter Transactions</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <Label for="startDate" class="mb-2 block">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          bind:value={startDate}
        />
      </div>
      <div>
        <Label for="endDate" class="mb-2 block">End Date</Label>
        <Input
          id="endDate"
          type="date"
          bind:value={endDate}
        />
      </div>
      <div>
        <Label for="statusFilter" class="mb-2 block">Status</Label>
        <Select
          id="statusFilter"
          bind:value={statusFilter}
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </Select>
      </div>
      <div class="flex items-end gap-2">
        <Button color="blue" class="flex-1" on:click={fetchTransactions}>
          Apply Filters
        </Button>
        <Button color="light" class="flex-1" on:click={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  </div>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Total Transactions -->
    <Card padding="sm">
      <h5 class="text-lg font-bold">Total Transactions</h5>
      <p class="text-3xl font-extrabold">{stats.total}</p>
    </Card>
    
    <!-- Successful Transactions -->
    <Card padding="sm">
      <h5 class="text-lg font-bold text-green-700">Successful</h5>
      <p class="text-3xl font-extrabold text-green-700">{stats.success}</p>
    </Card>
    
    <!-- Pending Transactions -->
    <Card padding="sm">
      <h5 class="text-lg font-bold text-yellow-700">Pending</h5>
      <p class="text-3xl font-extrabold text-yellow-700">{stats.pending}</p>
    </Card>
    
    <!-- Total Sales -->
    <Card padding="sm">
      <h5 class="text-lg font-bold text-blue-700">Total Sales</h5>
      <p class="text-3xl font-extrabold text-blue-700">₱ {stats.totalAmount.toFixed(2)}</p>
    </Card>
  </div>
  
  <!-- Chart -->
  <Card padding="xl">
    <h3 class="text-xl font-bold mb-4">Sales Trend</h3>
    <div class="h-80">
      <canvas bind:this={salesChartCanvas}></canvas>
    </div>
  </Card>
  
  <!-- Table Section with Export -->
  <div class="flex flex-wrap justify-between items-center mb-4 mt-6">
    <h3 class="text-xl font-bold mb-2 md:mb-0">Transaction History</h3>
    <div class="flex flex-wrap gap-2">
      <Button color="green" on:click={exportCSV} disabled={transactions.length === 0}>
        Export to CSV
      </Button>
      <Button color="red" on:click={generatePDF} disabled={transactions.length === 0 || generatingPdf}>
        {#if generatingPdf}
          <Spinner class="mr-2" size="4" />
          Generating...
        {:else}
          Generate PDF Report
        {/if}
      </Button>
    </div>
  </div>
  
  {#if loading}
    <div class="flex justify-center py-8">
      <Spinner size="8" />
    </div>
  {:else if transactions.length === 0}
    <p class="text-gray-600">No transactions found.</p>
  {:else}
    <div class="overflow-x-auto">
      <Table striped={true}>
        <TableHead>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>User</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Subscription</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each transactions as transaction}
            <TableBodyRow>
              <TableBodyCell>{safeFormatTimestamp(transaction.createdAt)}</TableBodyCell>
              <TableBodyCell>{transaction.userName}</TableBodyCell>
              <TableBodyCell>₱ {formatAmount(transaction.amount)}</TableBodyCell>
              <TableBodyCell>
                <Badge
                  color={transaction.status === "success"
                    ? "green"
                    : transaction.status === "pending"
                    ? "yellow"
                    : "red"}
                >
                  {transaction.status}
                </Badge>
              </TableBodyCell>
              <TableBodyCell>{transaction.subscriptionName || "N/A"}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  {/if}
</div> 