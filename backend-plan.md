# Website on Demand: backend plan (v1, plan only, nothing built yet)
Written 2 Nov 2026 (PKT, UTC+5). Builds on `HANDOVER.md`, `demo/README.md`, `demo/src/c1-app.js` and `research-v2.md`.
Every Cloudflare/email limit below was checked against the provider's own page today; links are next to each figure. Anything not from a source is marked **[judgement]** or **[to test]**.

---
## 0. The plan in ten lines
1. **One Cloudflare Worker does everything**: serves the order app (as free static assets), the API, the shareable preview links, Abdul's admin page and every published client site. No servers, no Pages projects needed.
2. **D1** (Cloudflare's free SQL database) stores each client's details and status. **KV** stores preview HTML, live site HTML and uploaded photos/logos. Both work on the free plan **without a card**. R2 is nicer for files but needs a payment method on the account, so it waits.
3. **Client sites live at `<business>.designbybaxit.com`** via one wildcard DNS record + one wildcard Worker route. `designbybaxit.com` already uses Cloudflare nameservers (checked today), so this costs nothing if that zone is in this Cloudflare account.
4. **Previews get a real link** (`/p/<random-id>`) that opens on any phone, is `noindex`, and expires after 14 days.
5. **"Apply now" saves everything and emails Abdul** (via Resend free tier: 100 emails/day). The payment step is a plug-in: for now Abdul presses **"Mark as paid"** in admin; later the provider's webhook presses it automatically.
6. **"Paid" → the site is rebuilt in live mode (no sample reviews, real contact form), published, and the client is emailed their link** with "for changes, just reply / email us at …".
7. **Admin page** (password-protected): list, open preview, mark paid, publish/unpublish, delete, export.
8. **Own domains for clients** come later via Cloudflare for SaaS (100 hostnames free, but needs a card on file) or, without a card, `www.theirdomain` pointing at a per-client Pages project.
9. **Abdul's inputs, in order**: confirm the domain, a Cloudflare API token, a Resend account, the reply-to email, and the brand name. Payment provider can come last.
10. **Effort**: ~8 working days in 7 small phases; Abdul can test something real after phase 1 (day 1–2).

---
## 1. Architecture

### 1.1 Pieces and why
| Need | Choice | Why (free-tier facts) |
|---|---|---|
| Order app (form, preview screen) | **Worker static assets** (move `demo.html` + JS/CSS into the Worker's `public/` folder). Keep GitHub Pages as a fallback/demo. | Requests to static assets are **free and unlimited** ([Workers pricing, footnote 3](https://developers.cloudflare.com/workers/platform/pricing/)); up to 20,000 files, 25 MiB each on Free ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)). Cloudflare itself now points new/scaling sites to Workers Static Assets instead of Pages ([Pages limits → Projects](https://developers.cloudflare.com/pages/platform/limits/)). One deploy covers app + API, so no cross-site setup. |
| API (save, preview, admin, publish, leads) | **Same Worker**, routes under `/api/*` | Free: **100,000 requests/day** account-wide, **10 ms CPU** per request, 50 subrequests per request, 100 Workers per account ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/)). Our API work is tiny (store/read JSON). |
| Client details, status, history | **D1** (SQLite) | Free: 5 million rows read/day, 100,000 rows written/day, 500 MB per database, 5 GB per account, 10 databases ([D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)). Max row 2 MB, so photos do **not** go here. 7 days of point-in-time restore on Free. |
| Preview HTML, live site HTML, photos/logos | **Workers KV** | Free: 100,000 reads/day, **1,000 writes/day**, 1 GB storage, values up to 25 MiB ([KV limits](https://developers.cloudflare.com/kv/platform/limits/)). Keys can be given an expiry, which gives us auto-expiring previews ([KV write docs](https://developers.cloudflare.com/kv/api/write-key-value-pairs/)). |
| Later: bigger file storage | **R2** | Free tier 10 GB-month, 1M writes, 10M reads per month, no egress fees ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)), **but** the account needs an R2 subscription with a payment method first ([R2 get started](https://developers.cloudflare.com/r2/get-started/)). Switch when KV's 1 GB gets tight. |
| Spam protection on the form | **Turnstile** | Free, unlimited challenges, up to 20 widgets, 10 hostnames per widget ([Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)). |
| Emails out (to Abdul, to clients) | **Resend** free plan | 3,000 emails/month, **100/day**, 3 sending domains ([Resend pricing](https://resend.com/pricing)). Alternative: Brevo free, 300/day, no card ([Brevo help](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan)). Cloudflare's own Email Sending needs Workers Paid for arbitrary recipients ([CF Email pricing](https://developers.cloudflare.com/email-service/platform/pricing/)). |

### 1.2 How big does the free tier get us? [derived]
- **Storage**: a site is ~80 KB of HTML (measured today: the 8 demo examples build to 77–85 KB) plus up to 6 photos (resized in the browser to 1200 px JPEG at quality 0.78, typically 150–300 KB each) and a 256 px logo. Call it **≤2 MB per client with photos**, far less without. KV's 1 GB ≈ **400–500 clients with full photo sets** [derived]; previews expire, so only paid sites stay.
- **Writes**: one submission ≈ 1 D1 row + ~8 KV writes (HTML + photos); each change request ≈ 1–2 more. KV's 1,000 writes/day ≈ **100+ new submissions per day**. Fine for the ad test (research-v2 base case: a few dozen leads a week).
- **Traffic**: every visit to a client site = 1 Worker request for the page + 1 per uploaded photo we serve (Unsplash photos load from Unsplash, not us). At ~5 requests per visit, 100,000/day ≈ **20,000 client-site visits/day across all clients** [derived]. If we ever get near it: Workers Paid is $5/month for 10M requests ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)). Free-plan overflow behaviour is configurable per route (fail open or show error 1027) ([limits → Daily requests](https://developers.cloudflare.com/workers/platform/limits/)).
- **CPU**: I timed the existing builder (`b1–b8`) in Node today: **0.6–1.7 ms per site warm, but 74 ms on the very first run** (code warming up). The Free plan's 10 ms CPU limit has some "built-in flexibility" for occasional spikes ([limits → CPU time](https://developers.cloudflare.com/workers/platform/limits/)) but that is not a guarantee. **[to test in phase 0]** whether a live rebuild fits on Free; fallback in §2.4.

### 1.3 Data model (D1, plain English)
- `submissions`: id (random, unguessable), created/updated, status, business name, slug, email, phone, country, industry, all form fields as JSON (no photos), chosen options (style/colour/headline), version, change notes, preview expiry, paid info (provider, reference, amount, currency, date), published URL, custom domain, IP country, Turnstile result.
- `events`: submission id, time, what happened (submitted, preview opened, change requested, applied, paid, published, unpublished, email sent/failed). This is Abdul's audit trail.
- `leads`: messages that visitors send through a **live** client site's contact form (so nothing is lost if an email bounces).
- KV keys: `pv:<id>` (preview HTML, 14-day expiry), `img:<id>:<n>` (photos/logo), `site:<slug>` (live HTML), `host:<hostname>` → slug (for custom domains).

### 1.4 Status flow
`previewing` → `applied` (clicked Apply now, details complete) → `awaiting_payment` → `paid` → `published` → (`paused` if a recurring payment fails or they cancel) → `deleted`.
Change requests after launch arrive by email to Abdul (his confirmed choice); he edits in admin, which re-publishes.

---
## 2. How each client site is published

### 2.1 Recommended: `<business>.designbybaxit.com` (one Worker, wildcard)
- Checked today: `designbybaxit.com` uses Cloudflare nameservers (`emerson`/`rosa.ns.cloudflare.com`) and serves Abdul's "Design by Baxit" site; mail is on Titan (`mx1/mx2.titan.email`). **Need to confirm it is in this account** (88e4…114d), not another Cloudflare login.
- Add one DNS record `*` (proxied). Wildcard records can be proxied on **all plans** ([wildcard DNS](https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/)). Existing specific records (apex, `www`, mail) keep working, because a specific record always beats the wildcard (same page).
- Add one Worker route `*.designbybaxit.com/*` → our Worker, plus "no Worker" routes for `www` and any other existing subdomain so they are untouched (the most specific route wins; a route with no Worker cancels a broader one ([routes](https://developers.cloudflare.com/workers/configuration/routing/routes/))). Limit: 1,000 routes per zone (same doc), we need ~3.
- HTTPS is automatic: free Universal SSL covers the apex and **first-level** subdomains like `joes-plumbing.designbybaxit.com`. It does **not** cover two levels (`joes.sites.designbybaxit.com`) without paid Advanced Certificate Manager ([Universal SSL limitations](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/)). So keep client sites one level deep.
- The Worker reads the hostname, looks up `site:<slug>` in KV and returns the HTML. Publishing = writing one KV key. Unpublishing = deleting it (visitors see a polite "this site is offline" page). **No limit on number of sites** other than storage.
- Reserved slugs that clients can't take: `www, mail, app, api, admin, preview, get, order, help, support, billing, status, blog, dev, test` plus anything already in DNS.
- **[judgement] Option to consider**: a separate cheap domain just for client sites (e.g. `baxitsites.com`, roughly the cost of a domain per year) keeps Abdul's portfolio domain safe if one client site ever gets reported for spam/phishing, and keeps client URLs short. Not needed to start.

### 2.2 If no domain is used: free addresses Cloudflare gives us
| Option | Address | Limits | Verdict |
|---|---|---|---|
| One Worker, path per client | `wod.<account-subdomain>.workers.dev/s/joes-plumbing` | Unlimited sites; but `workers.dev` is "intended for personal or hobby projects", recommended against for production ([workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)); path URLs look cheap. | Fine for **previews**, weak for paid sites. |
| One Worker per client | `joes-plumbing.<account-subdomain>.workers.dev` | 100 Workers per account on Free ([limits](https://developers.cloudflare.com/workers/platform/limits/)); the URL always contains the account subdomain. | Not worth it. |
| One Pages project per client (created by API, Direct Upload) | `joes-plumbing.pages.dev` (names are global, so a taken name gets a different one) | **100 projects per account, "not routinely increased"**, and new accounts are throttled on creating projects in the first 48 h ([Pages limits](https://developers.cloudflare.com/pages/platform/limits/)); created via `POST /accounts/{id}/pages/projects` + a deployment ([API](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/create/)). | Best-looking free address with no domain, but **caps out at ~95 clients**. Use only if Abdul doesn't want `designbybaxit.com` used. |

### 2.3 Client's own domain (the old "+$10 connect domain")
| Option | How it works for the client | Cost / catch |
|---|---|---|
| **A. Cloudflare for SaaS custom hostnames** (recommended once there are domain clients) | Client adds a CNAME (`www` → `sites.designbybaxit.com`) at their registrar; Cloudflare issues the certificate; our same Worker serves it (SaaS traffic runs through our zone's Worker routes ([routes → Zone scope](https://developers.cloudflare.com/workers/configuration/routing/routes/))). | **100 hostnames included on Free, then $0.10 each/month** ([SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/)); pending hostnames count until deleted ([quotas](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/quotas-and-billing/)). **Enabling it needs payment info on the account even on Free** ([enable](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/enable/)). Bare `theirdomain.com` (apex) via CNAME isn't offered on Free ("Apex proxying: No"), so we redirect apex → `www` at their registrar or they use a registrar that supports CNAME flattening/ALIAS. |
| B. No card: a Pages project for that client | Client adds CNAME `www` → `<client>.pages.dev`; Pages allows 100 custom domains per project and subdomains don't need to be on Cloudflare ([Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)). | Uses one of the 100 Pages projects per client with a domain; apex again needs the domain moved to Cloudflare. OK as a stopgap for the first few. |
| C. Client moves their domain's nameservers into Abdul's Cloudflare | Apex works, free SSL. | Abdul then manages their DNS/email records; heavy and risky. Only for clients who ask. |

### 2.4 Who builds the HTML? (important for safety)
- **Preview**: keep today's behaviour. The client's browser builds the site instantly (as now), then uploads the form data + photos + the built HTML. Because this HTML came from a visitor's browser it is **untrusted**, so previews are served from an isolated host (`<worker>.<account-subdomain>.workers.dev/p/<id>` or a separate `preview` domain), never from `designbybaxit.com`, with `noindex` and a strict security policy. A bad actor could only ever "host" junk on an expiring, non-indexed preview link.
- **Live site**: never published from uploaded HTML. On "paid", the **server rebuilds from the stored form data** using the same builder code in a new **live mode** (see §2.5). If the Free plan's 10 ms CPU limit rejects the rebuild [to test], fallback = the admin page (Abdul's own browser, trusted) rebuilds and uploads on "Publish", or move to Workers Paid ($5/mo) which allows up to 5 min CPU ([limits](https://developers.cloudflare.com/workers/platform/limits/)).

### 2.5 Builder changes needed for live sites (the builder is preview-only today)
- `buildSite(d, opts, ai, mode)` currently always emits preview behaviour: `<meta name="robots" content="noindex">`, forms open a "nothing sent" modal (`b6-sections.js`, `b7-runtime.js`), sample reviews/figures are inserted when none were given (`b3-model.js`).
- Add `mode.live = true`: index-able, canonical URL, sample reviews and sample figures **removed** (handover rule: never on a live site), forms POST to `/api/lead/<slug>` which saves to D1 and emails the business owner (via Resend), real favicon/OG tags, footer credit per Abdul's answer.
- "Before launch" items (stock photos, missing logo) stay listed in admin so Abdul can see what a site still uses.

---
## 3. Shareable preview links
- **URL**: `https://<preview-host>/p/<id>` where `<id>` is 16+ random characters (unguessable). Later, a nicer `preview.designbybaxit.com` once we're sure isolation is right **[judgement]**.
- **Works on any device**: it's a normal web page. The app's "Open your website preview ↗" button opens this URL instead of the Blob/new-tab trick, which also fixes the `about:blank` address bar from the known-limitations list.
- **Versions**: each change request writes a new version to the same link (`?v=3` shows older ones in admin only).
- **Privacy/SEO**: `X-Robots-Tag: noindex, nofollow` header + meta tag; not linked from anywhere public.
- **Expiry**: KV expiry 14 days after the last update; expired link shows "This preview expired, request a new one" with a button back to the form (pre-filled from D1 if still stored). After "Apply now" the preview stays until published.
- **Abuse limits**: max 6 photos + logo, max size per upload, max 5 previews per email/IP per day, Turnstile on first submit.

---
## 4. Notifications
| Email | Sent when | From / reply-to | Contents |
|---|---|---|---|
| To Abdul: "New submission" | First preview built (optional, can be daily digest) | `noreply@send.designbybaxit.com` | Business, email, phone, country, industry, preview link, admin link |
| To Abdul: "Applied" | Apply now clicked | same | Everything above + chosen plan, domain wish, notes, all form fields, photo links |
| To client: "Your preview" | First preview | reply-to Abdul's address | Their preview link (so they can open it on their phone later) + expiry date |
| To client: "Your website is live" | Published | reply-to Abdul's address | Live URL, what's included, "for changes just reply to this email or write to …", how to cancel |
| To client business owner: "New enquiry from your website" | Visitor submits a live site's form | reply-to = the visitor | The visitor's message |
| To Abdul: "Payment failed / cancelled" | Provider webhook | same | Which site, auto-pause date |

- **Provider: Resend free** (3,000/month, 100/day, [pricing](https://resend.com/pricing)). Verify a sending subdomain of `designbybaxit.com` in Resend; it only adds DKIM/SPF-type DNS records for that subdomain, so Abdul's **Titan mailbox keeps working**. If 100/day ever bites, Brevo free gives 300/day ([Brevo](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan)) or Resend Pro is $20/month for 50,000.
- **Do not turn on Cloudflare Email Routing on `designbybaxit.com`**: it would take over the MX records that Titan uses today. (Email Routing is free and unlimited for inbound ([CF Email pricing](https://developers.cloudflare.com/email-service/platform/pricing/)), useful later only on a separate domain.)
- **Maintenance requests**: clients reply to the "live" email or write to Abdul's address directly, as he decided. Admin gets a one-click "Edit & re-publish" per site.
- Every email send/failure is written to `events`, and Abdul also sees all submissions in admin, so a failed email never loses a client.

---
## 5. Admin view (`/admin`)
- **Login**: password (stored as a hash in a Worker secret), session cookie, login rate-limit. Upgrade option: Cloudflare Access (Zero Trust free plan, 50 users) puts Google/one-time-code login in front of `/admin`, but its sign-up asks for a payment method too ([plans](https://www.cloudflare.com/plans/zero-trust-services/)).
- **List**: newest first; filter by status; columns: business, country, email, created, status, version, paid, live URL.
- **Detail**: all fields, photos, preview (desktop/mobile), change history, events, emails sent.
- **Actions**: Mark as paid (amount, currency, reference), Publish / Re-publish, Unpublish (pause), Edit fields & rebuild, Resend email, Delete (removes D1 row + KV keys, for privacy requests), Export CSV/JSON.
- The current `demo.html#admin` (localStorage) becomes this server-backed view; the UI can be reused.

---
## 6. Payment step (provider TBD, not Stripe)
- One small "adapter" per provider with three jobs: **create checkout** (returns a redirect URL for setup fee + monthly plan in the client's currency), **verify webhook** (signature check), **map events** (paid, renewal paid, payment failed, cancelled, refunded).
- Flow: Apply now → `/api/apply` saves and returns either the provider's checkout URL or (for now) a "Thanks, we'll send a payment link" page → provider redirects back to `/thanks/<id>` → provider webhook calls `/api/pay/webhook/<provider>` → status `paid` → auto-publish → "live" email.
- **Now**: no provider. Abdul sends a payment link however he likes, then presses **Mark as paid** in admin; publishing and the client email happen automatically from there.
- Recurring: renewal failed → email Abdul → auto-pause after a grace period Abdul picks (e.g. 7 days) → cancel → unpublish at period end. Self-serve cancel link = the provider's customer portal if it has one (research-v2: easy cancellation is the #1 competitor complaint).

---
## 7. What Abdul needs to provide / decide (in the order needed)
1. **Domain for client sites**: OK to use `<business>.designbybaxit.com`? And confirm that `designbybaxit.com` is in this Cloudflare account (or tell us which login has it). Alternatives: a new domain, or `pages.dev` (max ~95 clients).
2. **Cloudflare API token** (Dashboard → My Profile → API Tokens → Create custom token), scoped to this account and that one zone ([permission list](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)):
   - Account: *Workers Scripts: Edit*, *Workers KV Storage: Edit*, *D1: Edit*, *Account Settings: Read*, *Turnstile: Edit* (optional; can be made in the dashboard instead), *Cloudflare Pages: Edit* (only if we use pages.dev).
   - Zone `designbybaxit.com`: *Workers Routes: Edit*, *DNS: Edit*. Later for own-domain clients: *SSL and Certificates: Edit* (custom hostnames).
   - Abdul pastes it into a secure form; it's saved to his vault, not in chat or files.
3. **Email**: which address clients should reply to for changes (e.g. a Titan address on designbybaxit.com, or his Gmail), plus a **free Resend account** (sign-up with his Gmail; we then add the DNS records via the token).
4. **Brand name and currency on the order page** (still "SiteSpark"; note `sitespark.site` is **registered to someone else**, on GoDaddy nameservers, so it can't be used) and the **footer credit** decision. Both are open questions from the handover.
5. **Grace period** before an unpaid site is paused, and **preview expiry** (proposal: 7 days / 14 days).
6. **Later**: payment provider name (so we write its adapter), and whether to add a payment method to Cloudflare (unlocks R2, Cloudflare for SaaS custom domains, Zero Trust login; nothing is charged within free allowances, though a temporary ~$5 card check may appear ([community answer](https://community.cloudflare.com/t/question-regarding-5-usd-charge-for-r2-storage-activation/900480))).

---
## 8. Build phases (each ends with something Abdul can try)
| Phase | What gets built | What Abdul can test | Effort [judgement] |
|---|---|---|---|
| **0. Setup** | Worker project (Wrangler) deployed from the box to `workers.dev`; D1 database + KV namespace; secrets; CPU test of the builder inside a Worker; Turnstile widget. | A "hello" page on the Worker URL. | 0.5 day |
| **1. Save + notify** | Order app moved into the Worker; Apply now → `/api/apply` saves to D1/KV with Turnstile; email to Abdul; client "we got it" page. | Submit a test business on his phone → email arrives with all details. | 1 day |
| **2. Shareable preview** | Preview upload, `/p/<id>` page (noindex, expiry, versions), change requests update it, "your preview" email to client. | Build on laptop, open the emailed link on iPhone, send to a friend; request a change and see the same link update. Also covers the Safari/iOS test from the handover. | 1–1.5 days |
| **3. Admin** | Login, list, detail, export, delete, mark as paid. | Find the test submissions, mark one paid. | 1 day |
| **4. Live mode + publish** | Builder `live` mode (no samples, real forms), wildcard DNS + route, publish/unpublish, "your site is live" email, offline page. | Mark paid → site appears at `test-business.designbybaxit.com` within seconds; unpublish → offline page. | 1.5 days |
| **5. Live contact forms** | `/api/lead/<slug>` saves + emails the business owner; spam check. | Submit the form on the live test site → owner email arrives. | 0.5–1 day |
| **6. Payment adapter** | Checkout redirect + webhook for the chosen provider; auto-pause on failure. | Pay with the provider's test mode → auto-publish. | ~1 day once provider known |
| **7. Own domains** | Cloudflare for SaaS custom hostnames (if card added) or Pages fallback; "connect your domain" instructions page + status check. | Point a spare subdomain at it → HTTPS site on that domain. | 1 day |
| **8. Hardening** | Rate limits, backups (D1 export weekly to Abdul's email/Drive), error alerts, privacy page, monitoring of daily free-tier usage. | — | 0.5–1 day |

Total ≈ **8–9 working days** of build time, spread over Abdul's test rounds. Phases 1–4 (≈5 days) are enough to start the ad test with manual payment links.

Box notes: deploying uses Wrangler over HTTPS with the API token (the box blocks tunnels like `cloudflared`, but Wrangler deploys don't need one). Source lives in the GitHub repo `designbybaxit/website-on-demand` (new `backend/` folder); GitHub Pages stays as the public demo until the Worker version is live.

---
## 9. Risks and how we handle them
| Risk | Mitigation |
|---|---|
| **Builder code is visible** (the browser builds previews) | Accepted by Abdul for previews. Live rebuild happens server-side. If it ever matters, move preview building to the server too (phase 0 CPU test tells us if Free allows it). |
| **Someone uploads malicious HTML/phishing as a "preview"** | Previews only on an isolated host, noindex, expiring, strict Content-Security-Policy; live sites are only ever rebuilt from form data by our code, never from uploaded HTML; nothing goes live without "paid". |
| **Spam/bot submissions burning KV writes or email quota** | Turnstile on submit (free, [plans](https://developers.cloudflare.com/turnstile/plans/)); per-IP/email daily caps; size caps on photos; Abdul's "new submission" email can be switched to a daily digest to save the 100/day Resend quota. |
| **Free-tier ceilings** (KV 1,000 writes/day, 1 GB; Workers 100k req/day; Resend 100/day) | Daily usage check in admin; clear upgrade path: R2 (card), Workers Paid $5/mo, Resend Pro $20/mo. At research-v2's base case (~2 paying clients/country/month) we stay far inside Free for months [derived]. |
| **Free 10 ms CPU limit** on live rebuild | Tested in phase 0; fallbacks in §2.4. |
| **Unsplash hotlinking** (stock photos load from `images.unsplash.com`) | Allowed under the Unsplash License, but a photo can be removed by its author and break a live site. On publish, copy the stock photos the site uses into our KV/R2 and serve them ourselves [judgement], or at least check all photo URLs weekly. |
| **Sample (fake) reviews reaching a live site** | Live mode strips them in code, plus a test that fails if "Sample" tags appear in live HTML. |
| **Client data / privacy (UK, IE, CA clients)** | Short privacy notice on the form; unpaid submissions auto-deleted after e.g. 60 days; delete button in admin; D1 7-day restore as backup on Free. |
| **Brand reputation of designbybaxit.com** if a client site is reported | Unpublish button; reserved slugs; optional separate client-sites domain (§2.1). |
| **Wildcard catching existing subdomains** | Specific DNS records beat the wildcard; explicit "no Worker" routes for `www` and others; reserved-slug list. |
| **Account lock-in to one Cloudflare login** | Token is account-scoped and revocable; all code in GitHub; D1 exports. |
