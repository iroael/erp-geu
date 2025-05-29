<script setup lang="ts">
import type { Role } from '~/types/schema'
import { columns as rawColumns } from '@/components/role/components/columns'
import DataTable from '@/components/role/components/DataTable.vue'
import RoleFormModal from '@/components/role/components/RoleFormModal.vue'
import { useRole } from '@/composables/useRole'
import { ref, watch } from 'vue'

const { fetchRolesDatatables } = useRole()

const data = ref<Role[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)

const showEditModal = ref(false)
const selectedRole = ref<Role | null>(null)
const isLoading = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await fetchRolesDatatables({
      start: pageIndex.value * pageSize.value,
      length: pageSize.value,
    })

    data.value = res.data
    totalRows.value = res.recordsTotal
  }
  catch (err: any) {
    error.value = err.message || 'Failed to fetch branches'
  }
  finally {
    isLoading.value = false
  }
}

watch([pageIndex, pageSize], fetchData, { immediate: true })

const handleEdit = (role: Role) => {
  selectedRole.value = role
  showEditModal.value = true
}

const handleEditSuccess = async () => {
  await fetchData()
  showEditModal.value = false
}

const columns = rawColumns({ onEdit: handleEdit, onDeleteSuccess: fetchData })
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Role</h2>
        <p class="text-muted-foreground">List of role.</p>
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <DataTable
      v-if="!isLoading"
      :data="data"
      :columns="columns"
      :total-rows="totalRows"
      :page-index="pageIndex"
      :page-size="pageSize"
      @update:page-index="pageIndex = $event"
      @update:page-size="pageSize = $event"
      @refresh="fetchData"
    />

    <div v-else-if="isLoading" class="space-y-2">
      <div v-for="n in 10" :key="n" class="h-10 bg-muted animate-pulse rounded" />
    </div>

    <div v-else-if="!error" class="text-gray-500">Loading...</div>

    <RoleFormModal
      v-if="showEditModal"
      :open="showEditModal"
      :role="selectedRole"
      @update:open="showEditModal = $event"
      @submit="handleEditSuccess"
    />
  </div>
</template>
