type AxiosErrorShape = {
  response?: { data?: { error?: string; message?: string } }
  message?: string
}

/**
 * Extracts a readable error message from an API/axios error or any thrown value.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message
  const err = error as AxiosErrorShape
  const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message
  return typeof msg === 'string' && msg.trim() ? msg.trim() : fallback
}

