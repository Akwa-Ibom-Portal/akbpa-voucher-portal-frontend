<template>
  <div>
    <PageHero
      eyebrow="Gallery"
      title="AKSBPA in Action"
      subtitle="Photos from our food distribution exercises, procurement operations, and community engagements across Akwa Ibom State."
    />

    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        <button
          v-for="(img, i) in galleryImages" :key="img.src" type="button"
          class="block w-full hover-lift rounded-xl overflow-hidden break-inside-avoid focus:outline-none focus-visible:ring-2 focus-visible:ring-akbpaGreen-500"
          @click="openAt(i)"
        >
          <img :src="img.src" :alt="img.alt" loading="lazy" class="w-full h-auto object-cover" />
        </button>
      </div>
    </section>

    <!-- Lightbox -->
    <UModal v-model:open="open" fullscreen :ui="{ content: 'bg-black/95' }">
      <template #content>
        <div class="relative h-full w-full flex items-center justify-center p-4 sm:p-10">
          <UButton
            icon="i-lucide-x" color="neutral" variant="ghost" size="xl"
            class="absolute top-4 right-4 text-white hover:bg-white/10"
            @click="open = false"
          />
          <UButton
            icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xl"
            class="absolute left-2 sm:left-6 text-white hover:bg-white/10"
            @click="prev"
          />
          <img :src="current?.src" :alt="current?.alt" class="max-h-full max-w-full object-contain rounded-lg" />
          <UButton
            icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xl"
            class="absolute right-2 sm:right-6 text-white hover:bg-white/10"
            @click="next"
          />
          <p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center px-4">{{ current?.alt }} · {{ activeIndex + 1 }} / {{ galleryImages.length }}</p>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Gallery | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Photos from AKSBPA\'s food distribution exercises, procurement operations, and community engagements across Akwa Ibom State.',
})

import { galleryImages } from '~/data/gallery'

const open = ref(false)
const activeIndex = ref(0)
const current = computed(() => galleryImages[activeIndex.value])

function openAt(i: number) {
  activeIndex.value = i
  open.value = true
}
function prev() {
  activeIndex.value = (activeIndex.value - 1 + galleryImages.length) % galleryImages.length
}
function next() {
  activeIndex.value = (activeIndex.value + 1) % galleryImages.length
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
