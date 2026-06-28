/**
 * v-reveal: fades/slides an element in the first time it scrolls into view.
 * Usage: v-reveal or v-reveal="120" (delay in ms) or v-reveal="{ delay: 120 }".
 * Skips the animation entirely for prefers-reduced-motion.
 *
 * Registered as a universal plugin (not .client.ts) so the directive resolves
 * during SSR too — its `mounted` hook never actually runs server-side (no DOM),
 * but Vue's server renderer still needs to find the directive registered.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('is-visible')
        return
      }

      const delay = typeof binding.value === 'number' ? binding.value : (binding.value?.delay ?? 0)
      el.classList.add('reveal')
      if (delay) el.style.transitionDelay = `${delay}ms`

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-visible')
              observer.unobserve(el)
            }
          }
        },
        { threshold: 0.15 },
      )
      observer.observe(el)
    },
  })
})
