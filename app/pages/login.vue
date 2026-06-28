<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <div class="h-10 w-10 rounded-lg bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center">
        <UIcon name="i-lucide-user" class="size-5" />
      </div>
      <div>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">AKBPA Food Voucher Portal</p>
        <p class="text-xs text-gray-500">Sign in to continue</p>
      </div>
    </div>

    <UForm :state="form" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email address" name="email">
        <UInput v-model="form.email" type="email" placeholder="you@akbpa.com" class="w-full" icon="i-lucide-mail" />
      </UFormField>

      <UFormField label="Password" name="password">
        <PasswordInput v-model="form.password" placeholder="••••••••" />
      </UFormField>

      <UAlert v-if="error" color="error" variant="subtle" :title="error" />

      <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Sign in</UButton>
    </UForm>

    <div class="flex items-center justify-between mt-3">
      <!-- <NuxtLink to="/register" class="text-xs text-akbpaGreen-700 hover:underline">Request staff access</NuxtLink> -->
      <NuxtLink to="/forgot-password" class="text-xs text-gray-400 hover:text-akbpaGreen-600">Forgot password?</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.email, form.password)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? e.message ?? 'Unable to sign in'
  } finally {
    loading.value = false
  }
}
</script>
