import { defineStore } from 'pinia'
import type { PaginationMeta } from '~/types'
import type { Inquiry, InquiryStatus } from '~/services/inquiriesApi'
import * as inquiriesApi from '~/services/inquiriesApi'

export const useInquiriesStore = defineStore('inquiries', () => {
  const inquiries = ref<Inquiry[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
  const loading = ref(false)
  const error = ref('')
  const page = ref(1)
  const typeFilter = ref('All')

  async function fetchInquiries(targetPage = 1) {
    loading.value = true
    error.value = ''
    page.value = targetPage
    try {
      const result = await inquiriesApi.listInquiries({ type: typeFilter.value, page: targetPage, limit: pagination.value.limit })
      inquiries.value = result.items
      pagination.value = result.pagination
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load inquiries'
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: InquiryStatus) {
    const updated = await inquiriesApi.updateInquiryStatus(id, status)
    const i = inquiries.value.findIndex(q => q.id === id)
    if (i !== -1) inquiries.value[i] = updated
    return updated
  }

  return { inquiries, pagination, loading, error, page, typeFilter, fetchInquiries, updateStatus }
})
