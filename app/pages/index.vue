<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-akbpaGreen-700 via-akbpaGreen-800 to-akbpaGreen-900 text-white">
      <img
        src="/images/akwa-ibom-logo.jpeg"
        alt=""
        class="pointer-events-none select-none absolute -left-24 -top-24 h-[480px] w-[480px] opacity-[0.07]"
      />
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-0 grid lg:grid-cols-2 gap-8 items-center">
        <div class="relative z-10 py-6 lg:py-20">
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
            <UButton to="/login" size="lg" color="neutral" class="pill-btn px-6 bg-white text-akbpaGreen-800 hover:bg-white/90">
              Existing User? Login
            </UButton>
            <UButton to="/how-it-works" size="lg" color="secondary" class="pill-btn px-6">
              See How It Works
            </UButton>
          </div>
          <div class="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div v-for="item in items" :key="item.name" class="bg-white/10 ring-1 ring-white/15 rounded-xl p-3 text-center backdrop-blur-sm">
              <p class="text-2xl">{{ item.emoji }}</p>
              <p class="text-xs font-semibold mt-1">{{ item.name }}</p>
              <p class="text-[11px] text-white/60">{{ item.size }}</p>
            </div>
          </div>
        </div>

        <div class="relative z-10 flex justify-center lg:justify-end">
          <UCarousel
            v-slot="{ item }"
            :items="governorImages"
            :autoplay="{ delay: 4500 }"
            dots
            loop
            class="w-full max-w-sm"
            :ui="{ dot: 'bg-white/30 data-[state=active]:bg-white' }"
          >
            <img :src="item" alt="Governor of Akwa Ibom State" class="w-full h-[340px] sm:h-[420px] lg:h-[480px] object-contain mx-auto" />
          </UCarousel>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 -mt-1 py-10">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="(s, i) in statStrip" :key="s.label" class="rounded-2xl p-6 text-center" :class="statBg(i)">
          <p class="text-3xl font-bold text-gray-800">{{ s.value }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Quick steps preview -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">From Registration to Redemption</h2>
          <p class="text-gray-500 mt-2 max-w-xl">A quick look at how a voucher moves through the programme.</p>
        </div>
        <UButton to="/how-it-works" variant="outline" color="primary" class="pill-btn px-5">See full process</UButton>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <UCard v-for="(s, i) in quickSteps" :key="s.title">
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
        <div>
          <div class="bg-akbpaGreen-700 rounded-3xl overflow-hidden">
            <img src="/images/governor-image-2.webp" alt="Governor of Akwa Ibom State" class="w-full h-[420px] object-contain object-bottom mx-auto" />
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
          <UCard class="bg-white dark:bg-white/5 shadow-sm">
            <UIcon name="i-lucide-users" class="size-7 text-akbpaGreen-600 mb-3" />
            <p class="font-bold text-gray-900 dark:text-white">Reaching Every Household</p>
            <p class="text-sm text-gray-500 mt-2">
              Delivering rice, beans and garri directly to Social Register
              beneficiaries across all 31 LGAs and 329 wards of the state.
            </p>
          </UCard>
          <UCard class="bg-akbpaGreen-800 text-white border-none">
            <UIcon name="i-lucide-qr-code" class="size-7 text-akbpaGreen-200 mb-3" />
            <p class="font-bold">Tech-Driven Distribution</p>
            <p class="text-sm text-white/75 mt-2">
              QR-coded vouchers track every stage — generation, allocation,
              issuance and redemption — in real time.
            </p>
          </UCard>
          <UCard class="bg-akbpaGreen-800 text-white border-none">
            <UIcon name="i-lucide-heart-handshake" class="size-7 text-akbpaGreen-200 mb-3" />
            <p class="font-bold">Standing With Akwa Ibom Families</p>
            <p class="text-sm text-white/75 mt-2">
              It is the desire of the Governor that no eligible household on
              the Social Register is left behind in this relief programme.
            </p>
          </UCard>
          <UCard class="bg-white dark:bg-white/5 shadow-sm">
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
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Built on Non-Negotiable Security Rules</h2>
      <p class="text-center text-gray-500 mt-2 max-w-2xl mx-auto">
        Every voucher in this programme is governed by core principles set out in the AKBPA developer guide.
      </p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <UCard v-for="p in principles" :key="p.title">
          <UIcon :name="p.icon" class="size-7 text-akbpaGreen-600 mb-3" />
          <p class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ p.desc }}</p>
        </UCard>
      </div>
    </section>

    <!-- Roles strip -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Who Uses the Portal</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <UCard v-for="r in USER_ROLES" :key="r.value">
            <p class="font-semibold text-gray-900 dark:text-white">{{ r.label }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ r.description }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ready to check your eligibility?</h2>
      <p class="text-gray-500 mt-2">Find out if you're on the Social Register and how to redeem your voucher.</p>
      <div class="mt-6 flex justify-center gap-3">
        <UButton to="/eligibility" size="lg" color="secondary" class="pill-btn px-6">Check Eligibility</UButton>
        <UButton to="/faq" size="lg" variant="outline" class="pill-btn px-6">Read the FAQs</UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/types'

definePageMeta({ layout: 'public' })

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
  { label: 'LGAs Covered', value: '31' },
  { label: 'Wards Reached', value: '329' },
  { label: 'On Social Register', value: '25,440+' },
  { label: 'Food Items', value: '3' },
]

const statBgs = ['bg-amber-50', 'bg-akbpaGreen-50', 'bg-orange-50', 'bg-emerald-50']
function statBg(i: number) {
  return statBgs[i % statBgs.length]
}
</script>
