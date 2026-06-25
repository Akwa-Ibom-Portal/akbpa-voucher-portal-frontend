<template>
  <div>
    <div v-if="checking" class="text-center py-8 text-sm text-gray-400">
      <UIcon name="i-lucide-loader-2" class="size-5 animate-spin mx-auto mb-2" />
      Checking your invite…
    </div>

    <div v-else-if="!invitee" class="text-center py-6">
      <div class="h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-link-2-off" class="size-7" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Invite link invalid or expired</h2>
      <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
        Ask your SuperAdmin to resend the invitation from User Management.
      </p>
      <UButton to="/login" class="mt-6 pill-btn px-6" color="secondary">Back to Login</UButton>
    </div>

    <div v-else-if="!done">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Welcome, {{ invitee.firstName }}</h2>
      <p class="text-sm text-gray-500 mb-6">
        You've been invited to the AKBPA Food Voucher Portal as
        <strong>{{ USER_ROLES.find(r => r.value === invitee.role)?.label }}</strong>.
        Set a password to activate your account.
      </p>

      <UCard class="bg-gray-50 dark:bg-gray-800/50 border-none mb-6">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><p class="text-gray-400 text-xs">Name</p><p class="font-medium">{{ invitee.firstName }} {{ invitee.lastName }}</p></div>
          <div><p class="text-gray-400 text-xs">Email</p><p class="font-medium">{{ invitee.email }}</p></div>
          <div><p class="text-gray-400 text-xs">Role</p><p class="font-medium">{{ USER_ROLES.find(r => r.value === invitee.role)?.label }}</p></div>
          <div v-if="invitee.wardId"><p class="text-gray-400 text-xs">Ward</p><p class="font-medium">{{ lgaStore.wardName(invitee.wardId) }}</p></div>
        </div>
      </UCard>

      <UForm :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField label="Set a password" name="password">
          <UInput v-model="form.password" type="password" icon="i-lucide-lock" class="w-full" />
        </UFormField>
        <UFormField label="Confirm password" name="confirm">
          <UInput v-model="form.confirm" type="password" icon="i-lucide-lock" class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="subtle" :title="error" />

        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Activate My Account</UButton>
      </UForm>
    </div>

    <div v-else class="text-center py-4">
      <div class="h-14 w-14 rounded-full bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-check-circle-2" class="size-7" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Account activated</h2>
      <p class="text-sm text-gray-500 mt-2">You're signed in — taking you to your dashboard.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

import { USER_ROLES, type User } from '~/types'

const auth = useAuthStore()
const lgaStore = useLgaStore()
const route = useRoute()
const router = useRouter()

const checking = ref(true)
const invitee = ref<User | null>(null)
const form = reactive({ password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const done = ref(false)

onMounted(async () => {
  await lgaStore.ensureLoaded()
  invitee.value = await auth.getInviteByToken(String(route.query.token ?? ''))
  checking.value = false
})

async function onSubmit() {
  error.value = ''
  if (form.password !== form.confirm) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await auth.acceptInvite(String(route.query.token ?? ''), form.password)
    done.value = true
    setTimeout(() => router.push('/dashboard'), 900)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
