import type { User, UserRole } from '~/types'
import { mockUsers } from '~/data/mock'
import { mockDelay } from '~/composables/useHttp'

export const MOCK_VERIFICATION_CODE = '123456'

export interface LoginResult {
  accessToken: string
  user: User
}

export async function login(role: UserRole, email: string, password: string): Promise<LoginResult> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/auth/login', { email, password })
    return data
  }

  await mockDelay()
  if (!password) throw new Error('Password is required')

  const matched = mockUsers.find(u => u.role === role) ?? mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!matched) throw new Error('No account found for this role')
  if (matched.status === 'PendingApproval') throw new Error('This account is awaiting SuperAdmin approval.')
  if (matched.status === 'Suspended' || matched.status === 'Rejected') throw new Error('This account cannot sign in. Contact your administrator.')

  return { accessToken: `mock-token-${matched.id}`, user: matched }
}

export async function requestEmailVerification(email: string): Promise<void> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    await http.post('/auth/request-verification', { email })
    return
  }
  await mockDelay()
  if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
}

export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/auth/verify-email', { email, code })
    return data.valid
  }
  await mockDelay(150)
  return code === MOCK_VERIFICATION_CODE
}

export async function submitRegistration(profile: Omit<User, 'id' | 'isActive' | 'status' | 'createdAt'>): Promise<User> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/auth/register', profile)
    return data
  }
  await mockDelay()
  const created: User = {
    ...profile,
    id: `u-${Date.now()}`,
    isActive: false,
    status: 'PendingApproval',
    createdAt: new Date().toISOString(),
  }
  mockUsers.push(created)
  return created
}

export async function requestPasswordReset(email: string): Promise<string | null> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/auth/password-reset', { email })
    return data.token ?? null
  }
  await mockDelay()
  const matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!matched) return null // never reveal whether the email exists
  return `mock-reset-token-${matched.id}`
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    await http.post('/auth/reset-password', { token, newPassword })
    return
  }
  await mockDelay()
  if (newPassword.length < 8) throw new Error('Password must be at least 8 characters.')
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    await http.post('/auth/change-password', { currentPassword, newPassword })
    return
  }
  await mockDelay()
  if (!currentPassword) throw new Error('Current password is required.')
  if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.')
}

export async function getInviteByToken(token: string): Promise<User | null> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/auth/invite', { params: { token } })
    return data
  }
  await mockDelay(200)
  return mockUsers.find(u => u.inviteToken === token && u.status === 'Invited') ?? null
}

export async function acceptInvite(token: string, password: string): Promise<LoginResult> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/auth/accept-invite', { token, password })
    return data
  }
  await mockDelay(500)
  if (password.length < 8) throw new Error('Password must be at least 8 characters.')
  const user = mockUsers.find(u => u.inviteToken === token && u.status === 'Invited')
  if (!user) throw new Error('This invite link is invalid or has already been used.')
  user.status = 'Active'
  user.isActive = true
  user.inviteToken = undefined
  return { accessToken: `mock-token-${user.id}`, user }
}

export async function updateProfile(id: string, updates: Partial<User>): Promise<User> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.patch(`/users/${id}`, updates)
    return data
  }
  await mockDelay(150)
  const indexed = mockUsers.find(u => u.id === id)
  if (!indexed) throw new Error('User not found')
  Object.assign(indexed, updates)
  return indexed
}
