/** Generates a random password with upper/lower/digit/symbol — used to suggest a
 *  strong default when an admin creates a user (the API requires a password up front). */
export function generateStrongPassword(length = 14): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '!@#$%^&*'
  const all = upper + lower + digits + symbols

  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)]
  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)]
  const rest = Array.from({ length: length - required.length }, () => pick(all))

  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}
