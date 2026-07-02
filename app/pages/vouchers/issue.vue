<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Issue Voucher</h1>
      <p class="text-sm text-gray-500">
        {{ wardLabel || 'Your ward' }} ·
        {{ beneficiariesStore.pagination.total.toLocaleString() }} beneficiaries
      </p>
    </div>

    <!-- Search -->
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Search beneficiary by name or ID..."
      class="w-full"
      @keyup.enter="onSearch"
    />

    <!-- Beneficiary list -->
    <div class="space-y-2">
      <template v-if="beneficiariesStore.loading">
        <div
          v-for="n in 6" :key="n"
          class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between"
        >
          <div class="space-y-2">
            <USkeleton class="h-4 w-48" />
            <USkeleton class="h-3 w-64" />
          </div>
          <USkeleton class="h-5 w-14 rounded-full" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="b in beneficiariesStore.beneficiaries" :key="b.id"
          class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between cursor-pointer hover:border-akbpaGreen-400 hover:bg-akbpaGreen-50 dark:hover:bg-akbpaGreen-950/20 transition-colors"
          @click="openIssueModal(b)"
        >
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ b.fullName }}</p>
            <p class="text-xs text-gray-500">{{ b.beneficiaryCode }} · {{ b.gender }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UBadge :color="b.status === 'Active' ? 'success' : 'neutral'" variant="subtle" size="xs">
              {{ b.status }}
            </UBadge>
            <UIcon name="i-lucide-chevron-right" class="text-gray-400 size-4" />
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="beneficiariesStore.pagination.pages > 1" class="flex justify-center pt-2">
      <UPagination
        :page="beneficiariesStore.page"
        :total="beneficiariesStore.pagination.total"
        :items-per-page="beneficiariesStore.pageSize"
        @update:page="onPageChange"
      />
    </div>

    <!-- Issue modal -->
    <UModal v-model:open="modalOpen" :title="selected?.fullName ?? ''" prevent-close>
      <template #body>
        <div class="space-y-5">
          <!-- Beneficiary info -->
          <div class="rounded-lg bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm space-y-0.5">
            <p class="font-medium text-gray-900 dark:text-white">{{ selected?.fullName }}</p>
            <p class="text-gray-500">{{ selected?.beneficiaryCode }}</p>
            <p class="text-gray-500">{{ selected?.gender }}</p>
          </div>

          <!-- Success state -->
          <div v-if="justIssued" class="space-y-3">
            <UAlert
              color="success"
              variant="subtle"
              icon="i-lucide-circle-check"
              title="Voucher issued successfully"
              :description="`Serial: ${justIssued}`"
            />
            <div class="flex gap-2">
              <UButton class="flex-1" variant="outline" color="neutral" @click="issueAnother">
                Issue another
              </UButton>
              <UButton class="flex-1" @click="closeModal">Done</UButton>
            </div>
          </div>

          <!-- Form state -->
          <template v-else>
            <!-- Food item picker -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Food item</p>
              <div class="flex gap-2">
                <button
                  v-for="item in FOOD_ITEMS" :key="item"
                  type="button"
                  class="flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors"
                  :class="foodItem === item
                    ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/50 text-akbpaGreen-700 dark:text-akbpaGreen-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-akbpaGreen-300'"
                  @click="foodItem = item"
                >
                  {{ item }}
                </button>
              </div>
            </div>

            <!-- Mode toggle -->
            <div class="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-sm">
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 transition-colors"
                :class="inputMode === 'scan' ? 'bg-akbpaGreen-600 text-white font-medium' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
                @click="inputMode = 'scan'; cameraActive = true; resetScan()"
              >
                <UIcon name="i-lucide-scan-line" class="size-4" /> Scan QR Code
              </button>
              <button
                class="flex-1 flex items-center justify-center gap-2 py-2 border-l border-gray-200 dark:border-gray-800 transition-colors"
                :class="inputMode === 'manual' ? 'bg-akbpaGreen-600 text-white font-medium' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
                @click="inputMode = 'manual'; cameraActive = false"
              >
                <UIcon name="i-lucide-keyboard" class="size-4" /> Type Serial
              </button>
            </div>

            <!-- ── SCAN mode ──────────────────────────────────── -->
            <div v-if="inputMode === 'scan'" class="space-y-3">
              <!-- Camera viewport — hidden once we have a scan result -->
              <div v-if="!validationResult" class="relative overflow-hidden rounded-xl bg-black aspect-square max-h-72 w-full">
                <ClientOnly>
                  <QrcodeStream
                    v-if="cameraActive"
                    :constraints="{ facingMode: 'environment' }"
                    class="w-full h-full object-cover"
                    @detect="onQrDetect"
                    @error="onCameraError"
                  />
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="relative w-48 h-48">
                      <span class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-md" />
                      <span class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-md" />
                      <span class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-md" />
                      <span class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-md" />
                    </div>
                  </div>
                  <template #fallback>
                    <div class="flex flex-col items-center justify-center h-full gap-2 text-white/70 text-sm p-4 text-center">
                      <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
                      <span>Starting camera...</span>
                    </div>
                  </template>
                </ClientOnly>
              </div>

              <!-- Validating spinner -->
              <div v-if="validating" class="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
                <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin text-akbpaGreen-600 shrink-0" />
                <p class="text-sm text-gray-600 dark:text-gray-300">Validating voucher...</p>
              </div>

              <!-- Validation success -->
              <div v-else-if="validationResult?.canIssue" class="rounded-xl border-2 border-akbpaGreen-400 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/40 px-4 py-4 space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-circle-check" class="size-5 text-akbpaGreen-600 shrink-0" />
                  <p class="text-sm font-semibold text-akbpaGreen-700 dark:text-akbpaGreen-300">Voucher validated — ready to issue</p>
                </div>
                <dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
                  <dt class="text-gray-500">Serial</dt>
                  <dd class="font-mono font-semibold text-gray-900 dark:text-white">{{ validationResult.voucher?.serialNumber ?? serialNumber }}</dd>
                  <dt v-if="validationResult.voucher?.foodItem" class="text-gray-500">Food item</dt>
                  <dd v-if="validationResult.voucher?.foodItem" class="font-medium text-gray-900 dark:text-white">{{ validationResult.voucher.foodItem }}</dd>
                  <dt v-if="validationResult.voucher?.bagSize" class="text-gray-500">Bag size</dt>
                  <dd v-if="validationResult.voucher?.bagSize" class="font-medium text-gray-900 dark:text-white">{{ validationResult.voucher.bagSize }}</dd>
                  <dt v-if="validationResult.voucher?.status" class="text-gray-500">Status</dt>
                  <dd v-if="validationResult.voucher?.status">
                    <UBadge color="success" variant="subtle" size="xs">{{ validationResult.voucher.status }}</UBadge>
                  </dd>
                </dl>
                <button class="text-xs text-akbpaGreen-700 dark:text-akbpaGreen-400 underline mt-1" @click="resetScan">
                  Scan a different voucher
                </button>
              </div>

              <!-- Validation failure — show reason + voucher details so the officer knows what went wrong -->
              <div v-else-if="validationResult && !validationResult.canIssue" class="rounded-xl border-2 border-red-300 bg-red-50 dark:bg-red-950/30 px-4 py-4 space-y-3">
                <div class="flex items-start gap-2">
                  <UIcon name="i-lucide-circle-x" class="size-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p class="text-sm font-semibold text-red-700 dark:text-red-400">Cannot issue this voucher</p>
                    <p v-if="validationResult.reason" class="text-sm text-red-600 dark:text-red-300 mt-0.5">{{ validationResult.reason }}</p>
                  </div>
                </div>
                <dl v-if="validationResult.voucher" class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm border-t border-red-200 dark:border-red-800 pt-3">
                  <dt class="text-gray-500">Serial</dt>
                  <dd class="font-mono font-semibold text-gray-900 dark:text-white">{{ validationResult.voucher.serialNumber }}</dd>
                  <dt class="text-gray-500">Food item</dt>
                  <dd class="font-medium text-gray-900 dark:text-white">{{ validationResult.voucher.foodItem }}</dd>
                  <dt v-if="validationResult.voucher.bagSize" class="text-gray-500">Bag size</dt>
                  <dd v-if="validationResult.voucher.bagSize" class="font-medium text-gray-900 dark:text-white">{{ validationResult.voucher.bagSize }}</dd>
                  <dt class="text-gray-500">Status</dt>
                  <dd>
                    <UBadge color="error" variant="subtle" size="xs">{{ validationResult.voucher.status }}</UBadge>
                  </dd>
                </dl>
                <button class="text-xs text-red-600 dark:text-red-400 underline" @click="resetScan">Scan a different voucher</button>
              </div>

              <!-- Camera error -->
              <UAlert v-else-if="cameraError" color="error" variant="subtle" icon="i-lucide-camera-off" :title="cameraError">
                <template #description>
                  <button class="underline text-sm mt-1" @click="inputMode = 'manual'">Switch to manual entry</button>
                </template>
              </UAlert>

              <p v-else class="text-xs text-center text-gray-400">
                Point the camera at the QR code on the physical voucher
              </p>
            </div>

            <!-- ── MANUAL mode ────────────────────────────────── -->
            <div v-else class="space-y-3">
              <UFormField label="Voucher serial number" name="serialNumber" required>
                <UInput
                  ref="serialInputRef"
                  v-model="serialNumber"
                  placeholder="e.g. AKS-2026-00001"
                  icon="i-lucide-ticket"
                  class="w-full font-mono"
                  autofocus
                />
              </UFormField>
            </div>

            <!-- Notes -->
            <UFormField label="Notes (optional)" name="notes">
              <UTextarea v-model="notes" placeholder="Any remarks about this issuance..." class="w-full" :rows="2" />
            </UFormField>

            <UAlert v-if="issueError" color="error" variant="subtle" :title="issueError" />

            <!-- Actions -->
            <div class="flex gap-2 pt-1">
              <UButton variant="outline" color="neutral" class="flex-1" :disabled="issuing" @click="closeModal">
                Cancel
              </UButton>
              <UButton
                class="flex-1"
                icon="i-lucide-ticket"
                :loading="issuing"
                :disabled="!issueEnabled"
                @click="submitIssue"
              >
                Issue Voucher
              </UButton>
            </div>
          </template>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Ward PA / Issuing Officer'] })

import { QrcodeStream } from 'vue-qrcode-reader'
import { validateBeforeIssuance } from '~/services/voucherIssuancesApi'
import type { Beneficiary } from '~/types'
import type { ValidateIssuanceResult } from '~/services/voucherIssuancesApi'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
const issuancesStore = useVoucherIssuancesStore()

const FOOD_ITEMS = ['Rice', 'Beans', 'Garri'] as const
type FoodItem = typeof FOOD_ITEMS[number]

const search = ref('')
const selected = ref<Beneficiary | null>(null)
const modalOpen = ref(false)
const inputMode = ref<'scan' | 'manual'>('scan')
const cameraActive = ref(false)
const cameraError = ref('')
const serialNumber = ref('')
const foodItem = ref<FoodItem>('Rice')
const notes = ref('')
const justIssued = ref('')
const issuing = ref(false)
const issueError = ref('')

// Validation state (scan mode only)
const validating = ref(false)
const validationResult = ref<ValidateIssuanceResult | null>(null)

const wardLabel = computed(() => lgaStore.wardName(auth.user?.wardIds?.[0] ?? ''))

// Issue button is enabled when:
// - scan mode: API confirmed canIssue === true
// - manual mode: user has typed a serial number
const issueEnabled = computed(() => {
  if (inputMode.value === 'scan') return validationResult.value?.canIssue === true
  return !!serialNumber.value.trim()
})

onMounted(async () => {
  try { await auth.fetchMe() } catch (err) {
    console.warn('[issue] fetchMe error:', err)
  }
  try { await lgaStore.ensureLoaded() } catch {
    // Ward PA may not have permission to list all LGAs
  }
  const myWardId = auth.user?.wardIds?.[0] ?? ''
  beneficiariesStore.wardFilter = myWardId
  await Promise.all([
    beneficiariesStore.fetchBeneficiaries({ page: 1 }),
    issuancesStore.fetchIssuances(myWardId || undefined),
  ])
})

function openIssueModal(b: Beneficiary) {
  selected.value = b
  serialNumber.value = ''
  notes.value = ''
  justIssued.value = ''
  issueError.value = ''
  cameraError.value = ''
  validationResult.value = null
  validating.value = false
  inputMode.value = 'scan'
  modalOpen.value = true
  nextTick(() => { cameraActive.value = true })
}

function closeModal() {
  modalOpen.value = false
  cameraActive.value = false
  selected.value = null
  validationResult.value = null
}

function issueAnother() {
  serialNumber.value = ''
  notes.value = ''
  justIssued.value = ''
  issueError.value = ''
  cameraError.value = ''
  validationResult.value = null
  validating.value = false
  inputMode.value = 'scan'
  nextTick(() => { cameraActive.value = true })
}

function resetScan() {
  serialNumber.value = ''
  cameraError.value = ''
  validationResult.value = null
  validating.value = false
  nextTick(() => { cameraActive.value = true })
}

async function onQrDetect(detectedCodes: any[]) {
  const raw = detectedCodes?.[0]?.rawValue
  if (!raw || validating.value || validationResult.value) return

  cameraActive.value = false
  serialNumber.value = raw
  validating.value = true
  issueError.value = ''

  const myWardId = auth.user?.wardIds?.[0] ?? ''
  const result = await validateBeforeIssuance({
    qrToken: raw,
    wardId: myWardId,
    beneficiaryId: selected.value?.id ?? '',
    foodItem: foodItem.value,
  })

  validationResult.value = result

  // Use the serialNumber the API resolved from the QR token
  if (result.canIssue && result.voucher?.serialNumber) {
    serialNumber.value = result.voucher.serialNumber
  }

  validating.value = false
}

function onCameraError(err: Error) {
  if (err.name === 'NotAllowedError') {
    cameraError.value = 'Camera permission denied.'
  } else if (err.name === 'NotFoundError') {
    cameraError.value = 'No camera found on this device.'
  } else {
    cameraError.value = `Camera unavailable: ${err.message}`
  }
}

function onSearch() {
  beneficiariesStore.search = search.value
  beneficiariesStore.fetchBeneficiaries({ page: 1 })
}

function onPageChange(page: number) {
  beneficiariesStore.fetchBeneficiaries({ page })
}

async function submitIssue() {
  if (!selected.value || !serialNumber.value.trim()) return
  const myWardId = auth.user?.wardIds?.[0]
  if (!myWardId) {
    issueError.value = 'Your account has no ward assigned. Contact an administrator.'
    return
  }
  issuing.value = true
  issueError.value = ''
  try {
    await issuancesStore.issueVoucher({
      serialNumber: serialNumber.value.trim(),
      wardId: myWardId,
      beneficiaryId: selected.value.id,
      notes: notes.value.trim() || undefined,
    })
    justIssued.value = serialNumber.value.trim()
    cameraActive.value = false
  } catch (e: any) {
    issueError.value = e.response?.data?.message ?? e.message ?? 'Failed to issue voucher'
  } finally {
    issuing.value = false
  }
}
</script>
