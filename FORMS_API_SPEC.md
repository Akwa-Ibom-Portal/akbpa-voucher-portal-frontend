# Public Forms API — Backend Requirements

One endpoint to collect submissions from every public-facing form on the AKSBPA
website: Farmer Registration, Supplier Registration, Report an Issue, Contact Us, and
Newsletter Subscription. Send this document to the backend developer as-is.

The frontend is already integrated against this spec (`app/services/submissionsApi.ts`)
— once the endpoint exists at the URL/shape below, all five forms start working with no
further frontend changes.

---

## Endpoint

```
POST {{baseUrl}}/public/inquiries
```

`{{baseUrl}}` is the same API base the rest of the app uses (currently
`https://akbpa-voucher-api-production.up.railway.app/api/v1`).

- **No authentication required.** This must be reachable by anonymous site visitors —
  do not put it behind the existing `Authorization: Bearer` middleware that every other
  endpoint in this API uses.
- **Rate limiting recommended** (e.g. per-IP) since it's a public, unauthenticated,
  write endpoint and a natural spam target.
- **CORS:** must allow requests from the site's public origin (same origin already
  allowed for the rest of the API should cover this).

## Request

`Content-Type: application/json`

```jsonc
{
  "type": "farmer_registration",   // required — see Submission Types below
  "fullName": "Jane Doe",          // required for all types except newsletter_subscription
  "email": "jane@example.com",     // required for contact_message and newsletter_subscription; optional otherwise
  "phone": "08030000000",          // optional
  "fields": {                      // type-specific extra data — see table below
    "lga": "Uyo",
    "commodity": "Rice"
  },
  "source": "/register/farmer"     // the page path the form was submitted from — for triage/analytics, not shown to the user
}
```

### Submission Types and their `fields`

| `type` | Used by | `fullName` represents | `fields` keys |
|---|---|---|---|
| `farmer_registration` | Register as a Farmer (`/register/farmer`) | Farmer or cooperative name | `lga` (string), `commodity` (string) |
| `supplier_registration` | Become a Supplier (`/register/supplier`) | Contact person's name | `businessName` (string), `rcNumber` (string, optional), `commodity` (string) |
| `report_issue` | Report an Issue (`/report-issue`) | Reporter's name | `category` (string — one of: `Voucher / Redemption Issue`, `Procurement Concern`, `Supplier / Farmer Issue`, `Staff Conduct`, `Other`), `details` (string, the complaint body) |
| `contact_message` | Contact Us (`/contact`) | Sender's name | `subject` (string), `message` (string) |
| `newsletter_subscription` | Newsletter signup (homepage footer-adjacent section) | *(omitted/null)* | *(empty — only `email` is sent)* |

### Field validation expected

- `type`: required, must be one of the 5 values above — reject anything else with a 400.
- `email`: when present, validate as a well-formed email address.
- `phone`: free text is fine (Nigerian numbers in various formats); no strict format
  enforcement needed on the backend, the frontend does basic shape hinting only.
- Reject the request (400) if a type's **required** `fields` keys are missing — e.g.
  `contact_message` without `fields.message`.

## Response

Match the response envelope already used by the rest of this API (`{ status, message, data }`):

**Success — `201 Created`**
```jsonc
{
  "status": true,
  "message": "Submission received successfully",
  "data": {
    "submission": {
      "id": "123",
      "type": "farmer_registration",
      "status": "received",
      "createdAt": "2026-06-30T12:00:00.000Z"
    }
  }
}
```

**Validation error — `400 Bad Request`**
```jsonc
{
  "status": false,
  "message": "email is required for this submission type",
  "code": "VALIDATION_ERROR"
}
```

The frontend reads `message` directly to show the visitor an error, and falls back to a
generic "something went wrong" if the response doesn't match this shape — so the exact
wording of `message` is safe to adjust on the backend without a frontend change.

## Suggested storage model (optional, for the backend dev's reference)

A single `inquiries` table covers all five types:

| Column | Type | Notes |
|---|---|---|
| `id` | serial / uuid | |
| `type` | enum/string | one of the 5 values above |
| `full_name` | string, nullable | |
| `email` | string, nullable | |
| `phone` | string, nullable | |
| `fields` | jsonb | the type-specific payload, stored as-is |
| `source` | string, nullable | page path submitted from |
| `status` | string, default `'received'` | e.g. `received` → `in_review` → `resolved`, for future staff triage |
| `created_at` | timestamp | |

## Not required for v1, but worth flagging to the backend dev

- No `GET /public/inquiries` (staff-facing list/triage view) is requested yet — this
  spec only covers collecting submissions. If/when a staff review screen is wanted, that
  would be a separate authenticated endpoint (e.g. `GET /inquiries`, behind the existing
  Bearer auth, with a role like Super Admin/AKSBPA Admin) and the frontend would gain an
  admin page for it.
- No autoresponder/notification email is assumed — if the backend wants to email the
  submitter a confirmation or alert staff, that's a backend-side concern not exposed in
  this API contract.
