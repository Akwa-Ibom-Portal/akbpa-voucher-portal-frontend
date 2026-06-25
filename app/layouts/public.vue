<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-2 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-11 w-11 rounded-full object-cover" />
          <div class="leading-tight">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">AKBPA Food Voucher Portal</p>
            <p class="text-xs text-gray-500">Akwa Ibom Bulk Purchase Agency</p>
          </div>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <NuxtLink to="/" class="hover:text-akbpaGreen-600">Home</NuxtLink>
          <NuxtLink to="/how-it-works" class="hover:text-akbpaGreen-600">Quick Steps</NuxtLink>
          <NuxtLink to="/eligibility" class="hover:text-akbpaGreen-600">Eligibility</NuxtLink>
          <NuxtLink to="/faq" class="hover:text-akbpaGreen-600">FAQs</NuxtLink>
        </nav>

        <div class="hidden md:flex items-center gap-2">
          <UColorModeButton />
          <UButton to="/register" color="neutral" variant="outline" size="md" class="pill-btn px-5">Register</UButton>
          <UButton to="/login" color="primary" size="md" class="pill-btn px-5">Login</UButton>
        </div>

        <div class="flex items-center gap-1 md:hidden">
          <UColorModeButton />
          <UButton color="neutral" variant="ghost" :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" @click="mobileMenuOpen = !mobileMenuOpen" />
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 space-y-1 bg-white dark:bg-gray-950">
        <NuxtLink to="/" class="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-akbpaGreen-50 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Home</NuxtLink>
        <NuxtLink to="/how-it-works" class="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-akbpaGreen-50 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Quick Steps</NuxtLink>
        <NuxtLink to="/eligibility" class="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-akbpaGreen-50 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">Eligibility</NuxtLink>
        <NuxtLink to="/faq" class="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-akbpaGreen-50 dark:hover:bg-gray-800" @click="mobileMenuOpen = false">FAQs</NuxtLink>
        <div class="flex gap-2 pt-2">
          <UButton to="/register" color="neutral" variant="outline" block class="pill-btn" @click="mobileMenuOpen = false">Register</UButton>
          <UButton to="/login" color="primary" block class="pill-btn" @click="mobileMenuOpen = false">Login</UButton>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-akbpaGreen-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-10 w-10 rounded-full object-cover" />
            <p class="font-semibold text-sm">AKBPA</p>
          </div>
          <p class="text-sm text-white/70">
            Akwa Ibom Bulk Purchase Agency — administering the Stable Food Relief
            Programme for Social Register beneficiaries across the state.
          </p>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Programme</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><NuxtLink to="/how-it-works" class="hover:text-akbpaOrange-300">How it works</NuxtLink></li>
            <li><NuxtLink to="/eligibility" class="hover:text-akbpaOrange-300">Eligibility criteria</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-akbpaOrange-300">Frequently asked questions</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Portal Access</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><NuxtLink to="/login" class="hover:text-akbpaOrange-300">Staff &amp; Ward PA login</NuxtLink></li>
            <li><NuxtLink to="/register" class="hover:text-akbpaOrange-300">Request staff access</NuxtLink></li>
            <li><NuxtLink to="/forgot-password" class="hover:text-akbpaOrange-300">Forgot password</NuxtLink></li>
            <li><NuxtLink to="/redemption/scan" class="hover:text-akbpaOrange-300">Redemption scanner</NuxtLink></li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-sm mb-3">Contact</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li>Akwa Ibom Bulk Purchase Agency</li>
            <li>Uyo, Akwa Ibom State, Nigeria</li>
            <li>info@akbpa.gov.ng</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {{ new Date().getFullYear() }} Akwa Ibom Bulk Purchase Agency. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { mobileMenuOpen.value = false })
</script>
