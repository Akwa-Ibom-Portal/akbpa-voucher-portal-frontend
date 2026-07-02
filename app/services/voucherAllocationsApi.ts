import type { PagedResult, VoucherAllocation } from '~/types'
import { normalizeAllocation } from '~/services/normalizeVoucher'

export interface AllocateToWardDto {
  voucherBatchId: string
  wardId: string
  quantity: number
  notes?: string
}

export async function allocateToWard(dto: AllocateToWardDto): Promise<VoucherAllocation> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-allocations', {
    voucherBatchId: dto.voucherBatchId,
    targetType: 'WARD',
    wardId: dto.wardId,
    quantity: dto.quantity,
    notes: dto.notes,
  })
  const body = data.data ?? data
  return normalizeAllocation(body.allocation ?? body)
}

export interface AllocateToWardsDto {
  voucherBatchId: string
  targets: { wardId: string; quantity: number }[]
  notes?: string
}

export async function allocateToWards(dto: AllocateToWardsDto): Promise<VoucherAllocation> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-allocations', {
    voucherBatchId: dto.voucherBatchId,
    targetType: 'WARDS',
    targets: dto.targets,
    notes: dto.notes,
  })
  const body = data.data ?? data
  return normalizeAllocation(body.allocation ?? body)
}

export interface AllocateToLgaDto {
  voucherBatchId: string
  lgaId: string
  quantity: number
  notes?: string
}

/** The voucher_allocations table carries an lga_id column, so LGA-level targeting is
 *  supported server-side even though the Postman collection only demonstrates WARD/WARDS. */
export async function allocateToLga(dto: AllocateToLgaDto): Promise<VoucherAllocation> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-allocations', {
    voucherBatchId: dto.voucherBatchId,
    targetType: 'LGA',
    lgaId: dto.lgaId,
    quantity: dto.quantity,
    notes: dto.notes,
  })
  const body = data.data ?? data
  return normalizeAllocation(body.allocation ?? body)
}

export interface AllocateToOfficerDto {
  voucherBatchId: string
  officerId: string
  quantity: number
  notes?: string
}

/** The voucher_allocations table carries an officer_user_id column for direct officer-level
 *  allocation, also undemonstrated in the Postman collection. */
export async function allocateToOfficer(dto: AllocateToOfficerDto): Promise<VoucherAllocation> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-allocations', {
    voucherBatchId: dto.voucherBatchId,
    targetType: 'OFFICER',
    officerId: dto.officerId,
    quantity: dto.quantity,
    notes: dto.notes,
  })
  const body = data.data ?? data
  return normalizeAllocation(body.allocation ?? body)
}

export async function listAllocations(params: { page?: number; limit?: number } = {}): Promise<PagedResult<VoucherAllocation>> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-allocations', { params: { page: params.page ?? 1, limit: params.limit ?? 20 } })
  const body = data.data ?? data
  const list = body.allocations ?? body
  return {
    items: list.map(normalizeAllocation),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}
