<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Programme Cycles</h1>
        <p class="text-sm text-gray-500">Vouchers and reports are scoped to a programme cycle. Only one cycle should be active at a time.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">New Cycle</UButton>
    </div>

    <UCard>
      <UTable :data="store.cycles" :columns="columns" :loading="store.loading">
        <template #isActive-cell="{ row }">
          <UBadge :color="row.original.isActive ? 'success' : 'neutral'" variant="subtle">{{ row.original.isActive ? 'Active' : 'Inactive' }}</UBadge>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" variant="ghost" icon="i-lucide-pencil" @click="openEdit(row.original)">Edit</UButton>
            <UButton
              v-if="!row.original.isActive" size="xs" variant="outline" color="success" icon="i-lucide-check"
              :loading="activatingId === row.original.id" @click="activate(row.original)"
            >Activate</UButton>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="modalOpen" :title="editing ? 'Edit Programme Cycle' : 'New Programme Cycle'">
      <template #body>
        <UForm :state="form" class="space-y-4" @submit="onSave">
          <UFormField label="Name" name="name" required>
            <UInput v-model="form.name" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Starts On" name="startsOn" required>
              <UInput v-model="form.startsOn" type="date" class="w-full" />
            </UFormField>
            <UFormField label="Ends On" name="endsOn" required>
              <UInput v-model="form.endsOn" type="date" class="w-full" />
            </UFormField>
          </div>
          <UAlert v-if="formError" color="error" variant="subtle" :title="formError" />
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="modalOpen = false">Close</UButton>
            <UButton type="submit" :loading="saving">{{ editing ? 'Save Changes' : 'Create Cycle' }}</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin'] })

import type { ProgrammeCycle } from '~/types'

const store = useProgrammeCyclesStore()
onMounted(() => store.fetchCycles())

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'startsOn', header: 'Starts On' },
  { accessorKey: 'endsOn', header: 'Ends On' },
  { accessorKey: 'isActive', header: 'Status' },
  { id: 'actions', header: '' },
]

const modalOpen = ref(false)
const editing = ref<ProgrammeCycle | null>(null)
const form = reactive({ name: '', startsOn: '', endsOn: '' })
const saving = ref(false)
const formError = ref('')
const activatingId = ref('')

function openCreate() {
  editing.value = null
  form.name = ''
  form.startsOn = ''
  form.endsOn = ''
  modalOpen.value = true
}

function openEdit(cycle: ProgrammeCycle) {
  editing.value = cycle
  form.name = cycle.name
  form.startsOn = cycle.startsOn?.slice(0, 10) ?? ''
  form.endsOn = cycle.endsOn?.slice(0, 10) ?? ''
  modalOpen.value = true
}

async function onSave() {
  formError.value = ''
  if (!form.name || !form.startsOn || !form.endsOn) {
    formError.value = 'Please complete all fields.'
    return
  }
  saving.value = true
  try {
    if (editing.value) {
      await store.updateCycle(editing.value.id, { name: form.name, startsOn: form.startsOn, endsOn: form.endsOn })
    } else {
      await store.createCycle({ name: form.name, startsOn: form.startsOn, endsOn: form.endsOn, isActive: false })
    }
    modalOpen.value = false
  } catch (e: any) {
    formError.value = e.response?.data?.message ?? e.message
  } finally {
    saving.value = false
  }
}

async function activate(cycle: ProgrammeCycle) {
  activatingId.value = cycle.id
  try {
    await store.activateCycle(cycle.id)
  } finally {
    activatingId.value = ''
  }
}
</script>
