<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useToast } from '~/components/ui/toast'

interface PermissionFormModalProps {
  open: boolean
  permission?: Partial<{
    id: number
    module_code: string
    can_create: boolean
    can_read: boolean
    can_update: boolean
    can_delete: boolean
  }>
}

const props = withDefaults(defineProps<PermissionFormModalProps>(), {
  permission: () => ({}),
})

const emit = defineEmits(['update:open', 'submit'])

const { toast } = useToast()

const modules = [
  { label: 'Work Order', value: 'work_order' },
  { label: 'Purchase Order', value: 'purchase_order' },
  { label: 'Surat Jalan', value: 'surat_jalan' },
  { label: 'Uji Quality', value: 'uji_quality' },
  { label: 'Inventory In Stock', value: 'inventory_in_stock' },
  { label: 'Inventory Out Stock', value: 'inventory_out_stock' },
]

const form = reactive({
  module_code: '',
  can_create: false,
  can_read: true,
  can_update: false,
  can_delete: false,
})

const errors = ref({
  module_code: '',
})

watch(
  () => props.permission,
  (newPerm) => {
    form.module_code = newPerm?.module_code || ''
    form.can_create = !!newPerm?.can_create
    form.can_read = !!newPerm?.can_read
    form.can_update = !!newPerm?.can_update
    form.can_delete = !!newPerm?.can_delete
  },
  { immediate: true },
)

const resetForm = () => {
  form.module_code = ''
  form.can_create = false
  form.can_read = true
  form.can_update = false
  form.can_delete = false
  errors.value.module_code = ''
}

const handleSubmit = async () => {
  errors.value.module_code = ''
  if (!form.module_code) {
    errors.value.module_code = 'Module is required'
    return
  }

  try {
    const isEdit = !!props.permission?.id
    const config = useRuntimeConfig()

    console.log('Submitting payload:', JSON.stringify(form)) // 👈 debug log

    const response = await $fetch(`${config.public.API_BASE_URL}/permissions${isEdit ? `/${props.permission.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      body: form,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    emit('submit', response)
    emit('update:open', false)
    resetForm()

    toast({
      title: isEdit ? 'Permission Updated' : 'Permission Created',
      description: `Permission for module "${response.module_code}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
      variant: 'success',
    })
  }
  catch (error: any) {
    toast({
      title: 'Error',
      description: error?.data?.message || error.message || 'Unexpected error occurred.',
      variant: 'destructive',
    })
  }
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
        <DialogTitle>{{ props.permission?.id ? 'Edit Permission' : 'Add New Permission' }}</DialogTitle>
        <DialogDescription>
          {{ props.permission?.id ? 'Update permission details.' : 'Fill in the details to create a new permission.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="module_code">Module</Label>
          <select
            id="module_code"
            v-model="form.module_code"
            class="w-full border rounded px-3 py-2"
            :class="{ 'border-red-500': errors.module_code }"
          >
            <option disabled value="">Select module</option>
            <option
              v-for="module in modules"
              :key="module.value"
              :value="module.value"
            >
              {{ module.label }}
            </option>
          </select>
          <p v-if="errors.module_code" class="text-sm text-red-500">{{ errors.module_code }}</p>
        </div>

        <div class="flex items-center space-x-2">
          <input type="checkbox" id="can_create" v-model="form.can_create" />
          <label for="can_create">Can Create</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="can_read" v-model="form.can_read" />
          <label for="can_read">Can Read</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="can_update" v-model="form.can_update" />
          <label for="can_update">Can Update</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="can_delete" v-model="form.can_delete" />
          <label for="can_delete">Can Delete</label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit">{{ props.permission?.id ? 'Update' : 'Create' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
