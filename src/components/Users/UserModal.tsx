import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff, FiZap } from 'react-icons/fi'
import type { UserModalProps, UserFormValues } from '@/types'
import { userFormSchema } from '@/schemas'
import { getRolesService } from '@/services/roles.service'
import type { Role } from '@/models/roles'
import { generateUsernameFromName, generateRandomPassword } from '@/helpers'

const defaultValues: UserFormValues = {
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  role_id: 0,
  username: '',
  password: '',
}

export function UserModal({ mode, initialUser, open, saving, onClose, onSubmit }: UserModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) return
    getRolesService()
      .then(setRoles)
      .catch(() => setRoles([]))
  }, [open])

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialUser) {
      reset({
        nombre: initialUser.nombre,
        apellido_paterno: initialUser.apellido_paterno,
        apellido_materno: initialUser.apellido_materno,
        telefono: initialUser.telefono ?? '',
        role_id: initialUser.role_id ?? 0,
        username: initialUser.username ?? '',
        password: '',
      })
    } else {
      reset({ ...defaultValues, role_id: 0 })
    }
  }, [open, mode, initialUser, reset, roles])

  const handleGenerateUsername = () => {
    const values = getValues()
    setValue(
      'username',
      generateUsernameFromName(values.nombre ?? '', values.apellido_paterno ?? '')
    )
  }

  const handleGeneratePassword = () => {
    setValue('password', generateRandomPassword())
  }

  const onFormSubmit = (data: UserFormValues) => {
    onSubmit({
      form: data,
      mode,
      userId: initialUser?.id,
    })
  }

  if (!open) return null

  const title = mode === 'create' ? 'Nuevo usuario de acceso' : 'Editar usuario'
  const mainAction = mode === 'create' ? 'Guardar usuario' : 'Guardar cambios'

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15'
  const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl tracking-wide text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'create'
            ? 'Crea el usuario del sistema y sus credenciales. Puedes capturar los datos manualmente o generar el usuario y la contraseña de forma automática.'
            : 'Actualiza los datos del usuario y, si lo deseas, sus credenciales de acceso.'}
        </p>

        <form className="mt-4 grid gap-3" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                NOMBRE
              </label>
              <input
                {...register('nombre')}
                className={`${inputClass} ${errors.nombre ? inputErrorClass : ''}`}
              />
              {errors.nombre && (
                <p className="text-xs text-red-600">{errors.nombre.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                APELLIDO PATERNO
              </label>
              <input
                {...register('apellido_paterno')}
                className={`${inputClass} ${errors.apellido_paterno ? inputErrorClass : ''}`}
              />
              {errors.apellido_paterno && (
                <p className="text-xs text-red-600">{errors.apellido_paterno.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                APELLIDO MATERNO
              </label>
              <input
                {...register('apellido_materno')}
                className={`${inputClass} ${errors.apellido_materno ? inputErrorClass : ''}`}
              />
              {errors.apellido_materno && (
                <p className="text-xs text-red-600">{errors.apellido_materno.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-widest text-gray-500">
                TELÉFONO
              </label>
              <input {...register('telefono')} className={inputClass} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold tracking-widest text-gray-500">
              ROL
            </label>
            <select
              {...register('role_id', { valueAsNumber: true })}
              className={`${inputClass} ${errors.role_id ? inputErrorClass : ''}`}
            >
              <option value="" disabled>
                {roles.length === 0 ? 'Cargando roles...' : 'Selecciona un rol para el usuario'}
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-xs text-red-600">{errors.role_id.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  USUARIO
                </label>
                {mode === 'create' ? (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                    Requerido
                  </span>
                ) : (
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-800">
                    Opcional
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  {...register('username')}
                  placeholder={mode === 'edit' ? 'Nuevo usuario de acceso (opcional)' : undefined}
                  className={`flex-1 ${inputClass} ${errors.username ? inputErrorClass : ''}`}
                />
                <button
                  type="button"
                  onClick={handleGenerateUsername}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title="Generar usuario automáticamente"
                >
                  <FiZap className="h-4 w-4" />
                </button>
              </div>
              {mode === 'edit' && (
                <p className="text-xs text-gray-500">
                  Completa solo si quieres cambiar el usuario.
                </p>
              )}
              {errors.username && (
                <p className="text-xs text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  CONTRASEÑA
                </label>
                {mode === 'create' ? (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                    Requerido
                  </span>
                ) : (
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-800">
                    Opcional
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder={mode === 'edit' ? 'Dejar vacío para no cambiar' : undefined}
                  className={`flex-1 ${inputClass} ${errors.password ? inputErrorClass : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title="Generar contraseña automáticamente"
                >
                  <FiZap className="h-4 w-4" />
                </button>
              </div>
              {mode === 'edit' && (
                <p className="text-xs text-gray-500">
                  Completa solo si quieres cambiar la contraseña.
                </p>
              )}
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                if (!saving) onClose()
              }}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#d23b3b] px-5 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Guardando...' : mainAction}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
