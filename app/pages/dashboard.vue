<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Voucher Distribution Dashboard</h1>
      <p class="text-sm text-gray-500">2026 Stable Food Relief Cycle · 31 LGAs · 329 wards · {{ totalOnRegister.toLocaleString() }} on register</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard v-for="s in statCards" :key="s.label">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ s.label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ s.value.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ s.hint }}</p>
      </UCard>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">QR Vouchers by Item</p>
          <p class="text-xs text-gray-500">Generated · Issued · Redeemed</p>
        </template>
        <div class="space-y-5">
          <div v-for="row in byItem" :key="row.item">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-200">{{ itemEmoji(row.item) }} {{ row.item }} · 5kg</span>
              <span class="text-gray-500">{{ row.redeemed.toLocaleString() }} / {{ row.generated.toLocaleString() }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex">
              <div class="bg-akbpaGreen-500" :style="{ width: pct(row.redeemed, row.generated) + '%' }" />
              <div class="bg-akbpaGreen-200" :style="{ width: pct(row.issued - row.redeemed, row.generated) + '%' }" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">By Gender</p>
        </template>
        <div class="space-y-4">
          <div v-for="g in genderRows" :key="g.label">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700 dark:text-gray-200">{{ g.label }}</span>
              <span class="text-gray-500">{{ g.redeemed }} redeemed</span>
            </div>
            <UProgress :model-value="g.pct" />
          </div>
          <p class="text-xs text-gray-400 pt-2">
            Female-headed households are prioritised under the relief framework.
          </p>
        </div>
      </UCard>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white">Top LGAs by Redemption</p>
      </template>
      <UTable :data="byLga.slice(0, 8)" :columns="lgaColumns" :loading="reportsStore.loading" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

const reportsStore = useReportsStore()
onMounted(() => reportsStore.fetchAll())

const { summary, byItem, byLga, byGender } = toRefs(reportsStore)

const totalOnRegister = 25440 // stated register size from the developer guide; mock data samples a subset of it

const statCards = computed(() => [
  { label: 'QR Vouchers Generated', value: summary.value.generated, hint: 'across 3 items' },
  { label: 'Vouchers Issued', value: summary.value.issued, hint: `${pct(summary.value.issued, summary.value.generated)}% of generated` },
  { label: 'Vouchers Redeemed', value: summary.value.redeemed, hint: `${pct(summary.value.redeemed, summary.value.generated)}% redemption rate` },
  { label: 'Pending Redemption', value: summary.value.pendingRedemption, hint: 'awaiting collection' },
])

const genderRows = computed(() => [
  { label: 'Female', redeemed: byGender.value.female.redeemed, pct: pct(byGender.value.female.redeemed, byGender.value.female.count) },
  { label: 'Male', redeemed: byGender.value.male.redeemed, pct: pct(byGender.value.male.redeemed, byGender.value.male.count) },
])

const lgaColumns = [
  { accessorKey: 'lga', header: 'Local Govt Area' },
  { accessorKey: 'onRegister', header: 'On Register' },
  { accessorKey: 'issued', header: 'Issued' },
  { accessorKey: 'redeemed', header: 'Redeemed' },
  { accessorKey: 'rate', header: 'Redemption Rate', cell: ({ row }: any) => `${row.getValue('rate')}%` },
]

function pct(n: number, d: number) {
  if (!d) return 0
  return Math.round((n / d) * 100)
}

function itemEmoji(item: string) {
  return item === 'Rice' ? '🍚' : item === 'Beans' ? '🫘' : '🌾'
}
</script>
