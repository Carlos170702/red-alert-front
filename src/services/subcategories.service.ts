import { api } from '@/api'
import type { Subcategory } from '@/models/subcategories'
import { getApiErrorMessage } from '@/helpers'

export async function getSubcategoriesService(categoryId?: number): Promise<Subcategory[]> {
  try {
    const url = categoryId != null ? `/subcategories/?category_id=${categoryId}` : '/subcategories/'
    const res = await api.get<Subcategory[]>(url)
    const data = res.data
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar las subcategorías'))
  }
}

