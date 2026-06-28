<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Receive Printed Batch</h1>
      <p class="text-sm text-gray-500">
        Every voucher returned by the printer must be scanned in, one at a time. This is
        the control that catches a printer skimming vouchers before they reach the agency —
        no sampling, no shortcuts.
      </p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-5" @submit.prevent>
        <UFormField label="Batch" name="batchId">
          <USelect v-model="form.batchId" :items="pendingBatches" class="w-full" @update:model-value="resetScan" />
        </UFormField>

        <UFormField v-if="selectedBatch" label="Quantity printer claims to be returning" name="claimedReturned">
          <UInput v-model.number="form.claimedReturned" type="number" class="w-full" />
          <template #help>Expected from this batch: {{ expectedTotal.toLocaleString() }} vouchers generated.</template>
        </UFormField>

        <UFormField v-if="selectedBatch" label="Scan each voucher's QR code" name="scan">
          <div class="flex gap-2">
            <UInput v-model="scanInput" placeholder="Scan or type a serial number" class="w-full" icon="i-lucide-qr-code" autofocus @keyup.enter="addScan" />
            <UButton @click="addScan">Add</UButton>
          </div>
          <template #help>
            <span v-if="duplicateWarning" class="text-amber-600">{{ duplicateWarning }}</span>
          </template>
        </UFormField>

        <div v-if="selectedBatch" class="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-medium">Scanned: {{ scanned.length.toLocaleString() }} / {{ expectedTotal.toLocaleString() }}</span>
            <span :class="scanned.length === expectedTotal ? 'text-akbpaGreen-600 font-medium' : 'text-gray-500'">{{ coverage }}%</span>
          </div>
          <UProgress :model-value="coverage" :color="scanned.length === expectedTotal ? 'success' : 'primary'" />
        </div>

        <div v-if="scanned.length" class="border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800 max-h-56 overflow-y-auto">
          <div v-for="(s, i) in scanned" :key="i" class="flex items-center justify-between px-3 py-2 text-sm">
            <span class="font-mono">{{ s }}</span>
            <UIcon name="i-lucide-check" class="size-4 text-akbpaGreen-600" />
          </div>
        </div>

        <UFormField v-if="selectedBatch" label="Notes" name="notes">
          <UTextarea v-model="form.notes" placeholder="Any observations from the handoff" class="w-full" />
        </UFormField>

        <UAlert
          v-if="selectedBatch && form.claimedReturned && form.claimedReturned !== scanned.length"
          color="warning" variant="subtle" icon="i-lucide-alert-triangle"
          :title="`Printer claims ${form.claimedReturned.toLocaleString()}, but ${scanned.length.toLocaleString()} have been individually scanned.`"
        >
          <template #description>This mismatch must be resolved before allocation — do not accept the printer's count without your own scan matching it.</template>
        </UAlert>

        <UAlert v-if="submitted === 'received'" color="success" variant="subtle" title="All vouchers scanned and accounted for — batch marked Received." />
        <UAlert v-if="submitted === 'discrepancy'" color="error" variant="subtle" :title="`${missingCount.toLocaleString()} voucher(s) unaccounted for — batch flagged as Discrepancy and blocked from allocation.`" />

        <div v-if="selectedBatch" class="flex flex-wrap gap-2">
          <UButton
            size="lg" icon="i-lucide-package-check" :loading="submitting"
            :disabled="scanned.length !== expectedTotal"
            @click="onMarkReceived"
          >
            Mark Batch as Received
          </UButton>
          <UButton
            v-if="scanned.length > 0 && scanned.length < expectedTotal"
            size="lg" color="error" variant="outline" icon="i-lucide-flag" :loading="submitting"
            @click="onReportDiscrepancy"
          >
            Stop &amp; Report Missing Vouchers
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer'] })

const vouchersStore = useVouchersStore()
onMounted(() => vouchersStore.fetchBatches())

const pendingBatches = computed(() => vouchersStore.batches
  .filter(b => b.status === 'PrintedPending' || b.status === 'PartiallyReceived' || b.status === 'Discrepancy' || b.status === 'Generated')
  .map(b => ({ label: `${b.batchCode} (${b.quantityGenerated.toLocaleString()} generated)`, value: b.id })))

const form = reactive({ batchId: '', claimedReturned: 0, notes: '' })
watch(pendingBatches, (list) => { if (!form.batchId && list[0]) form.batchId = list[0].value }, { immediate: true })

const selectedBatch = computed(() => vouchersStore.batches.find(b => b.id === form.batchId))
const expectedTotal = computed(() => selectedBatch.value?.quantitySentToPrinter || selectedBatch.value?.quantityGenerated || 0)

const scanInput = ref('')
const scanned = ref<string[]>([])
const duplicateWarning = ref('')
const submitted = ref<'received' | 'discrepancy' | ''>('')
const submitting = ref(false)
const missingCount = ref(0)

const coverage = computed(() => expectedTotal.value ? Math.round((scanned.value.length / expectedTotal.value) * 100) : 0)

function resetScan() {
  scanned.value = []
  submitted.value = ''
  duplicateWarning.value = ''
}

function addScan() {
  const value = scanInput.value.trim()
  if (!value) return
  if (scanned.value.includes(value)) {
    duplicateWarning.value = `"${value}" was already scanned — possible duplicate or re-scan.`
    scanInput.value = ''
    return
  }
  duplicateWarning.value = ''
  scanned.value.push(value)
  scanInput.value = ''
}

async function onMarkReceived() {
  if (!selectedBatch.value || scanned.value.length !== expectedTotal.value) return
  submitting.value = true
  try {
    await vouchersStore.receiveBatch(selectedBatch.value.id, {
      scannedSerials: scanned.value,
      claimedReturned: form.claimedReturned,
      notes: form.notes || undefined,
    })
    submitted.value = 'received'
  } finally {
    submitting.value = false
  }
}

async function onReportDiscrepancy() {
  if (!selectedBatch.value) return
  submitting.value = true
  try {
    missingCount.value = expectedTotal.value - scanned.value.length
    await vouchersStore.receiveBatch(selectedBatch.value.id, {
      scannedSerials: scanned.value,
      claimedReturned: form.claimedReturned,
      notes: form.notes || undefined,
      closeOutShort: true,
    })
    submitted.value = 'discrepancy'
  } finally {
    submitting.value = false
  }
}
</script>
