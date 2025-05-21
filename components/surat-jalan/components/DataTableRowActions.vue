<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { DeliveryOrder } from '../data/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { deliveryOrderSchema } from '../data/schema'

// Props
interface DataTableRowActionsProps {
  row: Row<DeliveryOrder>
}
const props = defineProps<DataTableRowActionsProps>()

// Emits (opsional)
const emit = defineEmits<{
  (e: 'view', payload: DeliveryOrder): void
  (e: 'delete', id: number): void
}>()

const router = useRouter()

// Validate row data using schema
const suratjalan = computed(() => {
  try {
    return deliveryOrderSchema.parse(props.row.original)
  } catch (error) {
    console.error('Invalid delivery order row data:', error)
    return null
  }
})

// Navigasi ke halaman detail
function onViewClick() {
  console.log('View button clicked, delivery order id:', suratjalan.value?.id)
  if (!suratjalan.value) return
  emit('view', suratjalan.value)
  router.push(`/trx/surat-jalan/views/${suratjalan.value.id}`)
}

// Konfirmasi dan emit delete
function onDeleteClick() {
  if (!suratjalan.value) return
  const confirmDelete = confirm(
    `Yakin ingin menghapus Delivery Order: ${suratjalan.value.do_no}?`
  )
  if (confirmDelete) {
    emit('delete', suratjalan.value.id)
    // Tambahkan logika API call delete di sini jika perlu
    console.log('Deleted DO ID:', suratjalan.value.id)
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
