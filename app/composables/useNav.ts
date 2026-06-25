import type { UserRole } from '~/types'

export interface NavItem {
  label: string
  to: string
  icon: string
  roles: UserRole[]
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard', roles: ['SuperAdmin', 'AKBPAAdmin', 'SocialRegisterOfficer', 'WardPA', 'RedemptionOfficer', 'Viewer'] },
  { label: 'Social Register', to: '/beneficiaries', icon: 'i-lucide-users', roles: ['SuperAdmin', 'AKBPAAdmin', 'SocialRegisterOfficer', 'WardPA'] },
  { label: 'Generate Vouchers', to: '/vouchers/generate', icon: 'i-lucide-qr-code', roles: ['SuperAdmin', 'AKBPAAdmin'] },
  { label: 'Voucher Batches', to: '/vouchers/batches', icon: 'i-lucide-package', roles: ['SuperAdmin', 'AKBPAAdmin'] },
  { label: 'Receive Batch', to: '/vouchers/batches/receive', icon: 'i-lucide-package-check', roles: ['SuperAdmin', 'AKBPAAdmin'] },
  { label: 'Allocate Vouchers', to: '/vouchers/allocate', icon: 'i-lucide-send', roles: ['SuperAdmin', 'AKBPAAdmin'] },
  { label: 'Issue Voucher', to: '/vouchers/issue', icon: 'i-lucide-ticket', roles: ['WardPA'] },
  { label: 'Field Issue & Redeem', to: '/field/redeem', icon: 'i-lucide-truck', roles: ['AKBPAAdmin', 'RedemptionOfficer'] },
  { label: 'Scan / Redeem', to: '/redemption/scan', icon: 'i-lucide-scan-line', roles: ['RedemptionOfficer'] },
  { label: 'Reports', to: '/reports', icon: 'i-lucide-bar-chart-3', roles: ['SuperAdmin', 'AKBPAAdmin', 'SocialRegisterOfficer', 'WardPA', 'Viewer'] },
  { label: 'Audit Logs', to: '/audit-logs', icon: 'i-lucide-shield-check', roles: ['SuperAdmin'] },
  { label: 'Users', to: '/users', icon: 'i-lucide-user-cog', roles: ['SuperAdmin'] },
]

export function useNav() {
  const auth = useAuthStore()
  const visibleItems = computed(() => navItems.filter(i => auth.role && i.roles.includes(auth.role)))
  return { navItems, visibleItems }
}
