export type UserRole =
  | 'SuperAdmin'
  | 'AKBPAAdmin'
  | 'SocialRegisterOfficer'
  | 'WardPA'
  | 'RedemptionOfficer'
  | 'Viewer'

export const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'SuperAdmin', label: 'Super Admin', description: 'Statewide system administrator' },
  { value: 'AKBPAAdmin', label: 'AKBPA Admin', description: 'Generates and allocates vouchers' },
  { value: 'SocialRegisterOfficer', label: 'Social Register Officer', description: 'Manages beneficiary records' },
  { value: 'WardPA', label: 'Ward PA', description: 'Issues vouchers within an assigned ward' },
  { value: 'RedemptionOfficer', label: 'Redemption Officer', description: 'Scans and redeems vouchers in the field' },
  { value: 'Viewer', label: 'Viewer / Stakeholder', description: 'Read-only dashboards and reports' },
]

export type UserStatus = 'Active' | 'Invited' | 'PendingApproval' | 'Suspended' | 'Rejected'

export interface User {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phone?: string
  nin?: string
  role: UserRole
  lgaId?: string
  wardId?: string
  isActive: boolean
  status: UserStatus
  avatarUrl?: string
  idDocumentName?: string
  /** Set when status is 'Invited' — the token the invite email link carries. Mock-only stand-in for a signed, expiring token. */
  inviteToken?: string
  invitedBy?: string
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
