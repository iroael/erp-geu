<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Warehouse } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useGudang } from '~/composables/useGudang'
import GudangFormModal from './GudangFormModal.vue'

interface DataTableRowActionsProps {
  row: Row<Warehouse>
}

const props = defineProps<DataTableRowActionsProps>()
const emits = defineEmits(['deleteSuccess', 'editSuccess'])

const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const isDeleting = ref(false)

const { toast } = useToast()
const { deleteGudang } = useGudang()

// Langsung pakai data original dari row (hindari zod parse saat delete)
const gudang = computed(() => props.row.original)

const handleDelete = async () => {
  try {
    isDeleting.value = true
    await deleteGudang(gudang.value.id)

    showDeleteDialog.value = false
    toast({
      title: 'Gudang deleted',
      description: `Gudang "${gudang.value.name}" has been deleted successfully.`,
      variant: 'success',
    })

    emits('deleteSuccess', gudang.value.id)
  } catch (error: any) {
    toast({
      title: 'Delete failed',
      description: error?.message || 'There was an error deleting the gudang. Please try again.',
      variant: 'destructive',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleEditSuccess = (updatedGudang: Warehouse) => {
  toast({
    title: 'Gudang updated',
    description: `Gudang "${updatedGudang.name}" has been updated successfully.`,
    variant: 'success',
  })
  showEditModal.value = false
  emits('editSuccess', updatedGudang)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 flex p-0 data-[state=open]:bg-muted">
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem @click="showEditModal = true">Edit</DropdownMenuItem>
      <DropdownMenuItem @click="showDeleteDialog = true" class="text-red-500 focus:text-red-500">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Delete Confirmation Dialog -->
  <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Gudang</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the warehouse <strong>"{{ gudang.name }}"</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2 justify-end mt-4">
        <Button variant="outline" @click="showDeleteDialog = false" :disabled="isDeleting">
          Cancel
        </Button>
        <Button variant="destructive" @click="handleDelete" :disabled="isDeleting">
          <span v-if="isDeleting" class="flex items-center gap-2">
            <Icon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
            Deleting...
          </span>
          <span v-else>Delete</span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>

  <!-- Edit Gudang Modal -->
  <GudangFormModal
    v-if="showEditModal"
    :open="showEditModal"
    :gudang="gudang"
    @update:open="showEditModal = $event"
    @submit="handleEditSuccess"
  />
</template>
