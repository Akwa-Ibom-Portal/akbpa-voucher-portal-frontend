<template>
  <div>
    <PageHero
      eyebrow="Farmer Partnership Programme"
      title="Register as a Farmer"
      subtitle="Connect with government procurement opportunities and strengthen your agricultural production through AKSBPA's Farmer Partnership Programme."
    />

    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10">
      <div v-reveal>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Why Register?</h2>
        <ul class="space-y-3">
          <li v-for="b in benefits" :key="b" class="flex items-start gap-3 text-sm text-gray-600 dark:text-white/80">
            <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 mt-0.5 shrink-0" />
            {{ b }}
          </li>
        </ul>

        <h2 class="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-3">Who Can Register?</h2>
        <p class="text-sm text-gray-600 dark:text-white/80 leading-relaxed">
          Eligible farmers, cooperatives, processors, and approved agricultural
          organizations operating in Akwa Ibom State may register through this
          programme. Registration is the first step toward participating in the
          Agency's procurement and market opportunities.
        </p>
      </div>

      <UCard>
        <template #header>
          <p class="font-semibold text-gray-900 dark:text-white">Register Your Interest</p>
          <p class="text-xs text-gray-500 mt-1">A member of our Farmer Partnerships team will reach out to complete your registration.</p>
        </template>
        <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
          <UFormField label="Full Name / Cooperative Name" name="name" required>
            <UInput v-model="form.name" class="w-full" />
          </UFormField>
          <UFormField label="Phone Number" name="phone" required>
            <UInput v-model="form.phone" placeholder="080XXXXXXXX" class="w-full" />
          </UFormField>
          <UFormField label="Email Address" name="email">
            <UInput v-model="form.email" type="email" class="w-full" />
          </UFormField>
          <UFormField label="Local Government Area" name="lga" required>
            <UInput v-model="form.lga" class="w-full" />
          </UFormField>
          <UFormField label="Primary Commodity" name="commodity">
            <USelect v-model="form.commodity" :items="['Rice', 'Beans', 'Garri / Cassava', 'Maize', 'Vegetables', 'Other']" class="w-full" />
          </UFormField>
          <UAlert v-if="submitted" color="success" variant="subtle" title="Thank you — your interest has been recorded." description="Our team will contact you using the details provided." />
          <UAlert v-if="error" color="error" variant="subtle" :title="error" />
          <UButton type="submit" block size="lg" :loading="submitting">Submit Registration Interest</UButton>
        </UForm>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Register as a Farmer | AKSBPA Farmer Partnership Programme',
  description: 'Register as a farmer with the Akwa Ibom State Bulk Purchase Agency to access procurement opportunities and strengthen your agricultural production.',
})

import { z } from 'zod'
import { submitInquiry } from '~/services/submissionsApi'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name or cooperative name'),
  phone: phoneSchema,
  email: optionalEmailSchema,
  lga: z.string().trim().min(2, 'Enter your Local Government Area'),
  commodity: z.string().min(1),
})

const benefits = [
  'Access to structured government procurement opportunities.',
  'Stronger market linkages through approved purchasing programmes.',
  'Support for increased agricultural productivity.',
  'Participation in farmer engagement and capacity-building activities.',
]

const form = reactive({ name: '', phone: '', email: '', lga: '', commodity: 'Rice' })
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  submitted.value = false
  submitting.value = true
  try {
    await submitInquiry({
      type: 'farmer_registration',
      fullName: form.name,
      phone: form.phone,
      email: form.email || undefined,
      fields: { lga: form.lga, commodity: form.commodity },
    })
    submitted.value = true
    form.name = ''
    form.phone = ''
    form.email = ''
    form.lga = ''
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Could not submit your registration right now. Please try again shortly.'
  } finally {
    submitting.value = false
  }
}
</script>
