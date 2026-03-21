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

export async function getCategoryByIdService(id: number): Promise<Category> {
  try {
    const res = await api.get<Category>(`/categories/${id}`)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo obtener la categoría'))
  }
}

export async function createCategoryService(payload: { name: string }): Promise<Category> {
  try {
    const res = await api.post<Category>('/categories/', { name: payload.name })
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo crear la categoría'))
  }
}

export async function updateCategoryService(
  id: number,
  payload: { name?: string }
): Promise<Category> {
  try {
    const body: { name?: string } = {}
    if (payload.name !== undefined) body.name = payload.name
    const res = await api.put<Category>(`/categories/${id}`, body)
    return res.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo actualizar la categoría'))
  }
}

export async function deleteCategoryService(id: number): Promise<void> {
  try {
    await api.delete(`/categories/${id}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo eliminar la categoría'))
  }
}

