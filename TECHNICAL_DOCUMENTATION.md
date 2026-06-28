# AKBPA Food Voucher Portal — Technical Documentation

Version 2.0 · Frontend: Nuxt 3 · Status: integrated against the live API (Postman collection
"AKBPA Voucher Portal - MVP API", `railwayBaseUrl` deployment)

---

## 1. Overview

The AKBPA Food Voucher Portal manages the full lifecycle of food vouchers (rice, beans,
garri — 5kg each) for Social Register beneficiaries across Akwa Ibom State's 31 LGAs and
329 wards. It has two halves:

- **Public marketing site** — informational pages for citizens (eligibility, how it
  works, FAQs) plus the staff login entry point.
- **Admin portal** — the authenticated, role-gated application where staff manage
  programme cycles, the Social Register, generate/receive/allocate/issue vouchers, redeem
  them in the field, and review reports/audit logs.

Every screen in the admin portal now calls the real backend directly — there is no mock
data layer left in the codebase. This document covers: how it's wired together, every
endpoint from the Postman collection and where it's used, end-to-end flows per role, and a
gap report of what the UI could not fully implement against the documented API.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 3 (Vue 3, universal/SSR rendering) |
| UI | Nuxt UI (Tailwind CSS under the hood) |
| State management | Pinia |
| HTTP client | Axios (single shared instance via a Nuxt plugin) |
| QR scanning | `vue-qrcode-reader` (device camera via `getUserMedia`) |
| Icons | Lucide (via Nuxt Icon) |
| Backend | NestJS-style REST API, deployed at `akbpa-voucher-api-production.up.railway.app/api/v1` |

---

## 3. Project Structure

```
app/
├── assets/css/main.css       Tailwind theme tokens
├── layouts/
│   ├── public.vue            Marketing shell
│   ├── auth.vue               Centered card shell for login/password screens
│   ├── admin.vue              Sidebar + topbar shell
│   └── scanner.vue            Fullscreen dark shell for the QR scanner
├── middleware/
│   ├── auth.ts                Redirects unauthenticated users to /login
│   └── role.ts                Redirects users whose role isn't in a page's allow-list
├── pages/                     One file per route — see §6
├── composables/
│   ├── useHttp.ts             Shared axios instance accessor
│   └── useNav.ts              Role-filtered sidebar nav items
├── services/                  API layer — one file per domain (see §7)
├── stores/                    Pinia stores wrapping the services (see §8)
├── types/index.ts             All shared TypeScript types/interfaces
└── plugins/axios.ts           Axios instance + request/response interceptors
```

---

## 4. Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | Railway deployment URL | Base URL for the real backend |
| `NUXT_PUBLIC_API_TIMEOUT` | `15000` | Axios request timeout (ms) |

The mock-API toggle (`NUXT_PUBLIC_USE_MOCK_API`) and the in-memory mock data layer
(`data/mock.ts`, `data/lgas.ts`) have been removed — every service function now always
calls the live API.

---

## 5. Authentication & Roles

### 5.1 Roles

Roles are fetched from `GET /roles` and matched by name to the labels below (see
`types/index.ts` → `USER_ROLES`):

| Role | Scope | Can do |
|---|---|---|
| Super Admin | Statewide | Everything — users, locations, audit logs, plus all of AKBPA Admin's powers |
| AKBPA Admin | Statewide or assigned | Programme cycles, generate/receive/allocate voucher batches, reports |
| Voucher Receiving Officer | Assigned scope | Receive generated physical vouchers into AKBPA inventory |
| LGA Voucher Officer | One LGA | Allocate vouchers onward to wards within their LGA |
| Ward PA / Issuing Officer | One assigned ward | Issue vouchers to beneficiaries in their ward |
| Redemption Officer | Assigned redemption point | Validate and redeem issued vouchers |
| Viewer / Auditor | Read-only | Dashboards and reports only |

Role membership per page is enforced by `middleware/role.ts`, declared per-page via
`definePageMeta({ role: [...] })`.

### 5.2 Account creation

There is **no self-registration endpoint** on the real API. The only way to create an
account is `POST /users` by a Super Admin on the **Users** page — the admin sets name,
email, role, password, and LGA/ward scope directly; the account is active immediately.
(The previous mock-only self-request/approval flow and its UI have been removed — see
§12 Gap Report.)

