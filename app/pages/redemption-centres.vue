<template>
  <div>
    <PageHero
      eyebrow="Redemption Centre Locator"
      title="Find a Food Redemption Centre Near You"
      subtitle="Approved food vouchers are redeemed at designated market stalls and shops across all 31 Local Government Areas of Akwa Ibom State."
    />

    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <UCard>
        <div class="grid sm:grid-cols-2 gap-3">
          <UFormField label="Local Government Area">
            <USelect :items="lgas" placeholder="Select your LGA" class="w-full" disabled />
          </UFormField>
          <UFormField label="Ward">
            <USelect :items="[]" placeholder="Select your ward" class="w-full" disabled />
          </UFormField>
        </div>
        <div class="text-center py-10">
          <UIcon name="i-lucide-map-pin" class="size-10 text-gray-300 mx-auto mb-3" />
          <p class="text-sm text-gray-500">The full redemption centre directory is being finalized.</p>
          <p class="text-sm text-gray-400 mt-1">In the meantime, ask your Ward PA or visit any market stall or shop displaying the AKSBPA redemption sign.</p>
        </div>
      </UCard>

      <UCard class="mt-6 text-center bg-akbpaGreen-50 dark:bg-akbpaGreen-950 border-none">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Redemption centres are open every day, Monday to Saturday, from 10:00 AM to 5:00 PM.
        </p>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'public' })

useSeoMeta({
  title: 'Redemption Centre Locator | Akwa Ibom State Bulk Purchase Agency (AKSBPA)',
  description: 'Locate approved food voucher redemption centres across all 31 Local Government Areas of Akwa Ibom State.',
})

const lgas = [
  'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan',
  'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene',
  'Ini', 'Itu', 'Mbo', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara',
  'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo',
]
</script>
