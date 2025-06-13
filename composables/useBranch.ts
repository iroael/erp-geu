// composables/useBranch.ts
import type { Branch } from '~/types/schema'

interface FetchBranchesParams {
  start?: number
  length?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface BranchApiResponse {
  data: Branch[]
  recordsTotal: number
  recordsFiltered: number
}

export const useBranch = () => {
  const config = useRuntimeConfig()
  
  // Loading states
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  
  // Error handling
  const error = ref<string | null>(null)
  
  const clearError = () => {
    error.value = null
  }

  const handleApiError = (err: any, defaultMessage: string) => {
    console.error('API Error:', err)
    const message = err?.data?.message || err?.message || defaultMessage
    error.value = message
    throw new Error(message)
  }

  const fetchBranches = async (): Promise<Branch[]> => {
    try {
      isLoading.value = true
      clearError()
      
      const res = await $fetch<{ data: Branch[] }>(`${config.public.API_BASE_URL}/branch`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: config.public.API_TOKEN,
        },
      })

      return res.data || []
    } catch (err: any) {
      handleApiError(err, 'Failed to fetch branches')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const fetchBranchesDatatables = async (params: FetchBranchesParams = {}): Promise<BranchApiResponse> => {
    try {
      isLoading.value = true
      clearError()
      // Default parameters for datatables
      const queryParams = {
        start: params.start ?? 0,
        length: params.length ?? 10,
        search: params.search || '',
        sortBy: params.sortBy || '',
        sortOrder: params.sortOrder || 'asc',
      }

      // Remove empty parameters to clean up URL
      const cleanQuery = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value !== '')
      )
      const res = await $fetch<BranchApiResponse>(`${config.public.API_BASE_URL}/branch/datatables`, {
        method: 'GET',
        query: cleanQuery,
        headers: {
          accept: 'application/json',
          Authorization: config.public.API_TOKEN,
        },
      })
      console.log('[fetchBranchesDatatables] result:', res)
      return res
    }
    catch (err: any) {
      handleApiError(err, 'Failed to fetch branches data')
      return { data: [], recordsTotal: 0, recordsFiltered: 0 }
    }
    finally {
      isLoading.value = false
    }
  }

  const createOrUpdateBranch = async (branch: Partial<Branch>): Promise<Branch | null> => {
    if (!branch) {
      error.value = 'Branch data is required'
      return null
    }

    try {
      isSubmitting.value = true
      clearError()
      const isEdit = !!branch.id
      const url = `${config.public.API_BASE_URL}/branch${isEdit ? `/${branch.id}` : ''}`
      const method = isEdit ? 'PUT' : 'POST'

      const res = await $fetch<Branch>(url, {
        method,
        body: branch,
        headers: {
          'Content-Type': 'application/json',
          Authorization: config.public.API_TOKEN,
        },
      })

      return res
    }
    catch (err: any) {
      handleApiError(err, `Failed to ${branch.id ? 'update' : 'create'} branch`)
      return null
    }
    finally {
      isSubmitting.value = false
    }
  }

  const deleteBranch = async (id: number): Promise<boolean> => {
    if (!id || id <= 0) {
      error.value = 'Valid branch ID is required'
      return false
    }

    try {
      isSubmitting.value = true
      clearError()

      await $fetch(`${config.public.API_BASE_URL}/branch/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: config.public.API_TOKEN,
        },
      })

      return true
    }
    catch (err: any) {
      handleApiError(err, 'Failed to delete branch')
      return false
    }
    finally {
      isSubmitting.value = false
    }
  }

  const getTotalBranchCount = async (): Promise<number> => {
    console.log('[getTotalBranchCount] fetching total branch count...')
    try {
      const res = await $fetch<BranchApiResponse>(`${config.public.API_BASE_URL}/branch/datatables`, {
        method: 'GET',
        query: {
          start: 0,
          length: 1,
        },
        headers: {
          accept: 'application/json',
          Authorization: config.public.API_TOKEN,
        },
      })

      console.log('[getTotalBranchCount] result:', res.recordsTotal)
      return res.recordsTotal
    }
    catch (err: any) {
      handleApiError(err, 'Failed to fetch total branch count')
      return 0
    }
  }


  return {
    // Methods
    fetchBranches,
    fetchBranchesDatatables,
    createOrUpdateBranch,
    deleteBranch,
    clearError,
    getTotalBranchCount,
    // States
    isLoading: readonly(isLoading),
    isSubmitting: readonly(isSubmitting),
    error: readonly(error),
  }
}
