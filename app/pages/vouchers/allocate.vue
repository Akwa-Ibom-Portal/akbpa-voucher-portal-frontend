<template>
  <div class="space-y-6">

    <!-- Page header + view toggle -->
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Allocate Vouchers</h1>
        <p class="text-sm text-gray-500">Assign batch stock to an LGA, ward(s), or officer.</p>
      </div>
      <!-- Toggle -->
      <div
        class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-900 gap-0.5 transition-opacity"
        :class="pageLoading ? 'opacity-40 pointer-events-none' : ''"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'wizard'
            ? 'bg-white dark:bg-gray-800 text-akbpaGreen-700 dark:text-akbpaGreen-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="viewMode = 'wizard'; step = 1"
        >
          <UIcon name="i-lucide-list-ordered" class="size-4" />
          Step-by-Step
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'advanced'
            ? 'bg-white dark:bg-gray-800 text-akbpaGreen-700 dark:text-akbpaGreen-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="viewMode = 'advanced'"
        >
          <UIcon name="i-lucide-layout-panel-left" class="size-4" />
          Advanced
        </button>
      </div>
    </div>

    <!-- ── Page loading skeleton ──────────────────────────────── -->
    <template v-if="pageLoading">
      <div class="max-w-3xl mx-auto space-y-4">
        <!-- Step indicator skeleton -->
        <div class="flex items-center gap-0">
          <template v-for="i in 4" :key="i">
            <div class="flex flex-col items-center">
              <div class="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div class="h-3 w-12 rounded bg-gray-100 dark:bg-gray-800 mt-1 animate-pulse hidden sm:block" />
            </div>
            <div v-if="i < 4" class="flex-1 h-0.5 mb-4 bg-gray-200 dark:bg-gray-700" />
          </template>
        </div>
        <!-- Card skeleton -->
        <UCard>
          <div class="space-y-4 py-2">
            <div class="h-5 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div class="h-4 w-48 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div class="space-y-3 pt-2">
              <div v-for="j in 3" :key="j" class="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="space-y-1.5">
                    <div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div class="h-3 w-28 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  </div>
                  <div class="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  WIZARD VIEW                                           -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <template v-else-if="viewMode === 'wizard'">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Step indicator -->
        <div class="flex items-center gap-0">
          <template v-for="(s, i) in steps" :key="s.label">
            <div class="flex flex-col items-center">
              <div
                class="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors"
                :class="step > i + 1
                  ? 'bg-akbpaGreen-600 border-akbpaGreen-600 text-white'
                  : step === i + 1
                    ? 'bg-white dark:bg-gray-900 border-akbpaGreen-500 text-akbpaGreen-600'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400'"
              >
                <UIcon v-if="step > i + 1" name="i-lucide-check" class="size-4" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <p class="text-xs mt-1 font-medium hidden sm:block" :class="step === i + 1 ? 'text-akbpaGreen-600' : 'text-gray-400'">{{ s.label }}</p>
            </div>
            <div v-if="i < steps.length - 1" class="flex-1 h-0.5 mb-4" :class="step > i + 1 ? 'bg-akbpaGreen-500' : 'bg-gray-200 dark:bg-gray-700'" />
          </template>
        </div>

        <!-- Step 1: Batch -->
        <template v-if="step === 1">
          <UCard>
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">Which batch of vouchers do you want to distribute?</p>
              <p class="text-sm text-gray-500 mt-0.5">Select a batch from the list below.</p>
            </template>
            <div class="space-y-3">
              <div v-if="!readyBatches.length" class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center space-y-2">
                <UIcon name="i-lucide-package-x" class="size-8 text-gray-300 mx-auto" />
                <p class="font-semibold text-gray-500">No batches ready for allocation</p>
                <p class="text-sm text-gray-400">All batches are either fully allocated, closed, or cancelled. Generate a new batch first.</p>
                <UButton size="sm" variant="outline" color="neutral" icon="i-lucide-plus" to="/vouchers/generate" class="mt-2">Generate New Batch</UButton>
              </div>
              <button
                v-for="b in readyBatches" :key="b.id" type="button"
                class="w-full text-left rounded-xl border-2 p-4 transition-all"
                :class="form.voucherBatchId === b.id
                  ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-akbpaGreen-300'"
                @click="form.voucherBatchId = b.id"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-bold text-gray-900 dark:text-white font-mono">{{ b.batchCode }}</p>
                      <UBadge :color="b.status === 'Generated' ? 'neutral' : b.status === 'Received' ? 'info' : b.status === 'ReconciliationRequired' ? 'error' : 'warning'" variant="subtle" size="xs">{{ b.status === 'PartlyAllocated' ? 'Partly Allocated' : b.status === 'ReconciliationRequired' ? 'Reconciliation Required' : b.status }}</UBadge>
                    </div>
                    <p class="text-sm text-gray-500 mt-0.5">{{ b.foodItem }} · {{ b.bagSize }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-2xl font-black" :class="batchRemaining(b.id) > 0 ? 'text-akbpaGreen-600' : 'text-red-500'">
                      {{ batchRemaining(b.id).toLocaleString() }}
                    </p>
                    <p class="text-xs text-gray-400">available</p>
                  </div>
                </div>
                <div class="mt-3 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="batchAllocatedPct(b.id) >= 100 ? 'bg-red-400' : batchAllocatedPct(b.id) > 75 ? 'bg-orange-400' : 'bg-akbpaGreen-400'"
                    :style="`width: ${Math.min(batchAllocatedPct(b.id), 100)}%`"
                  />
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ batchAllocatedPct(b.id).toFixed(0) }}% of {{ b.quantity.toLocaleString() }} total distributed</p>
              </button>
            </div>
            <div class="mt-6 flex justify-end">
              <UButton size="lg" icon="i-lucide-arrow-right" trailing :disabled="!form.voucherBatchId" @click="step = 2">Continue</UButton>
            </div>
          </UCard>
        </template>

        <!-- Step 2: Recipient -->
        <template v-if="step === 2">
          <UCard>
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">Who will receive these vouchers?</p>
              <p class="text-sm text-gray-500 mt-0.5">Choose a recipient type, then select the specific one.</p>
            </template>
            <div class="grid sm:grid-cols-2 gap-3 mb-6">
              <button
                v-for="t in targetTypes" :key="t.value" type="button"
                class="p-4 rounded-xl border-2 text-left transition-all"
                :class="targetType === t.value
                  ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-akbpaGreen-300'"
                @click="targetType = t.value; resetTargets()"
              >
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                    :class="targetType === t.value ? 'bg-akbpaGreen-100 dark:bg-akbpaGreen-900' : 'bg-gray-100 dark:bg-gray-800'">
                    <UIcon :name="t.icon" class="size-5" :class="targetType === t.value ? 'text-akbpaGreen-600' : 'text-gray-400'" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ t.label }}</p>
                    <p class="text-xs text-gray-500">{{ t.desc }}</p>
                  </div>
                </div>
              </button>
            </div>

            <div v-if="targetType" class="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-4">
              <template v-if="targetType === 'LGA'">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select LGA</label>
                <div class="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  <button v-for="lga in lgaStore.lgas" :key="lga.id" type="button"
                    class="p-3 rounded-lg border text-left transition-all text-sm"
                    :class="lgaOnlyId === lga.id ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/50 font-semibold text-akbpaGreen-700' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-akbpaGreen-300'"
                    @click="lgaOnlyId = lga.id">
                    <span class="flex items-center justify-between gap-1">
                      {{ lga.name }}
                      <UBadge v-if="lgaAllocated[lga.id]" color="warning" variant="subtle" size="xs">{{ lgaAllocated[lga.id]!.toLocaleString() }} given</UBadge>
                    </span>
                  </button>
                </div>
              </template>
              <template v-if="targetType === 'WARD' || targetType === 'WARDS'">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select LGA first</label>
                  <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" @change="resetTargets" />
                </div>
                <div v-if="form.lgaId">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ targetType === 'WARDS' ? 'Select wards' : 'Select ward' }}</label>
                  <div class="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    <button v-for="ward in lgaStore.wardsForLga(form.lgaId)" :key="ward.id" type="button"
                      class="p-3 rounded-lg border text-left transition-all text-sm"
                      :class="targets.some(t => t.wardId === ward.id) ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950/50 font-semibold text-akbpaGreen-700' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-akbpaGreen-300'"
                      @click="toggleWard(ward.id)">
                      <span class="flex items-center justify-between gap-2">
                        <span class="truncate">{{ ward.name }}</span>
                        <UBadge v-if="wardAllocated[ward.id]" color="warning" variant="subtle" size="xs">{{ wardAllocated[ward.id]!.toLocaleString() }} given</UBadge>
                      </span>
                    </button>
                  </div>
                  <p v-if="targetType === 'WARDS'" class="text-xs text-gray-400 mt-2">{{ targets.filter(t => t.wardId).length }} ward(s) selected</p>
                </div>
              </template>
              <template v-if="targetType === 'OFFICER'">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Officer</label>
                <USelect v-model="officerId" :items="officerOptions" class="w-full" />
              </template>
            </div>

            <div class="mt-6 flex items-center justify-between">
              <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="step = 1">Back</UButton>
              <UButton size="lg" icon="i-lucide-arrow-right" trailing :disabled="!recipientSelected" @click="step = 3">Continue</UButton>
            </div>
          </UCard>
        </template>

        <!-- Step 3: Quantity -->
        <template v-if="step === 3">
          <UCard>
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">How many vouchers are you giving?</p>
              <p class="text-sm text-gray-500 mt-0.5">Giving to: <strong class="text-gray-900 dark:text-white">{{ recipientLabel }}</strong></p>
            </template>

            <div v-if="targetType === 'WARD' || targetType === 'WARDS'" class="space-y-4">
              <div v-for="target in targets.filter(t => t.wardId)" :key="target.wardId" class="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p class="font-semibold text-gray-900 dark:text-white mb-3">
                  {{ lgaStore.wardsForLga(form.lgaId).find(w => w.id === target.wardId)?.name ?? target.wardId }}
                  <span v-if="wardAllocated[target.wardId]" class="text-xs font-normal text-orange-500 ml-2">({{ wardAllocated[target.wardId]!.toLocaleString() }} already received)</span>
                </p>
                <div class="flex items-center gap-3">
                  <UButton icon="i-lucide-minus" color="neutral" variant="outline" :disabled="target.quantity <= 50" @click="target.quantity = Math.max(50, target.quantity - 50)" />
                  <UInput v-model.number="target.quantity" type="number" min="1" :max="remaining" class="w-32 text-center" />
                  <UButton icon="i-lucide-plus" color="neutral" variant="outline" :disabled="targetsTotal >= remaining" @click="target.quantity += 50" />
                </div>
              </div>
              <QuantitySummary :giving="targetsTotal" :remaining="remaining" />
              <UAlert v-if="targetsTotal > remaining" color="error" variant="subtle" icon="i-lucide-circle-x" :title="`Too many: only ${remaining.toLocaleString()} remain in this batch.`" />
            </div>

            <div v-else class="space-y-6">
              <div class="flex flex-col items-center gap-4 py-4">
                <div class="flex items-center gap-4">
                  <UButton size="xl" icon="i-lucide-minus" color="neutral" variant="outline" :disabled="singleQuantity <= 50" @click="singleQuantity = Math.max(50, singleQuantity - 50)" />
                  <div class="text-center">
                    <input v-model.number="singleQuantity" type="number" min="1" :max="remaining"
                      class="w-36 text-center text-4xl font-black text-gray-900 dark:text-white bg-transparent border-b-2 border-akbpaGreen-400 focus:outline-none focus:border-akbpaGreen-600" />
                    <p class="text-sm text-gray-400 mt-1">vouchers</p>
                  </div>
                  <UButton size="xl" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="singleQuantity >= remaining" @click="singleQuantity += 50" />
                </div>
                <div class="flex flex-wrap justify-center gap-2">
                  <UButton v-for="q in quickQty" :key="q" size="sm" :variant="singleQuantity === q ? 'solid' : 'outline'" color="neutral" @click="singleQuantity = q">{{ q.toLocaleString() }}</UButton>
                </div>
              </div>
              <QuantitySummary :giving="singleQuantity" :remaining="remaining" />
              <UAlert v-if="singleQuantity > remaining" color="error" variant="subtle" icon="i-lucide-circle-x" :title="`Only ${remaining.toLocaleString()} vouchers remain.`" />
            </div>

            <UFormField label="Notes (optional)" name="notes" class="mt-5">
              <UTextarea v-model="form.notes" :rows="2" class="w-full" placeholder="e.g. First distribution for Q1 2026" />
            </UFormField>

            <div class="mt-6 flex items-center justify-between">
              <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="step = 2">Back</UButton>
              <UButton size="lg" icon="i-lucide-arrow-right" trailing :disabled="!canProceedToConfirm" @click="step = 4">Review &amp; Confirm</UButton>
            </div>
          </UCard>
        </template>

        <!-- Step 4: Confirm -->
        <template v-if="step === 4">
          <UCard>
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">Confirm Allocation</p>
              <p class="text-sm text-gray-500 mt-0.5">Please check the details below before confirming.</p>
            </template>
            <div class="space-y-4">
              <div class="rounded-2xl bg-akbpaGreen-50 dark:bg-akbpaGreen-950/40 border border-akbpaGreen-100 dark:border-akbpaGreen-900 p-6 text-center">
                <p class="text-sm text-akbpaGreen-700 dark:text-akbpaGreen-300 font-medium uppercase tracking-wide">You are giving</p>
                <p class="text-5xl font-black text-akbpaGreen-700 dark:text-akbpaGreen-300 my-2">{{ confirmQty.toLocaleString() }}</p>
                <p class="text-sm text-akbpaGreen-700 dark:text-akbpaGreen-300 font-medium">{{ selectedBatch?.foodItem }} vouchers</p>
              </div>
              <dl class="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="flex justify-between px-4 py-3 text-sm"><dt class="text-gray-500">From batch</dt><dd class="font-mono font-semibold text-gray-900 dark:text-white">{{ selectedBatch?.batchCode }}</dd></div>
                <div class="flex justify-between px-4 py-3 text-sm"><dt class="text-gray-500">To</dt><dd class="font-semibold text-gray-900 dark:text-white">{{ recipientLabel }}</dd></div>
                <div class="flex justify-between px-4 py-3 text-sm"><dt class="text-gray-500">Remaining after</dt><dd class="font-bold" :class="remaining - confirmQty >= 0 ? 'text-akbpaGreen-600' : 'text-red-500'">{{ (remaining - confirmQty).toLocaleString() }}</dd></div>
                <div v-if="form.notes" class="flex justify-between px-4 py-3 text-sm"><dt class="text-gray-500">Notes</dt><dd class="text-gray-700 dark:text-gray-300 text-right max-w-xs">{{ form.notes }}</dd></div>
              </dl>
              <UAlert v-if="submitError" color="error" variant="subtle" :title="submitError" />
              <UButton size="xl" block icon="i-lucide-check-circle" :loading="loading" color="success" @click="onSubmit">
                Confirm — Give {{ confirmQty.toLocaleString() }} Vouchers
              </UButton>
            </div>
            <div class="mt-4">
              <UButton variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="step = 3">Go back and change</UButton>
            </div>
          </UCard>
        </template>

        <!-- Step 5: Success -->
        <template v-if="step === 5">
          <UCard>
            <div class="text-center py-6 space-y-3">
              <div class="h-16 w-16 mx-auto rounded-full bg-akbpaGreen-100 dark:bg-akbpaGreen-900 flex items-center justify-center">
                <UIcon name="i-lucide-check-circle-2" class="size-9 text-akbpaGreen-600" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">Allocation Complete</p>
                <p class="text-gray-500 mt-1">
                  <strong class="text-gray-900 dark:text-white">{{ lastConfirmQty.toLocaleString() }}</strong> vouchers allocated to
                  <strong class="text-gray-900 dark:text-white">{{ lastRecipientLabel }}</strong>.
                </p>
              </div>
              <UButton size="lg" icon="i-lucide-plus" :loading="refreshing" @click="startFresh">Allocate More Vouchers</UButton>
            </div>

            <!-- Inline recent history -->
            <div v-if="allocationsStore.allocations.length" class="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Allocations</p>
              <div class="space-y-2">
                <div
                  v-for="a in allocationsStore.allocations.slice(0, 5)" :key="a.id"
                  class="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3 text-sm"
                >
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ a.wardName ?? a.lgaName ?? a.officerName ?? '—' }}</p>
                    <p class="text-xs text-gray-400">{{ a.batchCode }} · {{ a.targetType }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900 dark:text-white">{{ (a.quantity ?? 0).toLocaleString() }}</p>
                    <p class="text-xs text-gray-400">{{ a.allocatedAt ? new Date(a.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </template>

      </div>
    </template>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!--  ADVANCED VIEW                                         -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <template v-else-if="viewMode === 'advanced'">
      <div class="grid lg:grid-cols-5 gap-6 items-start">

        <!-- Left: Form -->
        <div class="lg:col-span-3 space-y-5">
          <UCard>
            <UForm :state="form" class="space-y-5" @submit.prevent>

              <UFormField label="Batch" name="voucherBatchId">
                <div v-if="!readyBatches.length" class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 text-center space-y-1">
                  <UIcon name="i-lucide-package-x" class="size-6 text-gray-300 mx-auto" />
                  <p class="text-sm font-semibold text-gray-500">No batches ready</p>
                  <p class="text-xs text-gray-400">Generate a new batch before allocating.</p>
                  <UButton size="xs" variant="outline" color="neutral" icon="i-lucide-plus" to="/vouchers/generate" class="mt-1">Generate Batch</UButton>
                </div>
                <USelect v-else v-model="form.voucherBatchId" :items="batchOptions" class="w-full" />
                <p v-if="selectedBatch" class="mt-1.5 text-xs flex items-center gap-1.5">
                  <UBadge :color="selectedBatch.status === 'Generated' ? 'neutral' : selectedBatch.status === 'Received' ? 'info' : 'warning'" variant="subtle" size="xs">{{ selectedBatch.status }}</UBadge>
                  <span :class="remaining > 0 ? 'text-akbpaGreen-600' : 'text-red-500'" class="font-semibold">{{ remaining.toLocaleString() }} remaining</span>
                  <span class="text-gray-400">of {{ selectedBatch.quantity.toLocaleString() }} total</span>
                </p>
              </UFormField>

              <UFormField label="Allocation Target" name="targetType">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="t in targetTypes" :key="t.value" type="button"
                    class="p-3 rounded-xl border text-sm font-medium text-center transition-colors"
                    :class="targetType === t.value
                      ? 'border-akbpaGreen-500 bg-akbpaGreen-50 dark:bg-akbpaGreen-950 text-akbpaGreen-700 dark:text-akbpaGreen-300'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-akbpaGreen-300'"
                    @click="targetType = t.value; resetTargets()"
                  >
                    <UIcon :name="t.icon" class="size-4 mx-auto mb-1" />
                    {{ t.label }}
                  </button>
                </div>
              </UFormField>

              <template v-if="targetType === 'LGA'">
                <UFormField label="LGA" name="lgaId">
                  <USelect v-model="lgaOnlyId" :items="lgaOptions" class="w-full" />
                </UFormField>
                <div v-if="lgaOnlyId && lgaAllocated[lgaOnlyId]" class="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/40 p-3 text-sm flex gap-2">
                  <UIcon name="i-lucide-info" class="size-4 text-yellow-600 shrink-0 mt-0.5" />
                  <span class="text-yellow-700 dark:text-yellow-300"><strong>{{ lgaStore.lgaName(lgaOnlyId) }}</strong> already received <strong>{{ lgaAllocated[lgaOnlyId]!.toLocaleString() }}</strong> from this batch.</span>
                </div>
                <UFormField label="Quantity" name="quantity">
                  <UInput v-model.number="singleQuantity" type="number" min="1" :max="remaining" class="w-full" />
                  <p class="mt-1 text-xs text-gray-400">Max: {{ remaining.toLocaleString() }} remaining</p>
                </UFormField>
              </template>

              <template v-if="targetType === 'OFFICER'">
                <UFormField label="Officer" name="officerId">
                  <USelect v-model="officerId" :items="officerOptions" class="w-full" />
                </UFormField>
                <UFormField label="Quantity" name="quantity">
                  <UInput v-model.number="singleQuantity" type="number" min="1" :max="remaining" class="w-full" />
                  <p class="mt-1 text-xs text-gray-400">Max: {{ remaining.toLocaleString() }} remaining</p>
                </UFormField>
              </template>

              <template v-if="targetType === 'WARD' || targetType === 'WARDS'">
                <UFormField label="LGA" name="lgaId">
                  <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" @change="resetTargets" />
                </UFormField>
                <div v-for="(target, i) in targets" :key="i" class="space-y-1">
                  <div class="flex items-end gap-3">
                    <UFormField label="Ward" class="flex-1">
                      <USelect v-model="target.wardId" :items="wardOptions" :disabled="!form.lgaId" class="w-full" />
                    </UFormField>
                    <UFormField label="Quantity" class="w-36">
                      <UInput v-model.number="target.quantity" type="number" min="1" :max="remaining" class="w-full" />
                    </UFormField>
                    <UButton v-if="targetType === 'WARDS' && targets.length > 1" icon="i-lucide-trash-2" color="error" variant="ghost" class="mb-0.5" @click="targets.splice(i, 1)" />
                  </div>
                  <div v-if="target.wardId && wardAllocated[target.wardId]" class="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/40 p-2.5 text-xs flex gap-2">
                    <UIcon name="i-lucide-triangle-alert" class="size-3.5 text-yellow-600 shrink-0 mt-0.5" />
                    <span class="text-yellow-700 dark:text-yellow-300">This ward already received <strong>{{ wardAllocated[target.wardId]!.toLocaleString() }}</strong> from this batch. You can still add more.</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <UButton v-if="targetType === 'WARDS'" size="xs" variant="outline" color="neutral" icon="i-lucide-plus" @click="targets.push({ wardId: '', quantity: 100 })">Add ward</UButton>
                  <p v-if="targetType === 'WARDS'" class="text-xs text-gray-500 ml-auto">
                    Allocating: <span class="font-semibold text-gray-900 dark:text-white">{{ targetsTotal.toLocaleString() }}</span>
                    · Remaining after: <span :class="remaining - targetsTotal < 0 ? 'text-red-500 font-bold' : 'text-akbpaGreen-600 font-semibold'">{{ (remaining - targetsTotal).toLocaleString() }}</span>
                  </p>
                </div>
                <UAlert v-if="targetsTotal > remaining" color="error" variant="subtle" icon="i-lucide-circle-x" :title="`Over-allocation: trying to allocate ${targetsTotal.toLocaleString()} but only ${remaining.toLocaleString()} remain.`" />
              </template>

              <UFormField label="Notes" name="notes">
                <UTextarea v-model="form.notes" :rows="2" class="w-full" placeholder="Optional notes…" />
              </UFormField>

              <UAlert v-if="submitError" color="error" variant="subtle" :title="submitError" />
              <UAlert v-if="advancedSubmitted" color="success" variant="subtle" icon="i-lucide-check-circle" title="Vouchers allocated successfully." />

              <UButton size="lg" icon="i-lucide-send" :loading="loading" :disabled="!canSubmitAdvanced" @click="onSubmit">
                Allocate Vouchers
              </UButton>
            </UForm>
          </UCard>
        </div>

        <!-- Right: Live Batch Ledger -->
        <div class="lg:col-span-2 space-y-4">
          <UCard v-if="selectedBatch">
            <template #header>
              <p class="font-semibold text-sm text-gray-900 dark:text-white">Batch Ledger</p>
              <p class="text-xs text-gray-500 font-mono mt-0.5">{{ selectedBatch.batchCode }}</p>
            </template>
            <div class="space-y-3">
              <div class="flex justify-between text-sm"><span class="text-gray-500">Total vouchers</span><span class="font-semibold text-gray-900 dark:text-white">{{ selectedBatch.quantity.toLocaleString() }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-500">Already allocated</span><span class="font-semibold text-orange-600">{{ totalAllocated.toLocaleString() }}</span></div>
              <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  :class="allocatedPct >= 100 ? 'bg-red-500' : allocatedPct > 80 ? 'bg-orange-400' : 'bg-akbpaGreen-500'"
                  :style="`width: ${Math.min(allocatedPct, 100)}%`" />
              </div>
              <div class="flex justify-between text-sm border-t border-gray-100 dark:border-gray-800 pt-3">
                <span class="font-medium text-gray-700 dark:text-gray-300">Remaining</span>
                <span class="font-bold" :class="remaining > 0 ? 'text-akbpaGreen-600' : 'text-red-500'">{{ remaining.toLocaleString() }}</span>
              </div>
            </div>
          </UCard>

          <UCard v-if="selectedBatch && lgaStore.lgas.length">
            <template #header>
              <p class="font-semibold text-sm text-gray-900 dark:text-white">LGA Breakdown</p>
              <p class="text-xs text-gray-400">From this batch only</p>
            </template>
            <div class="space-y-3">
              <div v-for="lga in lgaStore.lgas" :key="lga.id">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-700 dark:text-gray-300 font-medium truncate">{{ lga.name }}</span>
                  <span class="text-xs shrink-0 ml-2" :class="lgaAllocated[lga.id] ? 'text-orange-600 font-semibold' : 'text-gray-400'">{{ (lgaAllocated[lga.id] ?? 0).toLocaleString() }}</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-akbpaGreen-400 rounded-full transition-all duration-500"
                    :style="`width: ${selectedBatch.quantity > 0 ? Math.min(((lgaAllocated[lga.id] ?? 0) / selectedBatch.quantity) * 100, 100) : 0}%`" />
                </div>
              </div>
            </div>
          </UCard>

          <UCard v-if="selectedBatch && activeLgaId && lgaStore.wardsForLga(activeLgaId).length">
            <template #header>
              <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ lgaStore.lgaName(activeLgaId) }} — Wards</p>
              <p class="text-xs text-gray-400">Allocated from this batch</p>
            </template>
            <div class="space-y-3">
              <div v-for="ward in lgaStore.wardsForLga(activeLgaId)" :key="ward.id">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-gray-700 dark:text-gray-300 truncate">{{ ward.name }}</span>
                  <span class="text-xs shrink-0 ml-2" :class="wardAllocated[ward.id] ? 'text-orange-600 font-semibold' : 'text-gray-400'">{{ (wardAllocated[ward.id] ?? 0).toLocaleString() }}</span>
                </div>
                <div class="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-akbpaGreen-400 rounded-full transition-all duration-500"
                    :style="`width: ${lgaAllocated[activeLgaId] ? Math.min(((wardAllocated[ward.id] ?? 0) / lgaAllocated[activeLgaId]!) * 100, 100) : 0}%`" />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- History table -->
      <UCard v-if="allocationsStore.allocations.length">
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">Allocation History</p>
            <UBadge color="neutral" variant="subtle">{{ allocationsStore.allocations.length }}</UBadge>
          </div>
        </template>
        <UTable :data="allocationsStore.allocations" :columns="historyColumns">
          <template #target-cell="{ row }">
            <div>
              <UBadge :color="targetColor(row.original.targetType)" variant="subtle" size="xs">{{ row.original.targetType }}</UBadge>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{{ row.original.wardName ?? row.original.lgaName ?? row.original.officerName ?? '—' }}</p>
            </div>
          </template>
          <template #quantity-cell="{ row }">
            <span class="font-semibold text-gray-900 dark:text-white">{{ (row.original.quantity ?? 0).toLocaleString() }}</span>
          </template>
        </UTable>
      </UCard>
    </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'LGA Voucher Officer'] })

