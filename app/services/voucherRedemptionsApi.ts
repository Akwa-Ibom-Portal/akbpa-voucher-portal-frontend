import type { FoodItem, PagedResult, Voucher, VoucherRedemption } from '~/types'
import { normalizeRedemption } from '~/services/normalizeVoucher'

export interface ValidateScanVoucher {
  id: string
  serialNumber: string
  foodItem: string
  bagSize: string
  status: string
  expiresOn?: string
  autoIssueRequired: boolean
  issuance: Record<string, any> | null
  beneficiary: Record<string, any> | null
}

export interface ValidateScanResult {
  canRedeem: boolean
  reason?: string
  message: string
  voucher?: ValidateScanVoucher
}

export interface ScanDto {
  qrToken: string
  foodItem: FoodItem
  beneficiaryId: string
  wardId: string
}

export async function validateScan(dto: ScanDto): Promise<ValidateScanResult> {
  const { http } = useHttp()
  try {
    const { data } = await http.post('/voucher-redemptions/validate', dto)
    const body = data.data ?? data
    return {
      canRedeem: body.canRedeem ?? false,
      reason: body.reason,
      message: data.message ?? body.message ?? 'Validation completed.',
      voucher: body.voucher ?? undefined,
    }
  } catch (e: any) {
    return {
      canRedeem: false,
      reason: e.response?.data?.message ?? 'This voucher could not be validated.',
      message: e.response?.data?.message ?? 'This voucher could not be validated.',
    }
  }
}

export async function redeemScan(dto: ScanDto & { notes?: string }): Promise<VoucherRedemption> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-redemptions/scan', dto)
  const body = data.data ?? data
  return normalizeRedemption(body.redemption ?? body)
}

export async function listRedemptions(params: { page?: number; limit?: number } = {}): Promise<PagedResult<VoucherRedemption>> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-redemptions', { params: { page: params.page ?? 1, limit: params.limit ?? 20 } })
  const body = data.data ?? data
  const list = body.redemptions ?? body
  return {
    items: list.map(normalizeRedemption),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}
