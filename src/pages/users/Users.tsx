import { useEffect, useMemo, useState } from 'react'
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
import { ConfirmModal } from '@/components'
import { SortableHeader, type SortOrder } from '@/components/Table/SortableHeader'

type SortKey = 'id' | 'nombre' | 'apellidos' | 'telefono'

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
  const [sortBy, setSortBy] = useState<SortKey>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [userToDelete, setUserToDelete] = useState<UserWithOptionalUsername | null>(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleRefresh = () => {
    dispatch(fetchUsers()).unwrap().catch(() => {})
  }

  const handleSort = (key: SortKey) => {
    setSortBy(key)
    setSortOrder((prev) => (prev === 'asc' && sortBy === key ? 'desc' : 'asc'))
  }

  const filteredUsers = useMemo(() => {
    let list = users
    if (filter.trim()) {
      const q = filter.toLowerCase()
      list = list.filter((u) => {
        const fullName = `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno}`.toLowerCase()
        const username = (u as UserWithOptionalUsername).username?.toLowerCase() ?? ''
        return fullName.includes(q) || username.includes(q)
      })
    }
    const sorted = [...list].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number
      switch (sortBy) {
        case 'id':
          aVal = a.id
          bVal = b.id
          return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
        case 'nombre':
          aVal = a.nombre.toLowerCase()
          bVal = b.nombre.toLowerCase()
          break
        case 'apellidos':
          aVal = `${a.apellido_paterno} ${a.apellido_materno}`.toLowerCase()
          bVal = `${b.apellido_paterno} ${b.apellido_materno}`.toLowerCase()
          break
        case 'telefono':
          aVal = (a.telefono ?? '').toLowerCase()
          bVal = (b.telefono ?? '').toLowerCase()
          break
        default:
          return 0
      }
      const cmp = (aVal as string).localeCompare(bVal as string)
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [filter, users, sortBy, sortOrder])

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
      <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-[#d23b3b]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-gray-900">
            <span className="text-[#d23b3b]">Usuarios</span>
          </h1>
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

      <div className="flex-1 overflow-auto rounded-xl border border-[#d23b3b]/15 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="border-b-2 border-[#d23b3b]/25 bg-red-50/30">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  <SortableHeader
                    label="ID"
                    sortKey="id"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  <SortableHeader
                    label="Nombre"
                    sortKey="nombre"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  <SortableHeader
                    label="Apellidos"
                    sortKey="apellidos"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  <SortableHeader
                    label="Teléfono"
                    sortKey="telefono"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </th>
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
                          onClick={() => setUserToDelete(u as UserWithOptionalUsername)}
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

      <ConfirmModal
        open={userToDelete != null}
        title="Eliminar usuario"
        message={
          userToDelete
            ? `¿Eliminar al usuario "${userToDelete.nombre} ${userToDelete.apellido_paterno}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onClose={() => setUserToDelete(null)}
        onConfirm={async () => {
          if (!userToDelete) return
          try {
            await dispatch(deleteUser(userToDelete.id)).unwrap()
            toast.success('Usuario eliminado')
          } catch (err) {
            toast.error(err as string)
            throw err
          }
        }}
      />

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
