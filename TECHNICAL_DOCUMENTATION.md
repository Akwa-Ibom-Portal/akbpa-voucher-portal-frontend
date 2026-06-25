# AKBPA Food Voucher Portal — Technical Documentation

Version 1.0 · Frontend: Nuxt 3 · Status: built against mock data, ready to switch to a live backend

---

## 1. Overview

The AKBPA Food Voucher Portal manages the full lifecycle of food vouchers (rice, beans,
garri — 5kg each) for Social Register beneficiaries across Akwa Ibom State's 31 LGAs and
329 wards. It has two halves:

- **Public marketing site** — informational pages for citizens (eligibility, how it
  works, FAQs) plus the staff login/registration entry points.
- **Admin portal** — the authenticated, role-gated application where staff generate
  vouchers, manage the Social Register, allocate and issue vouchers, redeem them in the
  field, and review reports/audit logs.

This document describes every action the system supports today, how it's wired together,
and exactly what changes when the real backend (built separately in NestJS) comes online.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 3 (Vue 3, universal/SSR rendering) |
| UI | Nuxt UI (Tailwind CSS under the hood) |
| State management | Pinia |
| HTTP client | Axios (single shared instance via a Nuxt plugin) |
| QR scanning | `vue-qrcode-reader` (device camera via `getUserMedia`) |
| Color mode | `@nuxtjs/color-mode` (bundled with Nuxt UI), light by default |
| Icons | Lucide (via Nuxt Icon) |
| Backend (separate project) | NestJS + Prisma + PostgreSQL — built by another developer |

---

## 3. Project Structure

```
app/
├── assets/css/main.css       Tailwind theme tokens (akbpaGreen / akbpaOrange palettes)
├── app.config.ts             Nuxt UI color aliases
├── app.vue                   Root: <UApp><NuxtLayout><NuxtPage /></NuxtLayout></UApp>
├── layouts/
│   ├── public.vue            Header/footer marketing shell, mobile hamburger menu
│   ├── auth.vue               Centered card shell for login/register/password screens
│   ├── admin.vue              Sidebar + topbar shell, mobile slide-out drawer
│   └── scanner.vue            Fullscreen dark shell for the QR scanner (intentional, low-light field use)
├── middleware/
│   ├── auth.ts                Redirects unauthenticated users to /login
│   └── role.ts                Redirects users whose role isn't in a page's allow-list
├── pages/                     One file per route — see §6 for the full inventory
├── composables/
│   ├── useHttp.ts             Returns the shared axios instance + mock-mode flag/delay
│   └── useNav.ts              Role-filtered sidebar nav items
├── services/                  API layer — one file per domain (see §7)
├── stores/                    Pinia stores wrapping the services (see §8)
├── data/
│   ├── lgas.ts                31 verified LGAs + 329 wards (ward names are placeholders)
│   └── mock.ts                In-memory "database": users, beneficiaries, batches, vouchers, audit logs
├── types/index.ts             All shared TypeScript types/interfaces
└── plugins/axios.ts           Axios instance + request/response interceptors
```

---

## 4. Environment Variables

Defined in `.env` (gitignored) / `.env.example` (committed template):

| Variable | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | `http://localhost:3001/api` | Base URL for the real backend |
| `NUXT_PUBLIC_API_TIMEOUT` | `15000` | Axios request timeout (ms) |
| `NUXT_PUBLIC_USE_MOCK_API` | `true` | **The switch.** `true` = every service function resolves against in-memory mock data. `false` = every service function calls the real backend via axios. |
| `NUXT_PUBLIC_MOCK_DELAY` | `350` | Artificial latency (ms) added to mock responses, so loading states are visible during demos |

To go live against the real backend: set `NUXT_PUBLIC_USE_MOCK_API=false` and point
`NUXT_PUBLIC_API_BASE_URL` at it. No page code changes — every service function already
has both code paths.

---

## 5. Authentication & Roles

