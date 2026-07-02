import { defineStore } from 'pinia'
import type { VoucherReceiptSession } from '~/types'
import * as voucherReceiptsApi from '~/services/voucherReceiptsApi'

export const useVoucherReceiptsStore = defineStore('voucherReceipts', () => {
  const sessions = ref<VoucherReceiptSession[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchSessions(voucherBatchId?: string) {
    loading.value = true
    error.value = ''
    try {
      sessions.value = await voucherReceiptsApi.listReceiptSessions(voucherBatchId)
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load receipt sessions'
    } finally {
      loading.value = false
    }
  }

  async function receiveFullBatch(dto: voucherReceiptsApi.ReceiveFullBatchDto) {
    const session = await voucherReceiptsApi.receiveFullBatch(dto)
    sessions.value.unshift(session)
    return session
  }

  async function receiveSelectedSerials(dto: voucherReceiptsApi.ReceiveSelectedSerialsDto) {
    const session = await voucherReceiptsApi.receiveSelectedSerials(dto)
    sessions.value.unshift(session)
    return session
  }

  async function receiveBatchExcept(dto: voucherReceiptsApi.ReceiveExceptDto) {
    const session = await voucherReceiptsApi.receiveBatchExcept(dto)
    sessions.value.unshift(session)
    return session
  }

  return { sessions, loading, error, fetchSessions, receiveFullBatch, receiveSelectedSerials, receiveBatchExcept }
})
