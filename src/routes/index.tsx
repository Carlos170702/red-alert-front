import { ROUTES } from '@/constants'
import {
  Home,
  Login,
  NotFound,
  Inventory,
  Users,
  Catalogs,
  Profile,
} from '@/pages'
import { validateToken } from '@/store/auth/thunks'
import { useAppDispatch } from '@/store/hooks'
import { Layout } from '@/layouts'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AdminRoute } from './AdminRoute'

export function AppRoutes() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(validateToken())
  }, [dispatch])

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.INVENTORY} element={<Inventory />} />
          <Route element={<AdminRoute />}>
            <Route path={ROUTES.USERS} element={<Users />} />
          </Route>
          <Route path={ROUTES.CATALOGS} element={<Catalogs />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  )
}
