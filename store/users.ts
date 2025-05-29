// store/users.ts
import type { User, UserApiResponse, CreateUser } from '~/types/schema'
import { defineStore } from 'pinia'

interface State {
  users: User[]
  total: number
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: [],
    total: 0,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchUsers(start = 0, length = 10, token: string) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/users`
      this.isLoading = true
      try {
        const res = await fetch(`${BASE_URL}?start=${start}&length=${length}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch users')

        const data: UserApiResponse = await res.json()

        console.log('Fetched data =>', data.data)

        this.users = data.data
        this.total = data.recordsTotal
      } catch (err: any) {
        this.error = err.message ?? 'Unknown error'
      } finally {
        this.isLoading = false
      }
    },

    async getUserById(id: number, token: string) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/users`

      try {
        const res = await fetch(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        })

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}))
          throw new Error(errorBody?.message || 'Failed to get user')
        }

        const data: User = await res.json()
        return data
      }
      catch (err: any) {
        throw new Error(err.message || 'Unexpected error during fetching user')
      }
    },

    async createUser(payload: CreateUser, token: string) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/users`
      try {
        const res = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}))
          throw new Error(errorBody?.message || 'Failed to create user')
        }

        return await res.json()
      }
      catch (err: any) {
        throw new Error(err.message || 'Unexpected error during user creation')
      }
    },

    async updateUser(id: number, payload: Partial<CreateUser>, token: string) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/users`
      try {
        const res = await fetch(`${BASE_URL}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}))
          throw new Error(errorBody?.message || 'Failed to update user')
        }

        return await res.json()
      } catch (err: any) {
        throw new Error(err.message || 'Unexpected error during user update')
      }
    },

    async deleteUser(id: number, token: string) {
      const config = useRuntimeConfig()
      const BASE_URL = `${config.public.API_BASE_URL}/users`
      try {
        const res = await fetch(`${BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `${token}`,
          },
        })

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}))
          throw new Error(errorBody?.message || 'Failed to delete user')
        }

        return true
      } catch (err: any) {
        throw new Error(err.message || 'Unexpected error during user deletion')
      }
    },
    async getPermissionsByRoleId(roleId: number, token: string) {
      const config = useRuntimeConfig()
      const url = `${config.public.API_BASE_URL}/role-permissions/role/${roleId}/permissions`

      const res = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        throw new Error(`[${res.status}] ${errorBody?.message || 'Failed to fetch role permissions'}`)
      }

      return await res.json()
    },
  },
})
