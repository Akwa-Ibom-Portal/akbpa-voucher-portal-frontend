<template>
  <div>
    <PageHero
      eyebrow="News & Media"
      title="Stay Informed"
      subtitle="Announcements, programme launches, procurement notices, stakeholder engagements, policy updates, and community outreach activities from AKSBPA."
    />

    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid sm:grid-cols-2 gap-5">
        <UCard v-for="n in news" :key="n" v-reveal class="hover-lift">
          <UIcon name="i-lucide-newspaper" class="size-6 text-akbpaOrange-500 mb-3" />
          <p class="font-semibold text-gray-900 dark:text-white">{{ n }}</p>
          <p class="text-xs text-gray-400 mt-2">Full article coming soon</p>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'News & Media | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Latest announcements, programme launches, procurement notices, and stakeholder engagements from the Akwa Ibom State Bulk Purchase Agency.',
})

const news = [
  'Agency Launches New Farmer Registration Drive',
  'Food Price Monitoring Report Released',
  'Strategic Partnership with Agricultural Cooperatives',
  'Procurement Opportunities Now Open',
  'Community Food Distribution Programme Expanded',
]
</script>
