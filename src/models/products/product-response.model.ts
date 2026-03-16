export interface ProductResponse {
  id: number
  description: string
  quantity: number
  price: number
  category_id: number
  subcategory_id: number
  url_image?: string | null
  created_at?: string
  updated_at?: string
  category_name: string
  subcategory_name: string
}

export type ProductListResponse = ProductResponse[]

