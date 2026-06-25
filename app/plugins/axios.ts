import axios from 'axios'

/**
 * Single shared axios instance for the whole app. Auth token is read straight
 * from localStorage (not the Pinia store) to avoid a circular import between
 * this plugin and stores/auth.ts. A 401 clears the session and bounces to login.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: config.public.apiTimeout,
    headers: { 'Content-Type': 'application/json' },
  })

  axiosInstance.interceptors.request.use((req) => {
    if (process.client) {
      const token = localStorage.getItem('akbpa_token')
      if (token) req.headers.Authorization = `Bearer ${token}`
    }
    return req
  })

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401 && process.client) {
        localStorage.removeItem('akbpa_token')
        localStorage.removeItem('akbpa_user')
        navigateTo('/login')
      }
      return Promise.reject(error)
    },
  )

  return { provide: { axios: axiosInstance } }
})
