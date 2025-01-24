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