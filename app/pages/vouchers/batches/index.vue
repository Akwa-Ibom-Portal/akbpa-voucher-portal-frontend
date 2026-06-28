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
      <UTable :data="paginated" :columns="columns" :loading="batchesStore.loading">
        <template #batchCode-cell="{ row }">
          <NuxtLink :to="`/vouchers/batches/${row.original.id}`" class="font-medium text-akbpaGreen-700 hover:underline">
            {{ row.original.batchCode }}
          </NuxtLink>
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
      <div v-if="total > pageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer'] })

const batchesStore = useVoucherBatchesStore()
onMounted(() => batchesStore.fetchBatches())

const { page, total, pageSize, paginated } = usePagination(() => batchesStore.batches, 10)

const columns = [
  { accessorKey: 'batchCode', header: 'Batch' },
  { accessorKey: 'foodItem', header: 'Item' },
  { accessorKey: 'bagSize', header: 'Bag Size' },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'programmeCycleName', header: 'Programme Cycle' },
  { accessorKey: 'status', header: 'Status' },
]

function statusColor(status: string) {
  if (status === 'Allocated' || status === 'Closed') return 'success'
  if (status === 'PartlyAllocated') return 'warning'
  if (status === 'Cancelled') return 'error'
  return 'neutral'
}
</script>
