import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import type { UserWithOptionalUsername } from '@/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchUsers,
  deleteUser,
  submitUser,
} from '@/store/users/user.thunks'
import {
  setFilter,
  openCreateModal,
  openEditModal,
  closeModal,
} from '@/store/users/userSlice'
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { UserModal } from '@/components/Users'

export function Users() {
  const dispatch = useAppDispatch()
  const {
    list: users,
    loading,
    filter,
    showModal,
    saving,
    modalMode,
    selectedUser,
    error,
  } = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleRefresh = () => {
    dispatch(fetchUsers()).unwrap().catch(() => {})
  }

  const handleDeleteUser = (user: UserWithOptionalUsername) => {
    const confirmed = window.confirm(
      `¿Eliminar al usuario "${user.nombre} ${user.apellido_paterno}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return
    dispatch(deleteUser(user.id))
      .unwrap()
      .then(() => toast.success('Usuario eliminado'))
      .catch((msg) => toast.error(msg as string))
  }

  const filteredUsers = useMemo(() => {
    if (!filter.trim()) return users
    const q = filter.toLowerCase()
    return users.filter((u) => {
      const fullName = `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno}`.toLowerCase()
      const username = (u as UserWithOptionalUsername).username?.toLowerCase() ?? ''
      return fullName.includes(q) || username.includes(q)
    })
  }, [filter, users])

  const handleModalSubmit = (args: {
    form: Parameters<typeof submitUser>[0]['form']
    mode: 'create' | 'edit'
    userId?: number
  }) => {
    const { form, mode, userId } = args
    if (mode === 'create' && !form.password) {
      toast.error('La contraseña es obligatoria para un nuevo usuario')
      return
    }
    dispatch(submitUser({ form, mode, userId }))
      .unwrap()
      .then(() => {
        toast.success(
          mode === 'create' ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente'
        )
      })
      .catch((msg) => toast.error(msg as string))
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra los usuarios del sistema y sus credenciales de acceso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <FiRefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => dispatch(openCreateModal())}
            className="inline-flex items-center gap-2 rounded-full bg-[#d23b3b] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232]"
          >
            <FiPlus className="h-4 w-4" />
            Nuevo usuario
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Filtrar por nombre o usuario..."
          value={filter}
          onChange={(e) => dispatch(setFilter(e.target.value))}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
        />
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Apellidos</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Teléfono</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-2 text-start text-gray-700">{u.id}</td>
                    <td className="px-4 py-2 text-start text-gray-900">{u.nombre}</td>
                    <td className="px-4 py-2 text-start text-gray-900">
                      {u.apellido_paterno} {u.apellido_materno}
                    </td>
                    <td className="px-4 py-2 text-start text-gray-700">{u.telefono || '—'}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                          title="Editar usuario"
                          onClick={() => dispatch(openEditModal(u as UserWithOptionalUsername))}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white p-1.5 text-xs text-red-600 shadow-sm transition hover:bg-red-50"
                          title="Eliminar usuario"
                          onClick={() => handleDeleteUser(u as UserWithOptionalUsername)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      <UserModal
        mode={modalMode}
        initialUser={selectedUser ?? undefined}
        open={showModal}
        saving={saving}
        onClose={() => dispatch(closeModal())}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}
