import type { Direccion } from '@/models/direccion'

export interface User {
  id: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  created_at?: string
  updated_at?: string
  direccion?: Direccion | null
}