### 5.1 Roles

| Role | Scope | Can do |
|---|---|---|
| `SuperAdmin` | Statewide | Everything — user management, audit logs, all of AKBPAAdmin's powers |
| `AKBPAAdmin` | Statewide or assigned | Generate/receive/allocate voucher batches, field issue+redeem, view reports |
| `SocialRegisterOfficer` | Statewide or assigned | Manage the Social Register (add/upload beneficiaries) |
| `WardPA` | One assigned ward | View their ward's beneficiaries, issue vouchers to them |
| `RedemptionOfficer` | Assigned LGA/point | Scan and redeem vouchers, field issue+redeem |
| `Viewer` | Read-only | Dashboards and reports only |

Role membership per page is enforced by `middleware/role.ts`, declared per-page via
`definePageMeta({ role: [...] })`. The full map lives in `composables/useNav.ts`.

### 5.2 Three ways to get an account

**A — Admin-invited (primary path, recommended for staff onboarding)**
1. SuperAdmin opens **Users → Add User**, sets name/email/role/LGA/ward.
2. System creates the account with `status: 'Invited'`, `isActive: false`, and a unique
   invite token.
3. An invite link (`/accept-invite?token=...`) is generated — in mock mode it's shown
   directly in the UI (no email service wired up); in production this would be emailed.
4. The invitee opens the link, sees their name/role/scope (set by the admin, not
   self-chosen), sets a password, and the account activates immediately (`status: 'Active'`).
5. SuperAdmin can **Resend Invite** for anyone still sitting in `Invited`.

**B — Self-requested (fallback path)**
1. Anyone can visit **/register** and run a 3-step wizard: email → 6-digit verification
   code (mock code `123456`, shown on screen since there's no email service yet) →
   profile form (name, phone, NIN, requested role — `SuperAdmin` is excluded from the
   list — LGA/ward if applicable, profile photo, ID document upload, consent checkboxes).
2. Account is created with `status: 'PendingApproval'`, `isActive: false`.
3. A SuperAdmin reviews it on the **Users** page (separate panel from invited users) and
   clicks **Approve** (→ `Active`) or **Reject** (→ `Rejected`).

**C — Login**
`/login` shows a role-selection grid first, then an email+password form. A "Demo Accounts"
panel lists every mock account's email — click one to auto-fill the form (any non-empty
password works in mock mode). Links to `/register` and `/forgot-password` are visible
immediately, without needing to pick a role first.

### 5.3 Password lifecycle
- **Forgot password** (`/forgot-password` → `/reset-password?token=...`): requests a
  reset link; never reveals whether an email exists.
- **Change password**: from `/profile`, requires the current password.

### 5.4 Session handling
- JWT-style token + user object stored in `localStorage` (`akbpa_token`, `akbpa_user`).
- Axios interceptor attaches `Authorization: Bearer <token>` to every request; a 401
  response clears the session and redirects to `/login`.
- `middleware/auth.ts` restores the session from `localStorage` on the client and blocks
  access to protected pages if there's no valid token.

---

## 6. Screen-by-Screen Inventory

### Public site (layout: `public`, no auth)
| Route | What it does |
|---|---|
| `/` | Landing page — hero, food-item cards, stats strip, "Quick Steps" preview, leadership message (placeholder avatar), core security principles, role list, eligibility CTA |
| `/how-it-works` | Full 7-step lifecycle walkthrough, registration → redemption |
| `/eligibility` | Who qualifies / who doesn't, sourced from the Developer Guide |
| `/faq` | Accordion of common questions |

### Auth flow (layout: `auth`, no auth required to view)
| Route | What it does |
|---|---|
| `/login` | Role-select → credentials → sign in; demo-account quick-login panel |
| `/register` | Self-service staff access request (3-step wizard, see §5.2-B) |
| `/accept-invite?token=` | Completes an admin-issued invite (see §5.2-A) |
| `/forgot-password` | Requests a password reset link |
| `/reset-password?token=` | Sets a new password |

