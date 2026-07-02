import type { PagedResult } from '~/types'

export type InquiryType = 'farmer_registration' | 'supplier_registration' | 'report_issue' | 'contact_message' | 'newsletter_subscription'
export type InquiryStatus = 'received' | 'in_review' | 'resolved' | 'closed'

export interface Inquiry {
  id: string
  type: InquiryType
  fullName?: string
  email?: string
  phone?: string
  fields?: Record<string, any>
  source?: string
  status: InquiryStatus
  createdAt: string
}

function normalizeInquiry(raw: any): Inquiry {
  return {
    id: String(raw.id),
    type: raw.type,
    fullName: raw.fullName ?? raw.full_name ?? undefined,
    email: raw.email ?? undefined,
    phone: raw.phone ?? undefined,
    fields: raw.fields ?? undefined,
    source: raw.source ?? undefined,
    status: raw.status ?? 'received',
    createdAt: raw.createdAt ?? raw.created_at,
  }
}

export async function listInquiries(params: { type?: string; page?: number; limit?: number } = {}): Promise<PagedResult<Inquiry>> {
  const { http } = useHttp()
  const { data } = await http.get('/inquiries', {
    params: {
      type: params.type && params.type !== 'All' ? params.type : undefined,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  })
  const body = data.data ?? data
  const list = body.inquiries ?? body
  return {
    items: list.map(normalizeInquiry),
    pagination: body.pagination ?? { page: 1, limit: list.length, total: list.length, pages: 1 },
  }
}

export async function getInquiry(id: string): Promise<Inquiry> {
  const { http } = useHttp()
  const { data } = await http.get(`/inquiries/${id}`)
  const body = data.data ?? data
  return normalizeInquiry(body.inquiry ?? body)
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
  const { http } = useHttp()
  const { data } = await http.patch(`/inquiries/${id}/status`, { status })
  const body = data.data ?? data
  return normalizeInquiry(body.inquiry ?? body)
}
