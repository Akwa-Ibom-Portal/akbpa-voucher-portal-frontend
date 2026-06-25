export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (process.client && !auth.isAuthenticated) auth.restore()
  if (!auth.isAuthenticated) return navigateTo('/login')
})
