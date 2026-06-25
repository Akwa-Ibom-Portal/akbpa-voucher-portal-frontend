<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="text-sm text-gray-500">{{ store.users.length.toLocaleString() }} accounts · roles map to ward/LGA scope automatically</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="outline" icon="i-lucide-upload">Bulk Create Ward PAs</UButton>
        <UButton icon="i-lucide-plus" @click="inviteModalOpen = true">Add User</UButton>
      </div>
    </div>

    <div class="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <UCard v-for="r in roleCounts" :key="r.role">
        <p class="text-xs text-gray-500">{{ r.label }}</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ r.count }}</p>
      </UCard>
    </div>

    <UCard v-if="store.invitedUsers.length" class="border-sky-200 dark:border-sky-900">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="size-4 text-sky-600" />
          <p class="font-semibold text-gray-900 dark:text-white text-sm">Invited — Awaiting Onboarding ({{ store.invitedUsers.length }})</p>
        </div>
      </template>
      <div class="space-y-3">
        <div v-for="u in store.invitedUsers" :key="u.id" class="flex items-center justify-between flex-wrap gap-3 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ u.firstName }} {{ u.lastName }} <span class="text-gray-400 font-normal">· invited as {{ USER_ROLES.find(r => r.value === u.role)?.label }}</span></p>
            <p class="text-xs text-gray-500">{{ u.email }}</p>
          </div>
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-refresh-cw" :loading="actingOn === u.id" @click="resend(u)">Resend Invite</UButton>
        </div>
      </div>
    </UCard>

    <UCard v-if="store.pendingUsers.length" class="border-amber-200 dark:border-amber-900">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-clock" class="size-4 text-amber-600" />
          <p class="font-semibold text-gray-900 dark:text-white text-sm">Self-Requested — Pending Approval ({{ store.pendingUsers.length }})</p>
        </div>
      </template>
      <div class="space-y-3">
        <div v-for="u in store.pendingUsers" :key="u.id" class="flex items-center justify-between flex-wrap gap-3 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ u.firstName }} {{ u.lastName }} <span class="text-gray-400 font-normal">· requested {{ USER_ROLES.find(r => r.value === u.role)?.label }}</span></p>
            <p class="text-xs text-gray-500">{{ u.email }} · {{ u.phone }} · NIN {{ u.nin }}</p>
            <p v-if="u.idDocumentName" class="text-xs text-akbpaGreen-700 mt-1 flex items-center gap-1">
              <UIcon name="i-lucide-file-check-2" class="size-3.5" /> {{ u.idDocumentName }}
            </p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" color="success" icon="i-lucide-check" :loading="actingOn === u.id" @click="approve(u)">Approve</UButton>
            <UButton size="sm" color="error" variant="outline" icon="i-lucide-x" :loading="actingOn === u.id" @click="reject(u)">Reject</UButton>
          </div>
        </div>
      </div>
    </UCard>

    <UAlert color="info" variant="subtle" icon="i-lucide-info" title="Ward PA accounts scale with the register.">
      <template #description>
        The Developer Guide assumes one Ward PA per ward — with 329 wards, that's the bulk
        of all accounts. Use bulk creation (CSV import) rather than adding them one at a time.
      </template>
    </UAlert>

    <UCard>
      <div class="grid sm:grid-cols-2 gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search name or email..." @keyup.enter="store.fetchUsers()" />
        <USelect v-model="roleFilterLabel" :items="['All Roles', ...USER_ROLES.map(r => r.label)]" @change="onRoleFilterChange" />
      </div>
      <UTable :data="store.users" :columns="columns" :loading="store.loading">
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
    </UCard>

    <!-- Add User / Invite modal -->
    <UModal v-model:open="inviteModalOpen" title="Invite a New User">
      <template #body>
        <UForm :state="inviteForm" class="space-y-4" @submit="onInvite">
          <div class="grid sm:grid-cols-2 gap-4">
            <UFormField label="First Name" name="firstName" required>
              <UInput v-model="inviteForm.firstName" class="w-full" />
            </UFormField>
            <UFormField label="Last Name" name="lastName" required>
              <UInput v-model="inviteForm.lastName" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Email address" name="email" required>
            <UInput v-model="inviteForm.email" type="email" icon="i-lucide-mail" class="w-full" />
          </UFormField>
          <UFormField label="Role &amp; Permissions" name="role" required>
            <USelect v-model="inviteForm.role" :items="USER_ROLES.map(r => ({ label: r.label, value: r.value }))" class="w-full" />
            <template #help>{{ USER_ROLES.find(r => r.value === inviteForm.role)?.description }}</template>
          </UFormField>

          <div v-if="needsScope" class="grid sm:grid-cols-2 gap-4">
            <UFormField label="LGA" name="lgaId" required>
              <USelect v-model="inviteForm.lgaId" :items="lgaOptions" class="w-full" @change="inviteForm.wardId = ''" />
            </UFormField>
            <UFormField v-if="inviteForm.role === 'WardPA'" label="Ward" name="wardId" required>
              <USelect v-model="inviteForm.wardId" :items="wardOptions" :disabled="!inviteForm.lgaId" class="w-full" />
            </UFormField>
          </div>

          <UAlert v-if="inviteError" color="error" variant="subtle" :title="inviteError" />

          <UAlert v-if="store.lastInviteLink" color="success" variant="subtle" title="Invite created — link below (demo mode, no email service wired up yet).">
            <template #description>
              <NuxtLink :to="store.lastInviteLink" class="text-akbpaGreen-700 hover:underline break-all">{{ store.lastInviteLink }}</NuxtLink>
            </template>
          </UAlert>

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="inviteModalOpen = false">Close</UButton>
            <UButton type="submit" :loading="inviting">Send Invite</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['SuperAdmin'] })

