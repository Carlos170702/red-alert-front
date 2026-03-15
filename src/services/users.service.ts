import { api } from '@/api'
import type { User } from '@/models/users'
import type { UserResponse } from '@/models/users'
import { usersAdapter } from '@/adapters/users'
import type {
  CreateUserPayload,
  CreateUserWithCredentialsPayload,
  UpdateUserPayload,
} from '@/types'

export async function getUsersService(): Promise<User[]> {
  const res = await api.get('/users/')
  return usersAdapter.fromApi(res.data)
}

export async function getUserByIdService(userId: number): Promise<User> {
  const res = await api.get<UserResponse>(`/users/${userId}`)
  return usersAdapter.toUser(res.data)
}

export async function createUserService(payload: CreateUserPayload): Promise<User> {
  const res = await api.post<UserResponse>('/users/', {
    nombre: payload.nombre,
    apellido_paterno: payload.apellido_paterno,
    apellido_materno: payload.apellido_materno,
    telefono: payload.telefono,
  })
  return usersAdapter.toUser(res.data)
}

export async function createUserWithCredentialsService(
  payload: CreateUserWithCredentialsPayload
): Promise<User> {
  const user = await createUserService({
    nombre: payload.nombre,
    apellido_paterno: payload.apellido_paterno,
    apellido_materno: payload.apellido_materno,
    telefono: payload.telefono,
  })
  await api.post('/auth/register', {
    user_id: user.id,
    username: payload.username,
    password: payload.password,
  })
  return user
}

export async function updateUserService(
  userId: number,
  payload: UpdateUserPayload
): Promise<User> {
  const res = await api.put<UserResponse>(`/users/${userId}`, {
    nombre: payload.nombre,
    apellido_paterno: payload.apellido_paterno,
    apellido_materno: payload.apellido_materno,
    telefono: payload.telefono,
  })
  return usersAdapter.toUser(res.data)
}

export async function deleteUserService(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`)
}
