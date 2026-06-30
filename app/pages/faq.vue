<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
      <UBadge color="primary" variant="subtle">FAQs</UBadge>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-3">Frequently Asked Questions</h1>
    </div>

    <UAccordion
      :items="faqs"
      :ui="{
        root: 'space-y-3',
        item: 'border border-gray-200 dark:border-gray-800 rounded-xl px-4 sm:px-5 bg-white dark:bg-gray-900 hover-lift',
        trigger: 'py-4 text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:text-akbpaGreen-700 dark:hover:text-akbpaGreen-400',
        leadingIcon: 'text-akbpaOrange-500 size-5',
        trailingIcon: 'text-akbpaGreen-600 dark:text-akbpaGreen-400 size-5',
        body: 'text-sm text-gray-600 dark:text-gray-300 leading-relaxed pb-4',
      }"
    />

    <UCard class="mt-10 text-center bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
      <p class="font-semibold text-gray-900 dark:text-white">Still have questions?</p>
      <p class="text-sm text-gray-500 mt-1">
        <NuxtLink to="/contact" class="text-akbpaGreen-700 hover:underline">Contact the Agency</NuxtLink>
        or speak with your Ward PA.
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

const faqs = [
  {
    icon: 'i-lucide-circle-help',
    label: 'What is the Bulk Purchase Agency and Food Security Program all about?',
    content: 'The Food Security Scheme is an intervention program of the Akwa Ibom State Bulk Purchase Agency designed to offer staple food items to vulnerable members of the state as captured on the recently updated Social Register. It provides essential foodstuffs at designated redemption centers in various designated market stalls and shops across the 31 Local Government Areas (LGAs) in Akwa Ibom State.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'When was the Bulk Purchase Agency and Food Program announced?',
    content: 'The Akwa Ibom State Governor, His Excellency, Pastor Umo Eno, announced his intention to establish the State Bulk Purchase Agency on Friday, February 10, 2024. He thereafter proposed an Executive Bill to the State House of Assembly which was promptly passed by the House and given assent to by the Governor on 14th March 2024.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'What days are the food redemption centers open?',
    content: 'The Food Reception Centers are open every day — Monday to Saturday, from 10:00 AM to 5:00 PM.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Where are the food redemption centers located?',
    content: 'In market stalls and shops in your locality, across all 31 LGAs of the State.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Which food items are available for distribution?',
    content: 'The foodstuffs available are Garri – 5kg, Rice – 5kg, and Beans – 5kg.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'How do I qualify for the food vouchers?',
    content: "To qualify for the food voucher, your name must be on the Social Register of the State. You may also be identified as 'needy' by a government agency.",
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Are there any limits to how much food I can redeem at the centers?',
    content: 'Yes, there is a redemption limit on each food item per beneficiary, to ensure that as many people as possible can benefit from the available foodstuff.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Is the Akwa Ibom State Bulk Purchase Agency Food Security Program a permanent program?',
    content: 'It is an interventionist program which will work side by side with the Back-to-Farm Initiative to ensure availability, affordability, and price reduction in food items in the markets.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Is there any payment involved in the program?',
    content: 'Each food item will be given out free, in the quantities listed on the Food Vouchers, which will be given to you at your ward.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'How do I get food vouchers?',
    content: "At your ward, you will be given the Food Vouchers by a representative of the State Government, provided your name is in the Social Register and you have been identified as 'needy' by a government agency.",
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'How can I redeem my Food Voucher?',
    content: 'Vouchers can be redeemed at any market stall or shop displaying a redemption sign.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Where do I take the food vouchers for redemption?',
    content: 'To the Food Agent located in your markets or shops. There you will hand over the voucher and collect the quantity of food written against it.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Who can register with the Agency?',
    content: "Eligible farmers, cooperatives, suppliers, processors, and approved organizations may register through the Agency's registration portal.",
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'How do I become a government supplier?',
    content: "Complete the supplier registration process, submit the required documentation, and meet the Agency's accreditation requirements.",
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Where are food redemption centres located?',
    content: 'Our Redemption Centre Locator provides information on approved centres across the State.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'How can I report a complaint?',
    content: 'Complaints may be submitted through our online complaint portal, email, telephone, or by visiting our office.',
  },
  {
    icon: 'i-lucide-circle-help',
    label: 'Where can I access procurement opportunities?',
    content: 'Current procurement opportunities are published in the Procurement section of this website.',
  },
]
</script>
