<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Permission } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { usePermission } from '~/composables/usePermission' // misal ada composable khusus permission
import { permissionSchema } from '~/types/schema'
import PermissionFormModal from './PermissionFormModal.vue'

interface DataTableRowActionsProps {
  row: Row<Permission>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['deleteSuccess', 'editSuccess'])

// Parsing row data as Permission type
const permission = computed(() => permissionSchema.parse(props.row.original))

const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const isDeleting = ref(false)

const { toast } = useToast()
const { deletePermission } = usePermission()

const handleDelete = async () => {
  try {
    isDeleting.value = true
    await deletePermission(permission.value.id)

    toast({
      title: 'Deleted',
      description: `Permission pada module "${permission.value.module_code}" berhasil dihapus.`,
      variant: 'success',
    })

    emit('deleteSuccess')
  }
  catch (error: any) {
    toast({
      title: 'Delete Failed',
      description: error?.message || 'Terjadi kesalahan saat menghapus permission.',
      variant: 'destructive',
    })
  }
  finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

const handleEditSuccess = (updatedPermission: Permission) => {
  toast({
    title: 'Updated',
    description: `Permission pada module "${updatedPermission.module_code}" berhasil diperbarui.`,
    variant: 'success',
  })
  showEditModal.value = false
  emit('editSuccess', updatedPermission)
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
        <DialogTitle>Hapus Permission</DialogTitle>
        <DialogDescription>Apakah Anda yakin ingin menghapus permission ini?</DialogDescription>
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
  <PermissionFormModal
    v-if="showEditModal"
    :open="showEditModal"
    :permission="permission"
    @update:open="showEditModal = $event"
    @submit="handleEditSuccess"
  />
</template>
