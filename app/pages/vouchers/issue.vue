<template>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Issue Voucher</h1>
        <p class="text-sm text-gray-500">{{ wardLabel }} · {{ wardBeneficiaries.length }} beneficiaries in ward</p>
      </div>

      <UInput v-model="search" icon="i-lucide-search" placeholder="Search beneficiary by name or ID..." class="w-full" @keyup.enter="onSearch" />

      <div class="space-y-2">
        <UCard
          v-for="b in wardBeneficiaries" :key="b.id" class="cursor-pointer hover:ring-1 hover:ring-akbpaGreen-400"
          :class="{ 'ring-1 ring-akbpaGreen-500': selected?.id === b.id }" @click="selected = b"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ b.fullName }}</p>
              <p class="text-xs text-gray-500">{{ b.beneficiaryCode }} · {{ b.gender }}</p>
            </div>
            <UBadge :color="b.status === 'Active' ? 'success' : 'neutral'" variant="subtle" size="xs">{{ b.status }}</UBadge>
          </div>
        </UCard>
      </div>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">{{ selected ? selected.fullName : 'Select a beneficiary' }}</p>
      </template>
      <div v-if="selected" class="space-y-4">
        <UFormField label="Voucher serial number" name="serialNumber">
          <UInput v-model="serialNumber" placeholder="Scan or type the allocated serial" icon="i-lucide-qr-code" class="w-full" />
        </UFormField>
        <UFormField label="Notes" name="notes">
          <UTextarea v-model="notes" class="w-full" />
        </UFormField>
        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UAlert v-if="justIssued" color="success" variant="subtle" :title="`Voucher ${justIssued} issued to ${selected.fullName}.`" />
        <UButton size="lg" icon="i-lucide-ticket" :loading="issuing" :disabled="!serialNumber" @click="issue">Issue Voucher</UButton>
      </div>
      <p v-else class="text-sm text-gray-400">Choose a beneficiary from the list to issue a voucher.</p>
    </UCard>

    <UCard v-if="issuancesStore.issuances.length" class="lg:col-span-3">
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Recent Issuances</p>
      </template>
      <div class="grid sm:grid-cols-2 gap-2">
        <div v-for="i in issuancesStore.issuances.slice(0, 10)" :key="i.id" class="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm">
          <p class="font-mono">{{ i.serialNumber }}</p>
          <p class="text-xs text-gray-500">{{ i.beneficiaryName ?? i.beneficiaryCode }} · {{ i.issuedAt ? new Date(i.issuedAt).toLocaleDateString() : '' }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Ward PA / Issuing Officer'] })

import type { Beneficiary } from '~/types'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const issuancesStore = useVoucherIssuancesStore()

const search = ref('')
const selected = ref<Beneficiary | null>(null)
const serialNumber = ref('')
const notes = ref('')
const justIssued = ref('')
const issuing = ref(false)
const error = ref('')

const wardLabel = computed(() => lgaStore.wardName(auth.user?.wardIds?.[0] ?? ''))

onMounted(async () => {
  await lgaStore.ensureLoaded()
  // Hard ward scope: a Ward PA only ever sees beneficiaries in their own ward —
  // enforced here and must also be enforced server-side from the JWT claim.
  beneficiariesStore.wardFilter = auth.user?.wardIds?.[0] ?? ''
  await Promise.all([beneficiariesStore.fetchBeneficiaries(), issuancesStore.fetchIssuances()])
})

function onSearch() {
  beneficiariesStore.search = search.value
  beneficiariesStore.fetchBeneficiaries()
}

const wardBeneficiaries = computed(() => beneficiariesStore.beneficiaries)

async function issue() {
  if (!selected.value || !serialNumber.value) return
  issuing.value = true
  error.value = ''
  try {
    await issuancesStore.issueVoucher({
      serialNumber: serialNumber.value,
      wardId: auth.user?.wardIds?.[0] ?? '',
      beneficiaryId: selected.value.id,
      notes: notes.value || undefined,
    })
    justIssued.value = serialNumber.value
    serialNumber.value = ''
    notes.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message
  } finally {
    issuing.value = false
  }
}
</script>
