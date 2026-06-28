import type { UserRole } from '~/types'

export interface NavItem {
  label: string
  to: string
  icon: string
  roles: UserRole[]
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard', roles: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer', 'Ward PA / Issuing Officer', 'Redemption Officer', 'Viewer / Auditor'] },
  { label: 'Social Register', to: '/beneficiaries', icon: 'i-lucide-users', roles: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer'] },
  { label: 'Programme Cycles', to: '/programme-cycles', icon: 'i-lucide-calendar-range', roles: ['Super Admin', 'AKBPA Admin'] },
  { label: 'Generate Vouchers', to: '/vouchers/generate', icon: 'i-lucide-qr-code', roles: ['Super Admin', 'AKBPA Admin'] },
  { label: 'Voucher Batches', to: '/vouchers/batches', icon: 'i-lucide-package', roles: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer', 'LGA Voucher Officer'] },
  { label: 'Receive Vouchers', to: '/vouchers/batches/receive', icon: 'i-lucide-package-check', roles: ['Super Admin', 'AKBPA Admin', 'Voucher Receiving Officer'] },
  { label: 'Allocate Vouchers', to: '/vouchers/allocate', icon: 'i-lucide-send', roles: ['Super Admin', 'AKBPA Admin', 'LGA Voucher Officer'] },
  { label: 'Issue Voucher', to: '/vouchers/issue', icon: 'i-lucide-ticket', roles: ['Ward PA / Issuing Officer'] },
  { label: 'Scan / Redeem', to: '/redemption/scan', icon: 'i-lucide-scan-line', roles: ['Redemption Officer'] },
  { label: 'Reports', to: '/reports', icon: 'i-lucide-bar-chart-3', roles: ['Super Admin', 'AKBPA Admin', 'Ward PA / Issuing Officer', 'Viewer / Auditor'] },
  { label: 'Audit Logs', to: '/audit-logs', icon: 'i-lucide-shield-check', roles: ['Super Admin'] },
  { label: 'Users', to: '/users', icon: 'i-lucide-user-cog', roles: ['Super Admin'] },
  { label: 'Locations', to: '/locations', icon: 'i-lucide-map-pin', roles: ['Super Admin'] },
]

export function useNav() {
  const auth = useAuthStore()
  const visibleItems = computed(() => navItems.filter(i => auth.role && i.roles.includes(auth.role)))
  return { navItems, visibleItems }
}
