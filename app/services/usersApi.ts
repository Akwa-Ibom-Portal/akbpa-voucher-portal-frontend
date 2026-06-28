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

// No real backend support yet for self-registration approval or bulk import — kept as
// local no-ops so the existing UI affordances don't hard-crash until those endpoints ship.
export async function approveUser(id: string): Promise<User> {
  throw new Error('Approving self-requested accounts is not yet supported by the API.')
}

export async function rejectUser(id: string): Promise<User> {
  throw new Error('Rejecting self-requested accounts is not yet supported by the API.')
}

export async function bulkCreateWardPAs(_rows: Array<Partial<User>>): Promise<{ created: number; errors: string[] }> {
  throw new Error('Bulk Ward PA creation is not yet supported by the API.')
}
