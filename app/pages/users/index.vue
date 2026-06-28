<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="text-sm text-gray-500">{{ store.users.length.toLocaleString() }} accounts</p>
      </div>
      <div class="flex gap-2">
        <UButton icon="i-lucide-plus" @click="openAddUser">Add User</UButton>
      </div>
    </div>

    <div class="grid sm:grid-cols-3 lg:grid-cols-7 gap-3">
      <UCard v-for="r in roleCounts" :key="r.role">
        <p class="text-xs text-gray-500">{{ r.label }}</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ r.count }}</p>
      </UCard>
    </div>

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
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ u.fullName }} <span class="text-gray-400 font-normal">· requested {{ u.role }}</span></p>
            <p class="text-xs text-gray-500">{{ u.email }} · {{ u.phone }} · NIN {{ u.nin }}</p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" color="success" icon="i-lucide-check" :loading="actingOn === u.id" @click="approve(u)">Approve</UButton>
            <UButton size="sm" color="error" variant="outline" icon="i-lucide-x" :loading="actingOn === u.id" @click="reject(u)">Reject</UButton>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <div class="flex flex-wrap items-end gap-3 mb-4">
        <UInput v-model="store.search" icon="i-lucide-search" placeholder="Search name or email..." class="flex-1 min-w-48" @keyup.enter="store.fetchUsers()" />
        <USelect v-model="roleFilterLabel" :items="['All Roles', ...USER_ROLES.map(r => r.label)]" class="min-w-48" @change="onRoleFilterChange" />
        <UButton color="neutral" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilters">Reset Filters</UButton>
      </div>
      <UAlert v-if="store.error" color="error" variant="subtle" :title="store.error" class="mb-4" />
      <UTable :data="paginated" :columns="columns" :loading="store.loading">
        <template #status-cell="{ row }">
          <UBadge :color="statusColor(row.original.status)" variant="subtle">{{ row.original.status }}</UBadge>
        </template>
      </UTable>
      <div v-if="total > pageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </UCard>

    <!-- Add User modal -->
    <UModal v-model:open="addUserModalOpen" title="Add a New User">
      <template #body>
        <UForm :state="addUserForm" class="space-y-4" @submit="onAddUser">
          <UFormField label="Full Name" name="fullName" required>
            <UInput v-model="addUserForm.fullName" class="w-full" />
          </UFormField>
          <UFormField label="Email address" name="email" required>
            <UInput v-model="addUserForm.email" type="email" icon="i-lucide-mail" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <div class="flex gap-2">
              <PasswordInput v-model="addUserForm.password" />
              <UButton color="neutral" variant="outline" icon="i-lucide-sparkles" @click="suggestPassword">Suggest</UButton>
            </div>
            <template #help>Share this password with the user directly — there's no invite email yet.</template>
          </UFormField>
          <UFormField label="Role &amp; Permissions" name="roleId" required>
            <USelect v-model="addUserForm.roleId" :items="roleOptions" class="w-full" />
            <template #help>{{ rolesStore.roles.find(r => r.id === addUserForm.roleId)?.description }}</template>
          </UFormField>

          <div v-if="needsLga" class="grid sm:grid-cols-2 gap-4">
            <UFormField label="LGA" name="lgaId" required>
              <USelect v-model="addUserForm.lgaId" :items="lgaOptions" class="w-full" @change="addUserForm.wardId = ''" />
            </UFormField>
            <UFormField v-if="needsWard" label="Ward" name="wardId" required>
              <USelect v-model="addUserForm.wardId" :items="wardOptions" :disabled="!addUserForm.lgaId" class="w-full" />
            </UFormField>
          </div>

          <UAlert v-if="addUserError" color="error" variant="subtle" :title="addUserError" />

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="addUserModalOpen = false">Close</UButton>
            <UButton type="submit" :loading="addingUser">Create User</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

import { USER_ROLES, type User, type UserRole } from '~/types'
import { listLgasFromApi, listWardsFromApi } from '~/services/lgaApi'

const store = useUsersStore()
const rolesStore = useRolesStore()

