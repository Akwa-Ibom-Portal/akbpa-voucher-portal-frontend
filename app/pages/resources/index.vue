<template>
  <div>
    <PageHero
      eyebrow="Resources"
      title="Downloads & Resources"
      subtitle="Forms, guidelines, reports, and other publications from the Akwa Ibom State Bulk Purchase Agency."
    />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid sm:grid-cols-2 gap-5">
        <UCard v-for="c in categories" :key="c.title">
          <UIcon :name="c.icon" class="size-6 text-akbpaGreen-600 mb-3" />
          <p class="font-semibold text-gray-900 dark:text-white">{{ c.title }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ c.desc }}</p>
          <p class="text-xs text-gray-400 mt-3">Documents will be published here soon.</p>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Resources & Downloads | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Access forms, procurement guidelines, reports, and publications from the Akwa Ibom State Bulk Purchase Agency.',
})

const categories = [
  { title: 'Annual & Programme Reports', desc: 'Performance and impact reports on AKSBPA\'s food security programmes.', icon: 'i-lucide-file-text' },
  { title: 'Procurement Guidelines', desc: 'Documentation on procurement processes, standards, and accreditation requirements.', icon: 'i-lucide-clipboard-list' },
  { title: 'Registration Forms', desc: 'Downloadable forms for farmer and supplier registration.', icon: 'i-lucide-file-input' },
  { title: 'Press Kit', desc: 'Logos, fact sheets, and media resources for press and partners.', icon: 'i-lucide-image' },
]
</script>
