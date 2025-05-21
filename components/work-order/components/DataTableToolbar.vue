<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { WorkOrder } from '../data/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { statuses } from '../data/data'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface DataTableToolbarProps {
  table: Table<WorkOrder>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const router = useRouter()
function onCreate() {
  router.push('/trx/work-order/create')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter work order..."
        :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('title')?.setFilterValue($event.target.value)"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        title="Status"
        :options="statuses"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon name="i-radix-icons-cross-2" class="ml-2 h-4 w-4" />
      </Button>
    </div>

    <div class="flex items-center space-x-2">
      <Button
        variant="default"
        class="h-8 px-3"
        @click="onCreate"
      >
        <Icon name="i-radix-icons-plus" class="mr-2 h-4 w-4" />
        Create
      </Button>
      <DataTableViewOptions :table="table" />
    </div>
    <!-- <DataTableViewOptions :table="table" /> -->
  </div>
</template>
