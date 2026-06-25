import { defineStore } from 'pinia'
import type { AuditLogEntry } from '~/types'
import * as auditApi from '~/services/auditApi'

export const useAuditLogsStore = defineStore('auditLogs', () => {
  const logs = ref<AuditLogEntry[]>([])
  const loading = ref(false)
  const search = ref('')
  const moduleFilter = ref('All Modules')

  async function fetchLogs() {
    loading.value = true
    try {
      logs.value = await auditApi.listAuditLogs({
        search: search.value || undefined,
        module: moduleFilter.value,
      })
    } finally {
      loading.value = false
    }
  }

  return { logs, loading, search, moduleFilter, fetchLogs }
})