### 5.3 Password lifecycle
- **Forgot password** (`/forgot-password` → `POST /auth/forgot-password`): requests a reset link.
- **Reset password** (`/reset-password` → `POST /auth/reset-password`).
- **Change password** (from `/profile` → `POST /me/change-password`), requires the current password.
- **Admin reset** (Users page row action → `POST /users/:id/reset-password`) — the backend emails the new password; there's no on-screen reveal.

### 5.4 Session handling
- Token + user object stored in cookies (`akbpa_token`, `akbpa_user`) so SSR can read the session on first paint.
- Axios interceptor attaches `Authorization: Bearer <token>` to every request; a 401 clears the session and redirects to `/login`.
- `middleware/auth.ts` blocks access to protected pages without a valid token.

### 5.5 One-time / operational endpoints (not user-facing)
`POST /bootstrap/admin` (creates the first Super Admin while the users table is empty)
and `GET /health` have no corresponding screen — see `services/systemApi.ts` and §12.

---

## 6. Screen-by-Screen Inventory

### Public site (layout: `public`, no auth)
| Route | What it does |
|---|---|
| `/` | Landing page |
| `/how-it-works` | Lifecycle walkthrough |
| `/eligibility` | Who qualifies |
| `/faq` | Accordion of common questions |

### Auth flow (layout: `auth`, no auth required to view)
| Route | What it does |
|---|---|
| `/login` | Credentials → sign in |
| `/forgot-password` | Requests a password reset link |
| `/reset-password?token=` | Sets a new password |

### Admin portal (layout: `admin`, requires login + role)
| Route | Roles | What it does |
|---|---|---|
| `/dashboard` | All | Summary stats, by-item progress, by-gender breakdown, top-LGA table |
| `/beneficiaries` | Super Admin, AKBPA Admin, Ward PA | Searchable Social Register list, scoped to ward for Ward PA |
| `/beneficiaries/add` | Super Admin, AKBPA Admin | Manually add one beneficiary |
| `/beneficiaries/upload` | Super Admin, AKBPA Admin | CSV bulk import + template download |
| `/beneficiaries/[id]` | Super Admin, AKBPA Admin, Ward PA | Beneficiary detail, edit, voucher history |
| `/programme-cycles` | Super Admin, AKBPA Admin | Create/edit/activate programme cycles |
| `/vouchers/generate` | Super Admin, AKBPA Admin | Create a voucher batch for one food item under a programme cycle |
| `/vouchers/batches` | Super Admin, AKBPA Admin, Voucher Receiving Officer, LGA Voucher Officer | List of all batches |
| `/vouchers/batches/[id]` | same | Batch detail: summary counts, inventory breakdown, voucher list, PDF download, cancel batch, cancel individual voucher |
| `/vouchers/batches/receive` | Super Admin, AKBPA Admin, Voucher Receiving Officer | Record a receipt session (full batch or selected serials with missing/damaged) |
| `/vouchers/allocate` | Super Admin, AKBPA Admin, LGA Voucher Officer | Allocate a batch to one ward or several wards |
| `/vouchers/issue` | Ward PA | Issue a specific serial to a beneficiary in their ward |
| `/redemption/scan` | Redemption Officer | Select ward + beneficiary, scan/validate, confirm redemption |
| `/reports` | Super Admin, AKBPA Admin, Ward PA, Viewer | Summary, by-LGA, by-ward, by-item tables; CSV/PDF export |
| `/audit-logs` | Super Admin | Log of write actions (client-filtered) |
| `/users` | Super Admin | User table, Add/Edit User, suspend/activate, reset password, remove |
| `/locations` | Super Admin | LGA/ward list + add new LGA/ward |
| `/profile` | All (authenticated) | Edit own name/phone, change password |

---

## 7. API Service Layer (`app/services/`)

One file per Postman folder, each function calling the live endpoint directly (no mock
branch). Response bodies are read defensively (`data.data ?? data`, camelCase-or-snake_case
field fallbacks) because the API is inconsistent about casing across endpoints — the same
pattern already used by `normalizeUser.ts` is now used by `normalizeBeneficiary.ts`,
`normalizeVoucher.ts`, and `normalizeProgrammeCycle.ts`.

