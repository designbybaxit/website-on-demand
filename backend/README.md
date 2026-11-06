# Website on Demand – backend (phase 1, Cloudflare free plan)

Live: **https://wod.designbybaxit.workers.dev** (Worker `wod`, account "Thegoldenpipsnetwork@gmail.com's Account", workers.dev subdomain `designbybaxit`).
Admin: **https://wod.designbybaxit.workers.dev/admin** – password is in `backend/ADMIN_PASSWORD.txt` (chmod 600, git-ignored) and set as the Worker secret `ADMIN_PASSWORD`.

Nothing here uses `designbybaxit.com` (that domain is on a different Cloudflare account). No payment method, no paid products, no Email Routing.

## How it works
One Worker does everything:
- **Order app** (`/`) = the v3 builder from `../demo/src`, served as free static assets, in *server mode* (`window.WOD_API = 1`).
  Form → the browser builds the site (as before) → photos are uploaded to `/api/img`, the details + the preview HTML go to `/api/save` →
  the client gets a **private preview link** `/p/<id>` (14 days, noindex) that works on any device. The in-page desktop/mobile preview is unchanged.
  Change requests save a new version to the same link. "Approve" → **Apply now** (no payment taken) → status `applied`.
- **Admin** (`/admin`): login, list of requests (all details, photos, preview link, opens, history, change requests, before-launch list),
  **Mark as paid & publish**, **Re-publish (rebuild)**, **Unpublish**, the list of emails that *would* be sent, and enquiries from live sites.
- **Publishing**: the admin page (Abdul's own browser, trusted) rebuilds the site from the stored form data in **live mode** and uploads the HTML
  (keeps the Worker far inside the free 10 ms CPU limit). Live mode = sample reviews and sample figures removed (section dropped), stock-photo tags
  hidden, page indexable with a canonical URL, and the site's forms send real enquiries to `/api/lead/<slug>`. The server refuses any live HTML
  that still contains a sample tag. Served at **`/s/<slug>`**. Unpublish → polite "This website is offline" page.
- **Emails**: not connected yet (no Resend account). `sendEmail()` in `src/worker.js` is the hook: today it records an `email_pending` event
  (shown in admin as "NOT SENT"); set secrets `RESEND_API_KEY` + var `EMAIL_FROM` and the same calls send for real.
  Emails queued: client "your preview", Abdul "new preview", Abdul "APPLIED – send payment link" (all details), client "we got your application",
  client "your website is live" (with Abdul's address for changes), business owner "new enquiry from your website".

## Routes
| Route | What |
|---|---|
| `GET /` , `/admin` | static app / admin page (`public/`, built by `build.sh`) |
| `POST /api/new` | `{name,email}` → `{id, token}` (20 per IP per day) |
| `POST /api/img/<id>` | raw JPG/PNG/WebP body, header `X-Token` → `{url:"/i/<id>/<key>"}` (≤1.5 MB, ≤30 per request) |
| `POST /api/save/<id>` | `{token,data,opts,version,revisions,styleKey,placeholders,html}` → `{url, expiresAt}` (≤60 saves/day per request, HTML ≤900 KB, inline images refused) |
| `POST /api/apply/<id>` | `{token,email,domain,dueToday,currency,setup,monthly,version}` → status `applied`, preview kept 60 days |
| `GET /p/<id>` | preview (KV `pv:<id>`), `X-Robots-Tag: noindex`, CSP `sandbox` (runs in an opaque origin: uploaded HTML can't touch the admin) ; expired page otherwise |
| `GET /s/<slug>` | live site (KV `site:<slug>`) or offline page |
| `GET /i/<id>/<key>` | uploaded photo/logo (KV), cached 1 year |
| `POST /api/lead/<slug>` | enquiry from a live site's form (CORS, ≤12 KB, 20 per IP per day) |
| `POST /api/admin/login` / `logout` | session cookie (HMAC, HttpOnly, Secure, SameSite=Strict, 12 h; 8 attempts per IP per 15 min) |
| `GET /api/admin/list` | requests + events + leads |
| `POST /api/admin/publish/<id>` | `{slug, html, paid:{amount,currency,reference}}` (header `x-wod-admin: 1`) |
| `POST /api/admin/unpublish/<id>` | take a live site offline |

## Data model
D1 database `wod-db` (`schema.sql`):
- `submissions` – id (random 18 chars = preview id), token_hash, status (`previewing` → `applied` → `published` / `unpublished`), name, slug, email, phone,
  country, industry, data_json (all form fields; photos as `/i/` URLs), opts_json, version, revisions_json, placeholders_json, style_key,
  preview_expires_at, preview_opens, img_count, apply_json, applied_at, paid_json (manual for now), published_slug, published_at, ip, ip_country.
- `events` – audit trail per request (created, preview_saved/updated, applied, paid, published, republished, unpublished, email_pending…).
- `leads` – enquiries from live sites. `rate` – rate-limit counters.
KV namespace `wod-store` (binding `KV`): `pv:<id>` preview HTML (TTL 14 d, 60 d after Apply), `img:<id>:<key>` photos, `site:<slug>` live HTML.
Free-plan budget: KV 1,000 writes/day ≈ 100+ new requests/day; 1 GB ≈ 400–500 clients with photos.

## Build, deploy, test
```sh
export PATH=/workspace/tools/node-v22.11.0-linux-x64/bin:$PATH
cd /workspace/website-on-demand/backend
./build.sh                      # public/index.html + public/admin.html from ../demo/src (+ app/admin.html, app/admin.js)
npx wrangler deploy             # Wrangler is logged in by OAuth to the account above
npx wrangler secret put ADMIN_PASSWORD < ADMIN_PASSWORD.txt     # only if the password changes
npx wrangler d1 execute wod-db --remote --file schema.sql      # schema (idempotent)
./test/reset_test_data.sh       # removes the "Test Plumbing Co" test request(s) so the e2e test can run again
/workspace/pwenv/bin/python test/test_e2e.py                   # full live flow, 41 checks, screenshots -> screenshots/
```
The GitHub Pages demo still builds from the same `../demo/src` with `sh ../demo/build.sh`; server mode and live mode are off there
(demo regression test `../demo/test/test_demo.py` passes). Changes made to the shared source for this backend:
`b8-assemble.js` (live mode), `b6-sections.js` (live form modal text), `b7-runtime.js` (live forms post to `data-lead`), `c1-app.js` (server mode).

## Not done yet (next phases)
Real emails (Resend), Turnstile, payment provider webhook (manual "Mark as paid" for now), own domains / nicer addresses, delete/export in admin,
copying Unsplash stock photos into our storage on publish, auto-deleting stale unpaid requests, app brand/currency (still "SiteSpark", $ prices).
