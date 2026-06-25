<template>
  <div>
    <div v-if="step !== 'done'" class="mb-6">
      <UStepper v-model="stepIndex" :items="stepperItems" disabled />
    </div>

    <!-- Step 1: email -->
    <div v-if="step === 'email'">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Request Staff Access</h2>
      <p class="text-sm text-gray-500 mb-6">
        Start your account request by providing your email address. A SuperAdmin must
        approve every new staff account before it can sign in.
      </p>
      <UForm :state="emailForm" class="space-y-4" @submit="onSubmitEmail">
        <UFormField label="Email address" name="email">
          <UInput v-model="emailForm.email" type="email" placeholder="you@example.com" icon="i-lucide-mail" class="w-full" />
        </UFormField>
        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Get Started</UButton>
      </UForm>
      <p class="text-sm text-center text-gray-500 mt-6">
        Already have an account? <NuxtLink to="/login" class="text-akbpaGreen-700 hover:underline">Login</NuxtLink>
      </p>
    </div>

    <!-- Step 2: verify code -->
    <div v-else-if="step === 'verify'">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Verify your email address</h2>
      <p class="text-sm text-gray-500 mb-6">
        We've sent a verification code to <strong>{{ maskedEmail }}</strong>. Kindly check your inbox to proceed.
      </p>
      <UAlert color="info" variant="subtle" icon="i-lucide-info" :title="`Demo mode — use code ${MOCK_VERIFICATION_CODE}`" class="mb-4" />
      <UForm :state="codeForm" class="space-y-4" @submit="onVerifyCode">
        <UFormField label="Verification code" name="code">
          <UInput v-model="codeForm.code" placeholder="123456" maxlength="6" class="w-full" />
        </UFormField>
        <UAlert v-if="error" color="error" variant="subtle" :title="error" />
        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Verify &amp; Continue</UButton>
        <UButton block variant="ghost" color="neutral" @click="step = 'email'">Didn't get a code? Go back</UButton>
      </UForm>
    </div>

    <!-- Step 3: profile / application form -->
    <div v-else-if="step === 'profile'">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Complete Your Profile</h2>
      <p class="text-sm text-gray-500 mb-6">Tell us who you are and which role you're requesting access for.</p>

      <UForm :state="profileForm" class="space-y-5" @submit="onSubmitProfile">
        <div class="grid sm:grid-cols-3 gap-4">
          <UFormField label="First Name" name="firstName" required>
            <UInput v-model="profileForm.firstName" class="w-full" />
          </UFormField>
          <UFormField label="Middle Name" name="middleName">
            <UInput v-model="profileForm.middleName" class="w-full" />
          </UFormField>
          <UFormField label="Last Name" name="lastName" required>
            <UInput v-model="profileForm.lastName" class="w-full" />
          </UFormField>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Phone Number" name="phone" required>
            <UInput v-model="profileForm.phone" placeholder="080XXXXXXXX" class="w-full" />
          </UFormField>
          <UFormField label="National Identification Number (NIN)" name="nin" required>
            <UInput v-model="profileForm.nin" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Role You're Requesting" name="role" required>
          <USelect v-model="profileForm.role" :items="requestableRoles" class="w-full" />
        </UFormField>

        <div v-if="needsScope" class="grid sm:grid-cols-2 gap-4">
          <UFormField label="LGA" name="lgaId" required>
            <USelect v-model="profileForm.lgaId" :items="lgaOptions" class="w-full" @change="profileForm.wardId = ''" />
          </UFormField>
          <UFormField v-if="profileForm.role === 'WardPA'" label="Ward" name="wardId" required>
            <USelect v-model="profileForm.wardId" :items="wardOptions" :disabled="!profileForm.lgaId" class="w-full" />
          </UFormField>
        </div>

        <UCard class="bg-gray-50 dark:bg-gray-800/50 border-none">
          <template #header>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Identity Verification</p>
          </template>
          <ul class="text-xs text-gray-500 list-disc ms-4 space-y-1 mb-4">
            <li>Your NIN above is used to confirm your identity and ensure account uniqueness.</li>
            <li>Upload a staff ID or introduction letter (PDF, max 5MB) — this is reviewed before approval.</li>
          </ul>
          <UFormField label="Profile Photo" name="photo">
            <input type="file" accept="image/*" class="text-sm" @change="onPhotoChange" />
          </UFormField>
          <UFormField label="ID Document (PDF)" name="idDocument" class="mt-3">
            <input type="file" accept="application/pdf" class="text-sm" @change="onDocChange" />
          </UFormField>
        </UCard>

        <div class="space-y-2">
          <label class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <UCheckbox v-model="profileForm.consentData" class="mt-0.5" />
            I consent to AKBPA collecting and verifying the information provided above for the purpose of granting portal access.
          </label>
          <label class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <UCheckbox v-model="profileForm.consentTerms" class="mt-0.5" />
            I agree to the AKBPA Portal Terms and Conditions and Privacy Policy.
          </label>
        </div>

        <UAlert v-if="error" color="error" variant="subtle" :title="error" />

        <UButton type="submit" block size="lg" color="secondary" class="pill-btn" :loading="loading">Submit Request</UButton>
      </UForm>
    </div>

    <!-- Step 4: pending approval -->
    <div v-else class="text-center py-6">
      <div class="h-14 w-14 rounded-full bg-akbpaGreen-100 text-akbpaGreen-700 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-clock" class="size-7" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Request Submitted</h2>
      <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
        Your account request is pending review by a SuperAdmin. You'll be notified by
        email once it's approved and you can sign in.
      </p>
      <UButton to="/login" class="mt-6 pill-btn px-6" color="secondary">Back to Login</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES, type UserRole } from '~/types'
