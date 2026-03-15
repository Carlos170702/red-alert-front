import { createAsyncThunk } from '@reduxjs/toolkit'
import type { UserFormValues } from '@/types'
import {
  getUsersService,
  createUserWithCredentialsService,
  updateUserService,
  deleteUserService,
} from '@/services/users.service'
import { updateCredentialsService } from '@/services/auth.service'
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await getUsersService()
    } catch {
      return rejectWithValue('No se pudieron cargar los usuarios')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await deleteUserService(userId)
      return userId
    } catch (error) {
      const msg =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
        'No se pudo eliminar el usuario'
      return rejectWithValue(msg)
    }
  }
)

type SubmitUserPayload = {
  form: UserFormValues
  mode: 'create' | 'edit'
  userId?: number
}

export const submitUser = createAsyncThunk(
  'users/submitUser',
  async (payload: SubmitUserPayload, { rejectWithValue }) => {
    const { form, mode, userId } = payload
    try {
      if (mode === 'create') {
        if (!form.password) {
          return rejectWithValue('La contraseña es obligatoria para un nuevo usuario')
        }
        return await createUserWithCredentialsService({
          nombre: form.nombre,
          apellido_paterno: form.apellido_paterno,
          apellido_materno: form.apellido_materno,
          telefono: form.telefono || undefined,
          username: form.username,
          password: form.password,
        })
      }
      if (mode === 'edit' && userId) {
        const user = await updateUserService(userId, {
          nombre: form.nombre,
          apellido_paterno: form.apellido_paterno,
          apellido_materno: form.apellido_materno,
          telefono: form.telefono || undefined,
        })
        await updateCredentialsService(userId, {
          username: form.username || undefined,
          password: form.password || undefined,
        })
        return user
      }
      return rejectWithValue('Datos inválidos')
    } catch (error) {
      const msg =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
        'No se pudo guardar el usuario'
      return rejectWithValue(msg)
    }
  }
)
