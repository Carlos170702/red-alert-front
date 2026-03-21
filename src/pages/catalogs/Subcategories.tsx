import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { Category } from '@/models/categories'
import type { Subcategory } from '@/models/subcategories'
import { getCategoriesService } from '@/services/categories.service'
import {
  getSubcategoriesService,
  createSubcategoryService,
  updateSubcategoryService,
  deleteSubcategoryService,
} from '@/services/subcategories.service'
import { SortableHeader, type SortOrder } from '@/components/Table/SortableHeader'
import { SubcategoryModal, type SubcategoryModalMode } from '@/components'
import { ConfirmModal } from '@/components'

type SortKey = 'id' | 'name'

export function Subcategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortKey>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<SubcategoryModalMode>('create')
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getCategoriesService(), getSubcategoriesService()])
      .then(([cats, subs]) => {
        setCategories(cats)
        setSubcategories(subs)
      })
      .catch(() => {
        setCategories([])
        setSubcategories([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSort = (key: SortKey) => {
    setSortBy(key)
    setSortOrder((prev) => (prev === 'asc' && sortBy === key ? 'desc' : 'asc'))
  }

  const sortedSubcategories = useMemo(() => {
    let list = subcategories
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || String(s.id).includes(q)
      )
    }
    if (categoryFilter) {
      const categoryId = Number(categoryFilter)
      if (!Number.isNaN(categoryId)) {
        list = list.filter((s) => s.category_id === categoryId)
      }
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
  }, [subcategories, search, categoryFilter, sortBy, sortOrder])

  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name ?? '—'

  const handleModalSubmit = async (args: {
    form: { name: string; category_id: number }
    mode: SubcategoryModalMode
    id?: number
  }) => {
    setSaving(true)
    try {
      if (args.mode === 'create') {
        const created = await createSubcategoryService({
          name: args.form.name,
          category_id: args.form.category_id,
        })
        setSubcategories((prev) => [...prev, created])
        toast.success('Subcategoría creada correctamente')
      } else if (args.id != null) {
        const updated = await updateSubcategoryService(args.id, {
          name: args.form.name,
          category_id: args.form.category_id,
        })
        setSubcategories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        toast.success('Subcategoría actualizada correctamente')
      }
      setShowModal(false)
      setSelectedSubcategory(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar la subcategoría')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-[#d23b3b]/20 pb-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-gray-900">
            <span className="text-[#d23b3b]">Subcategorías</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra las subcategorías y asígnalas a una categoría.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalMode('create')
            setSelectedSubcategory(null)
            setShowModal(true)
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#d23b3b] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232]"
        >
          <FiPlus className="h-4 w-4" />
          Nueva subcategoría
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
        <div className="min-w-[180px] space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            CATEGORÍA
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setSearch('')
            setCategoryFilter('')
          }}
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
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Categoría</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Cargando subcategorías...
                </td>
              </tr>
            ) : sortedSubcategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No hay subcategorías para mostrar.
                </td>
              </tr>
            ) : (
              sortedSubcategories.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-2 text-start text-gray-700">{sub.id}</td>
                  <td className="px-4 py-2 text-start text-gray-900">{sub.name}</td>
                  <td className="px-4 py-2 text-start text-gray-800">
                    {getCategoryName(sub.category_id)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                        title="Editar subcategoría"
                        onClick={() => {
                          setModalMode('edit')
                          setSelectedSubcategory(sub)
                          setShowModal(true)
                        }}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white p-1.5 text-xs text-red-600 shadow-sm transition hover:bg-red-50"
                        title="Eliminar subcategoría"
                        onClick={() => setSubcategoryToDelete(sub)}
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
        open={subcategoryToDelete != null}
        title="Eliminar subcategoría"
        message={
          subcategoryToDelete
            ? `¿Eliminar la subcategoría "${subcategoryToDelete.name}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onClose={() => setSubcategoryToDelete(null)}
        onConfirm={async () => {
          if (!subcategoryToDelete) return
          try {
            await deleteSubcategoryService(subcategoryToDelete.id)
            setSubcategories((prev) => prev.filter((s) => s.id !== subcategoryToDelete.id))
            toast.success('Subcategoría eliminada')
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo eliminar la subcategoría')
            throw err
          }
        }}
      />

      <SubcategoryModal
        mode={modalMode}
        categories={categories}
        initialValues={
          selectedSubcategory
            ? {
                id: selectedSubcategory.id,
                name: selectedSubcategory.name,
                category_id: selectedSubcategory.category_id,
              }
            : undefined
        }
        open={showModal}
        saving={saving}
        onClose={() => {
          setShowModal(false)
          setSelectedSubcategory(null)
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

