<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Inquiries / Submissions</h1>
      <p class="text-sm text-gray-500">{{ store.pagination.total.toLocaleString() }} submissions from public forms.</p>
    </div>

    <UCard>
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <USelect
          v-model="store.typeFilter"
          :items="typeOptions"
          value-key="value"
          label-key="label"
          class="min-w-52"
          @update:model-value="store.fetchInquiries(1)"
        />
      </div>

      <UTable :data="store.inquiries" :columns="columns" :loading="store.loading" @select="openDetail">
        <template #type-cell="{ row }">
          {{ typeLabel(row.original.type) }}
        </template>
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" :variant="row.original.status === 'closed' ? 'outline' : 'subtle'">
            {{ statusLabel(row.original.status) }}
          </UBadge>
        </template>
        <template #createdAt-cell="{ row }">
          {{ formatDate(row.original.createdAt) }}
        </template>
      </UTable>

      <div v-if="store.pagination.pages > 1" class="flex justify-end mt-4">
        <UPagination
          :page="store.page"
          :total="store.pagination.total"
          :items-per-page="store.pagination.limit"
          @update:page="store.fetchInquiries"
        />
      </div>
    </UCard>

    <UModal v-model:open="modalOpen" :title="selected?.fullName ?? typeLabel(selected?.type ?? 'contact_message')" size="lg">
      <template #body>
        <div v-if="selected" class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ typeLabel(selected.type) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Submitted</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ formatDate(selected.createdAt) }}</p>
            </div>
            <div v-if="selected.fullName">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ selected.fullName }}</p>
            </div>
            <div v-if="selected.email">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ selected.email }}</p>
            </div>
            <div v-if="selected.phone">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ selected.phone }}</p>
            </div>
            <div v-if="selected.source">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Source</p>
              <p class="mt-0.5 text-gray-900 dark:text-white">{{ selected.source }}</p>
            </div>
          </div>

          <template v-if="selected.fields && Object.keys(selected.fields).length">
            <div class="h-px bg-gray-100 dark:bg-gray-800" />
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Details</p>
              <dl class="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div v-for="(val, key) in selected.fields" :key="key">
                  <dt class="text-xs font-medium text-gray-500 capitalize">{{ String(key).replace(/_/g, ' ') }}</dt>
                  <dd class="mt-0.5 text-gray-900 dark:text-white break-words">{{ val ?? '—' }}</dd>
                </div>
              </dl>
            </div>
          </template>

          <div class="h-px bg-gray-100 dark:bg-gray-800" />

          <div class="flex items-center gap-3">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">Status</p>
            <USelect
              v-model="detailStatus"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              class="flex-1"
            />
            <UButton :loading="updatingStatus" @click="onUpdateStatus">Update</UButton>
          </div>
          <UAlert v-if="statusError" color="error" variant="subtle" :title="statusError" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin'] })

const flags = useFeatureFlags()
if (!flags.adminInquiries) await navigateTo('/dashboard')

import type { Inquiry, InquiryStatus, InquiryType } from '~/services/inquiriesApi'

const store = useInquiriesStore()
onMounted(() => store.fetchInquiries(1))

const typeOptions = [
  { label: 'All Types', value: 'All' },
  { label: 'Farmer Registration', value: 'farmer_registration' },
  { label: 'Supplier Registration', value: 'supplier_registration' },
  { label: 'Report Issue', value: 'report_issue' },
  { label: 'Contact Message', value: 'contact_message' },
  { label: 'Newsletter Subscription', value: 'newsletter_subscription' },
]

const statusOptions = [
  { label: 'Received', value: 'received' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
]

function typeLabel(type: InquiryType | string) {
  return typeOptions.find(o => o.value === type)?.label ?? type
}

function statusLabel(status: InquiryStatus | string) {
  return statusOptions.find(o => o.value === status)?.label ?? status
}

function statusColor(status: InquiryStatus | string) {
  if (status === 'in_review') return 'warning'
  if (status === 'resolved') return 'success'
  return 'neutral'
}

function formatDate(val?: string) {
  return val ? new Date(val).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
}

const columns = [
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'fullName', header: 'Name', cell: ({ row }: any) => row.original.fullName ?? '—' },
  { accessorKey: 'email', header: 'Email', cell: ({ row }: any) => row.original.email ?? '—' },
  { accessorKey: 'phone', header: 'Phone', cell: ({ row }: any) => row.original.phone ?? '—' },
  { accessorKey: 'source', header: 'Source', cell: ({ row }: any) => row.original.source ?? '—' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Submitted' },
]

const modalOpen = ref(false)
const selected = ref<Inquiry | null>(null)
const detailStatus = ref<InquiryStatus>('received')
const updatingStatus = ref(false)
const statusError = ref('')

function openDetail(row: any) {
  selected.value = row.original ?? row
  detailStatus.value = selected.value!.status
  statusError.value = ''
  modalOpen.value = true
}

async function onUpdateStatus() {
  if (!selected.value) return
  updatingStatus.value = true
  statusError.value = ''
  try {
    const updated = await store.updateStatus(selected.value.id, detailStatus.value)
    selected.value = updated
  } catch (e: any) {
    statusError.value = e.response?.data?.message ?? e.message ?? 'Failed to update status'
  } finally {
    updatingStatus.value = false
  }
}
</script>
