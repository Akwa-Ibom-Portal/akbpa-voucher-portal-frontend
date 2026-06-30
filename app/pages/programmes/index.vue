<template>
  <div>
    <PageHero
      eyebrow="Our Programmes"
      title="Programmes Making a Difference"
      subtitle="AKSBPA's programmes work together to strengthen food security, support farmers, stabilize markets, and reach communities across all 31 Local Government Areas of Akwa Ibom State."
    />

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-6">
      <UCard v-for="p in programmes" :key="p.title" v-reveal class="hover-lift flex flex-col">
        <UIcon :name="p.icon" class="size-7 text-akbpaGreen-600 mb-3" />
        <p class="font-bold text-gray-900 dark:text-white text-lg">{{ p.title }}</p>
        <p class="text-sm text-gray-500 mt-2 flex-1">{{ p.desc }}</p>
        <UButton :to="p.to" variant="outline" color="primary" class="pill-btn px-5 mt-4 self-start">{{ p.cta }}</UButton>
      </UCard>
    </section>

    <section class="bg-akbpaGreen-800 text-white py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl font-bold">Don't See What You're Looking For?</h2>
        <p class="mt-3 text-white/80">Reach out and our team will point you to the right programme or service.</p>
        <UButton to="/contact" size="lg" color="secondary" class="pill-btn px-6 mt-6">Contact the Agency</UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Programmes | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Explore AKSBPA\'s food security programmes — Food Security Initiative, Farmer Partnership Programme, Market Stabilization Initiative, and Community Food Distribution.',
})

const programmes = [
  { title: 'Food Security Initiative', desc: 'Improving access to affordable food through strategic procurement and coordinated distribution, including our QR-coded food voucher scheme.', cta: 'See How It Works', to: '/how-it-works', icon: 'i-lucide-shield-check' },
  { title: 'Farmer Partnership Programme', desc: 'Connecting local farmers with government procurement opportunities while promoting increased agricultural productivity.', cta: 'Register Today', to: '/register/farmer', icon: 'i-lucide-sprout' },
  { title: 'Market Stabilization Initiative', desc: 'Supporting stable food prices through strategic interventions and market intelligence.', cta: 'Explore the Programme', to: '/market-prices', icon: 'i-lucide-line-chart' },
  { title: 'Community Food Distribution', desc: 'Working with communities to ensure equitable access to government-supported food interventions.', cta: 'Check Eligibility', to: '/eligibility', icon: 'i-lucide-users' },
]
</script>
