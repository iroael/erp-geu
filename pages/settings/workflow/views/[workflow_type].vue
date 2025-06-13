<script setup lang="ts">
import { useRoute } from 'vue-router'

import type { WorkflowDefinition } from '@/stores/workflow'
import { useWorkflowStore } from '@/stores/workflow'
import { onMounted, ref } from 'vue'
import WorkflowDesigner from '~/components/workflow-designer/NewWorkflowDesigner.vue'

const route = useRoute()
const workflowType = route.params.workflow_type as string

console.log('Workflow type from route:', workflowType)

const workflowStore = useWorkflowStore()

const localAvailableWorkflows = ref<WorkflowDefinition[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  error.value = null
  try {
    const fetchedWorkflows = await workflowStore.fetchWorkflows(workflowType)
    localAvailableWorkflows.value = fetchedWorkflows

    console.log('Fetched workflows from workflow_type.vue :', localAvailableWorkflows.value)
  }
  catch (e: any) {
    error.value = e.message || 'An unknown error occurred during fetch.'
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>

  <div class="w-full flex flex-col items-stretch gap-4">
    <div v-if="isLoading" class="flex justify-center items-center h-full text-gray-600">
      <p>Loading workflows...</p>
    </div>
    <div v-else-if="error" class="flex flex-col justify-center items-center h-full text-red-600 text-center">
      <p class="text-xl font-bold mb-2">Error Loading Workflows</p>
      <p class="text-lg mb-4">{{ error }}</p>
      <p class="text-md">Please ensure your API server is running at `http://localhost:5001` and the endpoint `/api/v1/workflows/revisions/work_order` is correct and accessible.</p>
    </div>
    <div v-else class="flex-1">
      <template v-if="localAvailableWorkflows.length > 0">
        <WorkflowDesigner :available-workflows="localAvailableWorkflows" />
      </template>
      <template v-else>
        <div class="flex justify-center items-center h-full text-gray-600">
          <p>No workflows available from the API.</p>
        </div>
      </template>
    </div>
  </div>
</template>
