import { defineStore } from 'pinia'
import type { FoodItem, ReportSummary } from '~/types'
import * as reportsApi from '~/services/reportsApi'

export const useReportsStore = defineStore('reports', () => {
  const summary = ref<ReportSummary>({ generated: 0, allocated: 0, issued: 0, redeemed: 0, expired: 0, pendingRedemption: 0 })
  const byItem = ref<Awaited<ReturnType<typeof reportsApi.getByItem>>>([])
  const byLga = ref<Awaited<ReturnType<typeof reportsApi.getByLga>>>([])
  const byGender = ref<Awaited<ReturnType<typeof reportsApi.getByGender>>>({ female: { count: 0, redeemed: 0 }, male: { count: 0, redeemed: 0 } })
  const loading = ref(false)

  const lgaFilter = ref('')
  const itemFilter = ref<FoodItem | ''>('')

  async function fetchAll() {
    loading.value = true
    try {
      const filters = { lgaId: lgaFilter.value || undefined, foodItem: itemFilter.value || undefined }
      const [s, item, lga, gender] = await Promise.all([
        reportsApi.getSummary(filters),
        reportsApi.getByItem(),
        reportsApi.getByLga(),
        reportsApi.getByGender(),
      ])
      summary.value = s
      byItem.value = item
      byLga.value = lga
      byGender.value = gender
    } finally {
      loading.value = false
    }
  }

  return { summary, byItem, byLga, byGender, loading, lgaFilter, itemFilter, fetchAll }
})
