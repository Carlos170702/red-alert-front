import type { User } from './auth.type'
import type { UserFormValues } from '@/schemas'

export type { UserFormValues } from '@/schemas'

export type CreateUserPayload = {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono?: string
}

export type UpdateUserPayload = {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono?: string
}

export type CreateUserWithCredentialsPayload = CreateUserPayload & {
  username: string
  password: string
  role_id?: number
}

export type UserWithOptionalUsername = User & {
  username?: string | null
  role_id?: number | null
}

export type UserModalMode = 'create' | 'edit'

export type UserModalSubmitPayload = {
  form: UserFormValues
  mode: UserModalMode
  userId?: number
}

export type UserModalProps = {
  mode: UserModalMode
  initialUser?: UserWithOptionalUsername
  open: boolean
  saving: boolean
  onClose: () => void
  onSubmit: (data: UserModalSubmitPayload) => void
}
