<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Allocate Vouchers</h1>
      <p class="text-sm text-gray-500">Assign a received batch's stock to an LGA, a ward, several wards, or an officer directly.</p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-5" @submit.prevent>
        <UFormField label="Batch" name="voucherBatchId">
          <USelect v-model="form.voucherBatchId" :items="batchOptions" class="w-full" />
        </UFormField>

        <UFormField label="Allocation Target" name="targetType">
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="t in targetTypes" :key="t.value" type="button"
              class="p-3 rounded-xl border text-sm font-medium text-center"
              :class="targetType === t.value ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800'"
              @click="targetType = t.value"
            >{{ t.label }}</button>
          </div>
        </UFormField>

        <UFormField v-if="targetType === 'LGA'" label="LGA" name="lgaId">
          <USelect v-model="lgaOnlyId" :items="lgaOptions" class="w-full" />
        </UFormField>

        <UFormField v-if="targetType === 'OFFICER'" label="Officer" name="officerId">
          <USelect v-model="officerId" :items="officerOptions" class="w-full" />
        </UFormField>

        <template v-if="targetType === 'WARD' || targetType === 'WARDS'">
          <UFormField label="LGA" name="lgaId">
            <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" @change="resetTargets" />
          </UFormField>

          <div v-for="(target, i) in targets" :key="i" class="flex items-end gap-3">
            <UFormField label="Ward" class="flex-1">
              <USelect v-model="target.wardId" :items="wardOptions" :disabled="!form.lgaId" class="w-full" />
            </UFormField>
            <UFormField label="Quantity" class="w-32">
              <UInput v-model.number="target.quantity" type="number" min="1" class="w-full" />
            </UFormField>
            <UButton v-if="targetType === 'WARDS' && targets.length > 1" icon="i-lucide-trash-2" color="error" variant="ghost" @click="targets.splice(i, 1)" />
          </div>
          <UButton v-if="targetType === 'WARDS'" size="xs" variant="outline" color="neutral" icon="i-lucide-plus" @click="targets.push({ wardId: '', quantity: 100 })">
            Add another ward
          </UButton>
        </template>

        <UFormField v-if="targetType === 'LGA' || targetType === 'OFFICER'" label="Quantity" name="quantity">
          <UInput v-model.number="singleQuantity" type="number" min="1" class="w-full" />
        </UFormField>

        <UFormField label="Notes" name="notes">
          <UTextarea v-model="form.notes" class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UAlert v-if="submitted" color="success" variant="subtle" title="Vouchers allocated." />

        <UButton size="lg" icon="i-lucide-send" :loading="loading" :disabled="!canSubmit" @click="onSubmit">
          Allocate Vouchers
        </UButton>
      </UForm>
    </UCard>

    <UCard v-if="allocationsStore.allocations.length">
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Recent Allocations</p>
      </template>
      <div class="space-y-2">
        <div v-for="a in allocationsStore.allocations.slice(0, 10)" :key="a.id" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm flex justify-between">
          <span>{{ a.batchCode }} · {{ a.targetType }} · {{ a.wardName ?? a.lgaName ?? a.officerName ?? '' }} · {{ a.quantity.toLocaleString() }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'LGA Voucher Officer'] })

import type { AllocationTargetType } from '~/types'

const batchesStore = useVoucherBatchesStore()
const allocationsStore = useVoucherAllocationsStore()
const lgaStore = useLgaStore()
const usersStore = useUsersStore()

onMounted(async () => {
  await Promise.all([batchesStore.fetchBatches(), lgaStore.ensureLoaded(), allocationsStore.fetchAllocations(), usersStore.fetchUsers()])
})

const batchOptions = computed(() => batchesStore.batches.map(b => ({ label: b.batchCode, value: b.id })))
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const officerOptions = computed(() => usersStore.users
  .filter(u => ['Ward PA / Issuing Officer', 'Redemption Officer', 'LGA Voucher Officer'].includes(u.role))
  .map(u => ({ label: `${u.fullName} (${u.role})`, value: u.id })))

const targetTypes: { value: AllocationTargetType; label: string }[] = [
  { value: 'WARD', label: 'One Ward' },
  { value: 'WARDS', label: 'Several Wards' },
  { value: 'LGA', label: 'Whole LGA' },
  { value: 'OFFICER', label: 'Officer' },
]
const targetType = ref<AllocationTargetType>('WARD')

const form = reactive({ voucherBatchId: '', lgaId: '', notes: '' })
watch(batchOptions, (list) => { if (!form.voucherBatchId && list[0]) form.voucherBatchId = list[0].value }, { immediate: true })

const wardOptions = computed(() => lgaStore.wardsForLga(form.lgaId).map(w => ({ label: w.name, value: w.id })))
const targets = ref([{ wardId: '', quantity: 100 }])
function resetTargets() {
  targets.value = [{ wardId: '', quantity: 100 }]
}

const lgaOnlyId = ref('')
const officerId = ref('')
const singleQuantity = ref(100)

const canSubmit = computed(() => {
  if (!form.voucherBatchId) return false
  if (targetType.value === 'LGA') return !!lgaOnlyId.value && singleQuantity.value > 0
  if (targetType.value === 'OFFICER') return !!officerId.value && singleQuantity.value > 0
  return targets.value.every(t => t.wardId && t.quantity > 0)
})

const submitted = ref(false)
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  loading.value = true
  try {
    if (targetType.value === 'LGA') {
      await allocationsStore.allocateToLga({ voucherBatchId: form.voucherBatchId, lgaId: lgaOnlyId.value, quantity: singleQuantity.value, notes: form.notes || undefined })
    } else if (targetType.value === 'OFFICER') {
      await allocationsStore.allocateToOfficer({ voucherBatchId: form.voucherBatchId, officerId: officerId.value, quantity: singleQuantity.value, notes: form.notes || undefined })
    } else if (targetType.value === 'WARD') {
      await allocationsStore.allocateToWard({
        voucherBatchId: form.voucherBatchId,
        wardId: targets.value[0]!.wardId,
        quantity: targets.value[0]!.quantity,
        notes: form.notes || undefined,
      })
    } else {
      await allocationsStore.allocateToWards({
        voucherBatchId: form.voucherBatchId,
        targets: targets.value.map(t => ({ wardId: t.wardId, quantity: t.quantity })),
        notes: form.notes || undefined,
      })
    }
    submitted.value = true
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    loading.value = false
  }
}
</script>
