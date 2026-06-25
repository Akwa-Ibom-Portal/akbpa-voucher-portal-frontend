import type { Lga, Ward } from '~/types'
import { lgas, wards } from '~/data/lgas'
import { mockDelay } from '~/composables/useHttp'

export async function listLgas(): Promise<Lga[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/lgas')
    return data
  }
  await mockDelay(100)
  return lgas
}

export async function listWards(lgaId?: string): Promise<Ward[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/wards', { params: { lgaId } })
    return data
  }
  await mockDelay(100)
  return lgaId ? wards.filter(w => w.lgaId === lgaId) : wards
}
