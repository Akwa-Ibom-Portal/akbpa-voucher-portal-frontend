import { defineStore } from 'pinia'
import type { User } from '~/types'
import * as authApi from '~/services/authApi'

/** Cookies (not localStorage) so the session survives a hard refresh: useCookie is readable
 *  during SSR (from the request's Cookie header), while localStorage only exists client-side —
 *  a refresh would otherwise hit the server with no session and bounce to /login. */
const COOKIE_OPTS = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' as const, path: '/' }

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('akbpa_token', { ...COOKIE_OPTS, default: () => null })
  const user = useCookie<User | null>('akbpa_user', { ...COOKIE_OPTS, default: () => null })
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role ?? null)

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const result = await authApi.login(email, password)
      token.value = result.accessToken
      user.value = result.user
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    user.value = await authApi.getMe()
  }

  async function requestEmailVerification(email: string) {
    return authApi.requestEmailVerification(email)
  }

  async function verifyEmailCode(email: string, code: string) {
    return authApi.verifyEmailCode(email, code)
  }

  async function submitRegistration(profile: Record<string, any>) {
    return authApi.submitRegistration(profile)
  }

  async function requestPasswordReset(email: string) {
    await authApi.requestPasswordReset(email)
  }

  async function resetPassword(token_: string, newPassword: string) {
    return authApi.resetPassword(token_, newPassword)
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword)
  }

  async function updateProfile(updates: { fullName?: string; phone?: string }) {
    if (!user.value) return
    user.value = await authApi.updateProfile(updates)
  }

  async function logout() {
    await authApi.logout()
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    token, user, loading, isAuthenticated, role,
    login, fetchMe, logout,
    requestEmailVerification, verifyEmailCode, submitRegistration,
    requestPasswordReset, resetPassword, changePassword, updateProfile,
  }
})
