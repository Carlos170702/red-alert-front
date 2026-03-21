import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import type { Product } from '@/models/products'
import type { Category } from '@/models/categories'
import type { Subcategory } from '@/models/subcategories'
import { getCategoriesService } from '@/services/categories.service'
import { getSubcategoriesService } from '@/services/subcategories.service'
import {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} from '@/services/products.service'
import { SortableHeader, type SortOrder } from '@/components/Table/SortableHeader'
import { ProductModal, type ProductModalMode } from '@/components/Products'
import { ConfirmModal } from '@/components'
import { useAppSelector } from '@/store/hooks'
import { selectIsAdmin } from '@/store/auth/selectors'
import type { ProductModalSubmitPayload, ProductModalSubmitCallbacks } from '@/types'

type SortKey = 'name' | 'category' | 'subcategory' | 'price' | 'stock'
type SortOrderLocal = SortOrder

async function handleProductModalSubmit(
  payload: ProductModalSubmitPayload,
  callbacks: ProductModalSubmitCallbacks
): Promise<void> {
  const { setProducts, setShowProductModal, setSelectedProduct, setSaving } = callbacks
  setSaving(true)
  try {
    if (payload.mode === 'create') {
      const created = await createProductService({
        description: payload.form.description,
        quantity: payload.form.quantity,
        price: payload.form.price,
        category_id: payload.form.category_id,
        subcategory_id: payload.form.subcategory_id,
        url_image: payload.image ? undefined : (payload.form.url_image || undefined),
        image: payload.image,
      })
      setProducts((prev) => [...prev, created])
      toast.success('Producto creado correctamente')
    } else if (payload.productId != null) {
      const updated = await updateProductService(payload.productId, {
        description: payload.form.description,
        quantity: payload.form.quantity,
        price: payload.form.price,
        category_id: payload.form.category_id,
        subcategory_id: payload.form.subcategory_id,
        url_image: payload.image ? undefined : (payload.form.url_image || undefined),
        image: payload.image,
      })
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
      toast.success('Producto actualizado correctamente')
    }
    setShowProductModal(false)
    setSelectedProduct(null)
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'No se pudo guardar el producto')
  } finally {
    setSaving(false)
  }
}

