<template>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Issue Voucher</h1>
        <p class="text-sm text-gray-500">{{ wardLabel }} · {{ wardBeneficiaries.length }} beneficiaries in ward</p>
      </div>

      <UInput v-model="search" icon="i-lucide-search" placeholder="Search beneficiary by name or ID..." class="w-full" @keyup.enter="onSearch" />

      <div class="space-y-2">
        <UCard v-for="b in filtered" :key="b.id" class="cursor-pointer hover:ring-1 hover:ring-akbpaGreen-400" @click="selected = b">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ b.firstName }} {{ b.surname }}</p>
              <p class="text-xs text-gray-500">{{ b.beneficiaryCode }} · {{ b.gender }}</p>
            </div>
            <div class="flex gap-1">
              <UBadge v-for="item in ['Rice', 'Beans', 'Garri']" :key="item" :color="statusColor(b.voucherStatus[item])" variant="subtle" size="xs">
                {{ item[0] }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">{{ selected ? `${selected.firstName} ${selected.surname}` : 'Select a beneficiary' }}</p>
      </template>
      <div v-if="selected" class="space-y-3">
        <div v-for="item in ['Rice', 'Beans', 'Garri']" :key="item" class="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div>
            <p class="text-sm font-medium">{{ itemEmoji(item) }} {{ item }} · 5kg</p>
            <p class="text-xs text-gray-500">{{ selected.voucherStatus[item] }}</p>
          </div>
          <UButton
            v-if="selected.voucherStatus[item] === 'Pending'"
            size="sm" :loading="issuing === item" @click="issue(item)"
          >Issue</UButton>
          <UIcon v-else name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600" />
        </div>
        <UAlert v-if="justIssued" color="success" variant="subtle" :title="`${justIssued} voucher issued to ${selected.firstName} ${selected.surname}.`" />
      </div>
      <p v-else class="text-sm text-gray-400">Choose a beneficiary from the list to issue a voucher.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['WardPA'] })

import type { Beneficiary, FoodItem } from '~/types'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const vouchersStore = useVouchersStore()

const search = ref('')
const selected = ref<Beneficiary | null>(null)
const justIssued = ref('')
const issuing = ref<FoodItem | ''>('')

const wardLabel = computed(() => lgaStore.wardName(auth.user?.wardId ?? ''))

onMounted(async () => {
  await lgaStore.ensureLoaded()
  // Hard ward scope: a Ward PA only ever sees beneficiaries in their own ward —
  // enforced here and must also be enforced server-side from the JWT claim.
  beneficiariesStore.wardFilter = auth.user?.wardId ?? ''
  await beneficiariesStore.fetchBeneficiaries()
})

function onSearch() {
  beneficiariesStore.search = search.value
  beneficiariesStore.fetchBeneficiaries()
}

const wardBeneficiaries = computed(() => beneficiariesStore.beneficiaries)
const filtered = wardBeneficiaries

function itemEmoji(item: string) { return item === 'Rice' ? '🍚' : item === 'Beans' ? '🫘' : '🌾' }
function statusColor(status: string) { return status === 'Redeemed' ? 'success' : status === 'Issued' ? 'info' : 'neutral' }

async function issue(item: FoodItem) {
  if (!selected.value) return
  issuing.value = item
  try {
    const updated = await vouchersStore.issueVoucher(selected.value.id, item, auth.user?.id ?? 'unknown')
    selected.value.voucherStatus = updated.voucherStatus
    justIssued.value = item
  } finally {
    issuing.value = ''
  }
}
</script>
