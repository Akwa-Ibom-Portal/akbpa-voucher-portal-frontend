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
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="rowActions(row.original)">
            <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis-vertical" :loading="actingOn === row.original.id" />
          </UDropdownMenu>
        </template>
      </UTable>
      <div v-if="total > pageSize" class="flex justify-end mt-4">
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" />
      </div>
    </UCard>

    <!-- Add / Edit User modal -->
    <UModal v-model:open="userModalOpen" :title="editingUser ? 'Edit User' : 'Add a New User'">
      <template #body>
        <UForm :state="userForm" class="space-y-4" @submit="onSaveUser">
          <UFormField label="Full Name" name="fullName" required>
            <UInput v-model="userForm.fullName" class="w-full" />
          </UFormField>
          <UFormField label="Email address" name="email" required>
            <UInput v-model="userForm.email" type="email" icon="i-lucide-mail" class="w-full" :disabled="!!editingUser" />
            <template v-if="editingUser" #help>Email can't be changed here.</template>
          </UFormField>
          <UFormField v-if="!editingUser" label="Password" name="password" required>
            <div class="flex gap-2">
              <PasswordInput v-model="userForm.password" />
              <UButton color="neutral" variant="outline" icon="i-lucide-sparkles" @click="suggestPassword">Suggest</UButton>
            </div>
            <template #help>Share this password with the user directly — there's no invite email yet.</template>
          </UFormField>
          <UFormField v-if="editingUser" label="Phone" name="phone">
            <UInput v-model="userForm.phone" class="w-full" />
          </UFormField>
          <UFormField label="Role &amp; Permissions" name="roleId" required>
            <USelect v-model="userForm.roleId" :items="roleOptions" class="w-full" />
            <template #help>{{ rolesStore.roles.find(r => r.id === userForm.roleId)?.description }}</template>
          </UFormField>

          <div v-if="needsLga" class="grid sm:grid-cols-2 gap-4">
            <UFormField label="LGA" name="lgaId" required>
              <USelect v-model="userForm.lgaId" :items="lgaOptions" class="w-full" @change="userForm.wardId = ''" />
            </UFormField>
            <UFormField v-if="needsWard" label="Ward" name="wardId" required>
              <USelect v-model="userForm.wardId" :items="wardOptions" :disabled="!userForm.lgaId" class="w-full" />
            </UFormField>
          </div>

          <UAlert v-if="userFormError" color="error" variant="subtle" :title="userFormError" />

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="userModalOpen = false">Close</UButton>
            <UButton type="submit" :loading="savingUser">{{ editingUser ? 'Save Changes' : 'Create User' }}</UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Delete confirmation -->
    <UModal v-model:open="deleteModalOpen" title="Remove user?">
      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          This deactivates <strong>{{ userPendingDelete?.fullName }}</strong>'s account. They will no longer be able to sign in.
        </p>
        <div class="flex justify-end gap-2 mt-6">
          <UButton color="neutral" variant="ghost" @click="deleteModalOpen = false">Cancel</UButton>
          <UButton color="error" :loading="actingOn === userPendingDelete?.id" @click="confirmDelete">Remove User</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

import { USER_ROLES, type User, type UserRole } from '~/types'
import { listLgas, listWards } from '~/services/lgaApi'
import * as usersApi from '~/services/usersApi'

const store = useUsersStore()
const rolesStore = useRolesStore()
const toast = useToast()

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
  { id: 'actions', header: '' },
]

function statusColor(status: User['status']) {
  return status === 'Active' ? 'success' : 'neutral'
}

function rowActions(u: User) {
  return [
    [
      { label: 'Edit', icon: 'i-lucide-pencil', onSelect: () => openEditUser(u) },
      {
        label: u.isActive ? 'Suspend' : 'Activate',
        icon: u.isActive ? 'i-lucide-ban' : 'i-lucide-check-circle',
        onSelect: () => toggleStatus(u),
      },
      { label: 'Reset Password', icon: 'i-lucide-key-round', onSelect: () => resetPassword(u) },
    ],
    [
      { label: 'Remove User', icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => openDeleteUser(u) },
    ],
  ]
}

async function toggleStatus(u: User) {
  actingOn.value = u.id
  try {
    await store.setUserStatus(u.id, !u.isActive)
    toast.add({ title: u.isActive ? 'User suspended' : 'User activated', color: 'success' })
  } finally {
    actingOn.value = ''
  }
}

async function resetPassword(u: User) {
  actingOn.value = u.id
  try {
    await store.resetUserPassword(u.id)
    toast.add({ title: 'Password reset email sent', color: 'success' })
  } catch {
    // The global axios interceptor already toasts the failure (e.g. email provider not configured).
  } finally {
    actingOn.value = ''
  }
}

const deleteModalOpen = ref(false)
const userPendingDelete = ref<User | null>(null)

