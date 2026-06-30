<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-2 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/images/logo-light.webp" alt="Government of Akwa Ibom State" class="h-10 w-auto object-contain" />
          <div class="leading-tight hidden sm:block">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">AKSBPA</p>
            <p class="text-xs text-gray-500">Akwa Ibom State Bulk Purchase Agency</p>
          </div>
        </NuxtLink>

        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <NuxtLink to="/" class="hover:text-akbpaGreen-600">Home</NuxtLink>
          <NuxtLink to="/about" class="hover:text-akbpaGreen-600">About Us</NuxtLink>
          <NuxtLink to="/programmes" class="hover:text-akbpaGreen-600">Programmes</NuxtLink>
          <NuxtLink to="/procurement" class="hover:text-akbpaGreen-600">Procurement</NuxtLink>
          <NuxtLink to="/news" class="hover:text-akbpaGreen-600">News</NuxtLink>
          <NuxtLink to="/gallery" class="hover:text-akbpaGreen-600">Gallery</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-akbpaGreen-600">FAQs</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-akbpaGreen-600">Contact</NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center gap-2">
          <UColorModeButton />
          <UButton to="/login" color="primary" size="md" class="pill-btn px-5">Login</UButton>
        </div>

        <div class="flex items-center gap-1 lg:hidden">
          <UColorModeButton />
          <UButton color="neutral" variant="ghost" :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" @click="mobileMenuOpen = !mobileMenuOpen" />
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 space-y-1 bg-white dark:bg-gray-950">
        <NuxtLink v-for="item in mobileNavItems" :key="item.to" :to="item.to" class="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-akbpaGreen-50 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">{{ item.label }}</NuxtLink>
        <div class="pt-2">
          <UButton to="/login" color="primary" block class="pill-btn" @click="mobileMenuOpen = false">Login</UButton>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-akbpaGreen-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-10 w-10 rounded-full object-cover" />
            <p class="font-semibold text-sm">AKSBPA</p>
          </div>
          <p class="text-sm text-white/70">
            The Akwa Ibom State Bulk Purchase Agency is committed to promoting food
            security, supporting local agriculture, ensuring transparent procurement, and
            improving access to affordable food through efficient and accountable public service.
          </p>
          <div class="flex items-center gap-3 mt-4">
            <a v-for="s in socials" :key="s.label" href="#" :aria-label="s.label" class="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <UIcon :name="s.icon" class="size-4" />
            </a>
          </div>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Quick Links</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><NuxtLink to="/about" class="hover:text-akbpaOrange-300">About Us</NuxtLink></li>
            <li><NuxtLink to="/#services" class="hover:text-akbpaOrange-300">Services</NuxtLink></li>
            <li><NuxtLink to="/programmes" class="hover:text-akbpaOrange-300">Programmes</NuxtLink></li>
            <li><NuxtLink to="/procurement" class="hover:text-akbpaOrange-300">Procurement</NuxtLink></li>
            <li><NuxtLink to="/register/farmer" class="hover:text-akbpaOrange-300">Farmers &amp; Suppliers</NuxtLink></li>
            <li><NuxtLink to="/news" class="hover:text-akbpaOrange-300">News &amp; Media</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="hover:text-akbpaOrange-300">Gallery</NuxtLink></li>
            <li><NuxtLink to="/resources" class="hover:text-akbpaOrange-300">Resources</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-akbpaOrange-300">FAQs</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-akbpaOrange-300">Contact Us</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Portal Access</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><NuxtLink to="/login" class="hover:text-akbpaOrange-300">Staff &amp; Ward PA login</NuxtLink></li>
            <li><NuxtLink to="/forgot-password" class="hover:text-akbpaOrange-300">Forgot password</NuxtLink></li>
            <li><NuxtLink to="/redemption/scan" class="hover:text-akbpaOrange-300">Redemption scanner</NuxtLink></li>
            <li><NuxtLink to="/redemption-centres" class="hover:text-akbpaOrange-300">Redemption centres</NuxtLink></li>
            <li><NuxtLink to="/report-issue" class="hover:text-akbpaOrange-300">Report an issue</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Contact Information</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li>Akwa Ibom State Bulk Purchase Agency</li>
            <li>Elegance Place, Plot 46 Unit B, Ewet Housing Estate</li>
            <li>Uyo, Akwa Ibom State</li>
            <li>Telephone: +234 XXX XXX XXXX</li>
            <li>Email: info@aksbpa.gov.ng</li>
            <li>Working Hours: Mon–Fri, 8:00 a.m.–4:00 p.m.</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {{ new Date().getFullYear() }} Akwa Ibom State Bulk Purchase Agency (AKSBPA). All Rights Reserved.</p>
          <div class="flex items-center gap-4">
            <NuxtLink to="/privacy-policy" class="hover:text-akbpaOrange-300">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms-of-use" class="hover:text-akbpaOrange-300">Terms of Use</NuxtLink>
            <NuxtLink to="/accessibility-statement" class="hover:text-akbpaOrange-300">Accessibility Statement</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { mobileMenuOpen.value = false })

const mobileNavItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Procurement', to: '/procurement' },
  { label: 'News', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

const socials = [
  { label: 'Facebook', icon: 'i-lucide-facebook' },
  { label: 'X (Twitter)', icon: 'i-lucide-twitter' },
  { label: 'Instagram', icon: 'i-lucide-instagram' },
  { label: 'LinkedIn', icon: 'i-lucide-linkedin' },
  { label: 'YouTube', icon: 'i-lucide-youtube' },
]
</script>
