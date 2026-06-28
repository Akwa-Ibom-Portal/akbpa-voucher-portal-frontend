<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <p class="text-sm text-gray-500">{{ store.pagination.total.toLocaleString() }} recorded actions, traceable to a user, time and record.</p>
    </div>

    <UCard>
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search action, user, record (current page only)..." class="flex-1 min-w-48" />
        <USelect v-model="store.moduleFilter" :items="['All Modules', 'users', 'beneficiaries', 'voucher_batches', 'vouchers']" class="min-w-44" />
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">Reset Filters</UButton>
      </div>
      <UTable :data="store.filtered" :columns="columns" :loading="store.loading" />
      <div v-if="store.pagination.pages > 1" class="flex justify-end mt-4">
        <UPagination :page="store.page" :total="store.pagination.total" :items-per-page="store.pageSize" @update:page="store.fetchLogs" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

const store = useAuditLogsStore()
onMounted(() => store.fetchLogs(1))

function resetFilters() {
  store.search = ''
  store.moduleFilter = 'All Modules'
}

const columns = [
  { accessorKey: 'createdAt', header: 'Time', cell: ({ row }: any) => new Date(row.getValue('createdAt')).toLocaleString() },
  { accessorKey: 'actorName', header: 'User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'entityType', header: 'Entity' },
  { accessorKey: 'entityId', header: 'Record' },
]
</script>
