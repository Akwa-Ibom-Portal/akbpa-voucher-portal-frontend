import { defineStore } from 'pinia'
import type { PaginationMeta, VoucherRedemption } from '~/types'
import * as voucherRedemptionsApi from '~/services/voucherRedemptionsApi'

export const useVoucherRedemptionsStore = defineStore('voucherRedemptions', () => {
  const redemptions = ref<VoucherRedemption[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
  const loading = ref(false)
  const error = ref('')

  async function fetchRedemptions(page = 1) {
    loading.value = true
    error.value = ''
    try {
      const result = await voucherRedemptionsApi.listRedemptions({ page, limit: pagination.value.limit })
      redemptions.value = result.items
      pagination.value = result.pagination
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load redemptions'
    } finally {
      loading.value = false
    }
  }

  async function validateScan(dto: voucherRedemptionsApi.ScanDto) {
    return voucherRedemptionsApi.validateScan(dto)
  }

  async function redeemScan(dto: voucherRedemptionsApi.ScanDto & { notes?: string }) {
    const redemption = await voucherRedemptionsApi.redeemScan(dto)
    redemptions.value.unshift(redemption)
    return redemption
  }

  return { redemptions, pagination, loading, error, fetchRedemptions, validateScan, redeemScan }
})
