import type { Permission } from '~/types/schema'

export function usePermission() {
  const config = useRuntimeConfig()
  const BASE_URL = `${config.public.API_BASE_URL}/permissions`

  const getAll = async (): Promise<Permission[]> => {
    const { data } = await useFetch<Permission[]>(BASE_URL, {
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })
    return data.value || []
  }

  const getById = async (id: number): Promise<Permission | null> => {
    const { data } = await useFetch<Permission>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })
    return data.value || null
  }

  const createOrUpdate = async (item: Partial<Permission>) => {
    const isEdit = !!item.id
    const url = isEdit ? `${BASE_URL}/${item.id}` : BASE_URL
    const method = isEdit ? 'PUT' : 'POST'

    const { data } = await useFetch<Permission>(url, {
      method,
      body: item,
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })
    return data.value
  }

  const remove = async (id: number) => {
    await useFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })
  }

  // Fungsi tambahan untuk DataTables server-side pagination
  type DatatablesParams = {
    start: number // offset, misal 0, 10, 20, dst
    length: number // limit, misal 10, 20, dst
  }

  type DatatablesResponse = {
    data: Permission[]
    recordsTotal: number
    recordsFiltered?: number
  }

  const fetchPermissionDatatables = async (params: DatatablesParams): Promise<DatatablesResponse> => {
    const query = new URLSearchParams({
      start: params.start.toString(),
      length: params.length.toString(),
    })

    const url = `${BASE_URL}/datatables?${query.toString()}`

    const { data } = await useFetch<DatatablesResponse>(url, {
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    return data.value || { data: [], recordsTotal: 0 }
  }

  const fetchPermissionById = async (id: number) => {
    const { data, error } = await useFetch(`${config.public.API_BASE_URL}/permissions/${id}`, {
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value) throw new Error(error.value.message)
    return data.value
  }

  const deletePermission = async (id: number): Promise<void> => {
    const { error } = await useFetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: config.public.API_TOKEN,
      },
    })

    if (error.value)
      throw new Error(error.value.message)
  }

  return {
    getAll,
    getById,
    createOrUpdate,
    remove,
    fetchPermissionDatatables,
    fetchPermissionById,
    deletePermission,
  }
}
