<script setup lang="ts">
import type { Branch } from '~/types/schema'
import BranchFormModal from '@/components/branch/components/BranchFormModal.vue'
import { columns as rawColumns } from '@/components/branch/components/columns'
import DataTable from '@/components/branch/components/DataTable.vue'
import { useBranch } from '@/composables/useBranch'
import { ref, computed } from 'vue'

// Meta
definePageMeta({
  title: 'Branch Management',
  description: 'Manage company branches and locations'
})

// Pagination state
const pageIndex = ref(0)
const pageSize = ref(10)

// Refresh key untuk trigger refetch data
const refreshKey = ref(0)

const { fetchBranchesDatatables, getTotalBranchCount } = useBranch()

// Fetch data with pagination
const { data: branchesData, error, pending: isLoading, refresh: refreshData } = await useLazyAsyncData(
  () => `branches-${refreshKey.value}-${pageIndex.value}-${pageSize.value}`,
  () => fetchBranchesDatatables({
    start: pageIndex.value * pageSize.value,
    length: pageSize.value
  }),
  {
    watch: [pageIndex, pageSize, refreshKey],
    default: () => ({ data: [], recordsTotal: 0, recordsFiltered: 0 }),
    transform: (data: any) => ({
      data: data?.data || [],
      recordsTotal: data?.recordsTotal || 0,
      recordsFiltered: data?.recordsFiltered || 0
    }),
  }
)

// Computed data
const data = computed(() => branchesData.value?.data || [])
const totalRows = computed(() => branchesData.value?.recordsTotal || 0)

// Refresh function
const refresh = () => {
  refreshKey.value++
  refreshData()
}

// Modal state
const showModal = ref(false)
const selectedBranch = ref<Branch | null>(null)

// Handlers
const handleEdit = (branch: Branch) => {
  selectedBranch.value = { ...branch }
  showModal.value = true
}

const handleSubmitSuccess = async (updatedBranch?: Branch) => {
  const isCreate = !selectedBranch.value?.id
  console.log('handleSubmitSuccess', { isCreate, updatedBranch })
  if (isCreate) {
    const totalCount = await getTotalBranchCount()
    const lastPageIndex = Math.floor((totalCount - 1) / pageSize.value)

    if (pageIndex.value !== lastPageIndex) {
      pageIndex.value = lastPageIndex
      await nextTick()
      await refreshData()
    } else {
      await refreshData()
    }
  } else {
    // 💡 Optimisasi: update 1 item langsung di tabel
    if (updatedBranch) {
      handleBranchEditSuccess(updatedBranch)
    } else {
      await refreshData()
    }
  }

  showModal.value = false
  selectedBranch.value = null
}

const handleDeleteSuccess = async () => {
  const currentTotal = totalRows.value
  const itemsOnCurrentPage = data.value.length
  const willBeEmpty = itemsOnCurrentPage <= 1 && pageIndex.value > 0

  if (willBeEmpty) {
    const newTotal = Math.max(0, currentTotal - 1)
    const totalPages = Math.ceil(newTotal / pageSize.value)
    const newPageIndex = Math.max(0, totalPages - 1)
    pageIndex.value = newPageIndex
  }

  refresh()
}

const handleCloseModal = () => {
  showModal.value = false
  selectedBranch.value = null
}

const handleBranchEditSuccess = (updatedBranch: Branch) => {
  const currentData = branchesData.value?.data || []
  const index = currentData.findIndex(branch => branch.id === updatedBranch.id)
  if (index !== -1) {
    currentData[index] = updatedBranch
  }

  branchesData.value = {
    ...branchesData.value,
    data: [...currentData],
  }
}

const columns = computed(() => rawColumns({
  onEdit: handleEdit,
  onDeleteSuccess: handleDeleteSuccess,
  onEditSuccess: handleBranchEditSuccess,
}))

useSeoMeta({
  title: 'Branch Management',
  description: 'Manage company branches and locations'
})
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Branch Management
        </h1>
        <p class="text-muted-foreground">
          Manage your company branches and locations efficiently.
        </p>
      </div>
    </div>

    <Alert v-if="error" variant="destructive" class="mb-4">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error Loading Branches</AlertTitle>
      <AlertDescription class="mt-2 flex items-center gap-2">
        {{ error }}
        <Button
          variant="outline"
          :disabled="isLoading"
          size="sm"
          @click="refresh()"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>

    <template v-else>
      <div v-if="isLoading" class="space-y-3">
        <div class="h-10 bg-muted animate-pulse rounded-md" />
        <div v-for="n in pageSize" :key="n" class="h-16 bg-muted animate-pulse rounded-md" />
      </div>

      <DataTable
        v-else-if="data.length > 0"
        :data="data"
        :columns="columns"
        :total-rows="totalRows"
        :page-index="pageIndex"
        :page-size="pageSize"
        :loading="isLoading"
        @update:page-index="pageIndex = $event"
        @update:page-size="pageSize = $event"
        @editSuccess="handleBranchEditSuccess"
      />

      <Card v-else class="border-dashed">
        <CardContent class="flex flex-col items-center justify-center py-16 text-center">
          <div class="rounded-full bg-primary/10 p-6 mb-4">
            <Building class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-semibold mb-2">No branches yet</h3>
          <p class="text-muted-foreground mb-6 max-w-sm">
            Get started by creating your first branch to manage your locations.
          </p>
        </CardContent>
      </Card>
    </template>

    <BranchFormModal
      v-model:open="showModal"
      :branch="selectedBranch"
      @submit="handleSubmitSuccess"
      @close="handleCloseModal"
    />
  </div>
</template>