import { MOCK_VERIFICATION_CODE } from '~/services/authApi'

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()

type Step = 'email' | 'verify' | 'profile' | 'done'
const step = ref<Step>('email')
const loading = ref(false)
const error = ref('')

const stepperItems = [
  { value: 0, title: 'Email', icon: 'i-lucide-mail' },
  { value: 1, title: 'Verify', icon: 'i-lucide-shield-check' },
  { value: 2, title: 'Profile', icon: 'i-lucide-id-card' },
]
const stepIndex = computed(() => ({ email: 0, verify: 1, profile: 2, done: 2 })[step.value])

const emailForm = reactive({ email: '' })
const codeForm = reactive({ code: '' })
const profileForm = reactive({
  firstName: '', middleName: '', lastName: '', phone: '', nin: '',
  role: 'WardPA' as UserRole, lgaId: '', wardId: '',
  consentData: false, consentTerms: false,
})
const photoName = ref('')
const docName = ref('')

const maskedEmail = computed(() => {
  const [name, domain] = emailForm.email.split('@')
  if (!name) return ''
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`
})

// SuperAdmin is never self-requestable — only a SuperAdmin can promote someone to it.
const requestableRoles = USER_ROLES.filter(r => r.value !== 'SuperAdmin').map(r => ({ label: r.label, value: r.value }))
const needsScope = computed(() => ['WardPA', 'RedemptionOfficer', 'AKBPAAdmin'].includes(profileForm.role))

const lgaStore = useLgaStore()
onMounted(() => lgaStore.ensureLoaded())
const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const wardOptions = computed(() => lgaStore.wardsForLga(profileForm.lgaId).map(w => ({ label: w.name, value: w.id })))

function onPhotoChange(e: Event) {
  photoName.value = (e.target as HTMLInputElement).files?.[0]?.name ?? ''
}
function onDocChange(e: Event) {
  docName.value = (e.target as HTMLInputElement).files?.[0]?.name ?? ''
}

async function onSubmitEmail() {
  error.value = ''
  if (!emailForm.email) { error.value = 'Email is required.'; return }
  loading.value = true
  try {
    await auth.requestEmailVerification(emailForm.email)
    step.value = 'verify'
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function onVerifyCode() {
  error.value = ''
  loading.value = true
  try {
    const valid = await auth.verifyEmailCode(emailForm.email, codeForm.code)
    if (!valid) {
      error.value = 'Incorrect code. Please try again.'
      return
    }
    step.value = 'profile'
  } finally {
    loading.value = false
  }
}

async function onSubmitProfile() {
  error.value = ''
  if (!profileForm.firstName || !profileForm.lastName || !profileForm.phone || !profileForm.nin) {
    error.value = 'Please complete all required fields.'
    return
  }
  if (needsScope.value && !profileForm.lgaId) {
    error.value = 'Please select an LGA.'
    return
  }
  if (profileForm.role === 'WardPA' && !profileForm.wardId) {
    error.value = 'Please select a ward.'
    return
  }
  if (!profileForm.consentData || !profileForm.consentTerms) {
    error.value = 'Please accept both consent statements to continue.'
    return
  }

  loading.value = true
  try {
    await auth.submitRegistration({
      firstName: profileForm.firstName,
      middleName: profileForm.middleName || undefined,
      lastName: profileForm.lastName,
      email: emailForm.email,
      phone: profileForm.phone,
      nin: profileForm.nin,
      role: profileForm.role,
      lgaId: profileForm.lgaId || undefined,
      wardId: profileForm.wardId || undefined,
      idDocumentName: docName.value || undefined,
    })
    step.value = 'done'
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
