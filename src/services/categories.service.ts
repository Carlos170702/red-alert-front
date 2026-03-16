import { api } from '@/api'
import type { Category } from '@/models/categories'
import { getApiErrorMessage } from '@/helpers'

export async function getCategoriesService(): Promise<Category[]> {
  try {
    const res = await api.get<Category[]>('/categories/')
    const data = res.data
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar las categorías'))
  }
}

