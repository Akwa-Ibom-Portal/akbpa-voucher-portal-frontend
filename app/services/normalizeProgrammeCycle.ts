import type { ProgrammeCycle } from '~/types'

export function normalizeProgrammeCycle(raw: any): ProgrammeCycle {
  return {
    id: String(raw.id),
    name: raw.name,
    startsOn: raw.startsOn ?? raw.starts_on,
    endsOn: raw.endsOn ?? raw.ends_on,
    isActive: raw.isActive ?? raw.is_active ?? false,
  }
}