function openDeleteUser(u: User) {
  userPendingDelete.value = u
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!userPendingDelete.value) return
  actingOn.value = userPendingDelete.value.id
  try {
    await store.deleteUser(userPendingDelete.value.id)
    toast.add({ title: 'User removed', color: 'success' })
    deleteModalOpen.value = false
  } finally {
    actingOn.value = ''
  }
}

// Add / Edit User
const userModalOpen = ref(false)
const savingUser = ref(false)
const userFormError = ref('')
const editingUser = ref<User | null>(null)
const userForm = reactive({ fullName: '', email: '', password: '', phone: '', roleId: '', lgaId: '', wardId: '' })

const userFormLgas = ref<{ id: string; name: string }[]>([])
const userFormWards = ref<{ id: string; name: string; lgaId: string }[]>([])

function resetUserForm() {
  userForm.fullName = ''
  userForm.email = ''
  userForm.password = ''
  userForm.phone = ''
  userForm.roleId = ''
  userForm.lgaId = ''
  userForm.wardId = ''
}

async function openAddUser() {
  editingUser.value = null
  resetUserForm()
  userForm.password = generateStrongPassword()
  userModalOpen.value = true
  if (!userFormLgas.value.length) userFormLgas.value = await listLgas()
}

async function openEditUser(row: User) {
  resetUserForm()
  userModalOpen.value = true

  // GET /users (list) omits roleId and scopes entirely — only the single-user GET
  // returns them, so the edit form must re-fetch before it can prefill role/LGA/ward.
  const u = await usersApi.getUser(row.id)
  editingUser.value = u
  userForm.fullName = u.fullName
  userForm.email = u.email
  userForm.phone = u.phone ?? ''
  userForm.roleId = u.roleId ?? rolesStore.roles.find(r => r.name === u.role)?.id ?? ''

  if (!userFormLgas.value.length) userFormLgas.value = await listLgas()

  if (u.wardIds?.[0]) {
    // The user only stores the ward id, not which LGA it belongs to — load all wards once
    // to find it, then scope the ward dropdown to that LGA like the Add form does.
    const allWards = await listWards()
    const ward = allWards.find(w => w.id === u.wardIds![0])
    if (ward) {
      userForm.lgaId = ward.lgaId
      userFormWards.value = allWards.filter(w => w.lgaId === ward.lgaId)
      userForm.wardId = ward.id
    }
  } else if (u.lgaIds?.[0]) {
    userForm.lgaId = u.lgaIds[0]
  }
}

function suggestPassword() {
  userForm.password = generateStrongPassword()
}

watch(() => userForm.lgaId, async (lgaId, oldLgaId) => {
  if (lgaId === oldLgaId) return
  userFormWards.value = lgaId ? await listWards(lgaId) : []
})

const roleOptions = computed(() => rolesStore.roles.map(r => ({ label: r.name, value: r.id })))
const selectedRoleName = computed(() => rolesStore.roles.find(r => r.id === userForm.roleId)?.name ?? '')
const needsLga = computed(() => /LGA|Ward/.test(selectedRoleName.value))
const needsWard = computed(() => /Ward/.test(selectedRoleName.value))
const lgaOptions = computed(() => userFormLgas.value.map(l => ({ label: l.name, value: l.id })))
const wardOptions = computed(() => userFormWards.value.map(w => ({ label: w.name, value: w.id })))

async function onSaveUser() {
  userFormError.value = ''
  if (!userForm.fullName || !userForm.email || !userForm.roleId || (!editingUser.value && !userForm.password)) {
    userFormError.value = 'Please complete all required fields.'
    return
  }
  if (needsLga.value && !userForm.lgaId) {
    userFormError.value = 'Please select an LGA.'
    return
  }
  if (needsWard.value && !userForm.wardId) {
    userFormError.value = 'Please select a ward.'
    return
  }
  savingUser.value = true
  try {
    if (editingUser.value) {
      await store.updateUser(editingUser.value.id, {
        fullName: userForm.fullName,
        phone: userForm.phone || undefined,
        roleId: userForm.roleId,
        roleName: selectedRoleName.value as UserRole,
        lgaIds: needsWard.value ? undefined : (userForm.lgaId ? [userForm.lgaId] : undefined),
        wardIds: needsWard.value ? (userForm.wardId ? [userForm.wardId] : undefined) : undefined,
      })
      toast.add({ title: 'User updated', color: 'success' })
    } else {
      await store.createUser({
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
        roleId: userForm.roleId,
        roleName: selectedRoleName.value as UserRole,
        // The LGA picker is also used to filter the ward dropdown for ward-scoped roles, but the
        // API rejects a request that sets both — only send whichever scope the role actually needs.
        lgaIds: needsWard.value ? undefined : (userForm.lgaId ? [userForm.lgaId] : undefined),
        wardIds: needsWard.value ? (userForm.wardId ? [userForm.wardId] : undefined) : undefined,
      })
      toast.add({ title: 'User created', color: 'success' })
    }
    userModalOpen.value = false
    resetUserForm()
  } catch (e: any) {
    userFormError.value = e.response?.data?.message ?? e.message
  } finally {
    savingUser.value = false
  }
}
</script>
