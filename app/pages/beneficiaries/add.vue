<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Add Beneficiary</h1>
      <p class="text-sm text-gray-500">Manually add a single record to the Social Register.</p>
    </div>

    <UCard>
      <UForm :state="form" class="grid sm:grid-cols-2 gap-4" @submit="onSubmit">
        <UFormField label="Beneficiary ID" name="beneficiaryCode">
          <UInput v-model="form.beneficiaryCode" placeholder="RC10501" class="w-full" />
        </UFormField>
        <UFormField label="Household ID" name="householdId">
          <UInput v-model="form.householdId" placeholder="HH-50101" class="w-full" />
        </UFormField>
        <UFormField label="First Name" name="firstName">
          <UInput v-model="form.firstName" class="w-full" />
        </UFormField>
        <UFormField label="Surname" name="surname">
          <UInput v-model="form.surname" class="w-full" />
        </UFormField>
        <UFormField label="Gender" name="gender">
          <USelect v-model="form.gender" :items="['Male', 'Female']" class="w-full" />
        </UFormField>
        <UFormField label="Phone Number" name="phone">
          <UInput v-model="form.phone" placeholder="080XXXXXXXX" class="w-full" />
        </UFormField>
        <UFormField label="NIN" name="nin">
          <UInput v-model="form.nin" placeholder="National Identification Number" class="w-full" />
        </UFormField>
        <UFormField label="LGA" name="lgaId">
          <USelect v-model="form.lgaId" :items="lgaOptions" class="w-full" @change="form.wardId = ''" />
        </UFormField>
        <UFormField label="Ward" name="wardId" class="sm:col-span-2">
          <USelect v-model="form.wardId" :items="wardOptions" :disabled="!form.lgaId" class="w-full" />
        </UFormField>
        <UFormField label="Address" name="address" class="sm:col-span-2">
          <UTextarea v-model="form.address" class="w-full" />
        </UFormField>

        <UAlert v-if="submitted" color="success" variant="subtle" title="Beneficiary added to the Social Register." class="sm:col-span-2" />
        <UAlert v-if="error" color="error" variant="subtle" :title="error" class="sm:col-span-2" />

        <div class="sm:col-span-2 flex justify-end gap-2">
          <UButton to="/beneficiaries" color="neutral" variant="ghost">Cancel</UButton>
          <UButton type="submit" :loading="loading">Save Beneficiary</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin'] })

const lgaStore = useLgaStore()
const beneficiariesStore = useBeneficiariesStore()
onMounted(() => lgaStore.ensureLoaded())

const form = reactive({
  beneficiaryCode: '', householdId: '', firstName: '', surname: '',
  gender: 'Female' as 'Male' | 'Female', phone: '', nin: '', lgaId: '', wardId: '', address: '',
})
const submitted = ref(false)
const loading = ref(false)
const error = ref('')

const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))
const wardOptions = computed(() => lgaStore.wardsForLga(form.lgaId).map(w => ({ label: w.name, value: w.id })))

async function onSubmit() {
  error.value = ''
  submitted.value = false
  loading.value = true
  try {
    await beneficiariesStore.addBeneficiary({
      beneficiaryCode: form.beneficiaryCode,
      householdId: form.householdId,
      firstName: form.firstName,
      surname: form.surname,
      gender: form.gender,
      phone: form.phone,
      nin: form.nin,
      lgaId: form.lgaId,
      wardId: form.wardId,
      address: form.address,
      community: lgaStore.wardName(form.wardId),
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e.message ?? 'Failed to add beneficiary'
  } finally {
    loading.value = false
  }
}
</script>
