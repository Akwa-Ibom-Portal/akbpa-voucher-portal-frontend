<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <header class="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="/images/akwa-ibom-logo.jpeg" alt="" class="h-8 w-8 rounded-full object-cover shrink-0" />
        <div class="min-w-0">
          <p class="text-sm font-semibold leading-tight truncate">AKSBPA · {{ roleShort }}</p>
          <p v-if="wardName" class="text-xs text-white/50 leading-tight truncate">{{ wardName }}</p>
        </div>
      </div>
      <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-log-out" @click="auth.logout()" />
    </header>
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const lgaStore = useLgaStore()

onMounted(() => lgaStore.ensureLoaded().catch(() => {}))

const roleShort = computed(() => {
  if (auth.role === 'Redemption Officer') return 'Redemption'
  if (auth.role === 'Ward PA / Issuing Officer') return 'Ward PA'
  return 'Officer'
})

const wardName = computed(() => {
  const id = auth.user?.wardIds?.[0]
  return id ? lgaStore.wardName(id) : ''
})
</script>
