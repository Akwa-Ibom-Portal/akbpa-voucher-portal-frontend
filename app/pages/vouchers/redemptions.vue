<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Voucher Redemptions</h1>
        <p class="text-sm text-gray-500">{{ store.redemptions.length.toLocaleString() }} total redemptions</p>
      </div>
    </div>

    <template v-if="pageLoading">
      <UCard>
        <div class="space-y-3 py-2">
          <div v-for="i in 5" :key="i" class="h-10 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </UCard>
    </template>

    <template v-else>
      <UAlert v-if="store.error" color="error" variant="subtle" :title="store.error" />

      <UCard v-if="!store.redemptions.length">
        <div class="text-center py-12 space-y-2">
          <UIcon name="i-lucide-ticket-x" class="size-10 text-gray-300 mx-auto" />
          <p class="font-semibold text-gray-500">No redemptions yet</p>
          <p class="text-sm text-gray-400">Redeemed vouchers will appear here.</p>
        </div>
      </UCard>

      <UCard v-else>
        <UTable :data="store.redemptions" :columns="columns">
          <template #serialNumber-cell="{ row }">
            <span class="font-mono text-sm">{{ row.original.serialNumber ?? '—' }}</span>
          </template>
          <template #redeemedAt-cell="{ row }">
            {{ row.original.redeemedAt ? new Date(row.original.redeemedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' }}
          </template>
          <template #status-cell>
            <UBadge color="success" variant="subtle">Redeemed</UBadge>
          </template>
        </UTable>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Redemption Officer'] })

const store = useVoucherRedemptionsStore()

const pageLoading = ref(true)

onMounted(async () => {
  try {
    await store.fetchRedemptions()
  } finally {
    pageLoading.value = false
  }
})

const columns = [
  { accessorKey: 'serialNumber', header: 'Serial Number' },
  { accessorKey: 'foodItem', header: 'Food Item', cell: ({ row }: any) => row.original.foodItem ?? '—' },
  { accessorKey: 'redeemedByName', header: 'Redeemed By', cell: ({ row }: any) => row.original.redeemedByName ?? '—' },
  { accessorKey: 'redemptionPointName', header: 'Redemption Point', cell: ({ row }: any) => row.original.redemptionPointName ?? '—' },
  { accessorKey: 'redeemedAt', header: 'Redeemed At' },
  { accessorKey: 'status', header: 'Status' },
]
</script>
