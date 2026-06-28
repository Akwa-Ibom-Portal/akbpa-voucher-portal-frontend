import { defineStore } from 'pinia'
import type { User, UserRole } from '~/types'
import * as usersApi from '~/services/usersApi'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  const search = ref('')
  const roleFilter = ref<UserRole | 'All Roles'>('All Roles')

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

  async function createUser(dto: usersApi.CreateUserDto) {
    const user = await usersApi.createUser(dto)
    users.value.unshift(user)
    return user
  }

  function replace(updated: User) {
    const i = users.value.findIndex(u => u.id === updated.id)
    if (i !== -1) users.value[i] = updated
  }

  async function updateUser(id: string, dto: usersApi.UpdateUserDto) {
    const updated = await usersApi.updateUser(id, dto)
    replace(updated)
    return updated
  }

  async function setUserStatus(id: string, isActive: boolean) {
    const updated = await usersApi.setUserStatus(id, isActive)
    replace(updated)
    return updated
  }

  async function resetUserPassword(id: string) {
    return usersApi.resetUserPassword(id)
  }

  async function deleteUser(id: string) {
    const updated = await usersApi.deleteUser(id)
    replace(updated)
    return updated
  }

  return {
    users, loading, error, search, roleFilter,
    activeUsers,
    fetchUsers, createUser,
    updateUser, setUserStatus, resetUserPassword, deleteUser,
  }
})
