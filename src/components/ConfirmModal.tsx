import { useState } from 'react'

export type ConfirmModalProps = {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export function ConfirmModal({
  open,
  title = 'Confirmar eliminación',
  message,
  confirmLabel = 'Eliminar',
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await Promise.resolve(onConfirm())
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-xl tracking-wide text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-70"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-full bg-[#d23b3b] px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[#b83232] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
