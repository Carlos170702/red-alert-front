import { api } from '@/api'
import { usersAdapter } from '@/adapters/users'

const TOKEN_KEY = 'ra_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('ra_user')
  localStorage.removeItem('ra_auth')
}

export async function validateTokenService() {
  const token = getStoredToken()

  if (!token) {
    throw new Error('No token')
  }

  const response = await api.get('/auth/validate')
  const data = response.data ?? {}
  const rawUser = data.user
  const auth = data.auth ?? null

  if (!rawUser?.id) {
    throw new Error('La validación no devolvió el usuario')
  }

  const user = usersAdapter.toUser(rawUser)
  return { token, user, auth }
}

type UpdateCredentialsPayload = {
  username?: string
  password?: string
}

export async function updateCredentialsService(
  userId: number,
  payload: UpdateCredentialsPayload
): Promise<void> {
  const body: UpdateCredentialsPayload = {}
  if (payload.username != null && payload.username.trim() !== '') {
    body.username = payload.username.trim()
  }
  if (payload.password != null && payload.password !== '') {
    body.password = payload.password
  }
  if (Object.keys(body).length === 0) return
  await api.put(`/auth/user/${userId}`, body)
}
