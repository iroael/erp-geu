<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import type { Jabatan } from '~/types/schema'
import { valueUpdater } from '@/lib/utils'
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import DataTablePagination from './DataTablePagination.vue'
import DataTableToolbar from './DataTableToolbar.vue'

interface DataTableProps {
  columns: ColumnDef<Jabatan, any>[]
  data: Jabatan[]
  totalRows: number
  pageIndex: number
  pageSize: number
}

const props = defineProps<DataTableProps>()
const emit = defineEmits(['update:page-index', 'update:page-size', 'refresh'])

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const pagination = ref<PaginationState>({
  pageIndex: props.pageIndex,
  pageSize: props.pageSize,
})

// Sync incoming prop changes
watch(() => props.pageIndex, val => pagination.value.pageIndex = val)
watch(() => props.pageSize, val => pagination.value.pageSize = val)

// Emit pagination changes
watch(() => pagination.value.pageIndex, val => emit('update:page-index', val))
watch(() => pagination.value.pageSize, val => emit('update:page-size', val))

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get pagination() { return pagination.value },
  },
  manualPagination: true,
  get pageCount() {
    return Math.ceil(props.totalRows / pagination.value.pageSize)
  },
  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onPaginationChange: updaterOrValue => valueUpdater(updaterOrValue, pagination),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-150px)] space-y-4"> <!-- Utama container -->
    <DataTableToolbar :table="table" />

    <!-- Table scrollable -->
    <div class="flex-1 overflow-auto border rounded-md">
      <Table class="min-w-full">
        <TableHeader class="sticky top-0 bg-white z-10 shadow">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="props.columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Sticky Pagination -->
    <div class="border-t">
      <DataTablePagination
        :table="table"
        :total-rows="props.totalRows"
        @update:pageIndex="emit('update:page-index', $event)"
        @update:pageSize="emit('update:page-size', $event)"
      />
    </div>
  </div>
</template>
