<script setup lang="ts">
import type { Warehouse } from '~/types/schema'
import { reactive, ref, watch } from 'vue'
import { useToast } from '~/components/ui/toast'
import { useGudang } from '~/composables/useGudang' // pastikan path sesuai

interface GudangFormModalProps {
  open: boolean
  gudang?: Partial<Warehouse>
}

const props = withDefaults(defineProps<GudangFormModalProps>(), {
  gudang: () => ({}),
})

const emit = defineEmits(['update:open', 'submit'])

const { toast } = useToast()
const { createOrUpdateJGudang } = useGudang()

const form = reactive({
  name: '',
  city: '',
  province: '',
  address: '',
  phone: '',
  status: true,
})

const errors = ref({
  name: '',
  city: '',
  province: '',
  address: '',
  phone: '',
})

// Update form ketika `props.jabatan` berubah
watch(
  () => props.gudang,
  (newGudang) => {
    form.name = newGudang?.name || ''
    form.city = newGudang?.city || ''
    form.province = newGudang?.province || ''
    form.address = newGudang?.address || ''
    form.phone = newGudang?.phone || ''
    form.status = newGudang?.status !== undefined ? newGudang.status : true
  },
  { immediate: true },
)

const handleSubmit = async () => {
  // Validasi manual
  errors.value = { name: '', city: '', province: '', address: '', phone: '' }
  let isValid = true

  if (!form.name) {
    errors.value.name = 'Gudang name is required'
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
  if (!form.address) {
    errors.value.address = 'Address is required'
    isValid = false
  }
  if (!form.phone) {
    errors.value.phone = 'Phone is required'
    isValid = false
  }

  if (!isValid) return

  try {
    const isEdit = !!props.gudang?.id

    const response = await $fetch(`/api/v1/gudang${isEdit ? `/${props.gudang.id}` : ''}`, {
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
      title: isEdit ? 'Gudang Updated' : 'Gudang Created',
      description: `Gudang "${response.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
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
  form.city = ''
  form.province = ''
  form.address = ''
  form.phone = ''
  form.status = true
  errors.value = { name: '', city: '', province: '', address: '', phone: '' }
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
        <div class="space-y-2">
          <Label for="address">Address</Label>
          <Input
            id="address"
            v-model="form.address"
            placeholder="Enter address"
            :class="{ 'border-red-500': errors.address }"
          />
          <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
        </div>
        <div class="space-y-2">
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            v-model="form.phone"
            placeholder="Enter phone number"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
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
