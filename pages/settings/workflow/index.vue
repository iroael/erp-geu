<script setup lang="ts">
import type { User } from '~/types/schema'
import { ref, watch } from 'vue'
import { columns as rawColumns } from '@/components/workflow-designer/components/columns'
import DataTable from '@/components/workflow-designer/components/DataTable.vue'
import { useWorkflow } from '@/composables/useWorkflow'
import { onMounted } from 'vue'

// State
const {
  fetch,
  workflow,
  total,
  error: storeError,
  isLoading,
} = useWorkflow()

const pageIndex = ref(0)
const pageSize = ref(10)
const selectedUser = ref<User | null>(null)
const showEditModal = ref(false)
const hydrated = ref(false)

// SSR-friendly fetch
const fetchData = async () => {
  try {
    await fetch(pageIndex.value * pageSize.value, pageSize.value)
  } catch (err: any) {
    console.error('Error fetching workflows:', err)
  }
}

// SSR: fetch saat server render
await useAsyncData('workflows', fetchData)

// Hydration check (to enable skeleton only on client after hydration)
onMounted(() => {
  hydrated.value = true
})

// Re-fetch on pagination change (CSR)
watch([pageIndex, pageSize], fetchData)

const handleEdit = (user: User) => {
  selectedUser.value = user
  showEditModal.value = true
}

const columns = rawColumns({ onEdit: handleEdit, onDeleteSuccess: fetchData })
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-4">
          <CardHeader>
            <CardTitle>Workflow List</CardTitle>
          </CardHeader>

          <CardContent class="pl-2">
            <div v-if="storeError" class="text-red-500">{{ storeError }}</div>

            <!-- SSR content or data visible -->
            <DataTable
              v-if="!isLoading && workflow.length"
              :data="workflow"
              :columns="columns"
              :total-rows="total"
              :page-index="pageIndex"
              :page-size="pageSize"
              @update:page-index="pageIndex = $event"
              @update:page-size="pageSize = $event"
              @refresh="fetchData"
            />

            <!-- Skeleton while loading on client -->
            <div v-else-if="hydrated && isLoading" class="space-y-2">
              <div
                v-for="n in 10"
                :key="n"
                class="animate-pulse flex items-center space-x-4 rounded border p-4 shadow-sm bg-white"
              >
                <div class="h-10 w-10 bg-muted rounded-full"></div>
                <div class="flex-1 space-y-2 py-1">
                  <div class="h-4 bg-muted rounded w-3/4"></div>
                  <div class="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="text-muted-foreground">No workflows found.</div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
