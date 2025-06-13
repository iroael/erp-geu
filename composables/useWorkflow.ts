// composables/useUsers.ts
import { useWorkflowStore } from '@/stores/workflow'

export const useWorkflow = () => {
  const store = useWorkflowStore()
  // const config = useRuntimeConfig()
  // const token = config.public.API_TOKEN

  const fetch = async (start = 0, length = 10) => {
    await store.fetchWowrkflowDatatables(start, length)
  }

  const getByName = async (worklofw_type: string) => {
    return await store.fetchWorkflows(worklofw_type)
  }

  return {
    workflow: store.workflow,
    total: store.total,
    isLoading: store.isLoading,
    error: store.error,
    fetch,
    getByName,
  }
}
