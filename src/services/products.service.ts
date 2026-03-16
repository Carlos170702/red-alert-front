import { api } from '@/api'
import type {
  Product,
  ProductResponse,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/models/products'
import { productsAdapter } from '@/adapters/products'
import { getApiErrorMessage } from '@/helpers'

export async function getProductsService(): Promise<Product[]> {
  try {
    const res = await api.get<ProductListResponse>('/products/')
    return productsAdapter.fromApi(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar los productos'))
  }
}

export async function getProductByIdService(id: number): Promise<Product> {
  try {
    const res = await api.get<ProductResponse>(`/products/${id}`)
    return productsAdapter.toProduct(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo obtener el producto'))
  }
}

function buildCreateBody(payload: CreateProductPayload): Record<string, unknown> | FormData {
  if (payload.image) {
    const form = new FormData()
    form.append('description', payload.description)
    form.append('quantity', String(payload.quantity ?? 0))
    form.append('price', String(payload.price))
    form.append('category_id', String(payload.category_id))
    form.append('subcategory_id', String(payload.subcategory_id))
    form.append('image', payload.image)
    return form
  }
  const body: Record<string, unknown> = {
    description: payload.description,
    quantity: payload.quantity ?? 0,
    price: payload.price,
    category_id: payload.category_id,
    subcategory_id: payload.subcategory_id,
  }
  if (payload.url_image != null && payload.url_image.trim() !== '') {
    body.url_image = payload.url_image.trim()
  }
  return body
}

export async function createProductService(payload: CreateProductPayload): Promise<Product> {
  try {
    const body = buildCreateBody(payload)
    const res = await api.post<ProductResponse>('/products/', body)
    return productsAdapter.toProduct(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo crear el producto'))
  }
}

function buildUpdateBody(payload: UpdateProductPayload): Record<string, unknown> | FormData {
  if (payload.image) {
    const form = new FormData()
    if (payload.description !== undefined) form.append('description', payload.description)
    if (payload.quantity !== undefined) form.append('quantity', String(payload.quantity))
    if (payload.price !== undefined) form.append('price', String(payload.price))
    if (payload.category_id !== undefined) form.append('category_id', String(payload.category_id))
    if (payload.subcategory_id !== undefined) form.append('subcategory_id', String(payload.subcategory_id))
    if (payload.url_image !== undefined) form.append('url_image', payload.url_image)
    form.append('image', payload.image)
    return form
  }
  const body: Record<string, unknown> = {}
  if (payload.description !== undefined) body.description = payload.description
  if (payload.quantity !== undefined) body.quantity = payload.quantity
  if (payload.price !== undefined) body.price = payload.price
  if (payload.category_id !== undefined) body.category_id = payload.category_id
  if (payload.subcategory_id !== undefined) body.subcategory_id = payload.subcategory_id
  if (payload.url_image !== undefined) body.url_image = payload.url_image
  return body
}

export async function updateProductService(id: number, payload: UpdateProductPayload): Promise<Product> {
  try {
    const body = buildUpdateBody(payload)
    const res = await api.put<ProductResponse>(`/products/${id}`, body)
    return productsAdapter.toProduct(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo actualizar el producto'))
  }
}

export async function deleteProductService(id: number): Promise<void> {
  try {
    await api.delete(`/products/${id}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo eliminar el producto'))
  }
}

