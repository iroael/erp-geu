<script setup lang="ts">
import type { RoleWithPermission } from '~/types/schema'
import { columns as rawColumns } from '@/components/role-permission/components/columns'
import DataTable from '@/components/role-permission/components/DataTable.vue'
import { useRolePermission } from '@/composables/useRolePermission'
import { ref, watch } from 'vue'

const { fetchDatatables } = useRolePermission()

const data = ref<RoleWithPermission[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)

const showEditModal = ref(false)
const selectedRolePermission = ref<RoleWithPermission | null>(null)
const isLoading = ref(false)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await fetchDatatables({
      start: pageIndex.value * pageSize.value,
      length: pageSize.value,
    })

    data.value = res.data
    totalRows.value = res.recordsTotal
  }
  catch (err: any) {
    error.value = err.message || 'Failed to fetch role permissions'
  }
  finally {
    isLoading.value = false
  }
}

watch([pageIndex, pageSize], fetchData, { immediate: true })

const handleEdit = (item: RoleWithPermission) => {
  selectedRolePermission.value = item
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
        <h2 class="text-2xl font-bold tracking-tight">Role Permissions</h2>
        <p class="text-muted-foreground">List of role-permission mappings.</p>
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

    <div v-else-if="!error" class="text-gray-500">No role-permission data found.</div>

  </div>
</template>