| File | Endpoints |
|---|---|
| `systemApi.ts` | `GET /health`, `POST /bootstrap/admin` |
| `authApi.ts` | `POST /auth/login`, `/logout`, `/forgot-password`, `/reset-password`; `GET /me`, `PATCH /me`, `POST /me/change-password` |
| `rolesApi.ts` | `GET /roles` |
| `programmeCyclesApi.ts` | `GET/POST /programme-cycles`, `GET/PATCH /programme-cycles/:id`, `PATCH /programme-cycles/:id/activate` |
| `lgaApi.ts` | `GET/POST /locations/lgas`, `GET/POST /locations/wards` |
| `beneficiariesApi.ts` | `GET/POST /beneficiaries`, `GET/PUT /beneficiaries/:id`, `GET /beneficiaries/template/download`, `POST /beneficiaries/upload`, `GET /beneficiaries/:id/voucher-history` |
| `usersApi.ts` | `GET/POST /users`, `GET/PUT /users/:id`, `PATCH /users/:id/status`, `POST /users/:id/reset-password`, `DELETE /users/:id` |
| `voucherBatchesApi.ts` | `POST/GET /voucher-batches`, `GET /voucher-batches/:id`, `/:id/vouchers`, `/:id/pdf`, `/:id/summary`, `PATCH /:id/cancel` |
| `vouchersApi.ts` | `POST /vouchers/:serial/cancel` |
| `voucherReceiptsApi.ts` | `POST/GET /voucher-receipts` (full-batch and selected-serial modes) |
| `voucherAllocationsApi.ts` | `POST/GET /voucher-allocations` (`WARD` and `WARDS` target types) |
| `voucherIssuancesApi.ts` | `POST/GET /voucher-issuances`, `GET /voucher-issuances?beneficiaryId=` |
| `voucherRedemptionsApi.ts` | `POST /voucher-redemptions/validate`, `/scan`, `GET /voucher-redemptions` |
| `reportsApi.ts` | `GET /reports/inventory`, `/summary`, `/by-lga`, `/by-ward`, `/by-gender`, `/by-item`, `/export` |
| `auditApi.ts` | `GET /audit-logs?limit=` |

---

## 8. State Management (`app/stores/`)

| Store | Wraps | Key state |
|---|---|---|
| `auth` | `authApi` | `token`, `user`, `loading` |
| `users` | `usersApi` | `users`, filters |
| `roles` | `rolesApi` | `roles` (loaded once) |
| `programmeCycles` | `programmeCyclesApi` | `cycles` |
| `lga` | `lgaApi` | `lgas`, `wards` (loaded once via `ensureLoaded()`) |
| `beneficiaries` | `beneficiariesApi` | `beneficiaries`, search/lga/ward/gender filters |
| `voucherBatches` | `voucherBatchesApi` | `batches`, `lastCreated` |
| `voucherReceipts` | `voucherReceiptsApi` | `sessions` |
| `voucherAllocations` | `voucherAllocationsApi` | `allocations` |
| `voucherIssuances` | `voucherIssuancesApi` | `issuances` |
| `voucherRedemptions` | `voucherRedemptionsApi` | `redemptions` |
| `reports` | `reportsApi` | `summary`, `byItem`, `byLga`, `byWard`, `byGender`, `inventory`, `programmeCycleId` |
| `auditLogs` | `auditApi` | `logs`, client-side `search`/`moduleFilter` → `filtered` |

---

## 9. Core Business Rules

### 9.1 Voucher lifecycle (Developer Guide §4)
```
Generated → Allocated → Issued → Redeemed
              ↓            ↓
          Cancelled    Cancelled
   (any non-Redeemed status can also become Expired)
```
- A batch is always single-item (rice, beans, **or** garri — never mixed) and belongs to one programme cycle.
- QR codes encode a random opaque token only — redemption hashes the scanned token and matches it server-side.
- Redemption now also requires the officer to assert **which beneficiary** and **which ward** the voucher is being redeemed for (`beneficiaryId` + `wardId` on both `/voucher-redemptions/validate` and `/scan`), so the backend can cross-check the claim against the QR token rather than trusting the scan alone.

### 9.2 Receiving — full batch or selected serials
`POST /voucher-receipts` supports two shapes: `{ voucherBatchId, notes }` to receive the
whole batch at once, or `{ voucherBatchId, serialNumbers, missingSerialNumbers,
damagedSerialNumbers, notes }` to record specific outcomes per serial. The Receive page
exposes both as a mode toggle.

