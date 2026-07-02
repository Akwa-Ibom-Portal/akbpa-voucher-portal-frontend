import type { PagedResult, VoucherIssuance } from '~/types'
import { normalizeIssuance } from '~/services/normalizeVoucher'

export interface IssueVoucherDto {
  serialNumber: string
  wardId: string
  beneficiaryId: string
  notes?: string
}

export interface ValidateIssuanceDto {
  qrToken: string
  foodItem: 'Rice' | 'Beans' | 'Garri'
  wardId: string
  beneficiaryId: string
}

export interface ValidateIssuanceResult {
  canIssue: boolean
  reason?: string
  message: string
  voucher?: {
    id: string
    serialNumber: string
    foodItem: string
    bagSize: string
    status: string
    expiresOn?: string
  }
  beneficiary: Record<string, any> | null
}

export async function issueVoucher(dto: IssueVoucherDto): Promise<VoucherIssuance> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-issuances', dto)
  const body = data.data ?? data
  return normalizeIssuance(body.issuance ?? body)
}

export async function validateBeforeIssuance(dto: ValidateIssuanceDto): Promise<ValidateIssuanceResult> {
  const { http } = useHttp()
  try {
    const { data } = await http.post('/voucher-issuances/validate', dto)
    const body = data.data ?? data
    return {
      canIssue: body.canIssue ?? false,
      reason: body.reason,
      message: data.message ?? body.message ?? 'Validation completed.',
      voucher: body.voucher ?? undefined,
      beneficiary: body.beneficiary ?? null,
    }
  } catch (e: any) {
    return {
      canIssue: false,
      reason: e.response?.data?.message ?? 'Voucher could not be validated.',
      message: e.response?.data?.message ?? 'Voucher could not be validated.',
      beneficiary: null,
    }
  }
}

export async function listIssuances(params: { wardId?: string; beneficiaryId?: string; page?: number; limit?: number } = {}): Promise<PagedResult<VoucherIssuance>> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-issuances', {
    params: {
      wardId: params.wardId || undefined,
      beneficiaryId: params.beneficiaryId || undefined,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  })
  const body = data.data ?? data
  const list = body.issuances ?? body
  return {
    items: list.map(normalizeIssuance),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}
