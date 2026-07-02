<template>
  <div>
    <PageHero
      eyebrow="Report an Issue"
      title="Report a Complaint or Concern"
      subtitle="Complaints may be submitted through this form, by email, by telephone, or by visiting our office."
    />

    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-3 gap-6">
      <div class="sm:col-span-2 relative">
      <UCard>
        <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
          <UFormField label="Full Name" name="name" required>
            <UInput v-model="form.name" class="w-full" />
          </UFormField>
          <div class="grid sm:grid-cols-2 gap-4">
            <UFormField label="Phone Number" name="phone">
              <UInput v-model="form.phone" placeholder="080XXXXXXXX" class="w-full" />
            </UFormField>
            <UFormField label="Email Address" name="email">
              <UInput v-model="form.email" type="email" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Category" name="category">
            <USelect v-model="form.category" :items="categories" class="w-full" />
          </UFormField>
          <UFormField label="Details" name="details" required>
            <UTextarea v-model="form.details" rows="5" class="w-full" placeholder="Describe what happened, including location and date if relevant." />
          </UFormField>
          <UAlert v-if="submitted" color="success" variant="subtle" title="Your report has been recorded." description="A member of our team will follow up using the contact details provided." />
          <UAlert v-if="error" color="error" variant="subtle" :title="error" />
          <UButton type="submit" block size="lg" :loading="submitting">Submit Report</UButton>
        </UForm>
      </UCard>
      <!-- No-collection overlay (hidden when publicForms flag is on) -->
      <div v-if="!flags.publicForms" class="absolute inset-0 z-10 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/85 flex flex-col items-center justify-center gap-3 text-center p-8">
        <div class="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <UIcon name="i-lucide-clock" class="size-7 text-gray-400" />
        </div>
        <p class="text-lg font-bold text-gray-900 dark:text-white">We do not collect information at this moment</p>
        <p class="text-sm text-gray-500 max-w-xs">To report an issue, please use any of the contact channels listed alongside this form.</p>
      </div>
      </div>

      <UCard class="bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
        <p class="font-semibold text-gray-900 dark:text-white text-sm mb-3">Other Ways to Reach Us</p>
        <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li class="flex items-start gap-2"><UIcon name="i-lucide-phone" class="size-4 mt-0.5 text-akbpaGreen-600" /> +234 XXX XXX XXXX</li>
          <li class="flex items-start gap-2"><UIcon name="i-lucide-mail" class="size-4 mt-0.5 text-akbpaGreen-600" /> info@aksbpa.gov.ng</li>
          <li class="flex items-start gap-2"><UIcon name="i-lucide-map-pin" class="size-4 mt-0.5 text-akbpaGreen-600" /> Elegance Place, Plot 46 Unit B, Ewet Housing Estate, Uyo, Akwa Ibom State</li>
        </ul>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const flags = useFeatureFlags()

useSeoMeta({
  title: 'Report an Issue | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Report a complaint or concern to the Akwa Ibom State Bulk Purchase Agency.',
})

import { z } from 'zod'
import { submitInquiry } from '~/services/submissionsApi'

const categories = ['Voucher / Redemption Issue', 'Procurement Concern', 'Supplier / Farmer Issue', 'Staff Conduct', 'Other']

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  phone: optionalPhoneSchema,
  email: optionalEmailSchema,
  category: z.string().min(1),
  details: z.string().trim().min(10, 'Please provide at least 10 characters describing the issue'),
})

const form = reactive({ name: '', phone: '', email: '', category: categories[0]!, details: '' })
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  submitting.value = true
  try {
    await submitInquiry({
      type: 'report_issue',
      fullName: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      fields: { category: form.category, details: form.details },
    })
    submitted.value = true
    form.name = ''
    form.phone = ''
    form.email = ''
    form.details = ''
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Could not submit your report right now. Please try again shortly.'
  } finally {
    submitting.value = false
  }
}
</script>
