import type { Jabatan } from '~/types/schema'

interface FetchJabatanesParams {
  start?: number
  length?: number
}

interface JabatanApiResponse {
  data: Jabatan[]
  recordsTotal: number
  recordsFiltered: number
}

export const useJabatan = () => {
  const config = useRuntimeConfig()

  const fetchJabatanesDatatables = async (params: FetchJabatanesParams = {}): Promise<JabatanApiResponse> => {
    const res = await $fetch<JabatanApiResponse>(`${config.public.API_BASE_URL}/jabatan/`, {
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

  const deleteJabatan = async (id: number): Promise<void> => {
    try {
      await $fetch(`${config.public.API_BASE_URL}/jabatan/${id}`, {
        method: 'DELETE',
        headers: {
          accept: '*/*',
          Authorization: config.public.API_TOKEN,
        },
      })
    }
    catch (error: any) {
      throw new Error(error?.data?.message || 'Failed to delete jabatan')
    }
  }

  const createOrUpdateJabatan = async (jabatan: Partial<Jabatan>): Promise<Jabatan> => {
    const isEdit = !!jabatan.id
    const url = `${config.public.API_BASE_URL}/jabatan${isEdit ? `/${jabatan.id}` : ''}`
    const method = isEdit ? 'PUT' : 'POST'

    console.log('API_BASE_URL:', config.public.API_BASE_URL)
    console.log('API_TOKEN:', config.public.API_TOKEN)
    
    const res = await $fetch<Jabatan>(url, {
      method,
      body: jabatan,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    return res
  }

  return {
    fetchJabatanesDatatables,
    deleteJabatan,
    createOrUpdateJabatan,
  }
}
