import type { VoucherIssuance } from '~/types'
import { normalizeIssuance } from '~/services/normalizeVoucher'

export interface IssueVoucherDto {
  serialNumber: string
  wardId: string
  beneficiaryId: string
  notes?: string
}

export async function issueVoucher(dto: IssueVoucherDto): Promise<VoucherIssuance> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-issuances', dto)
  const body = data.data ?? data
  return normalizeIssuance(body.issuance ?? body)
}

export async function listIssuances(params: { wardId?: string } = {}): Promise<VoucherIssuance[]> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-issuances', { params: { wardId: params.wardId || undefined } })
  const body = data.data ?? data
  const list = body.issuances ?? body
  return list.map(normalizeIssuance)
}

export async function listIssuancesByBeneficiary(beneficiaryId: string): Promise<VoucherIssuance[]> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-issuances', { params: { beneficiaryId } })
  const body = data.data ?? data
  const list = body.issuances ?? body
  return list.map(normalizeIssuance)
}
