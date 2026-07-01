<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Social Register</h1>
        <p class="text-sm text-gray-500">{{ store.pagination.total.toLocaleString() }} beneficiaries matching current filters</p>
      </div>
      <div class="flex gap-2">
        <UButton to="/beneficiaries/upload" icon="i-lucide-upload" color="neutral" variant="outline">Upload CSV</UButton>
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

      <UAlert v-if="store.error" color="error" variant="subtle" :title="store.error" class="mb-4" />

      <UTable :data="store.beneficiaries" :columns="columns" :loading="store.loading">
        <template #beneficiary-cell="{ row }">
          <NuxtLink :to="`/beneficiaries/${row.original.id}`" class="font-medium text-akbpaGreen-700 hover:underline">
            {{ row.original.fullName }}
          </NuxtLink>
          <p class="text-xs text-gray-500">{{ row.original.beneficiaryCode }}</p>
        </template>
        <template #lgaWard-cell="{ row }">
          <p class="text-sm">{{ row.original.lgaName ?? lgaStore.lgaName(row.original.lgaId) }}</p>
          <p class="text-xs text-gray-500">{{ row.original.wardName ?? lgaStore.wardName(row.original.wardId) }}</p>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="row.original.status === 'Active' ? 'success' : 'neutral'" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
      <div v-if="store.pagination.pages > 1" class="flex justify-end mt-4">
        <UPagination
          :page="store.page" :total="store.pagination.total" :items-per-page="store.pageSize"
          @update:page="onPageChange"
        />
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
  await store.fetchBeneficiaries({ page: 1 })
})

function onSearch() {
  const lga = lgaStore.lgas.find(l => l.name === lgaFilterName.value)
  store.lgaFilter = lga?.id ?? ''
  store.fetchBeneficiaries({ page: 1 })
}

function onPageChange(page: number) {
  store.fetchBeneficiaries({ page })
}

function resetFilters() {
  store.search = ''
  store.genderFilter = 'All'
  // Ward PA stays hard-scoped to their own ward — only the LGA picker resets for them.
  lgaFilterName.value = 'All LGAs'
  store.lgaFilter = ''
  store.fetchBeneficiaries({ page: 1 })
}

const columns = [
  { accessorKey: 'beneficiary', header: 'Beneficiary' },
  { accessorKey: 'gender', header: 'Gender' },
  { accessorKey: 'lgaWard', header: 'LGA / Ward' },
  { accessorKey: 'address', header: 'Address', cell: ({ row }: any) => row.original.address || '—' },
  { accessorKey: 'status', header: 'Status' },
]
</script>
