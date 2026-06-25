import type { AxiosInstance } from 'axios'

/** Shared axios instance provided by plugins/axios.ts, plus the mock-mode flag/delay. */
export function useHttp() {
  const { $axios } = useNuxtApp()
  const config = useRuntimeConfig()
  return {
    http: $axios as AxiosInstance,
    useMock: config.public.useMockApi,
    mockDelay: config.public.mockDelay,
  }
}

export function mockDelay(ms?: number) {
  const config = useRuntimeConfig()
  return new Promise(resolve => setTimeout(resolve, ms ?? config.public.mockDelay))
}
