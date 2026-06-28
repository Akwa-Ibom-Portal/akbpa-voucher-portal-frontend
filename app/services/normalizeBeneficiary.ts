import type { Beneficiary, BeneficiaryVoucherHistoryEntry } from '~/types'

export function normalizeBeneficiary(raw: any): Beneficiary {
  const isActive = raw.isActive ?? raw.is_active
  return {
    id: String(raw.id),
    beneficiaryCode: raw.beneficiaryCode ?? raw.beneficiary_code,
    fullName: raw.fullName ?? raw.full_name,
    gender: raw.gender,
    phone: raw.phone ?? undefined,
    lgaId: String(raw.lgaId ?? raw.lga_id),
    lgaName: raw.lgaName ?? raw.lga_name,
    wardId: String(raw.wardId ?? raw.ward_id),
    wardName: raw.wardName ?? raw.ward_name,
    address: raw.address ?? undefined,
    community: raw.community ?? undefined,
    householdSize: raw.householdSize ?? raw.household_size,
    status: raw.status ?? (isActive === false ? 'Inactive' : 'Active'),
    createdAt: raw.createdAt ?? raw.created_at,
  }
}

export function normalizeVoucherHistoryEntry(raw: any): BeneficiaryVoucherHistoryEntry {
  return {
    serialNumber: raw.serialNumber ?? raw.serial_number,
    foodItem: raw.foodItem ?? raw.food_item,
    status: raw.status,
    issuedAt: raw.issuedAt ?? raw.issued_at,
    redeemedAt: raw.redeemedAt ?? raw.redeemed_at,
    wardId: raw.wardId !== undefined ? String(raw.wardId) : (raw.ward_id !== undefined ? String(raw.ward_id) : undefined),
  }
}
