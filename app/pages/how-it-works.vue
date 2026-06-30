<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
      <UBadge color="primary" variant="subtle">Quick Steps</UBadge>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-3">How the Food Voucher Programme Works</h1>
      <p class="text-gray-500 mt-2 max-w-2xl mx-auto">
        From the Social Register to a bag of rice, beans or garri in your hands — here's the full journey of a voucher.
      </p>
    </div>

    <ol class="relative border-s border-gray-200 dark:border-gray-800 ms-3">
      <li v-for="(step, i) in steps" :key="step.title" class="mb-10 ms-8">
        <span class="absolute -start-4 flex items-center justify-center w-8 h-8 rounded-full bg-akbpaGreen-500 text-white text-sm font-semibold">
          {{ i + 1 }}
        </span>
        <h3 class="font-semibold text-gray-900 dark:text-white">{{ step.title }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ step.desc }}</p>
      </li>
    </ol>

    <UCard class="mt-6 bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
      <div class="flex gap-3">
        <UIcon name="i-lucide-info" class="size-5 text-akbpaGreen-600 shrink-0 mt-0.5" />
        <p class="text-sm text-akbpaGreen-800 dark:text-akbpaGreen-200">
          Vouchers are valid for <strong>3 months</strong> from issue. Each beneficiary may
          receive one voucher per food item per programme cycle. Lost or expired vouchers
          should be reported to your Ward PA or the AKSBPA office.
        </p>
      </div>
    </UCard>

    <div class="text-center mt-10">
      <UButton to="/eligibility" size="lg">Check Eligibility Criteria</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const steps = [
  { title: 'Registration on the Social Register', desc: 'Beneficiaries are identified and uploaded to the Social Register at LGA and ward level, either in bulk via Excel or added manually by a Social Register Officer.' },
  { title: 'Secure Voucher Generation', desc: 'AKBPA Admin generates a batch of QR-coded vouchers for a specific food item (rice, beans or garri). Each code carries a unique serial number and a securely hashed token — never a plain database ID.' },
  { title: 'Printing & Verification', desc: 'QR images are sent to the approved printer, who produces the physical voucher with government branding and security features. Returned batches are scanned back into the system and spot-checked before distribution.' },
  { title: 'Allocation', desc: 'Verified vouchers are allocated to an LGA, ward, or directly to a field distribution team for redemption.' },
  { title: 'Issuance', desc: 'A Ward PA — or an AKBPA Admin / Redemption Officer operating in the field — issues a voucher to an eligible, verified beneficiary on the Social Register.' },
  { title: 'Redemption at a Collection Point', desc: 'The beneficiary presents the voucher at a food collection point. A Redemption Officer scans the QR code; the system validates the hash, checks status and item type, then releases the 5kg bag.' },
  { title: 'Locked for Good', desc: 'Once redeemed, the voucher is permanently locked — it cannot be scanned or used again.' },
]
</script>
