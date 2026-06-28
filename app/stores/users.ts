import { defineStore } from 'pinia'
import type { User, UserRole } from '~/types'
import * as usersApi from '~/services/usersApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const roleFilter = ref<UserRole | 'All Roles'>('All Roles')

  const pendingUsers = computed(() => users.value.filter(u => u.status === 'PendingApproval'))
  const activeUsers = computed(() => users.value.filter(u => u.status === 'Active'))

  async function fetchUsers() {
    loading.value = true
    error.value = ''
    try {
      users.value = await usersApi.listUsers({
        search: search.value || undefined,
        role: roleFilter.value,
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

  async function createUser(dto: usersApi.CreateUserDto) {
    const user = await usersApi.createUser(dto)
    users.value.unshift(user)
    return user
  }

  return {
    users, loading, error, search, roleFilter,
    pendingUsers, activeUsers,
    fetchUsers, approve, reject, bulkCreateWardPAs, createUser,
  }
})
