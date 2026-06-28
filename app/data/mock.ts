import type {
  User, Beneficiary, VoucherBatch, Voucher, RedemptionLogEntry, AuditLogEntry, FoodItem,
} from '~/types'
import { lgas, wards } from './lgas'

const uyo = lgas.find(l => l.name === 'Uyo')!
const ikotEkpene = lgas.find(l => l.name === 'Ikot Ekpene')!
const useOffotWard = wards.find(w => w.lgaId === uyo.id)! // placeholder "Ward 1" standing in for Use Offot

export const mockUsers: User[] = [
  { id: 'u-1', fullName: 'Super Admin', email: 'superadmin@akbpa.gov.ng', role: 'Super Admin', isActive: true, status: 'Active', lastLoginAt: '2026-06-24T08:12:00Z', createdAt: '2026-01-05T09:00:00Z' },
  { id: 'u-2', fullName: 'AKBPA Admin', email: 'admin@akbpa.gov.ng', role: 'AKBPA Admin', isActive: true, status: 'Active', lastLoginAt: '2026-06-24T07:50:00Z', createdAt: '2026-01-10T09:00:00Z' },
  { id: 'u-3', fullName: 'Grace Etuk', email: 'register@akbpa.gov.ng', role: 'AKBPA Admin', isActive: true, status: 'Active', lastLoginAt: '2026-06-23T16:30:00Z', createdAt: '2026-01-12T09:00:00Z' },
  { id: 'u-4', fullName: 'Mfon Akpabio', email: 'wardpa.useoffot@akbpa.gov.ng', role: 'Ward PA / Issuing Officer', lgaIds: [uyo.id], wardIds: [useOffotWard.id], isActive: true, status: 'Active', lastLoginAt: '2026-06-24T06:41:00Z', createdAt: '2026-02-01T09:00:00Z' },
  { id: 'u-5', fullName: 'Distribution Officer', email: 'officer.ikotekpene@akbpa.gov.ng', role: 'Redemption Officer', lgaIds: [ikotEkpene.id], isActive: true, status: 'Active', lastLoginAt: '2026-06-24T09:32:00Z', createdAt: '2026-02-03T09:00:00Z' },
  { id: 'u-6', fullName: 'Commissioner Office', email: 'viewer@akbpa.gov.ng', role: 'Viewer / Auditor', isActive: true, status: 'Active', lastLoginAt: '2026-06-20T12:00:00Z', createdAt: '2026-02-10T09:00:00Z' },
  { id: 'u-7', fullName: 'Edidiong Sampson', email: 'edidiong.sampson@gmail.com', phone: '08031234567', nin: '21098765432', role: 'Ward PA / Issuing Officer', isActive: false, status: 'PendingApproval', idDocumentName: 'staff-id-edidiong.pdf', createdAt: '2026-06-23T14:20:00Z' },
  { id: 'u-8', fullName: 'Daniel Ekong', email: 'daniel.ekong@gmail.com', phone: '08079988776', nin: '21034567890', role: 'Redemption Officer', lgaIds: [ikotEkpene.id], isActive: false, status: 'PendingApproval', idDocumentName: 'staff-id-daniel.pdf', createdAt: '2026-06-24T09:05:00Z' },
]

const firstNames = [
  'Idara', 'Uduak', 'Aniekan', 'Mbuotidem', 'Asuquo', 'Etim', 'Glory', 'Itoro', 'Emem', 'Nse',
  'Okon', 'Effiong', 'Imaobong', 'Ubong', 'Abasiama', 'Enobong', 'Edidiong', 'Eno', 'Mfon', 'Ekemini',
  'Iniobong', 'Arit', 'Otobong', 'Ifiok', 'Unwana', 'Anieti', 'Akon', 'Ima', 'Edikan', 'Daniel',
]
const surnames = [
  'Ekanem', 'Bassey', 'Akpan', 'Etim', 'Okon', 'Udoh', 'Asuquo', 'Umoh', 'Inyang', 'Akpabio',
  'Eshiet', 'Essien', 'Ekpo', 'Udofia', 'Ituen', 'Akpan', 'Sampson', 'Etuk', 'Williams', 'Edet',
  'Ekong', 'Usoro', 'Akpanika', 'Andem', 'Obot',
]

