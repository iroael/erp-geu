<script setup lang="ts">
import type { Branch } from '@/types/schema'
import { reactive, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useBranch } from '@/composables/useBranch'

interface BranchFormModalProps {
  open: boolean
  branch?: Partial<Branch>
}

const props = withDefaults(defineProps<BranchFormModalProps>(), {
  branch: () => ({}),
})
const emit = defineEmits(['update:open', 'submit'])
const { toast } = useToast()
const { createOrUpdateBranch } = useBranch()

const form = reactive<Partial<Branch>>({
  name: '',
  branchCode: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  status: true,
})

const errors = ref<Record<keyof Branch, string>>({
  name: '',
  branchCode: '',
  address: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  status: '',
})

const loading = ref(false)

const resetForm = () => {
  Object.assign(form, {
    name: '',
    branchCode: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    status: true,
  })

  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof Branch] = ''
  })
}

// Update form saat branch berubah (modal dibuka ulang)
watch(
  () => props.branch,
  (newBranch) => {
    Object.assign(form, {
      name: newBranch?.name || '',
      branchCode: newBranch?.branchCode || '',
      address: newBranch?.address || '',
      city: newBranch?.city || '',
      province: newBranch?.province || '',
      phone: newBranch?.phone || '',
      email: newBranch?.email || '',
      status: newBranch?.status ?? true,
    })
    Object.keys(errors.value).forEach((key) => {
      errors.value[key as keyof Branch] = ''
    })
  },
  { immediate: true }
)

const validate = () => {
  let isValid = true
  const requiredFields: (keyof Branch)[] = ['name', 'address', 'city', 'province', 'phone', 'email']

  for (const key of requiredFields) {
    if (!form[key]) {
      errors.value[key] = `${key[0].toUpperCase() + key.slice(1)} is required`
      isValid = false
    } else {
      errors.value[key] = ''
    }
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return
  loading.value = true

  try {
    const payload: Partial<Branch> = {
      ...form,
      id: props.branch?.id,
    }

    const saved = await createOrUpdateBranch(payload)

    emit('submit', saved)
    emit('update:open', false)

    toast({
      title: props.branch?.id ? 'Branch Updated' : 'Branch Created',
      description: `Branch "${saved.name}" has been ${props.branch?.id ? 'updated' : 'created'} successfully.`,
      variant: 'success',
    })
  } catch (err: any) {
    toast({
      title: 'Error',
      description: err?.message || 'An unexpected error occurred.',
      variant: 'destructive',
    })
    console.error(err)
  } finally {
    loading.value = false
  }
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
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit">
            {{ props.branch?.id ? 'Update' : 'Create' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
