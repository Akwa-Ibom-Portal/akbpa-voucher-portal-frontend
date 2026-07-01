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
          <p class="text-xs text-gray-400">{{ filteredVouchers.length }} of {{ vouchers.length }}</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <UInput
            v-model="searchRaw"
            icon="i-lucide-search"
            placeholder="Search serial number…"
            class="flex-1 min-w-48"
          />
          <USelect
            :model-value="statusFilter"
            :items="statusFilterOptions"
            class="w-44"
            @update:model-value="(v: string) => { statusFilter = v === '__all__' ? '' : v }"
          />
        </div>
      </template>
      <div class="max-h-[480px] overflow-y-auto">
        <UTable :data="filteredVouchers" :columns="voucherColumns" :loading="loadingVouchers">
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
      </div>
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
const router = useRouter()
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

const searchRaw = ref('')
const searchDebounced = refDebounced(searchRaw, 250)
const statusFilter = ref('')

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
  { label: 'Generated',        value: summary.value.quantityGenerated,  labelClass: 'text-gray-500',        valueClass: 'text-gray-900 dark:text-white' },
  { label: 'Received',         value: summary.value.quantityReceived,   labelClass: 'text-blue-500',        valueClass: 'text-blue-700 dark:text-blue-300' },
  { label: 'Allocated',        value: summary.value.quantityAllocated,  labelClass: 'text-indigo-500',      valueClass: 'text-indigo-700 dark:text-indigo-300' },
  { label: 'Issued',           value: summary.value.quantityIssued,     labelClass: 'text-yellow-600',      valueClass: 'text-yellow-700 dark:text-yellow-300' },
  { label: 'Redeemed',         value: summary.value.quantityRedeemed,   labelClass: 'text-green-600',       valueClass: 'text-green-700 dark:text-green-300' },
  { label: 'Expired',          value: summary.value.quantityExpired,    labelClass: 'text-red-500',         valueClass: 'text-red-600 dark:text-red-400' },
  { label: 'Cancelled',        value: summary.value.quantityCancelled,  labelClass: 'text-red-400',         valueClass: 'text-red-500 dark:text-red-400' },
  { label: 'Missing / Damaged',value: summary.value.quantityMissing + summary.value.quantityDamaged, labelClass: 'text-orange-500', valueClass: 'text-orange-600 dark:text-orange-300' },
] : [])

const inventoryEntries = computed(() => Object.entries(inventory.value))

const statusFilterOptions = computed(() => {
  const statuses = [...new Set(vouchers.value.map(v => v.status))]
  return [
    { label: 'All Statuses', value: '__all__' },
    ...statuses.map(s => ({ label: s, value: s })),
  ]
})

const filteredVouchers = computed(() => {
  const q = searchDebounced.value.toUpperCase()
  return vouchers.value.filter(v => {
    const matchesSearch = !q || v.serialNumber.includes(q)
    const matchesStatus = !statusFilter.value || v.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

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
  return 'neutral'
}

function voucherStatusColor(status: string) {
  if (status === 'Redeemed') return 'success'
  if (status === 'Issued' || status === 'Allocated' || status === 'PartlyAllocated') return 'warning'
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
    const updated = await cancelVoucherBySerial(serialNumber, reason)
    const i = vouchers.value.findIndex(v => v.serialNumber === serialNumber)
    if (i !== -1) vouchers.value[i] = updated
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
