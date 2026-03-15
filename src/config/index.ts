const API_BASE_URL = import.meta.env.API_URL ?? 'http://localhost:3000/api'

export const config = {
  apiBaseUrl: API_BASE_URL,
} as const
