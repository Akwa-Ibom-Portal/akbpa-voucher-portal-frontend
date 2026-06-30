<template>
  <section class="bg-akbpaGreen-800 text-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
      <UBadge v-if="eyebrow" variant="subtle" class="mb-4 bg-white/15 text-white ring-white/20">{{ eyebrow }}</UBadge>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold">{{ title }}</h1>
      <p v-if="subtitle" class="mt-4 text-white/80 max-w-2xl mx-auto">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>
