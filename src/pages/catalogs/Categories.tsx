import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { Category } from '@/models/categories'
import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '@/services/categories.service'
import { SortableHeader, type SortOrder } from '@/components/Table/SortableHeader'
import { CategoryModal, type CategoryModalMode } from '@/components'
import { ConfirmModal } from '@/components'

type SortKey = 'id' | 'name'

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<CategoryModalMode>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  useEffect(() => {
    setLoading(true)
    getCategoriesService()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSort = (key: SortKey) => {
    setSortBy(key)
    setSortOrder((prev) => (prev === 'asc' && sortBy === key ? 'desc' : 'asc'))
  }

  const sortedCategories = useMemo(() => {
    let list = categories
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || String(c.id).includes(q)
      )
    }
    list = [...list]
    list.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number
      if (sortBy === 'id') {
        aVal = a.id
        bVal = b.id
        return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
      }
      aVal = a.name.toLowerCase()
      bVal = b.name.toLowerCase()
      const cmp = (aVal as string).localeCompare(bVal as string)
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return list
  }, [categories, search, sortBy, sortOrder])

  const handleModalSubmit = async (args: {
    form: { name: string }
    mode: CategoryModalMode
    id?: number
  }) => {
    setSaving(true)
    try {
      if (args.mode === 'create') {
        const created = await createCategoryService({ name: args.form.name })
        setCategories((prev) => [...prev, created])
        toast.success('Categoría creada correctamente')
      } else if (args.id != null) {
        const updated = await updateCategoryService(args.id, { name: args.form.name })
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        toast.success('Categoría actualizada correctamente')
      }
      setShowModal(false)
      setSelectedCategory(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-[#d23b3b]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-gray-900">
            <span className="text-[#d23b3b]">Categorías</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra las categorías disponibles para organizar los productos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalMode('create')
            setSelectedCategory(null)
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#d23b3b] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232]"
        >
          <FiPlus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1 space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            BUSCAR
          </label>
          <input
            type="text"
            placeholder="Filtrar por nombre o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
          />
        </div>
        <button
          type="button"
          onClick={() => setSearch('')}
          className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 hover:border-amber-500"
        >
          Limpiar filtros
        </button>
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
                  sortKey="name"
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
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  Cargando categorías...
                </td>
              </tr>
            ) : sortedCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No hay categorías para mostrar.
                </td>
              </tr>
            ) : (
              sortedCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-2 text-start text-gray-700">{cat.id}</td>
                  <td className="px-4 py-2 text-start text-gray-900">{cat.name}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                        title="Editar categoría"
                        onClick={() => {
                          setModalMode('edit')
                          setSelectedCategory(cat)
                          setShowModal(true)
                        }}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white p-1.5 text-xs text-red-600 shadow-sm transition hover:bg-red-50"
                        title="Eliminar categoría"
                        onClick={() => setCategoryToDelete(cat)}
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
        open={categoryToDelete != null}
        title="Eliminar categoría"
        message={
          categoryToDelete
            ? `¿Eliminar la categoría "${categoryToDelete.name}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onClose={() => setCategoryToDelete(null)}
        onConfirm={async () => {
          if (!categoryToDelete) return
          try {
            await deleteCategoryService(categoryToDelete.id)
            setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
            toast.success('Categoría eliminada')
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo eliminar la categoría')
            throw err
          }
        }}
      />

      <CategoryModal
        mode={modalMode}
        initialValues={
          selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : undefined
        }
        open={showModal}
        saving={saving}
        onClose={() => {
          setShowModal(false)
          setSelectedCategory(null)
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

