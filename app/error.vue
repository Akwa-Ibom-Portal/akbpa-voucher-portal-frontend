<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

    <!-- Minimal header -->
    <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-6">
      <NuxtLink to="/">
        <img src="/images/logo-light.webp" alt="AKSBPA" class="h-8 w-auto" />
      </NuxtLink>
    </header>

    <!-- Error body -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <div class="max-w-md w-full space-y-6">

        <!-- Status code -->
        <p class="text-8xl font-black text-akbpaGreen-600 dark:text-akbpaGreen-400 leading-none select-none">
          {{ error.statusCode }}
        </p>

        <!-- Title + subtitle -->
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">{{ subtitle }}</p>
        </div>

        <!-- Error detail — only shown for server errors -->
        <div
          v-if="error.statusCode >= 500 && error.message"
          class="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-4 py-3 text-left"
        >
          <p class="text-xs font-mono text-red-600 dark:text-red-400 break-all">{{ error.message }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-akbpaGreen-600 text-white font-semibold text-sm hover:bg-akbpaGreen-700 active:bg-akbpaGreen-800 transition-colors"
            @click="goHome"
          >
            Go to Homepage
          </button>
          <button
            class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="goBack"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <footer class="py-5 text-center text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800">
      Akwa Ibom State Bulk Purchase Agency &middot; Stable Food Relief Programme
    </footer>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    url?: string
    statusCode: number
    statusMessage?: string
    message?: string
    description?: string
  }
}>()

const title = computed(() => {
  switch (props.error.statusCode) {
    case 404: return 'Page not found'
    case 403: return 'Access denied'
    case 401: return 'Session expired'
    case 500: return 'Server error'
    case 503: return 'Service unavailable'
    default:  return props.error.statusMessage ?? 'Something went wrong'
  }
})

const subtitle = computed(() => {
  switch (props.error.statusCode) {
    case 404: return "The page you're looking for doesn't exist or may have been moved."
    case 403: return "You don't have permission to access this page. Contact your administrator if you believe this is a mistake."
    case 401: return 'Your session has expired. Please sign in again to continue.'
    case 500: return "Something went wrong on our end. We're working on it — please try again in a moment."
    case 503: return 'The service is temporarily unavailable. Please try again shortly.'
    default:  return 'An unexpected error occurred. Please try again or return to the homepage.'
  }
})

function goHome() {
  clearError({ redirect: '/' })
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    clearError()
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}
</script>
