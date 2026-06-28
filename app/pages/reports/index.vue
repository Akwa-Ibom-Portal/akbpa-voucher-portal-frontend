<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="text-sm text-gray-500">Filter by LGA, ward, gender, item, status and date range.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" icon="i-lucide-file-spreadsheet">Export Excel</UButton>
        <UButton color="neutral" variant="outline" icon="i-lucide-file-text">Export PDF (password-protected)</UButton>
      </div>
    </div>

    <UCard>
      <div class="grid sm:grid-cols-4 gap-3">
        <USelect v-model="lgaFilterName" :items="['All LGAs', ...lgaStore.lgas.map(l => l.name)]" @change="onFilterChange" />
        <USelect v-model="itemFilter" :items="['All Items', 'Rice', 'Beans', 'Garri']" @change="onFilterChange" />
        <USelect v-model="statusFilter" :items="['All Status', 'Generated', 'Allocated', 'Issued', 'Redeemed', 'Expired']" />
        <USelect v-model="genderFilter" :items="['All Genders', 'Male', 'Female']" />
      </div>
    </UCard>

    <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <UCard v-for="s in statCards" :key="s.label">
        <p class="text-xs text-gray-500 uppercase">{{ s.label }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ s.value.toLocaleString() }}</p>
      </UCard>
    </div>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Local Government Area</p></template>
      <UTable :data="reportsStore.byLga" :columns="lgaColumns" :loading="reportsStore.loading" />
    </UCard>

    <UCard>
      <template #header><p class="font-semibold text-gray-900 dark:text-white">By Food Item</p></template>
      <UTable :data="reportsStore.byItem" :columns="itemColumns" :loading="reportsStore.loading" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer', 'Viewer / Auditor'] })

const reportsStore = useReportsStore()
const lgaStore = useLgaStore()

onMounted(async () => {
  await lgaStore.ensureLoaded()
  await reportsStore.fetchAll()
})

const lgaFilterName = ref('All LGAs')
const itemFilter = ref('All Items')
const statusFilter = ref('All Status')
const genderFilter = ref('All Genders')

function onFilterChange() {
  const lga = lgaStore.lgas.find(l => l.name === lgaFilterName.value)
  reportsStore.lgaFilter = lga?.id ?? ''
  reportsStore.itemFilter = (itemFilter.value === 'All Items' ? '' : itemFilter.value) as any
  reportsStore.fetchAll()
}

const statCards = computed(() => [
  { label: 'Generated', value: reportsStore.summary.generated },
  { label: 'Allocated', value: reportsStore.summary.allocated },
  { label: 'Issued', value: reportsStore.summary.issued },
  { label: 'Redeemed', value: reportsStore.summary.redeemed },
  { label: 'Pending', value: reportsStore.summary.pendingRedemption },
])

const lgaColumns = [
  { accessorKey: 'lga', header: 'LGA' },
  { accessorKey: 'onRegister', header: 'On Register' },
  { accessorKey: 'issued', header: 'Issued' },
  { accessorKey: 'redeemed', header: 'Redeemed' },
  { accessorKey: 'rate', header: 'Rate', cell: ({ row }: any) => `${row.getValue('rate')}%` },
]
const itemColumns = [
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'generated', header: 'Generated' },
  { accessorKey: 'issued', header: 'Issued' },
  { accessorKey: 'redeemed', header: 'Redeemed' },
]
</script>
