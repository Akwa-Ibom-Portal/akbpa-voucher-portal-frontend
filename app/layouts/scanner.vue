<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <header class="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div class="flex items-center gap-2">
        <img src="/images/akwa-ibom-logo.jpeg" alt="" class="h-8 w-8 rounded-full object-cover" />
        <span class="text-sm font-medium">AKSBPA · Officer</span>
      </div>
      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-log-out" @click="auth.logout()" />
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
