<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Jabatan } from '~/types/schema'
import { computed, ref } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useJabatan } from '~/composables/useJabatan'
import { jabatanSchema } from '~/types/schema'
import JabatanFormModal from './JabatanFormModal.vue'

interface DataTableRowActionsProps {
  row: Row<Jabatan>
}

const props = defineProps<DataTableRowActionsProps>()
const emit = defineEmits(['deleteSuccess', 'editSuccess'])

const jabatan = computed(() => jabatanSchema.parse(props.row.original))
const showDeleteDialog = ref(false)
const showEditModal = ref(false)
const isDeleting = ref(false)
const { toast } = useToast()
const { deleteJabatan } = useJabatan()

const handleDelete = async () => {
  try {
    isDeleting.value = true
    await deleteJabatan(jabatan.value.id)

    toast({
      title: 'Deleted',
      description: `Jabatan "${jabatan.value.name}" berhasil dihapus.`,
      variant: 'success',
    })

    emit('deleteSuccess') // 🔥 Trigger ke parent untuk refresh
  } catch (error: any) {
    toast({
      title: 'Delete Failed',
      description: error?.message || 'Terjadi kesalahan saat menghapus.',
      variant: 'destructive',
    })
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

const handleEditSuccess = (updatedJabatan: Jabatan) => {
  toast({
    title: 'Updated',
    description: `Jabatan "${updatedJabatan.name}" berhasil diperbarui.`,
    variant: 'success',
  })
  showEditModal.value = false
  emit('editSuccess', updatedJabatan)
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
        <DialogTitle>Hapus Jabatan</DialogTitle>
        <DialogDescription>Apakah Anda yakin ingin menghapus jabatan ini?</DialogDescription>
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
  <JabatanFormModal
    v-if="showEditModal"
    :open="showEditModal"
    :jabatan="jabatan"
    @update:open="showEditModal = $event"
    @submit="handleEditSuccess"
  />
</template>
