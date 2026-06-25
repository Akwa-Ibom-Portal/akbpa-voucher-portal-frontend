# AKBPA Food Voucher Portal

Frontend for the Akwa Ibom Bulk Purchase Agency (AKBPA) Food Voucher Administration
Portal — manages the full lifecycle of food vouchers (rice, beans, garri) for Social
Register beneficiaries across Akwa Ibom State's 31 LGAs and 329 wards.

Built with **Nuxt 3**, **Nuxt UI**, **Pinia**, and **Axios**. Currently runs against an
in-memory mock data layer that mirrors the real backend's API contract exactly — flip one
environment variable to point it at the live NestJS backend once that's ready, no page
code changes required.

📄 See **[`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md)** for the full
breakdown of every screen, role, API endpoint, and business rule the system implements.

## What's in here

- **Public site** — landing page, eligibility criteria, how-it-works, FAQs
- **Staff auth** — login, admin-invite onboarding, self-service access request
  (pending approval), forgot/reset password, profile
- **Admin portal** (role-gated) — Social Register management, QR voucher generation,
  printer reconciliation, allocation, issuance, field redemption, camera-based QR
  scanning, reports, audit logs, user management

## Quick Start

```bash
npm install
cp .env.example .env   # then edit NUXT_PUBLIC_API_BASE_URL if/when the real backend is live
npm run dev
```

Open `http://localhost:3000`, click **Login**, and use the "Demo Accounts" panel to sign
in as any role — any non-empty password works while `NUXT_PUBLIC_USE_MOCK_API=true`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | `http://localhost:3001/api` | Base URL of the real backend |
| `NUXT_PUBLIC_API_TIMEOUT` | `15000` | Axios request timeout (ms) |
| `NUXT_PUBLIC_USE_MOCK_API` | `true` | `true` = use in-memory mock data; `false` = call the real backend |
| `NUXT_PUBLIC_MOCK_DELAY` | `350` | Artificial latency (ms) for mock responses, so loading states are visible |

## Project Structure

```
app/
├── pages/          Routes — public site, auth flow, admin portal
├── layouts/         public / auth / admin / scanner shells
├── stores/          Pinia stores (one per domain)
├── services/        API layer — mock-backed today, axios-ready for the real backend
├── data/            Mock "database": LGAs/wards, users, beneficiaries, vouchers
├── types/           Shared TypeScript types
└── middleware/      auth + role route guards
```

---

## Nuxt Basics

This is a standard Nuxt 3 project. The notes below are the framework-level setup steps —
see the sections above for everything specific to this project.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
