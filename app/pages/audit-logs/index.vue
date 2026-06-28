<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <p class="text-sm text-gray-500">Every write operation across the portal, traceable to a user, time and record.</p>
    </div>

    <UCard>
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search action, user, record..." class="flex-1 min-w-48" @keyup.enter="store.fetchLogs()" />
        <USelect v-model="store.moduleFilter" :items="['All Modules', 'vouchers', 'redemption', 'users', 'beneficiaries']" class="min-w-44" @change="store.fetchLogs()" />
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">Reset Filters</UButton>
      </div>
      <UTable :data="paginated" :columns="columns" :loading="store.loading" />
      <div v-if="total > pageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

const store = useAuditLogsStore()
onMounted(() => store.fetchLogs())

const { page, total, pageSize, paginated } = usePagination(() => store.logs, 10)

function resetFilters() {
  store.search = ''
  store.moduleFilter = 'All Modules'
  store.fetchLogs()
}

const columns = [
  { accessorKey: 'createdAt', header: 'Time', cell: ({ row }: any) => new Date(row.getValue('createdAt')).toLocaleString() },
  { accessorKey: 'userName', header: 'User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'module', header: 'Module' },
  { accessorKey: 'recordId', header: 'Record' },
  { accessorKey: 'ipAddress', header: 'IP Address' },
]
</script>
