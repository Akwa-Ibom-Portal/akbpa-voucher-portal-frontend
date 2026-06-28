import type { AxiosInstance } from 'axios'

/** Shared axios instance provided by plugins/axios.ts. */
export function useHttp() {
  const { $axios } = useNuxtApp()
  return { http: $axios as AxiosInstance }
}
