<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Branch } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
// Import composable useBranch
import { useBranch } from '~/composables/useBranch'
import { branchSchema } from '~/types/schema'
import BranchFormModal from './BranchFormModal.vue'


interface DataTableRowActionsProps {
  row: Row<Branch>
}

const props = defineProps<DataTableRowActionsProps>()
const emits = defineEmits(['deleteSuccess', 'editSuccess'])

const branch = computed(() => branchSchema.parse(props.row.original))
const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const { toast } = useToast()
const isDeleting = ref(false)

// Panggil useBranch composable
const { deleteBranch } = useBranch()

const handleDelete = async () => {
  try {
    isDeleting.value = true

    // Pakai deleteBranch dari composable (gunakan branch.value.id)
    await deleteBranch(branch.value.id)
    console.log('Branch deleted:', branch.value.id)
    console.log('Name Branch deleted:', branch.value.name)

    showDeleteDialog.value = false
    toast({
      title: 'Branch deleted',
      description: `Branch "${branch.value.name}" has been deleted successfully.`,
      variant: 'success',
    })

    emits('deleteSuccess', branch.value.id)
  }
  catch (error: any) {
    toast({
      title: 'Delete failed',
      description: error?.message || 'There was an error deleting the branch. Please try again.',
      variant: 'destructive',
    })
  }
  finally {
    isDeleting.value = false
  }
}

const handleEditSuccess = (updatedBranch: Branch) => {
  toast({
    title: 'Branch updated',
    description: `Branch "${updatedBranch.name}" has been updated successfully.`,
    variant: 'success',
  })
  showEditModal.value = false
  emits('editSuccess', updatedBranch)
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
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the branch "{{ branch.name }}"? This action cannot be undone.
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

  <!-- Edit Branch Modal -->
  <BranchFormModal
    v-if="showEditModal"
    :open="showEditModal"
    :branch="branch"
    @update:open="showEditModal = $event"
    @submit="handleEditSuccess"
  />
</template>
