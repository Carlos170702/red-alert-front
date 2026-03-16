import type { Product } from '@/models/products'
import type { ProductFormValues } from '@/schemas'
import type { ProductModalMode } from '@/components/Products'

export type ProductModalSubmitPayload = {
  form: ProductFormValues
  mode: ProductModalMode
  productId?: number
  /** When user uploaded a file (drag/drop), send it for multipart "image" field. */
  image?: File
}

export type ProductModalSubmitCallbacks = {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  setShowProductModal: (v: boolean) => void
  setSelectedProduct: (p: Product | null) => void
  setSaving: (v: boolean) => void
}
