import { defineStore } from 'pinia'
import type { Voucher, VoucherBatch, VoucherBatchSummary } from '~/types'
import * as voucherBatchesApi from '~/services/voucherBatchesApi'

export const useVoucherBatchesStore = defineStore('voucherBatches', () => {
  const batches = ref<VoucherBatch[]>([])
  const loading = ref(false)
  const error = ref('')
  const lastCreated = ref<VoucherBatch | null>(null)

  async function fetchBatches() {
    loading.value = true
    error.value = ''
    try {
      batches.value = await voucherBatchesApi.listBatches()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load voucher batches'
    } finally {
      loading.value = false
    }
  }

  function replace(updated: VoucherBatch) {
    const i = batches.value.findIndex(b => b.id === updated.id)
    if (i !== -1) batches.value[i] = updated
  }

  async function getBatch(id: string) {
    const cached = batches.value.find(b => b.id === id)
    if (cached) return cached
    return voucherBatchesApi.getBatch(id)
  }

  async function createBatch(dto: voucherBatchesApi.CreateBatchDto) {
    const batch = await voucherBatchesApi.createBatch(dto)
    batches.value.unshift(batch)
    lastCreated.value = batch
    return batch
  }

  async function listVouchers(id: string, params?: Parameters<typeof voucherBatchesApi.listBatchVouchers>[1]) {
    return voucherBatchesApi.listBatchVouchers(id, params)
  }

  async function getSummary(id: string): Promise<VoucherBatchSummary> {
    return voucherBatchesApi.getBatchSummary(id)
  }

  async function downloadPdf(id: string): Promise<string> {
    return voucherBatchesApi.getBatchPdfUrl(id)
  }

  async function cancelBatch(id: string, reason: string) {
    const updated = await voucherBatchesApi.cancelBatch(id, reason)
    replace(updated)
    return updated
  }

  return {
    batches, loading, error, lastCreated,
    fetchBatches, getBatch, createBatch, listVouchers, getSummary, downloadPdf, cancelBatch,
  }
})
