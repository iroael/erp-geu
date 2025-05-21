<script setup lang="ts">
import type { Warehouse } from '~/types/schema'
import { columns as rawColumns } from '@/components/gudang/components/columns'
import GudangFormModal from '@/components/gudang/components/GudangFormModal.vue'
import DataTable from '@/components/jabatan/components/DataTable.vue'
import { useGudang } from '@/composables/useGudang'
import { ref, watch } from 'vue'

const { fetchGudangesDatatables } = useGudang()

const data = ref<Warehouse[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)

const showEditModal = ref(false)
const selectedGudang = ref<Warehouse | null>(null)
const isLoading = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await fetchGudangesDatatables({
      start: pageIndex.value * pageSize.value,
      length: pageSize.value,
    })

    data.value = res.data
    totalRows.value = res.recordsTotal
  }
  catch (err: any) {
    error.value = err.message || 'Failed to fetch jabatan'
  }
  finally {
    isLoading.value = false
  }
}
watch([pageIndex, pageSize], fetchData, { immediate: true })

const handleEdit = (gudang: Warehouse) => {
  selectedGudang.value = gudang
  showEditModal.value = true
}

const handleEditSuccess = async () => {
  await fetchData()
  showEditModal.value = false
}

const columns = rawColumns({ onEdit: handleEdit })
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Jabatan
        </h2>
        <p class="text-muted-foreground">
          List of company jabatan.
        </p>
      </div>
    </div>

    <div v-if="error" class="text-red-500">
      {{ error }}
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
    />

    <div v-else-if="isLoading" class="space-y-2">
      <div v-for="n in 10" :key="n" class="h-10 bg-muted animate-pulse rounded" />
    </div>

    <div v-else-if="!error" class="text-gray-500">Loading...</div>

    <GudangFormModal
      v-if="showEditModal"
      :key="selectedGudang?.id"
      :open="showEditModal"
      :gudang="selectedGudang"
      @update:open="showEditModal = $event"
      @submit="handleEditSuccess"
    />
  </div>
</template>
