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
            <USelect v-model="form.programmeCycleId" :items="cycleOptions" placeholder="Select a programme cycle" class="w-full">
              <template #trailing>
                <UBadge v-if="selectedCycle" :color="selectedCycle.isActive ? 'success' : 'neutral'" variant="subtle" size="sm">
                  {{ selectedCycle.isActive ? 'Active' : 'Inactive' }}
                </UBadge>
                <UIcon name="i-lucide-chevrons-up-down" class="size-4 shrink-0 text-dimmed" />
              </template>
              <template #item-trailing="{ item }">
                <UBadge :color="(item as any).isActive ? 'success' : 'neutral'" variant="subtle" size="sm">
                  {{ (item as any).isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </template>
            </USelect>
          </UFormField>

          <UFormField name="batchCode" :error="batchCodeError">
            <template #label>
              <span class="flex items-center gap-1">
                Batch Code
                <span class="text-red-500 mx-0.5">*</span>
                <UTooltip side="right" :ui="{ content: 'bg-gray-900 border border-gray-700 shadow-xl p-0' }">
                  <UIcon name="i-lucide-info" class="size-3.5 text-gray-400 cursor-help" />
                  <template #content>
                    <div class="text-xs space-y-2 w-72 p-3 bg-gray-900 rounded-lg">
                      <p class="font-semibold text-white">Batch Code Format</p>
                      <p class="font-mono text-akbpaGreen-400 tracking-wide">BATCH-AKS-[ITEM]-[YEAR]-[SEQ]</p>
                      <ul class="space-y-1 text-gray-300">
                        <li class="flex gap-2"><span class="font-mono text-white w-14 shrink-0">BATCH</span><span>fixed prefix</span></li>
                        <li class="flex gap-2"><span class="font-mono text-white w-14 shrink-0">AKS</span><span>agency identifier (fixed)</span></li>
                        <li class="flex gap-2"><span class="font-mono text-white w-14 shrink-0">ITEM</span><span>RC · BN · GR</span></li>
                        <li class="flex gap-2"><span class="font-mono text-white w-14 shrink-0">YEAR</span><span>4-digit year</span></li>
                        <li class="flex gap-2"><span class="font-mono text-white w-14 shrink-0">SEQ</span><span>3-digit run number (001, 002…)</span></li>
                      </ul>
                      <div class="border-t border-gray-700 pt-2 text-gray-400">
                        e.g. <span class="font-mono text-white">BATCH-AKS-RC-2026-001</span>
                      </div>
                    </div>
                  </template>
                </UTooltip>
              </span>
            </template>
            <UInput
              v-model="form.batchCode"
              :placeholder="batchCodePlaceholder"
              class="w-full font-mono"
              @input="form.batchCode = (($event.target as HTMLInputElement).value).toUpperCase()"
            />
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
            <UInput v-model="form.bagSize" :disabled="bagSizeLocked" class="w-full">
              <template #trailing>
                <button v-if="bagSizeLocked" type="button" class="flex items-center gap-1 text-xs font-medium text-akbpaGreen-600 hover:text-akbpaGreen-700 pr-1" @click="bagSizeLocked = false">
                  <UIcon name="i-lucide-pencil" class="size-3" /> Edit
                </button>
                <button v-else type="button" class="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 pr-1" @click="bagSizeLocked = true; form.bagSize = '5KG'">
                  <UIcon name="i-lucide-rotate-ccw" class="size-3" /> Reset
                </button>
              </template>
            </UInput>
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

          <UAlert v-if="cycleWarning" color="warning" variant="subtle" icon="i-lucide-triangle-alert" :title="cycleWarning" />
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
        <NuxtLink
          v-for="b in batchesStore.batches" :key="b.id"
          :to="`/vouchers/batches/${b.id}`"
          class="block border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:border-akbpaGreen-400 hover:bg-akbpaGreen-50 dark:hover:bg-akbpaGreen-950/40 transition-colors cursor-pointer"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ b.batchCode }}</p>
              <p class="text-xs text-gray-500">{{ b.foodItem }} · {{ b.quantity.toLocaleString() }}</p>
            </div>
            <UBadge :color="statusColor(b.status)" variant="subtle">{{ b.status }}</UBadge>
          </div>
        </NuxtLink>
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

const cycleOptions = computed(() => {
  const sorted = [...cyclesStore.cycles].sort((a, b) => Number(b.isActive) - Number(a.isActive))
  return sorted.map(c => ({
    label: c.name,
    value: c.id,
    isActive: c.isActive,
  }))
})

const selectedCycle = computed(() => cyclesStore.cycles.find(c => c.id === form.programmeCycleId))

const cycleWarning = computed(() => {
  const c = selectedCycle.value
  if (!c) return null
  const d = new Date()
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const startStr = c.startsOn?.slice(0, 10)
  const endStr = c.endsOn?.slice(0, 10)
  const inDateRange = startStr && endStr ? todayStr >= startStr && todayStr <= endStr : true

  if (!c.isActive && !inDateRange)
    return 'This cycle is not active and today falls outside its date range. Vouchers will still be assigned to this cycle.'
  if (!c.isActive)
    return 'This cycle is not currently marked as active. Vouchers will still be assigned to it.'
  if (!inDateRange)
    return 'Today falls outside this cycle\'s date range, but it is marked active. You may proceed.'
  return null
})

const items: { value: FoodItem; emoji: string }[] = [
  { value: 'Rice', emoji: '🍚' },
  { value: 'Beans', emoji: '🫘' },
  { value: 'Garri', emoji: '🌾' },
]

const ITEM_CODE: Record<string, string> = { Rice: 'RC', Beans: 'BN', Garri: 'GR' }
const BATCH_CODE_RE = /^BATCH-AKS-(RC|BN|GR)-\d{4}-\d{3}$/

const batchCodePlaceholder = computed(() => `BATCH-AKS-${ITEM_CODE[form.foodItem] ?? 'RC'}-${form.year}-001`)

const batchCodeError = computed(() => {
  if (!form.batchCode) return ''
  return BATCH_CODE_RE.test(form.batchCode)
    ? ''
    : `Must follow BATCH-AKS-[ITEM]-[YEAR]-[SEQ] — e.g. ${batchCodePlaceholder.value}`
})

const bagSizeLocked = ref(true)

const form = reactive({
  programmeCycleId: '',
  batchCode: '',
  foodItem: 'Rice' as FoodItem,
  bagSize: '5KG',
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
  if (!BATCH_CODE_RE.test(form.batchCode)) {
    error.value = `Invalid batch code. Use format: ${batchCodePlaceholder.value}`
    return
  }
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
