# MyScapez security checklist

Release gate before contractor records or customer contact details are collected on a server. This file is the status of the repository, not a promise that the live site is finished.

## Done in this repository

- Enquiry text is reduced to plain text before it is stored. Job type, suburb, property, lawn size, and frequency must match the allowed lists.
- `POST /api/leads` and `POST /api/listings` check the body on the server. A request over 12 KB, a non-JSON body, or a field outside the allowed lists is refused. The error text is one of three fixed sentences and does not repeat what was typed.
- Each address can send 5 form posts in 10 minutes on one server. The same enquiry is refused for 30 minutes. Neither counter is shared across every host.
- Cloudflare Turnstile is checked only when `TURNSTILE_SECRET_KEY` is set on the server. The site key, if used, is the public `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Neither key is in this repository, so the check is not active yet.
- The lead list at `/crm` does not render phone numbers or email addresses.
- A business profile can only be changed from the browser that created it. Example profiles cannot be overwritten. Reading enquiries uses that same token. Changing `id`, `businessId`, or `lead` in the address does not open another contractor's jobs. `GET /api/leads` does not return records.
- The business password is not stored and is not checked against an account.
- Pages send `nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security` for one year on this host only. The content security policy allows this site, the three lawn images, Vercel Analytics, and Cloudflare Turnstile. Inline scripts stay allowed because Next.js needs them to start. `includeSubDomains` and HSTS preload are not set.
- Public canonicals, the sitemap, and breadcrumb URLs use `https://myscapez.com`. This repository is the site for that domain. `myscapez-com-support.vercel.app` is another deploy of the same code, not a second website.
- Next.js is on 16.4.6, which fixes the two critical remote code execution advisories (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr) present in 16.3.8. `pnpm audit` reports no critical advisories. High findings that remain are inside the `shadcn` command, which the site does not import, or have no published fix. Dependabot opens update pull requests. Type errors fail `next build`.
- CodeQL is configured for JavaScript on push to `main`.
- The job form does not upload photos. It can count up to 6 JPEG, PNG or WebP files under 5 MB after reading the file header, then it drops the files. The server stores that count only. A body that is not JSON, or that includes a photo, a file, or a data URL, is refused. Street addresses are not collected. The only public photos are the three sample lawn images already on the site.
- A failed form handler writes `myscapez form-error` and returns the usual form sentence. It does not write the request. The third refused post from the same address on that server writes `myscapez form-abuse` once. The address is not in the line. Nothing is sent to Slack or email.

## Secrets

Checked on 21 October 2026. Nothing found to rotate.

- All 21 commits were searched for access keys, private keys, database URLs, GitHub tokens, Stripe keys, Slack webhooks, and Resend keys. No match.
- The current tree has no `NEXT_PUBLIC_` secret. Application code reads `NODE_ENV` to load Vercel Analytics in production, `GOOGLE_SITE_VERIFICATION` only to print the public Search Console tag when that value is set, and the server-only names in `lib/server/env.ts`.
- An accepted enquiry or listing sends one Vercel Analytics event named `enquiry`, with `kind` set to `lead` or `listing`. The event has no name, email, phone, suburb, or postcode. If Analytics is not configured, the form still succeeds and the request is not written to the log.
- Search Console should use `https://myscapez.com/sitemap.xml` once this code is what the anita-root repository deploys. Do not add `myscapez-com-support.vercel.app` as its own property. Set `GOOGLE_SITE_VERIFICATION` on the Vercel project that serves myscapez.com. No keyword, backlink, or session-recording tool is installed.
- The live client JavaScript contains one public name, `NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH`. That comes from Vercel Analytics. It is not a credential.
- The Vercel project `myscapez-com-support` has no environment variables set.
- GitHub Actions secrets could not be listed. The available token is not allowed to read them.
- `.env` files are ignored. Future secrets are read only in `lib/server/env.ts`, which imports `server-only`. Do not prefix `MONGODB_URI`, `RESEND_API_KEY`, `SLACK_WEBHOOK_URL`, `SESSION_SECRET`, or `TURNSTILE_SECRET_KEY` with `NEXT_PUBLIC_`. The Turnstile site key is public and is the one exception.

## Not done, and blocking a contractor rollout

