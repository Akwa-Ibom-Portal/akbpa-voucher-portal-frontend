import { defineStore } from 'pinia'
import type { PaginationMeta, VoucherIssuance } from '~/types'
import * as voucherIssuancesApi from '~/services/voucherIssuancesApi'

export const useVoucherIssuancesStore = defineStore('voucherIssuances', () => {
  const issuances = ref<VoucherIssuance[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
  const loading = ref(false)
  const error = ref('')

  async function fetchIssuances(wardId?: string, page = 1) {
    loading.value = true
    error.value = ''
    try {
      const result = await voucherIssuancesApi.listIssuances({ wardId, page, limit: pagination.value.limit })
      issuances.value = result.items
      pagination.value = result.pagination
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load issuances'
    } finally {
      loading.value = false
    }
  }

  async function fetchByBeneficiary(beneficiaryId: string) {
    const result = await voucherIssuancesApi.listIssuances({ beneficiaryId })
    return result.items
  }

  async function issueVoucher(dto: voucherIssuancesApi.IssueVoucherDto) {
    const issuance = await voucherIssuancesApi.issueVoucher(dto)
    issuances.value.unshift(issuance)
    return issuance
  }

  return { issuances, pagination, loading, error, fetchIssuances, fetchByBeneficiary, issueVoucher }
})
