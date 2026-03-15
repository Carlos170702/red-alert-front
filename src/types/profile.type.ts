import type { User } from '@/models/users'
import type { AuthCredentials } from './auth.type'
import type { Direccion } from '@/models/direccion'

export type UpdateProfilePayload = {
  nombre?: string
  apellido_paterno?: string
  apellido_materno?: string
  telefono?: string
  username?: string
  password?: string
  direccion_id?: number
  calle?: string
  colonia?: string
  codigo_postal?: string
}

export type UpdateProfileResponse = {
  user: User
  auth?: AuthCredentials
  direccion?: Direccion
}
