<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Jabatan } from '../../../types/schema'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import JabatanFormModal from './JabatanFormModal.vue'

interface DataTableViewOptionsProps {
  table: Table<Jabatan>
}

const props = defineProps<DataTableViewOptionsProps>()

const columns = computed(() =>
  props.table.getAllColumns().filter(
    column => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ),
)

const router = useRouter()
const isAddModalOpen = ref(false)

function handleAddNew() {
  // Open the modal instead of navigation
  isAddModalOpen.value = true
}

// Handle form submission
function handleFormSubmit(data: Partial<Jabatan>) {
  // Close the modal
  isAddModalOpen.value = false

  // Emit an event to refresh the table data
  emit('refresh')
}

// Define emits
const emit = defineEmits(['refresh'])
</script>

<template>
  <div class="ml-auto flex gap-2 items-center">
    <!-- Tombol Add New -->
    <Button
      variant="default"
      size="sm"
      class="h-8"
      @click="handleAddNew"
    >
      <Icon name="i-lucide-plus" class="mr-2 h-4 w-4" />
      Add New
    </Button>

    <!-- Tombol View (dropdown) -->
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

    <!-- Add Branch Modal -->
    <JabatanFormModal
      v-model:open="isAddModalOpen"
      @submit="handleFormSubmit"
    />
  </div>
</template>
