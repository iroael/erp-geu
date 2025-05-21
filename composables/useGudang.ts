import type { Warehouse } from '~/types/schema'

interface FetchGudangesParams {
  start?: number
  length?: number
}

interface GudangApiResponse {
  data: Warehouse[]
  recordsTotal: number
  recordsFiltered: number
}

export const useGudang = () => {
  const config = useRuntimeConfig()

  const fetchGudangesDatatables = async (params: FetchGudangesParams = {}): Promise<GudangApiResponse> => {
    const res = await $fetch<GudangApiResponse>(`${config.public.API_BASE_URL}/gudang/`, {
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

  const deleteGudang = async (id: number): Promise<void> => {
    try {
      await $fetch(`${config.public.API_BASE_URL}/gudang/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: config.public.API_TOKEN,
        },
      })
    }
    catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to delete Gudang')
    }
  }

  const createOrUpdateGudang = async (Gudang: Partial<Gudang>): Promise<Gudang> => {
    const isEdit = !!Gudang.id
    const url = `${config.public.API_BASE_URL}/gudang${isEdit ? `/${Gudang.id}` : ''}`
    const method = isEdit ? 'PUT' : 'POST'

    const res = await $fetch<Gudang>(url, {
      method,
      body: Gudang,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    return res
  }

  return {
    fetchGudangesDatatables,
    deleteGudang,
    createOrUpdateGudang,
  }
}
