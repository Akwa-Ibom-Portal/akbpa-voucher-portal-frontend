<template>
  <UInput
    :model-value="modelValue"
    :type="visible ? 'text' : 'password'"
    icon="i-lucide-lock"
    :placeholder="placeholder"
    class="w-full"
    @update:model-value="$emit('update:modelValue', String($event))"
  >
    <template #trailing>
      <UButton
        :icon="visible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        color="neutral"
        variant="link"
        size="sm"
        square
        :aria-label="visible ? 'Hide password' : 'Show password'"
        @click="visible = !visible"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
const visible = ref(false)
</script>
