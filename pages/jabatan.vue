<script setup lang="ts">
import type { Jabatan } from '~/types/schema'
import { columns as rawColumns } from '@/components/jabatan/components/columns'
import DataTable from '@/components/jabatan/components/DataTable.vue'
import JabatanFormModal from '@/components/jabatan/components/JabatanFormModal.vue'
import { useJabatan } from '@/composables/useJabatan'
import { ref, watch } from 'vue'

const { fetchJabatanesDatatables } = useJabatan()

const data = ref<Jabatan[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)
const isLoading = ref(true)

const showEditModal = ref(false)
const selectedJabatan = ref<Jabatan | null>(null)

const fetchData = async () => {
  try {
    isLoading.value = true
    const res = await fetchJabatanesDatatables({
      start: pageIndex.value * pageSize.value,
      length: pageSize.value,
    })

    data.value = res.data
    totalRows.value = res.recordsTotal
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch jabatan'
  } finally {
    isLoading.value = false
  }
}

watch([pageIndex, pageSize], fetchData, { immediate: true })

const handleEdit = (jabatan: Jabatan) => {
  selectedJabatan.value = jabatan
  showEditModal.value = true
}

const handleEditSuccess = async () => {
  await fetchData()
  showEditModal.value = false
}

const handleDeleteSuccess = async () => {
  isLoading.value = true
  await fetchData()
}

const columns = rawColumns({
  onEdit: handleEdit,
  onDeleteSuccess: handleDeleteSuccess, // ⬅️ pastikan kolom builder pas
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl font-bold">Jabatan</h2>
      <p class="text-muted-foreground">List semua jabatan.</p>
    </div>

    <DataTable
      v-if="!isLoading && data.length"
      :data="data"
      :columns="columns"
      :total-rows="totalRows"
      :page-index="pageIndex"
      :page-size="pageSize"
      @update:page-index="pageIndex = $event"
      @update:page-size="pageSize = $event"
      @deleteSuccess="handleDeleteSuccess"
    />

    <div v-else-if="isLoading" class="space-y-2">
      <div v-for="n in 10" :key="n" class="h-10 bg-muted animate-pulse rounded" />
    </div>

    <div v-else-if="!error" class="text-gray-500">No data available</div>

    <JabatanFormModal
      v-if="showEditModal"
      :open="showEditModal"
      :jabatan="selectedJabatan"
      @update:open="showEditModal = $event"
      @submit="handleEditSuccess"
    />
  </div>
</template>
