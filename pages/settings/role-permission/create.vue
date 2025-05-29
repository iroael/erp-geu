<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { usePermission } from '@/composables/usePermission'
import { Trash } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { toast } = useToast()
const router = useRouter()
const { fetchPermissionById } = usePermission()
const config = useRuntimeConfig()

const roles = ref([])
const modules = ref([])
const selectedRoleId = ref(null)

const rows = ref([
  {
    module_id: null,
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
])

const fetchData = async () => {
  const [roleRes, permRes] = await Promise.all([
    $fetch(`${config.public.API_BASE_URL}/roles`, {
      headers: { Authorization: config.public.API_TOKEN },
    }),
    $fetch(`${config.public.API_BASE_URL}/permissions`, {
      headers: { Authorization: config.public.API_TOKEN },
    }),
  ])
  roles.value = roleRes
  modules.value = permRes
}
fetchData()

const addRow = () => {
  rows.value.push({
    module_id: null,
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  })
}

const handleModuleChange = async (row, moduleId) => {
  if (!moduleId)
    return
  try {
    const permission = await fetchPermissionById(moduleId)
    row.can_create = permission.can_create
    row.can_read = permission.can_read
    row.can_update = permission.can_update
    row.can_delete = permission.can_delete
  }
  catch (err) {
    toast({
      title: 'Failed to fetch permission',
      description: err.message || 'Check API or network',
      variant: 'destructive',
    })
  }
}

const submit = async () => {
  if (!selectedRoleId.value)
    return

  const payload = rows.value.map(r => ({
    role_id: selectedRoleId.value,
    permission_id: r.module_id,
    can_create: r.can_create,
    can_read: r.can_read,
    can_update: r.can_update,
    can_delete: r.can_delete,
  }))

  try {
    for (const data of payload) {
      await $fetch(`${config.public.API_BASE_URL}/role-permissions`, {
        method: 'POST',
        body: data,
        headers: { Authorization: config.public.API_TOKEN },
      })
    }

    toast({
      title: 'Success',
      description: 'Permissions saved.',
      variant: 'success',
    })

    router.push('/settings/role-permission')
  }
  catch (err) {
    toast({
      title: 'Error',
      description: err.message || 'Failed to save permissions',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-2 mb-4">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Role Permissions</h2>
      <p class="text-muted-foreground">Assign Role Permissions</p>
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Form Assign Role</CardTitle>
      </CardHeader>

      <CardContent>
        <!-- Role Selector -->
        <div class="mb-4">
          <Label for="role">Role</Label>
          <select v-model="selectedRoleId" class="border rounded w-full p-2 mt-1">
            <option disabled value="">-- Select Role --</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Permissions Table -->
        <div class="overflow-x-auto border rounded">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-100 border-b">
              <tr>
                <th class="p-2 w-1/4">Module</th>
                <th class="p-2 text-center">Create</th>
                <th class="p-2 text-center">Read</th>
                <th class="p-2 text-center">Update</th>
                <th class="p-2 text-center">Delete</th>
                <th class="p-2 text-center">
                  <Button size="sm" @click="addRow">+</Button>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, index) in rows" :key="index" class="border-t">
                <td class="p-2">
                  <select
                    v-model="row.module_id"
                    class="w-full border rounded p-1"
                    @change="handleModuleChange(row, row.module_id)"
                  >
                    <option disabled value="">-- Select Module --</option>
                    <option v-for="m in modules" :key="m.id" :value="m.id">
                      {{ m.module_code }}
                    </option>
                  </select>
                </td>

                <td class="text-center">
                  <Checkbox v-model:checked="row.can_create" disabled />
                </td>
                <td class="text-center">
                  <Checkbox v-model:checked="row.can_read" disabled />
                </td>
                <td class="text-center">
                  <Checkbox v-model:checked="row.can_update" disabled />
                </td>
                <td class="text-center">
                  <Checkbox v-model:checked="row.can_delete" disabled />
                </td>
                <td class="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-red-500 hover:text-red-700"
                    @click="rows.splice(index, 1)"
                  >
                    <Trash class="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end mt-4">
          <Button @click="submit">Save</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
