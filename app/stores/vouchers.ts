import { defineStore } from 'pinia'
import type { VoucherBatch } from '~/types'
import * as vouchersApi from '~/services/vouchersApi'
import * as auditApi from '~/services/auditApi'

export const useVouchersStore = defineStore('vouchers', () => {
  const batches = ref<VoucherBatch[]>([])
  const loading = ref(false)
  const error = ref('')
  const lastGenerated = ref<VoucherBatch | null>(null)

  async function fetchBatches() {
    loading.value = true
    error.value = ''
    try {
      batches.value = await vouchersApi.listBatches()
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load batches'
    } finally {
      loading.value = false
    }
  }

  async function getBatch(id: string) {
    const cached = batches.value.find(b => b.id === id)
    if (cached) return cached
    return vouchersApi.getBatch(id)
  }

  async function generateBatch(dto: vouchersApi.GenerateBatchDto, generatedBy: string) {
    loading.value = true
    try {
      const batch = await vouchersApi.generateBatch(dto, generatedBy)
      batches.value.unshift(batch)
      lastGenerated.value = batch
      auditApi.recordAuditLog({ userId: generatedBy, userName: generatedBy, action: 'BATCH_GENERATED', module: 'vouchers', recordId: batch.id })
      return batch
    } finally {
      loading.value = false
    }
  }

  async function markSentToPrinter(id: string) {
    const updated = await vouchersApi.markSentToPrinter(id)
    const i = batches.value.findIndex(b => b.id === id)
    if (i !== -1) batches.value[i] = updated
    return updated
  }

  async function receiveBatch(id: string, payload: vouchersApi.ReceiveBatchPayload) {
    const updated = await vouchersApi.receiveBatch(id, payload)
    const i = batches.value.findIndex(b => b.id === id)
    if (i !== -1) batches.value[i] = updated
    return updated
  }

  async function allocate(dto: vouchersApi.AllocateDto) {
    const updated = await vouchersApi.allocateVouchers(dto)
    const i = batches.value.findIndex(b => b.id === dto.batchId)
    if (i !== -1) batches.value[i] = updated
    return updated
  }

  async function issueVoucher(beneficiaryId: string, foodItem: Parameters<typeof vouchersApi.issueVoucher>[1], issuedBy: string) {
    const beneficiary = await vouchersApi.issueVoucher(beneficiaryId, foodItem, issuedBy)
    auditApi.recordAuditLog({ userId: issuedBy, userName: issuedBy, action: 'VOUCHER_ISSUED', module: 'vouchers', recordId: beneficiaryId })
    return beneficiary
  }

  async function fieldIssueAndRedeem(dto: vouchersApi.FieldRedeemDto) {
    const beneficiary = await vouchersApi.fieldIssueAndRedeem(dto)
    auditApi.recordAuditLog({ userId: dto.officerId, userName: dto.officerId, action: 'FIELD_ISSUE_REDEEM', module: 'redemption', recordId: dto.beneficiaryId })
    return beneficiary
  }

  async function validateScan(tokenOrSerial: string) {
    return vouchersApi.validateScan(tokenOrSerial)
  }

  async function redeemVoucher(voucherId: string, officerId: string) {
    const voucher = await vouchersApi.redeemVoucher(voucherId, officerId)
    auditApi.recordAuditLog({ userId: officerId, userName: officerId, action: 'VOUCHER_REDEEMED', module: 'redemption', recordId: voucherId })
    return voucher
  }

  return {
    batches, loading, error, lastGenerated,
    fetchBatches, getBatch, generateBatch, markSentToPrinter, receiveBatch, allocate,
    issueVoucher, fieldIssueAndRedeem, validateScan, redeemVoucher,
  }
})
