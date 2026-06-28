<template>
  <div v-if="batch" class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ batch.batchCode }}</h1>
        <p class="text-sm text-gray-500">{{ batch.foodItem }} · {{ batch.bagSize }} · valid {{ batch.validityMonths }} months · {{ batch.programmeCycleName }}</p>
        <p v-if="batch.serialFirst" class="text-xs text-gray-400 font-mono">{{ batch.serialFirst }} → {{ batch.serialLast }}</p>
      </div>
      <div class="flex items-center gap-2">
        <UBadge :color="statusColor(batch.status)" variant="subtle" size="lg">{{ batch.status }}</UBadge>
        <UButton icon="i-lucide-file-text" color="neutral" variant="outline" :loading="downloading" @click="onDownloadPdf">Download PDF</UButton>
        <UButton
          v-if="batch.status !== 'Cancelled' && batch.status !== 'Closed'"
          icon="i-lucide-ban" color="error" variant="outline" :loading="cancelling" @click="onCancelBatch"
        >
          Cancel Batch
        </UButton>
      </div>
    </div>

    <div v-if="summary" class="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard v-for="s in stages" :key="s.label">
        <p class="text-xs text-gray-500 uppercase">{{ s.label }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <UCard v-if="inventoryEntries.length">
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Inventory Status Breakdown</p>
      </template>
      <div class="flex flex-wrap gap-3">
        <UBadge v-for="[status, count] in inventoryEntries" :key="status" variant="subtle" size="lg">{{ status }}: {{ count }}</UBadge>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Vouchers in this Batch</p>
      </template>
      <UTable :data="vouchers" :columns="voucherColumns" :loading="loadingVouchers">
        <template #actions-cell="{ row }">
          <UButton
            v-if="row.original.status !== 'Cancelled' && row.original.status !== 'Redeemed'"
            size="xs" color="error" variant="ghost" icon="i-lucide-ban"
            :loading="cancellingSerial === row.original.serialNumber"
            @click="onCancelVoucher(row.original.serialNumber)"
          >Cancel</UButton>
        </template>
      </UTable>
    </UCard>

    <UAlert v-if="error" color="error" variant="subtle" :title="error" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer'] })

import type { StatusCounts, Voucher, VoucherBatch, VoucherBatchSummary } from '~/types'
import { cancelVoucherBySerial } from '~/services/vouchersApi'
import { getInventory } from '~/services/reportsApi'

const route = useRoute()
const batchesStore = useVoucherBatchesStore()

const batch = ref<VoucherBatch | null>(null)
const summary = ref<VoucherBatchSummary | null>(null)
const vouchers = ref<Voucher[]>([])
const inventory = ref<StatusCounts>({})
const loadingVouchers = ref(false)
const downloading = ref(false)
const cancelling = ref(false)
const cancellingSerial = ref('')
const error = ref('')

onMounted(async () => {
  const id = String(route.params.id)
  batch.value = await batchesStore.getBatch(id)
  loadingVouchers.value = true
  try {
    const [s, v, inv] = await Promise.all([batchesStore.getSummary(id), batchesStore.listVouchers(id), getInventory(id)])
    summary.value = s
    vouchers.value = v
    inventory.value = inv
  } finally {
    loadingVouchers.value = false
  }
})

const stages = computed(() => summary.value ? [
  { label: 'Generated', value: summary.value.quantityGenerated },
  { label: 'Received', value: summary.value.quantityReceived },
  { label: 'Allocated', value: summary.value.quantityAllocated },
  { label: 'Issued', value: summary.value.quantityIssued },
  { label: 'Redeemed', value: summary.value.quantityRedeemed },
  { label: 'Expired', value: summary.value.quantityExpired },
  { label: 'Cancelled', value: summary.value.quantityCancelled },
  { label: 'Missing / Damaged', value: summary.value.quantityMissing + summary.value.quantityDamaged },
] : [])

const inventoryEntries = computed(() => Object.entries(inventory.value))

const voucherColumns = [
  { accessorKey: 'serialNumber', header: 'Serial' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'expiresOn', header: 'Expires', cell: ({ row }: any) => row.getValue('expiresOn') ? new Date(row.getValue('expiresOn')).toLocaleDateString() : '—' },
  { id: 'actions', header: '' },
]

async function onCancelVoucher(serialNumber: string) {
  const reason = window.prompt(`Reason for cancelling voucher ${serialNumber}?`)
  if (!reason) return
  cancellingSerial.value = serialNumber
  error.value = ''
  try {
    const updated = await cancelVoucherBySerial(serialNumber, reason)
    const i = vouchers.value.findIndex(v => v.serialNumber === serialNumber)
    if (i !== -1) vouchers.value[i] = updated
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    cancellingSerial.value = ''
  }
}

function statusColor(status: string) {
  if (status === 'Allocated' || status === 'Closed') return 'success'
  if (status === 'PartlyAllocated') return 'warning'
  if (status === 'Cancelled') return 'error'
  return 'neutral'
}

async function onDownloadPdf() {
  if (!batch.value) return
  downloading.value = true
  try {
    const url = await batchesStore.downloadPdf(batch.value.id)
    window.open(url, '_blank')
  } finally {
    downloading.value = false
  }
}

async function onCancelBatch() {
  if (!batch.value) return
  const reason = window.prompt('Reason for cancelling this batch?')
  if (!reason) return
  cancelling.value = true
  error.value = ''
  try {
    batch.value = await batchesStore.cancelBatch(batch.value.id, reason)
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    cancelling.value = false
  }
}
</script>
