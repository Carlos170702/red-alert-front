import { api } from '@/api'
import type { UpdateProfilePayload, UpdateProfileResponse } from '@/types'
import { usersAdapter } from '@/adapters/users'
import type { UserResponse } from '@/models/users'

export async function updateProfileCompleteService(
  userId: number,
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const body: Record<string, unknown> = {}
  if (payload.nombre != null && payload.nombre !== '') body.nombre = payload.nombre
  if (payload.apellido_paterno != null && payload.apellido_paterno !== '')
    body.apellido_paterno = payload.apellido_paterno
  if (payload.apellido_materno != null && payload.apellido_materno !== '')
    body.apellido_materno = payload.apellido_materno
  if (payload.telefono != null && payload.telefono !== '') body.telefono = payload.telefono
  if (payload.username != null && payload.username.trim() !== '') body.username = payload.username.trim()
  if (payload.password != null && payload.password !== '') body.password = payload.password
  if (payload.direccion_id != null) body.direccion_id = payload.direccion_id
  if (payload.calle != null && payload.calle !== '') body.calle = payload.calle
  if (payload.colonia != null && payload.colonia !== '') body.colonia = payload.colonia
  if (payload.codigo_postal != null && payload.codigo_postal !== '')
    body.codigo_postal = payload.codigo_postal

  const res = await api.put<{
    user: UserResponse
    auth?: { id: number; username: string }
    direccion?: { id: number; calle: string; colonia: string; codigo_postal: string }
  }>(`/users/${userId}/complete`, body)

  const user = usersAdapter.toUser(res.data.user)
  const auth = res.data.auth
  const direccion = res.data.direccion
  return {
    user,
    ...(auth && { auth }),
    ...(direccion && { direccion }),
  }
}
