<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { RoleWithPermission } from '~/types/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface DataTableViewOptionsProps {
  table: Table<RoleWithPermission>
}

const props = defineProps<DataTableViewOptionsProps>()

const router = useRouter()

const columns = computed(() =>
  props.table.getAllColumns().filter(
    column => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ),
)

function handleAddNew() {
  router.push('/settings/role-permission/create')
}
</script>

<template>
  <div class="ml-auto flex gap-2 items-center">
    <Button
      variant="default"
      size="sm"
      class="h-8"
      @click="handleAddNew"
    >
      <Icon name="i-lucide-plus" class="mr-2 h-4 w-4" />
      Add New
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          size="sm"
          class="h-8"
        >
          <Icon name="i-radix-icons-mixer-horizontal" class="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          v-for="column in columns"
          :key="column.id"
          class="capitalize"
          :checked="column.getIsVisible()"
          @update:checked="(value) => column.toggleVisibility(!!value)"
        >
          {{ column.id }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
