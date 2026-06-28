<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden text-white min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center">
      <!-- Background photo carousel -->
      <UCarousel
        v-slot="{ item }"
        :items="heroBackgrounds"
        :autoplay="{ delay: 5500 }"
        fade
        loop
        class="absolute inset-0 z-0"
        :ui="{ root: 'h-full', viewport: 'h-full', container: 'h-full', item: 'h-full' }"
      >
        <img :src="item" alt="" class="w-full h-full object-cover" />
      </UCarousel>
      <div class="absolute inset-0 z-[1] bg-gradient-to-r from-akbpaGreen-900/95 via-akbpaGreen-900/80 to-akbpaGreen-900/50" />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div class="max-w-xl py-16 lg:py-0 animate-pop-in">
          <UBadge variant="subtle" class="mb-4 bg-white/15 text-white ring-white/20">2026 Stable Food Relief Cycle</UBadge>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Food Voucher Administration Portal
          </h1>
          <p class="mt-5 text-lg text-white/80 max-w-lg">
            Secure, QR-coded food vouchers for rice, beans and garri — delivered to
            Social Register beneficiaries across all 31 LGAs and 329 wards of
            Akwa Ibom State.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton to="/login" size="lg" color="neutral" class="pill-btn px-6 bg-white text-akbpaGreen-800 hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
              Existing User? Login
            </UButton>
            <UButton to="/how-it-works" size="lg" color="secondary" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">
              See How It Works
            </UButton>
          </div>
          <div class="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div
              v-for="(item, i) in items" :key="item.name"
              class="hover-lift bg-white/10 ring-1 ring-white/15 rounded-xl p-3 text-center backdrop-blur-sm"
            >
              <p class="text-2xl animate-float" :style="{ animationDelay: `${i * 0.3}s` }">{{ item.emoji }}</p>
              <p class="text-xs font-semibold mt-1">{{ item.name }}</p>
              <p class="text-[11px] text-white/60">{{ item.size }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <section ref="statsSectionEl" class="max-w-7xl mx-auto px-4 sm:px-6 -mt-1 py-10">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="(s, i) in statStrip" :key="s.label"
          v-reveal="i * 80"
          class="hover-lift rounded-2xl p-6 text-center" :class="statBg(i)"
        >
          <p class="text-3xl font-bold text-gray-800">{{ (displayedStats[i] ?? 0).toLocaleString() }}{{ s.suffix }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Quick steps preview -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">From Registration to Redemption</h2>
          <p class="text-gray-500 mt-2 max-w-xl">A quick look at how a voucher moves through the programme.</p>
        </div>
        <UButton to="/how-it-works" variant="outline" color="primary" class="pill-btn px-5 transition-transform hover:scale-105 active:scale-95">See full process</UButton>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <UCard v-for="(s, i) in quickSteps" :key="s.title" v-reveal="i * 100" class="hover-lift">
          <div class="h-9 w-9 rounded-full bg-akbpaGreen-100 dark:bg-akbpaGreen-900 text-akbpaGreen-700 dark:text-akbpaGreen-300 flex items-center justify-center font-semibold text-sm mb-3">
            {{ i + 1 }}
          </div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ s.title }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ s.desc }}</p>
        </UCard>
      </div>
    </section>

    <!-- Leadership message -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div v-reveal>
          <div class="bg-akbpaGreen-700 rounded-3xl overflow-hidden">
            <UCarousel
              v-slot="{ item }"
              :items="governorImages"
              :autoplay="{ delay: 4500 }"
              fade
              loop
              class="w-full"
            >
              <img :src="item" alt="Governor of Akwa Ibom State" class="w-full h-[420px] object-contain object-bottom mx-auto" />
            </UCarousel>
          </div>
          <h3 class="mt-5 text-xl font-bold text-gray-900 dark:text-white">Pastor Umo Eno</h3>
          <p class="text-gray-500">Executive Governor of Akwa Ibom State</p>
          <p class="mt-4 text-gray-600 dark:text-white/80 leading-relaxed">
            <span class="text-3xl text-akbpaGreen-300 leading-none align-top">&ldquo;</span>
            We are committed to ensuring that <strong>every grain of rice, every bag of
            beans and garri</strong> reaches the families who need it most — delivered
            transparently, accountably, and without delay.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <UCard v-reveal="0" class="hover-lift bg-white dark:bg-white/5 shadow-sm">
            <UIcon name="i-lucide-users" class="size-7 text-akbpaGreen-600 mb-3" />
            <p class="font-bold text-gray-900 dark:text-white">Reaching Every Household</p>
            <p class="text-sm text-gray-500 mt-2">
              Delivering rice, beans and garri directly to Social Register
              beneficiaries across all 31 LGAs and 329 wards of the state.
            </p>
          </UCard>
          <UCard v-reveal="100" class="hover-lift bg-akbpaGreen-800 text-white border-none">
            <UIcon name="i-lucide-qr-code" class="size-7 text-akbpaGreen-200 mb-3" />
            <p class="font-bold">Tech-Driven Distribution</p>
            <p class="text-sm text-white/75 mt-2">
              QR-coded vouchers track every stage — generation, allocation,
              issuance and redemption — in real time.
            </p>
          </UCard>
          <UCard v-reveal="200" class="hover-lift bg-akbpaGreen-800 text-white border-none">
            <UIcon name="i-lucide-heart-handshake" class="size-7 text-akbpaGreen-200 mb-3" />
            <p class="font-bold">Standing With Akwa Ibom Families</p>
            <p class="text-sm text-white/75 mt-2">
              It is the desire of the Governor that no eligible household on
              the Social Register is left behind in this relief programme.
            </p>
          </UCard>
          <UCard v-reveal="300" class="hover-lift bg-white dark:bg-white/5 shadow-sm">
            <UIcon name="i-lucide-shield-check" class="size-7 text-akbpaGreen-600 mb-3" />
            <p class="font-bold text-gray-900 dark:text-white">Transparent, Auditable Access</p>
            <p class="text-sm text-gray-500 mt-2">
              Every redemption is logged and auditable, ensuring fair and
              accountable distribution of relief to the people it's meant for.
            </p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Core principles -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Built on Non-Negotiable Security Rules</h2>
        <p class="text-gray-500 mt-2 max-w-2xl mx-auto">
          Every voucher in this programme is governed by core principles set out in the AKBPA developer guide.
        </p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <UCard v-for="(p, i) in principles" :key="p.title" v-reveal="i * 100" class="hover-lift">
          <UIcon :name="p.icon" class="size-7 text-akbpaGreen-600 mb-3" />
          <p class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ p.desc }}</p>
        </UCard>
      </div>
    </section>

    <!-- Roles strip -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 v-reveal class="text-2xl font-bold text-gray-900 dark:text-white text-center">Who Uses the Portal</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <UCard v-for="(r, i) in USER_ROLES" :key="r.value" v-reveal="(i % 3) * 100" class="hover-lift">
            <p class="font-semibold text-gray-900 dark:text-white">{{ r.label }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ r.description }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <section v-reveal class="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ready to check your eligibility?</h2>
      <p class="text-gray-500 mt-2">Find out if you're on the Social Register and how to redeem your voucher.</p>
      <div class="mt-6 flex justify-center gap-3">
        <UButton to="/eligibility" size="lg" color="secondary" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">Check Eligibility</UButton>
        <UButton to="/faq" size="lg" variant="outline" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">Read the FAQs</UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/types'

definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Welcome to AKBPA Food Voucher Portal',
  description: 'The official AKBPA Food Voucher Portal for Akwa Ibom State\'s Stable Food Relief Programme — secure, QR-coded rice, beans and garri vouchers delivered to Social Register beneficiaries across all 31 LGAs and 329 wards.',
  ogTitle: 'Welcome to AKBPA Food Voucher Portal',
  ogDescription: 'Secure, QR-coded food vouchers for rice, beans and garri — delivered to Social Register beneficiaries across all 31 LGAs and 329 wards of Akwa Ibom State.',
  ogImage: '/images/hero-1.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GovernmentOrganization',
        name: 'Akwa Ibom Bulk Purchase Agency (AKBPA)',
        alternateName: 'AKBPA Food Voucher Portal',
        url: 'https://akbpa.gov.ng',
        logo: '/images/akwa-ibom-logo.jpeg',
        description: 'Administers the Stable Food Relief Programme, issuing secure QR-coded food vouchers to Social Register beneficiaries across Akwa Ibom State.',
        areaServed: { '@type': 'State', name: 'Akwa Ibom State' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Uyo',
          addressRegion: 'Akwa Ibom State',
          addressCountry: 'NG',
        },
      }),
    },
  ],
})

const heroBackgrounds: string[] = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
  '/images/hero-4.jpeg',
]

const governorImages: string[] = [
  '/images/governor-image-1.webp',
  '/images/governor-image-2.webp',
  '/images/governor-image-3.webp',
]

const items = [
  { name: 'Rice', size: '5kg bag', emoji: '🍚' },
  { name: 'Beans', size: '5kg bag', emoji: '🫘' },
  { name: 'Garri', size: '5kg bag', emoji: '🌾' },
]

const quickSteps = [
  { title: 'Register', desc: 'Beneficiaries are captured on the Social Register at LGA and ward level.' },
  { title: 'Generate', desc: 'Secure, hashed QR vouchers are generated for rice, beans or garri.' },
  { title: 'Issue', desc: 'A Ward PA or field officer issues a voucher to a verified beneficiary.' },
  { title: 'Redeem', desc: 'The voucher is scanned and locked for good at a collection point.' },
]

const principles = [
  { title: 'Full Lifecycle Control', desc: 'Every voucher is tracked from generation to allocation, issuance, redemption, expiry and audit.', icon: 'i-lucide-git-branch' },
  { title: 'Secure QR Hashing', desc: 'QR codes carry hashed, random tokens — never plain database IDs.', icon: 'i-lucide-shield-check' },
  { title: 'One Item, One Code', desc: 'Every QR code is linked to exactly one item type and a unique serial number.', icon: 'i-lucide-tag' },
  { title: 'Single-Use, Always', desc: 'Once redeemed, a voucher is permanently locked against reuse.', icon: 'i-lucide-lock' },
]

const statStrip = [
  { label: 'LGAs Covered', target: 31, suffix: '' },
  { label: 'Wards Reached', target: 329, suffix: '' },
  { label: 'On Social Register', target: 25440, suffix: '+' },
  { label: 'Food Items', target: 3, suffix: '' },
]

const statBgs = ['bg-amber-50', 'bg-akbpaGreen-50', 'bg-orange-50', 'bg-emerald-50']
function statBg(i: number) {
  return statBgs[i % statBgs.length]
}

// Counts the stat strip up from 0 once it scrolls into view, instead of just appearing.
const displayedStats = ref(statStrip.map(() => 0))
const statsSectionEl = ref<HTMLElement | null>(null)
let statsAnimated = false

function animateStats() {
  if (statsAnimated) return
  statsAnimated = true
  const duration = 1200
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayedStats.value = statStrip.map(s => Math.round(s.target * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayedStats.value = statStrip.map(s => s.target)
    return
  }
  const { stop } = useIntersectionObserver(statsSectionEl, ([entry]) => {
    if (entry?.isIntersecting) {
      animateStats()
      stop()
    }
  }, { threshold: 0.3 })
})
</script>
