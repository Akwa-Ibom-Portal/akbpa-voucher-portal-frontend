<template>
  <div :class="$attrs.class">
    <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ label }}</dt>
    <dd v-if="value" class="mt-0.5 text-sm text-gray-900 dark:text-white" :class="mono ? 'font-mono break-all' : ''">{{ value }}</dd>
    <dd v-else class="mt-0.5 text-sm text-gray-400">—</dd>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ label: string; value?: string; mono?: boolean }>()
</script>
