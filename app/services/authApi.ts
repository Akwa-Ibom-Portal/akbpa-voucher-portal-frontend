import type { User } from '~/types'
import { normalizeUser } from '~/services/normalizeUser'

export interface LoginResult {
  accessToken: string
  user: User
}

/**
 * Auth, profile, and password endpoints always hit the real API (api/v1) — these are the
 * flows this app integrates against the live backend, independent of the global mock-API
 * toggle still used by not-yet-integrated modules (beneficiaries, etc).
 */
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

export const MOCK_VERIFICATION_CODE = '123456'

/** No public self-registration endpoint exists on the API; this stays a local-only mock per
 *  product decision, unlinked from the real backend regardless of environment. */
export async function requestEmailVerification(_email: string): Promise<void> {
  await mockDelay()
}

export async function verifyEmailCode(_email: string, code: string): Promise<boolean> {
  await mockDelay(150)
  return code === MOCK_VERIFICATION_CODE
}

export async function submitRegistration(profile: Record<string, any>): Promise<User> {
  await mockDelay()
  return {
    id: `u-${Date.now()}`,
    fullName: profile.fullName ?? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' '),
    email: profile.email,
    phone: profile.phone,
    nin: profile.nin,
    role: profile.role,
    lgaIds: profile.lgaId ? [profile.lgaId] : undefined,
    wardIds: profile.wardId ? [profile.wardId] : undefined,
    idDocumentName: profile.idDocumentName,
    isActive: false,
    status: 'PendingApproval',
    createdAt: new Date().toISOString(),
  }
}
