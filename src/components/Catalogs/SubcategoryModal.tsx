import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Category } from '@/models/categories'

const subcategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  category_id: z.coerce.number().int().min(1, 'Selecciona una categoría'),
})

type SubcategoryFormValues = z.infer<typeof subcategorySchema>

export type SubcategoryModalMode = 'create' | 'edit'

export type SubcategoryModalProps = {
  mode: SubcategoryModalMode
  categories: Category[]
  initialValues?: SubcategoryFormValues & { id?: number }
  open: boolean
  saving: boolean
  onClose: () => void
  onSubmit: (payload: { form: SubcategoryFormValues; mode: SubcategoryModalMode; id?: number }) => void
}

export function SubcategoryModal({
  mode,
  categories,
  initialValues,
  open,
  saving,
  onClose,
  onSubmit,
}: SubcategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: { name: '', category_id: 0 },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialValues) {
      reset({ name: initialValues.name, category_id: initialValues.category_id })
    } else {
      reset({ name: '', category_id: 0 })
    }
  }, [open, mode, initialValues, reset])

  if (!open) return null

  const title = mode === 'create' ? 'Nueva subcategoría' : 'Editar subcategoría'
  const mainAction = mode === 'create' ? 'Guardar subcategoría' : 'Guardar cambios'

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15'
  const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20'

  const handleFormSubmit = (data: SubcategoryFormValues) => {
    onSubmit({ form: data, mode, id: initialValues?.id })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl tracking-wide text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'create'
            ? 'Crea una nueva subcategoría y asígnala a una categoría.'
            : 'Actualiza el nombre o la categoría de la subcategoría.'}
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">NOMBRE</label>
            <input
              {...register('name')}
              className={`${inputClass} ${errors.name ? inputErrorClass : ''}`}
              placeholder="Nombre de la subcategoría"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              CATEGORÍA
            </label>
            <select
              {...register('category_id', { valueAsNumber: true })}
              className={`${inputClass} ${errors.category_id ? inputErrorClass : ''}`}
            >
              <option value={0}>Selecciona una categoría</option>
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

