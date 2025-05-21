<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { PurchaseOrder } from '../data/schema'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { purchaseOrderSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<PurchaseOrder>
}
const props = defineProps<DataTableRowActionsProps>()

const router = useRouter()
const workorder = computed(() => purchaseOrderSchema.parse(props.row.original))

function onViewClick() {
  console.log('View button clicked, workorder id:', workorder.value.id)
  router.push(`/trx/purchase-order/views/${workorder.value.id}`)
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
      <DropdownMenuItem>
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
