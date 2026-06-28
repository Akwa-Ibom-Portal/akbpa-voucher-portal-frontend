import { defineStore } from 'pinia'
import type { AuditLogEntry, PaginationMeta } from '~/types'
import * as auditApi from '~/services/auditApi'

export const useAuditLogsStore = defineStore('auditLogs', () => {
  const logs = ref<AuditLogEntry[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 50, total: 0, pages: 1 })
  const loading = ref(false)
  const page = ref(1)
  const pageSize = 50
  const search = ref('')
  const moduleFilter = ref('All Modules')

  /** Client-side only — the real /audit-logs endpoint has no search/entity-type query params. */
  const filtered = computed(() => logs.value.filter((l) => {
    const matchesSearch = !search.value || `${l.action} ${l.actorName} ${l.entityId}`.toLowerCase().includes(search.value.toLowerCase())
    const matchesModule = moduleFilter.value === 'All Modules' || l.entityType === moduleFilter.value
    return matchesSearch && matchesModule
  }))

  async function fetchLogs(targetPage = page.value) {
    loading.value = true
    try {
      page.value = targetPage
      const result = await auditApi.listAuditLogs({ page: targetPage, limit: pageSize })
      logs.value = result.items
      pagination.value = result.pagination
    } finally {
      loading.value = false
    }
  }

  return { logs, pagination, loading, page, pageSize, filtered, search, moduleFilter, fetchLogs }
})
