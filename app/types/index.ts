/** Role names exactly as returned by GET /roles on the real API. */
export type UserRole =
  | 'Super Admin'
  | 'AKBPA Admin'
  | 'Voucher Receiving Officer'
  | 'LGA Voucher Officer'
  | 'Ward PA / Issuing Officer'
  | 'Redemption Officer'
  | 'Viewer / Auditor'

export const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'Super Admin', label: 'Super Admin', description: 'Manage users, roles, locations, settings, and audit logs' },
  { value: 'AKBPA Admin', label: 'AKBPA Admin', description: 'Generate batches, receive vouchers, allocate vouchers, and view reports' },
  { value: 'Voucher Receiving Officer', label: 'Voucher Receiving Officer', description: 'Receive generated physical vouchers into AKSBPA inventory and mark missing/damaged vouchers' },
  { value: 'LGA Voucher Officer', label: 'LGA Voucher Officer', description: 'Manage vouchers assigned to one LGA and allocate onward to wards or officers' },
  { value: 'Ward PA / Issuing Officer', label: 'Ward PA / Issuing Officer', description: 'Issue vouchers for assigned ward or wards' },
  { value: 'Redemption Officer', label: 'Redemption Officer', description: 'Validate and redeem issued vouchers' },
  { value: 'Viewer / Auditor', label: 'Viewer / Auditor', description: 'Read-only access to authorized reports and audit information' },
]

export type UserStatus = 'Active' | 'Suspended'

export interface Role {
  id: string
  name: UserRole
  description?: string
}

export interface User {
  id: string
  fullName: string
  email: string
  phone?: string | null
  role: UserRole
  roleId?: string
  lgaIds?: string[]
  wardIds?: string[]
  isActive: boolean
  status: UserStatus
  lastLoginAt?: string
  createdAt?: string
}

export interface Lga {
  id: string
  name: string
  code: string
}

export interface Ward {
  id: string
  name: string
  lgaId: string
  lgaName?: string
  code: string
}

export interface ProgrammeCycle {
  id: string
  name: string
  startsOn: string
  endsOn: string
  isActive: boolean
}

export type FoodItem = 'Rice' | 'Beans' | 'Garri'

export type BeneficiaryStatus = 'Active' | 'Inactive'

/**
 * Matches the real POST /beneficiaries body (beneficiaryCode/fullName/householdSize) —
 * the developer guide's first/middle/surname + household_id schema was never implemented
 * by the live API. See TECHNICAL_DOCUMENTATION.md gap report.
 */
export interface Beneficiary {
  id: string
  beneficiaryCode: string
  fullName: string
  gender: 'Male' | 'Female'
  dateOfBirth?: string
  phone?: string
  lgaId: string
  lgaName?: string
  lgaCode?: string
  wardId: string
  wardName?: string
  wardCode?: string
  address?: string
  community?: string
  householdSize?: number
  householdReferenceNo?: string
  memberReferenceNo?: string
  householdNumber?: string
  relationship?: string
  labourType?: string
  sourceFile?: string
  socialRegisterPart?: string
  socialRegisterRowNumber?: string
  socialRegisterImportedAt?: string
  status: BeneficiaryStatus
  createdAt?: string
  updatedAt?: string
}

