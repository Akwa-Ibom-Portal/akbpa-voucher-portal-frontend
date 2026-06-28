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
  { value: 'Voucher Receiving Officer', label: 'Voucher Receiving Officer', description: 'Receive generated physical vouchers into AKBPA inventory and mark missing/damaged vouchers' },
  { value: 'LGA Voucher Officer', label: 'LGA Voucher Officer', description: 'Manage vouchers assigned to one LGA and allocate onward to wards or officers' },
  { value: 'Ward PA / Issuing Officer', label: 'Ward PA / Issuing Officer', description: 'Issue vouchers for assigned ward or wards' },
  { value: 'Redemption Officer', label: 'Redemption Officer', description: 'Validate and redeem issued vouchers' },
  { value: 'Viewer / Auditor', label: 'Viewer / Auditor', description: 'Read-only access to authorized reports and audit information' },
]

/** 'PendingApproval' / 'Rejected' are mock-only bookkeeping states from the still-mocked
 *  self-registration flow — the real API only ever reports isActive (mapped to Active/Suspended). */
export type UserStatus = 'Active' | 'PendingApproval' | 'Suspended' | 'Rejected'

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
  nin?: string
  role: UserRole
  lgaIds?: string[]
  wardIds?: string[]
  isActive: boolean
  status: UserStatus
  avatarUrl?: string
  idDocumentName?: string
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

export type FoodItem = 'Rice' | 'Beans' | 'Garri'

export type VoucherStatus =
  | 'Generated'
  | 'Printed'
  | 'Received'
  | 'Allocated'
  | 'Issued'
  | 'Redeemed'
  | 'Expired'
  | 'Cancelled'

export type BatchStatus = 'Generated' | 'PrintedPending' | 'PartiallyReceived' | 'Discrepancy' | 'Received' | 'Allocated' | 'Closed' | 'Cancelled'

export interface Beneficiary {
  id: string
  beneficiaryCode: string
  householdId: string
  nin?: string
  firstName: string
  middleName?: string
  surname: string
  gender: 'Male' | 'Female'
  phone?: string
  lgaId: string
  wardId: string
  community?: string
  address?: string
  voucherStatus: Record<FoodItem, VoucherStatus | 'Pending'>
}

export interface VoucherBatch {
  id: string
  batchCode: string
  foodItem: FoodItem
  bagSize: string
  quantityGenerated: number
  quantitySentToPrinter: number
  quantityReceived: number
  quantityScanned: number
  quantityMissing: number
  quantityAllocated: number
  quantityIssued: number
  quantityRedeemed: number
  validityMonths: number
  generatedBy: string
  generatedAt: string
  expiresAt: string
  status: BatchStatus
}

export interface Voucher {
  id: string
  batchId: string
  serialNumber: string
  qrTokenHash: string
  foodItem: FoodItem
  bagSize: string
  status: VoucherStatus
  lgaId?: string
  wardId?: string
  beneficiaryId?: string
  generatedAt: string
  expiresAt: string
  issuedAt?: string
  redeemedAt?: string
}

export interface RedemptionLogEntry {
  id: string
  voucherId: string
  serialNumber: string
  scanResult: 'Success' | 'AlreadyRedeemed' | 'Expired' | 'NotFound' | 'NotIssued' | 'WrongItem'
  scannedBy: string
  scannedAt: string
  location?: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  recordId?: string
  ipAddress?: string
  createdAt: string
}

export interface ReportSummary {
  generated: number
  allocated: number
  issued: number
  redeemed: number
  expired: number
  pendingRedemption: number
}