import type { AllocationTargetType } from '~/types'

const batchesStore = useVoucherBatchesStore()
const allocationsStore = useVoucherAllocationsStore()
const lgaStore = useLgaStore()
const usersStore = useUsersStore()

const pageLoading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([batchesStore.fetchBatches(), lgaStore.ensureLoaded(), allocationsStore.fetchAllocations(), usersStore.fetchUsers()])
  } finally {
    pageLoading.value = false
  }
})

// ── View mode ──────────────────────────────────────────────────
const viewMode = ref<'wizard' | 'advanced'>('wizard')

// ── Wizard steps ───────────────────────────────────────────────
const step = ref(1)
const steps = [{ label: 'Batch' }, { label: 'Recipient' }, { label: 'Quantity' }, { label: 'Confirm' }]

// ── Shared options ─────────────────────────────────────────────
const READY_STATUSES = new Set(['Generated', 'Received', 'PartlyAllocated', 'ReconciliationRequired'])
const readyBatches = computed(() =>
  batchesStore.batches.filter(b => READY_STATUSES.has(b.status) && batchRemaining(b.id) > 0),
)
const batchOptions = computed(() => readyBatches.value.map(b => ({ label: b.batchCode, value: b.id })))
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const officerOptions = computed(() =>
  usersStore.users
    .filter(u => ['Ward PA / Issuing Officer', 'Redemption Officer', 'LGA Voucher Officer'].includes(u.role))
    .map(u => ({ label: `${u.fullName} (${u.role})`, value: u.id })),
)

