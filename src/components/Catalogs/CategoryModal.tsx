import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export type CategoryModalMode = 'create' | 'edit'

export type CategoryModalProps = {
  mode: CategoryModalMode
  initialValues?: CategoryFormValues & { id?: number }
  open: boolean
  saving: boolean
  onClose: () => void
  onSubmit: (payload: { form: CategoryFormValues; mode: CategoryModalMode; id?: number }) => void
}

export function CategoryModal({ mode, initialValues, open, saving, onClose, onSubmit }: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialValues) {
      reset({ name: initialValues.name })
    } else {
      reset({ name: '' })
    }
  }, [open, mode, initialValues, reset])

  if (!open) return null

  const title = mode === 'create' ? 'Nueva categoría' : 'Editar categoría'
  const mainAction = mode === 'create' ? 'Guardar categoría' : 'Guardar cambios'

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15'
  const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20'

  const handleFormSubmit = (data: CategoryFormValues) => {
    onSubmit({ form: data, mode, id: initialValues?.id })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl tracking-wide text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'create'
            ? 'Crea una nueva categoría para organizar tus productos.'
            : 'Actualiza el nombre de la categoría.'}
        </p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">NOMBRE</label>
            <input
              {...register('name')}
              className={`${inputClass} ${errors.name ? inputErrorClass : ''}`}
              placeholder="Nombre de la categoría"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
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

