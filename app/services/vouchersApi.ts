import type { Voucher } from '~/types'
import { normalizeVoucher } from '~/services/normalizeVoucher'

/** Only remaining direct voucher-level action — everything else (generation, allocation,
 *  issuance, redemption) is its own resource per the real API. See voucherBatchesApi.ts,
 *  voucherAllocationsApi.ts, voucherIssuancesApi.ts and voucherRedemptionsApi.ts. */
export async function cancelVoucherBySerial(serial: string, reason: string): Promise<Voucher> {
  const { http } = useHttp()
  const { data } = await http.post(`/vouchers/${serial}/cancel`, { reason })
  const body = data.data ?? data
  return normalizeVoucher(body.voucher ?? body)
}
