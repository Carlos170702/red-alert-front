import { createAsyncThunk } from '@reduxjs/toolkit'
import { validateTokenService } from '@/services/auth.service'
import type { AuthCredentials } from '@/types'
import type { User } from '@/models/users'

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (
    _,
    { rejectWithValue }
  ): Promise<{ token: string; user: User; auth: AuthCredentials | null }> => {
    try {
      const data = await validateTokenService()
      return { token: data.token, user: data.user, auth: data.auth ?? null }
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Error validando token'
      ) as never
    }
  }
)
