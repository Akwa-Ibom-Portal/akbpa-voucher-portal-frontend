import type { ReportGroupRow, ReportSummary, StatusCounts } from '~/types'

export interface ReportFilters {
  programmeCycleId?: string
}

export async function getSummary(filters: ReportFilters = {}): Promise<ReportSummary> {
  const { http } = useHttp()
  const { data } = await http.get('/reports/summary', { params: filters })
  const body = data.data ?? data
  const summary = body.summary ?? body
  return {
    statusCounts: summary.statusCounts ?? {},
    totalBatches: summary.totalBatches ?? 0,
    totalBeneficiaries: summary.totalBeneficiaries ?? 0,
    duplicateScanAttempts: summary.duplicateScanAttempts ?? 0,
    issuedButUnredeemed: summary.issuedButUnredeemed ?? 0,
    expired: summary.expired ?? 0,
  }
}

/**
 * The /reports/by-* endpoints return raw groupby rows — one row per (key, status) pair
 * with a count — not pre-aggregated totals. This pivots them into one row per key with a
 * status → count breakdown, which is what the by-LGA/by-ward/by-gender/by-item tables render.
 */
function pivot(rows: any[], keyOf: (r: any) => string | null | undefined, labelOf: (r: any) => string | null | undefined): ReportGroupRow[] {
  const map = new Map<string, ReportGroupRow>()
  for (const r of rows) {
    const key = keyOf(r) ?? 'unassigned'
    const label = labelOf(r) ?? 'Unassigned'
    if (!map.has(key)) map.set(key, { key, label, statusCounts: {}, total: 0 })
    const entry = map.get(key)!
    const status = r.status ?? 'Unknown'
    const count = r.count ?? 0
    entry.statusCounts[status] = (entry.statusCounts[status] ?? 0) + count
    entry.total += count
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

async function getRows(endpoint: string, filters: ReportFilters): Promise<any[]> {
  const { http } = useHttp()
  const { data } = await http.get(endpoint, { params: filters })
  const body = data.data ?? data
  return body.rows ?? body
}

export async function getByLga(filters: ReportFilters = {}): Promise<ReportGroupRow[]> {
  const rows = await getRows('/reports/by-lga', filters)
  return pivot(rows, r => r.lgaId ?? r.lga_id, r => r.lgaName ?? r.lga_name)
}

export async function getByWard(filters: ReportFilters = {}): Promise<ReportGroupRow[]> {
  const rows = await getRows('/reports/by-ward', filters)
  return pivot(rows, r => r.wardId ?? r.ward_id, r => r.wardName ?? r.ward_name)
}

export async function getByGender(filters: ReportFilters = {}): Promise<ReportGroupRow[]> {
  const rows = await getRows('/reports/by-gender', filters)
  return pivot(rows, r => r.gender, r => r.gender)
}

export async function getByItem(filters: ReportFilters = {}): Promise<ReportGroupRow[]> {
  const rows = await getRows('/reports/by-item', filters)
  return pivot(rows, r => r.foodItem ?? r.food_item, r => r.foodItem ?? r.food_item)
}

export async function getInventory(voucherBatchId?: string): Promise<StatusCounts> {
  const { http } = useHttp()
  const { data } = await http.get('/reports/inventory', { params: voucherBatchId ? { voucherBatchId } : undefined })
  const body = data.data ?? data
  return body.counts ?? {}
}

export type ExportType = 'summary' | 'by-lga' | 'by-ward' | 'by-gender' | 'by-item' | 'inventory'
export type ExportFormat = 'csv' | 'pdf' | 'xlsx'

export async function exportReport(type: ExportType, format: ExportFormat, filters: ReportFilters = {}): Promise<Blob> {
  const { http } = useHttp()
  const { data } = await http.get('/reports/export', { params: { type, format, ...filters }, responseType: 'blob' })
  return data
}
