import { defineStore } from 'pinia'
import type { User, UserRole } from '~/types'
import * as authApi from '~/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const selectedRole = ref<UserRole | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role ?? null)

  function selectRole(r: UserRole | null) {
    selectedRole.value = r
  }

  async function login(roleToLogin: UserRole, email: string, password: string) {
    loading.value = true
    try {
      const result = await authApi.login(roleToLogin, email, password)
      token.value = result.accessToken
      user.value = result.user
      if (process.client) {
        localStorage.setItem('akbpa_token', token.value)
        localStorage.setItem('akbpa_user', JSON.stringify(result.user))
      }
    } finally {
      loading.value = false
    }
  }

  async function requestEmailVerification(email: string) {
    return authApi.requestEmailVerification(email)
  }

  async function verifyEmailCode(email: string, code: string) {
    return authApi.verifyEmailCode(email, code)
  }

  async function submitRegistration(profile: Omit<User, 'id' | 'isActive' | 'status' | 'createdAt'>) {
    return authApi.submitRegistration(profile)
  }

  async function requestPasswordReset(email: string) {
    return authApi.requestPasswordReset(email)
  }

  async function resetPassword(token_: string, newPassword: string) {
    return authApi.resetPassword(token_, newPassword)
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword)
  }

  async function getInviteByToken(token_: string) {
    return authApi.getInviteByToken(token_)
  }

  async function acceptInvite(token_: string, password: string) {
    const result = await authApi.acceptInvite(token_, password)
    token.value = result.accessToken
    user.value = result.user
    if (process.client) {
      localStorage.setItem('akbpa_token', token.value)
      localStorage.setItem('akbpa_user', JSON.stringify(result.user))
    }
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user.value) return
    const updated = await authApi.updateProfile(user.value.id, updates)
    user.value = updated
    if (process.client) localStorage.setItem('akbpa_user', JSON.stringify(updated))
  }

  function restore() {
    if (!process.client) return
    const t = localStorage.getItem('akbpa_token')
    const u = localStorage.getItem('akbpa_user')
    if (t && u) {
      token.value = t
      user.value = JSON.parse(u)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    selectedRole.value = null
    if (process.client) {
      localStorage.removeItem('akbpa_token')
      localStorage.removeItem('akbpa_user')
    }
    navigateTo('/login')
  }

  return {
    token, user, selectedRole, loading, isAuthenticated, role,
    selectRole, login, restore, logout,
    requestEmailVerification, verifyEmailCode, submitRegistration,
    requestPasswordReset, resetPassword, changePassword, updateProfile,
    getInviteByToken, acceptInvite,
  }
})
