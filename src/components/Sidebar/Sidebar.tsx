import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiPackage, FiUsers, FiBook, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { ROUTES } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearCredentials } from '@/store/auth/authSlice'
import { selectIsAdmin } from '@/store/auth/selectors'

const allNavItems = [
  { to: ROUTES.INVENTORY, label: 'Inventario', icon: FiPackage },
  { to: ROUTES.USERS, label: 'Usuarios', icon: FiUsers, adminOnly: true },
  {
    to: ROUTES.CATALOGS,
    label: 'Catálogos',
    icon: FiBook,
    children: [
      { to: ROUTES.CATEGORIES, label: 'Categorías' },
      { to: ROUTES.SUBCATEGORIES, label: 'Subcategorías' },
    ],
  },
] as const

type SidebarProps = {
  isOpen: boolean
}

const isCatalogsRoute = (pathname: string) =>
  pathname === ROUTES.CATALOGS ||
  pathname.startsWith(ROUTES.CATEGORIES) ||
  pathname.startsWith(ROUTES.SUBCATEGORIES)

export function Sidebar({ isOpen }: SidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = useAppSelector(selectIsAdmin)
  const [catalogsExpanded, setCatalogsExpanded] = useState(false)
  const navItems = allNavItems.filter(
    (item) => !('adminOnly' in item && item.adminOnly) || isAdmin
  )
  const showCatalogsSubmenu =
    catalogsExpanded || isCatalogsRoute(location.pathname)

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
          {navItems.map((item) => {
            const { to, label, icon: Icon } = item
            const children = 'children' in item ? item.children : undefined
            const isCatalogs = Array.isArray(children)
            const isActiveGroup = isCatalogs && isCatalogsRoute(location.pathname)

            if (!isCatalogs) {
              return (
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
              )
            }

            return (
              <div key={to} className="space-y-0.5">
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActiveGroup
                      ? 'bg-[#d23b3b] text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setCatalogsExpanded((prev) => !prev)}
                >
                  <Icon className="size-6 shrink-0" aria-hidden />
                  <span className="truncate flex-1 text-left">{label}</span>
                  {isOpen && (
                    <FiChevronDown
                      className={`size-4 shrink-0 transition-transform ${
                        showCatalogsSubmenu ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>
                {isOpen && showCatalogsSubmenu && children && (
                  <div className="ml-8 flex flex-col gap-0.5">
                    {children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          `flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-[#d23b3b] text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`
                        }
                      >
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
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
