import { Link } from 'react-router-dom'
import { FiMenu, FiUser } from 'react-icons/fi'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/constants'

type NavbarProps = {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const user = useAppSelector((state) => state.auth.user)
  const displayName = user
    ? [user.nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' ').trim()
    : 'Usuario'

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
          title={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <FiMenu className="size-5" />
        </button>
        <div className="font-display text-xl leading-none tracking-wide">
          <span className="text-[#d23b3b]">RED</span>
          <span className="text-gray-900"> ALERT</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          title="Mi perfil"
        >
          <FiUser className="size-4 shrink-0 text-gray-500" aria-hidden />
          <span className="max-w-[180px] truncate">{displayName}</span>
        </Link>
      </div>
    </header>
  )
}