const targetTypes: { value: AllocationTargetType; label: string; icon: string; desc: string }[] = [
  { value: 'WARD', label: 'One Ward', icon: 'i-lucide-map-pin', desc: 'Give all vouchers to a single ward' },
  { value: 'WARDS', label: 'Multi-Ward', icon: 'i-lucide-map', desc: 'Split across several wards' },
  { value: 'LGA', label: 'Whole LGA', icon: 'i-lucide-landmark', desc: 'Give to an entire Local Government Area' },
  { value: 'OFFICER', label: 'Officer', icon: 'i-lucide-user', desc: 'Assign directly to a specific officer' },
]
const targetType = ref<AllocationTargetType>('WARD')

// ── Shared form state ──────────────────────────────────────────
const form = reactive({ voucherBatchId: '', lgaId: '', notes: '' })
watch(readyBatches, (list) => { if (!form.voucherBatchId && list[0]) form.voucherBatchId = list[0].id }, { immediate: true })

const wardOptions = computed(() => lgaStore.wardsForLga(form.lgaId).map(w => ({ label: w.name, value: w.id })))
const targets = ref([{ wardId: '', quantity: 100 }])
const lgaOnlyId = ref('')
const officerId = ref('')
const singleQuantity = ref(500)
const quickQty = [100, 250, 500, 1000, 2000]
const activeLgaId = computed(() => form.lgaId || lgaOnlyId.value)

