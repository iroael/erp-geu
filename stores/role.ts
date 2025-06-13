import type { Role } from '~/types/schema'
import { defineStore } from 'pinia'
import { useRole } from '~/composables/useRole'

export const useRoleStore = defineStore('role', {
  state: () => ({
    list: [] as Role[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchRoles() {
      this.loading = true
      try {
        const { getRoles } = useRole()
        this.list = await getRoles()
        this.error = null
      }
      catch (err: any) {
        this.error = err.message || 'Failed to fetch roles'
      }
      finally {
        this.loading = false
      }
    },

    async addRole(roleData: { name: string, description?: string }) {
      try {
        const { createRole } = useRole()
        const newRole = await createRole(roleData)
        this.list.push(newRole)
        this.error = null
      }
      catch (err: any) {
        this.error = err.message || 'Failed to create role'
      }
    },

    async editRole(id: number, roleData: { name: string, description?: string }) {
      try {
        const { updateRole } = useRole()
        const updated = await updateRole(id, roleData)
        const idx = this.list.findIndex(r => r.id === id)
        if (idx !== -1)
          this.list[idx] = updated
        this.error = null
      }
      catch (err: any) {
        this.error = err.message || 'Failed to update role'
      }
    },

    async removeRole(id: number) {
      try {
        const { deleteRole } = useRole()
        await deleteRole(id)
        this.list = this.list.filter(r => r.id !== id)
        this.error = null
      }
      catch (err: any) {
        this.error = err.message || 'Failed to delete role'
      }
    },
  },
})
