<template>
  <div>
    <PageHero
      eyebrow="Contact Us"
      title="Get in Touch"
      subtitle="We'd love to hear from farmers, suppliers, partners, and the public we serve."
    />

    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="relative">
        <UCard>
          <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
            <div class="grid sm:grid-cols-2 gap-4">
              <UFormField label="Full Name" name="name" required>
                <UInput v-model="form.name" class="w-full" />
              </UFormField>
              <UFormField label="Email Address" name="email" required>
                <UInput v-model="form.email" type="email" class="w-full" />
              </UFormField>
            </div>
            <UFormField label="Subject" name="subject" required>
              <UInput v-model="form.subject" class="w-full" />
            </UFormField>
            <UFormField label="Message" name="message" required>
              <UTextarea v-model="form.message" rows="5" class="w-full" />
            </UFormField>
            <UAlert v-if="submitted" color="success" variant="subtle" title="Message sent." description="Thank you for reaching out — we'll respond as soon as possible." />
            <UAlert v-if="error" color="error" variant="subtle" :title="error" />
            <UButton type="submit" block size="lg" :loading="submitting">Send Message</UButton>
          </UForm>
        </UCard>
        <!-- No-collection overlay (hidden when publicForms flag is on) -->
        <div v-if="!flags.publicForms" class="absolute inset-0 z-10 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/85 flex flex-col items-center justify-center gap-3 text-center p-8">
          <div class="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="size-7 text-gray-400" />
          </div>
          <p class="text-lg font-bold text-gray-900 dark:text-white">We do not collect information at this moment</p>
          <p class="text-sm text-gray-500 max-w-xs">Check back soon — this contact form will be active shortly.</p>
        </div>
        </div>
      </div>

      <div class="space-y-5">
        <UCard>
          <p class="font-semibold text-gray-900 dark:text-white text-sm mb-3">Contact Information</p>
          <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li class="flex items-start gap-2"><UIcon name="i-lucide-map-pin" class="size-4 mt-0.5 text-akbpaGreen-600" /> Elegance Place, Plot 46 Unit B, Ewet Housing Estate, Uyo, Akwa Ibom State</li>
            <li class="flex items-start gap-2"><UIcon name="i-lucide-phone" class="size-4 mt-0.5 text-akbpaGreen-600" /> +234 XXX XXX XXXX</li>
            <li class="flex items-start gap-2"><UIcon name="i-lucide-mail" class="size-4 mt-0.5 text-akbpaGreen-600" /> info@aksbpa.gov.ng</li>
            <li class="flex items-start gap-2"><UIcon name="i-lucide-clock" class="size-4 mt-0.5 text-akbpaGreen-600" /> Monday–Friday, 8:00 a.m.–4:00 p.m.</li>
          </ul>
        </UCard>
        <UCard class="bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Have a complaint instead? Use our
            <NuxtLink to="/report-issue" class="text-akbpaGreen-700 font-medium hover:underline">Report an Issue</NuxtLink>
            form for faster routing.
          </p>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const flags = useFeatureFlags()

useSeoMeta({
  title: 'Contact Us | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Get in touch with the Akwa Ibom State Bulk Purchase Agency — address, phone, email, and working hours.',
})

import { z } from 'zod'
import { submitInquiry } from '~/services/submissionsApi'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  email: emailSchema,
  subject: z.string().trim().min(3, 'Enter a subject'),
  message: z.string().trim().min(10, 'Message should be at least 10 characters'),
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  submitting.value = true
  try {
    await submitInquiry({
      type: 'contact_message',
      fullName: form.name,
      email: form.email,
      fields: { subject: form.subject, message: form.message },
    })
    submitted.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Could not send your message right now. Please try again shortly.'
  } finally {
    submitting.value = false
  }
}
</script>
