import { api } from '@/api'
import type { Role } from '@/models/roles'
import { getApiErrorMessage } from '@/helpers'

export async function getRolesService(): Promise<Role[]> {
  try {
    const res = await api.get<Role[]>('/roles/')
    const data = res.data
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar los roles'))
  }
}
