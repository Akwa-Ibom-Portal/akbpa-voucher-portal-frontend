<template>
  <div class="max-w-md mx-auto px-4 py-6 space-y-6">
    <div>
      <p class="text-xs text-white/60 uppercase">Distribution Point</p>
      <p class="font-semibold">Redemption Desk</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white/5 rounded-xl p-4 text-center">
        <p class="text-2xl font-bold">{{ redemptionsStore.redemptions.length }}</p>
        <p class="text-xs text-white/60">redeemed this session</p>
      </div>
    </div>

    <!-- Scan view -->
    <div v-if="!scanResult">
      <UFormField label="Ward" class="text-white/80">
        <div v-if="isWardPA" class="rounded-lg bg-white/5 px-3 py-2 text-sm">
          {{ lgaStore.wardName(wardId) || 'Your ward' }}
        </div>
        <USelect v-else v-model="wardId" :items="wardOptions" placeholder="Select the ward" class="w-full" @update:model-value="onWardChange" />
      </UFormField>

      <UFormField label="Beneficiary presenting the voucher" class="text-white/80 mt-3">
        <UInput v-model="beneficiarySearch" :disabled="!wardId" placeholder="Search by name or ID" icon="i-lucide-search" class="w-full" />
      </UFormField>
      <div v-if="beneficiarySearch && !selectedBeneficiary" class="border border-white/10 rounded-lg mt-2 overflow-hidden">
        <!-- Loading -->
        <div v-if="beneficiariesStore.loading" class="flex items-center gap-2 px-3 py-3 text-sm text-white/50">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin shrink-0" />
          Searching...
        </div>

        <!-- Results -->
        <template v-else-if="beneficiaryMatches.length">
          <button
            v-for="b in beneficiaryMatches" :key="b.id" type="button"
            class="w-full text-left px-3 py-2.5 text-sm hover:bg-white/5 border-b border-white/10 last:border-0"
            @click="selectedBeneficiary = b"
          >
            {{ b.fullName }} <span class="text-white/40">· {{ b.beneficiaryCode }}</span>
          </button>
        </template>

        <!-- Empty state -->
        <div v-else class="px-4 py-4 space-y-1">
          <div class="flex items-center gap-2 text-rose-400">
            <UIcon name="i-lucide-user-x" class="size-4 shrink-0" />
            <p class="text-sm font-medium">No beneficiary found</p>
          </div>
          <p class="text-xs text-white/50 leading-relaxed">
            No match for <strong class="text-white/70">{{ beneficiarySearch }}</strong> in this ward.
            Check that the correct ward is selected, or try a different name or ID number.
          </p>
        </div>
      </div>
      <div v-if="selectedBeneficiary" class="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 mt-2 text-sm">
        <span>{{ selectedBeneficiary.fullName }} · {{ selectedBeneficiary.beneficiaryCode }}</span>
        <UButton size="xs" color="neutral" variant="ghost" @click="selectedBeneficiary = null">Change</UButton>
      </div>

      <UFormField label="Food item being redeemed" class="text-white/80 mt-3">
        <USelect v-model="foodItem" :items="['Rice', 'Beans', 'Garri']" class="w-full" />
      </UFormField>

      <div class="rounded-2xl overflow-hidden bg-black aspect-square relative ring-1 ring-white/10 mt-3">
        <ClientOnly>
          <QrcodeStream v-if="cameraOn" @detect="onDetect" @error="onCameraError" />
        </ClientOnly>
        <div v-if="!cameraOn" class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
          <UIcon name="i-lucide-scan-line" class="size-10" />
          <p class="text-sm">Point camera at the voucher code</p>
        </div>
      </div>

      <UButton block size="lg" class="mt-4" icon="i-lucide-camera" :disabled="!canScan" @click="cameraOn = !cameraOn">
        {{ cameraOn ? 'Stop Camera' : 'Start Camera' }}
      </UButton>

      <div class="flex gap-2 mt-3">
        <UInput v-model="manualToken" :disabled="!canScan" placeholder="Or type/paste a voucher QR token" class="w-full" />
        <UButton :loading="validating" :disabled="!canScan" @click="validate(manualToken)">Validate</UButton>
      </div>
    </div>

    <!-- Result view -->
    <div v-else class="rounded-2xl p-5 space-y-4" :class="scanResult.canRedeem ? 'bg-akbpaGreen-950 ring-1 ring-akbpaGreen-700' : 'bg-rose-950 ring-1 ring-rose-700'">

      <!-- Header -->
      <div class="flex items-center gap-2">
        <UIcon
          :name="scanResult.canRedeem ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'"
          class="size-6 shrink-0"
          :class="scanResult.canRedeem ? 'text-akbpaGreen-400' : 'text-rose-400'"
        />
        <p class="font-semibold">{{ scanResult.canRedeem ? 'Voucher Valid' : 'Cannot Redeem' }}</p>
      </div>

      <!-- Reason (failure only) -->
      <p v-if="!scanResult.canRedeem && scanResult.reason" class="text-sm text-rose-300 -mt-1">
        {{ scanResult.reason }}
      </p>

      <!-- Voucher details -->
      <div v-if="scanResult.voucher" class="rounded-xl bg-white/5 p-4 space-y-2.5 text-sm">
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Serial</span>
          <span class="font-mono text-right">{{ scanResult.voucher.serialNumber }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Food item</span>
          <span>{{ scanResult.voucher.foodItem }} · {{ scanResult.voucher.bagSize }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Status</span>
          <span
            class="font-semibold"
            :class="{
              'text-akbpaGreen-400': scanResult.voucher.status === 'Issued',
              'text-yellow-400': scanResult.voucher.status === 'Allocated',
              'text-rose-400': ['Cancelled', 'Missing', 'Damaged', 'Expired'].includes(scanResult.voucher.status),
              'text-blue-400': scanResult.voucher.status === 'Redeemed',
            }"
          >{{ scanResult.voucher.status }}</span>
        </div>
        <div v-if="scanResult.voucher.expiresOn" class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Expires</span>
          <span :class="isExpired(scanResult.voucher.expiresOn) ? 'text-rose-400 font-semibold' : ''">
            {{ formatDate(scanResult.voucher.expiresOn) }}
            <span v-if="isExpired(scanResult.voucher.expiresOn)"> · Expired</span>
          </span>
        </div>

        <!-- Beneficiary linked to the voucher (from issuance) -->
        <template v-if="scanResult.voucher.beneficiary">
          <div class="border-t border-white/10 pt-2.5 flex justify-between gap-4">
            <span class="text-white/50 shrink-0">Issued to</span>
            <span class="text-right">{{ scanResult.voucher.beneficiary.fullName ?? scanResult.voucher.beneficiary.name }}</span>
          </div>
        </template>

        <!-- Contextual status notes -->
        <div v-if="scanResult.voucher.status === 'Allocated' && !scanResult.canRedeem" class="border-t border-white/10 pt-2.5">
          <p class="text-xs text-yellow-400">
            This voucher has been allocated to a ward but has not yet been issued to a beneficiary.
            It must be issued before it can be redeemed.
          </p>
        </div>
        <div v-else-if="scanResult.voucher.status === 'Redeemed'" class="border-t border-white/10 pt-2.5">
          <p class="text-xs text-blue-400">This voucher has already been redeemed.</p>
        </div>
        <div v-else-if="scanResult.voucher.autoIssueRequired && !scanResult.canRedeem" class="border-t border-white/10 pt-2.5">
          <p class="text-xs text-yellow-400">This voucher requires issuance before redemption can proceed.</p>
        </div>
      </div>

      <!-- Actions -->
      <UButton v-if="scanResult.canRedeem" block size="lg" :loading="redeeming" icon="i-lucide-package-check" @click="confirmRedemption">
        Confirm Redemption · Release Bag
      </UButton>
      <UButton block size="lg" color="neutral" variant="outline" @click="resetScan">
        {{ scanResult.canRedeem ? 'Back to scanner' : 'Scan another' }}
      </UButton>
    </div>

    <div v-if="!scanResult && redemptionsStore.redemptions.length">
      <p class="text-xs text-white/50 uppercase mb-2 mt-6">Recent Redemptions</p>
      <div class="space-y-2">
        <div v-for="r in redemptionsStore.redemptions.slice(0, 5)" :key="r.id" class="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
          <span>{{ r.serialNumber }} · {{ r.foodItem }}</span>
          <UBadge color="success" variant="subtle">Redeemed</UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'scanner', middleware: ['auth', 'role'], role: ['Redemption Officer', 'Ward PA / Issuing Officer'] })