### 9.3 Allocation — ward or wards
`POST /voucher-allocations` supports `targetType: "WARD"` (one ward) or `"WARDS"` (a
`targets[]` array for bulk allocation in one call). The Allocate page submits the simpler
shape for a single row and the bulk shape once a second ward row is added.

### 9.4 Ward scoping
Ward PA's beneficiary list and issuance screen are filtered to `auth.user.wardIds[0]`
client-side. **This must also be enforced server-side from the JWT claim** — the frontend
filter alone is not a security boundary.

---

## 10. User Flows by Role (end-to-end)

### Super Admin
1. **Bootstrap** — first Super Admin is created once via `POST /bootstrap/admin` (ops-only, not in the UI; see §12).
2. **Set up locations** — `/locations` → Add LGA / Add Ward (`POST /locations/lgas`, `POST /locations/wards`).
3. **Set up a programme cycle** — `/programme-cycles` → New Cycle → Activate (`POST`, `PATCH /activate`).
4. **Create staff accounts** — `/users` → Add User, choosing role + LGA/ward scope (`POST /users`).
5. **Manage accounts** — suspend/activate, reset password, remove (`PATCH /:id/status`, `POST /:id/reset-password`, `DELETE /:id`).
6. **Oversight** — `/audit-logs`, `/reports`, and every AKBPA Admin capability below.

### AKBPA Admin
1. **Build the Social Register** — `/beneficiaries/upload` (CSV) or `/beneficiaries/add` (manual) → `POST /beneficiaries/upload` / `POST /beneficiaries`.
2. **Generate a voucher batch** — `/vouchers/generate`, selecting an active programme cycle, food item, bag size, quantity, validity → `POST /voucher-batches`.
3. **Track the batch** — `/vouchers/batches/[id]` shows summary counts, per-item inventory, and the voucher list; PDF export (`GET /:id/pdf`); cancel the whole batch or an individual voucher if needed (`PATCH /:id/cancel`, `POST /vouchers/:serial/cancel`).
4. **Hand off to LGA/Ward officers** — `/vouchers/allocate` once the batch has been received.
5. **Monitor** — `/reports` (filtered by programme cycle) and the dashboard.

### Voucher Receiving Officer
1. Goes to `/vouchers/batches/receive`, picks a pending batch.
2. Either confirms the **full batch** was received, or records **specific serials** received plus any missing/damaged ones → `POST /voucher-receipts`.
3. Reviews past receipt sessions for that batch on the same page (`GET /voucher-receipts?voucherBatchId=`).

### LGA Voucher Officer
1. `/vouchers/allocate` — picks a received batch, selects their LGA, then one ward (or several, with per-ward quantities) → `POST /voucher-allocations`.
2. Reviews recent allocations on the same page (`GET /voucher-allocations`).

### Ward PA / Issuing Officer
1. `/vouchers/issue` — sees only beneficiaries in their assigned ward (`GET /beneficiaries?wardId=`).
2. Selects a beneficiary, enters the serial number allocated to their ward, issues it → `POST /voucher-issuances`.
3. Sees recent issuances on the same page (`GET /voucher-issuances`); a beneficiary's full history is on `/beneficiaries/[id]` (`GET /beneficiaries/:id/voucher-history`).

### Redemption Officer
1. `/redemption/scan` — selects the ward they're redeeming for, searches and selects the beneficiary presenting the voucher, picks the food item.
2. Scans (camera) or types the QR token → `POST /voucher-redemptions/validate` with `{ qrToken, foodItem, beneficiaryId, wardId }`.
3. On a valid result, confirms redemption → `POST /voucher-redemptions/scan` with the same payload.
4. Recent redemptions for the session are listed from `GET /voucher-redemptions`.

### Viewer / Auditor
1. `/dashboard` and `/reports` — read-only, filtered by programme cycle.

---

## 11. Endpoint Mapping

Every endpoint in the Postman collection, where it's implemented, and which screen(s) call it.

