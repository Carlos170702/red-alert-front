import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'

export function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to={ROUTES.HOME}>Volver al inicio</Link>
    </div>
  )
}
