/**
 * Single public endpoint backing every form on the marketing site (farmer/supplier
 * registration, report an issue, contact us, newsletter). See FORMS_API_SPEC.md for the
 * full contract — this file is the frontend half of that contract and should be updated
 * in lockstep with it.
 */
export type SubmissionType =
  | 'farmer_registration'
  | 'supplier_registration'
  | 'report_issue'
  | 'contact_message'
  | 'newsletter_subscription'

export interface SubmitInquiryDto {
  type: SubmissionType
  fullName?: string
  email?: string
  phone?: string
  fields?: Record<string, string | number | undefined>
}

export interface SubmissionResult {
  id: string
  status: string
}

export async function submitInquiry(dto: SubmitInquiryDto): Promise<SubmissionResult> {
  const { http } = useHttp()
  const route = useRoute()
  const { data } = await http.post('/public/inquiries', { ...dto, source: route.path })
  const body = data.data ?? data
  const submission = body.submission ?? body
  return {
    id: String(submission.id),
    status: submission.status ?? 'received',
  }
}
