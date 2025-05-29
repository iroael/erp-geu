import type { Role } from '~/types/schema'
import { useFetch } from '#app'

export const useRole = () => {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.API_BASE_URL}/roles`
  const API_TOKEN = config.public.API_TOKEN

  const headers = {
    Authorization: API_TOKEN,
  }

  // Get datatable
  const fetchRolesDatatables = async ({ start = 0, length = 10 } = {}) => {
    const query = new URLSearchParams({ start: String(start), length: String(length) })
    const { data, error } = await useFetch(`${BASE_URL}/datatables?${query}`, {
      headers,
    })

    if (error.value) throw error.value
    return data.value as {
      data: Role[]
      recordsTotal: number
    }
  }

  // Create or update Role
  const createOrUpdateRole = async (role: Partial<Role>) => {
    const isEdit = !!role.id
    const url = isEdit ? `${BASE_URL}/${role.id}` : BASE_URL
    const method = isEdit ? 'PUT' : 'POST'

    const { data, error } = await useFetch(url, {
      method,
      headers,
      body: role,
    })

    if (error.value)
      throw error.value
    return data.value as Role
  }

  // Delete Role
  const deleteRole = async (id: number) => {
    const { error } = await useFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers,
    })

    if (error.value)
      throw error.value
    return true
  }

  return {
    fetchRolesDatatables,
    createOrUpdateRole,
    deleteRole,
  }
}
