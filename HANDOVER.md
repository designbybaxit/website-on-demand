# Website on Demand (WebiMade): project handover
Updated 12 November 2026 (Asia/Karachi).

Read this first. It replaces the Nov 2, Nov 9 and Nov 11 handover notes, which are kept only as history in git if present.

## Owner and how to work with him
- Abdul Basit, Lahore, Pakistan (Asia/Karachi, UTC+5). Runs VoxBase Solutions; design brand "Design by Baxit"; GitHub `designbybaxit`.
- Wants plain, short answers, step by step. No sales calls. Never invent data (reviews, stats, licences, years, awards).
- Product UI work always goes to the brand-preview Worker first. Go live on production only when Abdul says so, in those words.
- Do not send him screenshots unless he asks. Tell him what changed, the URL, and the worker version.
- Usage is precious. Keep work tightly scoped, flag big jobs before starting.
- Ask him BEFORE starting any work in a separate cloud coding workspace (Cursor cloud agent). Work on the bot's own computer is fine.
- Do not push to `main`, do not force-push, and do not touch PR #2. Merges need Abdul's approval. Never commit secrets, `.dev.vars`, or `backend/wrangler.jsonc`.

## The product
Product name: **WebiMade** (webimade.com). "Baxit" is not in the product name; it appears only as a credit.

A small business fills in a form; the builder generates a premium one-page site and shows a clickable live preview (no watermark, no screenshots). The client can click Next / Previous design; the design on screen when they apply is the one published.

Price: **$50 setup + $29/month**, plus **$10** to connect a domain. The monthly plan can be cancelled any time. Payment is not on yet; for now Abdul presses "Mark as paid" in admin. Do not run production payment or publish end-to-end tests.

Site rules: follow `build-standard.md`; strong animation and interactivity but fast and practical; photos in every section that match the real industry; prices shown exactly as typed; sample reviews only in previews, never on live sites; no unsupported claims ("free quote", "24/7", "licensed", "insured") unless the client typed them. "Ready in minutes" / "Live in minutes" must not be used as a go-live SLA.

## WebiMade rebrand (Nov 11, 2026)
The product UI is no longer SiteSpark / Forest green. Live production uses the WebiMade teal palette, headed by Deep Teal **#0F5B59**. Client sites still keep their own industry colours.

What shipped:
- Horizontal WebiMade logo in the header. The word "Made" is recoloured for contrast. The logo links home to the start/form page.
- Logo preloader (hold at least 3 seconds). Footer credit: `© 2026 WebiMade. Presented by Design by Baxit`, with only "Design by Baxit" linked to https://designbybaxit.com (new tab, noopener).
- Form: heading "Get a website for your business."; subcopy left as written; select arrows inset so text does not overlap; trust row is Free preview / No card needed / Fully responsive on all devices / Made for your industry. About 18px between the "Ready in minutes" badge and the heading.
- Ready / preview screen: celebratory "Your website is ready" block, centred, with a comfortable gap under the header (66px desktop, 40px mobile), check badge and confetti (respects reduced motion). Shareable link, Copy link and Open your website preview sit on one line on desktop (Open is solid, same shape as Copy, colour-change hover only). "Approve and go live" is solid Deep Teal #0F5B59 with white text. Stepper pills are clickable for already-reached steps only; form data is kept; going back to "We build it" shows a finished state, not a rebuild.
- Paper planes were removed completely (background planes on the form, burst planes, and related code/assets). Soft orb atmosphere remains.
- Next / Previous design: a bug that destroyed the Open button after the first switch (and showed "Sorry, that design could not be built" on the next click) was fixed. A regression test covers the server-mode share-row layout. The Next-design button id is `#dNext`.

The current on-page tagline / headline copy was left as-is; a later tagline decision is still open. A full brand kit is also still open.

## What is live (production)
- Cloudflare Worker `wod`, via `backend/wrangler.jsonc`.
- Sites: https://webimade.com (canonical) and https://www.webimade.com (301 to the apex). Also https://wod.designbybaxit.workers.dev.
- Form at `/`, admin at `/admin`, share previews at `/p/<id>`, published client sites at `/s/<slug>`. Storage: D1 `wod-db`, KV. Bindings, vars (`BRAND_NAME` is `WebiMade`, and on production `ADMIN_HOST` is `webimade.com`) and secrets stay on the Worker; do not commit them.
- **Current production version: `7ea7e8b6-ff0f-4fbd-b200-a4cd0db695e2`** (security fixes, deployed 12 Nov 2026, 1:35 AM PKT).
- **Rollback target: `2f90b28b-a292-42ae-89bd-d43b9fb7bb51`**. This is the SEO-live code plus the rotated admin password (a Cloudflare "Secret Change" after `d53bcda5`). Do **not** roll back to `d53bcda5-8c69-4f13-b9d1-9a738584629f` — that version may restore the previous password. An older pre-SEO rollback id, `604d4ed9-ce19-47e4-b178-f830ecd065e4`, is the WebiMade rebrand only.
- Source backup of the security go-live: `/workspace/wod-backup-20261112-013526/`. (The earlier SEO go-live backup is still at `/workspace/wod-backup-20261111-234551/`.)
- If a rollback is needed: from `backend/`, `./node_modules/.bin/wrangler rollback 2f90b28b-a292-42ae-89bd-d43b9fb7bb51 --config wrangler.jsonc` (confirm the wrangler prompt at that time).
- One published client site exists, at `/s/test-plumbing-co` (a test plumbing business). It was still 200 after the security deploy. Do not republish it unless Abdul asks.

