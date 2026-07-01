import type { User, UserRole } from '~/types'

function extractIds(val: any): string[] {
  if (!val) return []
  if (Array.isArray(val))
    return val.map((item: any) => String(typeof item === 'object' && item !== null ? (item.id ?? item) : item))
  // single object or scalar
  if (typeof val === 'object' && val.id !== undefined) return [String(val.id)]
  if (typeof val === 'string' || typeof val === 'number') return [String(val)]
  return []
}

/** The API is inconsistent about casing across endpoints. Try every known shape. */
export function normalizeUser(raw: any, fallbackRole?: UserRole): User {
  if (import.meta.dev) console.info('[normalizeUser] raw:', JSON.stringify(raw, null, 2))

  const isActive = raw.isActive ?? raw.is_active ?? true

  const wardIds = extractIds(
    raw.scopes?.wards
    ?? raw.wardIds
    ?? raw.ward_ids
    ?? raw.wards
    ?? (raw.ward?.id !== undefined ? [raw.ward.id] : null)
    ?? (raw.wardId !== undefined ? [raw.wardId] : null)
    ?? (raw.ward_id !== undefined ? [raw.ward_id] : null),
  )

  const lgaIds = extractIds(
    raw.scopes?.lgas
    ?? raw.lgaIds
    ?? raw.lga_ids
    ?? raw.lgas
    ?? (raw.lga?.id !== undefined ? [raw.lga.id] : null)
    ?? (raw.lgaId !== undefined ? [raw.lgaId] : null)
    ?? (raw.lga_id !== undefined ? [raw.lga_id] : null),
  )

  return {
    id: String(raw.id),
    fullName: raw.fullName ?? raw.full_name ?? '',
    email: raw.email,
    phone: raw.phone ?? undefined,
    role: (raw.role ?? fallbackRole ?? '') as UserRole,
    roleId: raw.roleId !== undefined ? String(raw.roleId) : (raw.role_id !== undefined ? String(raw.role_id) : undefined),
    lgaIds,
    wardIds,
    isActive,
    status: isActive ? 'Active' : 'Suspended',
    createdAt: raw.createdAt ?? raw.created_at,
  }
}
