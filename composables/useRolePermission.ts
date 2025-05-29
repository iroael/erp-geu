// composables/useRolePermission.ts
import type {
  CreateRolePermission,
  RolePermissionApiResponse,
  RoleWithPermission,
  UpdateRolePermission,
} from '~/types/schema'

export function useRolePermission() {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.API_BASE_URL}/role-permissions`

  // ✅ Get Datatables (server-side pagination)
  const fetchDatatables = async (params: { start: number, length: number }): Promise<RolePermissionApiResponse> => {
    const { start, length } = params

    const { data, error } = await useFetch<RolePermissionApiResponse>(`${BASE_URL}/datatables`, {
      query: { start, length },
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) {
      console.error('Failed to fetch role-permissions:', error.value)
      throw new Error(error.value.message || 'Failed to fetch role-permissions')
    }

    return data.value!
  }

  // ✅ Get single RolePermission by ID
  const getById = async (id: number): Promise<RoleWithPermission | null> => {
    const { data, error } = await useFetch<RoleWithPermission>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) {
      console.error(`Failed to fetch role-permission ID ${id}`, error.value)
      return null
    }

    return data.value || null
  }

  // ✅ Create RolePermission
  const create = async (payload: CreateRolePermission): Promise<RoleWithPermission | null> => {
    const { data, error } = await useFetch<RoleWithPermission>(BASE_URL, {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) {
      console.error('Failed to create role-permission:', error.value)
      throw new Error(error.value.message || 'Failed to create role-permission')
    }

    return data.value!
  }

  // ✅ Update RolePermission
  const update = async (payload: UpdateRolePermission): Promise<RoleWithPermission | null> => {
    const { id, ...body } = payload

    const { data, error } = await useFetch<RoleWithPermission>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) {
      console.error(`Failed to update role-permission ID ${id}:`, error.value)
      throw new Error(error.value.message || 'Failed to update role-permission')
    }

    return data.value!
  }

  // ✅ Delete RolePermission
  const remove = async (id: number): Promise<void> => {
    const { error } = await useFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) {
      console.error(`Failed to delete role-permission ID ${id}:`, error.value)
      throw new Error(error.value.message || 'Failed to delete role-permission')
    }
  }

  return {
    fetchDatatables,
    getById,
    create,
    update,
    remove,
  }
}
