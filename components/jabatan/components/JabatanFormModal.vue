<script setup lang="ts">
import type { Jabatan } from '~/types/schema'
import { reactive, ref, watch } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useJabatan } from '~/composables/useJabatan' // pastikan path sesuai

interface JabatanFormModalProps {
  open: boolean
  jabatan?: Partial<Jabatan>
}

const props = withDefaults(defineProps<JabatanFormModalProps>(), {
  jabatan: () => ({}),
})

const emit = defineEmits(['update:open', 'submit'])

const { toast } = useToast()
const { createOrUpdateJabatan } = useJabatan()

const form = reactive({
  name: '',
  jabatanCode: '',
  description: '',
  status: true,
})

const errors = ref({
  name: '',
  description: '',
})

// Update form ketika `props.jabatan` berubah
watch(
  () => props.jabatan,
  (newJabatan) => {
    form.name = newJabatan?.name || ''
    form.jabatanCode = newJabatan?.jabatanCode || ''
    form.description = newJabatan?.description || ''
    form.status = newJabatan?.status !== undefined ? newJabatan.status : true
  },
  { immediate: true },
)

const handleSubmit = async () => {
  // Validasi manual
  errors.value = { name: '', description: '' }
  let isValid = true

  if (!form.name) {
    errors.value.name = 'Jabatan name is required'
    isValid = false
  }
  if (!form.description) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  if (!isValid) return

  try {
    const isEdit = !!props.jabatan?.id

    // Server-only fetch (e.g., in a server API route or plugin)
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.API_BASE_URL}/jabatan${isEdit ? `/${props.jabatan.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      body: form,
      headers: {
        Authorization: useRuntimeConfig().public.API_TOKEN,
      },
    })

    emit('submit', response) // biar parent reload
    emit('update:open', false)
    resetForm()

    toast({
      title: isEdit ? 'Jabatan Updated' : 'Jabatan Created',
      description: `Jabatan "${response.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
      variant: 'success',
    })
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error?.data?.message || error.message || 'Unexpected error occurred.',
      variant: 'destructive',
    })
  }
}

const resetForm = () => {
  form.name = ''
  form.jabatanCode = ''
  form.description = ''
  form.status = true
}

const handleOpenChange = (val: boolean) => {
  emit('update:open', val)
  if (!val) resetForm()
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ props.jabatan?.id ? 'Edit Jabatan' : 'Add New Jabatan' }}</DialogTitle>
        <DialogDescription>
          {{ props.jabatan?.id ? 'Update jabatan information.' : 'Fill in the details to create a new jabatan.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Jabatan Name</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Enter jabatan name"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="Enter description"
            :class="{ 'border-red-500': errors.description }"
          />
          <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
        </div>

        <div class="flex items-center space-x-2">
          <Switch id="status" v-model="form.status" />
          <Label for="status">Active</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit">{{ props.jabatan?.id ? 'Update' : 'Create' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