function resetTargets() { targets.value = [{ wardId: '', quantity: 100 }] }

function toggleWard(wardId: string) {
  const idx = targets.value.findIndex(t => t.wardId === wardId)
  if (idx !== -1) {
    if (targetType.value === 'WARD') return
    targets.value.splice(idx, 1)
    if (targets.value.length === 0) targets.value.push({ wardId: '', quantity: 100 })
  } else {
    if (targetType.value === 'WARD') {
      targets.value = [{ wardId, quantity: 100 }]
    } else {
      if (targets.value.length === 1 && !targets.value[0]!.wardId) {
        targets.value = [{ wardId, quantity: 100 }]
      } else {
        targets.value.push({ wardId, quantity: 100 })
      }
    }
  }
}

// ── Batch ledger ───────────────────────────────────────────────
const selectedBatch = computed(() => batchesStore.batches.find(b => b.id === form.voucherBatchId))

function allocationsForBatch(batchId: string) {
  return allocationsStore.allocations.filter(a => a.voucherBatchId === batchId)
}
function batchRemaining(batchId: string) {
  const b = batchesStore.batches.find(x => x.id === batchId)
  if (!b) return 0
  return b.quantity - allocationsForBatch(batchId).reduce((s, a) => s + (a.quantity ?? 0), 0)
}
function batchAllocatedPct(batchId: string) {
  const b = batchesStore.batches.find(x => x.id === batchId)
  if (!b || b.quantity === 0) return 0
  return (allocationsForBatch(batchId).reduce((s, a) => s + (a.quantity ?? 0), 0) / b.quantity) * 100
}

