import type { FoodItem, Voucher, VoucherBatch, VoucherBatchSummary } from '~/types'
import { normalizeBatch, normalizeBatchSummary, normalizeVoucher } from '~/services/normalizeVoucher'

export interface CreateBatchDto {
  batchCode: string
  programmeCycleId: string
  foodItem: FoodItem
  bagSize: string
  quantity: number
  validityMonths: number
  year: number
}

export async function createBatch(dto: CreateBatchDto): Promise<VoucherBatch> {
  const { http } = useHttp()
  const { data } = await http.post('/voucher-batches', dto)
  const body = data.data ?? data
  return normalizeBatch(body.batch ?? body)
}

export async function listBatches(): Promise<VoucherBatch[]> {
  const { http } = useHttp()
  const { data } = await http.get('/voucher-batches')
  const body = data.data ?? data
  const list = body.batches ?? body
  return list.map(normalizeBatch)
}

export async function getBatch(id: string): Promise<VoucherBatch> {
  const { http } = useHttp()
  const { data } = await http.get(`/voucher-batches/${id}`)
  const body = data.data ?? data
  return normalizeBatch(body.batch ?? body)
}

export async function listBatchVouchers(id: string): Promise<Voucher[]> {
  const { http } = useHttp()
  const { data } = await http.get(`/voucher-batches/${id}/vouchers`)
  const body = data.data ?? data
  const list = body.vouchers ?? body
  return list.map(normalizeVoucher)
}

export async function getBatchPdfUrl(id: string): Promise<string> {
  const { http } = useHttp()
  const { data } = await http.get(`/voucher-batches/${id}/pdf`, { responseType: 'blob' })
  return URL.createObjectURL(data)
}

export async function getBatchSummary(id: string): Promise<VoucherBatchSummary> {
  const { http } = useHttp()
  const { data } = await http.get(`/voucher-batches/${id}/summary`)
  const body = data.data ?? data
  return normalizeBatchSummary(body)
}

export async function cancelBatch(id: string, reason: string): Promise<VoucherBatch> {
  const { http } = useHttp()
  const { data } = await http.patch(`/voucher-batches/${id}/cancel`, { reason })
  const body = data.data ?? data
  return normalizeBatch(body.batch ?? body)
}
