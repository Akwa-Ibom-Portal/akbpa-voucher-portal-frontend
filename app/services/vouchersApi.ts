import type { Beneficiary, FoodItem, Voucher, VoucherBatch } from '~/types'
import { mockBatches, mockBeneficiaries, mockVouchers } from '~/data/mock'
import { mockDelay } from '~/composables/useHttp'

export interface GenerateBatchDto {
  foodItem: FoodItem
  quantity: number
  serialPrefix: string
  validityMonths: number
}

export async function listBatches(): Promise<VoucherBatch[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/voucher-batches')
    return data
  }
  await mockDelay()
  return mockBatches
}

export async function getBatch(id: string): Promise<VoucherBatch | undefined> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get(`/voucher-batches/${id}`)
    return data
  }
  await mockDelay(150)
  return mockBatches.find(b => b.id === id)
}

export async function generateBatch(dto: GenerateBatchDto, generatedBy: string): Promise<VoucherBatch> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/voucher-batches/generate', dto)
    return data
  }

  await mockDelay(900)
  // Mirrors the real generateBatch() service: random token -> SHA-256 hash (stored)
  // -> QR image encodes the raw token only -> serial number printed visibly.
  const year = new Date().getFullYear()
  const code = `B-${dto.foodItem.slice(0, 2).toUpperCase()}-${year}-${String(mockBatches.length + 1).padStart(3, '0')}`
  const batch: VoucherBatch = {
    id: code,
    batchCode: code,
    foodItem: dto.foodItem,
    bagSize: '5kg',
    quantityGenerated: dto.quantity,
    quantitySentToPrinter: 0,
    quantityReceived: 0,
    quantityScanned: 0,
    quantityMissing: 0,
    quantityAllocated: 0,
    quantityIssued: 0,
    quantityRedeemed: 0,
    validityMonths: dto.validityMonths,
    generatedBy,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + dto.validityMonths * 30 * 86400000).toISOString(),
    status: 'Generated',
  }
  mockBatches.unshift(batch)
  return batch
}

export interface ReceiveBatchPayload {
  /** Every individually scanned serial — not a sample. One scan per physical voucher. */
  scannedSerials: string[]
  /** Quantity the printer claims to be returning, for cross-checking against the actual scan count. */
  claimedReturned: number
  /** Finalize the session even if short of the expected count — records a Discrepancy, does not allow allocation. */
  closeOutShort?: boolean
  notes?: string
}

export async function markSentToPrinter(id: string): Promise<VoucherBatch> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.patch(`/voucher-batches/${id}/sent-to-printer`)
    return data
  }
  await mockDelay(400)
  const batch = mockBatches.find(b => b.id === id)
  if (!batch) throw new Error('Batch not found')
  batch.quantitySentToPrinter = batch.quantityGenerated
  batch.status = 'PrintedPending'
  return batch
}

export async function receiveBatch(id: string, payload: ReceiveBatchPayload): Promise<VoucherBatch> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.patch(`/voucher-batches/${id}/receive`, payload)
    return data
  }
  await mockDelay(500)
  const batch = mockBatches.find(b => b.id === id)
  if (!batch) throw new Error('Batch not found')

  const scanned = new Set(payload.scannedSerials).size
  const expected = batch.quantitySentToPrinter || batch.quantityGenerated
  batch.quantitySentToPrinter = Math.max(batch.quantitySentToPrinter, expected)
  batch.quantityScanned = scanned
  batch.quantityReceived = scanned
  batch.quantityMissing = Math.max(expected - scanned, 0)

  if (scanned >= expected) {
    batch.status = 'Received'
  } else if (payload.closeOutShort) {
    batch.status = 'Discrepancy' // every voucher must be individually scanned — a shortfall here means missing stock, not "good enough"
  } else {
    batch.status = 'PartiallyReceived' // reconciliation session still in progress
  }
  return batch
}

