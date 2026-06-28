<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Field Distribution — Direct Issue &amp; Redeem</h1>
      <p class="text-sm text-gray-500">
        For truck-based delivery at LGA/ward headquarters, where food is handed out and
        collected in the same visit — bypassing the separate Ward PA issuance step.
      </p>
    </div>

    <UAlert color="warning" variant="subtle" icon="i-lucide-shield-alert" title="Single-step issue + redeem — use with care.">
      <template #description>
        This combines issuance and redemption into one action for field operations. Every
        action here is still individually audit-logged against your account and location.
      </template>
    </UAlert>

    <UCard>
      <UForm :state="form" class="space-y-5" @submit="onSubmit">
        <UFormField label="Distribution Point" name="location">
          <UInput v-model="form.location" placeholder="e.g. Ikot Ekpene · Town Hall" class="w-full" />
        </UFormField>

        <UFormField label="LGA" name="lgaId">
          <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" />
        </UFormField>

        <UFormField label="Find Beneficiary" name="search">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Search by name or Beneficiary ID" class="w-full" />
        </UFormField>

        <div v-if="search && !selected" class="border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800 max-h-56 overflow-y-auto">
          <button
            v-for="b in matches" :key="b.id" type="button"
            class="w-full text-left px-3 py-2 text-sm hover:bg-akbpaGreen-50 dark:hover:bg-gray-800"
            @click="selectBeneficiary(b)"
          >
            {{ b.firstName }} {{ b.surname }} <span class="text-gray-400">· {{ b.beneficiaryCode }}</span>
          </button>
        </div>

        <UCard v-if="selected" class="bg-gray-50 dark:bg-gray-800 border-none">
          <p class="font-medium text-sm">{{ selected.firstName }} {{ selected.surname }}</p>
          <p class="text-xs text-gray-500">{{ selected.beneficiaryCode }} · {{ lgaName(selected.lgaId) }}</p>
          <UButton size="xs" color="neutral" variant="ghost" class="mt-1" @click="selected = null">Change</UButton>
        </UCard>

        <UFormField v-if="selected" label="Food Item" name="foodItem">
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="item in items" :key="item.value" type="button"
              class="p-3 rounded-xl border text-center"
              :class="form.foodItem === item.value ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950' : 'border-gray-200 dark:border-gray-800'"
              :disabled="selected.voucherStatus[item.value] === 'Redeemed'"
              @click="form.foodItem = item.value"
            >
              <p class="text-xl">{{ item.emoji }}</p>
              <p class="text-xs mt-1">{{ item.value }}</p>
              <p class="text-[10px] text-gray-400">{{ selected.voucherStatus[item.value] }}</p>
            </button>
          </div>
        </UFormField>

        <UAlert v-if="result" :color="result.ok ? 'success' : 'error'" variant="subtle" :title="result.message" />

        <UButton v-if="selected" type="submit" size="lg" icon="i-lucide-truck" :loading="submitting" :disabled="selected.voucherStatus[form.foodItem] === 'Redeemed'">
          Confirm Direct Issue &amp; Redeem
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['AKBPA Admin', 'Redemption Officer'] })

import type { Beneficiary, FoodItem } from '~/types'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const vouchersStore = useVouchersStore()

onMounted(() => lgaStore.ensureLoaded())

const items: { value: FoodItem; emoji: string }[] = [
  { value: 'Rice', emoji: '🍚' }, { value: 'Beans', emoji: '🫘' }, { value: 'Garri', emoji: '🌾' },
]
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))

const form = reactive({ location: '', lgaId: '', foodItem: 'Rice' as FoodItem })
const search = ref('')
const selected = ref<Beneficiary | null>(null)
const result = ref<{ ok: boolean; message: string } | null>(null)
const submitting = ref(false)

const matches = computed(() => beneficiariesStore.beneficiaries.slice(0, 8))

watch(search, (value) => {
  beneficiariesStore.fetchBeneficiaries({ search: value || undefined })
})

function selectBeneficiary(b: Beneficiary) {
  selected.value = b
  search.value = ''
}
function lgaName(id: string) { return lgaStore.lgaName(id) }

async function onSubmit() {
  if (!selected.value) return
  submitting.value = true
  try {
    const updated = await vouchersStore.fieldIssueAndRedeem({
      beneficiaryId: selected.value.id,
      foodItem: form.foodItem,
      lgaId: form.lgaId,
      location: form.location,
      officerId: auth.user?.id ?? 'unknown',
    })
    selected.value.voucherStatus = updated.voucherStatus
    result.value = { ok: true, message: `${form.foodItem} released to ${updated.firstName} ${updated.surname} and marked redeemed.` }
  } catch (e: any) {
    result.value = { ok: false, message: e.message }
  } finally {
    submitting.value = false
  }
}
</script>
