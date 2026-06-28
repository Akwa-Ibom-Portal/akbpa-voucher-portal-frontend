import type { ProgrammeCycle } from '~/types'
import { normalizeProgrammeCycle } from '~/services/normalizeProgrammeCycle'

export async function listProgrammeCycles(): Promise<ProgrammeCycle[]> {
  const { http } = useHttp()
  const { data } = await http.get('/programme-cycles')
  const body = data.data ?? data
  const list = body.programmeCycles ?? body
  return list.map(normalizeProgrammeCycle)
}

export async function getProgrammeCycle(id: string): Promise<ProgrammeCycle> {
  const { http } = useHttp()
  const { data } = await http.get(`/programme-cycles/${id}`)
  const body = data.data ?? data
  return normalizeProgrammeCycle(body.programmeCycle ?? body)
}

export interface CreateProgrammeCycleDto {
  name: string
  startsOn: string
  endsOn: string
  isActive?: boolean
}

export async function createProgrammeCycle(dto: CreateProgrammeCycleDto): Promise<ProgrammeCycle> {
  const { http } = useHttp()
  const { data } = await http.post('/programme-cycles', dto)
  const body = data.data ?? data
  return normalizeProgrammeCycle(body.programmeCycle ?? body)
}

export interface UpdateProgrammeCycleDto {
  name?: string
  startsOn?: string
  endsOn?: string
}

export async function updateProgrammeCycle(id: string, dto: UpdateProgrammeCycleDto): Promise<ProgrammeCycle> {
  const { http } = useHttp()
  const { data } = await http.patch(`/programme-cycles/${id}`, dto)
  const body = data.data ?? data
  return normalizeProgrammeCycle(body.programmeCycle ?? body)
}

export async function activateProgrammeCycle(id: string): Promise<ProgrammeCycle> {
  const { http } = useHttp()
  const { data } = await http.patch(`/programme-cycles/${id}/activate`)
  const body = data.data ?? data
  return normalizeProgrammeCycle(body.programmeCycle ?? body)
}
