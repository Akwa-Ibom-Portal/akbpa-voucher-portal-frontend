// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      apiTimeout: Number(process.env.NUXT_PUBLIC_API_TIMEOUT || 15000),
      useMockApi: process.env.NUXT_PUBLIC_USE_MOCK_API !== 'false',
      mockDelay: Number(process.env.NUXT_PUBLIC_MOCK_DELAY || 350),
    },
  },

  app: {
    head: {
      title: 'AKBPA Food Voucher Portal',
      meta: [
        { name: 'description', content: 'Akwa Ibom Bulk Purchase Agency — Food Voucher Administration Portal for the Social Register food relief programme.' },
      ],
    },
  },
})