export function Inventory() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrderLocal>('asc')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [modalMode, setModalMode] = useState<ProductModalMode>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const isAdmin = useAppSelector(selectIsAdmin)

  useEffect(() => {
    getCategoriesService()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (categoryId == null) return
    getSubcategoriesService(categoryId)
      .then(setSubcategories)
      .catch(() => setSubcategories([]))
  }, [categoryId])

  useEffect(() => {
    getProductsService()
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  const handleSort = (key: SortKey) => {
    setSortBy(key)
    setSortOrder((prev) => (prev === 'asc' && sortBy === key ? 'desc' : 'asc'))
  }

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.description.toLowerCase().includes(q))
    }

    if (category) {
      list = list.filter((p) => p.category_name === category)
    }

    if (subcategory) {
      list = list.filter((p) => p.subcategory_name === subcategory)
    }

    const min = minPrice ? Number(minPrice) : undefined
    const max = maxPrice ? Number(maxPrice) : undefined
    if (!Number.isNaN(min) && min !== undefined) {
      list = list.filter((p) => p.price >= min)
    }
    if (!Number.isNaN(max) && max !== undefined) {
      list = list.filter((p) => p.price <= max)
    }

    list.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortBy) {
        case 'name':
          aVal = a.description.toLowerCase()
          bVal = b.description.toLowerCase()
          break
        case 'category':
          aVal = a.category_name.toLowerCase()
          bVal = b.category_name.toLowerCase()
          break
        case 'subcategory':
          aVal = a.subcategory_name.toLowerCase()
          bVal = b.subcategory_name.toLowerCase()
          break
        case 'price':
          aVal = a.price
          bVal = b.price
          break
        case 'stock':
          aVal = a.quantity
          bVal = b.quantity
          break
        default:
          return 0
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal))
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return list
  }, [products, search, category, subcategory, minPrice, maxPrice, sortBy, sortOrder])

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex flex-col gap-3 border-b-2 border-[#d23b3b]/20 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-gray-900">
            <span className="text-[#d23b3b]">Inventario</span>
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Consulta y filtra los productos por nombre, categoría y rango de precios.
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => {
                setModalMode('create')
                setSelectedProduct(null)
                setShowProductModal(true)
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#d23b3b] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#b83232]"
            >
              <FiPlus className="h-4 w-4" />
              Crear nuevo producto
            </button>
          </div>
        )}
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            BUSCAR POR NOMBRE
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribe el nombre del producto..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            CATEGORÍA
          </label>
          <select
            value={categoryId != null ? String(categoryId) : ''}
            onChange={(e) => {
              const value = e.target.value
              if (!value) {
                setCategoryId(null)
                setCategory('')
                setSubcategory('')
                return
              }
              const id = Number(value)
              setCategoryId(Number.isNaN(id) ? null : id)
              const found = categories.find((c) => c.id === id)
              setCategory(found?.name ?? '')
              setSubcategory('')
            }}
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

        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            SUBCATEGORÍA
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={categoryId == null}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
              categoryId == null
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : 'border-gray-300 bg-white text-gray-800 focus:border-[#d23b3b]/70 focus:ring-[#d23b3b]/15'
            }`}
          >
            <option value="">Todas</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            PRECIO MÍNIMO
          </label>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-widest text-gray-500">
            PRECIO MÁXIMO
          </label>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-[#d23b3b]/70 focus:ring-2 focus:ring-[#d23b3b]/15"
          />
        </div>
        <div className="flex items-end sm:col-span-2">
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setCategory('')
              setSubcategory('')
              setCategoryId(null)
              setMinPrice('')
              setMaxPrice('')
              setSortBy('name')
              setSortOrder('asc')
            }}
            className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 hover:border-amber-500"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-[#d23b3b]/15 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="border-b-2 border-[#d23b3b]/25 bg-red-50/30">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                <SortableHeader
                  label="Nombre"
                  sortKey="name"
                  currentSortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                <SortableHeader
                  label="Categoría"
                  sortKey="category"
                  currentSortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                <SortableHeader
                  label="Subcategoría"
                  sortKey="subcategory"
                  currentSortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">
                <SortableHeader
                  label="Precio"
                  sortKey="price"
                  currentSortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">
                <SortableHeader
                  label="Stock"
                  sortKey="stock"
                  currentSortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              </th>
              {isAdmin && (
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No hay productos para mostrar.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-2 text-start text-gray-700">{p.id}</td>
                  <td className="px-4 py-2 text-start text-gray-900">{p.description}</td>
                  <td className="px-4 py-2 text-start text-gray-800">{p.category_name}</td>
                  <td className="px-4 py-2 text-start text-gray-800">{p.subcategory_name}</td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    ${p.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-900">{p.quantity}</td>
                  {isAdmin && (
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-1.5 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                          title="Editar producto"
                          onClick={() => {
                            setModalMode('edit')
                            setSelectedProduct(p)
                            setShowProductModal(true)
                          }}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white p-1.5 text-xs text-red-600 shadow-sm transition hover:bg-red-50"
                          title="Eliminar producto"
                          onClick={() => setProductToDelete(p)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={productToDelete != null}
        title="Eliminar producto"
        message={
          productToDelete
            ? `¿Eliminar el producto "${productToDelete.description}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onClose={() => setProductToDelete(null)}
        onConfirm={async () => {
          if (!productToDelete) return
          try {
            await deleteProductService(productToDelete.id)
            setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id))
            toast.success('Producto eliminado')
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'No se pudo eliminar el producto')
            throw err
          }
        }}
      />

      <ProductModal
        mode={modalMode}
        initialProduct={selectedProduct}
        open={showProductModal}
        saving={saving}
        onClose={() => {
          setShowProductModal(false)
          setSelectedProduct(null)
        }}
        onSubmit={(payload) =>
          handleProductModalSubmit(payload, {
            setProducts,
            setShowProductModal,
            setSelectedProduct,
            setSaving,
          })
        }
      />
    </div>
  )
}
