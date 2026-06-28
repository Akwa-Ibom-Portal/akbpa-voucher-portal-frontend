import type { User } from '~/types'
import { normalizeUser } from '~/services/normalizeUser'

export interface LoginResult {
  accessToken: string
  user: User
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const { http } = useHttp()
  const { data } = await http.post('/auth/login', { email, password })
  const body = data.data ?? data
  return { accessToken: body.token, user: normalizeUser(body.user) }
}

export async function getMe(): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.get('/me')
  const body = data.data ?? data
  return normalizeUser(body.user ?? body)
}

export async function logout(): Promise<void> {
  const { http } = useHttp()
  try {
    await http.post('/auth/logout')
  } catch {
    // best-effort — local session is cleared by the caller regardless
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { http } = useHttp()
  await http.post('/auth/forgot-password', { email })
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const { http } = useHttp()
  await http.post('/auth/reset-password', { token, newPassword, confirmPassword: newPassword })
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const { http } = useHttp()
  await http.post('/me/change-password', { currentPassword, newPassword, confirmPassword: newPassword })
}

export async function updateProfile(updates: { fullName?: string; phone?: string }): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.patch('/me', updates)
  const body = data.data ?? data
  return normalizeUser(body.user ?? body)
}

