import type { User } from '@/models/users'
import type { UserResponse, UserListResponse } from '@/models/users'

function toUser(response: UserResponse): User {
  return {
    id: response.id,
    nombre: response.nombre ?? '',
    apellido_paterno: response.apellido_paterno ?? '',
    apellido_materno: response.apellido_materno ?? '',
    telefono: response.telefono ?? '',
    created_at: response.created_at,
    updated_at: response.updated_at,
    direccion: response.direccion ?? null,
  }
}

function toUserList(response: UserListResponse | UserResponse[]): User[] {
  const list = Array.isArray(response) ? response : []
  return list.map(toUser)
}

function fromApi(data: unknown): User[] {
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
