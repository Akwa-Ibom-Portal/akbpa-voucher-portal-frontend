<template>
  <div>
    <PageHero eyebrow="Legal" title="Accessibility Statement" />
    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <UAlert
        color="info" variant="subtle" icon="i-lucide-accessibility"
        title="This page is awaiting publication"
        description="Our Accessibility Statement is being finalized and will be published here. If you experience any difficulty using this website, please let us know so we can assist you directly."
      />
      <UButton to="/contact" class="pill-btn px-5 mt-6">Contact the Agency</UButton>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
useSeoMeta({ title: 'Accessibility Statement | Akwa Ibom State Bulk Purchase Agency (AKSBPA)' })
</script>
