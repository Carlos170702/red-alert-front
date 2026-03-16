import { z } from 'zod'

export const productFormSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  quantity: z.coerce.number().int().min(0, 'La cantidad debe ser 0 o mayor'),
  price: z.coerce.number().min(0, 'El precio debe ser 0 o mayor'),
  category_id: z.coerce.number().int().min(1, 'Selecciona una categoría'),
  subcategory_id: z.coerce.number().int().min(1, 'Selecciona una subcategoría'),
  url_image: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
