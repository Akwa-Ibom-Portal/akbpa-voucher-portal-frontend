import type { AuditLogEntry } from '~/types'
import { mockAuditLogs } from '~/data/mock'
import { mockDelay } from '~/composables/useHttp'

export interface AuditListParams {
  search?: string
  module?: string
}

export async function listAuditLogs(params: AuditListParams = {}): Promise<AuditLogEntry[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/audit-logs', { params })
    return data
  }
  await mockDelay()
  return mockAuditLogs.filter((l) => {
    const matchesSearch = !params.search || `${l.action} ${l.userName} ${l.recordId}`.toLowerCase().includes(params.search.toLowerCase())
    const matchesModule = !params.module || params.module === 'All Modules' || l.module === params.module
    return matchesSearch && matchesModule
  })
}

export function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) {
  mockAuditLogs.unshift({ ...entry, id: `a-${Date.now()}`, createdAt: new Date().toISOString() })
}
