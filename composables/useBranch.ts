import type { Branch } from '~/types/schema'

interface FetchBranchesParams {
  start?: number
  length?: number
}

interface BranchApiResponse {
  data: Branch[]
  recordsTotal: number
  recordsFiltered: number
}

export const useBranch = () => {
  const config = useRuntimeConfig()

  const fetchBranches = async (): Promise<Branch[]> => {
    
    const res = await $fetch<{ data: Branch[] }>(`${config.public.API_BASE_URL}/branch`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: config.public.API_TOKEN,
      },
    })

    return res.data
  }

  const fetchBranchesDatatables = async (params: FetchBranchesParams = {}): Promise<BranchApiResponse> => {
    const res = await $fetch<BranchApiResponse>(`${config.public.API_BASE_URL}/branch/datatables`, {
      method: 'GET',
      query: {
        start: params.start ?? 0,
        length: params.length ?? 10,
      },
      headers: {
        accept: 'application/json',
        Authorization: config.public.API_TOKEN,
      },
    })

    return res
  }

  const deleteBranch = async (id: number): Promise<void> => {
    try {
      await $fetch(`${config.public.API_BASE_URL}/branch/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: config.public.API_TOKEN,
        },
      })
    }
    catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to delete branch')
    }
  }

  return {
    fetchBranches,
    fetchBranchesDatatables,
    deleteBranch,
  }
}
