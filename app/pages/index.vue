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
        <div class="max-w-2xl py-16 lg:py-0 animate-pop-in">
          <UBadge variant="subtle" class="mb-4 bg-white/15 text-white ring-white/20">Akwa Ibom State Bulk Purchase Agency</UBadge>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Ensuring Food Security. Promoting Affordability. Strengthening Communities.
          </h1>
          <p class="mt-4 text-lg text-akbpaOrange-200 font-medium">Together, We Are Building a More Food-Secure Akwa Ibom.</p>
          <p class="mt-4 text-white/80 max-w-xl">
            The Akwa Ibom State Bulk Purchase Agency (AKSBPA) is committed to ensuring
            that every resident has access to affordable, quality food through strategic
            procurement, efficient distribution systems, and strong partnerships with
            farmers, suppliers, cooperatives, and communities across the State.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton to="/register/farmer" size="lg" color="neutral" class="pill-btn px-6 bg-white text-akbpaGreen-800 hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
              Register as a Farmer
            </UButton>
            <UButton to="/register/supplier" size="lg" color="secondary" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">
              Become a Supplier
            </UButton>
            <UButton to="/programmes" size="lg" variant="outline" class="pill-btn px-6 text-white ring-white/40 hover:bg-white/10 transition-transform hover:scale-105 active:scale-95">
              Learn About Our Programmes
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome message -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
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
              <img :src="item" alt="Leadership of Akwa Ibom State" class="w-full h-[380px] object-contain object-bottom mx-auto" />
            </UCarousel>
          </div>
        </div>
        <div v-reveal="100">
          <UBadge color="primary" variant="subtle" class="mb-3">Welcome</UBadge>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome to the Akwa Ibom State Bulk Purchase Agency</h2>
          <div class="mt-4 space-y-4 text-gray-600 dark:text-white/80 leading-relaxed">
            <p>Welcome to the official website of the Akwa Ibom State Bulk Purchase Agency (AKSBPA).</p>
            <p>
              Our Agency was established to improve food security, enhance access to
              essential food commodities, support local agricultural production, and
              strengthen the resilience of food supply systems across Akwa Ibom State.
            </p>
            <p>
              Through strategic bulk procurement, transparent distribution, responsible
              stock management, and collaboration with farmers, cooperatives, development
              partners, and the private sector, we are working to stabilize food prices
              while ensuring that quality food remains accessible to households across the State.
            </p>
            <p>
              This website provides citizens, farmers, suppliers, development partners, and
              other stakeholders with timely information about our programmes, services,
              procurement opportunities, and food security initiatives.
            </p>
            <p>
              We invite you to explore our services, participate in our programmes, and
              join us in building a more resilient and prosperous food system for Akwa
              Ibom State.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About the agency -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10">
        <div v-reveal>
          <UBadge color="primary" variant="subtle" class="mb-3">About the Agency</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Who We Are</h2>
          <p class="mt-4 text-gray-600 dark:text-white/80 leading-relaxed">
            The Akwa Ibom State Bulk Purchase Agency (AKSBPA) is a government agency
            dedicated to strengthening food security through strategic food procurement,
            efficient storage, responsible distribution, market intelligence, and
            partnerships that support agricultural development.
          </p>
          <p class="mt-4 text-gray-600 dark:text-white/80 leading-relaxed">
            The Agency works with farmers, cooperatives, suppliers, processors,
            transporters, and relevant public institutions to improve food availability,
            reduce price volatility, and ensure that government food intervention
            programmes are implemented transparently and efficiently.
          </p>
          <UButton to="/about" variant="outline" color="primary" class="pill-btn px-5 mt-6">Read Our Full Story</UButton>
        </div>
        <div v-reveal="100">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Our Mandate</h3>
          <ul class="space-y-3">
            <li v-for="m in mandate" :key="m" class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 mt-0.5 shrink-0" />
              <span class="text-sm text-gray-600 dark:text-white/80">{{ m }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Our impact -->
    <section ref="statsSectionEl" class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="text-center mb-10">
        <UBadge color="secondary" variant="subtle" class="mb-3">Our Impact</UBadge>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Delivering Results That Matter</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div
          v-for="(s, i) in statStrip" :key="s.label"
          v-reveal="i * 80"
          class="hover-lift rounded-2xl p-6 text-center" :class="statBg(i)"
        >
          <p class="text-2xl sm:text-3xl font-bold text-gray-800">{{ (displayedStats[i] ?? 0).toLocaleString() }}{{ s.suffix }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ s.label }}</p>
        </div>
      </div>
      <p class="text-xs text-gray-400 text-center mt-6">
        Figures shown above are illustrative placeholders and should be updated with verified operational data.
      </p>
    </section>

    <!-- Core services -->
    <section id="services" class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div v-reveal class="text-center mb-10">
          <UBadge color="primary" variant="subtle" class="mb-3">Our Core Services</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Serving Citizens Through Strategic Food Security Initiatives</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <UCard v-for="(s, i) in services" :key="s.title" v-reveal="(i % 3) * 100" class="hover-lift">
            <UIcon :name="s.icon" class="size-7 text-akbpaGreen-600 mb-3" />
            <p class="font-semibold text-gray-900 dark:text-white">{{ s.title }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ s.desc }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Featured programmes -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="text-center mb-10">
        <UBadge color="secondary" variant="subtle" class="mb-3">Featured Programmes</UBadge>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Programmes Making a Difference</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <UCard v-for="(p, i) in programmes" :key="p.title" v-reveal="i * 100" class="hover-lift flex flex-col">
          <p class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</p>
          <p class="text-sm text-gray-500 mt-2 flex-1">{{ p.desc }}</p>
          <UButton :to="p.to" variant="link" color="primary" class="px-0 mt-3 justify-start">{{ p.cta }} →</UButton>
        </UCard>
      </div>
    </section>

    <!-- Why choose AKSBPA -->
    <section class="bg-akbpaGreen-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 v-reveal class="text-2xl font-bold text-center mb-10">Why Choose AKSBPA?</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div v-for="(w, i) in whyChoose" :key="w.title" v-reveal="i * 80" class="text-center">
            <div class="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
              <UIcon :name="w.icon" class="size-6 text-akbpaOrange-300" />
            </div>
            <p class="font-semibold">{{ w.title }}</p>
            <p class="text-sm text-white/70 mt-1">{{ w.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <UBadge color="secondary" variant="subtle" class="mb-3">Gallery</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">AKSBPA in Action</h2>
          <p class="text-gray-500 mt-2 max-w-xl">Photos from our food distribution exercises, procurement operations, and community engagements.</p>
        </div>
        <UButton to="/gallery" variant="outline" color="primary" class="pill-btn px-5">View Full Gallery</UButton>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NuxtLink v-for="(img, i) in galleryPreview" :key="img.src" to="/gallery" v-reveal="(i % 4) * 80" class="block hover-lift rounded-xl overflow-hidden aspect-square">
          <img :src="img.src" :alt="img.alt" loading="lazy" class="w-full h-full object-cover" />
        </NuxtLink>
      </div>
    </section>

    <!-- Latest news -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <UBadge color="primary" variant="subtle" class="mb-3">Latest News</UBadge>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Stay Informed</h2>
          <p class="text-gray-500 mt-2 max-w-xl">
            Keep up with the latest announcements, programme launches, procurement
            notices, stakeholder engagements, policy updates, and community outreach activities.
          </p>
        </div>
        <UButton to="/news" variant="outline" color="primary" class="pill-btn px-5">View All News</UButton>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink v-for="(n, i) in news" :key="n" to="/news" v-reveal="(i % 3) * 100">
          <UCard class="hover-lift h-full">
            <UIcon name="i-lucide-newspaper" class="size-6 text-akbpaOrange-500 mb-3" />
            <p class="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{{ n }}</p>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <!-- Quick links -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 v-reveal class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">Quick Links</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <NuxtLink
            v-for="(l, i) in quickLinks" :key="l.label" :to="l.to" v-reveal="(i % 5) * 60"
            class="hover-lift flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-akbpaGreen-700 dark:hover:text-akbpaGreen-400"
          >
            <UIcon name="i-lucide-arrow-right" class="size-4 text-akbpaGreen-600 shrink-0" />
            {{ l.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Partners -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
      <UBadge color="secondary" variant="subtle" class="mb-3">Partners</UBadge>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Working Together for Food Security</h2>
      <p class="text-gray-500 mt-2 max-w-2xl mx-auto">AKSBPA collaborates with:</p>
      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <UBadge v-for="p in partners" :key="p" variant="subtle" color="neutral" size="lg" class="px-4 py-2">{{ p }}</UBadge>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 v-reveal class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">What People Are Saying</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <UCard v-for="(t, i) in testimonials" :key="t.role" v-reveal="i * 100" class="hover-lift">
            <p class="text-xs font-semibold text-akbpaOrange-600 uppercase tracking-wide">{{ t.role }}</p>
            <p class="mt-3 text-gray-600 dark:text-white/80 text-sm leading-relaxed">
              <span class="text-2xl text-akbpaGreen-300 leading-none align-top">&ldquo;</span>{{ t.quote }}
            </p>
            <p class="mt-3 text-sm text-gray-400">— {{ t.attribution }}</p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- FAQ teaser -->
    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div v-reveal class="text-center mb-10">
        <UBadge color="primary" variant="subtle" class="mb-3">FAQs</UBadge>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      </div>
      <UAccordion
        :items="faqTeasers"
        :ui="{
          item: 'border border-gray-200 dark:border-gray-800 rounded-xl px-4 sm:px-5 bg-white dark:bg-gray-900 mb-3',
          trigger: 'py-4 text-sm font-semibold text-gray-900 dark:text-white',
          leadingIcon: 'text-akbpaOrange-500 size-5',
          trailingIcon: 'text-akbpaGreen-600 size-5',
          body: 'text-sm text-gray-600 dark:text-gray-300 leading-relaxed pb-4',
        }"
      />
      <div class="text-center mt-6">
        <UButton to="/faq" variant="outline" color="primary" class="pill-btn px-6">View All FAQs</UButton>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-akbpaGreen-800 text-white py-16">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl font-bold">Stay Updated</h2>
        <p class="mt-3 text-white/80">
          Subscribe to receive updates on programmes, procurement notices, food security
          initiatives, market reports, and important announcements.
        </p>
        <form class="mt-6 flex flex-col sm:flex-row gap-3 justify-center" @submit.prevent="onSubscribe">
          <UInput v-model="newsletterEmail" type="email" placeholder="Email Address" size="lg" class="w-full sm:w-80" required />
          <UButton type="submit" size="lg" color="secondary" class="pill-btn px-6" :loading="subscribing">Subscribe</UButton>
        </form>
      </div>
    </section>

    <!-- Final CTA -->
    <section v-reveal class="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Join Us in Building a Food-Secure Akwa Ibom</h2>
      <p class="text-gray-500 mt-3 max-w-2xl mx-auto">
        Whether you are a farmer, supplier, cooperative, development partner, or citizen,
        your participation contributes to a stronger, more resilient food system. Explore
        our services, participate in our programmes, and stay informed about opportunities
        that support food security and sustainable development across Akwa Ibom State.
      </p>
      <div class="mt-6 flex justify-center flex-wrap gap-3">
        <UButton to="/register/farmer" size="lg" color="secondary" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">Register Today</UButton>
        <UButton to="/contact" size="lg" variant="outline" class="pill-btn px-6 transition-transform hover:scale-105 active:scale-95">Contact the Agency</UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

import { galleryImages } from '~/data/gallery'
import { submitInquiry } from '~/services/submissionsApi'

const galleryPreview = galleryImages.slice(0, 8)

useSeoMeta({
  title: 'Akwa Ibom State Bulk Purchase Agency (AKSBPA) | Food Security, Affordable Food & Transparent Procurement',
  description: 'Official website of the Akwa Ibom State Bulk Purchase Agency (AKSBPA). Learn about our food security programmes, bulk procurement initiatives, farmer partnerships, food voucher schemes, market stabilization efforts, and public services.',
  keywords: 'Akwa Ibom State Bulk Purchase Agency, AKSBPA, Food Security, Bulk Food Procurement, Affordable Food, Food Voucher, Farmer Support, Market Stabilization, Government Procurement, Akwa Ibom State',
  ogTitle: 'Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  ogDescription: 'Food security, affordable food and transparent procurement for Akwa Ibom State — bulk procurement, farmer partnerships, food vouchers, and market stabilization.',
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
        name: 'Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
        alternateName: 'AKSBPA',
        url: 'https://aksbpa.gov.ng',
        logo: '/images/akwa-ibom-logo.jpeg',
        description: 'Promotes food security, supports local agriculture, ensures transparent procurement, and improves access to affordable food across Akwa Ibom State.',
        areaServed: { '@type': 'State', name: 'Akwa Ibom State' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Elegance Place, Plot 46 Unit B, Ewet Housing Estate',
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

const mandate = [
  'Strengthening food security across Akwa Ibom State',
  'Procuring food commodities through transparent processes',
  'Supporting local farmers and agricultural value chains',
  'Managing strategic food reserves',
  'Promoting stable market prices',
  'Coordinating food distribution initiatives',
  'Administering approved food support programmes',
  'Encouraging public-private partnerships within the agricultural sector',
]

const services = [
  { title: 'Bulk Food Procurement', desc: 'We procure staple food commodities through transparent and competitive processes to ensure value for public resources while maintaining quality standards.', icon: 'i-lucide-shopping-cart' },
  { title: 'Food Distribution', desc: 'Efficient distribution systems help ensure that approved food intervention programmes reach intended beneficiaries across all Local Government Areas.', icon: 'i-lucide-truck' },
  { title: 'Food Voucher Administration', desc: 'We administer structured food voucher programmes designed to improve access to affordable food for eligible beneficiaries while promoting accountability and transparency.', icon: 'i-lucide-qr-code' },
  { title: 'Farmer Partnerships', desc: 'We support local farmers by providing opportunities to participate in government procurement programmes, strengthening agricultural production and local economic growth.', icon: 'i-lucide-sprout' },
  { title: 'Market Price Monitoring', desc: 'Continuous monitoring of food markets enables the Agency to track price trends, identify supply challenges, and inform timely interventions.', icon: 'i-lucide-line-chart' },
  { title: 'Strategic Food Reserves', desc: 'The Agency manages strategic food reserves to enhance preparedness and improve response during periods of supply disruption or emergencies.', icon: 'i-lucide-warehouse' },
]

const programmes = [
  { title: 'Food Security Initiative', desc: 'Improving access to affordable food through strategic procurement and coordinated distribution.', cta: 'Learn More', to: '/how-it-works' },
  { title: 'Farmer Partnership Programme', desc: 'Connecting local farmers with government procurement opportunities while promoting increased agricultural productivity.', cta: 'Register Today', to: '/register/farmer' },
  { title: 'Market Stabilization Initiative', desc: 'Supporting stable food prices through strategic interventions and market intelligence.', cta: 'Explore the Programme', to: '/market-prices' },
  { title: 'Community Food Distribution', desc: 'Working with communities to ensure equitable access to government-supported food interventions.', cta: 'Find Out More', to: '/eligibility' },
]

const whyChoose = [
  { title: 'Transparency', desc: 'Every procurement and distribution process is guided by accountability, fairness, and compliance with applicable laws and regulations.', icon: 'i-lucide-eye' },
  { title: 'Service Excellence', desc: 'We strive to deliver responsive, efficient, and citizen-focused services that meet the needs of our stakeholders.', icon: 'i-lucide-award' },
  { title: 'Community Partnership', desc: 'We work collaboratively with farmers, cooperatives, civil society organizations, development partners, and the private sector.', icon: 'i-lucide-heart-handshake' },
  { title: 'Innovation', desc: 'We leverage technology and data-driven decision-making to improve operational efficiency and service delivery.', icon: 'i-lucide-lightbulb' },
  { title: 'Sustainability', desc: 'We promote long-term food security through responsible planning, strategic partnerships, and support for local agricultural production.', icon: 'i-lucide-leaf' },
]

const news = [
  'Agency Launches New Farmer Registration Drive',
  'Food Price Monitoring Report Released',
  'Strategic Partnership with Agricultural Cooperatives',
  'Procurement Opportunities Now Open',
  'Community Food Distribution Programme Expanded',
]

const quickLinks = [
  { label: 'Register as a Farmer', to: '/register/farmer' },
  { label: 'Register as a Supplier', to: '/register/supplier' },
  { label: 'Procurement Opportunities', to: '/procurement' },
  { label: 'Food Voucher Information', to: '/how-it-works' },
  { label: 'Redemption Centres', to: '/redemption-centres' },
  { label: 'Market Price Updates', to: '/market-prices' },
  { label: 'Downloads', to: '/resources' },
  { label: 'Frequently Asked Questions', to: '/faq' },
  { label: 'Report an Issue', to: '/report-issue' },
  { label: 'Contact Us', to: '/contact' },
]

const partners = [
  'Federal and State Government MDAs',
  'Agricultural Cooperatives',
  'Farmer Associations',
  'Development Partners',
  'Financial Institutions',
  'Commodity Associations',
  'Food Processors',
  'Logistics Providers',
  'Civil Society Organizations',
  'Community Leaders',
]

const testimonials = [
  { role: 'Farmer', quote: "Participating in the Agency's procurement programme has expanded market opportunities for our cooperative and strengthened our production capacity.", attribution: 'Registered Farmer, Akwa Ibom State' },
  { role: 'Food Supplier', quote: 'The registration and procurement process was transparent and professionally managed. Communication throughout the process was clear and timely.', attribution: 'Accredited Food Supplier' },
  { role: 'Community Representative', quote: 'Our community benefited greatly from the food distribution initiative. The process was well coordinated and reached deserving households efficiently.', attribution: 'Community Leader' },
]

const faqTeasers = [
  { icon: 'i-lucide-circle-help', label: 'Who can register with the Agency?', content: "Eligible farmers, cooperatives, suppliers, processors, and approved organizations may register through the Agency's registration portal." },
  { icon: 'i-lucide-circle-help', label: 'How do I become a government supplier?', content: "Complete the supplier registration process, submit the required documentation, and meet the Agency's accreditation requirements." },
  { icon: 'i-lucide-circle-help', label: 'Where are food redemption centres located?', content: 'Our Redemption Centre Locator provides information on approved centres across the State.' },
  { icon: 'i-lucide-circle-help', label: 'How can I report a complaint?', content: 'Complaints may be submitted through our online complaint portal, email, telephone, or by visiting our office.' },
  { icon: 'i-lucide-circle-help', label: 'Where can I access procurement opportunities?', content: 'Current procurement opportunities are published in the Procurement section of this website.' },
]

const statStrip = [
  { label: 'Farmers and Agricultural Partners Engaged', target: 24000, suffix: '+' },
  { label: 'Local Government Areas Covered', target: 31, suffix: '' },
  { label: 'Registered Food Suppliers', target: 150, suffix: '+' },
  { label: 'Strategic Distribution Centres', target: 50, suffix: '+' },
  { label: 'Households Reached Through Food Support', target: 120000, suffix: '+' },
  { label: 'Days of Continuous Market Monitoring', target: 365, suffix: '' },
]

const statBgs = ['bg-amber-50', 'bg-akbpaGreen-50', 'bg-orange-50', 'bg-emerald-50', 'bg-akbpaGreen-50', 'bg-amber-50']
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

const toast = useToast()
const newsletterEmail = ref('')
const subscribing = ref(false)

async function onSubscribe() {
  subscribing.value = true
  try {
    await submitInquiry({ type: 'newsletter_subscription', email: newsletterEmail.value })
    newsletterEmail.value = ''
    toast.add({ title: "You're on the list", description: "Thanks for subscribing — we'll keep you posted.", color: 'success' })
  } catch (e: any) {
    toast.add({ title: 'Could not subscribe right now', description: e.response?.data?.message ?? 'Please try again shortly.', color: 'error' })
  } finally {
    subscribing.value = false
  }
}
</script>
