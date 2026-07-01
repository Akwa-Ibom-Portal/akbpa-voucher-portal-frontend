import type { Beneficiary, BeneficiaryVoucherHistoryEntry } from '~/types'

export function normalizeBeneficiary(raw: any): Beneficiary {
  const isActive = raw.isActive ?? raw.is_active
  return {
    id: String(raw.id),
    beneficiaryCode: raw.beneficiaryCode ?? raw.beneficiary_code,
    fullName: raw.fullName ?? raw.full_name,
    gender: raw.gender,
    dateOfBirth: raw.dateOfBirth ?? raw.date_of_birth,
    phone: raw.phone ?? undefined,
    lgaId: String(raw.lgaId ?? raw.lga_id),
    lgaName: raw.lgaName ?? raw.lga_name,
    lgaCode: raw.lgaCode ?? raw.lga_code,
    wardId: String(raw.wardId ?? raw.ward_id),
    wardName: raw.wardName ?? raw.ward_name,
    wardCode: raw.wardCode ?? raw.ward_code,
    address: raw.address ?? undefined,
    community: raw.community ?? undefined,
    householdSize: raw.householdSize ?? raw.household_size ?? undefined,
    householdReferenceNo: raw.householdReferenceNo ?? raw.household_reference_no,
    memberReferenceNo: raw.memberReferenceNo ?? raw.member_reference_no,
    householdNumber: raw.householdNumber !== undefined ? String(raw.householdNumber) : (raw.household_number !== undefined ? String(raw.household_number) : undefined),
    relationship: raw.relationship ?? undefined,
    labourType: raw.labourType ?? raw.labour_type,
    sourceFile: raw.sourceFile ?? raw.source_file,
    socialRegisterPart: raw.socialRegisterPart ?? raw.social_register_part,
    socialRegisterRowNumber: raw.socialRegisterRowNumber !== undefined ? String(raw.socialRegisterRowNumber) : (raw.social_register_row_number !== undefined ? String(raw.social_register_row_number) : undefined),
    socialRegisterImportedAt: raw.socialRegisterImportedAt ?? raw.social_register_imported_at,
    status: raw.status ?? (isActive === false ? 'Inactive' : 'Active'),
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
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
