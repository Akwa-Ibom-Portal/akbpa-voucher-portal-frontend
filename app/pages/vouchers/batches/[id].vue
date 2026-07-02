<template>
  <div v-if="batch" class="space-y-6">
    <div>
      <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" @click="router.back()">Back</UButton>
    </div>
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ batch.batchCode }}</h1>
        <p class="text-sm text-gray-500">{{ batch.foodItem }} · {{ batch.bagSize }} · valid {{ batch.validityMonths }} months · {{ batch.programmeCycleName }}</p>
        <p v-if="batch.serialFirst" class="text-xs text-gray-400 font-mono">{{ batch.serialFirst }} → {{ batch.serialLast }}</p>
      </div>
      <div class="flex items-center gap-2">
        <UBadge :color="batchStatusColor(batch.status)" variant="subtle" size="lg">{{ batch.status }}</UBadge>
        <UButton icon="i-lucide-file-text" color="neutral" variant="outline" :loading="downloading" @click="onDownloadPdf">Download PDF</UButton>
        <UButton
          v-if="batch.status !== 'Cancelled' && batch.status !== 'Closed'"
          icon="i-lucide-ban" color="error" variant="outline" :loading="cancelling" @click="onCancelBatch"
        >Cancel Batch</UButton>
      </div>
    </div>

    <div v-if="summary" class="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard v-for="s in stages" :key="s.label" :ui="{ body: 'p-4' }">
        <p class="text-xs uppercase font-medium" :class="s.labelClass">{{ s.label }}</p>
        <p class="text-xl font-bold mt-1" :class="s.valueClass">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <UCard v-if="inventoryEntries.length">
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Inventory Status Breakdown</p>
      </template>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="[status, count] in inventoryEntries" :key="status"
          :color="voucherStatusColor(status)" variant="subtle" size="lg"
        >{{ status }}: {{ count }}</UBadge>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <p class="font-semibold text-gray-900 dark:text-white">Vouchers in this Batch</p>
          <p class="text-xs text-gray-400">{{ voucherPagination.total.toLocaleString() }} vouchers</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <UInput
            v-model="searchRaw"
            icon="i-lucide-search"
            placeholder="Search serial number…"
            class="flex-1 min-w-48"
            @keyup.enter="onSearch"
          />
          <USelect
            :model-value="statusFilter || '__all__'"
            :items="statusFilterOptions"
            class="w-44"
            @update:model-value="onStatusChange"
          />
        </div>
      </template>

      <UTable :data="vouchers" :columns="voucherColumns" :loading="loadingVouchers">
        <template #status-cell="{ row }">
          <UBadge :color="voucherStatusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
        <template #expiresOn-cell="{ row }">
          <span v-if="isExpired(row.original.expiresOn)" class="flex items-center gap-1.5 text-red-500 font-medium text-sm">
            <UIcon name="i-lucide-circle-alert" class="size-3.5 shrink-0" />
            {{ formatDate(row.original.expiresOn) }} · Expired
          </span>
          <span v-else class="text-sm text-gray-700 dark:text-gray-300">{{ formatDate(row.original.expiresOn) }}</span>
        </template>
        <template #actions-cell="{ row }">
          <UButton
            v-if="row.original.status !== 'Cancelled' && row.original.status !== 'Redeemed'"
            size="xs" color="error" variant="ghost" icon="i-lucide-ban"
            :loading="cancellingSerial === row.original.serialNumber"
            @click="onCancelVoucher(row.original.serialNumber)"
          >Cancel</UButton>
        </template>
      </UTable>

      <div v-if="voucherPagination.pages > 1" class="flex justify-end mt-4">
        <UPagination
          :page="voucherPagination.page"
          :total="voucherPagination.total"
          :items-per-page="voucherPagination.limit"
          @update:page="onPageChange"
        />
      </div>
    </UCard>

    <UAlert v-if="error" color="error" variant="subtle" :title="error" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer'] })

import type { PaginationMeta, StatusCounts, Voucher, VoucherBatch, VoucherBatchSummary } from '~/types'
import { cancelVoucherBySerial } from '~/services/vouchersApi'
import { getInventory } from '~/services/reportsApi'

const route = useRoute()
const router = useRouter()
const batchesStore = useVoucherBatchesStore()

const batch = ref<VoucherBatch | null>(null)
const summary = ref<VoucherBatchSummary | null>(null)
const vouchers = ref<Voucher[]>([])
const voucherPagination = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 1 })
const inventory = ref<StatusCounts>({})
const loadingVouchers = ref(false)
const downloading = ref(false)
const cancelling = ref(false)
const cancellingSerial = ref('')
const error = ref('')

