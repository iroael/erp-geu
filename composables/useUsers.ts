// composables/useUsers.ts
import type { CreateUser } from '~/types/schema'
import { useUserStore } from '~/store/users'

export const useUsers = () => {
  const store = useUserStore()
  const config = useRuntimeConfig()
  const token = config.public.API_TOKEN

  const fetch = async (start = 0, length = 10) => {
    await store.fetchUsers(start, length, token)
  }

  const getById = async (id: number) => {
    return await store.getUserById(id, token)
  }

  const create = async (payload: CreateUser) => {
    return await store.createUser(payload, token)
  }

  const update = async (id: number, payload: Partial<CreateUser>) => {
    return await store.updateUser(id, payload, token)
  }

  const remove = async (id: number) => {
    return await store.deleteUser(id, token)
  }
  
  const getPermissionsByRoleId = async (roleId: number) => {
    return await store.getPermissionsByRoleId(roleId, token)
  }

  return {
    users: store.users,
    total: store.total,
    isLoading: store.isLoading,
    error: store.error,
    fetch,
    create,
    update,
    remove,
    getById,
    getPermissionsByRoleId,
  }
}