const batchAllocations = computed(() => allocationsForBatch(form.voucherBatchId))
const totalAllocated = computed(() => batchAllocations.value.reduce((s, a) => s + (a.quantity ?? 0), 0))
const remaining = computed(() => (selectedBatch.value?.quantity ?? 0) - totalAllocated.value)
const allocatedPct = computed(() => selectedBatch.value?.quantity ? (totalAllocated.value / selectedBatch.value.quantity) * 100 : 0)

const lgaAllocated = computed(() => {
  const map: Record<string, number> = {}
  for (const a of batchAllocations.value) {
    if (a.lgaId) map[a.lgaId] = (map[a.lgaId] ?? 0) + (a.quantity ?? 0)
  }
  return map
})
const wardAllocated = computed(() => {
  const map: Record<string, number> = {}
  for (const a of batchAllocations.value) {
    if (a.wardId) map[a.wardId] = (map[a.wardId] ?? 0) + (a.quantity ?? 0)
  }
  return map
})
const targetsTotal = computed(() => targets.value.reduce((s, t) => s + (t.quantity || 0), 0))

// ── Labels & validation ────────────────────────────────────────
const recipientLabel = computed(() => {
  if (targetType.value === 'LGA') return lgaStore.lgaName(lgaOnlyId.value) || '—'
  if (targetType.value === 'OFFICER') return usersStore.users.find(u => u.id === officerId.value)?.fullName ?? '—'
  if (targetType.value === 'WARD') return lgaStore.wardsForLga(form.lgaId).find(w => w.id === targets.value[0]?.wardId)?.name ?? '—'
  return targets.value.filter(t => t.wardId).map(t => lgaStore.wardsForLga(form.lgaId).find(w => w.id === t.wardId)?.name ?? t.wardId).join(', ')
})
const recipientSelected = computed(() => {
  if (targetType.value === 'LGA') return !!lgaOnlyId.value
  if (targetType.value === 'OFFICER') return !!officerId.value
  return targets.value.some(t => t.wardId)
})
const confirmQty = computed(() => (targetType.value === 'WARD' || targetType.value === 'WARDS') ? targetsTotal.value : singleQuantity.value)
const canProceedToConfirm = computed(() => recipientSelected.value && confirmQty.value > 0 && confirmQty.value <= remaining.value)
const canSubmitAdvanced = computed(() => {
  if (!form.voucherBatchId || remaining.value <= 0) return false
  if (targetType.value === 'LGA') return !!lgaOnlyId.value && singleQuantity.value > 0 && singleQuantity.value <= remaining.value
  if (targetType.value === 'OFFICER') return !!officerId.value && singleQuantity.value > 0 && singleQuantity.value <= remaining.value
  if (targetsTotal.value > remaining.value) return false
  return targets.value.every(t => t.wardId && t.quantity > 0)
})

