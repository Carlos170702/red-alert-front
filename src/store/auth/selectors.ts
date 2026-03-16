import type { RootState } from '@/store'
import { ADMIN_ROLE_ID } from '@/constants'

export const selectAuth = (state: RootState) => state.auth.auth
export const selectRoleId = (state: RootState) => state.auth.auth?.role_id
export const selectIsAdmin = (state: RootState) => selectRoleId(state) === ADMIN_ROLE_ID
