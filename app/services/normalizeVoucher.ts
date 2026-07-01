import type {
  Voucher, VoucherAllocation, VoucherBatch, VoucherBatchSummary, VoucherIssuance,
  VoucherReceiptSession, VoucherRedemption,
} from '~/types'

export function normalizeBatch(raw: any): VoucherBatch {
  return {
    id: String(raw.id),
    batchCode: raw.batchCode ?? raw.batch_code,
    programmeCycleId: String(raw.programmeCycleId ?? raw.programme_cycle_id),
    programmeCycleName: raw.programmeCycleName ?? raw.programme_cycle_name,
    foodItem: raw.foodItem ?? raw.food_item,
    bagSize: raw.bagSize ?? raw.bag_size,
    quantity: raw.quantity,
    validityMonths: raw.validityMonths ?? raw.validity_months,
    status: raw.status,
    serialFirst: raw.serialFirst ?? raw.serial_first,
    serialLast: raw.serialLast ?? raw.serial_last,
    pdfPath: raw.pdfPath ?? raw.pdf_path,
    generatedBy: raw.generatedBy !== undefined ? String(raw.generatedBy) : (raw.generated_by !== undefined ? String(raw.generated_by) : undefined),
    generatedByName: raw.generatedByName ?? raw.generated_by_name,
    generatedAt: raw.generatedAt ?? raw.generated_at ?? raw.createdAt ?? raw.created_at,
    cancelledAt: raw.cancelledAt ?? raw.cancelled_at ?? undefined,
    cancelledBy: raw.cancelledBy ?? raw.cancelled_by ?? undefined,
    cancellationReason: raw.cancellationReason ?? raw.cancellation_reason ?? undefined,
  }
}

export function normalizeBatchSummary(raw: any): VoucherBatchSummary {
  const body = raw.summary ?? raw
  return {
    quantityGenerated: body.generated ?? body.quantityGenerated ?? body.quantity_generated ?? 0,
    quantityReceived: body.received ?? body.quantityReceived ?? body.quantity_received ?? 0,
    quantityAllocated: body.allocated ?? body.quantityAllocated ?? body.quantity_allocated ?? 0,
    quantityIssued: body.issued ?? body.quantityIssued ?? body.quantity_issued ?? 0,
    quantityRedeemed: body.redeemed ?? body.quantityRedeemed ?? body.quantity_redeemed ?? 0,
    quantityExpired: body.expired ?? body.quantityExpired ?? body.quantity_expired ?? 0,
    quantityCancelled: body.cancelled ?? body.quantityCancelled ?? body.quantity_cancelled ?? 0,
    quantityMissing: body.missing ?? body.quantityMissing ?? 0,
    quantityDamaged: body.damaged ?? body.quantityDamaged ?? 0,
    statusCounts: body.counts ?? undefined,
  }
}

export function normalizeVoucher(raw: any): Voucher {
  return {
    id: String(raw.id),
    serialNumber: raw.serialNumber ?? raw.serial_number,
    foodItem: raw.foodItem ?? raw.food_item,
    bagSize: raw.bagSize ?? raw.bag_size,
    status: raw.status,
    expiresOn: raw.expiresOn ?? raw.expires_on ?? raw.expiresAt ?? raw.expires_at,
    generatedAt: raw.generatedAt ?? raw.generated_at,
  }
}

export function normalizeReceiptSession(raw: any): VoucherReceiptSession {
  return {
    id: String(raw.id),
    voucherBatchId: String(raw.voucherBatchId ?? raw.voucher_batch_id),
    batchCode: raw.batchCode ?? raw.batch_code,
    receivedBy: raw.receivedBy !== undefined ? String(raw.receivedBy) : (raw.received_by !== undefined ? String(raw.received_by) : undefined),
    receivedByName: raw.receivedByName ?? raw.received_by_name,
    expectedQuantity: raw.expectedQuantity ?? raw.expected_quantity ?? 0,
    physicalQuantityReceived: raw.physicalQuantityReceived ?? raw.physical_quantity_received ?? 0,
    missingQuantity: raw.missingQuantity ?? raw.missing_quantity ?? 0,
    damagedQuantity: raw.damagedQuantity ?? raw.damaged_quantity ?? 0,
    notes: raw.notes ?? undefined,
    receivedAt: raw.receivedAt ?? raw.received_at,
  }
}

