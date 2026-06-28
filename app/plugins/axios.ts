import axios, { type AxiosError } from 'axios'

/**
 * Single shared axios instance for the whole app. Auth token is read straight from the
 * akbpa_token cookie (not the Pinia store) to avoid a circular import between this plugin
 * and stores/auth.ts — useCookie works isomorphically, same cookie the store reads/writes.
 *
 * Every failed API call surfaces a toast here, so individual pages don't need their own
 * axios error boilerplate — they can still show an inline message too (e.g. for a form
 * field), but no longer have to in order for the failure to be visible.
 *
 * A 401 (not authenticated / token expired) always clears the session and bounces to
 * /login — except for the login request itself, whose "wrong credentials" 401 is handled
 * inline by the login form.
 */
function errorMessage(error: AxiosError): string {
  if (!error.response) return 'Network error — please check your connection and try again.'
  const data = error.response.data as { message?: string } | undefined
  return data?.message ?? error.message ?? 'Something went wrong. Please try again.'
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const toast = useToast()
  let redirectingToLogin = false

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: config.public.apiTimeout,
    headers: { 'Content-Type': 'application/json' },
  })

  axiosInstance.interceptors.request.use((req) => {
    const token = useCookie<string | null>('akbpa_token').value
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
  })

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      const isUnauthorized = error.response?.status === 401

      if (isUnauthorized && !isLoginRequest) {
        useCookie('akbpa_token').value = null
        useCookie('akbpa_user').value = null
        if (!redirectingToLogin) {
          redirectingToLogin = true
          toast.add({ title: 'Session expired', description: 'Please sign in again.', color: 'warning' })
          if (process.client) navigateTo('/login')
        }
      } else if (!isLoginRequest) {
        toast.add({ title: 'Request failed', description: errorMessage(error), color: 'error' })
      }

      return Promise.reject(error)
    },
  )

  return { provide: { axios: axiosInstance } }
})
