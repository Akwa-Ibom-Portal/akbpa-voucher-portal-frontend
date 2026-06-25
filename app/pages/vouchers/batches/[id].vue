<template>
  <div v-if="batch" class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ batch.batchCode }}</h1>
        <p class="text-sm text-gray-500">{{ batch.foodItem }} · 5kg · valid {{ batch.validityMonths }} months</p>
      </div>
      <UBadge :color="statusColor(batch.status)" variant="subtle" size="lg">{{ batch.status }}</UBadge>
    </div>

    <div class="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <UCard v-for="s in stages" :key="s.label">
        <p class="text-xs text-gray-500 uppercase">{{ s.label }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Lifecycle Funnel</p>
      </template>
      <div class="space-y-3">
        <div v-for="s in funnelStages" :key="s.label">
          <div class="flex justify-between text-sm mb-1">
            <span>{{ s.label }}</span><span class="text-gray-500">{{ s.value.toLocaleString() }}</span>
          </div>
          <UProgress :model-value="pct(s.value, batch.quantityGenerated)" />
        </div>
      </div>
    </UCard>

    <UCard v-if="batch.status === 'PartiallyReceived'">
      <UAlert color="warning" variant="subtle" icon="i-lucide-alert-triangle" title="Batch not fully reconciled with the printer return.">
        <template #description>
          Only {{ batch.quantityReceived.toLocaleString() }} of {{ batch.quantitySentToPrinter.toLocaleString() }} vouchers
          have been individually scanned back in so far. Go to Receive Batch to continue —
          every voucher must be scanned before this batch can be allocated.
        </template>
      </UAlert>
      <UButton class="mt-4" to="/vouchers/batches/receive" icon="i-lucide-package-check">Continue Receiving</UButton>
    </UCard>

    <UCard v-if="batch.status === 'Discrepancy'">
      <UAlert color="error" variant="subtle" icon="i-lucide-shield-alert" :title="`${batch.quantityMissing.toLocaleString()} voucher(s) unaccounted for.`">
        <template #description>
          The printer returned fewer vouchers than were generated for this batch, and the
          shortfall was confirmed by individual scan, not estimated. This batch is blocked
          from allocation until the missing vouchers are located or formally written off.
        </template>
      </UAlert>
      <UButton class="mt-4" to="/vouchers/batches/receive" icon="i-lucide-package-check" color="error" variant="outline">Resume Reconciliation</UButton>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['SuperAdmin', 'AKBPAAdmin'] })

import type { VoucherBatch } from '~/types'

const route = useRoute()
const vouchersStore = useVouchersStore()
const batch = ref<VoucherBatch | null>(null)

onMounted(async () => {
  if (!vouchersStore.batches.length) await vouchersStore.fetchBatches()
  batch.value = (await vouchersStore.getBatch(String(route.params.id))) ?? null
})

const stages = computed(() => batch.value ? [
  { label: 'Generated', value: batch.value.quantityGenerated },
  { label: 'Sent to Printer', value: batch.value.quantitySentToPrinter },
  { label: 'Received', value: batch.value.quantityReceived },
  { label: 'Allocated', value: batch.value.quantityAllocated },
  { label: 'Issued', value: batch.value.quantityIssued },
  { label: 'Redeemed', value: batch.value.quantityRedeemed },
] : [])

const funnelStages = stages
function pct(n: number, d: number) { return d ? Math.round((n / d) * 100) : 0 }

function statusColor(status: string) {
  if (status === 'Allocated' || status === 'Received') return 'success'
  if (status === 'PartiallyReceived' || status === 'PrintedPending') return 'warning'
  if (status === 'Discrepancy') return 'error'
  return 'neutral'
}
</script>
