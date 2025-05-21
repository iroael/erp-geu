<script setup lang="ts">
import type { Branch } from '~/types/schema'
import { reactive, ref, watch } from 'vue'
import { useToast } from '~/components/ui/toast'

interface BranchFormModalProps {
  open: boolean
  branch?: Partial<Branch>
}

const props = withDefaults(defineProps<BranchFormModalProps>(), {
  branch: () => ({}),
})

const emit = defineEmits(['update:open', 'submit'])
const { toast } = useToast()

const form = reactive({
  name: '',
  branchCode: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  status: true,
})

const errors = ref({
  name: '',
  branchCode: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
})

// Watch props.branch to update form fields whenever it changes
watch(
  () => props.branch,
  (newBranch) => {
    form.name = newBranch?.name || ''
    form.branchCode = newBranch?.branchCode || ''
    form.address = newBranch?.address || ''
    form.city = newBranch?.city || ''
    form.province = newBranch?.province || ''
    form.phone = newBranch?.phone || ''
    form.email = newBranch?.email || ''
    form.status = newBranch?.status !== undefined ? newBranch.status : true
  },
  { immediate: true }
)

const handleSubmit = async () => {
  errors.value = {
    name: '',
    branchCode: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
  }

  let isValid = true
  if (!form.name) {
    errors.value.name = 'Branch name is required'
    isValid = false
  }
  if (!form.address) {
    errors.value.address = 'Address is required'
    isValid = false
  }
  if (!form.city) {
    errors.value.city = 'City is required'
    isValid = false
  }
  if (!form.province) {
    errors.value.province = 'Province is required'
    isValid = false
  }
  if (!form.phone) {
    errors.value.phone = 'Phone number is required'
    isValid = false
  }
  if (!form.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!isValid) return

  try {
    const isEdit = !!props.branch?.id
    const url = isEdit
      ? `http://localhost:5001/api/v1/branch/${props.branch.id}`
      : 'http://localhost:5001/api/v1/branch'

    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiam9obmRvZSIsImlhdCI6MTc0NzM5MTM0MCwiZXhwIjoxNzQ3NDc3NzQwfQ.jnd56fk5PGB45VgkTCVfLtLkuHAxRv-YVWPBKf1SywY',
      },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      let message = isEdit ? 'Failed to update branch' : 'Failed to create branch'
      try {
        const errorData = await response.json()
        message = errorData.message || message
      }
      catch {
        if (response.status === 401) 
          message = 'Unauthorized. Please log in again.'
        else if (response.status === 404) 
          message = 'Branch not found.'
        else if (response.status === 500) 
          message = 'Internal server error. Please try again later.'
        else
          message = `Request failed with status ${response.status}`
      }

      toast({
        title: isEdit ? 'Update failed' : 'Creation failed',
        description: message,
        variant: 'destructive',
      })

      return
    }

    const data = await response.json()
    emit('submit', data)
    emit('update:open', false)
    resetForm()

    toast({
      title: isEdit ? 'Branch Updated' : 'Branch Created',
      description: `Branch "${data.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
      variant: 'success',
    })
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      variant: 'destructive',
    })
    console.error('Error:', error)
  }
}

const resetForm = () => {
  form.name = ''
  form.branchCode = ''
  form.address = ''
  form.city = ''
  form.province = ''
  form.phone = ''
  form.email = ''
  form.status = true
}

const handleOpenChange = (open: boolean) => {
  emit('update:open', open)
  if (!open) {
    resetForm()
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ props.branch?.id ? 'Edit Branch' : 'Add New Branch' }}</DialogTitle>
        <DialogDescription>
          {{ props.branch?.id ? 'Update branch information.' : 'Fill in the details to create a new branch.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Branch Name</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Enter branch name"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <div class="space-y-2">
          <Label for="address">Address</Label>
          <Textarea
            id="address"
            v-model="form.address"
            placeholder="Enter address"
            :class="{ 'border-red-500': errors.address }"
          />
          <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="city">City</Label>
            <Input
              id="city"
              v-model="form.city"
              placeholder="Enter city"
              :class="{ 'border-red-500': errors.city }"
            />
            <p v-if="errors.city" class="text-sm text-red-500">{{ errors.city }}</p>
          </div>

          <div class="space-y-2">
            <Label for="province">Province</Label>
            <Input
              id="province"
              v-model="form.province"
              placeholder="Enter province"
              :class="{ 'border-red-500': errors.province }"
            />
            <p v-if="errors.province" class="text-sm text-red-500">{{ errors.province }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              v-model="form.phone"
              placeholder="Enter phone number"
              :class="{ 'border-red-500': errors.phone }"
            />
            <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              placeholder="Enter email address"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Switch id="status" v-model="form.status" />
          <Label for="status">Active</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
          <Button type="submit">{{ props.branch?.id ? 'Update' : 'Create' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