// ── Inline helper component ────────────────────────────────────
const QuantitySummary = defineComponent({
  props: { giving: Number, remaining: Number },
  setup(props) {
    return () => h('div', { class: 'rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 space-y-2' }, [
      h('div', { class: 'flex justify-between text-sm' }, [h('span', { class: 'text-gray-500' }, 'Total being allocated'), h('span', { class: 'font-bold text-gray-900 dark:text-white' }, props.giving!.toLocaleString())]),
      h('div', { class: 'flex justify-between text-sm' }, [h('span', { class: 'text-gray-500' }, 'Available in batch'), h('span', { class: 'font-semibold text-akbpaGreen-600' }, props.remaining!.toLocaleString())]),
      h('div', { class: 'h-px bg-gray-200 dark:bg-gray-700' }),
      h('div', { class: 'flex justify-between' }, [
        h('span', { class: 'font-semibold text-gray-700 dark:text-gray-300' }, 'Will remain after'),
        h('span', { class: `font-bold text-lg ${(props.remaining! - props.giving!) < 0 ? 'text-red-500' : 'text-akbpaGreen-600'}` }, (props.remaining! - props.giving!).toLocaleString()),
      ]),
    ])
  },
})

// ── Success state ──────────────────────────────────────────────
const lastConfirmQty = ref(0)
const lastRecipientLabel = ref('')

