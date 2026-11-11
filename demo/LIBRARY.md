# Template library: how designs are picked and how to add new ones

The site builder is no longer "one look per industry". Every site is put together from a **library**:

| Piece | What it decides | Where |
|---|---|---|
| **Style kit** | fonts, palette, corner radius, button shape, section spacing, motion personality | `src/lib/10-kits.js` |
| **Section variants** | the layout of one section (hero, services, why-us, stats, about, gallery, reviews, process, FAQ, CTA band, booking/contact, footer) | `src/lib/v-hero.js`, `src/lib/v-sections.js` |
| **Industry recipe** | which kits, hero layouts and section orders an industry may use | `src/lib/30-industries.js` |
| **Photo pool** | verified, free-licence photos for one industry (people-at-work heroes first) | `src/lib/20-photos.js` (+ the original Unsplash sets in `src/b1b-industries.js`) |
| **Selection** | seeded picking, photo allocation (no repeats), the client's real facts | `src/lib/40-select.js` |
| **Core** | registry functions, hash, image URL helper | `src/lib/00-core.js` |
| **Research sections & premium variants** | quick-action strip, before/after slider, insurance & payment, frosted-label service cards, staircase process, mixed-grid reviews, watermark footer, 5 more heroes | `src/lib/v-zpremium.js` (the `z` makes it sort after `v-sections.js`, whose helpers it uses at load time) |
| **Copy variants** | per-industry headlines, lead openers, section titles and why-us titles, picked by the same seed | `src/lib/50-copy.js` |

`src/lib/*.js` is concatenated (sorted by file name) right after `b6-sections.js` by **both** `demo/build.sh` and `backend/build.sh` (and `quality-audit/gen.js`), so a new file there is picked up automatically. Name new variant files `v-*.js` so they load after `40-select.js`.

## How a design is chosen (deterministic)

`siteModel()` calls `pickDesign()`:

1. The **profile** (real industry) is detected from the form as before (`detectProfile`).
2. The **recipe** is the industry entry whose `profiles` list contains that profile; anything else uses a family fallback (`FALLBACK_KITS` / `FALLBACK_HERO`, original section order).
3. A seed is made from `lower-cased business name | recipe id | opts.design`. Each decision (kit, hero, order, each section) hashes the seed with its own label (`hash32`), so the choices don't move together.
4. The same business always gets the same page (the admin rebuild at publish time gives exactly what the client approved). Two businesses in the same industry almost always differ in 6+ of the 14 design dimensions (the test checks every pair differs in at least 3).
5. **"Show me another design"**: `opts.design` (0, 1, 2…) is part of the seed. The change-request chip "Show me another design" (or any note containing "another/different/new design", "reshuffle") adds 1. It is kept by `cleanOpts()`, saved with the preview and used by the admin publish rebuild.
6. **Back and forth through designs**: the preview screen has "← Previous design · Design X of N · Show me another design / Next design →". It sets `opts.design` and rebuilds straight away (no pipeline animation); in server mode every switch is saved (`/api/save`, so `opts_json` holds it). `current.designMax` remembers how far the client went. Whatever design is on screen when they press Apply is the one saved: the Apply button re-saves when `current.savedVersion !== current.version`, and the publish rebuild uses that `opts_json`.
7. If the client forces a style in the change form (`opts.style`), the legacy kit + hero + order for that style is used.

## Add a section variant

Add one `registerVariant()` call (in `v-sections.js`, or a new `src/lib/v-<name>.js` file):

```js
registerVariant('services', 'tiles', {
  label: 'Short description for the admin / report',
  fits: ctx => ctx.fam !== 'food',          // optional: who may get it (ctx: d, prof, key, opts, fam, profK)
  needs: M => ({ split: 1 }),               // optional: photo slots it uses (see list below)
  css: M => `.site .tiles{...}`,            // its own CSS, only shipped when the variant is used
  html: M => `<section id="services" class="section">…</section>`,
});
```

Rules every variant must keep (the tests rely on them):

- Keep the section **id** (`#services`, `#menu`, `#why`, `#about`, `#gallery`, `#reviews`, `#process`, `#faq`, `#book`) so the nav, deep links and tests work.
- Use `.reveal` on blocks that should animate in. Nothing may be hidden without JS (`.site.js` gates all "before" states) and `prefers-reduced-motion` must leave everything visible and still.
- Booking/contact: build on `bookParts(M)` so `#book form [type=submit]` stays a single visible step and the live lead posting keeps working.
- Reviews: show `SAMPLE_REVIEW` tags on sample reviews. Live mode removes sample reviews and stats on its own, and the Worker refuses HTML that still has `class="sample-tag"`.
- Show prices exactly as `s.priceT` (never re-format).
- Images: use only the URLs in `M.ph` (set by `allocPhotos`). Never hard-code a photo. If a slot is empty (small pool), render the block without the image.
- Mobile: the hero's `.btn-primary` must be in the first 844px on a 390px-wide phone, with no horizontal scroll.