### Admin portal (layout: `admin`, requires login + role)
| Route | Roles | What it does |
|---|---|---|
| `/dashboard` | All | Stat cards (generated/issued/redeemed/pending), by-item progress bars, by-gender breakdown, top-LGA redemption table |
| `/beneficiaries` | SuperAdmin, AKBPAAdmin, SocialRegisterOfficer, WardPA | Searchable/filterable Social Register list (name/ID/phone search, LGA + gender filters). Ward PA is hard-scoped to their own ward. |
| `/beneficiaries/add` | SuperAdmin, AKBPAAdmin, SocialRegisterOfficer | Manually add one beneficiary; duplicate-checked on Beneficiary ID/Household ID |
| `/beneficiaries/upload` | SuperAdmin, AKBPAAdmin, SocialRegisterOfficer | Bulk Excel upload with row-level error reporting |
| `/vouchers/generate` | SuperAdmin, AKBPAAdmin | Generate a QR voucher batch for one food item; preview serials; "Export QR Images for Printer" transitions the batch to `PrintedPending` |
| `/vouchers/batches` | SuperAdmin, AKBPAAdmin | List of all batches with lifecycle counts |
| `/vouchers/batches/[id]` | SuperAdmin, AKBPAAdmin | Batch detail: funnel (generated→sent→received→allocated→issued→redeemed), discrepancy/partial-receipt alerts |
| `/vouchers/batches/receive` | SuperAdmin, AKBPAAdmin | **Full-scan reconciliation** — see §9.2 |
| `/vouchers/allocate` | SuperAdmin, AKBPAAdmin | Allocate a received batch's stock to an LGA, ward, or officer |
| `/vouchers/issue` | WardPA | Search beneficiaries in their own ward, issue a voucher per food item |
| `/field/redeem` | AKBPAAdmin, RedemptionOfficer | Combined issue+redeem in one step for truck-based field distribution |
| `/redemption/scan` | RedemptionOfficer | Camera-based QR scanner (layout: `scanner`, intentionally dark) + manual token entry + recent-redemptions feed |
| `/reports` | SuperAdmin, AKBPAAdmin, SocialRegisterOfficer, WardPA, Viewer | Filterable stats by LGA/item/status/gender; by-LGA and by-item tables; export buttons (not yet wired to a real file-generation endpoint) |
| `/audit-logs` | SuperAdmin | Searchable, module-filterable log of every write action |
| `/users` | SuperAdmin | Invited-users panel (resend), pending-approval panel (approve/reject), full user table, Add User invite modal |
| `/profile` | All (authenticated) | Edit own name/phone, change password |

---

## 7. API Service Layer (`app/services/`)

Every function follows the same pattern:
```ts
export async function someAction(args) {
  const { http, useMock } = useHttp()
  if (!useMock) {
    const { data } = await http.<method>('<real endpoint>', ...)
    return data
  }
  // mock implementation against data/mock.ts
}
```

### `authApi.ts`
| Function | Real endpoint | Purpose |
|---|---|---|
| `login(role, email, password)` | `POST /auth/login` | Authenticate; blocks `PendingApproval`/`Suspended`/`Rejected` accounts |
| `requestEmailVerification(email)` | `POST /auth/request-verification` | Step 1 of self-registration |
| `verifyEmailCode(email, code)` | `POST /auth/verify-email` | Step 2 of self-registration |
| `submitRegistration(profile)` | `POST /auth/register` | Step 3 — creates a `PendingApproval` account |
| `requestPasswordReset(email)` | `POST /auth/password-reset` | Returns a reset token (or null if email unknown, never reveals which) |
| `resetPassword(token, newPassword)` | `POST /auth/reset-password` | Finalizes a reset |
| `changePassword(current, new)` | `POST /auth/change-password` | In-app password change |
| `getInviteByToken(token)` | `GET /auth/invite` | Looks up an admin-issued invite |
| `acceptInvite(token, password)` | `POST /auth/accept-invite` | Activates an invited account |
| `updateProfile(id, updates)` | `PATCH /users/:id` | Saves profile edits |

