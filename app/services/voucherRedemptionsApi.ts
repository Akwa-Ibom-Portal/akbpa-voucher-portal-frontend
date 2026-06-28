import type { FoodItem, Voucher, VoucherRedemption } from '~/types'
import { normalizeRedemption, normalizeVoucher } from '~/services/normalizeVoucher'

export interface ValidateScanResult {
  valid: boolean
  message: string
  voucher?: Voucher
}

export interface ScanDto {
  qrToken: string
  foodItem: FoodItem
  beneficiaryId: string
  wardId: string
}

/**
 * The Postman collection doesn't document a response shape for /validate — this defensively
 * reads {valid, message, voucher} if present, and otherwise treats a 2xx as valid and any
 * thrown error (4xx) as an invalid/rejected scan, surfacing the backend's message.
 *
 * As of the latest collection, validate/scan also take beneficiaryId and wardId — the
 * officer must select who they believe is presenting the voucher and confirm the ward
 * before the scan, and the backend cross-checks that against the voucher/QR token.
 */
export async function validateScan(dto: ScanDto): Promise<ValidateScanResult> {
  const { http } = useHttp()
  try {
    const { data } = await http.post('/voucher-redemptions/validate', dto)
    const body = data.data ?? data
    return {
      valid: body.valid ?? true,
      message: body.message ?? 'Verified · hash matched.',
      voucher: body.voucher ? normalizeVoucher(body.voucher) : undefined,
    }
  } catch (e: any) {
    return { valid: false, message: e.response?.data?.message ?? 'This voucher could not be validated.' }
  }
}

export async function redeemScan(dto: ScanDto & { notes?: string }): Promise<VoucherRedemption> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-redemptions/scan', dto)
  const body = data.data ?? data
  return normalizeRedemption(body.redemption ?? body)
}

export async function listRedemptions(): Promise<VoucherRedemption[]> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-redemptions')
  const body = data.data ?? data
  const list = body.redemptions ?? body
  return list.map(normalizeRedemption)
}
