<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Role } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useRole } from '~/composables/useRole'
import { roleSchema } from '~/types/schema'
import RoleFormModal from './RoleFormModal.vue'

interface DataTableRowActionsProps {
  row: Row<Role>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['deleteSuccess', 'editSuccess'])

const role = computed(() => roleSchema.parse(props.row.original))
const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const isDeleting = ref(false)
const { toast } = useToast()
const { deleteRole } = useRole()

const handleDelete = async () => {
  try {
    isDeleting.value = true
    await deleteRole(role.value.id)

    toast({
      title: 'Deleted',
      description: `Role "${role.value.name}" berhasil dihapus.`,
      variant: 'success',
    })

    emit('deleteSuccess')
    console.log('[RolePermission] deleteSuccess emitted')
  }
  catch (error: any) {
    toast({
      title: 'Delete Failed',
      description: error?.message || 'Terjadi kesalahan saat menghapus role.',
      variant: 'destructive',
    })
  }
  finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

const handleEditSuccess = (updatedRole: Role) => {
  toast({
    title: 'Updated',
    description: `Role "${updatedRole.name}" berhasil diperbarui.`,
    variant: 'success',
  })
  showEditModal.value = false
  emit('editSuccess', updatedRole)
  console.log('[RolePermission] editSuccess emitted')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="showEditModal = true">Edit</DropdownMenuItem>
      <DropdownMenuItem @click="showDeleteDialog = true" class="text-red-500">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Delete Dialog -->
  <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus Role</DialogTitle>
        <DialogDescription>Apakah Anda yakin ingin menghapus role ini?</DialogDescription>
      </DialogHeader>
      <div class="flex justify-end gap-2 mt-4">
        <Button variant="outline" @click="showDeleteDialog = false" :disabled="isDeleting">Cancel</Button>
        <Button variant="destructive" @click="handleDelete" :disabled="isDeleting">
          <span v-if="isDeleting" class="flex items-center gap-2">
            <Icon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" /> Menghapus...
          </span>
          <span v-else>Hapus</span>
        </Button>
      </div>
    </DialogContent>
  </Dialog>

  <!-- Edit Modal -->
  <RoleFormModal
    v-if="showEditModal"
    :open="showEditModal"
    :role="role"
    @update:open="showEditModal = $event"
    @submit="handleEditSuccess"
  />
</template>

