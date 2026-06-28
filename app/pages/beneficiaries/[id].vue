<template>
  <div v-if="beneficiary" class="max-w-3xl space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ beneficiary.fullName }}</h1>
        <p class="text-sm text-gray-500">{{ beneficiary.beneficiaryCode }} · {{ lgaStore.lgaName(beneficiary.lgaId) }} · {{ lgaStore.wardName(beneficiary.wardId) }}</p>
      </div>
      <UBadge :color="beneficiary.status === 'Active' ? 'success' : 'neutral'" variant="subtle" size="lg">{{ beneficiary.status }}</UBadge>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Edit Details</p>
      </template>
      <UForm :state="editForm" class="grid sm:grid-cols-2 gap-4" @submit="onSave">
        <UFormField label="Full Name" name="fullName">
          <UInput v-model="editForm.fullName" class="w-full" />
        </UFormField>
        <UFormField label="Phone" name="phone">
          <UInput v-model="editForm.phone" class="w-full" />
        </UFormField>
        <UFormField label="Status" name="status">
          <USelect v-model="editForm.status" :items="['Active', 'Inactive']" class="w-full" />
        </UFormField>
        <UAlert v-if="saveError" color="error" variant="subtle" :title="saveError" class="sm:col-span-2" />
        <UAlert v-if="saved" color="success" variant="subtle" title="Beneficiary updated." class="sm:col-span-2" />
        <div class="sm:col-span-2">
          <UButton type="submit" :loading="saving">Save Changes</UButton>
        </div>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Voucher History</p>
      </template>
      <UTable :data="history" :columns="historyColumns" :loading="loadingHistory" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer'] })

import type { Beneficiary, BeneficiaryVoucherHistoryEntry } from '~/types'
import { getBeneficiary, getBeneficiaryVoucherHistory } from '~/services/beneficiariesApi'

const route = useRoute()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()

const beneficiary = ref<Beneficiary | null>(null)
const history = ref<BeneficiaryVoucherHistoryEntry[]>([])
const loadingHistory = ref(false)

const editForm = reactive({ fullName: '', phone: '', status: 'Active' as 'Active' | 'Inactive' })
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')

onMounted(async () => {
  await lgaStore.ensureLoaded()
  const id = String(route.params.id)
  beneficiary.value = await getBeneficiary(id)
  editForm.fullName = beneficiary.value.fullName
  editForm.phone = beneficiary.value.phone ?? ''
  editForm.status = beneficiary.value.status

  loadingHistory.value = true
  try {
    history.value = await getBeneficiaryVoucherHistory(id)
  } finally {
    loadingHistory.value = false
  }
})

const historyColumns = [
  { accessorKey: 'serialNumber', header: 'Serial' },
  { accessorKey: 'foodItem', header: 'Item' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'issuedAt', header: 'Issued', cell: ({ row }: any) => row.getValue('issuedAt') ? new Date(row.getValue('issuedAt')).toLocaleDateString() : '—' },
  { accessorKey: 'redeemedAt', header: 'Redeemed', cell: ({ row }: any) => row.getValue('redeemedAt') ? new Date(row.getValue('redeemedAt')).toLocaleDateString() : '—' },
]

async function onSave() {
  if (!beneficiary.value) return
  saveError.value = ''
  saved.value = false
  saving.value = true
  try {
    beneficiary.value = await beneficiariesStore.updateBeneficiary(beneficiary.value.id, {
      fullName: editForm.fullName,
      phone: editForm.phone || undefined,
      status: editForm.status,
    })
    saved.value = true
  } catch (e: any) {
    saveError.value = e.response?.data?.message ?? e.message
  } finally {
    saving.value = false
  }
}
</script>
