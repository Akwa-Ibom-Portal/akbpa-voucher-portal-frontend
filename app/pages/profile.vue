<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      <p class="text-sm text-gray-500">Manage your personal details and account security.</p>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Personal Details</p>
      </template>
      <div class="flex items-center gap-4 mb-5">
        <UAvatar :alt="fullName" size="xl" />
        <div>
          <p class="font-medium text-gray-900 dark:text-white">{{ fullName }}</p>
          <p class="text-sm text-gray-500">{{ roleLabel }}</p>
        </div>
      </div>

      <UForm :state="profileForm" class="grid sm:grid-cols-2 gap-4" @submit="onSaveProfile">
        <UFormField label="Full Name" name="fullName" class="sm:col-span-2">
          <UInput v-model="profileForm.fullName" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput :model-value="auth.user?.email" disabled class="w-full" />
        </UFormField>
        <UFormField label="Phone Number" name="phone">
          <UInput v-model="profileForm.phone" class="w-full" />
        </UFormField>

        <UAlert v-if="profileError" color="error" variant="subtle" :title="profileError" class="sm:col-span-2" />
        <UAlert v-if="profileSaved" color="success" variant="subtle" title="Profile updated." class="sm:col-span-2" />

        <div class="sm:col-span-2">
          <UButton type="submit" :loading="profileSaving">Save Changes</UButton>
        </div>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Change Password</p>
      </template>
      <UForm :state="passwordForm" class="space-y-4" @submit="onChangePassword">
        <UFormField label="Current password" name="current">
          <PasswordInput v-model="passwordForm.current" />
        </UFormField>
        <UFormField label="New password" name="new">
          <PasswordInput v-model="passwordForm.new" />
        </UFormField>
        <UFormField label="Confirm new password" name="confirm">
          <PasswordInput v-model="passwordForm.confirm" />
        </UFormField>

        <UAlert v-if="pwError" color="error" variant="subtle" :title="pwError" />
        <UAlert v-if="pwSaved" color="success" variant="subtle" title="Password changed." />

        <UButton type="submit" :loading="pwLoading">Update Password</UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth'] })

import { USER_ROLES } from '~/types'

const auth = useAuthStore()

const fullName = computed(() => auth.user?.fullName ?? '')
const roleLabel = computed(() => USER_ROLES.find(r => r.value === auth.role)?.label ?? '')

const profileForm = reactive({
  fullName: auth.user?.fullName ?? '',
  phone: auth.user?.phone ?? '',
})
const profileSaving = ref(false)
const profileSaved = ref(false)
const profileError = ref('')

async function onSaveProfile() {
  profileError.value = ''
  profileSaved.value = false
  profileSaving.value = true
  try {
    await auth.updateProfile({ fullName: profileForm.fullName, phone: profileForm.phone })
    profileSaved.value = true
  } catch (e: any) {
    profileError.value = e.response?.data?.message ?? e.message
  } finally {
    profileSaving.value = false
  }
}

const passwordForm = reactive({ current: '', new: '', confirm: '' })
const pwLoading = ref(false)
const pwError = ref('')
const pwSaved = ref(false)

async function onChangePassword() {
  pwError.value = ''
  pwSaved.value = false
  if (passwordForm.new !== passwordForm.confirm) {
    pwError.value = 'New passwords do not match.'
    return
  }
  pwLoading.value = true
  try {
    await auth.changePassword(passwordForm.current, passwordForm.new)
    pwSaved.value = true
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch (e: any) {
    pwError.value = e.response?.data?.message ?? e.message
  } finally {
    pwLoading.value = false
  }
}
</script>
