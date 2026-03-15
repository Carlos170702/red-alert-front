import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { updateProfileData } from '@/store/auth/authSlice'
import { updateProfileCompleteService } from '@/services/profile.service'
import { getUserByIdService } from '@/services/users.service'
import type { User } from '@/models/users'
import { ProfileSkeleton } from '@/components/Skeletons'
import { profileFormSchema, type ProfileFormValues } from '@/schemas'

const defaultValues: ProfileFormValues = {
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  username: '',
  password: '',
  calle: '',
  colonia: '',
  codigo_postal: '',
}

export function Profile() {
  const dispatch = useAppDispatch()
  const checkingAuth = useAppSelector((state) => state.auth.checkingAuth)
  const auth = useAppSelector((state) => state.auth.auth)
  const authUser = useAppSelector((state) => state.auth.user)
  const userId = authUser?.id ?? auth?.id ?? null

  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (checkingAuth) return
    if (userId == null) {
      setLoading(false)
      setLoadError('No se pudo identificar al usuario.')
      return
    }
    let cancelled = false
    setLoading(true)
    setLoadError(null)

    async function loadProfile() {
      try {
        const user = await getUserByIdService(userId!)
        if (!cancelled) {
          setProfileUser(user)
          setLoadError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Error al cargar el perfil.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProfile()

    return () => {
      cancelled = true
    }
  }, [checkingAuth, userId])

  useEffect(() => {
    if (!profileUser) return
    const d = profileUser.direccion
    reset({
      nombre: profileUser.nombre ?? '',
      apellido_paterno: profileUser.apellido_paterno ?? '',
      apellido_materno: profileUser.apellido_materno ?? '',
      telefono: profileUser.telefono ?? '',
      username: auth?.username ?? '',
      password: '',
      calle: d?.calle ?? '',
      colonia: d?.colonia ?? '',
      codigo_postal: d?.codigo_postal ?? '',
    })
  }, [profileUser, auth?.username, reset])

  const onSubmit = async (data: ProfileFormValues) => {
    if (!profileUser) return
    setMessage(null)
    setSaving(true)
    try {
      const payload = {
        nombre: data.nombre?.trim() || undefined,
        apellido_paterno: data.apellido_paterno?.trim() || undefined,
        apellido_materno: data.apellido_materno?.trim() || undefined,
        telefono: data.telefono?.trim() || undefined,
        username: data.username?.trim() || undefined,
        password: data.password || undefined,
        calle: data.calle?.trim() || undefined,
        colonia: data.colonia?.trim() || undefined,
        codigo_postal: data.codigo_postal?.trim() || undefined,
      }
      const res = await updateProfileCompleteService(profileUser.id, payload)
      dispatch(updateProfileData({ user: res.user, auth: res.auth }))
      setProfileUser(res.user)
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' })
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : 'Error al actualizar el perfil.'
      setMessage({ type: 'error', text })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15'
  const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20'

  if (checkingAuth || loading || (userId != null && !profileUser && !loadError)) {
    return <ProfileSkeleton />
  }

  if (loadError || !profileUser) {
    return (
      <div className="p-6">
        <p className="text-red-600">{loadError ?? 'No se pudo cargar el perfil.'}</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="font-display text-3xl tracking-wide text-gray-900">Mi perfil</h1>
        <p className="mt-2 text-gray-600">
          Actualiza tu información personal, credenciales de acceso o dirección.
        </p>

        {message && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="mt-6 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-medium tracking-wide text-gray-900">
              Datos personales
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-gray-500">NOMBRE</label>
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
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-medium tracking-wide text-gray-900">
              Credenciales de acceso
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Deja en blanco la contraseña si no quieres cambiarla.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  USUARIO
                </label>
                <input
                  {...register('username')}
                  className={`${inputClass} ${errors.username ? inputErrorClass : ''}`}
                />
                {errors.username && (
                  <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  CONTRASEÑA (nueva)
                </label>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Dejar vacío para no cambiar"
                    className={`flex-1 ${inputClass} ${errors.password ? inputErrorClass : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-gray-700 transition hover:bg-gray-50"
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-medium tracking-wide text-gray-900">
              Dirección
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Opcional. Completa si quieres registrar o actualizar tu dirección.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  CALLE
                </label>
                <input {...register('calle')} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  COLONIA
                </label>
                <input {...register('colonia')} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold tracking-widest text-gray-500">
                  CÓDIGO POSTAL
                </label>
                <input {...register('codigo_postal')} className={inputClass} />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#d23b3b] px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