onMounted(async () => {
  await rolesStore.ensureLoaded()
  await store.fetchUsers()
})

const roleFilterLabel = ref('All Roles')
const actingOn = ref('')

const { page, total, pageSize, paginated } = usePagination(() => store.users, 10)

function onRoleFilterChange() {
  const match = USER_ROLES.find(r => r.label === roleFilterLabel.value)
  store.roleFilter = (match?.value ?? 'All Roles') as UserRole | 'All Roles'
  store.fetchUsers()
}

function resetFilters() {
  store.search = ''
  roleFilterLabel.value = 'All Roles'
  store.roleFilter = 'All Roles'
  store.fetchUsers()
}

const roleCounts = computed(() => USER_ROLES.map(r => ({
  role: r.value,
  label: r.label,
  count: store.users.filter(u => u.role === r.value).length,
})))

const columns = [
  { accessorKey: 'fullName', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'createdAt', header: 'Created', cell: ({ row }: any) => row.getValue('createdAt') ? new Date(row.getValue('createdAt')).toLocaleString() : '—' },
  { accessorKey: 'status', header: 'Status' },
]

function statusColor(status: User['status']) {
  if (status === 'Active') return 'success'
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

// Add User
const addUserModalOpen = ref(false)
const addingUser = ref(false)
const addUserError = ref('')
const addUserForm = reactive({ fullName: '', email: '', password: '', roleId: '', lgaId: '', wardId: '' })

const addUserLgas = ref<{ id: string; name: string }[]>([])
const addUserWards = ref<{ id: string; name: string; lgaId: string }[]>([])

async function openAddUser() {
  addUserModalOpen.value = true
  addUserForm.password = generateStrongPassword()
  if (!addUserLgas.value.length) addUserLgas.value = await listLgasFromApi()
}

function suggestPassword() {
  addUserForm.password = generateStrongPassword()
}

watch(() => addUserForm.lgaId, async (lgaId) => {
  addUserWards.value = lgaId ? await listWardsFromApi(lgaId) : []
})

const roleOptions = computed(() => rolesStore.roles.map(r => ({ label: r.name, value: r.id })))
const selectedRoleName = computed(() => rolesStore.roles.find(r => r.id === addUserForm.roleId)?.name ?? '')
const needsLga = computed(() => /LGA|Ward/.test(selectedRoleName.value))
const needsWard = computed(() => /Ward/.test(selectedRoleName.value))
const lgaOptions = computed(() => addUserLgas.value.map(l => ({ label: l.name, value: l.id })))
const wardOptions = computed(() => addUserWards.value.map(w => ({ label: w.name, value: w.id })))

async function onAddUser() {
  addUserError.value = ''
  if (!addUserForm.fullName || !addUserForm.email || !addUserForm.password || !addUserForm.roleId) {
    addUserError.value = 'Please complete all required fields.'
    return
  }
  if (needsLga.value && !addUserForm.lgaId) {
    addUserError.value = 'Please select an LGA.'
    return
  }
  if (needsWard.value && !addUserForm.wardId) {
    addUserError.value = 'Please select a ward.'
    return
  }
  addingUser.value = true
  try {
    await store.createUser({
      fullName: addUserForm.fullName,
      email: addUserForm.email,
      password: addUserForm.password,
      roleId: addUserForm.roleId,
      roleName: selectedRoleName.value as UserRole,
      // The LGA picker is also used to filter the ward dropdown for ward-scoped roles, but the
      // API rejects a request that sets both — only send whichever scope the role actually needs.
      lgaIds: needsWard.value ? undefined : (addUserForm.lgaId ? [addUserForm.lgaId] : undefined),
      wardIds: needsWard.value ? (addUserForm.wardId ? [addUserForm.wardId] : undefined) : undefined,
    })
    addUserModalOpen.value = false
    addUserForm.fullName = ''
    addUserForm.email = ''
    addUserForm.password = ''
    addUserForm.roleId = ''
    addUserForm.lgaId = ''
    addUserForm.wardId = ''
  } catch (e: any) {
    addUserError.value = e.response?.data?.message ?? e.message
  } finally {
    addingUser.value = false
  }
}
</script>
