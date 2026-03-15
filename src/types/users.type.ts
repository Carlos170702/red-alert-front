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
}

export type UserWithOptionalUsername = User & {
  username?: string | null
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
