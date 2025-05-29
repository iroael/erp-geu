<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from '~/components/ui/toast'
import { useUsers } from '~/composables/useUsers'
import { useRoute } from 'vue-router'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

// Role map for internal ID
const roleMap: Record<string, number> = {
  admin: 1,
  manager: 2,
  user: 3,
}

const selectedRole = ref('')
const modules = ref<{ name: string, permissions: Record<string, boolean> }[]>([])

const rolePermissionSchema = toTypedSchema(z.object({
  role: z.string().min(1, 'Role is required'),
  permissions: z.any(),
}))

const { handleSubmit } = useForm({
  validationSchema: rolePermissionSchema,
  initialValues: {
    role: '',
    permissions: modules.value,
  },
})

const { getPermissionsByRoleId, getById } = useUsers()
const route = useRoute()
const userId = Number(route.params.id)

onMounted(async () => {
  try {
    const user = await getById(userId)
    if (user?.role?.id) {
      const roleName = user.role.name
      selectedRole.value = roleName

      const roleId = user.role.id
      if (roleId) {
        const response = await getPermissionsByRoleId(roleId)
        modules.value = response.map((perm: any) => ({
          name: perm.module_code,
          permissions: {
            create: perm.can_create,
            read: perm.can_read,
            update: perm.can_update,
            delete: perm.can_delete,
          },
        }))
      }
    }
    else {
      toast({
        title: 'User Role Not Found',
        description: 'Role tidak tersedia pada data user.',
        variant: 'destructive',
      })
    }
  }
  catch (err: any) {
    toast({
      title: 'Failed to Load Data',
      description: err.message || 'Terjadi kesalahan',
      variant: 'destructive',
    })
  }
})

const onSubmit = handleSubmit((values) => {
  values.permissions = modules.value
  values.role = selectedRole.value
  toast({
    title: 'Submitted Values:',
    description: JSON.stringify(values, null, 2),
  })
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Role Permissions</h3>
    <p class="text-sm text-muted-foreground">Assign permissions based on the selected role.</p>
    <Separator />
  </div>

  <Form class="space-y-6" @submit="onSubmit">
    <!-- Display Role as Text -->
    <FormField name="role" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Role</FormLabel>
        <FormControl>
          <input
            v-model="selectedRole"
            type="text"
            readonly
            v-bind="componentField"
            class="w-60 bg-gray-100 dark:bg-neutral-800 border border-gray-300 px-3 py-2 rounded text-sm"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Permissions Table -->
     <div class="overflow-x-auto">
      <table class="min-w-[600px] w-full table-auto border text-sm">
        <thead class="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th class="border px-4 py-2 text-left">
              Module
            </th>
            <th class="border px-4 py-2 text-center">
              Create
            </th>
            <th class="border px-4 py-2 text-center">
              Read
            </th>
            <th class="border px-4 py-2 text-center">
              Update
            </th>
            <th class="border px-4 py-2 text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mod, index) in modules" :key="index">
            <td class="border px-4 py-2">
              {{ mod.name }}
            </td>
            <td class="border px-4 py-2 text-center">
              <Checkbox v-model:checked="mod.permissions.create" disabled />
            </td>
            <td class="border px-4 py-2 text-center">
              <Checkbox v-model:checked="mod.permissions.read" disabled />
            </td>
            <td class="border px-4 py-2 text-center">
              <Checkbox v-model:checked="mod.permissions.update" disabled />
            </td>
            <td class="border px-4 py-2 text-center">
              <Checkbox v-model:checked="mod.permissions.delete" disabled />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Form>
</template>
