import type { Lga, Ward } from '~/types'

/**
 * Verified list of the 31 Local Government Areas of Akwa Ibom State.
 * Source: cross-checked public records (Wikipedia / NIPC state profile).
 */
const LGA_NAMES = [
  'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo',
  'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono',
  'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat Enin',
  'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 'Okobo', 'Onna',
  'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko',
  'Uyo',
]

/**
 * NOTE: Ward names below are PLACEHOLDERS ("Ward 1".."Ward N" per LGA),
 * distributed to total 329 wards. The Developer Guide cites 31 LGAs / 329
 * wards but does not supply the actual ward register. Replace this file's
 * ward names with the real AKBPA/Social Register ward list before go-live —
 * do not seed production with these placeholders.
 */
const WARD_COUNTS: Record<string, number> = {
  Abak: 11, 'Eastern Obolo': 10, Eket: 11, 'Esit Eket': 10, 'Essien Udim': 10,
  'Etim Ekpo': 10, Etinan: 11, Ibeno: 10, 'Ibesikpo Asutan': 11, 'Ibiono Ibom': 11,
  Ika: 10, Ikono: 10, 'Ikot Abasi': 11, 'Ikot Ekpene': 11, Ini: 10, Itu: 11,
  Mbo: 10, 'Mkpat Enin': 11, 'Nsit Atai': 10, 'Nsit Ibom': 10, 'Nsit Ubium': 11,
  'Obot Akara': 10, Okobo: 11, Onna: 11, Oron: 10, 'Oruk Anam': 11,
  'Udung Uko': 10, Ukanafun: 11, Uruan: 11, 'Urue-Offong/Oruko': 10, Uyo: 14,
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const lgas: Lga[] = LGA_NAMES.map((name, i) => ({
  id: slug(name),
  name,
  code: `LGA-${String(i + 1).padStart(2, '0')}`,
}))

export const wards: Ward[] = LGA_NAMES.flatMap((name) => {
  const lgaId = slug(name)
  const count = WARD_COUNTS[name] ?? 10
  return Array.from({ length: count }, (_, i) => ({
    id: `${lgaId}-ward-${i + 1}`,
    name: `Ward ${i + 1}`,
    lgaId,
    code: `${lgaId.toUpperCase()}-W${String(i + 1).padStart(2, '0')}`,
  }))
})

export function wardsForLga(lgaId: string) {
  return wards.filter(w => w.lgaId === lgaId)
}

export const totalWardCount = wards.length // 329
