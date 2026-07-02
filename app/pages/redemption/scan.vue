<template>
  <div class="max-w-md mx-auto px-4 py-6 space-y-5">

    <!-- Context header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs text-white/50 uppercase tracking-wide">Distribution Point</p>
        <p class="font-semibold text-base leading-tight">{{ wardId ? lgaStore.wardName(wardId) || 'Redemption Desk' : 'Redemption Desk' }}</p>
      </div>
      <div class="bg-white/5 rounded-xl px-4 py-2 text-center min-w-[72px]">
        <p class="text-2xl font-bold leading-none">{{ redemptionsStore.redemptions.length }}</p>
        <p class="text-xs text-white/50 mt-0.5">redeemed</p>
      </div>
    </div>

    <!-- Scan view -->
    <div v-if="!scanResult" class="space-y-3">

      <!-- Ward -->
      <div>
        <p class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Ward</p>
        <div v-if="isWardPA" class="rounded-xl bg-white/5 px-4 py-3 text-sm font-medium">
          {{ lgaStore.wardName(wardId) || 'Your ward' }}
        </div>
        <USelect v-else v-model="wardId" :items="wardOptions" placeholder="Select the ward" class="w-full" @update:model-value="onWardChange" />
      </div>

      <!-- Beneficiary -->
      <div>
        <p class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Beneficiary presenting the voucher</p>
        <UInput v-model="beneficiarySearch" :disabled="!wardId" placeholder="Search by name or ID" icon="i-lucide-search" class="w-full" />

        <!-- Dropdown results -->
        <div v-if="beneficiarySearch && !selectedBeneficiary" class="border border-white/10 rounded-xl mt-2 overflow-hidden">
          <div v-if="beneficiariesStore.loading" class="flex items-center gap-2 px-4 py-4 text-sm text-white/50">
            <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin shrink-0" />
            Searching...
          </div>
          <template v-else-if="beneficiaryMatches.length">
            <button
              v-for="b in beneficiaryMatches" :key="b.id" type="button"
              class="w-full text-left px-4 py-3 text-sm hover:bg-white/5 border-b border-white/10 last:border-0"
              @click="selectedBeneficiary = b"
            >
              <p class="font-medium leading-snug">{{ b.fullName }}</p>
              <p class="text-xs text-white/40 mt-0.5">{{ b.beneficiaryCode }}</p>
            </button>
          </template>
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

        <!-- Selected beneficiary chip -->
        <div v-if="selectedBeneficiary" class="flex items-center justify-between bg-akbpaGreen-950/60 border border-akbpaGreen-800/50 rounded-xl px-4 py-3 mt-2 text-sm">
          <div class="flex items-center gap-2 min-w-0">
            <UIcon name="i-lucide-user-check" class="size-4 text-akbpaGreen-400 shrink-0" />
            <span class="font-medium truncate">{{ selectedBeneficiary.fullName }}</span>
            <span class="text-white/40 text-xs shrink-0">· {{ selectedBeneficiary.beneficiaryCode }}</span>
          </div>
          <UButton size="xs" color="neutral" variant="ghost" class="shrink-0 ml-2" @click="selectedBeneficiary = null; beneficiarySearch = ''">Change</UButton>
        </div>
      </div>

      <!-- Food item -->
      <div>
        <p class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Food item being redeemed</p>
        <div class="flex gap-2">
          <button
            v-for="item in FOOD_ITEMS" :key="item"
            type="button"
            class="flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-colors"
            :class="foodItem === item
              ? 'border-akbpaGreen-500 bg-akbpaGreen-500/20 text-akbpaGreen-300'
              : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/80'"
            @click="foodItem = item"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- Camera -->
      <div>
        <p class="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Scan voucher QR code</p>
        <div
          class="rounded-2xl overflow-hidden bg-black aspect-square relative ring-1 ring-white/10 cursor-pointer"
          @click="onCameraAreaTap"
        >
          <ClientOnly>
            <QrcodeStream v-if="cameraOn && !validating" @detect="onDetect" @error="onCameraError" />
          </ClientOnly>

          <!-- Validating overlay -->
          <div v-if="validating" class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 text-white">
            <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin" />
            <p class="text-sm font-medium">Validating voucher...</p>
          </div>

          <!-- Idle overlay: not ready -->
          <div v-else-if="!canScan" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40 p-6 text-center">
            <UIcon name="i-lucide-scan-line" class="size-10" />
            <p class="text-sm">Select a ward and beneficiary above to enable scanning</p>
          </div>

          <!-- Idle overlay: ready but camera off -->
          <div v-else-if="!cameraOn" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
            <div class="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <UIcon name="i-lucide-camera" class="size-7" />
            </div>
            <p class="text-sm font-medium">Tap to start camera</p>
          </div>

          <!-- Scan target corners -->
          <div v-if="cameraOn && !validating" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="relative w-52 h-52">
              <span class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-md" />
              <span class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-md" />
              <span class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-md" />
              <span class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-md" />
            </div>
          </div>
        </div>

        <p v-if="cameraOn" class="text-xs text-center text-white/40 mt-2">Point at the QR code on the physical voucher</p>
        <UButton v-if="cameraOn" block size="sm" color="neutral" variant="ghost" class="mt-2" @click="cameraOn = false">
          Stop Camera
        </UButton>
      </div>

      <!-- Manual fallback -->
      <div class="flex gap-2">
        <UInput v-model="manualToken" :disabled="!canScan" placeholder="Or paste a QR token manually" class="w-full text-sm" />
        <UButton :loading="validating" :disabled="!canScan || !manualToken.trim()" @click="validate(manualToken)">Check</UButton>
      </div>
    </div>

    <!-- Redemption success view -->
    <div v-else-if="justRedeemed" class="rounded-2xl bg-akbpaGreen-950 ring-2 ring-akbpaGreen-500 p-6 flex flex-col items-center text-center gap-5">
      <div class="relative mt-2">
        <div class="h-28 w-28 rounded-full bg-akbpaGreen-900 flex items-center justify-center">
          <UIcon name="i-lucide-package-check" class="size-16 text-akbpaGreen-400" />
        </div>
        <span class="absolute -top-1 -right-1 flex h-5 w-5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-akbpaGreen-400 opacity-70" />
          <span class="relative inline-flex rounded-full h-5 w-5 bg-akbpaGreen-500" />
        </span>
      </div>
      <div>
        <p class="text-3xl font-extrabold text-white">Redeemed!</p>
        <p class="text-akbpaGreen-300 mt-1 text-sm">{{ justRedeemed.beneficiaryName }}</p>
      </div>
      <div class="w-full rounded-2xl bg-white/5 px-5 py-4 text-sm space-y-2.5 text-left">
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Serial</span>
          <span class="font-mono font-bold text-right break-all">{{ justRedeemed.serialNumber }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Food item</span>
          <span class="font-semibold">{{ justRedeemed.foodItem }} · {{ justRedeemed.bagSize }}</span>
        </div>
      </div>
      <UButton block size="lg" class="w-full" icon="i-lucide-scan-line" @click="resetScan">
        Scan Next Voucher
      </UButton>
    </div>

    <!-- Result view -->
    <div v-else-if="scanResult" class="rounded-2xl p-5 space-y-4" :class="scanResult.canRedeem ? 'bg-akbpaGreen-950 ring-1 ring-akbpaGreen-700' : 'bg-rose-950 ring-1 ring-rose-700'">

      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
          :class="scanResult.canRedeem ? 'bg-akbpaGreen-800' : 'bg-rose-900'"
        >
          <UIcon
            :name="scanResult.canRedeem ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'"
            class="size-6"
            :class="scanResult.canRedeem ? 'text-akbpaGreen-400' : 'text-rose-400'"
          />
        </div>
        <div>
          <p class="font-bold text-base">{{ scanResult.canRedeem ? 'Voucher Valid' : 'Cannot Redeem' }}</p>
          <p v-if="!scanResult.canRedeem && scanResult.reason" class="text-sm text-rose-300 mt-0.5">{{ scanResult.reason }}</p>
        </div>
      </div>

      <div v-if="scanResult.voucher" class="rounded-xl bg-white/5 p-4 space-y-3 text-sm">
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Serial</span>
          <span class="font-mono text-right break-all">{{ scanResult.voucher.serialNumber }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="text-white/50 shrink-0">Food item</span>
          <span class="font-medium">{{ scanResult.voucher.foodItem }} · {{ scanResult.voucher.bagSize }}</span>
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
        <template v-if="scanResult.voucher.beneficiary">
          <div class="border-t border-white/10 pt-3 flex justify-between gap-4">
            <span class="text-white/50 shrink-0">Issued to</span>
            <span class="text-right">{{ scanResult.voucher.beneficiary.fullName ?? scanResult.voucher.beneficiary.name }}</span>
          </div>
        </template>
        <div v-if="scanResult.voucher.status === 'Allocated' && !scanResult.canRedeem" class="border-t border-white/10 pt-3">
          <p class="text-xs text-yellow-400">This voucher has been allocated to a ward but has not yet been issued to a beneficiary. It must be issued before it can be redeemed.</p>
        </div>
        <div v-else-if="scanResult.voucher.status === 'Redeemed'" class="border-t border-white/10 pt-3">
          <p class="text-xs text-blue-400">This voucher has already been redeemed.</p>
        </div>
        <div v-else-if="scanResult.voucher.autoIssueRequired && !scanResult.canRedeem" class="border-t border-white/10 pt-3">
          <p class="text-xs text-yellow-400">This voucher requires issuance before redemption can proceed.</p>
        </div>
      </div>

      <div class="space-y-2">
        <UButton v-if="scanResult.canRedeem" block size="lg" :loading="redeeming" icon="i-lucide-package-check" @click="confirmRedemption">
          Confirm Redemption · Release Bag
        </UButton>
        <UButton block size="lg" color="neutral" variant="outline" @click="resetScan">
          {{ scanResult.canRedeem ? 'Back to scanner' : 'Scan another' }}
        </UButton>
      </div>
    </div>

    <!-- Recent redemptions -->
    <div v-if="!scanResult && redemptionsStore.redemptions.length">
      <p class="text-xs text-white/50 uppercase tracking-wide mb-2">Recent this session</p>
      <div class="space-y-2">
        <div v-for="r in redemptionsStore.redemptions.slice(0, 5)" :key="r.id" class="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 text-sm">
          <span class="font-mono text-xs text-white/70">{{ r.serialNumber }}</span>
          <span class="text-white/50">{{ r.foodItem }}</span>
          <UBadge color="success" variant="subtle" size="xs">Redeemed</UBadge>
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

const FOOD_ITEMS = ['Rice', 'Beans', 'Garri'] as const

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const redemptionsStore = useVoucherRedemptionsStore()

const isWardPA = computed(() => auth.role === 'Ward PA / Issuing Officer')

onMounted(async () => {
  beneficiariesStore.reset()
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
  await beneficiariesStore.fetchBeneficiaries({ wardId: wardId.value, search: value, page: 1 })
})
const beneficiaryMatches = computed(() => beneficiariesStore.beneficiaries.slice(0, 8))

const canScan = computed(() => !!wardId.value && !!selectedBeneficiary.value)

// Auto-start camera as soon as ward + beneficiary are both selected
watch(canScan, (ready) => {
  if (ready && !cameraOn.value) nextTick(() => { cameraOn.value = true })
})

const cameraOn = ref(false)
const manualToken = ref('')
const validating = ref(false)
const redeeming = ref(false)
const foodItem = ref<FoodItem>('Rice')

const scanResult = ref<ValidateScanResult | null>(null)
const lastToken = ref('')

interface RedeemedSummary { beneficiaryName: string; serialNumber: string; foodItem: string; bagSize: string }
const justRedeemed = ref<RedeemedSummary | null>(null)

function onCameraAreaTap() {
  if (canScan.value && !cameraOn.value && !validating.value) cameraOn.value = true
}

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
    justRedeemed.value = {
      beneficiaryName: selectedBeneficiary.value.fullName,
      serialNumber: scanResult.value.voucher?.serialNumber ?? lastToken.value,
      foodItem: scanResult.value.voucher?.foodItem ?? foodItem.value,
      bagSize: scanResult.value.voucher?.bagSize ?? '',
    }
    scanResult.value = null
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
  justRedeemed.value = null
  manualToken.value = ''
  lastToken.value = ''
  nextTick(() => { cameraOn.value = true })
}
</script>