- There is no account system. Typing an email does not prove identity, so this is not a defence against account takeover once records leave the browser.
- Customer and business contact details still sit in `localStorage` on that browser for the matching preview. Hiding them on the page is not the same as access control.
- MongoDB is supported but not connected on Vercel yet. When `MONGODB_URI` is set, `POST /api/leads` writes to the `leads` collection and `POST /api/listings` writes to `listings` with `status: "pending-review"`. Nothing reads them back on the site yet, and businesses are not told about a lead. The restore steps below have not been run.
- Slack is not connected. Resend sends booking emails when `RESEND_API_KEY` is set.
- GitHub refused to enable code scanning and secret scanning on this private repository because Advanced Security is not purchased. The CodeQL job runs, then cannot upload results.
- High dependency findings remain inside the unused `shadcn` tool chain. `braces` has no published fix. The site does not import `shadcn`.

## Database

MongoDB (for example MongoDB Atlas) replaces the earlier Neon plan. The connection lives in `lib/server/db.ts` and is only read on the server.

- Set `MONGODB_URI` and, if the database is not called `myscapez`, `MONGODB_DB` on the Vercel project. See `.env.example`.
- The server refuses to start if `MONGODB_URI` is not `mongodb://` or `mongodb+srv://`, has no password, turns TLS off or accepts invalid certificates, or uses an owner login (`root`, `admin`, `administrator`, `mongo`, `mongodb`, `atlasAdmin`, `owner`). The application user must be a separate database user with `readWrite` on the `myscapez` database only. Do not give it `dbAdmin`, `atlasAdmin` or cluster roles.
- In Atlas Network Access, allow only the addresses that need it. Vercel functions do not have fixed addresses on every plan; if `0.0.0.0/0` is used, the limited user and a long random password are the remaining protection.
- Bookings: the request form uses a calendar of days from tomorrow to 60 days ahead (Brisbane time, no Sundays), each with a morning and afternoon window. Each window holds `BOOKING_SLOTS_PER_WINDOW` jobs (default 4). A booking takes its spot in `bookingSlots` with one conditional increment, so two customers cannot both take the last spot. If the lead then fails to save, the spot is given back. `GET /api/availability` returns only counts of remaining spots, never customer details.
- Booking emails: when `RESEND_API_KEY` is set, the customer gets a plain-text confirmation from `RESEND_FROM_EMAIL` (default `MyScapez <bookings@myscapez.com>`, which must be on a domain verified in Resend), and `LEAD_RECIPIENT_EMAIL` (or `MYSCAPEZ_ADMIN_EMAIL`, or admin@myscapez.com) gets the booking with contact details. A failed send does not cancel the booking. No SMS is sent.
- Every stored value is reduced to plain strings or allowed list values before it reaches MongoDB, so a request cannot send query operators. The same enquiry is refused for 30 minutes across every server instance by looking for its fingerprint in the database. Client addresses are not stored.
- Without `MONGODB_URI` the forms behave as before and nothing is written on the server. If the database cannot be reached, the form returns the usual error and the server logs `myscapez form-error`.
- Backups: turn on Atlas continuous backup or scheduled snapshots before collecting real customer details. No backup has been taken and no restore has been tested.
- Restore: restore a snapshot to a new cluster, point `MONGODB_URI` at it with the limited user, read one known document, then send traffic to it. Do not restore by dropping the current database.

## Incident

No paging is connected. Watch the server log for `myscapez form-error` or `myscapez form-abuse`. Those lines do not contain the form or the address. A page crash shows "This page could not be loaded." and not the error text.

To turn off a compromised integration, delete its variable in the Vercel project `myscapez-com-support` and redeploy. Do not paste the value into git or into a log.

| Variable | What deleting it does |
|---|---|
| `TURNSTILE_SECRET_KEY` | The form check stops. The site keeps working. |
| `RESEND_API_KEY` | Booking confirmation emails stop. Bookings are still taken. |
| `SLACK_WEBHOOK_URL` | Nothing posts to Slack today, because Slack is not called. |
| `MONGODB_URI` | The app starts with no database. Leads and listings are not stored on the server. |
| `SESSION_SECRET` | No server session reads it yet. |

To rotate a key: create the new key at the provider, set that one variable, redeploy, then revoke the old key at the provider. Revoke the old key only after the new deployment is serving. None of these variables are set on Vercel today, so there is no live key to rotate.

## Later, not this release

Performance, Core Web Vitals, and answer-engine copy are separate from this checklist. Public titles, the sitemap of this host, and the organization and website structured data are already on main.
