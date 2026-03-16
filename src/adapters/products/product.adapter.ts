import type { Product, ProductResponse, ProductListResponse } from '@/models/products'

function toProduct(p: ProductResponse): Product {
  return {
    id: p.id,
    description: p.description,
    quantity: p.quantity,
    price: p.price,
    category_id: p.category_id,
    subcategory_id: p.subcategory_id,
    url_image: p.url_image ?? null,
    created_at: p.created_at,
    updated_at: p.updated_at,
    category_name: p.category_name,
    subcategory_name: p.subcategory_name,
  }
}

function fromApi(data: unknown): Product[] {
  if (!Array.isArray(data)) return []
  return (data as ProductListResponse).map(toProduct)
}

export const productsAdapter = {
  toProduct,
  fromApi,
}
