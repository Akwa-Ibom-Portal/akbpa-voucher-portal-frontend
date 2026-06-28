<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Social Register</h1>
        <p class="text-sm text-gray-500">{{ store.beneficiaries.length.toLocaleString() }} beneficiaries matching current filters</p>
      </div>
      <div class="flex gap-2">
        <UButton to="/beneficiaries/upload" icon="i-lucide-upload" color="neutral" variant="outline">Upload Excel</UButton>
        <UButton to="/beneficiaries/add" icon="i-lucide-plus">Add Beneficiary</UButton>
      </div>
    </div>

    <UCard>
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search name, ID, phone..." class="flex-1 min-w-48" @keyup.enter="onSearch" />
        <USelect v-model="lgaFilterName" :items="lgaOptionNames" placeholder="All LGAs" class="min-w-40" :disabled="auth.role === 'Ward PA / Issuing Officer'" @change="onSearch" />
        <USelect v-model="store.genderFilter" :items="['All', 'Male', 'Female']" placeholder="All genders" class="min-w-36" @change="onSearch" />
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">Reset Filters</UButton>
      </div>

      <UTable :data="paginated" :columns="columns" :loading="store.loading">
        <template #beneficiary-cell="{ row }">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ row.original.firstName }} {{ row.original.surname }}</p>
            <p class="text-xs text-gray-500">{{ row.original.beneficiaryCode }} · NIN {{ row.original.nin }}</p>
          </div>
        </template>
        <template #lgaWard-cell="{ row }">
          <p class="text-sm">{{ lgaStore.lgaName(row.original.lgaId) }}</p>
          <p class="text-xs text-gray-500">{{ lgaStore.wardName(row.original.wardId) }}</p>
        </template>
        <template v-for="item in ['Rice', 'Beans', 'Garri']" :key="item" #[`${item}-cell`]="{ row }">
          <UBadge :color="statusColor(row.original.voucherStatus[item])" variant="subtle">
            {{ row.original.voucherStatus[item] }}
          </UBadge>
        </template>
      </UTable>
      <div v-if="total > pageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer'] })

const auth = useAuthStore()
const store = useBeneficiariesStore()
const lgaStore = useLgaStore()

const lgaFilterName = ref('All LGAs')
const lgaOptionNames = computed(() => ['All LGAs', ...lgaStore.lgas.map(l => l.name)])

onMounted(async () => {
  await lgaStore.ensureLoaded()

  // Ward PA is hard-scoped to their own ward — enforced here client-side and must
  // also be enforced server-side from the JWT claim, never trusted from the request alone.
  if (auth.role === 'Ward PA / Issuing Officer' && auth.user?.wardIds?.[0]) {
    store.wardFilter = auth.user.wardIds[0]
  }
  await store.fetchBeneficiaries()
})

function onSearch() {
  const lga = lgaStore.lgas.find(l => l.name === lgaFilterName.value)
  store.lgaFilter = lga?.id ?? ''
  store.fetchBeneficiaries()
}

const { page, total, pageSize, paginated } = usePagination(() => store.beneficiaries, 10)

function resetFilters() {
  store.search = ''
  store.genderFilter = 'All'
  // Ward PA stays hard-scoped to their own ward — only the LGA picker resets for them.
  lgaFilterName.value = 'All LGAs'
  store.lgaFilter = ''
  store.fetchBeneficiaries()
}

const columns = [
  { accessorKey: 'beneficiary', header: 'Beneficiary' },
  { accessorKey: 'gender', header: 'Gender' },
  { accessorKey: 'lgaWard', header: 'LGA / Ward' },
  { accessorKey: 'Rice', header: 'Rice' },
  { accessorKey: 'Beans', header: 'Beans' },
  { accessorKey: 'Garri', header: 'Garri' },
]

function statusColor(status: string) {
  return status === 'Redeemed' ? 'success' : status === 'Issued' ? 'info' : 'neutral'
}
</script>
