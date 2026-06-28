<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Allocate Vouchers</h1>
      <p class="text-sm text-gray-500">Assign received vouchers to an LGA, ward, or directly to a field distribution team.</p>
    </div>

    <UCard>
      <UForm :state="form" class="space-y-5" @submit="onSubmit">
        <UFormField label="Batch" name="batchId">
          <USelect v-model="form.batchId" :items="batchOptions" class="w-full" />
        </UFormField>

        <UFormField label="Allocation Target" name="target">
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="t in targets" :key="t.value" type="button"
              class="p-3 rounded-xl border text-sm font-medium text-center transition-colors"
              :class="form.target === t.value ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800'"
              @click="form.target = t.value"
            >{{ t.label }}</button>
          </div>
        </UFormField>

        <UFormField label="LGA" name="lgaId">
          <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" />
        </UFormField>
        <UFormField v-if="form.target === 'Ward'" label="Ward" name="wardId">
          <USelect v-model="form.wardId" :items="wardOptions" :disabled="!form.lgaId" class="w-full" />
        </UFormField>
        <UFormField v-if="form.target === 'Officer'" label="Officer" name="officerId">
          <USelect v-model="form.officerId" :items="officerOptions" class="w-full" />
        </UFormField>

        <UFormField label="Quantity to allocate" name="quantity">
          <UInput v-model.number="form.quantity" type="number" class="w-full" />
          <template #help>
            <span v-if="selectedBatch">{{ remaining.toLocaleString() }} unallocated remaining in this batch</span>
          </template>
        </UFormField>

        <UAlert v-if="form.quantity > remaining" color="error" variant="subtle" title="Quantity exceeds the available unallocated balance for this batch." />
        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UAlert v-if="submitted" color="success" variant="subtle" title="Vouchers allocated." />

        <UButton type="submit" size="lg" icon="i-lucide-send" :loading="loading" :disabled="form.quantity > remaining || form.quantity <= 0">
          Allocate Vouchers
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'LGA Voucher Officer'] })

const vouchersStore = useVouchersStore()
const lgaStore = useLgaStore()
const usersStore = useUsersStore()

onMounted(async () => {
  await Promise.all([vouchersStore.fetchBatches(), lgaStore.ensureLoaded(), usersStore.fetchUsers()])
})

const batchOptions = computed(() => vouchersStore.batches.map(b => ({ label: b.batchCode, value: b.id })))
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const officerOptions = computed(() => usersStore.users
  .filter(u => ['Ward PA / Issuing Officer', 'Redemption Officer', 'AKBPA Admin'].includes(u.role))
  .map(u => ({ label: `${u.fullName} (${u.role})`, value: u.id })))

const targets = [
  { label: 'LGA', value: 'Lga' },
  { label: 'Ward', value: 'Ward' },
  { label: 'Officer', value: 'Officer' },
]

const form = reactive({ batchId: '', target: 'Ward', lgaId: '', wardId: '', officerId: '', quantity: 100 })
watch(batchOptions, (list) => { if (!form.batchId && list[0]) form.batchId = list[0].value }, { immediate: true })

const submitted = ref(false)
const loading = ref(false)
const error = ref('')

const wardOptions = computed(() => lgaStore.wardsForLga(form.lgaId).map(w => ({ label: w.name, value: w.id })))
const selectedBatch = computed(() => vouchersStore.batches.find(b => b.id === form.batchId))
const remaining = computed(() => selectedBatch.value ? selectedBatch.value.quantityReceived - selectedBatch.value.quantityAllocated : 0)

async function onSubmit() {
  error.value = ''
  submitted.value = false
  loading.value = true
  try {
    await vouchersStore.allocate({
      batchId: form.batchId,
      target: form.target as 'Lga' | 'Ward' | 'Officer',
      lgaId: form.lgaId || undefined,
      wardId: form.wardId || undefined,
      officerId: form.officerId || undefined,
      quantity: form.quantity,
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
