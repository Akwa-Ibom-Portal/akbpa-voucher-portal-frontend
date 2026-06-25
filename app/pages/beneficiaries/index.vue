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
      <div class="grid sm:grid-cols-4 gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search name, ID, phone..." class="sm:col-span-2" @keyup.enter="onSearch" />
        <USelect v-model="lgaFilterName" :items="lgaOptionNames" placeholder="All LGAs" @change="onSearch" />
        <USelect v-model="store.genderFilter" :items="['All', 'Male', 'Female']" placeholder="All genders" @change="onSearch" />
      </div>

      <div v-if="store.loading" class="py-10 text-center text-sm text-gray-400">
        <UIcon name="i-lucide-loader-2" class="size-5 animate-spin mx-auto mb-2" />
        Loading beneficiaries…
      </div>

      <UTable v-else :data="store.beneficiaries" :columns="columns">
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
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['SuperAdmin', 'AKBPAAdmin', 'SocialRegisterOfficer', 'WardPA'] })

const auth = useAuthStore()
const store = useBeneficiariesStore()
const lgaStore = useLgaStore()

const lgaFilterName = ref('All LGAs')
const lgaOptionNames = computed(() => ['All LGAs', ...lgaStore.lgas.map(l => l.name)])

onMounted(async () => {
  await lgaStore.ensureLoaded()

  // Ward PA is hard-scoped to their own ward — enforced here client-side and must
  // also be enforced server-side from the JWT claim, never trusted from the request alone.
  if (auth.role === 'WardPA' && auth.user?.wardId) {
    store.wardFilter = auth.user.wardId
  }
  await store.fetchBeneficiaries()
})

function onSearch() {
  const lga = lgaStore.lgas.find(l => l.name === lgaFilterName.value)
  store.lgaFilter = lga?.id ?? ''
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
