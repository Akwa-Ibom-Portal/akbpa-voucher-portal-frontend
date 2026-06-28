import type { Beneficiary, BeneficiaryVoucherHistoryEntry, PagedResult } from '~/types'
import { normalizeBeneficiary, normalizeVoucherHistoryEntry } from '~/services/normalizeBeneficiary'

export interface BeneficiaryListParams {
  search?: string
  lgaId?: string
  wardId?: string
  gender?: 'Male' | 'Female' | 'All'
  page?: number
  limit?: number
}

export async function listBeneficiaries(params: BeneficiaryListParams = {}): Promise<PagedResult<Beneficiary>> {
  const { http } = useHttp()
  const { data } = await http.get('/beneficiaries', {
    params: {
      search: params.search || undefined,
      lgaId: params.lgaId || undefined,
      wardId: params.wardId || undefined,
      gender: params.gender && params.gender !== 'All' ? params.gender : undefined,
      page: params.page,
      limit: params.limit,
    },
  })
  const body = data.data ?? data
  const list = body.beneficiaries ?? body
  return {
    items: list.map(normalizeBeneficiary),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}

export async function getBeneficiary(id: string): Promise<Beneficiary> {
  const { http } = useHttp()
  const { data } = await http.get(`/beneficiaries/${id}`)
  const body = data.data ?? data
  return normalizeBeneficiary(body.beneficiary ?? body)
}

export interface CreateBeneficiaryDto {
  beneficiaryCode: string
  fullName: string
  gender: 'Male' | 'Female'
  phone?: string
  lgaId: string
  wardId: string
  address?: string
  householdSize?: number
}

export async function addBeneficiary(payload: CreateBeneficiaryDto): Promise<Beneficiary> {
  const { http } = useHttp()
  const { data } = await http.post('/beneficiaries', payload)
  const body = data.data ?? data
  return normalizeBeneficiary(body.beneficiary ?? body)
}

export interface UpdateBeneficiaryDto {
  fullName?: string
  phone?: string
  status?: 'Active' | 'Inactive'
}

export async function updateBeneficiary(id: string, payload: UpdateBeneficiaryDto): Promise<Beneficiary> {
  const { http } = useHttp()
  const { data } = await http.put(`/beneficiaries/${id}`, payload)
  const body = data.data ?? data
  return normalizeBeneficiary(body.beneficiary ?? body)
}

export async function downloadBeneficiaryTemplate(): Promise<Blob> {
  const { http } = useHttp()
  const { data } = await http.get('/beneficiaries/template/download', { responseType: 'blob' })
  return data
}

export async function uploadBeneficiariesCsv(csv: string): Promise<{ inserted: number; errors: string[] }> {
  const { http } = useHttp()
  const { data } = await http.post('/beneficiaries/upload', csv, { headers: { 'Content-Type': 'text/csv' } })
  const body = data.data ?? data
  return {
    inserted: body.inserted ?? body.insertedCount ?? 0,
    errors: body.errors ?? [],
  }
}

export async function getBeneficiaryVoucherHistory(id: string): Promise<BeneficiaryVoucherHistoryEntry[]> {
  const { http } = useHttp()
  const { data } = await http.get(`/beneficiaries/${id}/voucher-history`)
  const body = data.data ?? data
  const list = body.history ?? body.vouchers ?? body
  return list.map(normalizeVoucherHistoryEntry)
}
