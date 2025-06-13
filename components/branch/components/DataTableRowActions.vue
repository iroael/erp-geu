
// components/branch/components/DataTableRowActions.vue
<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Branch } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useBranch } from '~/composables/useBranch'
import { branchSchema } from '~/types/schema'
import BranchFormModal from './BranchFormModal.vue'

interface DataTableRowActionsProps {
  row: Row<Branch>
}

const props = defineProps<DataTableRowActionsProps>()
const emits = defineEmits<{
  deleteSuccess: [id: number]
  editSuccess: [branch: Branch]
}>()

// Computed properties
const branch = computed(() => {
  try {
    return branchSchema.parse(props.row.original)
  } catch (error) {
    console.error('Failed to parse branch data:', error)
    return props.row.original as Branch
  }
})

// State
const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const isDeleting = ref(false)

// Composables
const { toast } = useToast()
const { deleteBranch, isSubmitting } = useBranch()

// Event handlers
const handleDelete = async () => {
  if (!branch.value?.id) {
    toast({
      title: 'Error',
      description: 'Invalid branch data',
      variant: 'destructive',
    })
    return
  }

  try {
    isDeleting.value = true
    
    const success = await deleteBranch(branch.value.id)
    
    if (success) {
      showDeleteDialog.value = false
      toast({
        title: 'Branch deleted',
        description: `Branch "${branch.value.name}" has been deleted successfully.`,
        variant: 'default',
      })
      
      emits('deleteSuccess', branch.value.id)
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    toast({
      title: 'Delete failed',
      description: error?.message || 'There was an error deleting the branch. Please try again.',
      variant: 'destructive',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleEditSuccess = (updatedBranch: Branch) => {
  toast({
    title: 'Branch updated',
    description: `Branch "${updatedBranch.name}" has been updated successfully.`,
    variant: 'default',
  })
  showEditModal.value = false
  emits('editSuccess', updatedBranch)
}

const handleCreateSuccess = (createdBranch: Branch) => {
  toast({
    title: 'Branch created',
    description: `Branch "${createdBranch.name}" has been created successfully.`,
    variant: 'default',
  })
  showEditModal.value = false
  emits('editSuccess', createdBranch)
}

const handleFormSubmit = (branch: Branch) => {
  // Check if it's create or update based on whether the original branch had an ID
  if (props.row.original.id) {
    handleEditSuccess(branch)
  } else {
    handleCreateSuccess(branch)
  }
}

const handleCloseEditModal = () => {
  showEditModal.value = false
}

// Computed for loading state
const isLoading = computed(() => isDeleting.value || isSubmitting.value)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
        :disabled="isLoading"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem :disabled="isLoading" @click="showEditModal = true">
        <Icon name="i-lucide-edit" class="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-red-600 focus:text-red-600 focus:bg-red-50"
        :disabled="isLoading"
        @click="showDeleteDialog = true"
      >
        <Icon name="i-lucide-trash-2" class="h-4 w-4 mr-2" />
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Delete Confirmation Dialog -->
  <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Branch</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete the branch 
          <strong>"{{ branch.name }}"</strong>? 
          This action cannot be undone and will permanently remove all branch data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          <Icon
            v-if="isDeleting"
            name="i-lucide-loader-2"
            class="h-4 w-4 mr-2 animate-spin"
          />
          {{ isDeleting ? 'Deleting...' : 'Delete Branch' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <!-- Edit Branch Modal -->
  <BranchFormModal
    v-if="showEditModal"
    v-model:open="showEditModal"
    :branch="branch"
    @submit="handleFormSubmit"
    @close="handleCloseEditModal"
  />
</template>