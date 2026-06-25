import type { FoodItem, ReportSummary } from '~/types'
import { mockBatches, mockBeneficiaries, mockVouchers } from '~/data/mock'
import { lgas } from '~/data/lgas'
import { mockDelay } from '~/composables/useHttp'

export interface ReportFilters {
  lgaId?: string
  foodItem?: FoodItem
  status?: string
}

export async function getSummary(filters: ReportFilters = {}): Promise<ReportSummary> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/reports/summary', { params: filters })
    return data
  }
  await mockDelay()
  const vouchers = mockVouchers.filter(v =>
    (!filters.lgaId || v.lgaId === filters.lgaId) && (!filters.foodItem || v.foodItem === filters.foodItem))

  const generated = mockBatches.reduce((s, b) => s + b.quantityGenerated, 0)
  const issued = vouchers.filter(v => v.status === 'Issued' || v.status === 'Redeemed').length
  const redeemed = vouchers.filter(v => v.status === 'Redeemed').length
  const allocated = vouchers.filter(v => ['Allocated', 'Issued', 'Redeemed'].includes(v.status)).length

  return { generated, allocated, issued, redeemed, expired: 0, pendingRedemption: issued - redeemed }
}

export async function getByItem() {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/reports/by-item')
    return data
  }
  await mockDelay()
  const items: FoodItem[] = ['Rice', 'Beans', 'Garri']
  return items.map((item) => {
    const batch = mockBatches.find(b => b.foodItem === item)
    const vouchers = mockVouchers.filter(v => v.foodItem === item)
    return {
      item,
      generated: batch?.quantityGenerated ?? 0,
      issued: vouchers.filter(v => v.status === 'Issued' || v.status === 'Redeemed').length,
      redeemed: vouchers.filter(v => v.status === 'Redeemed').length,
    }
  })
}

export async function getByLga() {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/reports/by-lga')
    return data
  }
  await mockDelay()
  return lgas
    .map((lga) => {
      const onRegister = mockBeneficiaries.filter(b => b.lgaId === lga.id).length
      const vouchers = mockVouchers.filter(v => v.lgaId === lga.id)
      const issued = vouchers.filter(v => v.status === 'Issued' || v.status === 'Redeemed').length
      const redeemed = vouchers.filter(v => v.status === 'Redeemed').length
      return { lga: lga.name, onRegister, issued, redeemed, rate: issued ? Math.round((redeemed / issued) * 100) : 0 }
    })
    .filter(r => r.onRegister > 0)
    .sort((a, b) => b.redeemed - a.redeemed)
}

export async function getByGender() {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/reports/by-gender')
    return data
  }
  await mockDelay()
  const female = mockBeneficiaries.filter(b => b.gender === 'Female')
  const male = mockBeneficiaries.filter(b => b.gender === 'Male')
  const redeemedFor = (list: typeof female) => {
    const ids = new Set(list.map(b => b.id))
    return mockVouchers.filter(v => v.beneficiaryId && ids.has(v.beneficiaryId) && v.status === 'Redeemed').length
  }
  return {
    female: { count: female.length, redeemed: redeemedFor(female) },
    male: { count: male.length, redeemed: redeemedFor(male) },
  }
}
