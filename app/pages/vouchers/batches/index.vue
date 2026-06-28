<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Voucher Batches</h1>
        <p class="text-sm text-gray-500">Every QR generation run, tracked end to end.</p>
      </div>
      <UButton to="/vouchers/generate" icon="i-lucide-plus">Generate New Batch</UButton>
    </div>

    <UCard>
      <UTable :data="vouchersStore.batches" :columns="columns" :loading="vouchersStore.loading">
        <template #batchCode-cell="{ row }">
          <NuxtLink :to="`/vouchers/batches/${row.original.id}`" class="font-medium text-akbpaGreen-700 hover:underline">
            {{ row.original.batchCode }}
          </NuxtLink>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer'] })

const vouchersStore = useVouchersStore()
onMounted(() => vouchersStore.fetchBatches())

const columns = [
  { accessorKey: 'batchCode', header: 'Batch' },
  { accessorKey: 'foodItem', header: 'Item' },
  { accessorKey: 'quantityGenerated', header: 'Generated' },
  { accessorKey: 'quantityReceived', header: 'Received' },
  { accessorKey: 'quantityIssued', header: 'Issued' },
  { accessorKey: 'quantityRedeemed', header: 'Redeemed' },
  { accessorKey: 'status', header: 'Status' },
]

function statusColor(status: string) {
  if (status === 'Allocated' || status === 'Received') return 'success'
  if (status === 'PartiallyReceived' || status === 'PrintedPending') return 'warning'
  if (status === 'Discrepancy') return 'error'
  return 'neutral'
}
</script>
