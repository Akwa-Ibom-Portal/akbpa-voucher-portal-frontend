import { defineStore } from 'pinia'
import type { Beneficiary, PaginationMeta } from '~/types'
import * as beneficiariesApi from '~/services/beneficiariesApi'

export const useBeneficiariesStore = defineStore('beneficiaries', () => {
  const beneficiaries = ref<Beneficiary[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const lgaFilter = ref('')
  const wardFilter = ref('')
  const genderFilter = ref<'Male' | 'Female' | 'All'>('All')
  const page = ref(1)
  const pageSize = 20

  async function fetchBeneficiaries(overrides: Partial<{ search: string; lgaId: string; wardId: string; gender: 'Male' | 'Female' | 'All'; page: number }> = {}) {
    loading.value = true
    error.value = ''
    if (overrides.page !== undefined) page.value = overrides.page
    try {
      const result = await beneficiariesApi.listBeneficiaries({
        search: overrides.search ?? (search.value || undefined),
        lgaId: overrides.lgaId ?? (lgaFilter.value || undefined),
        wardId: overrides.wardId ?? (wardFilter.value || undefined),
        gender: overrides.gender ?? genderFilter.value,
        page: page.value,
        limit: pageSize,
      })
      beneficiaries.value = result.items
      pagination.value = result.pagination
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load beneficiaries'
    } finally {
      loading.value = false
    }
  }

  async function addBeneficiary(payload: beneficiariesApi.CreateBeneficiaryDto) {
    const created = await beneficiariesApi.addBeneficiary(payload)
    beneficiaries.value.unshift(created)
    return created
  }

  async function updateBeneficiary(id: string, payload: beneficiariesApi.UpdateBeneficiaryDto) {
    const updated = await beneficiariesApi.updateBeneficiary(id, payload)
    const i = beneficiaries.value.findIndex(b => b.id === id)
    if (i !== -1) beneficiaries.value[i] = updated
    return updated
  }

  async function uploadCsv(csv: string) {
    return beneficiariesApi.uploadBeneficiariesCsv(csv)
  }

  function reset() {
    search.value = ''
    lgaFilter.value = ''
    wardFilter.value = ''
    genderFilter.value = 'All'
    page.value = 1
    beneficiaries.value = []
    pagination.value = { page: 1, limit: 20, total: 0, pages: 1 }
  }

  return {
    beneficiaries, pagination, loading, error, search, lgaFilter, wardFilter, genderFilter, page, pageSize,
    fetchBeneficiaries, addBeneficiary, updateBeneficiary, uploadCsv, reset,
  }
})
