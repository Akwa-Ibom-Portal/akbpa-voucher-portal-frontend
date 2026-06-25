<template>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Generate Secured QR Vouchers</h1>
        <p class="text-sm text-gray-500">Production Run · each voucher carries a unique serial and SHA-256 hashed token.</p>
      </div>

      <UCard>
        <UForm :state="form" class="space-y-5" @submit="onGenerate">
          <UFormField label="Stable Food Item" name="foodItem">
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="item in items" :key="item.value" type="button"
                class="p-4 rounded-xl border text-center transition-colors"
                :class="form.foodItem === item.value ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800 hover:border-akbpaGreen-300'"
                @click="form.foodItem = item.value"
              >
                <p class="text-2xl">{{ item.emoji }}</p>
                <p class="text-sm font-medium mt-1">{{ item.value }}</p>
              </button>
            </div>
          </UFormField>

          <UFormField label="Number of Vouchers" name="quantity">
            <div class="flex flex-wrap gap-2 mb-2">
              <UButton v-for="q in [100, 500, 1000, 5000]" :key="q" size="xs" :variant="form.quantity === q ? 'solid' : 'outline'" color="neutral" @click="form.quantity = q">
                {{ q.toLocaleString() }}
              </UButton>
            </div>
            <UInput v-model.number="form.quantity" type="number" min="1" class="w-full" />
          </UFormField>

          <UFormField label="Serial Prefix" name="serialPrefix">
            <UInput v-model="form.serialPrefix" class="w-full" />
          </UFormField>

          <UFormField label="Validity">
            <UInput :model-value="`${form.validityMonths} months from issue`" disabled class="w-full" />
          </UFormField>

          <UAlert color="info" variant="subtle" icon="i-lucide-shield-check" title="Each voucher is single-use — invalid once redeemed." />

          <UButton type="submit" size="lg" icon="i-lucide-cog" :loading="generating">
            Generate &amp; Hash Batch
          </UButton>
        </UForm>
      </UCard>

      <UCard v-if="lastBatch">
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">{{ lastBatch.batchCode }}</p>
          <p class="text-xs text-gray-500">{{ lastBatch.quantityGenerated.toLocaleString() }} × {{ lastBatch.foodItem }} · 5kg · valid {{ lastBatch.validityMonths }} months</p>
        </template>
        <div class="grid sm:grid-cols-2 gap-3">
          <div v-for="(v, i) in previewVouchers" :key="i" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm">
            <p class="font-semibold text-gray-900 dark:text-white">AKBPA FOOD VOUCHER</p>
            <p class="text-gray-500">{{ lastBatch.foodItem }} · 5kg</p>
            <p class="mt-2 text-xs text-gray-400">SERIAL</p>
            <p class="font-mono text-xs">{{ v }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Showing 4 of {{ lastBatch.quantityGenerated.toLocaleString() }} generated vouchers</p>
        <div class="flex items-center gap-3 mt-4">
          <UButton
            icon="i-lucide-printer" color="neutral" variant="outline" :loading="markingSent"
            :disabled="lastBatch.status !== 'Generated'"
            @click="onSendToPrinter"
          >
            {{ lastBatch.status === 'Generated' ? 'Export QR Images for Printer' : 'Sent to Printer' }}
          </UButton>
          <UBadge v-if="lastBatch.status === 'PrintedPending'" color="info" variant="subtle">
            Awaiting return — receive at Voucher Batches → Receive Batch
          </UBadge>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Production History</p>
      </template>
      <div class="space-y-3">
        <div v-for="b in vouchersStore.batches" :key="b.id" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ b.batchCode }}</p>
              <p class="text-xs text-gray-500">{{ b.foodItem }} · {{ b.quantityGenerated.toLocaleString() }}</p>
            </div>
            <UBadge :color="b.status === 'Allocated' ? 'success' : 'warning'" variant="subtle">{{ b.status }}</UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['SuperAdmin', 'AKBPAAdmin'] })

import type { FoodItem, VoucherBatch } from '~/types'

const auth = useAuthStore()
const vouchersStore = useVouchersStore()
onMounted(() => vouchersStore.fetchBatches())

const items: { value: FoodItem; emoji: string }[] = [
  { value: 'Rice', emoji: '🍚' },
  { value: 'Beans', emoji: '🫘' },
  { value: 'Garri', emoji: '🌾' },
]

const form = reactive({
  foodItem: 'Rice' as FoodItem,
  quantity: 500,
  serialPrefix: 'AKBPA-RICE-2026-',
  validityMonths: 3,
})

const generating = ref(false)
const markingSent = ref(false)
const lastBatch = ref<VoucherBatch | null>(null)
const previewVouchers = ref<string[]>([])

async function onGenerate() {
  generating.value = true
  try {
    const batch = await vouchersStore.generateBatch({
      foodItem: form.foodItem,
      quantity: form.quantity,
      serialPrefix: form.serialPrefix,
      validityMonths: form.validityMonths,
    }, auth.user?.id ?? 'unknown')
    lastBatch.value = batch
    previewVouchers.value = Array.from({ length: 4 }, (_, i) =>
      `${form.serialPrefix}${String(i + 1).padStart(6, '0')}`)
  } finally {
    generating.value = false
  }
}

async function onSendToPrinter() {
  if (!lastBatch.value) return
  markingSent.value = true
  try {
    lastBatch.value = await vouchersStore.markSentToPrinter(lastBatch.value.id)
  } finally {
    markingSent.value = false
  }
}
</script>