A new variant becomes eligible straight away for every industry whose recipe has no `variants` whitelist for that section. To limit it, add `variants: { services: ['cards', 'tiles'] }` to a recipe.

Photo slots for `needs()`: `heroExtra` (count), `circle`, `split`, `about`, `about2`, `contact`, `cta`, `gallery` (max count, min 3 or the gallery is hidden), `steps` (3 if available).

## Add a hero

Same as above with `registerVariant('hero', id, …)`. Start from `heroParts(M)`, which returns the shared pieces (`eyebrow`, `h1` with word spans, `lead`, `actions`, `proof`, `heroImg()`, `chipData`). `heroSide(M, parts)` returns the trades quote card when `M.heroQuote` is set, otherwise a stack of real-fact chips. Then add the id to the `hero` list of the recipes that should get it.

## Add a style kit

```js
registerKit('desert-rose', {
  label: 'Desert rose (Fraunces + Inter, sand + rose)',
  gf: 'family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Inter:wght@400..700',
  display: 'Fraunces, Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.02em', em: 'italic',   // em: 'italic' | 'mark' | 'color'
  radius: 20, motion: 'rise', density: 'airy',                          // motion: soft|rise|slide|curtain; density: compact|regular|airy
  btnFrom: 'brand', btnRadius: '999px',                                 // optional: onBtn: '#111' forces button text colour
  pal: { bg: '#faf5f0', surface: '#ffffff', text: '#2b1d1a', muted: '#6b5a55', brand: '#2b1d1a', accent: '#e39b8f', soft: '#f8e3de', accentText: '#b4554a', warm: '#f2d3b3', line: '#ecdfd8' },
  // dark: true for a dark kit (bg/surface dark, text light)
});
```

Then add its id to the `kits` list of a recipe. Check the Google Fonts query loads (`curl "https://fonts.googleapis.com/css2?<gf>&display=swap"` should return CSS). Keep text/background contrast at 4.5:1 or better.

## Add an industry (or re-shape one when Abdul's reference templates arrive)

```js
registerIndustry('dental', {
  profiles: ['dental'],                       // PROFILES keys from b1b-industries.js
  kits: ['mint-clinic', 'ocean', 'coral', 'sage'],
  hero: ['split', 'fullbleed', 'mosaic', 'editorial', 'panel'],
  orders: [['hero', 'stats', 'services', 'why', 'process', 'reviews', 'gallery', 'book', 'faq'], …],
  variants: { reviews: ['wall'] },            // optional whitelist per section
});
```

Orders are gated afterwards by the real business: `calc` only for property, `menu` <-> `services` by family, `about` is always added, and empty sections (no reviews in live mode, gallery with fewer than 3 photos, etc.) are dropped.

For a new reference template: list which hero and section layouts it uses, add any missing ones as variants, add a kit with its fonts/colours, and add both to the industry's lists. Old clients keep their design as long as the lists aren't re-ordered. **Append new kits/heroes/orders at the end of a list**, because the seeded pick is `hash % list.length` and changing a list's length reshuffles unpublished previews. (Published sites are static HTML and never change.)

## Add photos

1. Find candidates on Pexels (free for commercial use, no attribution required). Search-engine results for `pexels.com/photo/<slug>-<id>` work. Pexels' own search pages block bots, and Unsplash search is behind a bot challenge.
2. Put `group id description` lines in `library/photo-check/cand.txt`, then run `fetch.py` (checks HTTP 200 + image/jpeg from the CDN) and `sheet.py` (contact sheets).
3. **Look at every photo.** Reject anything with readable company logos or branding, unsafe work, the wrong trade, heavy text, or watermarks.
4. Add `['px:<id>', 'tags matched against service words']` to the pool and, for people-at-work shots, to `heroes`.

Never type a photo id that hasn't been fetched and viewed. `allocPhotos()` never repeats a photo on a page: hero, then the photos each service card matches by tag, then split/about/contact/CTA, then gallery and step photos with whatever is left. Uploaded photos always come first.

## The client's real facts

`extractFacts()` reads only what the client typed (about text, service names and descriptions, hours) and turns it into hero proof ticks, chips, why-us points and (with two or more statable facts) real stats. It covers:

