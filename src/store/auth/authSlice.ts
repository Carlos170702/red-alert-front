import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthCredentials, AuthState, User } from '@/types'
import { clearStoredAuth, getStoredToken } from '@/services/auth.service'
import { validateToken } from './thunks'

const initialState: AuthState = {
  token: getStoredToken(),
  user: null,
  auth: null,
  checkingAuth: false,
  error: null,
  isAuthenticated: false,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User; auth: AuthCredentials }>,
    ) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.auth = action.payload.auth
      state.isAuthenticated = true
      state.error = null
    },
    updateProfileData(
      state,
      action: PayloadAction<{ user: User; auth?: AuthCredentials }>,
    ) {
      state.user = action.payload.user
      if (action.payload.auth != null) {
        state.auth = action.payload.auth
      }
    },
    clearCredentials(state) {
      clearStoredAuth()
      state.token = null
      state.user = null
      state.auth = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.checkingAuth = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.checkingAuth = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.auth = action.payload.auth ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        clearStoredAuth()
        state.checkingAuth = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string || "Token inválido";
      })
  },
})

export const { setCredentials, updateProfileData, clearCredentials } = authSlice.actions
export default authSlice.reducer

