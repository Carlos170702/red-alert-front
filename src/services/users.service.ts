import { api } from '@/api'
import type { User } from '@/models/users'
import type { UserResponse } from '@/models/users'
import { usersAdapter } from '@/adapters/users'
import type {
  CreateUserPayload,
  CreateUserWithCredentialsPayload,
  UpdateUserPayload,
  UserWithOptionalUsername,
} from '@/types'
import { getApiErrorMessage } from '@/helpers'

export async function getUsersService(): Promise<UserWithOptionalUsername[]> {
  try {
    const res = await api.get('/users/')
    return usersAdapter.fromApi(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudieron cargar los usuarios'))
  }
}

export async function getUserByIdService(userId: number): Promise<User> {
  try {
    const res = await api.get<UserResponse>(`/users/${userId}`)
    return usersAdapter.toUser(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo obtener el usuario'))
  }
}

export async function createUserService(payload: CreateUserPayload): Promise<User> {
  try {
    const res = await api.post<UserResponse>('/users/', {
      nombre: payload.nombre,
      apellido_paterno: payload.apellido_paterno,
      apellido_materno: payload.apellido_materno,
      telefono: payload.telefono,
    })
    return usersAdapter.toUser(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo crear el usuario'))
  }
}

export async function createUserWithCredentialsService(
  payload: CreateUserWithCredentialsPayload
): Promise<User> {
  try {
    const user = await createUserService({
      nombre: payload.nombre,
      apellido_paterno: payload.apellido_paterno,
      apellido_materno: payload.apellido_materno,
      telefono: payload.telefono,
    })
    const registerBody: { user_id: number; username: string; password: string; role_id?: number } = {
      user_id: user.id,
      username: payload.username,
      password: payload.password,
    }
    if (payload.role_id != null) {
      registerBody.role_id = payload.role_id
    }
    await api.post('/auth/register', registerBody)
    return user
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo crear el usuario y sus credenciales'))
  }
}

export async function updateUserService(
  userId: number,
  payload: UpdateUserPayload
): Promise<User> {
  try {
    const res = await api.put<UserResponse>(`/users/${userId}`, {
      nombre: payload.nombre,
      apellido_paterno: payload.apellido_paterno,
      apellido_materno: payload.apellido_materno,
      telefono: payload.telefono,
    })
    return usersAdapter.toUser(res.data)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo actualizar el usuario'))
  }
}

export async function deleteUserService(userId: number): Promise<void> {
  try {
    await api.delete(`/users/${userId}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo eliminar el usuario'))
  }
}