| Endpoint | Service function | Page(s) |
|---|---|---|
| `GET /health` | `systemApi.checkHealth` | none — ops/uptime use only |
| `POST /bootstrap/admin` | `systemApi.bootstrapFirstAdmin` | none — one-time ops step |
| `POST /auth/login` | `authApi.login` | `/login` |
| `POST /auth/logout` | `authApi.logout` | admin layout sign-out |
| `POST /auth/forgot-password` | `authApi.requestPasswordReset` | `/forgot-password` |
| `POST /auth/reset-password` | `authApi.resetPassword` | `/reset-password` |
| `GET /me` | `authApi.getMe` | admin layout (session refresh), `/profile` |
| `PATCH /me` | `authApi.updateProfile` | `/profile` |
| `POST /me/change-password` | `authApi.changePassword` | `/profile` |
| `GET /roles` | `rolesApi.listRoles` | `/users` (role picker) |
| `GET /programme-cycles` | `programmeCyclesApi.listProgrammeCycles` | `/programme-cycles`, `/vouchers/generate`, `/reports` |
| `POST /programme-cycles` | `programmeCyclesApi.createProgrammeCycle` | `/programme-cycles` |
| `GET /programme-cycles/:id` | `programmeCyclesApi.getProgrammeCycle` | available; not directly called (list is enough for current UI) |
| `PATCH /programme-cycles/:id` | `programmeCyclesApi.updateProgrammeCycle` | `/programme-cycles` |
| `PATCH /programme-cycles/:id/activate` | `programmeCyclesApi.activateProgrammeCycle` | `/programme-cycles` |
| `GET /locations/lgas` | `lgaApi.listLgas` | `/locations`, every LGA picker app-wide |
| `POST /locations/lgas` | `lgaApi.createLga` | `/locations` |
| `GET /locations/wards` | `lgaApi.listWards` | `/locations`, every ward picker app-wide |
| `POST /locations/wards` | `lgaApi.createWard` | `/locations` |
| `GET /beneficiaries` | `beneficiariesApi.listBeneficiaries` | `/beneficiaries`, `/vouchers/issue`, `/redemption/scan` |
| `POST /beneficiaries` | `beneficiariesApi.addBeneficiary` | `/beneficiaries/add` |
| `GET /beneficiaries/:id` | `beneficiariesApi.getBeneficiary` | `/beneficiaries/[id]` |
| `PUT /beneficiaries/:id` | `beneficiariesApi.updateBeneficiary` | `/beneficiaries/[id]` |
| `GET /beneficiaries/template/download` | `beneficiariesApi.downloadBeneficiaryTemplate` | `/beneficiaries/upload` |
| `POST /beneficiaries/upload` | `beneficiariesApi.uploadBeneficiariesCsv` | `/beneficiaries/upload` |
| `GET /beneficiaries/:id/voucher-history` | `beneficiariesApi.getBeneficiaryVoucherHistory` | `/beneficiaries/[id]` |
| `GET /users` | `usersApi.listUsers` | `/users` |
| `POST /users` | `usersApi.createUser` | `/users` (Add User) |
| `GET /users/:id` | `usersApi.getUser` | available; list view carries enough detail today |
| `PUT /users/:id` | `usersApi.updateUser` | `/users` (Edit User) |
| `PATCH /users/:id/status` | `usersApi.setUserStatus` | `/users` (Suspend/Activate) |
| `POST /users/:id/reset-password` | `usersApi.resetUserPassword` | `/users` |
| `DELETE /users/:id` | `usersApi.deleteUser` | `/users` (Remove) |
| `POST /voucher-batches` | `voucherBatchesApi.createBatch` | `/vouchers/generate` |
| `GET /voucher-batches` | `voucherBatchesApi.listBatches` | `/vouchers/batches`, `/vouchers/generate`, `/vouchers/allocate`, `/vouchers/batches/receive` |
| `GET /voucher-batches/:id` | `voucherBatchesApi.getBatch` | `/vouchers/batches/[id]` |
| `GET /voucher-batches/:id/vouchers` | `voucherBatchesApi.listBatchVouchers` | `/vouchers/batches/[id]` |
| `GET /voucher-batches/:id/pdf` | `voucherBatchesApi.getBatchPdfUrl` | `/vouchers/batches/[id]` |
| `GET /voucher-batches/:id/summary` | `voucherBatchesApi.getBatchSummary` | `/vouchers/batches/[id]` |
| `PATCH /voucher-batches/:id/cancel` | `voucherBatchesApi.cancelBatch` | `/vouchers/batches/[id]` |
| `POST /vouchers/:serial/cancel` | `vouchersApi.cancelVoucherBySerial` | `/vouchers/batches/[id]` (per-voucher row action) |
| `POST /voucher-receipts` (full batch) | `voucherReceiptsApi.receiveFullBatch` | `/vouchers/batches/receive` |
| `POST /voucher-receipts` (selected serials) | `voucherReceiptsApi.receiveSelectedSerials` | `/vouchers/batches/receive` |
| `GET /voucher-receipts` | `voucherReceiptsApi.listReceiptSessions` | `/vouchers/batches/receive` |
| `POST /voucher-allocations` (`WARD`) | `voucherAllocationsApi.allocateToWard` | `/vouchers/allocate` |
| `POST /voucher-allocations` (`WARDS`) | `voucherAllocationsApi.allocateToWards` | `/vouchers/allocate` |
| `POST /voucher-allocations` (`LGA`) | `voucherAllocationsApi.allocateToLga` | `/vouchers/allocate` |
| `POST /voucher-allocations` (`OFFICER`) | `voucherAllocationsApi.allocateToOfficer` | `/vouchers/allocate` |
| `GET /voucher-allocations` | `voucherAllocationsApi.listAllocations` | `/vouchers/allocate` |
| `POST /voucher-issuances` | `voucherIssuancesApi.issueVoucher` | `/vouchers/issue` |
| `GET /voucher-issuances` | `voucherIssuancesApi.listIssuances` | `/vouchers/issue` |
| `GET /voucher-issuances?beneficiaryId=` | `voucherIssuancesApi.listIssuancesByBeneficiary` | available; `/beneficiaries/[id]` currently uses voucher-history instead (see §12) |
| `POST /voucher-redemptions/validate` | `voucherRedemptionsApi.validateScan` | `/redemption/scan` |
| `POST /voucher-redemptions/scan` | `voucherRedemptionsApi.redeemScan` | `/redemption/scan` |
| `GET /voucher-redemptions` | `voucherRedemptionsApi.listRedemptions` | `/redemption/scan` |
| `GET /reports/inventory` | `reportsApi.getInventory` | `/vouchers/batches/[id]` |
| `GET /reports/summary` | `reportsApi.getSummary` | `/dashboard`, `/reports` |
| `GET /reports/by-lga` | `reportsApi.getByLga` | `/dashboard`, `/reports` |
| `GET /reports/by-ward` | `reportsApi.getByWard` | `/reports` |
| `GET /reports/by-gender` | `reportsApi.getByGender` | `/dashboard` |
| `GET /reports/by-item` | `reportsApi.getByItem` | `/dashboard`, `/reports` |
| `GET /reports/export` | `reportsApi.exportReport` | `/reports` (CSV/PDF buttons) |
| `GET /audit-logs?limit=` | `auditApi.listAuditLogs` | `/audit-logs` |

