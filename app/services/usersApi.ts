import type { User, UserRole } from '~/types'
import { normalizeUser } from '~/services/normalizeUser'

export interface UserListParams {
  search?: string
  role?: UserRole | 'All Roles'
  status?: string
}

/** Always hits the real API — see authApi.ts for why these flows bypass the global mock toggle. */
export async function listUsers(params: UserListParams = {}): Promise<User[]> {
  const { http } = useHttp()
  const { data } = await http.get('/users')
  const body = data.data ?? data
  const list = (body.users ?? body).map((u: any) => normalizeUser(u))
  return list.filter((u: User) => {
    const matchesSearch = !params.search || `${u.fullName} ${u.email}`.toLowerCase().includes(params.search.toLowerCase())
    const matchesRole = !params.role || params.role === 'All Roles' || u.role === params.role
    return matchesSearch && matchesRole
  })
}

export interface CreateUserDto {
  fullName: string
  email: string
  password: string
  roleId: string
  roleName: UserRole
  lgaIds?: string[]
  wardIds?: string[]
}

/** Matches POST /users exactly — the admin sets the new user's password directly, and the
 *  account is active immediately (no invite/email step on this API). */
export async function createUser(dto: CreateUserDto): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.post('/users', {
    fullName: dto.fullName,
    email: dto.email,
    password: dto.password,
    roleId: dto.roleId,
    ...(dto.lgaIds?.length ? { lgaIds: dto.lgaIds } : {}),
    ...(dto.wardIds?.length ? { wardIds: dto.wardIds } : {}),
  })
  const body = data.data ?? data
  return normalizeUser(body.user ?? body, dto.roleName)
}

export async function getUser(id: string): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.get(`/users/${id}`)
  const body = data.data ?? data
  return normalizeUser(body.user ?? body)
}

export interface UpdateUserDto {
  fullName?: string
  phone?: string
  roleId?: string
  roleName?: UserRole
  lgaIds?: string[]
  wardIds?: string[]
}

/** Matches PUT /users/:id — same either-scope-or-the-other rule as create applies here too. */
export async function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  const { http } = useHttp()
  const needsWard = !!dto.wardIds?.length
  const { data } = await http.put(`/users/${id}`, {
    ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
    ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
    ...(dto.roleId !== undefined ? { roleId: dto.roleId } : {}),
    ...(needsWard ? { wardIds: dto.wardIds } : (dto.lgaIds?.length ? { lgaIds: dto.lgaIds } : {})),
  })
  const body = data.data ?? data
  return normalizeUser(body.user ?? body, dto.roleName)
}

export async function setUserStatus(id: string, isActive: boolean): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.patch(`/users/${id}/status`, { isActive })
  const body = data.data ?? data
  return normalizeUser(body.user ?? body)
}

/** The backend emails the new password rather than returning it — this throws if the email
 *  provider isn't configured/reachable, which the caller should surface to the admin. */
export async function resetUserPassword(id: string): Promise<void> {
  const { http } = useHttp()
  await http.post(`/users/${id}/reset-password`)
}

/** DELETE here is a soft-deactivate (same effect as setUserStatus(id, false)), kept as a
 *  distinct action in the UI since the API exposes it as its own endpoint. */
export async function deleteUser(id: string): Promise<User> {
  const { http } = useHttp()
  const { data } = await http.delete(`/users/${id}`)
  const body = data.data ?? data
  return normalizeUser(body.user ?? body)
}

