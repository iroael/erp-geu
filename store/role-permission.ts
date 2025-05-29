// stores/role-permission.ts
import type { RoleWithPermission } from '~/types/schema'
import { defineStore } from 'pinia'
import { useRolePermission } from '~/composables/useRolePermission'

export const useRolePermissionStore = defineStore('rolePermission', () => {
  const items = ref<RoleWithPermission[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const {
    fetchDatatables,
    getById,
    create,
    update,
    remove
  } = useRolePermission()

  const load = async (start = 0, length = 10) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetchDatatables(start, length)
      items.value = res.data
      total.value = res.recordsTotal
    }
    catch (err: any) {
      error.value = err.message || 'Gagal memuat data role-permission'
    }
    finally {
      isLoading.value = false
    }
  }

  const deleteItem = async (id: number) => {
    try {
      await remove(id)
      items.value = items.value.filter(item => item.id !== id)
    }
    catch (err: any) {
      error.value = err.message || 'Gagal menghapus data'
    }
  }

  return {
    items,
    total,
    isLoading,
    error,
    load,
    getById,
    create,
    update,
    deleteItem,
  }
})
