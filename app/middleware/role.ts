import type { UserRole } from '~/types'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const allowed = to.meta.role as UserRole[] | undefined
  if (!allowed || allowed.length === 0) return
  if (!auth.role || !allowed.includes(auth.role)) {
    return navigateTo('/dashboard')
  }
})
