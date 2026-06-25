<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
      <UBadge color="primary" variant="subtle">FAQs</UBadge>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-3">Frequently Asked Questions</h1>
    </div>

    <UAccordion :items="faqs" />

    <UCard class="mt-10 text-center bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
      <p class="font-semibold text-gray-900 dark:text-white">Still have questions?</p>
      <p class="text-sm text-gray-500 mt-1">Reach out to AKBPA or speak with your Ward PA.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const faqs = [
  {
    label: 'What food items are included in the voucher programme?',
    content: 'Rice, beans and garri — each issued as a 5kg bag per voucher.',
  },
  {
    label: 'How do I know if I am on the Social Register?',
    content: 'Contact your Ward PA or the AKBPA office in your LGA. They can search the register using your name, Beneficiary ID, or Household ID.',
  },
  {
    label: 'How is the QR code on my voucher kept secure?',
    content: 'Each QR code encodes a random, cryptographically secure token — never your personal data or a database ID. The token is hashed and matched against the system only at the point of redemption.',
  },
  {
    label: 'Can I redeem the same voucher twice?',
    content: 'No. Once a voucher is scanned and redeemed, it is permanently locked and cannot be used again, even if presented at a different collection point.',
  },
  {
    label: 'What happens if my voucher expires?',
    content: 'Vouchers are valid for 3 months from the date of issue. Expired vouchers cannot be redeemed. Contact your Ward PA if you believe this is in error.',
  },
  {
    label: 'Who issues the voucher to me?',
    content: 'Normally your Ward PA. In some distribution cycles, AKBPA staff or Redemption Officers may issue and redeem vouchers directly in the field — for example, when trucks deliver food at the LGA headquarters.',
  },
  {
    label: 'What if I receive the wrong item at redemption?',
    content: 'A rice voucher can only be redeemed for rice — never beans or garri. If this happens, please report it immediately to the AKBPA admin team; it will be visible in the audit log.',
  },
  {
    label: 'How can I report a lost or stolen voucher?',
    content: 'Report it to your Ward PA or the AKBPA office immediately so it can be flagged in the system before it is used by someone else.',
  },
]
</script>
