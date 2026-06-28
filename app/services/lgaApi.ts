import type { Lga, Ward } from '~/types'

function normalizeLga(raw: any): Lga {
  return { id: String(raw.id), name: raw.name, code: raw.code }
}

function normalizeWard(raw: any): Ward {
  return {
    id: String(raw.id),
    name: raw.name,
    code: raw.code,
    lgaId: String(raw.lgaId ?? raw.lga_id),
    lgaName: raw.lgaName ?? raw.lga_name,
  }
}

export async function listLgas(): Promise<Lga[]> {
  const { http } = useHttp()
  const { data } = await http.get('/locations/lgas')
  const body = data.data ?? data
  const list = body.lgas ?? body
  return list.map(normalizeLga)
}

export async function listWards(lgaId?: string): Promise<Ward[]> {
  const { http } = useHttp()
  const { data } = await http.get('/locations/wards', { params: lgaId ? { lgaId } : undefined })
  const body = data.data ?? data
  const list = body.wards ?? body
  return list.map(normalizeWard)
}

export interface CreateLgaDto {
  name: string
  code: string
}

export async function createLga(dto: CreateLgaDto): Promise<Lga> {
  const { http } = useHttp()
  const { data } = await http.post('/locations/lgas', dto)
  const body = data.data ?? data
  return normalizeLga(body.lga ?? body)
}

export interface CreateWardDto {
  lgaId: string
  name: string
  code: string
}

export async function createWard(dto: CreateWardDto): Promise<Ward> {
  const { http } = useHttp()
  const { data } = await http.post('/locations/wards', dto)
  const body = data.data ?? data
  return normalizeWard(body.ward ?? body)
}
