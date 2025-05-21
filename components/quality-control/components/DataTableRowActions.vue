<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { QCHeader } from '../data/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { qcHeaderSchema } from '../data/schema'

// Props
interface DataTableRowActionsProps {
  row: Row<QCHeader>
}
const props = defineProps<DataTableRowActionsProps>()

// Emits (opsional)
const emit = defineEmits<{
  (e: 'view', payload: QCHeader): void
  (e: 'delete', id: number): void
}>()

const router = useRouter()

// Validate row data using schema
const qc = computed(() => {
  try {
    return qcHeaderSchema.parse(props.row.original)
  } catch (error) {
    console.error('Invalid quality control row data:', error)
    return null
  }
})

// Navigasi ke halaman detail
function onViewClick() {
  console.log('View button clicked, quality control id:', qc.value?.id)
  if (!qc.value) return
  emit('view', qc.value)
  router.push(`/warehouse/quality-control/views/${qc.value.id}`)
}

// Konfirmasi dan emit delete
function onDeleteClick() {
  if (!qc.value) return
  const confirmDelete = confirm(
    `Yakin ingin menghapus Quality Control: ${qc.value.qc_code}?`
  )
  if (confirmDelete) {
    emit('delete', qc.value.id)
    // Tambahkan logika API call delete di sini jika perlu
    console.log('Deleted QC ID:', qc.value.id)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem @click="onViewClick">View</DropdownMenuItem>
      <DropdownMenuItem @click="onDeleteClick">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