### `usersApi.ts`
| Function | Real endpoint | Purpose |
|---|---|---|
| `listUsers({search, role, status})` | `GET /users` | Filtered user list |
| `approveUser(id)` / `rejectUser(id)` | `PATCH /users/:id/approve` / `/reject` | Self-request moderation |
| `inviteUser(dto)` | `POST /users/invite` | Admin-initiated onboarding |
| `resendInvite(id)` | `POST /users/:id/resend-invite` | Re-issues an invite link |
| `bulkCreateWardPAs(rows)` | `POST /users/bulk-ward-pa` | Stubbed for future CSV-based bulk creation (329 wards) |

### `beneficiariesApi.ts`
| Function | Real endpoint | Purpose |
|---|---|---|
| `listBeneficiaries({search, lgaId, wardId, gender})` | `GET /beneficiaries` | Filtered Social Register list |
| `addBeneficiary(payload)` | `POST /beneficiaries` | Manual add, duplicate-checked |
| `uploadBeneficiariesExcel(file)` | `POST /beneficiaries/upload` (multipart) | Bulk import |

### `lgaApi.ts`
| Function | Real endpoint | Purpose |
|---|---|---|
| `listLgas()` | `GET /lgas` | All 31 LGAs |
| `listWards(lgaId?)` | `GET /wards` | All 329 wards, optionally filtered |

### `vouchersApi.ts`
| Function | Real endpoint | Purpose |
|---|---|---|
| `listBatches()` | `GET /voucher-batches` | All batches |
| `getBatch(id)` | `GET /voucher-batches/:id` | One batch |
| `generateBatch(dto, generatedBy)` | `POST /voucher-batches/generate` | New item-locked QR batch |
| `markSentToPrinter(id)` | `PATCH /voucher-batches/:id/sent-to-printer` | Handoff to the print vendor |
| `receiveBatch(id, payload)` | `PATCH /voucher-batches/:id/receive` | **Full-scan reconciliation** (§9.2) |
| `allocateVouchers(dto)` | `POST /vouchers/allocate` | Assign stock to LGA/ward/officer; **blocked unless batch status is `Received`/`Allocated`** |
| `issueVoucher(beneficiaryId, item, issuedBy)` | `POST /vouchers/issue` | Ward PA issuance |
| `fieldIssueAndRedeem(dto)` | `POST /vouchers/field-redeem` | Combined field issue+redeem |
| `validateScan(tokenOrSerial)` | `POST /vouchers/validate-scan` | Hash lookup + status/expiry/item-type guards |
| `redeemVoucher(voucherId, officerId)` | `POST /vouchers/redeem` | Finalizes redemption |

### `reportsApi.ts`
`getSummary(filters)`, `getByItem()`, `getByLga()`, `getByGender()` → `GET /reports/summary`,
`/reports/by-item`, `/reports/by-lga`, `/reports/by-gender`.

### `auditApi.ts`
`listAuditLogs({search, module})` → `GET /audit-logs`. `recordAuditLog(entry)` is a
local-only helper that other services call to log actions in mock mode (in production,
the backend would write these itself on each write operation).

---

## 8. State Management (`app/stores/`)

Each Pinia store wraps the matching service and adds reactive list/loading/error state
plus current filter values:

| Store | Wraps | Key state |
|---|---|---|
| `auth` | `authApi` | `token`, `user`, `selectedRole`, `loading` |
| `users` | `usersApi` | `users`, `pendingUsers`, `invitedUsers`, `activeUsers`, `lastInviteLink`, filters |
| `beneficiaries` | `beneficiariesApi` | `beneficiaries`, search/lga/ward/gender filters |
| `lga` | `lgaApi` | `lgas`, `wards` (loaded once via `ensureLoaded()`, cached) |
| `vouchers` | `vouchersApi` | `batches`, `lastGenerated` |
| `reports` | `reportsApi` | `summary`, `byItem`, `byLga`, `byGender`, filters |
| `auditLogs` | `auditApi` | `logs`, search/module filters |

