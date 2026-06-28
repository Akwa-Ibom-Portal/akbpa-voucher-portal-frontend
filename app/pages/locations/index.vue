<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Locations</h1>
      <p class="text-sm text-gray-500">LGAs and wards used to scope users, beneficiaries, and voucher allocation.</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">LGAs ({{ lgaStore.lgas.length }})</p>
            <UButton size="xs" icon="i-lucide-plus" @click="lgaModalOpen = true">Add LGA</UButton>
          </div>
        </template>
        <UTable :data="lgaStore.lgas" :columns="lgaColumns" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <p class="font-semibold text-gray-900 dark:text-white text-sm">Wards ({{ lgaStore.wards.length }})</p>
            <UButton size="xs" icon="i-lucide-plus" @click="wardModalOpen = true">Add Ward</UButton>
          </div>
        </template>
        <UTable :data="lgaStore.wards" :columns="wardColumns" />
      </UCard>
    </div>

    <UModal v-model:open="lgaModalOpen" title="Add LGA">
      <template #body>
        <UForm :state="lgaForm" class="space-y-4" @submit="onSaveLga">
          <UFormField label="Name" name="name" required>
            <UInput v-model="lgaForm.name" class="w-full" />
          </UFormField>
          <UFormField label="Code" name="code" required>
            <UInput v-model="lgaForm.code" class="w-full" />
          </UFormField>
          <UAlert v-if="lgaError" color="error" variant="subtle" :title="lgaError" />
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="lgaModalOpen = false">Close</UButton>
            <UButton type="submit" :loading="savingLga">Add LGA</UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <UModal v-model:open="wardModalOpen" title="Add Ward">
      <template #body>
        <UForm :state="wardForm" class="space-y-4" @submit="onSaveWard">
          <UFormField label="LGA" name="lgaId" required>
            <USelect v-model="wardForm.lgaId" :items="lgaOptions" class="w-full" />
          </UFormField>
          <UFormField label="Name" name="name" required>
            <UInput v-model="wardForm.name" class="w-full" />
          </UFormField>
          <UFormField label="Code" name="code" required>
            <UInput v-model="wardForm.code" class="w-full" />
          </UFormField>
          <UAlert v-if="wardError" color="error" variant="subtle" :title="wardError" />
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="wardModalOpen = false">Close</UButton>
            <UButton type="submit" :loading="savingWard">Add Ward</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin'] })

import { createLga, createWard } from '~/services/lgaApi'

const lgaStore = useLgaStore()
onMounted(() => lgaStore.ensureLoaded())

const lgaColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'code', header: 'Code' },
]
const wardColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'lgaId', header: 'LGA', cell: ({ row }: any) => lgaStore.lgaName(row.getValue('lgaId')) },
]

const lgaOptions = computed(() => lgaStore.lgas.map(l => ({ label: l.name, value: l.id })))

const lgaModalOpen = ref(false)
const lgaForm = reactive({ name: '', code: '' })
const savingLga = ref(false)
const lgaError = ref('')

async function onSaveLga() {
  lgaError.value = ''
  if (!lgaForm.name || !lgaForm.code) { lgaError.value = 'Please complete all fields.'; return }
  savingLga.value = true
  try {
    const created = await createLga({ name: lgaForm.name, code: lgaForm.code })
    lgaStore.lgas.push(created)
    lgaModalOpen.value = false
    lgaForm.name = ''
    lgaForm.code = ''
  } catch (e: any) {
    lgaError.value = e.response?.data?.message ?? e.message
  } finally {
    savingLga.value = false
  }
}

const wardModalOpen = ref(false)
const wardForm = reactive({ lgaId: '', name: '', code: '' })
const savingWard = ref(false)
const wardError = ref('')

async function onSaveWard() {
  wardError.value = ''
  if (!wardForm.lgaId || !wardForm.name || !wardForm.code) { wardError.value = 'Please complete all fields.'; return }
  savingWard.value = true
  try {
    const created = await createWard({ lgaId: wardForm.lgaId, name: wardForm.name, code: wardForm.code })
    lgaStore.wards.push(created)
    wardModalOpen.value = false
    wardForm.name = ''
    wardForm.code = ''
  } catch (e: any) {
    wardError.value = e.response?.data?.message ?? e.message
  } finally {
    savingWard.value = false
  }
}
</script>
