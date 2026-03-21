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

export async function getSubcategoryByIdService(id: number): Promise<Subcategory> {
  try {
    const res = await api.get<Subcategory>(`/subcategories/${id}`)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo obtener la subcategoría'))
  }
}

export async function createSubcategoryService(payload: {
  name: string
  category_id: number
}): Promise<Subcategory> {
  try {
    const res = await api.post<Subcategory>('/subcategories/', {
      name: payload.name,
      category_id: payload.category_id,
    })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo crear la subcategoría'))
  }
}

export async function updateSubcategoryService(
  id: number,
  payload: { name?: string; category_id?: number }
): Promise<Subcategory> {
  try {
    const body: { name?: string; category_id?: number } = {}
    if (payload.name !== undefined) body.name = payload.name
    if (payload.category_id !== undefined) body.category_id = payload.category_id
    const res = await api.put<Subcategory>(`/subcategories/${id}`, body)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo actualizar la subcategoría'))
  }
}

export async function deleteSubcategoryService(id: number): Promise<void> {
  try {
    await api.delete(`/subcategories/${id}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo eliminar la subcategoría'))
  }
}

