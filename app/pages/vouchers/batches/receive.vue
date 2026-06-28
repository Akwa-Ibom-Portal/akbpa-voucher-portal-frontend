<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Receive Printed Batch</h1>
      <p class="text-sm text-gray-500">
        Confirm the printer's handoff — receive the full batch at once, or record specific
        serials received plus any missing or damaged ones.
      </p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-5" @submit.prevent>
        <UFormField label="Batch" name="voucherBatchId">
          <USelect v-model="form.voucherBatchId" :items="batchOptions" class="w-full" />
        </UFormField>

        <UFormField label="Receipt Mode" name="mode">
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button" class="p-3 rounded-xl border text-sm font-medium text-center"
              :class="mode === 'full' ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800'"
              @click="mode = 'full'"
            >Receive Full Batch</button>
            <button
              type="button" class="p-3 rounded-xl border text-sm font-medium text-center"
              :class="mode === 'selected' ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800'"
              @click="mode = 'selected'"
            >Receive Selected Serials</button>
          </div>
        </UFormField>

        <template v-if="mode === 'selected'">
          <UFormField label="Received serial numbers (one per line)" name="serialNumbers">
            <UTextarea v-model="serialNumbersText" rows="4" class="w-full" placeholder="RC-2026-000001&#10;RC-2026-000002" />
          </UFormField>
          <UFormField label="Missing serial numbers (one per line)" name="missingSerialNumbers">
            <UTextarea v-model="missingText" rows="3" class="w-full" />
          </UFormField>
          <UFormField label="Damaged serial numbers (one per line)" name="damagedSerialNumbers">
            <UTextarea v-model="damagedText" rows="3" class="w-full" />
          </UFormField>
        </template>

        <UFormField label="Notes" name="notes">
          <UTextarea v-model="form.notes" placeholder="Any observations from the handoff" class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UAlert v-if="submitted" color="success" variant="subtle" title="Receipt session recorded." />

        <UButton size="lg" icon="i-lucide-package-check" :loading="submitting" :disabled="!form.voucherBatchId" @click="onSubmit">
          Record Receipt
        </UButton>
      </UForm>
    </UCard>

    <UCard v-if="receiptsStore.sessions.length">
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Receipt Sessions for this Batch</p>
      </template>
      <div class="space-y-2">
        <div v-for="s in receiptsStore.sessions" :key="s.id" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm">
          <p>{{ s.physicalQuantityReceived.toLocaleString() }} / {{ s.expectedQuantity.toLocaleString() }} received · {{ s.missingQuantity }} missing · {{ s.damagedQuantity }} damaged</p>
          <p class="text-xs text-gray-500">{{ s.receivedByName }} · {{ s.receivedAt ? new Date(s.receivedAt).toLocaleString() : '' }}</p>
          <p v-if="s.notes" class="text-xs text-gray-500 mt-1">{{ s.notes }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer'] })

const batchesStore = useVoucherBatchesStore()
const receiptsStore = useVoucherReceiptsStore()
onMounted(() => batchesStore.fetchBatches())

const batchOptions = computed(() => batchesStore.batches.map(b => ({ label: `${b.batchCode} (${b.quantity.toLocaleString()} generated)`, value: b.id })))

const form = reactive({ voucherBatchId: '', notes: '' })
watch(batchOptions, (list) => { if (!form.voucherBatchId && list[0]) form.voucherBatchId = list[0].value }, { immediate: true })
watch(() => form.voucherBatchId, (id) => { if (id) receiptsStore.fetchSessions(id) }, { immediate: true })

const mode = ref<'full' | 'selected'>('full')
const serialNumbersText = ref('')
const missingText = ref('')
const damagedText = ref('')

function linesOf(text: string) {
  return text.split('\n').map(s => s.trim()).filter(Boolean)
}

const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  submitting.value = true
  try {
    if (mode.value === 'full') {
      await receiptsStore.receiveFullBatch({ voucherBatchId: form.voucherBatchId, notes: form.notes || undefined })
    } else {
      await receiptsStore.receiveSelectedSerials({
        voucherBatchId: form.voucherBatchId,
        serialNumbers: linesOf(serialNumbersText.value),
        missingSerialNumbers: linesOf(missingText.value),
        damagedSerialNumbers: linesOf(damagedText.value),
        notes: form.notes || undefined,
      })
    }
    submitted.value = true
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    submitting.value = false
  }
}
</script>
