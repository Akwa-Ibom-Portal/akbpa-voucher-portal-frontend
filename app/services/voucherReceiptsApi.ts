import type { VoucherReceiptSession } from '~/types'
import { normalizeReceiptSession } from '~/services/normalizeVoucher'

export interface ReceiveFullBatchDto {
  voucherBatchId: string
  notes?: string
}

export async function receiveFullBatch(dto: ReceiveFullBatchDto): Promise<VoucherReceiptSession> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-receipts', dto)
  const body = data.data ?? data
  return normalizeReceiptSession(body.session ?? body)
}

export interface ReceiveSelectedSerialsDto {
  voucherBatchId: string
  serialNumbers: string[]
  missingSerialNumbers?: string[]
  damagedSerialNumbers?: string[]
  notes?: string
}

export async function receiveSelectedSerials(dto: ReceiveSelectedSerialsDto): Promise<VoucherReceiptSession> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-receipts', {
    voucherBatchId: dto.voucherBatchId,
    serialNumbers: dto.serialNumbers,
    missingSerialNumbers: dto.missingSerialNumbers ?? [],
    damagedSerialNumbers: dto.damagedSerialNumbers ?? [],
    notes: dto.notes,
  })
  const body = data.data ?? data
  return normalizeReceiptSession(body.session ?? body)
}

export async function listReceiptSessions(voucherBatchId?: string): Promise<VoucherReceiptSession[]> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-receipts', { params: voucherBatchId ? { voucherBatchId } : undefined })
  const body = data.data ?? data
  const list = body.sessions ?? body
  return list.map(normalizeReceiptSession)
}
