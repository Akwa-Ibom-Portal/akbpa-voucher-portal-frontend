import type { User, UserRole, UserStatus } from '~/types'
import { mockUsers } from '~/data/mock'
import { mockDelay } from '~/composables/useHttp'

export interface UserListParams {
  search?: string
  role?: UserRole | 'All Roles'
  status?: UserStatus | 'All'
}

export async function listUsers(params: UserListParams = {}): Promise<User[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/users', { params })
    return data
  }

  await mockDelay()
  return mockUsers.filter((u) => {
    const matchesSearch = !params.search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(params.search.toLowerCase())
    const matchesRole = !params.role || params.role === 'All Roles' || u.role === params.role
    const matchesStatus = !params.status || params.status === 'All' || u.status === params.status
    return matchesSearch && matchesRole && matchesStatus
  })
}

export async function approveUser(id: string): Promise<User> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.patch(`/users/${id}/approve`)
    return data
  }
  await mockDelay(200)
  const u = mockUsers.find(u => u.id === id)
  if (!u) throw new Error('User not found')
  u.status = 'Active'
  u.isActive = true
  return u
}

export async function rejectUser(id: string): Promise<User> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.patch(`/users/${id}/reject`)
    return data
  }
  await mockDelay(200)
  const u = mockUsers.find(u => u.id === id)
  if (!u) throw new Error('User not found')
  u.status = 'Rejected'
  u.isActive = false
  return u
}

export interface InviteUserDto {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  lgaId?: string
  wardId?: string
  invitedBy: string
}

/** Admin-initiated onboarding: the account is created up front, with a role/scope already
 *  assigned by SuperAdmin, and the invitee only ever sets their own password. No separate
 *  approval step needed since the admin vetted them by inviting them in the first place. */
export async function inviteUser(dto: InviteUserDto): Promise<{ user: User; inviteLink: string }> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/users/invite', dto)
    return data
  }
  await mockDelay(500)
  if (mockUsers.some(u => u.email.toLowerCase() === dto.email.toLowerCase())) {
    throw new Error('A user with this email already exists.')
  }
  const inviteToken = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const user: User = {
    id: `u-${Date.now()}`,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    role: dto.role,
    lgaId: dto.lgaId,
    wardId: dto.wardId,
    isActive: false,
    status: 'Invited',
    inviteToken,
    invitedBy: dto.invitedBy,
    createdAt: new Date().toISOString(),
  }
  mockUsers.push(user)
  return { user, inviteLink: `/accept-invite?token=${inviteToken}` }
}

export async function resendInvite(id: string): Promise<{ inviteLink: string }> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post(`/users/${id}/resend-invite`)
    return data
  }
  await mockDelay(300)
  const u = mockUsers.find(u => u.id === id)
  if (!u) throw new Error('User not found')
  if (!u.inviteToken) u.inviteToken = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  return { inviteLink: `/accept-invite?token=${u.inviteToken}` }
}

export async function bulkCreateWardPAs(rows: Array<Partial<User>>): Promise<{ created: number; errors: string[] }> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/users/bulk-ward-pa', { rows })
    return data
  }
  await mockDelay(600)
  return { created: rows.length, errors: [] }
}
