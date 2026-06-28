import { defineStore } from 'pinia'
import type { ReportGroupRow, ReportSummary, StatusCounts } from '~/types'
import * as reportsApi from '~/services/reportsApi'

export const useReportsStore = defineStore('reports', () => {
  const summary = ref<ReportSummary>({ statusCounts: {}, totalBatches: 0, totalBeneficiaries: 0, duplicateScanAttempts: 0, issuedButUnredeemed: 0, expired: 0 })
  const byItem = ref<ReportGroupRow[]>([])
  const byLga = ref<ReportGroupRow[]>([])
  const byWard = ref<ReportGroupRow[]>([])
  const byGender = ref<ReportGroupRow[]>([])
  const inventory = ref<StatusCounts>({})
  const loading = ref(false)

  /** The real reports endpoints only accept a programmeCycleId filter — no LGA/item/status/
   *  gender/date-range filters exist server-side despite the Developer Guide §8 listing them. */
  const programmeCycleId = ref('')

  async function fetchAll() {
    loading.value = true
    try {
      const filters = { programmeCycleId: programmeCycleId.value || undefined }
      const [s, item, lga, ward, gender] = await Promise.all([
        reportsApi.getSummary(filters),
        reportsApi.getByItem(filters),
        reportsApi.getByLga(filters),
        reportsApi.getByWard(filters),
        reportsApi.getByGender(filters),
      ])
      summary.value = s
      byItem.value = item
      byLga.value = lga
      byWard.value = ward
      byGender.value = gender
    } finally {
      loading.value = false
    }
  }

  async function fetchInventory(voucherBatchId?: string) {
    inventory.value = await reportsApi.getInventory(voucherBatchId)
  }

  async function exportReport(type: reportsApi.ExportType, format: reportsApi.ExportFormat) {
    return reportsApi.exportReport(type, format, { programmeCycleId: programmeCycleId.value || undefined })
  }

  return { summary, byItem, byLga, byWard, byGender, inventory, loading, programmeCycleId, fetchAll, fetchInventory, exportReport }
})
