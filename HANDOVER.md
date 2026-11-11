# Website on Demand (WebiMade): project handover
Updated 11 November 2026 (Asia/Karachi).

Read this first. It replaces the Nov 2 and Nov 9 handover notes, which are kept only as history in git if present.

## Owner and how to work with him
- Abdul Basit, Lahore, Pakistan (Asia/Karachi, UTC+5). Runs VoxBase Solutions; design brand "Design by Baxit"; GitHub `designbybaxit`.
- Wants plain, short answers, step by step. No sales calls. Never invent data (reviews, stats, licences, years, awards).
- Product UI work always goes to the brand-preview Worker first. Go live on production only when Abdul says so, in those words.
- Do not send him screenshots unless he asks. Tell him what changed, the URL, and the worker version.
- Usage is precious. Keep work tightly scoped, flag big jobs before starting.
- Ask him BEFORE starting any work in a separate cloud coding workspace (Cursor cloud agent). Work on the bot's own computer is fine.

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
- Next / Previous design: a bug that destroyed the Open button after the first switch (and showed "Sorry, that design could not be built" on the next click) was fixed. A regression test covers the server-mode share-row layout.

The current on-page tagline / headline copy was left as-is; a later tagline decision is still open. A full brand kit is also still open.

## What is live (production)
- Cloudflare Worker `wod`, via `backend/wrangler.jsonc`.
- Sites: https://webimade.com (canonical) and https://www.webimade.com (301 to the apex). Also https://wod.designbybaxit.workers.dev.
- Form at `/`, admin at `/admin`, share previews at `/p/<id>`, published client sites at `/s/<slug>`. Storage: D1 `wod-db`, KV. Bindings, vars (`BRAND_NAME` is `WebiMade`) and secrets stay on the Worker; do not commit them.
- **Current production version: `d53bcda5-8c69-4f13-b9d1-9a738584629f`** (SEO go-live, 11 Nov 2026).
- **Rollback target: `604d4ed9-ce19-47e4-b178-f830ecd065e4`** (WebiMade rebrand, before the SEO deploy).
- Source backup of that go-live: `/workspace/wod-backup-20261111-234551/`.
- If a rollback is needed: from `backend/`, `./node_modules/.bin/wrangler rollback 604d4ed9-ce19-47e4-b178-f830ecd065e4 --config wrangler.jsonc` (confirm the wrangler prompt at that time).

### SEO (live on production)
- Title: `WebiMade | Get a website for your business`
- Description: `Tell us a little about your business and we'll design a full website for your trade. You see it straight away, and only pay if you love it. No card needed.`
- Canonical, Open Graph and Twitter tags point at `https://webimade.com/` and `/og-image.png` (1200×630, logo + headline). Favicons and `site.webmanifest` come from `brand/logo-final-v2`. Organization + WebSite JSON-LD (parent: Design by Baxit). No fake ratings or reviews in the schema.
- `/robots.txt` allows `/`, disallows `/admin`, `/p/` and `/s/`, and points at `/sitemap.xml` (lists `https://webimade.com/`).
- `/admin` and `/p/` are noindex. The homepage is indexable (no `X-Robots-Tag` noindex on production).
- Google Search Console: the Domain property for webimade.com is verified, the sitemap has been submitted, and indexing has been requested.

## Preview and experiment Workers (not production)
- **`wod-brand-preview`**: https://wod-brand-preview.designbybaxit.workers.dev — the place to preview product-UI and SEO changes before production. Last SEO preview version: `241b3414-df6d-41e1-9456-c8afcbde334e` (same content that went live). This Worker always sends `X-Robots-Tag: noindex, nofollow` so it never competes with the real site. That noindex must not be copied into the production Worker. Canonical and OG URLs still point at webimade.com.
- **`wod-site-test`**: https://wod-site-test.designbybaxit.workers.dev — a saved marketing-website experiment (`site-test/`). Leave it as-is unless Abdul asks to change it. Do not deploy it when doing brand-preview or production work.
- Also still up, from earlier work: https://wod-design-test.designbybaxit.workers.dev (dental animation test) and https://wod-components-preview.designbybaxit.workers.dev (restaurant components preview).
- Old static demo (GitHub Pages, not the live product): https://designbybaxit.github.io/website-on-demand/demo.html
- Cloudflare account: Thegoldenpipsnetwork (thegoldenpipsnetwork@gmail.com), login via `wrangler login`. Admin password: Abdul has it; never print or store it in chat or in git.

## Code and how to deploy
- GitHub: https://github.com/designbybaxit/website-on-demand (public). Repo root `index.html` and `app-demo.html` are a **different project** (UK landlord tools). Do not touch them. Updating root `demo.html` on `main` would change the GitHub Pages demo; do not do that casually.
- Builder source: `demo/src/` (vanilla JS + `shell.html`). Brand assets: `brand/web/` and `brand/logo-final-v2/`. Build: `sh demo/build.sh && sh backend/build.sh`.
- Demo tests: use `?nopreload=1`. On this computer run them through the Chrome wrapper (`/workspace/pwenv/bin/python /tmp/run_demo_tests.py` or the same idea). Do **not** run `backend/test/test_e2e.py` (it hits production and can mark a preview paid).
- Backend: `backend/` (`src/worker.js`, `app/admin.*`, `build.sh`, `schema.sql`). `backend/wrangler.jsonc` holds the real D1/KV ids and is **not** in the repo. Never commit `ADMIN_PASSWORD.txt`, `.dev.vars`, or `.wrangler/`.
- Deploy production only from `backend/`: `./node_modules/.bin/wrangler deploy --config wrangler.jsonc`, after asserting the name is `wod` and the webimade.com / www custom-domain routes are intact. Do not use bare `npx wrangler` from other folders (unwritable cache). Record the previous version and take a source backup before a production deploy.
- Deploy brand-preview from `backend/` with `./node_modules/.bin/wrangler deploy --config ../brand-preview/wrangler.jsonc`, after copying `backend/public` into `brand-preview/public` and asserting the name is `wod-brand-preview`. Never deploy `wod` when the task is preview-only.

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
4. Payment provider (not Stripe), Resend email, Turnstile, Safari/iOS testing.
5. Optional later: glass navbar and dish carousel in the main builder; UAE Arabic/English version.

## Postponed or settled from earlier lists
- Brand name is WebiMade (no longer SiteSpark). Footer credit is settled as above. The public domain is webimade.com (on this Cloudflare account, not the Hostinger/designbybaxit.com DNS).