import { QrcodeStream } from 'vue-qrcode-reader'
import type { Beneficiary, FoodItem } from '~/types'
import type { ValidateScanResult } from '~/services/voucherRedemptionsApi'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const redemptionsStore = useVoucherRedemptionsStore()

const isWardPA = computed(() => auth.role === 'Ward PA / Issuing Officer')

onMounted(async () => {
  try { await auth.fetchMe() } catch {}
  try { await lgaStore.ensureLoaded() } catch {}
  if (isWardPA.value) {
    const myWardId = auth.user?.wardIds?.[0]
    if (myWardId) wardId.value = myWardId
  }
  try { await redemptionsStore.fetchRedemptions() } catch {}
})

const wardOptions = computed(() => lgaStore.wards.map(w => ({ label: `${w.name} · ${lgaStore.lgaName(w.lgaId)}`, value: w.id })))
const wardId = ref('')
const beneficiarySearch = ref('')
const selectedBeneficiary = ref<Beneficiary | null>(null)

function onWardChange() {
  selectedBeneficiary.value = null
  beneficiarySearch.value = ''
}

watch(beneficiarySearch, async (value) => {
  if (!wardId.value || !value) return
  await beneficiariesStore.fetchBeneficiaries({ wardId: wardId.value, search: value })
})
const beneficiaryMatches = computed(() => beneficiariesStore.beneficiaries.slice(0, 8))

