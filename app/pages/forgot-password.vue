<template>
  <div>
    <div v-if="!sent">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Forgot your password?</h2>
      <p class="text-sm text-gray-500 mb-6">
        Enter the email address on your account and we'll send you a link to reset your password.
      </p>
      <UForm :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email address" name="email">
          <UInput v-model="form.email" type="email" icon="i-lucide-mail" class="w-full" />
        </UFormField>
        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Send Reset Link</UButton>
      </UForm>
      <p class="text-sm text-center text-gray-500 mt-6">
        <NuxtLink to="/login" class="text-akbpaGreen-700 hover:underline">Back to login</NuxtLink>
      </p>
    </div>

    <div v-else class="text-center py-4">
      <div class="h-14 w-14 rounded-full bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-mail-check" class="size-7" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Check your email</h2>
      <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
        If an account exists for <strong>{{ form.email }}</strong>, a password reset link has been sent.
      </p>

      <UAlert v-if="mockLink" color="info" variant="subtle" class="mt-4 text-left" title="Demo mode — no email service is wired up yet">
        <template #description>
          <NuxtLink :to="mockLink" class="text-akbpaGreen-700 hover:underline break-all">{{ mockLink }}</NuxtLink>
        </template>
      </UAlert>

      <UButton to="/login" class="mt-6 pill-btn px-6" color="secondary">Back to Login</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const form = reactive({ email: '' })
const loading = ref(false)
const sent = ref(false)
const mockLink = ref('')

async function onSubmit() {
  loading.value = true
  const token = await auth.requestPasswordReset(form.email)
  mockLink.value = token ? `/reset-password?token=${token}` : ''
  sent.value = true
  loading.value = false
}
</script>
