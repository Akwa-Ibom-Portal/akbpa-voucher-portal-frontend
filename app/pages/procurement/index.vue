<template>
  <div>
    <PageHero
      eyebrow="Procurement"
      title="Procurement Opportunities"
      subtitle="AKSBPA procures food commodities and related services through transparent, competitive processes that ensure value for public resources and compliance with applicable procurement laws."
    />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">How Our Procurement Process Works</h2>
      <ul class="space-y-3 mb-10">
        <li v-for="s in process" :key="s" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
          <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 mt-0.5 shrink-0" />
          {{ s }}
        </li>
      </ul>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">Current Opportunities</p>
        </template>
        <div class="text-center py-10">
          <UIcon name="i-lucide-file-search" class="size-10 text-gray-300 mx-auto mb-3" />
          <p class="text-sm text-gray-500">No open procurement opportunities are published at this time.</p>
          <p class="text-sm text-gray-400 mt-1">Check back soon, or register as a supplier to be notified when new opportunities open.</p>
          <UButton to="/register/supplier" class="pill-btn px-5 mt-5">Register as a Supplier</UButton>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Procurement Opportunities | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'View current and upcoming procurement opportunities with the Akwa Ibom State Bulk Purchase Agency, and learn how our transparent procurement process works.',
})

const process = [
  'Procurement needs are identified and planned in line with approved budgets and food security priorities.',
  'Opportunities are published to registered and accredited suppliers through this website and official channels.',
  'Submissions are evaluated against published technical, quality, and pricing criteria.',
  'Contracts are awarded transparently, in compliance with applicable public procurement laws and regulations.',
]
</script>
