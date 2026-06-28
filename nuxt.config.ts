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
      title: 'Welcome to AKBPA Food Voucher Portal',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'The official AKBPA Food Voucher Portal for Akwa Ibom State\'s Stable Food Relief Programme — secure, QR-coded rice, beans and garri vouchers delivered to Social Register beneficiaries across all 31 LGAs and 329 wards.' },
        { name: 'theme-color', content: '#004f34' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'AKBPA Food Voucher Portal' },
        { property: 'og:title', content: 'Welcome to AKBPA Food Voucher Portal' },
        { property: 'og:description', content: 'Secure, QR-coded food vouchers for rice, beans and garri — delivered to Social Register beneficiaries across all 31 LGAs and 329 wards of Akwa Ibom State.' },
        { property: 'og:image', content: '/images/hero-1.jpg' },
        { property: 'og:locale', content: 'en_NG' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Welcome to AKBPA Food Voucher Portal' },
        { name: 'twitter:description', content: 'Secure, QR-coded food vouchers for rice, beans and garri — delivered to Social Register beneficiaries across Akwa Ibom State.' },
        { name: 'twitter:image', content: '/images/hero-1.jpg' },
      ],
    },
  },
})
