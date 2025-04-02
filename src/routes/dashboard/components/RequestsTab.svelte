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
    Modal,
    Label,
    Input,
    Alert,
    Spinner,
  } from "flowbite-svelte";
  import {formatDate} from "$lib/utils/date";
  import {processRequest} from "$lib/services/admin";
  import {requests, loading, errors} from "$lib/stores/admin";

  let showRejectDialog = false;
  let selectedRequestId = "";
  let rejectionReason = "";
  let processingRequest = false;
  let showDetailsDialog = false;
  let selectedRequest: typeof $requests[number] | null = null;

  async function handleApprove(requestId: string) {
    processingRequest = true;
    try {
      await processRequest(requestId, "approve");
    } catch (err) {
      console.error("Error approving request:", err);
    } finally {
      processingRequest = false;
    }
  }

  async function handleReject() {
    if (!rejectionReason) return;
    processingRequest = true;
    try {
      await processRequest(selectedRequestId, "reject", rejectionReason);
      showRejectDialog = false;
      rejectionReason = "";
      if (selectedRequest?.id === selectedRequestId) {
        showDetailsDialog = false;
        selectedRequest = null;
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      processingRequest = false;
    }
  }

  function openRejectDialog(requestId: string) {
    selectedRequestId = requestId;
    showRejectDialog = true;
  }
</script>

{#if $errors.requests}
  <Alert color="red" class="mb-4">
    {$errors.requests}
  </Alert>
{/if}

{#if $loading.requests}
  <div class="flex justify-center py-8">
    <Spinner size="8" />
  </div>
{:else if $requests.length === 0}
  <p class="text-gray-600">No pending requests found.</p>
{:else}
  <Table>
    <TableHead>
      <TableHeadCell>User</TableHeadCell>
      <TableHeadCell>Locker</TableHeadCell>
      <TableHeadCell>Subscription</TableHeadCell>
      <TableHeadCell>Requested At</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
      <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
      {#each $requests as request}
        <TableBodyRow>
          <TableBodyCell>{request.userName}</TableBodyCell>
          <TableBodyCell>
            #{request.lockerNumber} ({request.lockerSize})
          </TableBodyCell>
          <TableBodyCell>{request.subscriptionName}</TableBodyCell>
          <TableBodyCell>{formatDate(request.requestedAt, true)}</TableBodyCell>
          <TableBodyCell>
            <Badge
              color={request.status === "pending"
                ? "yellow"
                : request.status === "approved"
                ? "green"
                : "red"}
            >
              {request.status}
            </Badge>
          </TableBodyCell>
          <TableBodyCell>
            {#if request.status === "pending"}
              <div class="flex space-x-2">
                <Button
                  size="xs"
                  color="green"
                  disabled={processingRequest}
                  on:click={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button
                  size="xs"
                  color="red"
                  disabled={processingRequest}
                  on:click={() => openRejectDialog(request.id)}
                >
                  Reject
                </Button>
              </div>
            {/if}
            
          </TableBodyCell>
          <TableBodyCell>
            <Button
              size="xs"
              color="blue"
              on:click={() => {
                showDetailsDialog = true;
                selectedRequest = request;
              }}
            >
              See Details
            </Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
{/if}

<!-- Reject Dialog -->
<Modal bind:open={showRejectDialog} size="md" autoclose>
  <div class="text-center">
    <h3 class="mb-5 text-lg font-normal text-gray-500">
      Reject Request
    </h3>
  </div>

  <div class="space-y-4">
    <div>
      <Label for="rejectionReason">Reason for Rejection</Label>
      <Input
        id="rejectionReason"
        placeholder="Enter reason for rejection"
        bind:value={rejectionReason}
      />
    </div>
  </div>

  <div class="flex justify-end gap-4 mt-6">
    <Button
      color="alternative"
      disabled={processingRequest}
      on:click={() => {
        showRejectDialog = false;
        rejectionReason = "";
      }}
    >
      Cancel
    </Button>
    <Button
      color="red"
      disabled={!rejectionReason || processingRequest}
      loading={processingRequest}
      on:click={handleReject}
    >
      Reject
    </Button>
  </div>
</Modal>

<!-- Details Dialog -->
<Modal bind:open={showDetailsDialog} size="lg" autoclose>
  {#if selectedRequest}
    <div class="space-y-4">
      <h3 class="text-xl font-semibold">Request Details</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium text-gray-700">User Information</h4>
          <p>Name: {selectedRequest.userName}</p>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-700">Locker Information</h4>
          <p>Number: #{selectedRequest.lockerNumber}</p>
          <p>Size: {selectedRequest.lockerSize}</p>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-700">Subscription</h4>
          <p>{selectedRequest.subscriptionName}</p>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-700">Status</h4>
          <Badge
            color={selectedRequest.status === "pending"
              ? "yellow"
              : selectedRequest.status === "approved"
              ? "green"
              : "red"}
          >
            {selectedRequest.status}
          </Badge>
        </div>
      </div>

      {#if selectedRequest.proofOfPayment}
        <div>
          <h4 class="font-medium text-gray-700 mb-5">Proof of Payment</h4>
          <img
            src={`data:image/jpeg;base64,${selectedRequest.proofOfPayment}`}
            alt="Proof of Payment"
            class="mx-auto max-w-lg h-auto rounded-lg"
          />
        </div>
      {/if}

      {#if selectedRequest.status === "rejected" && selectedRequest.rejectionReason}
        <div>
          <h4 class="font-medium text-gray-700">Rejection Reason</h4>
          <p class="text-red-600">{selectedRequest.rejectionReason}</p>
        </div>
      {/if}
    </div>
  {/if}

  <div class="flex justify-end mt-6">
    <Button color="alternative" on:click={() => showDetailsDialog = false}>
      Close
    </Button>
  </div>
</Modal> 