- registrations (Gas Safe, NICEIC, GDC, CQC, …), insured, licensed, DBS checked
- years of experience / "since 2008"
- family-run or independent (only when said about the business itself)
- free quotes/consultations, 24/7 or same-day, emergency appointments
- "nervous patients welcome", languages spoken, fixed/upfront costs, no call-out charge (with the client's own qualifier)
- guarantees, eco products, payment plans, NHS & private, a named lead dentist
- opening facts: Saturdays / weekends / 7 days / late opening, taken literally from the hours

It never invents a number. "Clear prices" is only claimed when at least 60% of services show a price, and never for food menus.

## Dental research build (references/dental/SYNTHESIS.md)

Sections that only appear with the client's own data (`hasSection()` in `b6-sections.js`; `siteModel()` also drops them from the order, and adds them back when the client gave the data but the recipe left them out):

| Section | Variants | Shown when | Notes |
|---|---|---|---|
| `infobar` (quick-action strip under the hero) | `tiles`, `float` | at least 2 of: call, today's hours, book | Emergency line only if `offersEmergency()` finds emergency/toothache/urgent/24-7 in the client's about, hours or services. "Today" is filled in the browser from `weekHours()` (`data-today`). Used by dental and trade recipes. `float` becomes `tiles` under the `field` hero. |
| `beforeafter` | `band`, `side` | the client uploaded at least one complete pair (`d.ba = [{b, a, t}]`, up to 4) | Range-input slider (keyboard and touch work), pair picker, "results vary" note. Never filled from stock. Allowed for dental, beauty, trade, auto, pets, health, wellness and creative. |
| `insurance` | `cards`, `split` | `insuranceFacts(d).any`: NHS / private, 0% or interest-free finance, payment plans, membership plans, direct billing, or named insurers from the optional "Insurance, NHS & payment plans" field or the about text | Insurer names are text chips exactly as typed, never logos. Always ends with the "Ask about coverage" bar. |

Order form: "Before & after photos" (before + after + label, up to 4 pairs; shown for clinic, salon, home services and other) and "Insurance, NHS & payment plans" (clinic, salon, other). In server mode the pair photos upload through `/api/img` like other photos (KV `img:<id>:<k>`), and the data keeps `/i/<id>/<k>` URLs, so previews and published sites both show them.

Style-kit traits: `shape: 'arch' | 'circle' | 'blob' | 'rounded'` (`shapeCSS()` styles hero, split, about and before/after frames; blob morph is off for reduced motion) and `badge: true` (rotating text badge with the business name and place only, never a claim). `em: 'under'` marks the accent word with a highlight underline (used by the one all-sans kit, `dent-clinical-sans`; every other dental kit keeps a serif headline with an italic accent).

New dental kits: `dent-forest-mint`, `dent-ice-arch`, `dent-navy-violet`, `dent-kids-pastel`, `dent-plum-coral`, `dent-bento-blue`, `dent-clinical-sans` (all text/button pairs ≥ 4.5:1).

New heroes: `bento` (text tile + photo tile with glass chips), `framed` (photo in a framed panel with fact chips), `blob` (blob photo; a number badge only from a real stat, else the rotating badge), `booking` (two-step booking card in the hero; dental, health, beauty, wellness, pets, fitness), `field` (colour field, arch photo and an overlapping service panel).

Premium variants: `services:feature` (big photo cards with frosted labels), `process:stairs`, `reviews:bento` (needs a photo), `footer:watermark` (faint big logo word).

Photos: a pool entry may carry `{only: true}` (an implant model, a toothache): it is used only when a service's words match its tags, never as filler. Preferred "place" photos (about/split) rotate among similar interior/team shots so businesses don't share one.

Copy variants (`copyX()` in `50-copy.js`): each industry has several headline lists, lines with `{place}`, and lines gated on facts (nervous patients, emergencies, families, Gas Safe, 24/7, …), plus lead openers and section-title packs. They are picked with the design seed, so 20 dental businesses share a headline in under 12% of pairs (test). No line states a fact the client didn't give.

## Tests

- `demo/test/test_demo.py`, section **template library**: determinism; 5 dental and 5 plumber names that differ pairwise in ≥3 design dimensions; no repeated photo on any page; reshuffle changes the design; no sample tags in live mode; ≥3 kits per priority industry; variant registry counts.
- section **dental research sections**: insurance / before-after hidden without client data; plan names as text with no logos; slider only shows client pairs; no slider for half a pair or for restaurants; hosted photos survive live mode; emergency line only when offered; weekHours; headline share across 20 dental and 20 plumbing names.
- section **before/after upload + design back/forward**: the upload field (hidden for restaurants), adding a pair, the slider in the preview frame, "Design 1 of 1 → 2 of 2 → 3 of 3 → back to 2 of 3", the approved thumbnail and the saved request keep the design that was on screen.
- `backend/test/test_e2e.py`: the same in server mode, plus `/i/` URLs in `data_json` and `opts_json.design` after stepping back.
- `demo/test/lib_harness.js` loads the builder into Node for quick experiments (`require('./test/lib_harness.js').buildSite(...)`).
- `library/gen_sweep.js` + `library/sweep.py` build each example with designs 0–5 (plus a café, a cleaner, an electrician and a barber) and check desktop and mobile for script errors, horizontal scroll, the hero CTA above the fold and ≥10 images.
