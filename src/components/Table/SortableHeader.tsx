import { FiChevronUp, FiChevronDown } from 'react-icons/fi'

export type SortOrder = 'asc' | 'desc'

type SortableHeaderProps<TSortKey extends string> = {
  label: string
  sortKey: TSortKey
  currentSortBy: TSortKey
  sortOrder: SortOrder
  onSort: (key: TSortKey) => void
}

export function SortableHeader<TSortKey extends string>({
  label,
  sortKey,
  currentSortBy,
  sortOrder,
  onSort,
}: SortableHeaderProps<TSortKey>) {
  const isActive = currentSortBy === sortKey
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-left font-semibold text-gray-700 transition hover:bg-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#d23b3b]/40"
      title={
        isActive
          ? `Orden ${sortOrder === 'asc' ? 'ascendente' : 'descendente'}. Clic para cambiar.`
          : 'Ordenar'
      }
    >
      {label}
      {isActive ? (
        sortOrder === 'asc' ? (
          <FiChevronUp className="h-4 w-4 shrink-0 text-[#d23b3b]" aria-hidden />
        ) : (
          <FiChevronDown className="h-4 w-4 shrink-0 text-[#d23b3b]" aria-hidden />
        )
      ) : (
        <FiChevronDown className="h-4 w-4 shrink-0 text-gray-400 opacity-60" aria-hidden />
      )}
    </button>
  )
}

