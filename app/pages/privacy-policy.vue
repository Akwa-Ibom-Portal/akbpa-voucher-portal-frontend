<template>
  <div>
    <PageHero eyebrow="Legal" title="Privacy Policy" />
    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <UAlert
        color="info" variant="subtle" icon="i-lucide-file-text"
        title="This page is awaiting publication"
        description="Our Privacy Policy is being finalized by the Agency's legal team and will be published here. For questions about how your information is handled in the meantime, please contact us."
      />
      <UButton to="/contact" class="pill-btn px-5 mt-6">Contact the Agency</UButton>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })
useSeoMeta({ title: 'Privacy Policy | Akwa Ibom State Bulk Purchase Agency (AKSBPA)' })
</script>
