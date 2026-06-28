import { defineStore } from 'pinia'
import type { VoucherAllocation } from '~/types'
import * as voucherAllocationsApi from '~/services/voucherAllocationsApi'

export const useVoucherAllocationsStore = defineStore('voucherAllocations', () => {
  const allocations = ref<VoucherAllocation[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchAllocations() {
    loading.value = true
    error.value = ''
    try {
      allocations.value = await voucherAllocationsApi.listAllocations()
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

  return { allocations, loading, error, fetchAllocations, allocateToWard, allocateToWards, allocateToLga, allocateToOfficer }
})
