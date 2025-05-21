<script setup lang="ts">
import type { Branch } from '~/types/schema'
import BranchFormModal from '@/components/branch/components/BranchFormModal.vue'
import { columns as rawColumns } from '@/components/branch/components/columns'
import DataTable from '@/components/branch/components/DataTable.vue'
import { useBranch } from '@/composables/useBranch'
import { ref, watch } from 'vue'

const { fetchBranchesDatatables } = useBranch()

const data = ref<Branch[]>([])
const totalRows = ref(0)
const error = ref<string | null>(null)

const pageIndex = ref(0)
const pageSize = ref(10)

const showEditModal = ref(false)
const selectedBranch = ref<Branch | null>(null)
const isLoading = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const res = await fetchBranchesDatatables({
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

const handleEdit = (branch: Branch) => {
  selectedBranch.value = branch
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
        <h2 class="text-2xl font-bold tracking-tight">Branch</h2>
        <p class="text-muted-foreground">List of company branches.</p>
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

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

    <BranchFormModal
      v-if="showEditModal"
      :open="showEditModal"
      :branch="selectedBranch"
      @update:open="showEditModal = $event"
      @submit="handleEditSuccess"
    />
  </div>
</template>
