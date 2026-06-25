<template>
  <div>
    <!-- Step 1: choose account type -->
    <div v-if="!auth.selectedRole">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Select your account type</h2>
      <p class="text-sm text-gray-500 mb-6">Choose how you access the AKBPA Food Voucher Portal.</p>

      <div class="grid sm:grid-cols-2 gap-3">
        <button
          v-for="r in USER_ROLES"
          :key="r.value"
          type="button"
          class="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-akbpaGreen-500 hover:bg-akbpaGreen-50 dark:hover:bg-akbpaGreen-950 transition-colors group"
          @click="auth.selectRole(r.value)"
        >
          <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-900 dark:text-white text-sm">{{ r.label }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400 group-hover:text-akbpaGreen-600" />
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ r.description }}</p>
        </button>
      </div>

      <div class="flex items-center justify-between mt-5">
        <NuxtLink to="/register" class="text-xs text-akbpaGreen-700 hover:underline">Request staff access</NuxtLink>
        <NuxtLink to="/forgot-password" class="text-xs text-gray-400 hover:text-akbpaGreen-600">Forgot password?</NuxtLink>
      </div>
    </div>

    <!-- Step 2: credentials -->
    <div v-else>
      <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-akbpaGreen-600 mb-4" @click="auth.selectRole(null as any)">
        <UIcon name="i-lucide-arrow-left" class="size-4" /> Change account type
      </button>

      <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-10 rounded-lg bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center">
          <UIcon name="i-lucide-user" class="size-5" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedRoleLabel }}</p>
          <p class="text-xs text-gray-500">Sign in to continue</p>
        </div>
      </div>

      <UForm :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email address" name="email">
          <UInput v-model="form.email" type="email" placeholder="you@akbpa.gov.ng" class="w-full" icon="i-lucide-mail" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="form.password" type="password" placeholder="••••••••" class="w-full" icon="i-lucide-lock" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="subtle" :title="error" />

        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Sign in</UButton>
      </UForm>

      <div class="flex items-center justify-between mt-3">
        <NuxtLink to="/register" class="text-xs text-akbpaGreen-700 hover:underline">Request staff access</NuxtLink>
        <NuxtLink to="/forgot-password" class="text-xs text-gray-400 hover:text-akbpaGreen-600">Forgot password?</NuxtLink>
      </div>

      <p class="text-xs text-gray-400 mt-4 text-center">
        Demo data — any password signs you in as the {{ selectedRoleLabel }} mock account.
      </p>
    </div>

    <!-- Demo credentials reference, for easy testing -->
    <UCard class="mt-6 bg-gray-50 dark:bg-gray-800/50 border-none">
      <template #header>
        <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Demo Accounts (mock data — any password works)</p>
      </template>
      <div class="grid sm:grid-cols-2 gap-2">
        <button
          v-for="u in activeUsers" :key="u.id" type="button"
          class="flex items-center justify-between text-left px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-akbpaGreen-400 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          @click="quickLogin(u)"
        >
          <div class="min-w-0">
            <p class="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">{{ USER_ROLES.find(r => r.value === u.role)?.label }}</p>
            <p class="text-[11px] text-gray-500 truncate">{{ u.email }}</p>
          </div>
          <UIcon name="i-lucide-log-in" class="size-3.5 text-gray-400 shrink-0" />
        </button>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES, type User } from '~/types'

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const usersStore = useUsersStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const activeUsers = computed(() => usersStore.activeUsers)

onMounted(() => {
  usersStore.statusFilter = 'Active'
  usersStore.fetchUsers()
})

const selectedRoleLabel = computed(() => USER_ROLES.find(r => r.value === auth.selectedRole)?.label ?? '')

// Prefill the email once a role/account is chosen, so the form is ready to submit immediately.
watch(() => auth.selectedRole, (role) => {
  const matched = usersStore.users.find(u => u.role === role)
  form.email = matched?.email ?? ''
}, { immediate: true })

async function onSubmit() {
  if (!auth.selectedRole) return
  loading.value = true
  error.value = ''
  try {
    await auth.login(auth.selectedRole, form.email, form.password)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message ?? 'Unable to sign in'
  } finally {
    loading.value = false
  }
}

function quickLogin(u: User) {
  auth.selectRole(u.role)
  form.email = u.email
  form.password = 'demo'
}
</script>
