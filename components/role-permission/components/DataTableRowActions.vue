<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { RoleWithPermission } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useRolePermission } from '~/composables/useRolePermission'

interface DataTableRowActionsProps {
  row: Row<RoleWithPermission>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['deleteSuccess'])

const rolePermission = computed(() => props.row.original)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

const { toast } = useToast()
const { remove } = useRolePermission()

const handleDelete = async () => {
  if (!rolePermission.value?.id) {
    toast({
      title: 'Invalid Data',
      description: 'ID role-permission tidak ditemukan.',
      variant: 'destructive',
    })
    return
  }

  try {
    isDeleting.value = true
    await remove(rolePermission.value.id)
    toast({
      title: 'Deleted',
      description: `Permission module berhasil dihapus.`,
      variant: 'success',
    })

    emit('deleteSuccess')
    console.log('[RolePermission] deleteSuccess emitted')
  }
  catch (error: any) {
    toast({
      title: 'Delete Failed',
      description: error?.message || 'Terjadi kesalahan saat menghapus role-permission.',
      variant: 'destructive',
    })
  }
  finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
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
      <DropdownMenuItem @click="showDeleteDialog = true" class="text-red-500">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus Role-Permission</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menghapus permission ini dari role tersebut?
        </DialogDescription>
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
</template>
