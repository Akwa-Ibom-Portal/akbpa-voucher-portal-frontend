<template>
  <div>
    <div v-if="!done">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Set a new password</h2>
      <p class="text-sm text-gray-500 mb-6">Choose a new password for your AKBPA Portal account.</p>

      <UForm :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField label="New password" name="password">
          <UInput v-model="form.password" type="password" icon="i-lucide-lock" class="w-full" />
        </UFormField>
        <UFormField label="Confirm new password" name="confirm">
          <UInput v-model="form.confirm" type="password" icon="i-lucide-lock" class="w-full" />
        </UFormField>
        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Reset Password</UButton>
      </UForm>
    </div>

    <div v-else class="text-center py-4">
      <div class="h-14 w-14 rounded-full bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-check-circle-2" class="size-7" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Password updated</h2>
      <p class="text-sm text-gray-500 mt-2">You can now sign in with your new password.</p>
      <UButton to="/login" class="mt-6 pill-btn px-6" color="secondary">Back to Login</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const route = useRoute()
const form = reactive({ password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function onSubmit() {
  error.value = ''
  if (form.password !== form.confirm) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await auth.resetPassword(String(route.query.token ?? ''), form.password)
    done.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
