import type { Beneficiary } from '~/types'
import { mockBeneficiaries } from '~/data/mock'
import { lgas } from '~/data/lgas'
import { mockDelay } from '~/composables/useHttp'

export interface BeneficiaryListParams {
  search?: string
  lgaId?: string
  wardId?: string
  gender?: 'Male' | 'Female' | 'All'
}

export async function listBeneficiaries(params: BeneficiaryListParams = {}): Promise<Beneficiary[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/beneficiaries', { params })
    return data
  }

  await mockDelay()
  return mockBeneficiaries.filter((b) => {
    const matchesSearch = !params.search || `${b.firstName} ${b.surname} ${b.beneficiaryCode} ${b.phone}`.toLowerCase().includes(params.search.toLowerCase())
    const matchesLga = !params.lgaId || b.lgaId === params.lgaId
    const matchesWard = !params.wardId || b.wardId === params.wardId
    const matchesGender = !params.gender || params.gender === 'All' || b.gender === params.gender
    return matchesSearch && matchesLga && matchesWard && matchesGender
  })
}

export async function addBeneficiary(payload: Omit<Beneficiary, 'id' | 'voucherStatus'>): Promise<Beneficiary> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.post('/beneficiaries', payload)
    return data
  }
  await mockDelay()
  const duplicate = mockBeneficiaries.find(b => b.beneficiaryCode === payload.beneficiaryCode || b.householdId === payload.householdId)
  if (duplicate) throw new Error(`Duplicate — ${payload.beneficiaryCode} or household ID already exists.`)

  const created: Beneficiary = {
    ...payload,
    id: `b-${Date.now()}`,
    voucherStatus: { Rice: 'Pending', Beans: 'Pending', Garri: 'Pending' },
  }
  mockBeneficiaries.push(created)
  return created
}

export async function uploadBeneficiariesExcel(file: File): Promise<{ inserted: number; errors: string[] }> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await http.post('/beneficiaries/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data
  }
  await mockDelay(1200)
  // Mock row-level validation response shape, matching the real ExcelService contract.
  return {
    inserted: 187,
    errors: [
      'Row 42: Duplicate — RC10433 already exists',
      `Row 88: Unknown ward 'Mbiabong East' for LGA 'Uyo'`,
    ],
  }
}

export function lgaNameFor(lgaId: string) {
  return lgas.find(l => l.id === lgaId)?.name ?? ''
}
