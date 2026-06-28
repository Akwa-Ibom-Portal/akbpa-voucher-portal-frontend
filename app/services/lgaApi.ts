import type { Lga, Ward } from '~/types'
import { lgas, wards } from '~/data/lgas'
import { mockDelay } from '~/composables/useHttp'

export async function listLgas(): Promise<Lga[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/locations/lgas')
    return normalizeLgas(data.data ?? data)
  }
  await mockDelay(100)
  return lgas
}

export async function listWards(lgaId?: string): Promise<Ward[]> {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.get('/locations/wards', { params: lgaId ? { lgaId } : undefined })
    return normalizeWards(data.data ?? data)
  }
  await mockDelay(100)
  return lgaId ? wards.filter(w => w.lgaId === lgaId) : wards
}

function normalizeLgas(body: any): Lga[] {
  const list = body.lgas ?? body
  return list.map((l: any) => ({ id: String(l.id), name: l.name, code: l.code }))
}

function normalizeWards(body: any): Ward[] {
  const list = body.wards ?? body
  return list.map((w: any) => ({
    id: String(w.id),
    name: w.name,
    code: w.code,
    lgaId: String(w.lgaId ?? w.lga_id),
    lgaName: w.lgaName ?? w.lga_name,
  }))
}

/**
 * Add User (Users page) submits real roleId/lgaIds/wardIds to POST /users, so its LGA/Ward
 * pickers always read from the live API — independent of the global mock-API toggle that the
 * shared lgaStore (used by the still-mocked beneficiaries/vouchers pages) respects above.
 */
export async function listLgasFromApi(): Promise<Lga[]> {
  const { http } = useHttp()
  const { data } = await http.get('/locations/lgas')
  return normalizeLgas(data.data ?? data)
}

export async function listWardsFromApi(lgaId?: string): Promise<Ward[]> {
  const { http } = useHttp()
  const { data } = await http.get('/locations/wards', { params: lgaId ? { lgaId } : undefined })
  return normalizeWards(data.data ?? data)
}