const searchRaw = ref('')
const statusFilter = ref('')

const statusFilterOptions = [
  { label: 'All Statuses', value: '__all__' },
  { label: 'Generated', value: 'Generated' },
  { label: 'Received', value: 'Received' },
  { label: 'Allocated', value: 'Allocated' },
  { label: 'Issued', value: 'Issued' },
  { label: 'Redeemed', value: 'Redeemed' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Missing', value: 'Missing' },
  { label: 'Damaged', value: 'Damaged' },
]

async function loadVouchers(page = 1) {
  const id = String(route.params.id)
  loadingVouchers.value = true
  try {
    const result = await batchesStore.listVouchers(id, {
      page,
      limit: 20,
      search: searchRaw.value.trim() || undefined,
      status: statusFilter.value || undefined,
    })
    vouchers.value = result.items
    voucherPagination.value = result.pagination
  } finally {
    loadingVouchers.value = false
  }
}

onMounted(async () => {
  const id = String(route.params.id)
  batch.value = await batchesStore.getBatch(id)
  const [s, , inv] = await Promise.all([
    batchesStore.getSummary(id),
    loadVouchers(1),
    getInventory(id),
  ])
  summary.value = s
  inventory.value = inv
})

function onSearch() {
  loadVouchers(1)
}

function onStatusChange(v: string) {
  statusFilter.value = v === '__all__' ? '' : v
  loadVouchers(1)
}

function onPageChange(page: number) {
  loadVouchers(page)
}

const stages = computed(() => summary.value ? [
  { label: 'Generated',        value: summary.value.quantityGenerated,  labelClass: 'text-gray-500',        valueClass: 'text-gray-900 dark:text-white' },
  { label: 'Received',         value: summary.value.quantityReceived,   labelClass: 'text-blue-500',        valueClass: 'text-blue-700 dark:text-blue-300' },
  { label: 'Allocated',        value: summary.value.quantityAllocated,  labelClass: 'text-indigo-500',      valueClass: 'text-indigo-700 dark:text-indigo-300' },
  { label: 'Issued',           value: summary.value.quantityIssued,     labelClass: 'text-akbpaGreen-600',  valueClass: 'text-akbpaGreen-700 dark:text-akbpaGreen-300' },
  { label: 'Redeemed',         value: summary.value.quantityRedeemed,   labelClass: 'text-green-600',       valueClass: 'text-green-700 dark:text-green-300' },
  { label: 'Expired',          value: summary.value.quantityExpired,    labelClass: 'text-red-500',         valueClass: 'text-red-600 dark:text-red-400' },
  { label: 'Cancelled',        value: summary.value.quantityCancelled,  labelClass: 'text-red-400',         valueClass: 'text-red-500 dark:text-red-400' },
  { label: 'Missing / Damaged',value: summary.value.quantityMissing + summary.value.quantityDamaged, labelClass: 'text-orange-500', valueClass: 'text-orange-600 dark:text-orange-300' },
] : [])

const inventoryEntries = computed(() => Object.entries(inventory.value))

const voucherColumns = [
  { accessorKey: 'serialNumber', header: 'Serial' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'expiresOn', header: 'Expires' },
  { id: 'actions', header: '' },
]

function formatDate(val: string | undefined) {
  return val ? new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

function isExpired(val: string | undefined) {
  return val ? new Date(val) < new Date() : false
}

function batchStatusColor(status: string) {
  if (status === 'Generated') return 'neutral'
  if (status === 'Received') return 'info'
  if (status === 'Allocated' || status === 'Closed') return 'success'
  if (status === 'PartlyAllocated') return 'warning'
  if (status === 'Cancelled') return 'error'
  if (status === 'ReconciliationRequired') return 'error'
  return 'neutral'
}

function voucherStatusColor(status: string) {
  if (status === 'Redeemed') return 'success'
  if (status === 'Issued') return 'primary'
  if (status === 'Allocated' || status === 'PartlyAllocated') return 'warning'
  if (status === 'Expired' || status === 'Cancelled' || status === 'Missing' || status === 'Damaged') return 'error'
  if (status === 'Received') return 'info'
  return 'neutral'
}

async function onCancelVoucher(serialNumber: string) {
  const reason = window.prompt(`Reason for cancelling voucher ${serialNumber}?`)
  if (!reason) return
  cancellingSerial.value = serialNumber
  error.value = ''
  try {
    await cancelVoucherBySerial(serialNumber, reason)
    await loadVouchers(voucherPagination.value.page)
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    cancellingSerial.value = ''
  }
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
