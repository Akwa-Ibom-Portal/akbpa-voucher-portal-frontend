<template>
  <div>
    <PageHero
      eyebrow="Governance"
      title="Board of Directors"
      subtitle="The Akwa Ibom State Bulk Purchase Agency is governed by a Board inaugurated by His Excellency, Governor Umo Eno, tasked with ensuring transparency, accountability, and the effective administration of the ARISE Food Security Programme."
    />

    <!-- Inauguration context -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <UCard class="bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
        <div class="flex items-start gap-4">
          <UIcon name="i-lucide-quote" class="size-8 text-akbpaGreen-400 shrink-0 mt-1" />
          <div class="space-y-3 text-sm text-gray-600 dark:text-white/80 leading-relaxed">
            <p>
              "This Board is tasked with the onerous responsibility of administering our ARISE Food Security
              Programme. This is our bold and compassionate intervention at this critical moment when the
              prices of our staple food items such as rice, beans and garri have soared beyond the immediate
              reach of the poor and most vulnerable."
            </p>
            <p class="font-semibold text-akbpaGreen-700 dark:text-akbpaGreen-400">
              — His Excellency, Pastor Umo Eno, Governor of Akwa Ibom State
            </p>
          </div>
        </div>
      </UCard>
    </section>

    <!-- Leadership -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
      <UBadge color="primary" variant="subtle" class="mb-3">Leadership</UBadge>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Board Leadership</h2>
      <div class="grid sm:grid-cols-2 gap-5">
        <UCard v-for="l in leadership" :key="l.name" v-reveal class="hover-lift flex items-start gap-5">
          <div class="h-16 w-16 rounded-full bg-akbpaGreen-100 dark:bg-akbpaGreen-900 flex items-center justify-center shrink-0">
            <span class="text-xl font-bold text-akbpaGreen-700 dark:text-akbpaGreen-300">{{ initials(l.name) }}</span>
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white">{{ l.name }}</p>
            <p class="text-sm text-akbpaOrange-600 font-semibold mt-0.5">{{ l.position }}</p>
            <p v-if="l.note" class="text-xs text-gray-500 mt-1">{{ l.note }}</p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Members -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <UBadge color="secondary" variant="subtle" class="mb-3">Members</UBadge>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Board Members</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <UCard v-for="(m, i) in members" :key="m.name" v-reveal="(i % 3) * 80" class="hover-lift flex items-start gap-4">
          <div class="h-12 w-12 rounded-full flex items-center justify-center shrink-0" :class="memberBg(i)">
            <span class="text-sm font-bold text-akbpaGreen-700">{{ initials(m.name) }}</span>
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ m.name }}</p>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug">{{ m.role }}</p>
            <UBadge v-if="m.represents" color="neutral" variant="subtle" size="xs" class="mt-2">{{ m.represents }}</UBadge>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Mandate from inauguration -->
    <section class="bg-gray-50 dark:bg-gray-900 py-14">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <UBadge color="primary" variant="subtle" class="mb-3">Board Mandate</UBadge>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-5">What the Board Is Charged With</h2>
        <ul class="grid sm:grid-cols-2 gap-3">
          <li v-for="c in charges" :key="c" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
            <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 mt-0.5 shrink-0" />
            {{ c }}
          </li>
        </ul>
      </div>
    </section>

    <!-- CTA -->
    <section v-reveal class="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Learn More About the Agency</h2>
      <div class="flex justify-center gap-3 mt-5 flex-wrap">
        <UButton to="/about" color="primary" class="pill-btn px-6">About AKSBPA</UButton>
        <UButton to="/programmes" variant="outline" color="primary" class="pill-btn px-6">Our Programmes</UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Board of Directors | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Meet the Board of Directors of the Akwa Ibom State Bulk Purchase Agency (AKSBPA), inaugurated by Governor Umo Eno to oversee the ARISE Food Security Programme.',
})

const leadership = [
  {
    name: 'Rt. Hon. Dan Akpan',
    position: 'Chairman',
    note: 'Appointed by His Excellency Governor Umo Eno',
  },
  {
    name: 'Hon. Unyime Etim',
    position: 'General Manager / Secretary',
    note: '',
  },
]

const members = [
  { name: 'Commissioner, Ministry of Economic Development', role: 'Ministry Representative', represents: 'Economic Development' },
  { name: 'Commissioner, Ministry of Agriculture', role: 'Ministry Representative', represents: 'Agriculture' },
  { name: 'Commissioner, Ministry of Justice', role: 'Ministry Representative', represents: 'Justice' },
  { name: 'Commissioner, Ministry of Internal Security', role: 'Ministry Representative', represents: 'Internal Security' },
  { name: 'State Chairman, ALGON', role: 'Member — Association of Local Governments of Nigeria', represents: 'ALGON' },
  { name: 'Dr. Uduakobong Inam', role: 'Economic Adviser to the Governor', represents: '' },
  { name: 'Akparawa Idorenyin Raphael', role: 'Senior Special Assistant to the Governor on Market Matters', represents: '' },
  { name: 'Mrs. Affiong Ibanga', role: 'Chamber of Commerce Representative', represents: 'AK Chamber of Commerce' },
  { name: 'Comrade Dominic Abang', role: 'Labour Representative', represents: 'Labour' },
]

const charges = [
  'Ensure transparency and accountability in the administration of food programmes.',
  'Follow the blueprint for the ARISE Food Security Programme strictly.',
  'Work closely with the Ministries of Economic Development and Agriculture.',
  'Liaise with food producers, distributors, and stakeholders.',
  'Acquire buffer stock to ensure government intentions for the programme are met.',
  'Administer programmes based on the updated Social Register.',
  'Be ready for audit at any time by any group of persons.',
  'Administer food vouchers to the most vulnerable through designated redemption centres.',
]

const memberBgs = ['bg-akbpaGreen-50', 'bg-amber-50', 'bg-orange-50', 'bg-emerald-50', 'bg-akbpaGreen-100', 'bg-amber-50', 'bg-orange-50', 'bg-emerald-50', 'bg-akbpaGreen-50']
function memberBg(i: number) { return memberBgs[i % memberBgs.length] }

function initials(name: string) {
  return name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('')
}
</script>