**Coverage: every endpoint in the Postman collection has an integrated service function.**
Two (`/health`, `/bootstrap/admin`) are deliberately not wired to a screen — see §12.

---

## 12. Gap Report

### 12.1 Flows that cannot be fully completed against the documented API

| Flow | Issue |
|---|---|
| **Field distribution (combined issue + redeem in one visit)** | The previous mock-only `/field/redeem` page assumed a single endpoint that issues and redeems in one call. No such endpoint exists in the Postman collection — issuance and redemption are always two separate resources (`voucher-issuances`, `voucher-redemptions`), each requiring their own request. **The page has been removed.** A truck-based distribution team must still perform a normal issue (by a Ward PA or someone with issuance rights) followed by a normal redemption scan; there is no one-step shortcut today. |
| **Self-service staff registration** | The Developer Guide doesn't describe this either, but the previous build had a mock-only "request access → SuperAdmin approves" flow. No `POST /auth/register`, `/approve`, or `/reject` endpoints exist. **Removed** — `POST /users` by a Super Admin is the only account-creation path. |
| **First Super Admin self-service onboarding** | `POST /bootstrap/admin` only succeeds while the users table is empty, and there's no UI for it — it must be called once via Postman/curl/an ops script before anyone can use `/login`. This is correct per the endpoint's own description, not a bug, but it means a brand-new deployment has no in-app way to create its first account. |

