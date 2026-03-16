export interface CreateProductPayload {
  description: string
  quantity?: number
  price: number
  category_id: number
  subcategory_id: number
  /** URL as text (JSON). Omit when sending image file via multipart. */
  url_image?: string
  /** Image file for multipart/form-data. When set, backend receives field "image". */
  image?: File
}

export interface UpdateProductPayload {
  description?: string
  quantity?: number
  price?: number
  category_id?: number
  subcategory_id?: number
  url_image?: string
  image?: File
}
