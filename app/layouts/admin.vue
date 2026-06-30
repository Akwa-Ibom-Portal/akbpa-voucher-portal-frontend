<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar (desktop) -->
    <aside class="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-800">
        <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-9 w-9 rounded-full object-cover" />
        <div class="leading-tight">
          <p class="font-semibold text-gray-900 dark:text-white text-sm">AKSBPA Portal</p>
          <p class="text-xs text-gray-500">Voucher Administration</p>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in visibleItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-akbpaGreen-50 hover:text-akbpaGreen-700 dark:hover:bg-gray-800 transition-colors"
          active-class="bg-akbpaGreen-50 text-akbpaGreen-700 dark:bg-akbpaGreen-950 dark:text-akbpaGreen-300"
        >
          <UIcon :name="item.icon" class="size-4.5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="p-3 border-t border-gray-200 dark:border-gray-800">
        <UButton block color="neutral" variant="ghost" icon="i-lucide-log-out" @click="auth.logout()">
          Sign out
        </UButton>
      </div>
    </aside>

    <!-- Sidebar (mobile drawer) -->
    <USlideover v-model:open="mobileNavOpen" side="left" :ui="{ content: 'w-64' }">
      <template #content>
        <div class="flex flex-col h-full">
          <div class="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-800">
            <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-9 w-9 rounded-full object-cover" />
            <div class="leading-tight">
              <p class="font-semibold text-gray-900 dark:text-white text-sm">AKSBPA Portal</p>
              <p class="text-xs text-gray-500">Voucher Administration</p>
            </div>
          </div>

          <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NuxtLink
              v-for="item in visibleItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-akbpaGreen-50 hover:text-akbpaGreen-700 dark:hover:bg-gray-800 transition-colors"
              active-class="bg-akbpaGreen-50 text-akbpaGreen-700 dark:bg-akbpaGreen-950 dark:text-akbpaGreen-300"
              @click="mobileNavOpen = false"
            >
              <UIcon :name="item.icon" class="size-4.5" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="p-3 border-t border-gray-200 dark:border-gray-800">
            <UButton block color="neutral" variant="ghost" icon="i-lucide-log-out" @click="auth.logout()">
              Sign out
            </UButton>
          </div>
        </div>
      </template>
    </USlideover>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 sm:px-6">
        <div class="flex items-center gap-2 lg:hidden">
          <UButton color="neutral" variant="ghost" icon="i-lucide-menu" @click="mobileNavOpen = true" />
          <img src="/images/akwa-ibom-logo.jpeg" alt="" class="h-8 w-8 rounded-full object-cover" />
          <span class="font-semibold text-sm hidden sm:inline">AKSBPA Portal</span>
        </div>
        <h1 class="hidden lg:block text-sm font-medium text-gray-500">
          {{ roleLabel }}
        </h1>
        <div class="flex items-center gap-2 sm:gap-3">
          <UBadge v-if="auth.user?.role === 'Ward PA / Issuing Officer'" color="neutral" variant="subtle" class="hidden sm:flex">
            {{ wardLabel }}
          </UBadge>
          <UColorModeButton />
          <UDropdownMenu :items="userMenuItems">
            <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down">
              <UAvatar :alt="fullName" size="xs" />
              <span class="hidden sm:inline">{{ fullName }}</span>
            </UButton>
          </UDropdownMenu>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/types'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const { visibleItems } = useNav()

// Refresh the signed-in user from /me once per admin session — catches role/profile
// changes made elsewhere and confirms the cached session is still valid server-side.
onMounted(() => {
  lgaStore.ensureLoaded()
  auth.fetchMe().catch(() => {})
})

const mobileNavOpen = ref(false)
const route = useRoute()
watch(() => route.path, () => { mobileNavOpen.value = false })

const fullName = computed(() => auth.user?.fullName ?? '')
const roleLabel = computed(() => USER_ROLES.find(r => r.value === auth.role)?.label ?? '')
const wardLabel = computed(() => lgaStore.wardName(auth.user?.wardIds?.[0] ?? ''))

const userMenuItems = [
  [{ label: fullName.value, slot: 'account', disabled: true }],
  [{ label: 'My Profile', icon: 'i-lucide-user', onSelect: () => navigateTo('/profile') }],
  [{ label: 'Sign out', icon: 'i-lucide-log-out', onSelect: () => auth.logout() }],
]
</script>
