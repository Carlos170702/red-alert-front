import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAdmin } from '@/store/auth/selectors'
import { ROUTES } from '@/constants'

export function AdminRoute() {
  const isAdmin = useAppSelector(selectIsAdmin)

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
