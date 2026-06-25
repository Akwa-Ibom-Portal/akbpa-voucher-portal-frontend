import { defineStore } from 'pinia'
import type { Beneficiary } from '~/types'
import * as beneficiariesApi from '~/services/beneficiariesApi'

export const useBeneficiariesStore = defineStore('beneficiaries', () => {
  const beneficiaries = ref<Beneficiary[]>([])
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const lgaFilter = ref('')
  const wardFilter = ref('')
  const genderFilter = ref<'Male' | 'Female' | 'All'>('All')

  async function fetchBeneficiaries(overrides: Partial<{ search: string; lgaId: string; wardId: string; gender: 'Male' | 'Female' | 'All' }> = {}) {
    loading.value = true
    error.value = ''
    try {
      beneficiaries.value = await beneficiariesApi.listBeneficiaries({
        search: overrides.search ?? (search.value || undefined),
        lgaId: overrides.lgaId ?? (lgaFilter.value || undefined),
        wardId: overrides.wardId ?? (wardFilter.value || undefined),
        gender: overrides.gender ?? genderFilter.value,
      })
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load beneficiaries'
    } finally {
      loading.value = false
    }
  }

  async function addBeneficiary(payload: Omit<Beneficiary, 'id' | 'voucherStatus'>) {
    const created = await beneficiariesApi.addBeneficiary(payload)
    beneficiaries.value.unshift(created)
    return created
  }

  async function uploadExcel(file: File) {
    return beneficiariesApi.uploadBeneficiariesExcel(file)
  }

  return {
    beneficiaries, loading, error, search, lgaFilter, wardFilter, genderFilter,
    fetchBeneficiaries, addBeneficiary, uploadExcel,
  }
})
