<template>
  <div>
    <PageHero
      eyebrow="Supplier Accreditation"
      title="Become a Supplier"
      subtitle="Join AKSBPA's network of accredited food suppliers and participate in transparent, competitive government procurement."
    />

    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10">
      <div v-reveal>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">How It Works</h2>
        <ol class="space-y-3">
          <li v-for="(s, i) in steps" :key="s" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
            <span class="h-6 w-6 shrink-0 rounded-full bg-akbpaGreen-100 dark:bg-akbpaGreen-900 text-akbpaGreen-700 dark:text-akbpaGreen-300 flex items-center justify-center text-xs font-semibold">{{ i + 1 }}</span>
            {{ s }}
          </li>
        </ol>

        <h2 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-3">Who Can Apply?</h2>
        <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed">
          Registered businesses, cooperatives, processors, and logistics providers
          with the capacity to supply staple food commodities at the quality and
          volume required by the Agency's procurement programmes.
        </p>
      </div>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">Start Your Application</p>
          <p class="text-xs text-gray-500 mt-1">Our Procurement and Supply Chain team will follow up with the required documentation checklist.</p>
        </template>
        <UForm :state="form" class="space-y-4" @submit="onSubmit">
          <UFormField label="Business / Cooperative Name" name="businessName" required>
            <UInput v-model="form.businessName" class="w-full" />
          </UFormField>
          <UFormField label="Contact Person" name="contactPerson" required>
            <UInput v-model="form.contactPerson" class="w-full" />
          </UFormField>
          <UFormField label="Phone Number" name="phone" required>
            <UInput v-model="form.phone" placeholder="080XXXXXXXX" class="w-full" />
          </UFormField>
          <UFormField label="Email Address" name="email" required>
            <UInput v-model="form.email" type="email" class="w-full" />
          </UFormField>
          <UFormField label="RC / Registration Number" name="rcNumber">
            <UInput v-model="form.rcNumber" class="w-full" />
          </UFormField>
          <UFormField label="Commodity Category" name="commodity">
            <USelect v-model="form.commodity" :items="['Rice', 'Beans', 'Garri', 'Logistics / Haulage', 'Storage / Warehousing', 'Other']" class="w-full" />
          </UFormField>
          <UAlert v-if="submitted" color="success" variant="subtle" title="Thank you — your application has been received." description="Our Procurement team will contact you with next steps." />
          <UAlert v-if="error" color="error" variant="subtle" :title="error" />
          <UButton type="submit" block size="lg" :loading="submitting">Submit Application</UButton>
        </UForm>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Become a Supplier | AKSBPA Supplier Accreditation',
  description: 'Apply to become an accredited food supplier with the Akwa Ibom State Bulk Purchase Agency through a transparent procurement and accreditation process.',
})

const steps = [
  'Complete the supplier registration form with your business and contact details.',
  'Submit the required documentation, including registration and compliance certificates.',
  'Meet the Agency\'s accreditation requirements and quality standards.',
  'Receive confirmation and access to current procurement opportunities.',
]

import { submitInquiry } from '~/services/submissionsApi'

const form = reactive({ businessName: '', contactPerson: '', phone: '', email: '', rcNumber: '', commodity: 'Rice' })
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  submitting.value = true
  try {
    await submitInquiry({
      type: 'supplier_registration',
      fullName: form.contactPerson,
      phone: form.phone,
      email: form.email,
      fields: { businessName: form.businessName, rcNumber: form.rcNumber || undefined, commodity: form.commodity },
    })
    submitted.value = true
    form.businessName = ''
    form.contactPerson = ''
    form.phone = ''
    form.email = ''
    form.rcNumber = ''
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Could not submit your application right now. Please try again shortly.'
  } finally {
    submitting.value = false
  }
}
</script>
