import type { Permission } from '~/types/schema'
import { defineStore } from 'pinia'
import { usePermission } from '~/composables/usePermission'

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAll, createOrUpdate, remove } = usePermission()

  const loadPermissions = async () => {
    loading.value = true
    try {
      permissions.value = await getAll()
      error.value = null
    }
    catch (e: any) {
      error.value = e.message || 'Failed to load permissions'
    }
    finally {
      loading.value = false
    }
  }

  const savePermission = async (item: Partial<Permission>) => {
    const saved = await createOrUpdate(item)
    await loadPermissions()
    return saved
  }

  const deletePermission = async (id: number) => {
    await remove(id)
    await loadPermissions()
  }

  return {
    permissions,
    loading,
    error,
    loadPermissions,
    savePermission,
    deletePermission,
  }
})
