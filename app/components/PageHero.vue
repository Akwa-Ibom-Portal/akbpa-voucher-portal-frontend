<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-akbpaGreen-800 via-akbpaGreen-900 to-akbpaGreen-950 text-white">
    <!-- Subtle dot-grid texture -->
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-dot-grid opacity-40" />

    <!-- Decorative color blobs, one gently animated for a touch of life -->
    <div aria-hidden="true" class="bg-blob absolute -z-10 -top-20 -right-16 size-72 rounded-full bg-akbpaOrange-400/25 animate-float" />
    <div aria-hidden="true" class="bg-blob absolute -z-10 -bottom-24 -left-20 size-80 rounded-full bg-akbpaGreen-400/20" />
    <div aria-hidden="true" class="bg-blob absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[28rem] rounded-full bg-white/[0.04]" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 text-center animate-pop-in">
      <UBadge
        v-if="eyebrow" variant="subtle"
        class="mb-5 bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm"
      >
        {{ eyebrow }}
      </UBadge>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{{ title }}</h1>
      <div v-if="subtitle" class="mt-3 h-1 w-16 rounded-full bg-akbpaOrange-400 mx-auto" />
      <p v-if="subtitle" class="mt-5 text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">{{ subtitle }}</p>
    </div>

    <!-- Wave divider into the page body -->
    <svg
      aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none"
      class="absolute -bottom-px left-0 w-full h-10 sm:h-14 text-white dark:text-gray-950"
    >
      <path fill="currentColor" d="M0,40 C240,90 480,0 720,20 C960,40 1200,90 1440,40 L1440,80 L0,80 Z" />
    </svg>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>
