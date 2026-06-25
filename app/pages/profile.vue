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
        <UFormField label="First Name" name="firstName">
          <UInput v-model="profileForm.firstName" class="w-full" />
        </UFormField>
        <UFormField label="Last Name" name="lastName">
          <UInput v-model="profileForm.lastName" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput :model-value="auth.user?.email" disabled class="w-full" />
        </UFormField>
        <UFormField label="Phone Number" name="phone">
          <UInput v-model="profileForm.phone" class="w-full" />
        </UFormField>

        <UAlert v-if="profileSaved" color="success" variant="subtle" title="Profile updated." class="sm:col-span-2" />

        <div class="sm:col-span-2">
          <UButton type="submit">Save Changes</UButton>
        </div>
      </UForm>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Change Password</p>
      </template>
      <UForm :state="passwordForm" class="space-y-4" @submit="onChangePassword">
        <UFormField label="Current password" name="current">
          <UInput v-model="passwordForm.current" type="password" class="w-full" />
        </UFormField>
        <UFormField label="New password" name="new">
          <UInput v-model="passwordForm.new" type="password" class="w-full" />
        </UFormField>
        <UFormField label="Confirm new password" name="confirm">
          <UInput v-model="passwordForm.confirm" type="password" class="w-full" />
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

const fullName = computed(() => auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : '')
const roleLabel = computed(() => USER_ROLES.find(r => r.value === auth.role)?.label ?? '')

const profileForm = reactive({
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  phone: auth.user?.phone ?? '',
})
const profileSaved = ref(false)

function onSaveProfile() {
  auth.updateProfile({ firstName: profileForm.firstName, lastName: profileForm.lastName, phone: profileForm.phone })
  profileSaved.value = true
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
    pwError.value = e.message
  } finally {
    pwLoading.value = false
  }
}
</script>
