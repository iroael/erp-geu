<script setup lang="ts">
import type { Permission } from '~/types/schema'
import { columns as rawColumns } from '@/components/permission/components/columns'
import DataTable from '@/components/permission/components/DataTable.vue'
import PermissionFormModal from '@/components/permission/components/PermissionFormModal.vue'
import { usePermission } from '@/composables/usePermission'
import { ref, watch } from 'vue'

const { fetchPermissionDatatables } = usePermission()

const data = ref<Permission[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)

const showEditModal = ref(false)
const selectedPermission = ref<Permission | null>(null)
const isLoading = ref(false)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await fetchPermissionDatatables({
      start: pageIndex.value * pageSize.value,
      length: pageSize.value,
    })

    data.value = res.data
    totalRows.value = res.recordsTotal
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch permissions'
  } finally {
    isLoading.value = false
  }
}

watch([pageIndex, pageSize], fetchData, { immediate: true })

const handleEdit = (permission: Permission) => {
  selectedPermission.value = permission
  showEditModal.value = true
}

const handleEditSuccess = async () => {
  showEditModal.value = false
  selectedPermission.value = null
  await fetchData()
}

const columns = rawColumns({ onEdit: handleEdit, onDeleteSuccess: fetchData})
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Permission</h2>
        <p class="text-muted-foreground">List of permissions.</p>
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

    <div v-else-if="!error" class="text-gray-500">No permissions found.</div>

    <PermissionFormModal
      v-if="showEditModal"
      :open="showEditModal"
      :permission="selectedPermission"
      @update:open="showEditModal = $event"
      @submit="handleEditSuccess"
    />
  </div>
</template>
