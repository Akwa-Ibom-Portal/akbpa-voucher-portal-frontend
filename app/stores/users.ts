import { defineStore } from 'pinia'
import type { User, UserRole, UserStatus } from '~/types'
import * as usersApi from '~/services/usersApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const roleFilter = ref<UserRole | 'All Roles'>('All Roles')
  const statusFilter = ref<UserStatus | 'All'>('All')

  const pendingUsers = computed(() => users.value.filter(u => u.status === 'PendingApproval'))
  const invitedUsers = computed(() => users.value.filter(u => u.status === 'Invited'))
  const activeUsers = computed(() => users.value.filter(u => u.status === 'Active'))

  const lastInviteLink = ref('')

  async function fetchUsers() {
    loading.value = true
    error.value = ''
    try {
      users.value = await usersApi.listUsers({
        search: search.value || undefined,
        role: roleFilter.value,
        status: statusFilter.value,
      })
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  async function approve(id: string) {
    const updated = await usersApi.approveUser(id)
    const i = users.value.findIndex(u => u.id === id)
    if (i !== -1) users.value[i] = updated
  }

  async function reject(id: string) {
    const updated = await usersApi.rejectUser(id)
    const i = users.value.findIndex(u => u.id === id)
    if (i !== -1) users.value[i] = updated
  }

  async function bulkCreateWardPAs(rows: Array<Partial<User>>) {
    return usersApi.bulkCreateWardPAs(rows)
  }

  async function inviteUser(dto: usersApi.InviteUserDto) {
    const { user, inviteLink } = await usersApi.inviteUser(dto)
    users.value.unshift(user)
    lastInviteLink.value = inviteLink
    return { user, inviteLink }
  }

  async function resendInvite(id: string) {
    const { inviteLink } = await usersApi.resendInvite(id)
    lastInviteLink.value = inviteLink
    return inviteLink
  }

  return {
    users, loading, error, search, roleFilter, statusFilter, lastInviteLink,
    pendingUsers, invitedUsers, activeUsers,
    fetchUsers, approve, reject, bulkCreateWardPAs, inviteUser, resendInvite,
  }
})
