import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/models/users'
import type { UserWithOptionalUsername } from '@/types'
import { fetchUsers, deleteUser, submitUser } from './user.thunks'

export type UserModalMode = 'create' | 'edit'

type UsersState = {
  list: User[]
  loading: boolean
  filter: string
  showModal: boolean
  saving: boolean
  modalMode: UserModalMode
  selectedUser: UserWithOptionalUsername | null
  error: string | null
}

const initialState: UsersState = {
  list: [],
  loading: false,
  filter: '',
  showModal: false,
  saving: false,
  modalMode: 'create',
  selectedUser: null,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload
    },
    openCreateModal(state) {
      state.modalMode = 'create'
      state.selectedUser = null
      state.showModal = true
    },
    openEditModal(state, action: PayloadAction<UserWithOptionalUsername>) {
      state.modalMode = 'edit'
      state.selectedUser = action.payload
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
      state.selectedUser = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) ?? null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = (action.payload as string) ?? null
      })
      .addCase(submitUser.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(submitUser.fulfilled, (state, action) => {
        state.saving = false
        state.showModal = false
        state.selectedUser = null
        state.error = null
        const user = action.payload
        const mode = action.meta.arg.mode
        if (mode === 'create') {
          state.list.push(user)
        } else {
          const i = state.list.findIndex((u) => u.id === user.id)
          if (i >= 0) state.list[i] = user
        }
      })
      .addCase(submitUser.rejected, (state, action) => {
        state.saving = false
        state.error = (action.payload as string) ?? null
      })
  },
})

export const { setFilter, openCreateModal, openEditModal, closeModal } = userSlice.actions
export default userSlice.reducer