const refreshing = ref(false)

async function startFresh() {
  refreshing.value = true
  try {
    await Promise.all([allocationsStore.fetchAllocations(), batchesStore.fetchBatches()])
  } finally {
    refreshing.value = false
  }
  form.voucherBatchId = ''
  form.lgaId = ''
  form.notes = ''
  targets.value = [{ wardId: '', quantity: 100 }]
  lgaOnlyId.value = ''
  officerId.value = ''
  singleQuantity.value = 500
  step.value = 1
}

// ── Submit (shared) ────────────────────────────────────────────
const loading = ref(false)
const submitError = ref('')
const advancedSubmitted = ref(false)

async function onSubmit() {
  submitError.value = ''
  advancedSubmitted.value = false
  loading.value = true
  try {
    if (targetType.value === 'LGA') {
      await allocationsStore.allocateToLga({ voucherBatchId: form.voucherBatchId, lgaId: lgaOnlyId.value, quantity: singleQuantity.value, notes: form.notes || undefined })
    } else if (targetType.value === 'OFFICER') {
      await allocationsStore.allocateToOfficer({ voucherBatchId: form.voucherBatchId, officerId: officerId.value, quantity: singleQuantity.value, notes: form.notes || undefined })
    } else if (targetType.value === 'WARD') {
      await allocationsStore.allocateToWard({ voucherBatchId: form.voucherBatchId, wardId: targets.value[0]!.wardId, quantity: targets.value[0]!.quantity, notes: form.notes || undefined })
    } else {
      await allocationsStore.allocateToWards({ voucherBatchId: form.voucherBatchId, targets: targets.value.filter(t => t.wardId).map(t => ({ wardId: t.wardId, quantity: t.quantity })), notes: form.notes || undefined })
    }
    if (viewMode.value === 'wizard') {
      lastConfirmQty.value = confirmQty.value
      lastRecipientLabel.value = recipientLabel.value
      step.value = 5
    } else {
      // Re-fetch so the right-panel ledger, LGA breakdown, and batch status update immediately
      await Promise.all([allocationsStore.fetchAllocations(), batchesStore.fetchBatches()])
      advancedSubmitted.value = true
      targets.value = [{ wardId: '', quantity: 100 }]
      singleQuantity.value = 500
    }
  } catch (e: any) {
    submitError.value = e.response?.data?.message ?? e.message
  } finally {
    loading.value = false
  }
}

// ── History table ──────────────────────────────────────────────
const historyColumns = [
  { accessorKey: 'batchCode', header: 'Batch' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'quantity', header: 'Qty' },
  { accessorKey: 'allocatedAt', header: 'When', cell: ({ row }: any) => row.original.allocatedAt ? new Date(row.original.allocatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
  { accessorKey: 'allocatedByName', header: 'By', cell: ({ row }: any) => row.original.allocatedByName ?? '—' },
  { accessorKey: 'notes', header: 'Notes', cell: ({ row }: any) => row.original.notes ?? '—' },
]
function targetColor(type: string) {
  if (type === 'WARD' || type === 'WARDS') return 'info'
  if (type === 'LGA') return 'success'
  if (type === 'OFFICER') return 'warning'
  return 'neutral'
}
</script>