### SEO (live on production)
- Title: `WebiMade | Get a website for your business`
- Description: `Tell us a little about your business and we'll design a full website for your trade. You see it straight away, and only pay if you love it. No card needed.`
- Canonical, Open Graph and Twitter tags point at `https://webimade.com/` and `/og-image.png` (1200×630, logo + headline). Favicons and `site.webmanifest` come from `brand/logo-final-v2`. Organization + WebSite JSON-LD (parent: Design by Baxit). No fake ratings or reviews in the schema.
- `/robots.txt` allows `/`, disallows `/admin`, `/p/` and `/s/`, and points at `/sitemap.xml` (lists `https://webimade.com/`).
- `/admin` and `/p/` are noindex. The homepage is indexable (no `X-Robots-Tag` noindex on production).
- Google Search Console: the Domain property for webimade.com is verified, the sitemap has been submitted, and indexing has been requested. Recheck indexing in a few days.

### Security (live on production, Nov 12, 2026)
A read-only audit found no internet-reachable critical issues. The fixes below were built, deployed first to brand-preview, then to production when Abdul said "go live". A gitleaks scan of the full git history found 0 leaks.

What shipped:
- URL allowlist and escaping: logo, photos and social links accept only `https:` or `/i/` uploads, in the builder and again in the Worker on save and publish. Every URL goes through `hh()` / `uattr()`. Shared helpers live in `backend/src/security.mjs` and `demo/src/b2-helpers.js`.
- CSP on `/`, `/admin`, `/s/` and generated published pages (Google Fonts, Pexels and Unsplash still allowed). `/` and `/admin` also use `frame-ancestors 'none'` and `X-Frame-Options: DENY`. `/p/` keeps its existing sandbox CSP (`sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms; frame-ancestors 'self'`, no `allow-same-origin`) so previews still render in the builder iframe.
- Security headers on `/`, `/admin`, plain pages, `/s/` and `/p/`: HSTS `max-age=31536000; includeSubDomains` (no preload), Permissions-Policy, and nosniff.
- `/api/apply` ignores client amounts and writes the server-side prices ($50 setup, $29/month, +$10 to connect a domain).
- Honeypot enforced server-side on `/api/lead` (filled honeypot returns 200 and is not stored). Lead CORS no longer uses `*`; Origin is echoed only when it matches the Worker origin. Same-origin posts from `/s/` still work. No Turnstile yet.
- Image uploads are checked by magic bytes (JPEG, PNG, WebP) and nosniff is set on `plainPage()`.
- `account_id` was removed from `design-test/wrangler.toml`.
- `ADMIN_HOST=webimade.com` is set on production, so `/admin` and `/api/admin/*` are blocked on other hosts (including https://wod.designbybaxit.workers.dev/admin, which returns 404). Brand-preview leaves `ADMIN_HOST` unset so `/admin` still works on that host. `workers_dev` is unchanged.
- The admin password was rotated via the `ADMIN_PASSWORD` Worker secret on both `wod` and `wod-brand-preview`. The plaintext file `backend/ADMIN_PASSWORD.txt` was deleted. Never recreate that file. Never write the password anywhere — not in chat, git, this handover, or the Drive doc. Abdul has it.

Unit tests: `backend/test/test_security.mjs`. Do not run `backend/test/test_e2e.py`.

Known leftover: the new CSP blocks Cloudflare Web Analytics (`https://static.cloudflareinsights.com/beacon.min.js`). The product itself has no CSP errors. Allowing that host in `script-src` (and likely `connect-src`) is a one-line change if Abdul wants the beacon back.

## Preview and experiment Workers (not production)
- **`wod-brand-preview`**: https://wod-brand-preview.designbybaxit.workers.dev — the place to preview product-UI and SEO changes before production. Current security-preview version: `b8db6556-cf84-4eb1-9834-9a4f02996bc0` (same content that went live on production). An earlier SEO preview version was `241b3414-df6d-41e1-9456-c8afcbde334e`. This Worker always sends `X-Robots-Tag: noindex, nofollow` so it never competes with the real site. That noindex must not be copied into the production Worker. Canonical and OG URLs still point at webimade.com. `ADMIN_HOST` is unset here on purpose.
- **`wod-site-test`**: https://wod-site-test.designbybaxit.workers.dev — a saved marketing-website experiment (`site-test/`). Leave it as-is unless Abdul asks to change it. Do not deploy it when doing brand-preview or production work.
- Also still up, from earlier work: https://wod-design-test.designbybaxit.workers.dev (dental animation test) and https://wod-components-preview.designbybaxit.workers.dev (restaurant components preview).
- Old static demo (GitHub Pages, not the live product): https://designbybaxit.github.io/website-on-demand/demo.html
- Cloudflare account: Thegoldenpipsnetwork (thegoldenpipsnetwork@gmail.com), login via `wrangler login`. Admin password: Abdul has it; never print or store it in chat, git, or any doc. The password lives only as the `ADMIN_PASSWORD` Worker secret.

## Code and how to deploy
- GitHub: https://github.com/designbybaxit/website-on-demand (public). Repo root `index.html` and `app-demo.html` are a **different project** (UK landlord tools). Do not touch them. Updating root `demo.html` on `main` would change the GitHub Pages demo; do not do that casually. `demo/build.sh` can overwrite root `demo.html`; if that happens, restore it from `origin/main` and do not commit the root Pages files.
- Open PRs (do not merge without Abdul's approval; do not push to `main`; do not force-push; do not touch PR #2):
  - PR #3: https://github.com/designbybaxit/website-on-demand/pull/3 — WebiMade rebrand and SEO, branch `webimade-rebrand-seo-2026-11-11` (still unmerged).
  - PR #4: https://github.com/designbybaxit/website-on-demand/pull/4 — security fixes, branch `webimade-security-fixes-2026-11-12`, opened into the PR #3 branch (still unmerged).
- Builder source: `demo/src/` (vanilla JS + `shell.html`). Brand assets: `brand/web/` and `brand/logo-final-v2/`. Build: `sh demo/build.sh && sh backend/build.sh`.
- Demo tests: use `?nopreload=1`. On this computer run them through the Chrome wrapper (`/workspace/pwenv/bin/python /tmp/run_demo_tests.py` or the same idea). Do **not** run `backend/test/test_e2e.py` (it hits production and can mark a preview paid; it also still refers to the deleted password file).
- Backend: `backend/` (`src/worker.js`, `src/security.mjs`, `app/admin.*`, `build.sh`, `schema.sql`). `backend/wrangler.jsonc` holds the real D1/KV ids and is **not** in the repo. Never commit `ADMIN_PASSWORD.txt`, `.dev.vars`, or `.wrangler/`. Never recreate `ADMIN_PASSWORD.txt`.
- Deploy production only from `backend/`: `./node_modules/.bin/wrangler deploy --config wrangler.jsonc`, after asserting the name is `wod`, that `ADMIN_HOST` is `webimade.com`, and that the webimade.com / www custom-domain routes are intact. Do not pass or overwrite the `ADMIN_PASSWORD` secret. Do not use bare `npx wrangler` from other folders (unwritable cache). Record the previous version and take a source backup before a production deploy. If rolling back after a later secret change, prefer the Secret Change version so the current password is kept.
- Deploy brand-preview from `backend/` with `./node_modules/.bin/wrangler deploy --config ../brand-preview/wrangler.jsonc`, after copying `backend/public` into `brand-preview/public` (`rsync` is not installed; use `cp -a`) and asserting the name is `wod-brand-preview`. Never deploy `wod` when the task is preview-only.

## Design library
- Industries with researched, reference-based designs: dental, salon / barber / spa, plumber vs electrician, home cleaning vs pressure washing. Two businesses in the same trade get different designs (seeded by business name).
- Every other industry gets a complete fallback page. Known gap: fallback photos are generic, not industry-specific. **Batch 2 industries** (better industry-matched photos and further trades) is an open item.
- Research notes: `library/references/<industry>/SYNTHESIS.md` and `LINKS.md`.

## Google Drive (account thecornershelf02@gmail.com)
- Folder "Website on Demand Templates": https://drive.google.com/drive/folders/1bwCAlwW-DntGNX24XcvBlp8dy0IkGCUh
- This handover as a Google Doc: https://docs.google.com/document/d/1VPPExWvTbtTXPGFgKjkTyl5f0cSqqFr8BGkmTfP7LmA/edit

## Open items (ask Abdul first)
1. Tagline / headline copy — still the current wording, no new tagline decided.
2. Brand kit.
3. Batch 2 industries (better fallback photos and further trades).
4. Payment provider (not Stripe), Resend email, Safari/iOS testing.
5. Turnstile — Abdul creates the widget and secret first; it has not been added yet.
6. Optional: allow the Cloudflare Web Analytics beacon in the CSP (one-line allow of `https://static.cloudflareinsights.com`) if he wants that beacon back.
7. Cloudflare SSL / WAF / bot zone settings are still unverified (the zone settings API returned 403 with wrangler OAuth).
8. Optional email redaction in docs (account emails are still listed below only as identifiers).
9. PR #3 and PR #4 are still unmerged; merges need Abdul's approval.
10. Optional later: glass navbar and dish carousel in the main builder; UAE Arabic/English version.

## Postponed or settled from earlier lists
- Brand name is WebiMade (no longer SiteSpark). Footer credit is settled as above. The public domain is webimade.com (on this Cloudflare account, not the Hostinger/designbybaxit.com DNS).
- Search Console setup (domain property, sitemap, indexing request) is done; only the later recheck remains.
- The Nov 12 security fixes above are live on production.
