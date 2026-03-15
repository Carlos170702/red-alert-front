import { NavLink, useNavigate } from 'react-router-dom'
import { FiPackage, FiUsers, FiBook, FiLogOut } from 'react-icons/fi'
import { ROUTES } from '@/constants'
import { useAppDispatch } from '@/store/hooks'
import { clearCredentials } from '@/store/auth/authSlice'

const navItems = [
  { to: ROUTES.INVENTORY, label: 'Inventario', icon: FiPackage },
  { to: ROUTES.USERS, label: 'Usuarios', icon: FiUsers },
  { to: ROUTES.CATALOGS, label: 'Catálogos', icon: FiBook },
] as const

type SidebarProps = {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(clearCredentials())
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-30 flex flex-col bg-gray-900 text-white shadow-xl transition-[width] duration-200 ease-out overflow-hidden ${isOpen ? 'w-56' : 'w-16'}`}
    >
      <div className="flex min-h-0 flex-1 flex-col pt-6">
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Navegación principal">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#d23b3b] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="size-6 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-700 px-3 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            title="Cerrar sesión"
          >
            <FiLogOut className="size-6 shrink-0" aria-hidden />
            <span className="truncate">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