Pages call store actions in `onMounted()` (or on filter change) and bind to the store's
reactive state directly in the template — no page imports mock data directly.

---

## 9. Core Business Rules

### 9.1 Voucher lifecycle
```
Generated → PrintedPending → (Received | PartiallyReceived | Discrepancy)
                                       ↓ (only from Received)
                                  Allocated → Issued → Redeemed
```
- A batch is always single-item (rice, beans, **or** garri — never mixed).
- A beneficiary gets **one voucher per item per programme cycle**. Once
  `voucherStatus.Rice` is `Redeemed`, no re-issue button appears for Rice until a new
  cycle/batch makes a fresh voucher available.
- QR codes encode a random opaque token only — never a database ID, name, or item count.
  Redemption hashes the scanned token and matches it server-side; the docx's
  "never expose plain values" rule is enforced at generation, not just at scan time.

### 9.2 Printer reconciliation — full scan, no sampling
This was deliberately changed from the original transcript's "random spot-check" model.
Every voucher returned by the printer must be individually scanned at `/vouchers/batches/receive`:
- Progress bar tracks `scanned.length` against the batch's expected total.
- Duplicate scans are flagged, not silently counted twice.
- **"Mark as Received"** is disabled until the count matches exactly.
- If the count falls short, **"Stop & Report Missing Vouchers"** closes the session as
  `Discrepancy` with the exact missing count recorded — there is no way to silently
  accept a shortfall.
- `allocateVouchers()` throws if the batch isn't `Received` or `Allocated` — a
  `Discrepancy` or `PartiallyReceived` batch cannot leak into circulation.

### 9.3 Field distribution (no Ward PA in the loop)
For truck-based distribution where AKBPAAdmin/RedemptionOfficer hand out and collect food
in the same visit, `/field/redeem` combines issuance and redemption into one call
(`fieldIssueAndRedeem`) rather than requiring the normal two-step issue-then-scan flow.

### 9.4 Ward scoping
Ward PA's beneficiary list and issuance screen are filtered to `auth.user.wardId`
client-side. **This must also be enforced server-side from the JWT claim** once the real
backend exists — the frontend filter alone is not a security boundary.

---

## 10. Known Gaps / Not Yet Implemented

| Gap | Why |
|---|---|
| Ward names are placeholders (`Ward 1`..`Ward N`) | The real 329-ward register was never supplied; `data/lgas.ts` flags this explicitly |
| No real email/SMS sending | Termii/Brevo integration is backend work; invite links and reset links are shown directly in the UI for now |
| Report exports (Excel/PDF) | Buttons exist on `/reports` but aren't wired to a real file-generation endpoint |
| Password-protected PDF exports | Required per the client's data-protection notes; depends on the export endpoint above |
| Device-level redemption lockdown | Only authenticated-session restriction exists; restricting to specific agency devices would need backend-side device certs/IP allowlisting |
| Bulk Ward PA creation | `bulkCreateWardPAs()` is stubbed — needs a real CSV import UI once needed |

---

## 11. Deployment

See hosting discussion — summary: this is a universal/SSR Nuxt app, needs a Node.js
host (Vercel/Netlify for a quick demo link; Azure/Railway/DigitalOcean for production).
HTTPS is mandatory in production because the QR scanner requires camera access, which
browsers block over plain HTTP. Environment variables from §4 must be set on the host;
flipping `NUXT_PUBLIC_USE_MOCK_API` to `false` and pointing `NUXT_PUBLIC_API_BASE_URL`
at the real backend is the only change needed to go live.