export interface AllocateDto {
  batchId: string
  target: 'Lga' | 'Ward' | 'Officer'
  lgaId?: string
  wardId?: string
  officerId?: string
  quantity: number
}

export async function allocateVouchers(dto: AllocateDto): Promise<VoucherBatch> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/vouchers/allocate', dto)
    return data
  }
  await mockDelay(500)
  const batch = mockBatches.find(b => b.id === dto.batchId)
  if (!batch) throw new Error('Batch not found')
  if (batch.status !== 'Received' && batch.status !== 'Allocated') {
    throw new Error('This batch is not fully reconciled yet — every voucher must be scanned in before allocation.')
  }
  const remaining = batch.quantityReceived - batch.quantityAllocated
  if (dto.quantity > remaining) throw new Error('Quantity exceeds the available unallocated balance for this batch.')
  batch.quantityAllocated += dto.quantity
  return batch
}

/** Ward PA issuance — scoped to the officer's own ward by the caller. */
export async function issueVoucher(beneficiaryId: string, foodItem: FoodItem, issuedBy: string): Promise<Beneficiary> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/vouchers/issue', { beneficiaryId, foodItem, issuedBy })
    return data
  }
  await mockDelay(400)
  const beneficiary = mockBeneficiaries.find(b => b.id === beneficiaryId)
  if (!beneficiary) throw new Error('Beneficiary not found')
  if (beneficiary.voucherStatus[foodItem] !== 'Pending') throw new Error(`${foodItem} voucher already issued to this beneficiary.`)
  beneficiary.voucherStatus[foodItem] = 'Issued'
  return beneficiary
}

export interface FieldRedeemDto {
  beneficiaryId: string
  foodItem: FoodItem
  lgaId: string
  location: string
  officerId: string
}

/** AKBPAAdmin/RedemptionOfficer field flow — combines issue + redeem in one Serializable step. */
export async function fieldIssueAndRedeem(dto: FieldRedeemDto): Promise<Beneficiary> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/vouchers/field-redeem', dto)
    return data
  }
  await mockDelay(500)
  const beneficiary = mockBeneficiaries.find(b => b.id === dto.beneficiaryId)
  if (!beneficiary) throw new Error('Beneficiary not found')
  if (beneficiary.voucherStatus[dto.foodItem] === 'Redeemed') throw new Error('This voucher has already been redeemed.')
  beneficiary.voucherStatus[dto.foodItem] = 'Redeemed'
  return beneficiary
}

export interface ScanValidationResult {
  valid: boolean
  message: string
  voucher?: Voucher
}

export async function validateScan(tokenOrSerial: string): Promise<ScanValidationResult> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/vouchers/validate-scan', { token: tokenOrSerial })
    return data
  }
  await mockDelay(300)
  // Mirrors VouchersService.redeem(): hash the token, look up by qrTokenHash,
  // run status/expiry/item-type guards, never trust client-reported status.
  const voucher = mockVouchers.find(v => v.serialNumber === tokenOrSerial || v.qrTokenHash === tokenOrSerial)
  if (!voucher) return { valid: false, message: 'QR code not recognised by this system.' }
  if (voucher.status === 'Redeemed') return { valid: false, message: 'This voucher has already been redeemed.' }
  if (voucher.status === 'Expired' || new Date(voucher.expiresAt) < new Date()) return { valid: false, message: 'This voucher has expired.' }
  if (voucher.status !== 'Issued') return { valid: false, message: 'Voucher has not been issued to a beneficiary yet.' }
  return { valid: true, message: 'Verified · hash matched.', voucher }
}

export async function redeemVoucher(voucherId: string, officerId: string): Promise<Voucher> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/vouchers/redeem', { voucherId, officerId })
    return data
  }
  await mockDelay(300)
  const voucher = mockVouchers.find(v => v.id === voucherId)
  if (!voucher) throw new Error('Voucher not found')
  voucher.status = 'Redeemed'
  voucher.redeemedAt = new Date().toISOString()
  return voucher
}
