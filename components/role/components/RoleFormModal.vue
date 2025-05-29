<script setup lang="ts">
import type { Role } from '~/types/schema'
import { reactive, ref, watch } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useRole } from '~/composables/useRole'

interface RoleFormModalProps {
  open: boolean
  role?: Partial<Role>
}

const props = withDefaults(defineProps<RoleFormModalProps>(), {
  role: () => ({}),
})

const emit = defineEmits(['update:open', 'submit'])

const { toast } = useToast()
const { createOrUpdateRole } = useRole()

const form = reactive({
  name: '',
  description: '',
  status: true,
})

const errors = ref({
  name: '',
  description: '',
})

watch(
  () => props.role,
  (newRole) => {
    form.name = newRole?.name || ''
    form.description = newRole?.description || ''
    form.status = newRole?.status !== undefined ? newRole.status : true
  },
  { immediate: true },
)

const handleSubmit = async () => {
  errors.value = { name: '', description: '' }
  let isValid = true

  if (!form.name) {
    errors.value.name = 'Role name is required'
    isValid = false
  }
  if (!form.description) {
    errors.value.description = 'Description is required'
    isValid = false
  }

  if (!isValid)
    return

  try {
    const isEdit = !!props.role?.id
    const config = useRuntimeConfig()

    const response = await $fetch(`${config.public.API_BASE_URL}/roles${isEdit ? `/${props.role.id}` : ''}`, {
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
      title: isEdit ? 'Role Updated' : 'Role Created',
      description: `Role "${response.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
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
        <DialogTitle>{{ props.role?.id ? 'Edit Role' : 'Add New Role' }}</DialogTitle>
        <DialogDescription>
          {{ props.role?.id ? 'Update role information.' : 'Fill in the details to create a new role.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Role Name</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Enter role name"
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
          <Button type="submit">{{ props.role?.id ? 'Update' : 'Create' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>