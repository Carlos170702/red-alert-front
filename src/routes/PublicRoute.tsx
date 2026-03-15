import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTES } from '@/constants'

export function PublicRoute() {
  const { checkingAuth, isAuthenticated } = useAppSelector((state) => state.auth)

  if (checkingAuth) {
    return <div>Checking authentication...</div>
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}