> **Update:** allocating directly to an LGA or an individual officer (Developer Guide §3.5)
> was originally listed here as unsupported, since the Postman collection only demonstrates
> `targetType: WARD`/`WARDS`. Inspecting the live API's actual response payloads showed the
> `voucher_allocations` table carries `lga_id` and `officer_user_id` columns, confirming the
> backend supports `LGA` and `OFFICER` target types too. `/vouchers/allocate` now exposes
> all four target types (`allocateToLga`/`allocateToOfficer` added to `voucherAllocationsApi.ts`).
> These two haven't been exercised against a real write yet — confirm the exact field names
> the backend expects on a test call before relying on them in production.

### 12.2 Endpoints integrated but intentionally not exposed in the UI

| Endpoint | Why |
|---|---|
| `GET /health` | Infra/uptime check, not a user-facing concept — no screen in the Developer Guide's §9 inventory corresponds to it. |
| `POST /bootstrap/admin` | One-time, pre-first-user operation — see 12.1. |
| `GET /programme-cycles/:id`, `GET /users/:id` | The list views already carry the fields the current UI needs; the detail-by-id calls are implemented and available for future use (e.g. a dedicated detail page) but have no caller today. |
| `GET /voucher-issuances?beneficiaryId=` | Implemented in `voucherIssuancesApi.ts`; the beneficiary detail page currently shows history via `GET /beneficiaries/:id/voucher-history` instead, which already covers the same need with redemption status included. |

### 12.3 Response shapes — verified directly against the live API