function genderFor(name: string): 'Male' | 'Female' {
  const maleNames = ['Aniekan', 'Asuquo', 'Etim', 'Okon', 'Effiong', 'Ubong', 'Ifiok', 'Anieti', 'Edikan', 'Daniel']
  return maleNames.includes(name) ? 'Male' : 'Female'
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

const statuses: Array<'Pending' | 'Issued' | 'Redeemed'> = ['Pending', 'Issued', 'Redeemed']

// Spread the register across more LGAs than just the 4 demo'd in the pptx, so
// reports/dashboard reflect a statewide register rather than a handful of LGAs.
const registerLgas = lgas.slice(0, 12)

const REGISTER_SIZE = 320

export const mockBeneficiaries: Beneficiary[] = Array.from({ length: REGISTER_SIZE }, (_, i) => {
  const fn = pick(firstNames, i)
  const sn = pick(surnames, i + 3)

  // Force a guaranteed cluster of beneficiaries into the Ward PA's own ward
  // (every 6th record) so the ward-scoped Issue Voucher screen has real data to demo.
  const forceWardPaWard = i % 6 === 0
  const lga = forceWardPaWard ? uyo : pick(registerLgas, i)
  const wardsInLga = wards.filter(w => w.lgaId === lga.id)
  const ward = forceWardPaWard ? useOffotWard : pick(wardsInLga, i)

  return {
    id: `b-${10428 + i}`,
    beneficiaryCode: `RC${10428 + i}`,
    householdId: `HH-${50000 + i}`,
    nin: `${2000000000 + i * 137}`,
    firstName: fn,
    surname: sn,
    gender: genderFor(fn),
    phone: `080${10000000 + i * 71}`,
    lgaId: lga.id,
    wardId: ward.id,
    community: ward.name,
    address: `${ward.name}, ${lga.name} LGA`,
    voucherStatus: {
      Rice: pick(statuses, i),
      Beans: pick(statuses, i + 1),
      Garri: pick(statuses, i + 2),
    },
  }
})

function makeBatch(
  code: string, item: FoodItem, qty: number, status: VoucherBatch['status'],
  scanned: number, allocated: number, issued: number, redeemed: number,
): VoucherBatch {
  return {
    id: code,
    batchCode: code,
    foodItem: item,
    bagSize: '5kg',
    quantityGenerated: qty,
    quantitySentToPrinter: qty,
    quantityReceived: scanned,
    quantityScanned: scanned,
    quantityMissing: status === 'Discrepancy' ? qty - scanned : 0,
    quantityAllocated: allocated,
    quantityIssued: issued,
    quantityRedeemed: redeemed,
    validityMonths: 3,
    generatedBy: 'u-2',
    generatedAt: '2026-04-10T09:00:00Z',
    expiresAt: '2026-09-30T23:59:59Z',
    status,
  }
}

export const mockBatches: VoucherBatch[] = [
  // Fully reconciled historically — every voucher individually scanned back in before allocation.
  makeBatch('B-RICE-2026-001', 'Rice', 15000, 'Allocated', 15000, 12500, 8420, 8420),
  makeBatch('B-BEANS-2026-001', 'Beans', 15000, 'Allocated', 15000, 11800, 7150, 7150),
  makeBatch('B-GARRI-2026-001', 'Garri', 15000, 'Allocated', 15000, 13200, 9870, 9870),
  // Mid-reconciliation — agency is still scanning this one in, not yet complete.
  makeBatch('B-RICE-2026-002', 'Rice', 5000, 'PartiallyReceived', 3180, 0, 0, 0),
  // Discrepancy example — printer returned short; flagged for investigation, blocked from allocation.
  makeBatch('B-GARRI-2026-002', 'Garri', 2000, 'Discrepancy', 1985, 0, 0, 0),
]

export const mockVouchers: Voucher[] = mockBeneficiaries.flatMap((b, i) => {
  const items: FoodItem[] = ['Rice', 'Beans', 'Garri']
  return items.map((item, j) => {
    const status = b.voucherStatus[item]
    const batch = mockBatches.find(bt => bt.foodItem === item)!
    return {
      id: `v-${b.id}-${item}`,
      batchId: batch.id,
      serialNumber: `AKBPA-${item.toUpperCase()}-2026-${String(i * 3 + j + 1).padStart(6, '0')}`,
      qrTokenHash: `hash_${b.id}_${item}`,
      foodItem: item,
      bagSize: '5kg',
      status: status === 'Pending' ? 'Allocated' : status,
      lgaId: b.lgaId,
      wardId: b.wardId,
      beneficiaryId: status !== 'Pending' ? b.id : undefined,
      generatedAt: '2026-04-10T09:00:00Z',
      expiresAt: '2026-09-30T23:59:59Z',
      issuedAt: status !== 'Pending' ? '2026-05-12T10:00:00Z' : undefined,
      redeemedAt: status === 'Redeemed' ? '2026-06-02T11:30:00Z' : undefined,
    }
  })
})

export const mockRedemptionLogs: RedemptionLogEntry[] = mockVouchers
  .filter(v => v.status === 'Redeemed')
  .map((v, i) => ({
    id: `rl-${i}`,
    voucherId: v.id,
    serialNumber: v.serialNumber,
    scanResult: 'Success',
    scannedBy: 'u-5',
    scannedAt: v.redeemedAt!,
    location: 'Ikot Ekpene · Town Hall',
  }))

export const mockAuditLogs: AuditLogEntry[] = [
  { id: 'a-1', userId: 'u-2', userName: 'AKBPA Admin', action: 'BATCH_GENERATED', module: 'vouchers', recordId: 'B-RICE-2026-001', ipAddress: '105.112.4.21', createdAt: '2026-04-10T09:00:00Z' },
  { id: 'a-2', userId: 'u-4', userName: 'Mfon Akpabio', action: 'VOUCHER_ISSUED', module: 'vouchers', recordId: 'v-b-10428-Rice', ipAddress: '105.112.9.5', createdAt: '2026-05-12T10:00:00Z' },
  { id: 'a-3', userId: 'u-5', userName: 'Distribution Officer', action: 'VOUCHER_REDEEMED', module: 'redemption', recordId: 'v-b-10428-Rice', ipAddress: '105.112.9.5', createdAt: '2026-06-02T11:30:00Z' },
  { id: 'a-4', userId: 'u-1', userName: 'Super Admin', action: 'USER_CREATED', module: 'users', recordId: 'u-6', ipAddress: '41.58.12.3', createdAt: '2026-06-20T12:00:00Z' },
]
