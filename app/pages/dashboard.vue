<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Voucher Distribution Dashboard</h1>
      <p class="text-sm text-gray-500">{{ reportsStore.summary.totalBatches.toLocaleString() }} batches · {{ reportsStore.summary.totalBeneficiaries.toLocaleString() }} on register</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="s in statCards" :key="s.label">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ s.label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">QR Vouchers by Item</p>
          <p class="text-xs text-gray-500">Status breakdown per food item</p>
        </template>
        <div class="space-y-5">
          <div v-for="row in reportsStore.byItem" :key="row.key">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-200">{{ itemEmoji(row.label) }} {{ row.label }}</span>
              <span class="text-gray-500">{{ statusCount(row, 'Redeemed') }} / {{ row.total }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
              <div class="bg-akbpaGreen-500" :style="{ width: pct(statusCount(row, 'Redeemed'), row.total) + '%' }" />
              <div class="bg-akbpaGreen-200" :style="{ width: pct(statusCount(row, 'Issued'), row.total) + '%' }" />
            </div>
          </div>
          <p v-if="!reportsStore.byItem.length" class="text-sm text-gray-400">No voucher activity recorded yet.</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">By Gender</p>
        </template>
        <div class="space-y-4">
          <div v-for="g in reportsStore.byGender" :key="g.key">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-200">{{ g.label }}</span>
              <span class="text-gray-500">{{ statusCount(g, 'Redeemed') }} redeemed</span>
            </div>
            <UProgress :model-value="pct(statusCount(g, 'Redeemed'), g.total)" />
          </div>
          <p v-if="!reportsStore.byGender.length" class="text-sm text-gray-400">No data yet.</p>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Top LGAs by Activity</p>
      </template>
      <UTable :data="reportsStore.byLga.slice(0, 8)" :columns="lgaColumns" :loading="reportsStore.loading" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

import type { ReportGroupRow } from '~/types'

const reportsStore = useReportsStore()
onMounted(() => reportsStore.fetchAll())

function statusCount(row: ReportGroupRow, status: string) {
  return row.statusCounts[status] ?? 0
}

const statCards = computed(() => {
  const sc = reportsStore.summary.statusCounts
  return [
    { label: 'Generated', value: sc.Generated ?? 0 },
    { label: 'Allocated', value: sc.Allocated ?? 0 },
    { label: 'Issued', value: reportsStore.summary.issuedButUnredeemed },
    { label: 'Redeemed', value: sc.Redeemed ?? 0 },
  ]
})

const lgaColumns = [
  { accessorKey: 'label', header: 'Local Govt Area' },
  { accessorKey: 'total', header: 'Total Activity' },
  { id: 'redeemed', header: 'Redeemed', cell: ({ row }: any) => statusCount(row.original, 'Redeemed') },
]

function pct(n: number, d: number) {
  if (!d) return 0
  return Math.round((n / d) * 100)
}

function itemEmoji(item: string) {
  return item === 'Rice' ? '🍚' : item === 'Beans' ? '🫘' : item === 'Garri' ? '🌾' : '📦'
}
</script>
