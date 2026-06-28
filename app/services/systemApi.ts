/**
 * Health and bootstrap are operational/devops endpoints, not user-facing flows — there is
 * no corresponding screen in the Developer Guide's §9 screen inventory. Exposed here so
 * they're integrated and callable (e.g. for an uptime check or the one-time first-admin
 * setup), but deliberately not wired to a page. See TECHNICAL_DOCUMENTATION.md gap report.
 */
export async function checkHealth(): Promise<boolean> {
  const { http } = useHttp()
  try {
    await http.get('/health')
    return true
  } catch {
    return false
  }
}

export interface BootstrapAdminDto {
  fullName: string
  email: string
  password: string
}

/** Only succeeds once — while the users table is empty. */
export async function bootstrapFirstAdmin(dto: BootstrapAdminDto): Promise<void> {
  const { http } = useHttp()
  await http.post('/bootstrap/admin', dto)
}
