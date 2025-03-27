<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Spinner,
  } from "flowbite-svelte";
  
  type RowData = Record<string, unknown>;
  
  type Column = {
    key: string;
    label: string;
    sortable?: boolean;
    class?: string;
    formatter?: (value: unknown, row: RowData) => string;
    hidden?: boolean;
  };
  
  export let columns: Column[] = [];
  export let data: RowData[] = [];
  export let loading = false;
  export let striped = true;
  export let hoverable = true;
  export let emptyMessage = "No data available";
  export let sortKey = "";
  export let sortOrder: "asc" | "desc" = "asc";
  
  export const setSorting = (key: string) => {
    if (sortKey === key) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortOrder = "asc";
    }
    
    dispatch("sort", { key: sortKey, order: sortOrder });
  };
  
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  
  $: visibleColumns = columns.filter(col => !col.hidden);
  
  function getCellValue(row: RowData, col: Column) {
    const value = row[col.key];
    return col.formatter ? col.formatter(value, row) : value;
  }
  
  function getColumnClass(column: Column) {
    let classes = column.class || "";
    if (column.sortable) {
      classes += " cursor-pointer";
    }
    return classes;
  }
</script>

<div class="overflow-x-auto">
  <Table {striped} {hoverable} class="text-xs sm:text-sm md:text-base">
    <TableHead>
      {#each visibleColumns as column}
        <TableHeadCell 
          class={getColumnClass(column)}
          on:click={() => column.sortable && setSorting(column.key)}
        >
          <div class="flex items-center">
            {column.label}
            {#if column.sortable && sortKey === column.key}
              <span class="ml-1">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            {/if}
          </div>
        </TableHeadCell>
      {/each}
      <slot name="header-actions" />
    </TableHead>
    
    <TableBody>
      {#if loading}
        <TableBodyRow>
          <TableBodyCell colspan={visibleColumns.length + ($$slots["row-actions"] ? 1 : 0)} class="text-center py-8">
            <div class="flex justify-center">
              <Spinner size="8" />
            </div>
          </TableBodyCell>
        </TableBodyRow>
      {:else if data.length === 0}
        <TableBodyRow>
          <TableBodyCell colspan={visibleColumns.length + ($$slots["row-actions"] ? 1 : 0)} class="text-center py-8">
            {emptyMessage}
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        {#each data as row, rowIndex}
          <TableBodyRow on:click={() => dispatch("row-click", { row, index: rowIndex })}>
            {#each visibleColumns as column}
              <TableBodyCell class={column.class || ""}>
                {getCellValue(row, column)}
              </TableBodyCell>
            {/each}
            {#if $$slots["row-actions"]}
              <TableBodyCell>
                <slot name="row-actions" {row} {rowIndex} />
              </TableBodyCell>
            {/if}
          </TableBodyRow>
        {/each}
      {/if}
    </TableBody>
  </Table>
</div> 