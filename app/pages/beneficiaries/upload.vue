<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Upload Beneficiaries</h1>
      <p class="text-sm text-gray-500">Bulk-import Social Register records from a CSV file.</p>
    </div>

    <UCard>
      <template #header>
        <p class="font-semibold text-gray-900 dark:text-white text-sm">Required Columns</p>
      </template>
      <p class="text-sm text-gray-500">
        beneficiaryCode · fullName · gender · phone · lgaId · wardId · address · householdSize
      </p>
      <UButton class="mt-3" size="sm" color="neutral" variant="outline" icon="i-lucide-download" :loading="downloadingTemplate" @click="onDownloadTemplate">
        Download CSV Template
      </UButton>
    </UCard>

    <UCard>
      <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center hover:border-akbpaGreen-400 transition-colors cursor-pointer"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <UIcon name="i-lucide-file-spreadsheet" class="size-10 text-gray-400 mx-auto mb-3" />
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Click to choose a file, or drag and drop</p>
        <p class="text-xs text-gray-400 mt-1">.csv, up to 10MB</p>
        <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onFileChange" />
      </div>

      <div v-if="fileName" class="mt-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
        <div class="flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-file-check-2" class="size-4 text-akbpaGreen-600" />
          {{ fileName }}
        </div>
        <UButton size="sm" :loading="processing" @click="processUpload">Process Upload</UButton>
      </div>

      <UAlert v-if="uploadError" color="error" variant="subtle" :title="uploadError" class="mt-4" />

      <div v-if="result" class="mt-6 space-y-3">
        <UAlert color="success" variant="subtle" :title="`${result.inserted} records inserted`" />
        <UAlert v-if="result.errors.length" color="warning" variant="subtle" :title="`${result.errors.length} row(s) need attention`">
          <ul class="text-sm list-disc ms-4 mt-1">
            <li v-for="(e, i) in result.errors" :key="i">{{ e }}</li>
          </ul>
        </UAlert>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['auth', 'role'], role: ['Super Admin', 'AKBPA Admin'] })

import { downloadBeneficiaryTemplate } from '~/services/beneficiariesApi'

const beneficiariesStore = useBeneficiariesStore()

const fileInput = ref<HTMLInputElement>()
const fileName = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const processing = ref(false)
const downloadingTemplate = ref(false)
const uploadError = ref('')
const result = ref<{ inserted: number; errors: string[] } | null>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) { fileName.value = file.name; selectedFile.value = file }
  result.value = null
}
function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) { fileName.value = file.name; selectedFile.value = file }
  result.value = null
}

async function onDownloadTemplate() {
  downloadingTemplate.value = true
  try {
    const blob = await downloadBeneficiaryTemplate()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beneficiary-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    downloadingTemplate.value = false
  }
}

async function processUpload() {
  if (!selectedFile.value) return
  processing.value = true
  uploadError.value = ''
  try {
    const csv = await selectedFile.value.text()
    result.value = await beneficiariesStore.uploadCsv(csv)
  } catch (e: any) {
    uploadError.value = e.response?.data?.message ?? e.message
  } finally {
    processing.value = false
  }
}
</script>
