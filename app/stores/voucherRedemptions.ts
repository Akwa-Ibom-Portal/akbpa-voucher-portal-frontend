import { defineStore } from 'pinia'
import type { VoucherRedemption } from '~/types'
import * as voucherRedemptionsApi from '~/services/voucherRedemptionsApi'

export const useVoucherRedemptionsStore = defineStore('voucherRedemptions', () => {
  const redemptions = ref<VoucherRedemption[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchRedemptions() {
    loading.value = true
    error.value = ''
    try {
      redemptions.value = await voucherRedemptionsApi.listRedemptions()
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

  return { redemptions, loading, error, fetchRedemptions, validateScan, redeemScan }
})
