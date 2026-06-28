<template>
  <div class="max-w-md mx-auto px-4 py-6 space-y-6">
    <div>
      <p class="text-xs text-white/60 uppercase">Distribution Point</p>
      <p class="font-semibold">{{ location }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white/5 rounded-xl p-4 text-center">
        <p class="text-2xl font-bold">{{ redeemedToday.length }}</p>
        <p class="text-xs text-white/60">redeemed today</p>
      </div>
      <div class="bg-white/5 rounded-xl p-4 text-center">
        <p class="text-2xl font-bold">{{ redeemedToday.length }}</p>
        <p class="text-xs text-white/60">5kg bags released</p>
      </div>
    </div>

    <!-- Scan view -->
    <div v-if="!scanResult">
      <div class="rounded-2xl overflow-hidden bg-black aspect-square relative ring-1 ring-white/10">
        <ClientOnly>
          <QrcodeStream v-if="cameraOn" @detect="onDetect" @error="onCameraError" />
        </ClientOnly>
        <div v-if="!cameraOn" class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50">
          <UIcon name="i-lucide-scan-line" class="size-10" />
          <p class="text-sm">Point camera at the voucher code</p>
        </div>
      </div>

      <UButton block size="lg" class="mt-4" icon="i-lucide-camera" @click="cameraOn = !cameraOn">
        {{ cameraOn ? 'Stop Camera' : 'Start Camera' }}
      </UButton>

      <div class="flex gap-2 mt-3">
        <UInput v-model="manualToken" placeholder="Or type/paste a voucher token" class="w-full" />
        <UButton :loading="validating" @click="validate(manualToken)">Validate</UButton>
      </div>

      <UButton block color="neutral" variant="outline" class="mt-3" icon="i-lucide-truck" to="/field/redeem">
        Direct issue &amp; redeem (no voucher in hand)
      </UButton>
    </div>

    <!-- Result view -->
    <div v-else class="rounded-2xl p-5" :class="scanResult.valid ? 'bg-akbpaGreen-950 ring-1 ring-akbpaGreen-700' : 'bg-rose-950 ring-1 ring-rose-700'">
      <div class="flex items-center gap-2 mb-3">
        <UIcon :name="scanResult.valid ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'" class="size-6" :class="scanResult.valid ? 'text-akbpaGreen-400' : 'text-rose-400'" />
        <p class="font-semibold">{{ scanResult.valid ? 'Valid Voucher' : 'Scan Rejected' }}</p>
      </div>
      <p class="text-sm text-white/80">{{ scanResult.message }}</p>

      <div v-if="scanResult.valid" class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-white/50">Serial</span><span class="font-mono">{{ scanResult.voucher.serialNumber }}</span></div>
        <div class="flex justify-between"><span class="text-white/50">Item</span><span>{{ scanResult.voucher.foodItem }} · 5kg</span></div>
        <div class="flex justify-between"><span class="text-white/50">Status</span><span>{{ scanResult.voucher.status }}</span></div>
      </div>

      <UButton v-if="scanResult.valid" block size="lg" class="mt-5" icon="i-lucide-package-check" @click="confirmRedemption">
        Confirm Redemption · Release Bag
      </UButton>
      <UButton block size="lg" class="mt-3" color="neutral" variant="outline" @click="resetScan">
        {{ scanResult.valid ? 'Back to scanner' : 'Scan another' }}
      </UButton>
    </div>

    <div v-if="!scanResult">
      <p class="text-xs text-white/50 uppercase mb-2 mt-6">Recent Redemptions</p>
      <div class="space-y-2">
        <div v-for="r in recentRedemptions" :key="r.id" class="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
          <span>{{ r.serialNumber }}</span>
          <UBadge color="success" variant="subtle">Redeemed</UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'scanner', middleware: ['auth', 'role'], role: ['Redemption Officer'] })

import { QrcodeStream } from 'vue-qrcode-reader'
import type { Voucher } from '~/types'

const auth = useAuthStore()
const vouchersStore = useVouchersStore()
const auditStore = useAuditLogsStore()

const location = 'Ikot Ekpene · Town Hall'
const cameraOn = ref(false)
const manualToken = ref('')
const validating = ref(false)

const recentRedemptions = computed(() => auditStore.logs
  .filter(l => l.action === 'VOUCHER_REDEEMED')
  .slice(0, 3)
  .map(l => ({ id: l.id, serialNumber: l.recordId ?? '' })))
const redeemedToday = recentRedemptions

onMounted(() => {
  auditStore.moduleFilter = 'redemption'
  auditStore.fetchLogs()
})

const scanResult = ref<{ valid: boolean; message: string; voucher?: Voucher } | null>(null)

function onCameraError() {
  cameraOn.value = false
}

function onDetect(detected: { rawValue: string }[]) {
  const raw = detected[0]?.rawValue
  if (raw) validate(raw)
}

async function validate(tokenOrSerial: string) {
  cameraOn.value = false
  validating.value = true
  try {
    scanResult.value = await vouchersStore.validateScan(tokenOrSerial)
  } finally {
    validating.value = false
  }
}

async function confirmRedemption() {
  if (!scanResult.value?.voucher) return
  await vouchersStore.redeemVoucher(scanResult.value.voucher.id, auth.user?.id ?? 'unknown')
  await auditStore.fetchLogs()
  resetScan()
}

function resetScan() {
  scanResult.value = null
  manualToken.value = ''
}
</script>
