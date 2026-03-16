import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Product } from '@/models/products'
import type { Category } from '@/models/categories'
import type { Subcategory } from '@/models/subcategories'
import { productFormSchema, type ProductFormValues } from '@/schemas'
import { getCategoriesService } from '@/services/categories.service'
import { getSubcategoriesService } from '@/services/subcategories.service'

const defaultValues: ProductFormValues = {
  description: '',
  quantity: 0,
  price: 0,
  category_id: 0,
  subcategory_id: 0,
  url_image: '',
}

export type ProductModalMode = 'create' | 'edit'

export type ProductModalProps = {
  mode: ProductModalMode
  initialProduct: Product | null
  open: boolean
  saving: boolean
  onClose: () => void
  onSubmit: (payload: {
    form: ProductFormValues
    mode: ProductModalMode
    productId?: number
    image?: File
  }) => void
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function ProductModal({ mode, initialProduct, open, saving, onClose, onSubmit }: ProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [formCategoryId, setFormCategoryId] = useState<number | null>(null)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  const watchedCategoryId = watch('category_id')
  const watchedSubcategoryId = watch('subcategory_id')
  const watchedUrlImage = watch('url_image')

  useEffect(() => {
    if (!open) return
    getCategoriesService()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [open])

  useEffect(() => {
    const id = watchedCategoryId ? Number(watchedCategoryId) : null
    if (id == null || id === 0) {
      setSubcategories([])
      setFormCategoryId(null)
      return
    }
    setFormCategoryId(id)
    getSubcategoriesService(id)
      .then(setSubcategories)
      .catch(() => setSubcategories([]))
  }, [open, watchedCategoryId])

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    if (mode === 'edit' && initialProduct) {
      reset({
        description: initialProduct.description,
        quantity: initialProduct.quantity,
        price: initialProduct.price,
        category_id: initialProduct.category_id,
        subcategory_id: initialProduct.subcategory_id,
        url_image: initialProduct.url_image ?? '',
      })
    } else {
      reset({ ...defaultValues, category_id: 0, subcategory_id: 0 })
    }
  }, [open, mode, initialProduct, reset])

  const onFormSubmit = (data: ProductFormValues) => {
    onSubmit({
      form: data,
      mode,
      productId: initialProduct?.id,
      image: imageFile ?? undefined,
    })
  }

  if (!open) return null

  const title = mode === 'create' ? 'Nuevo producto' : 'Editar producto'
  const mainAction = mode === 'create' ? 'Guardar producto' : 'Guardar cambios'

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15'
  const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl tracking-wide text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'create'
            ? 'Completa los datos del producto para agregarlo al inventario.'
            : 'Actualiza los datos del producto.'}
        </p>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              DESCRIPCIÓN
            </label>
            <input
              {...register('description')}
              className={`${inputClass} ${errors.description ? inputErrorClass : ''}`}
              placeholder="Nombre o descripción del producto"
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                CANTIDAD
              </label>
              <input
                type="number"
                min={0}
                {...register('quantity', { valueAsNumber: true })}
                className={`${inputClass} ${errors.quantity ? inputErrorClass : ''}`}
              />
              {errors.quantity && (
                <p className="text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                PRECIO
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                {...register('price', { valueAsNumber: true })}
                className={`${inputClass} ${errors.price ? inputErrorClass : ''}`}
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              CATEGORÍA
            </label>
            <select
              value={watchedCategoryId === 0 || watchedCategoryId === undefined ? '' : String(watchedCategoryId)}
              className={`${inputClass} ${errors.category_id ? inputErrorClass : ''}`}
              onChange={(e) => {
                const v = e.target.value
                const id = v ? Number(v) : 0
                setValue('category_id', id, { shouldValidate: true })
                setValue('subcategory_id', 0, { shouldValidate: true })
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-600">{errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              SUBCATEGORÍA
            </label>
            <select
              value={watchedSubcategoryId === 0 || watchedSubcategoryId === undefined ? '' : String(watchedSubcategoryId)}
              className={`${inputClass} ${errors.subcategory_id ? inputErrorClass : ''}`}
              disabled={!formCategoryId || subcategories.length === 0}
              onChange={(e) => {
                const v = e.target.value
                setValue('subcategory_id', v ? Number(v) : 0, { shouldValidate: true })
              }}
            >
              <option value="">Selecciona una subcategoría</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subcategory_id && (
              <p className="text-xs text-red-600">{errors.subcategory_id.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              IMAGEN (opcional)
            </label>
            <div
              className={`relative rounded-lg border-2 border-dashed px-3 py-3 transition-colors ${
                isDraggingImage
                  ? 'border-[#d23b3b] bg-red-50/50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingImage(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingImage(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingImage(false)
                const file = e.dataTransfer.files[0]
                if (!file) return
                if (!IMAGE_TYPES.includes(file.type)) return
                setImageFile(file)
                setValue('url_image', URL.createObjectURL(file))
              }}
            >
              <input
                {...register('url_image', {
                  onChange: () => setImageFile(null),
                })}
                type="text"
                className={`${inputClass} bg-white`}
                placeholder="Escribe o pega la URL de la imagen, o arrastra una imagen aquí"
              />
              {watchedUrlImage && watchedUrlImage.trim() !== '' && (
                <div className="mt-2 flex items-center gap-3 rounded border border-gray-200 bg-white p-2">
                  <img
                    key={watchedUrlImage}
                    src={watchedUrlImage}
                    alt="Vista previa"
                    className="h-20 w-20 shrink-0 rounded border border-gray-200 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="text-xs text-gray-500">Vista previa</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-70"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#d23b3b] px-5 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[#b83232] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Guardando...' : mainAction}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
