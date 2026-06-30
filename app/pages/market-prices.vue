<template>
  <div>
    <PageHero
      eyebrow="Market Stabilization Initiative"
      title="Market Price Updates"
      subtitle="Continuous monitoring of food markets enables the Agency to track price trends, identify supply challenges, and inform timely interventions."
    />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid sm:grid-cols-3 gap-5 mb-10">
        <UCard v-for="i in items" :key="i.name" class="text-center">
          <p class="text-2xl">{{ i.emoji }}</p>
          <p class="font-semibold text-gray-900 dark:text-white mt-2">{{ i.name }}</p>
          <p class="text-xs text-gray-400 mt-1">Price data coming soon</p>
        </UCard>
      </div>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">About Market Price Monitoring</p>
        </template>
        <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed">
          The Agency tracks staple food prices across markets in Akwa Ibom State as part
          of the Market Stabilization Initiative, working alongside the Back-to-Farm
          Initiative to ensure availability, affordability, and price reduction in food
          items in the markets. Published price reports will appear on this page.
        </p>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Market Price Updates | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Track food price trends and market stabilization efforts from the Akwa Ibom State Bulk Purchase Agency.',
})

const items = [
  { name: 'Rice', emoji: '🍚' },
  { name: 'Beans', emoji: '🫘' },
  { name: 'Garri', emoji: '🌾' },
]
</script>
