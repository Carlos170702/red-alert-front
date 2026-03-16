/**
 * Generates a username from name and apellido paterno (normalized, no accents, alphanumeric + random suffix).
 */
export function generateUsernameFromName(nombre: string, apellidoPaterno: string): string {
  const first = (nombre?.trim().split(' ')[0] || 'user').trim() || 'user'
  const ap = (apellidoPaterno?.trim().split(' ')[0] || '').trim()
  const base = first + ap
  const normalized = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
  const suffix = Math.floor(Math.random() * 1000)
  return `${normalized || 'user'}${suffix}`
}

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!$%&?'

/**
 * Generates a random password of the given length (default 10).
 */
export function generateRandomPassword(length = 10): string {
  let pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += PASSWORD_CHARS.charAt(Math.floor(Math.random() * PASSWORD_CHARS.length))
  }
  return pwd
}