import { USER_ROLES, type User, type UserRole } from '~/types'

const auth = useAuthStore()
const store = useUsersStore()
const lgaStore = useLgaStore()

onMounted(async () => {
  await lgaStore.ensureLoaded()
  await store.fetchUsers()
})

const roleFilterLabel = ref('All Roles')
const actingOn = ref('')

function onRoleFilterChange() {
  const match = USER_ROLES.find(r => r.label === roleFilterLabel.value)
  store.roleFilter = (match?.value ?? 'All Roles') as UserRole | 'All Roles'
  store.fetchUsers()
}

const roleCounts = computed(() => USER_ROLES.map(r => ({
  role: r.value,
  label: r.label,
  count: r.value === 'WardPA' ? 329 : store.users.filter(u => u.role === r.value).length,
})))

const columns = [
  { accessorKey: 'firstName', header: 'Name', cell: ({ row }: any) => `${row.original.firstName} ${row.original.lastName}` },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'lastLoginAt', header: 'Last Login', cell: ({ row }: any) => row.getValue('lastLoginAt') ? new Date(row.getValue('lastLoginAt')).toLocaleString() : 'Never' },
  { accessorKey: 'status', header: 'Status' },
]

function statusColor(status: User['status']) {
  if (status === 'Active') return 'success'
  if (status === 'Invited') return 'info'
  if (status === 'PendingApproval') return 'warning'
  if (status === 'Rejected') return 'error'
  return 'neutral'
}

async function approve(u: User) {
  actingOn.value = u.id
  try { await store.approve(u.id) } finally { actingOn.value = '' }
}
async function reject(u: User) {
  actingOn.value = u.id
  try { await store.reject(u.id) } finally { actingOn.value = '' }
}
async function resend(u: User) {
  actingOn.value = u.id
  try { await store.resendInvite(u.id) } finally { actingOn.value = '' }
}

// Add User / Invite
const inviteModalOpen = ref(false)
const inviting = ref(false)
const inviteError = ref('')
const inviteForm = reactive({ firstName: '', lastName: '', email: '', role: 'WardPA' as UserRole, lgaId: '', wardId: '' })

const needsScope = computed(() => ['WardPA', 'RedemptionOfficer', 'AKBPAAdmin'].includes(inviteForm.role))
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const wardOptions = computed(() => lgaStore.wardsForLga(inviteForm.lgaId).map(w => ({ label: w.name, value: w.id })))

async function onInvite() {
  inviteError.value = ''
  if (!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email) {
    inviteError.value = 'Please complete all required fields.'
    return
  }
  if (needsScope.value && !inviteForm.lgaId) {
    inviteError.value = 'Please select an LGA.'
    return
  }
  if (inviteForm.role === 'WardPA' && !inviteForm.wardId) {
    inviteError.value = 'Please select a ward.'
    return
  }
  inviting.value = true
  try {
    await store.inviteUser({
      firstName: inviteForm.firstName,
      lastName: inviteForm.lastName,
      email: inviteForm.email,
      role: inviteForm.role,
      lgaId: inviteForm.lgaId || undefined,
      wardId: inviteForm.wardId || undefined,
      invitedBy: auth.user?.id ?? 'unknown',
    })
    inviteForm.firstName = ''
    inviteForm.lastName = ''
    inviteForm.email = ''
  } catch (e: any) {
    inviteError.value = e.message
  } finally {
    inviting.value = false
  }
}
</script>
