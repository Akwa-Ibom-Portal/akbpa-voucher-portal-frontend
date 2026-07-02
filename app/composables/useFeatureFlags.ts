export function useFeatureFlags() {
  const config = useRuntimeConfig()
  return {
    publicForms: config.public.flagPublicForms as boolean,
    adminInquiries: config.public.flagAdminInquiries as boolean,
  }
}
