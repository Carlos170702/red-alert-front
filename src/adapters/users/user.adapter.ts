import type { UserResponse, UserListResponse } from '@/models/users'
import type { UserWithOptionalUsername } from '@/types'

function toUser(response: UserResponse): UserWithOptionalUsername {
  const base = {
    id: response.id,
    nombre: response.nombre ?? '',
    apellido_paterno: response.apellido_paterno ?? '',
    apellido_materno: response.apellido_materno ?? '',
    telefono: response.telefono ?? '',
    created_at: response.created_at,
    updated_at: response.updated_at,
    direccion: response.direccion ?? null,
  }
  const extra: Pick<UserWithOptionalUsername, 'username' | 'role_id'> = {}
  if (response.username !== undefined && response.username !== null) extra.username = response.username
  if (response.role_id !== undefined && response.role_id !== null) extra.role_id = response.role_id
  return { ...base, ...extra }
}

function toUserList(response: UserListResponse | UserResponse[]): UserWithOptionalUsername[] {
  const list = Array.isArray(response) ? response : []
  return list.map(toUser)
}

function fromApi(data: unknown): UserWithOptionalUsername[] {
  if (Array.isArray(data)) {
    return toUserList(data as UserResponse[])
  }
  const obj = data as { users?: UserResponse[] }
  if (obj?.users && Array.isArray(obj.users)) {
    return toUserList(obj.users)
  }
  return []
}

export const usersAdapter = {
  toUser,
  toUserList,
  fromApi,
}
