<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="text-sm text-gray-500">Filtered by programme cycle — the only filter the reporting API supports server-side.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" icon="i-lucide-file-spreadsheet" :loading="exporting === 'csv'" @click="onExport('csv')">Export CSV</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide-file-text" :loading="exporting === 'pdf'" @click="onExport('pdf')">Export PDF</UButton>
      </div>
    </div>

    <UCard>
      <div class="grid sm:grid-cols-3 gap-3">
        <USelect :model-value="reportsStore.programmeCycleId || '__all__'" :items="cycleOptions" @update:model-value="(v: string) => { reportsStore.programmeCycleId = v === '__all__' ? '' : v; reportsStore.fetchAll() }">
          <template #trailing>
            <UBadge v-if="selectedReportCycle" :color="selectedReportCycle.isActive ? 'success' : 'neutral'" variant="subtle" size="sm">
              {{ selectedReportCycle.isActive ? 'Active' : 'Inactive' }}
            </UBadge>
            <UIcon name="i-lucide-chevrons-up-down" class="size-4 shrink-0 text-dimmed" />
          </template>
          <template #item-trailing="{ item }">
            <UBadge v-if="(item as any).isActive !== undefined" :color="(item as any).isActive ? 'success' : 'neutral'" variant="subtle" size="sm">
              {{ (item as any).isActive ? 'Active' : 'Inactive' }}
            </UBadge>
          </template>
        </USelect>
      </div>
      <div class="flex justify-end mt-3">
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">Reset Filters</UButton>
      </div>
    </UCard>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="s in statCards" :key="s.label">
        <p class="text-xs text-gray-500 uppercase">{{ s.label }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">Status Breakdown</p></template>
      <div class="flex flex-wrap gap-3">
        <UBadge v-for="(count, status) in reportsStore.summary.statusCounts" :key="status" variant="subtle" size="lg">
          {{ status }}: {{ count }}
        </UBadge>
      </div>
    </UCard>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Local Government Area</p></template>
      <UTable :data="lgaPaginated" :columns="groupColumns" :loading="reportsStore.loading" />
      <div v-if="lgaTotal > lgaPageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="lgaPage" :total="lgaTotal" :items-per-page="lgaPageSize" />
      </div>
    </UCard>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Ward</p></template>
      <UTable :data="wardPaginated" :columns="groupColumns" :loading="reportsStore.loading" />
      <div v-if="wardTotal > wardPageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="wardPage" :total="wardTotal" :items-per-page="wardPageSize" />
      </div>
    </UCard>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Food Item</p></template>
      <UTable :data="reportsStore.byItem" :columns="groupColumns" :loading="reportsStore.loading" />
    </UCard>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Gender</p></template>
      <UTable :data="reportsStore.byGender" :columns="groupColumns" :loading="reportsStore.loading" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer', 'Viewer / Auditor'] })

const reportsStore = useReportsStore()
const cyclesStore = useProgrammeCyclesStore()

onMounted(async () => {
  await cyclesStore.fetchCycles()
  await reportsStore.fetchAll()
})

const cycleOptions = computed(() => [
  { label: 'All Programme Cycles', value: '__all__' },
  ...([...cyclesStore.cycles].sort((a, b) => Number(b.isActive) - Number(a.isActive)).map(c => ({ label: c.name, value: c.id, isActive: c.isActive }))),
])

const selectedReportCycle = computed(() => cyclesStore.cycles.find(c => c.id === reportsStore.programmeCycleId))

function resetFilters() {
  reportsStore.programmeCycleId = ''
  reportsStore.fetchAll()
}
// store keeps '' for "no filter"; select maps '' <-> '__all__' since USelect forbids empty-string values

const { page: lgaPage, total: lgaTotal, pageSize: lgaPageSize, paginated: lgaPaginated } = usePagination(() => reportsStore.byLga, 10)
const { page: wardPage, total: wardTotal, pageSize: wardPageSize, paginated: wardPaginated } = usePagination(() => reportsStore.byWard, 10)

const statCards = computed(() => [
  { label: 'Total Batches', value: reportsStore.summary.totalBatches },
  { label: 'Total Beneficiaries', value: reportsStore.summary.totalBeneficiaries },
  { label: 'Issued, Not Redeemed', value: reportsStore.summary.issuedButUnredeemed },
  { label: 'Expired', value: reportsStore.summary.expired },
  { label: 'Duplicate Scan Attempts', value: reportsStore.summary.duplicateScanAttempts },
])

const groupColumns = [
  { accessorKey: 'label', header: 'Name' },
  { accessorKey: 'total', header: 'Total' },
  { id: 'redeemed', header: 'Redeemed', cell: ({ row }: any) => row.original.statusCounts.Redeemed ?? 0 },
  { id: 'issued', header: 'Issued', cell: ({ row }: any) => row.original.statusCounts.Issued ?? 0 },
]

const exporting = ref<'csv' | 'pdf' | ''>('')
async function onExport(format: 'csv' | 'pdf') {
  exporting.value = format
  try {
    const blob = await reportsStore.exportReport('summary', format)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-summary.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = ''
  }
}
</script>
