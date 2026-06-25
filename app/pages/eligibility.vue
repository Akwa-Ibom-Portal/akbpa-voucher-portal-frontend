<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
      <UBadge color="primary" variant="subtle">Eligibility Criteria</UBadge>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-3">Who Can Receive a Food Voucher?</h1>
      <p class="text-gray-500 mt-2 max-w-2xl mx-auto">
        The Stable Food Relief Programme is targeted exclusively at persons already
        captured on the Akwa Ibom State Social Register.
      </p>
    </div>

    <div class="grid sm:grid-cols-2 gap-6 mb-12">
      <UCard v-for="c in criteria" :key="c.title">
        <div class="flex gap-3">
          <UIcon name="i-lucide-check-circle-2" class="size-5 text-akbpaGreen-600 shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">{{ c.title }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ c.desc }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">A Beneficiary Will Not Be Eligible If…</h2>
    <ul class="space-y-3 mb-12">
      <li v-for="x in exclusions" :key="x" class="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
        <UIcon name="i-lucide-x-circle" class="size-5 text-rose-500 shrink-0 mt-0.5" />
        {{ x }}
      </li>
    </ul>

    <UCard class="bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none text-center">
      <p class="font-semibold text-gray-900 dark:text-white">Think you should be on the Social Register?</p>
      <p class="text-sm text-gray-500 mt-1">Contact your Ward PA or the AKBPA office in your LGA to confirm your registration status.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const criteria = [
  { title: 'Registered on the Social Register', desc: 'You must already be captured on the Akwa Ibom State Social Register at your LGA and ward.' },
  { title: 'Resident in Akwa Ibom State', desc: 'Vouchers are issued and redeemable only within the beneficiary\'s registered LGA and ward.' },
  { title: 'Valid Beneficiary ID & Household ID', desc: 'Your record must carry a unique Beneficiary ID and Household ID with no flagged duplicates.' },
  { title: 'One Voucher Per Item Per Cycle', desc: 'Each beneficiary may receive one rice, one beans, and one garri voucher per programme cycle.' },
]

const exclusions = [
  'You are not found on the verified Social Register for your LGA and ward.',
  'Your record has been flagged as a duplicate (matching Beneficiary ID, Household ID, or phone number).',
  'You have already redeemed a voucher for the same food item in the current programme cycle.',
  'Your registered ward does not match the ward where you are attempting to collect a voucher.',
]
</script>
