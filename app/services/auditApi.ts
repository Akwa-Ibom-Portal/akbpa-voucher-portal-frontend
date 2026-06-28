import type { AuditLogEntry, PagedResult } from '~/types'

function normalizeAuditLog(raw: any): AuditLogEntry {
  return {
    id: String(raw.id),
    actorUserId: String(raw.actorUserId ?? raw.actor_user_id),
    actorName: raw.actorName ?? raw.actor_name ?? '',
    actorEmail: raw.actorEmail ?? raw.actor_email,
    action: raw.action,
    entityType: raw.entityType ?? raw.entity_type,
    entityId: raw.entityId !== undefined ? String(raw.entityId) : (raw.entity_id !== undefined && raw.entity_id !== null ? String(raw.entity_id) : undefined),
    details: raw.details ?? undefined,
    createdAt: raw.createdAt ?? raw.created_at,
  }
}

export interface AuditLogParams {
  page?: number
  limit?: number
}

export async function listAuditLogs(params: AuditLogParams = {}): Promise<PagedResult<AuditLogEntry>> {
  const { http } = useHttp()
  const { data } = await http.get('/audit-logs', { params: { page: params.page, limit: params.limit ?? 50 } })
  const body = data.data ?? data
  const list = body.auditLogs ?? body
  return {
    items: list.map(normalizeAuditLog),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}
