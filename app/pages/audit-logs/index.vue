<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <p class="text-sm text-gray-500">Every write operation across the portal, traceable to a user, time and record.</p>
    </div>

    <UCard>
      <div class="grid sm:grid-cols-3 gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search action, user, record..." class="sm:col-span-2" @keyup.enter="store.fetchLogs()" />
        <USelect v-model="store.moduleFilter" :items="['All Modules', 'vouchers', 'redemption', 'users', 'beneficiaries']" @change="store.fetchLogs()" />
      </div>
      <UTable :data="store.logs" :columns="columns" :loading="store.loading" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

const store = useAuditLogsStore()
onMounted(() => store.fetchLogs())

const columns = [
  { accessorKey: 'createdAt', header: 'Time', cell: ({ row }: any) => new Date(row.getValue('createdAt')).toLocaleString() },
  { accessorKey: 'userName', header: 'User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'module', header: 'Module' },
  { accessorKey: 'recordId', header: 'Record' },
  { accessorKey: 'ipAddress', header: 'IP Address' },
]
</script>
