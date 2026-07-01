import { defineStore } from 'pinia'
import type { VoucherIssuance } from '~/types'
import * as voucherIssuancesApi from '~/services/voucherIssuancesApi'

export const useVoucherIssuancesStore = defineStore('voucherIssuances', () => {
  const issuances = ref<VoucherIssuance[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchIssuances(wardId?: string) {
    loading.value = true
    error.value = ''
    try {
      issuances.value = await voucherIssuancesApi.listIssuances({ wardId })
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load issuances'
    } finally {
      loading.value = false
    }
  }

  async function fetchByBeneficiary(beneficiaryId: string) {
    return voucherIssuancesApi.listIssuancesByBeneficiary(beneficiaryId)
  }

  async function issueVoucher(dto: voucherIssuancesApi.IssueVoucherDto) {
    const issuance = await voucherIssuancesApi.issueVoucher(dto)
    issuances.value.unshift(issuance)
    return issuance
  }

  return { issuances, loading, error, fetchIssuances, fetchByBeneficiary, issueVoucher }
})