const canScan = computed(() => !!wardId.value && !!selectedBeneficiary.value)

const cameraOn = ref(false)
const manualToken = ref('')
const validating = ref(false)
const redeeming = ref(false)
const foodItem = ref<FoodItem>('Rice')

const scanResult = ref<ValidateScanResult | null>(null)
const lastToken = ref('')

function onCameraError() {
  cameraOn.value = false
}

function onDetect(detected: { rawValue: string }[]) {
  const raw = detected[0]?.rawValue
  if (raw) validate(raw)
}

async function validate(token: string) {
  if (!token || !canScan.value || !selectedBeneficiary.value) return
  cameraOn.value = false
  validating.value = true
  lastToken.value = token
  try {
    scanResult.value = await redemptionsStore.validateScan({
      qrToken: token,
      foodItem: foodItem.value,
      beneficiaryId: selectedBeneficiary.value.id,
      wardId: wardId.value,
    })
  } finally {
    validating.value = false
  }
}

async function confirmRedemption() {
  if (!scanResult.value?.canRedeem || !selectedBeneficiary.value) return
  redeeming.value = true
  try {
    await redemptionsStore.redeemScan({
      qrToken: lastToken.value,
      foodItem: foodItem.value,
      beneficiaryId: selectedBeneficiary.value.id,
      wardId: wardId.value,
    })
    resetScan()
  } finally {
    redeeming.value = false
  }
}

function formatDate(val: string) {
  return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isExpired(val: string) {
  return new Date(val) < new Date()
}

function resetScan() {
  scanResult.value = null
  manualToken.value = ''
  lastToken.value = ''
}
</script>