export function normalizeAllocation(raw: any): VoucherAllocation {
  return {
    id: String(raw.id),
    voucherBatchId: String(raw.voucherBatchId ?? raw.voucher_batch_id),
    batchCode: raw.batchCode ?? raw.batch_code,
    targetType: raw.targetType ?? raw.target_type,
    lgaId: raw.lgaId !== undefined ? String(raw.lgaId) : (raw.lga_id !== undefined && raw.lga_id !== null ? String(raw.lga_id) : undefined),
    lgaName: raw.lgaName ?? raw.lga_name ?? undefined,
    wardId: raw.wardId !== undefined ? String(raw.wardId) : (raw.ward_id !== undefined && raw.ward_id !== null ? String(raw.ward_id) : undefined),
    wardName: raw.wardName ?? raw.ward_name ?? undefined,
    officerId: raw.officerId !== undefined ? String(raw.officerId) : (raw.officer_user_id !== undefined && raw.officer_user_id !== null ? String(raw.officer_user_id) : undefined),
    officerName: raw.officerName ?? raw.officer_name ?? undefined,
    quantity: Number(raw.quantity ?? raw.quantity_allocated ?? raw.vouchers_count ?? 0),
    notes: raw.notes ?? undefined,
    allocatedBy: raw.allocatedBy !== undefined ? String(raw.allocatedBy) : (raw.allocated_by !== undefined ? String(raw.allocated_by) : undefined),
    allocatedByName: raw.allocatedByName ?? raw.allocated_by_name,
    allocatedAt: raw.allocatedAt ?? raw.allocated_at,
  }
}

export function normalizeIssuance(raw: any): VoucherIssuance {
  return {
    id: String(raw.id),
    voucherId: raw.voucherId !== undefined ? String(raw.voucherId) : (raw.voucher_id !== undefined ? String(raw.voucher_id) : undefined),
    allocationId: raw.allocationId !== undefined ? String(raw.allocationId) : (raw.allocation_id !== undefined ? String(raw.allocation_id) : undefined),
    programmeCycleId: raw.programmeCycleId !== undefined ? String(raw.programmeCycleId) : (raw.programme_cycle_id !== undefined ? String(raw.programme_cycle_id) : undefined),
    serialNumber: raw.serialNumber ?? raw.serial_number,
    foodItem: raw.foodItem ?? raw.food_item,
    lgaId: raw.lgaId !== undefined ? String(raw.lgaId) : (raw.lga_id !== undefined && raw.lga_id !== null ? String(raw.lga_id) : undefined),
    lgaName: raw.lgaName ?? raw.lga_name,
    wardId: String(raw.wardId ?? raw.ward_id),
    wardName: raw.wardName ?? raw.ward_name,
    beneficiaryId: String(raw.beneficiaryId ?? raw.beneficiary_id),
    beneficiaryName: raw.beneficiaryName ?? raw.beneficiary_name,
    beneficiaryCode: raw.beneficiaryCode ?? raw.beneficiary_code,
    recipientName: raw.recipientName ?? raw.recipient_name,
    recipientPhone: raw.recipientPhone ?? raw.recipient_phone,
    recipientReference: raw.recipientReference ?? raw.recipient_reference,
    issuedBy: raw.issuedBy !== undefined ? String(raw.issuedBy) : (raw.issued_by !== undefined ? String(raw.issued_by) : undefined),
    issuedByName: raw.issuedByName ?? raw.issued_by_name,
    notes: raw.notes ?? undefined,
    issuedAt: raw.issuedAt ?? raw.issued_at,
  }
}

export function normalizeRedemption(raw: any): VoucherRedemption {
  return {
    id: String(raw.id),
    voucherId: raw.voucherId !== undefined ? String(raw.voucherId) : (raw.voucher_id !== undefined ? String(raw.voucher_id) : undefined),
    issuanceId: raw.issuanceId !== undefined ? String(raw.issuanceId) : (raw.issuance_id !== undefined ? String(raw.issuance_id) : undefined),
    serialNumber: raw.serialNumber ?? raw.serial_number,
    foodItem: raw.foodItem ?? raw.food_item,
    redeemedBy: raw.redeemedBy !== undefined ? String(raw.redeemedBy) : (raw.redeemed_by !== undefined ? String(raw.redeemed_by) : undefined),
    redeemedByName: raw.redeemedByName ?? raw.redeemed_by_name,
    redemptionPointId: raw.redemptionPointId !== undefined ? String(raw.redemptionPointId) : (raw.redemption_point_id !== undefined && raw.redemption_point_id !== null ? String(raw.redemption_point_id) : undefined),
    redemptionPointName: raw.redemptionPointName ?? raw.redemption_point_name,
    notes: raw.notes ?? undefined,
    redeemedAt: raw.redeemedAt ?? raw.redeemed_at ?? raw.createdAt ?? raw.created_at,
  }
}
