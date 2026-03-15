import type { User } from '@/models/users'

export type { User } from '@/models/users'

export type AuthCredentials = {
  id: number
  username: string
}

export type AuthState = {
  token: string | null;
  user: User | null;
  auth: AuthCredentials | null;
  checkingAuth: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
