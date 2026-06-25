<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-akbpaGreen-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 px-4 py-10 relative">
    <UColorModeButton class="absolute top-4 right-4" />
    <div class="w-full max-w-3xl">
      <div class="flex flex-col items-center mb-8">
        <img src="/images/akwa-ibom-logo.jpeg" alt="Government of Akwa Ibom State" class="h-16 w-16 rounded-full object-cover shadow-md" />
        <h1 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">AKBPA Food Voucher Portal</h1>
        <p class="text-sm text-gray-500">Akwa Ibom Bulk Purchase Agency</p>
      </div>
      <UCard :ui="{ root: 'shadow-xl ring-1 ring-gray-200 dark:ring-gray-800' }">
        <slot />
      </UCard>
      <p class="text-center text-xs text-gray-400 mt-6">
        Authorised personnel only. All access is logged and monitored.
      </p>
    </div>
  </div>
</template>