export interface BeneficiaryVoucherHistoryEntry {
  serialNumber: string
  foodItem: FoodItem
  status: VoucherStatus
  issuedAt?: string
  redeemedAt?: string
  wardId?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PagedResult<T> {
  items: T[]
  pagination: PaginationMeta
}

/** voucher_batches.status as returned by the live API (no spaces, unlike the Developer Guide's prose). */
export type BatchStatus = 'Generated' | 'Received' | 'PartlyAllocated' | 'Allocated' | 'Closed' | 'Cancelled'

export interface VoucherBatch {
  id: string
  batchCode: string
  programmeCycleId: string
  programmeCycleName?: string
  foodItem: FoodItem
  bagSize: string
  quantity: number
  validityMonths: number
  status: BatchStatus
  serialFirst?: string
  serialLast?: string
  pdfPath?: string
  generatedBy?: string
  generatedByName?: string
  generatedAt?: string
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
}

export interface VoucherBatchSummary {
  quantityGenerated: number
  quantityReceived: number
  quantityAllocated: number
  quantityIssued: number
  quantityRedeemed: number
  quantityExpired: number
  quantityCancelled: number
  quantityMissing: number
  quantityDamaged: number
  /** Raw status → count histogram as returned alongside the totals above. */
  statusCounts?: Record<string, number>
}

/** voucher.status per Developer Guide §4 lifecycle table. */
export type VoucherStatus = 'Generated' | 'Allocated' | 'Issued' | 'Redeemed' | 'Expired' | 'Cancelled'

/** Shape returned by GET /voucher-batches/:id/vouchers — narrower than the Developer
 *  Guide's full vouchers table (no batch/lga/ward/beneficiary linkage on this endpoint). */
export interface Voucher {
  id: string
  serialNumber: string
  foodItem: FoodItem
  bagSize: string
  status: VoucherStatus
  expiresOn?: string
  generatedAt?: string
}

export interface VoucherReceiptSession {
  id: string
  voucherBatchId: string
  batchCode?: string
  receivedBy?: string
  receivedByName?: string
  expectedQuantity: number
  physicalQuantityReceived: number
  missingQuantity: number
  damagedQuantity: number
  notes?: string
  receivedAt?: string
}

/** The live schema carries lga_id/ward_id/officer_user_id columns on voucher_allocations,
 *  so LGA- and officer-level targeting are supported server-side even though the Postman
 *  collection only ever demonstrates WARD/WARDS request bodies. */
export type AllocationTargetType = 'WARD' | 'WARDS' | 'LGA' | 'OFFICER'

export interface VoucherAllocation {
  id: string
  voucherBatchId: string
  batchCode?: string
  targetType: AllocationTargetType
  lgaId?: string
  lgaName?: string
  wardId?: string
  wardName?: string
  officerId?: string
  officerName?: string
  quantity: number
  notes?: string
  allocatedBy?: string
  allocatedByName?: string
  allocatedAt?: string
}

export interface VoucherIssuance {
  id: string
  voucherId?: string
  allocationId?: string
  programmeCycleId?: string
  serialNumber: string
  foodItem?: FoodItem
  lgaId?: string
  lgaName?: string
  wardId: string
  wardName?: string
  beneficiaryId: string
  beneficiaryName?: string
  beneficiaryCode?: string
  recipientName?: string
  recipientPhone?: string
  recipientReference?: string
  issuedBy?: string
  issuedByName?: string
  notes?: string
  issuedAt?: string
}

export interface VoucherRedemption {
  id: string
  voucherId?: string
  issuanceId?: string
  serialNumber?: string
  foodItem: FoodItem
  redeemedBy?: string
  redeemedByName?: string
  redemptionPointId?: string
  redemptionPointName?: string
  notes?: string
  redeemedAt?: string
}

export interface AuditLogEntry {
  id: string
  actorUserId: string
  actorName: string
  actorEmail?: string
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, any>
  createdAt: string
}

export interface ReportSummary {
  statusCounts: Record<string, number>
  totalBatches: number
  totalBeneficiaries: number
  duplicateScanAttempts: number
  issuedButUnredeemed: number
  expired: number
}

/** Generic status → count breakdown, used for both the global inventory report and the
 *  pivoted by-LGA/by-ward/by-gender/by-item rows below — the API returns raw groupby rows
 *  (one row per key + status + count), not pre-aggregated totals. */
export type StatusCounts = Record<string, number>

export interface ReportGroupRow {
  key: string
  label: string
  statusCounts: StatusCounts
  total: number
}