The Postman collection only documents request bodies, not responses, so the first pass
of this integration guessed response shapes defensively. Those guesses have since been
checked against the live deployment (`railwayBaseUrl`) directly and corrected wherever
they didn't match — listing the differences here because they're the kind of thing that
silently breaks a UI (the symptom reported: "data is coming from the API but not
displaying"), and because the Developer Guide's prose often doesn't match what's
actually returned either.

1. **Top-level envelope** — every endpoint returns `{ status, message, data }` (not a bare
   object). The `data` payload key for a list is *not* a generic `"items"` — it's named
   per-resource and inconsistently: `beneficiaries`, `users`, `batches`, `allocations`,
   `issuances`, `redemptions`, `sessions` (for receipts), `lgas`, `wards`, `roles`,
   `programmeCycles` (camelCase, unlike its siblings), and `auditLogs` (also camelCase).
   Every service function now reads the exact key for its resource rather than guessing —
   this was the root cause of most "API returns data, page shows nothing" symptoms, since
   the original code fell back to treating the whole `data` object as if it were the array.
2. **List item field casing is inconsistent and resource-specific.** Beneficiaries, voucher
   batches, vouchers, allocations, issuances, redemptions, and audit logs are all returned
   in **snake_case** (`full_name`, `lga_id`, `voucher_batch_id`, `actor_user_id`, ...). Users
   are snake_case on the *list* endpoint but **camelCase** on the single-record endpoint
   (`GET /users/:id` → `fullName`, `roleId`, `isActive`, `scopes.lgas/wards`) — and the list
   endpoint omits `roleId` and `scopes` entirely. The Edit User flow on `/users` now calls
   `GET /users/:id` before opening the form so it can prefill role/LGA/ward correctly; using
   the list row directly (the original implementation) always left those blank.
3. **`/voucher-redemptions/validate` and `/scan`** still don't have a documented response
   body even after this check (no successful QR token was available to exercise them with).
   The fallback behavior — "2xx with `{valid, message, voucher}` if present, else any 2xx is
   valid and any thrown error is a rejection using the server's `message`" — is unverified
   and the highest-risk remaining assumption in the codebase.
4. **`/reports/*` return raw groupby rows, not pre-aggregated metrics.** `by-lga`/`by-ward`/
   `by-gender`/`by-item` each return `{ rows: [{ <key>, <key>_name?, status, count }] }` — one
   row per (entity, status) pair, e.g. `{"lga_id":"1","lga_name":"Abak","status":"Redeemed","count":1}`.
   There is no `onRegister`/`issued`/`redeemed`/`rate` per the Developer Guide §8 — the
   frontend now pivots these rows client-side into one row per entity with a full
   status → count breakdown (`reportsApi.ts` → `pivot()`), rather than the originally
   assumed aggregate shape.
5. **`/reports/summary`** nests its payload one level deeper than assumed:
   `data.summary = { statusCounts, totalBatches, totalBeneficiaries, duplicateScanAttempts,
   issuedButUnredeemed, expired }` — there's no flat `generated`/`allocated`/`redeemed` at
   the top level.
6. **`/reports/inventory`** returns a single global `{ counts: { <status>: <count> } }` map,
   not a per-food-item breakdown — `getInventory()` and the batch detail page were rewritten
   around that.
7. **Voucher batch fields** don't match the Developer Guide's suggested schema (§5) or the
   originally-assumed shape: the live fields are `batch_code, programme_cycle_id, food_item,
   bag_size, quantity, validity_months, status, serial_first, serial_last, pdf_path,
   generated_by, generated_at, cancelled_at/by/reason, programme_cycle_name,
   generated_by_name`. There is **no `year` field returned** (it's accepted on `POST
   /voucher-batches` but not echoed back), and batch `status` values have no spaces
   (`PartlyAllocated`, not "Partly Allocated").
8. **`GET /voucher-batches/:id/vouchers`** returns a much narrower voucher shape than the
   Developer Guide's full vouchers table: only `id, serial_number, food_item, bag_size,
   status, expires_on, generated_at` — no `lga_id`/`ward_id`/`beneficiary_id` linkage at all
   on this endpoint. The batch detail page's voucher table was adjusted to only show what's
   actually returned (serial, status, expiry) instead of blank ward/beneficiary columns.
9. **`GET /voucher-receipts`** sessions are quantity-based (`expected_quantity,
   physical_quantity_received, missing_quantity, damaged_quantity`), not the serial-number
   arrays the `POST` request body uses (`serialNumbers`/`missingSerialNumbers`/
   `damagedSerialNumbers`). The Receive page's session history list now shows quantities.
10. **Beneficiary schema mismatch with the Developer Guide** — the Developer Guide
    (§3.2/§5) specifies `first_name`/`middle_name`/`surname`, `household_id`, and an
    Excel-based upload with NIN and Community columns. The live `POST /beneficiaries` body
    (and CSV header row) instead use `beneficiaryCode`, `fullName`, `householdSize`, and a
    CSV — not Excel — file; `community` does appear as a read-only field on individual
    beneficiary records (alongside several social-register import fields not exposed in the
    UI: `household_reference_no`, `relationship`, `date_of_birth`, `labour_type`, `source_file`).
    The implementation follows the live API over the guide, since the guide predates the build.

### 12.4 Pagination

Only two endpoints paginate today, confirmed against the live deployment:

| Endpoint | Pagination |
|---|---|
| `GET /beneficiaries` | Yes — `?page=&limit=`, response includes `data.pagination: { page, limit, total, pages }`. Default page size observed: 50. With ~5,000 beneficiaries loaded, the original client-side-only pagination (slice the first page fetched) only ever showed the first 50 records and made every other record invisible regardless of search/filter — this was the other major cause of "data is in the API but not on screen." |
| `GET /audit-logs` | Yes — same `?page=&limit=` / `pagination` shape. |
| Everything else (`users`, `voucher-batches`, `locations/*`, `voucher-allocations`, `voucher-issuances`, `voucher-redemptions`, `voucher-receipts`) | No `pagination` key observed even when passing `?page=&limit=` — these endpoints currently return the full result set in one response. Worth re-checking once these tables have production-scale row counts; if the backend adds pagination later, only `*Api.ts` + the relevant store would need updating (the `PagedResult<T>` / `PaginationMeta` types in `types/index.ts` already exist for this). |

`beneficiariesApi.listBeneficiaries()` and `auditApi.listAuditLogs()` now return
`PagedResult<T>` (`{ items, pagination }`) instead of a bare array, and their stores
(`stores/beneficiaries.ts`, `stores/auditLogs.ts`) hold `page`/`pagination` state and
re-fetch from the server on page change, rather than fetching once and slicing client-side.
The Social Register and Audit Logs pages both display `pagination.total` (the real
server-side count) instead of `beneficiaries.length` (which was only ever showing the
current page's size).

---

## 13. Deployment

This is a universal/SSR Nuxt app, needs a Node.js host (Vercel/Netlify for a quick demo
link; Azure/Railway/DigitalOcean for production). HTTPS is mandatory in production because
the QR scanner requires camera access, which browsers block over plain HTTP.
`NUXT_PUBLIC_API_BASE_URL` must point at the live backend (already the case in `.env`).
