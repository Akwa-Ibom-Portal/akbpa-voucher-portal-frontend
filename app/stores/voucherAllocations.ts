import { defineStore } from 'pinia'
import type { PaginationMeta, VoucherAllocation } from '~/types'
import * as voucherAllocationsApi from '~/services/voucherAllocationsApi'

export const useVoucherAllocationsStore = defineStore('voucherAllocations', () => {
  const allocations = ref<VoucherAllocation[]>([])
  const pagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
  const loading = ref(false)
  const error = ref('')

  async function fetchAllocations(page = 1) {
    loading.value = true
    error.value = ''
    try {
      const result = await voucherAllocationsApi.listAllocations({ page, limit: pagination.value.limit })
      allocations.value = result.items
      pagination.value = result.pagination
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load allocations'
    } finally {
      loading.value = false
    }
  }

  async function allocateToWard(dto: voucherAllocationsApi.AllocateToWardDto) {
    const allocation = await voucherAllocationsApi.allocateToWard(dto)
    allocations.value.unshift(allocation)
    return allocation
  }

  async function allocateToWards(dto: voucherAllocationsApi.AllocateToWardsDto) {
    const allocation = await voucherAllocationsApi.allocateToWards(dto)
    allocations.value.unshift(allocation)
    return allocation
  }

  async function allocateToLga(dto: voucherAllocationsApi.AllocateToLgaDto) {
    const allocation = await voucherAllocationsApi.allocateToLga(dto)
    allocations.value.unshift(allocation)
    return allocation
  }

  async function allocateToOfficer(dto: voucherAllocationsApi.AllocateToOfficerDto) {
    const allocation = await voucherAllocationsApi.allocateToOfficer(dto)
    allocations.value.unshift(allocation)
    return allocation
  }

  return { allocations, pagination, loading, error, fetchAllocations, allocateToWard, allocateToWards, allocateToLga, allocateToOfficer }
})
