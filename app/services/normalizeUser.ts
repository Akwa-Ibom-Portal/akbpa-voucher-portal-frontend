import type { User, UserRole } from '~/types'

/** The API is inconsistent about casing across endpoints (GET /me returns fullName/isActive,
 *  GET /users returns full_name/is_active) — normalize both into the app's User shape. */
export function normalizeUser(raw: any, fallbackRole?: UserRole): User {
  const isActive = raw.isActive ?? raw.is_active ?? true
  return {
    id: String(raw.id),
    fullName: raw.fullName ?? raw.full_name ?? '',
    email: raw.email,
    phone: raw.phone ?? undefined,
    role: (raw.role ?? fallbackRole ?? '') as UserRole,
    lgaIds: (raw.scopes?.lgas ?? raw.lgaIds ?? []).map(String),
    wardIds: (raw.scopes?.wards ?? raw.wardIds ?? []).map(String),
    isActive,
    status: isActive ? 'Active' : 'Suspended',
    createdAt: raw.createdAt ?? raw.created_at,
  }
}
