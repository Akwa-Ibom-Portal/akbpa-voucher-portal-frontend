<template>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Generate Secured QR Vouchers</h1>
        <p class="text-sm text-gray-500">Production Run · each voucher carries a unique serial and a hashed token.</p>
      </div>

      <UCard>
        <UForm :state="form" class="space-y-5" @submit="onGenerate">
          <UFormField label="Programme Cycle" name="programmeCycleId" required>
            <USelect v-model="form.programmeCycleId" :items="cycleOptions" placeholder="Select a programme cycle" class="w-full" />
          </UFormField>

          <UFormField label="Batch Code" name="batchCode" required>
            <UInput v-model="form.batchCode" placeholder="B-RC-2026-001" class="w-full" />
          </UFormField>

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

          <UFormField label="Bag Size" name="bagSize">
            <UInput v-model="form.bagSize" class="w-full" />
          </UFormField>

          <UFormField label="Number of Vouchers" name="quantity">
            <div class="flex flex-wrap gap-2 mb-2">
              <UButton v-for="q in [100, 500, 1000, 5000]" :key="q" size="xs" :variant="form.quantity === q ? 'solid' : 'outline'" color="neutral" @click="form.quantity = q">
                {{ q.toLocaleString() }}
              </UButton>
            </div>
            <UInput v-model.number="form.quantity" type="number" min="1" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Validity (months)" name="validityMonths">
              <UInput v-model.number="form.validityMonths" type="number" min="1" class="w-full" />
            </UFormField>
            <UFormField label="Year" name="year">
              <UInput v-model.number="form.year" type="number" class="w-full" />
            </UFormField>
          </div>

          <UAlert color="info" variant="subtle" icon="i-lucide-shield-check" title="Each voucher is single-use — invalid once redeemed." />
          <UAlert v-if="error" color="error" variant="subtle" :title="error" />

          <UButton type="submit" size="lg" icon="i-lucide-cog" :loading="generating">
            Generate &amp; Hash Batch
          </UButton>
        </UForm>
      </UCard>

      <UCard v-if="lastBatch">
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">{{ lastBatch.batchCode }}</p>
          <p class="text-xs text-gray-500">{{ lastBatch.quantity.toLocaleString() }} × {{ lastBatch.foodItem }} · {{ lastBatch.bagSize }} · valid {{ lastBatch.validityMonths }} months</p>
        </template>
        <UButton :to="`/vouchers/batches/${lastBatch.id}`" icon="i-lucide-arrow-right" variant="outline" color="neutral">
          View Batch &amp; Vouchers
        </UButton>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Production History</p>
      </template>
      <div class="space-y-3">
        <div v-for="b in batchesStore.batches" :key="b.id" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ b.batchCode }}</p>
              <p class="text-xs text-gray-500">{{ b.foodItem }} · {{ b.quantity.toLocaleString() }}</p>
            </div>
            <UBadge :color="statusColor(b.status)" variant="subtle">{{ b.status }}</UBadge>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin'] })

import type { FoodItem, VoucherBatch } from '~/types'

const batchesStore = useVoucherBatchesStore()
const cyclesStore = useProgrammeCyclesStore()
onMounted(async () => {
  await Promise.all([batchesStore.fetchBatches(), cyclesStore.fetchCycles()])
})

const cycleOptions = computed(() => cyclesStore.cycles.map(c => ({ label: c.name, value: c.id })))

const items: { value: FoodItem; emoji: string }[] = [
  { value: 'Rice', emoji: '🍚' },
  { value: 'Beans', emoji: '🫘' },
  { value: 'Garri', emoji: '🌾' },
]

const form = reactive({
  programmeCycleId: '',
  batchCode: '',
  foodItem: 'Rice' as FoodItem,
  bagSize: '5kg',
  quantity: 500,
  validityMonths: 3,
  year: new Date().getFullYear(),
})
watch(cycleOptions, (list) => { if (!form.programmeCycleId && list[0]) form.programmeCycleId = list[0].value }, { immediate: true })

const generating = ref(false)
const error = ref('')
const lastBatch = ref<VoucherBatch | null>(null)

async function onGenerate() {
  error.value = ''
  generating.value = true
  try {
    lastBatch.value = await batchesStore.createBatch({
      batchCode: form.batchCode,
      programmeCycleId: form.programmeCycleId,
      foodItem: form.foodItem,
      bagSize: form.bagSize,
      quantity: form.quantity,
      validityMonths: form.validityMonths,
      year: form.year,
    })
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    generating.value = false
  }
}

function statusColor(status: string) {
  if (status === 'Allocated' || status === 'Closed') return 'success'
  if (status === 'PartlyAllocated') return 'warning'
  if (status === 'Cancelled') return 'error'
  return 'neutral'
}
</script>
