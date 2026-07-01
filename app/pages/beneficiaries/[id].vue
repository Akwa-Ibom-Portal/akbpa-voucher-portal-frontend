<template>
  <div class="max-w-5xl space-y-6">
    <UButton icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" @click="router.back()">
      Social Register
    </UButton>

    <div v-if="beneficiary">
      <!-- ── Profile Banner ─────────────────────────────────── -->
      <div class="rounded-2xl bg-gradient-to-br from-akbpaGreen-800 via-akbpaGreen-900 to-akbpaGreen-950 text-white p-6 sm:p-8 mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <!-- Initials Avatar -->
          <div class="h-20 w-20 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
            {{ initials }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl font-bold leading-tight">{{ beneficiary.fullName }}</h1>
              <UBadge :color="beneficiary.status === 'Active' ? 'success' : 'neutral'" variant="solid" size="sm">
                {{ beneficiary.status }}
              </UBadge>
            </div>
            <p class="text-akbpaGreen-200 font-mono text-xs mt-1 break-all">{{ beneficiary.beneficiaryCode }}</p>

            <!-- Quick pills -->
            <div class="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-akbpaGreen-100">
              <span v-if="beneficiary.gender" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="size-3.5 opacity-70" />{{ beneficiary.gender }}
              </span>
              <span v-if="beneficiary.dateOfBirth" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-cake" class="size-3.5 opacity-70" />{{ formatDate(beneficiary.dateOfBirth) }}
              </span>
              <span v-if="beneficiary.lgaName" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-map-pin" class="size-3.5 opacity-70" />{{ beneficiary.lgaName }}
              </span>
              <span v-if="beneficiary.wardName" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-landmark" class="size-3.5 opacity-70" />{{ beneficiary.wardName }}
              </span>
              <span v-if="beneficiary.community" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-home" class="size-3.5 opacity-70" />{{ beneficiary.community }}
              </span>
              <span v-if="beneficiary.labourType" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-briefcase" class="size-3.5 opacity-70" />{{ beneficiary.labourType }}
              </span>
            </div>
          </div>

          <!-- ID chip -->
          <div class="text-right shrink-0 hidden sm:block">
            <p class="text-xs text-akbpaGreen-400 uppercase tracking-wide">Beneficiary ID</p>
            <p class="font-mono text-lg font-bold">#{{ beneficiary.id }}</p>
          </div>
        </div>
      </div>

      <!-- ── Main 2-col grid ────────────────────────────────── -->
      <div class="grid lg:grid-cols-3 gap-5">
        <!-- Left: primary details -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Personal Information -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-user" label="Personal Information" />
            </template>
            <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Full Name" :value="beneficiary.fullName" />
              <Field label="Gender" :value="beneficiary.gender" />
              <Field label="Date of Birth" :value="formatDate(beneficiary.dateOfBirth)" />
              <Field label="Phone" :value="beneficiary.phone ? `+234 ${beneficiary.phone}` : undefined" />
              <Field label="Address" :value="beneficiary.address" class="sm:col-span-2" />
            </dl>
          </UCard>

          <!-- Household -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-users" label="Household" />
            </template>
            <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Household Ref No" :value="beneficiary.householdReferenceNo" mono class="sm:col-span-2" />
              <Field label="Member Ref No" :value="beneficiary.memberReferenceNo" mono class="sm:col-span-2" />
              <Field label="Household Number" :value="beneficiary.householdNumber" />
              <Field label="Household Size" :value="beneficiary.householdSize !== undefined && beneficiary.householdSize !== null ? String(beneficiary.householdSize) : undefined" />
              <Field label="Relationship" :value="beneficiary.relationship" class="sm:col-span-2" />
            </dl>
          </UCard>

          <!-- Economic Profile -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-briefcase" label="Economic Profile" />
            </template>
            <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Labour Type" :value="beneficiary.labourType" class="sm:col-span-2" />
            </dl>
          </UCard>
        </div>

        <!-- Right: metadata sidebar -->
        <div class="space-y-5">

          <!-- Location -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-map-pin" label="Location" />
            </template>
            <dl class="space-y-5">
              <div class="flex items-start justify-between gap-4">
                <Field label="LGA" :value="beneficiary.lgaName" />
                <Field label="Code" :value="beneficiary.lgaCode" mono class="text-right" />
              </div>
              <div class="h-px bg-gray-100 dark:bg-gray-800" />
              <div class="flex items-start justify-between gap-4">
                <Field label="Ward" :value="beneficiary.wardName" />
                <Field label="Code" :value="beneficiary.wardCode" mono class="text-right" />
              </div>
              <div v-if="beneficiary.community">
                <div class="h-px bg-gray-100 dark:bg-gray-800 mb-5" />
                <Field label="Community" :value="beneficiary.community" />
              </div>
            </dl>
          </UCard>

          <!-- Social Register -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-file-spreadsheet" label="Social Register" />
            </template>
            <dl class="space-y-5">
              <Field label="Source File" :value="beneficiary.sourceFile" mono small />
              <Field label="Register Part" :value="beneficiary.socialRegisterPart" mono small />
              <div class="grid grid-cols-2 gap-4">
                <Field label="Row No." :value="beneficiary.socialRegisterRowNumber" />
                <Field label="Imported" :value="formatDate(beneficiary.socialRegisterImportedAt)" />
              </div>
            </dl>
          </UCard>

          <!-- Record -->
          <UCard>
            <template #header>
              <SectionTitle icon="i-lucide-clock" label="Record" />
            </template>
            <dl class="space-y-5">
              <Field label="Beneficiary ID" :value="String(beneficiary.id)" mono />
              <Field label="Created" :value="formatDateTime(beneficiary.createdAt)" />
              <Field label="Last Updated" :value="formatDateTime(beneficiary.updatedAt)" />
            </dl>
          </UCard>
        </div>
      </div>

      <!-- ── Edit (collapsible) ──────────────────────────────── -->
      <UCard class="mt-5">
        <template #header>
          <button class="flex items-center justify-between w-full" @click="editOpen = !editOpen">
            <SectionTitle icon="i-lucide-pencil" label="Edit Details" />
            <UIcon :name="editOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 text-gray-400" />
          </button>
        </template>
        <div v-if="editOpen">
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
        </div>
      </UCard>

      <!-- ── Voucher History ─────────────────────────────────── -->
      <UCard class="mt-5">
        <template #header>
          <div class="flex items-center justify-between">
            <SectionTitle icon="i-lucide-ticket" label="Voucher History" />
            <UBadge v-if="history.length" color="neutral" variant="subtle">{{ history.length }}</UBadge>
          </div>
        </template>
        <UTable :data="history" :columns="historyColumns" :loading="loadingHistory">
          <template #status-cell="{ row }">
            <UBadge :color="voucherStatusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer'] })

import type { Beneficiary, BeneficiaryVoucherHistoryEntry } from '~/types'
import { getBeneficiary, getBeneficiaryVoucherHistory } from '~/services/beneficiariesApi'

// ── Inline sub-components ──────────────────────────────────────
const SectionTitle = defineComponent({
  props: { icon: String, label: String },
  setup(props) {
    return () => h('div', { class: 'flex items-center gap-2' }, [
      h(resolveComponent('UIcon'), { name: props.icon, class: 'size-4 text-akbpaGreen-600' }),
      h('p', { class: 'font-semibold text-gray-900 dark:text-white text-sm' }, props.label),
    ])
  },
})

const Field = defineComponent({
  props: { label: String, value: String, mono: Boolean, small: Boolean },
  setup(props) {
    return () => h('div', {}, [
      h('dt', { class: 'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide' }, props.label),
      h('dd', {
        class: [
          'mt-0.5 text-gray-900 dark:text-white',
          props.small ? 'text-xs break-all' : 'text-sm',
          props.mono ? 'font-mono' : '',
          !props.value ? 'text-gray-400 dark:text-gray-600' : '',
        ].join(' ').trim(),
      }, props.value || '—'),
    ])
  },
})

// ── Page logic ─────────────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()

const beneficiary = ref<Beneficiary | null>(null)
const history = ref<BeneficiaryVoucherHistoryEntry[]>([])
const loadingHistory = ref(false)
const editOpen = ref(false)

const editForm = reactive({ fullName: '', phone: '', status: 'Active' as 'Active' | 'Inactive' })
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')

const initials = computed(() => {
  if (!beneficiary.value) return '?'
  return beneficiary.value.fullName.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('')
})

onMounted(async () => {
  const id = String(route.params.id)
  try { await lgaStore.ensureLoaded() } catch {}
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

function formatDate(val?: string) {
  return val ? new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
}

function formatDateTime(val?: string) {
  return val ? new Date(val).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}

function voucherStatusColor(status: string) {
  if (status === 'Redeemed') return 'success'
  if (status === 'Issued') return 'primary'
  if (status === 'Expired' || status === 'Cancelled') return 'error'
  return 'neutral'
}

const historyColumns = [
  { accessorKey: 'serialNumber', header: 'Serial' },
  { accessorKey: 'foodItem', header: 'Item' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'issuedAt', header: 'Issued', cell: ({ row }: any) => formatDate(row.getValue('issuedAt')) || '—' },
  { accessorKey: 'redeemedAt', header: 'Redeemed', cell: ({ row }: any) => formatDate(row.getValue('redeemedAt')) || '—' },
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
