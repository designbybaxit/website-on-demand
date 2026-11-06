# Salon / Beauty references: synthesis (12 Envato demos from Abdul’s Drive)

Captured **7 Nov 2026 (PKT)**. Drive folder **Hair Salon and Beauty** holds only the links doc (no screenshots). All 12 public demos returned usable page text via WebFetch. Partial visual evidence only: brand logos + La Diva hero crop + one Barbershop Pro lifestyle photo (saved under `assets/`). **Full page layouts, colour fields, galleries and motion still need browser capture before library build.**

Ground rules (same as dental): ideas only; rebuild in our code; Pexels/own photo pool; real prices/durations exactly as typed; sample reviews in previews only; before/after only with client photos; no fake skill % / awards / branch counts.

Our builder already has `beauty` industry with profiles `salon` / `barber` / `spa`, kits `plum`/`lilac`, photo pools, and `menu:tabs` with live basket. This pass is about **variation opportunities and gaps**, not starting from zero.

---

## Sub-types in this pack (seed profiles)

| Profile | Refs | Mood |
|---|---|---|
| **Salon** (hair + mixed beauty) | 1, 2, 3, 9, 11 | Soft luxury, rose/cream/olive, serif accents |
| **Barber** (men’s grooming) | 4, 5, 6, 7 | Dark + gold/cream, craftsmanship close-ups |
| **Spa / wellness** | 8, 10 | Calm, treatment-led, soft neutrals |
| **Makeup artist** (solo brand) | 12 | Editorial portfolio, press logos, Instagram |

Seed business name + industry should pick profile, then kit + section mix so two salons don’t twin.

---


## Desktop visual qualifications (parent browser check, 7 Nov 2026 PKT)

Desktop only. No mobile. No videos, booking UIs, or carousel controls activated.

| Ref | Desktop visual note |
|---|---|
| La Diva (9) | Editorial dusty rose / cream / sage; split-photo hero; prices visible |
| Kinanthi (11) | Cream + olive; gallery present |
| Cavanio (6) | Charcoal + gold; duration–price service rows; hero looked dark/empty on desktop |
| Hector (7) | Dark gold; readable light price panel |
| Kila (2) | Blush / coral; large photo services; no itemized pricing on the page checked |
| Scissoria (1) | Cream + green + mustard; photo cards; grouped price lists |

Still unverified: mobile layouts, motion/marquees, booking chrome, full remaining 6 demos (3 Melier, 4 Barberix, 5 Barbershop Pro, 8 Nala, 10 La Diva home-3, 12 Maquille).

## Evidence map

| Kind | What we have |
|---|---|
| **Source / text** | Section order, service names, price/duration lines, FAQ topics, hours, multi-branch, CTAs for all 12 |
| **Partial visual** | Logos (Scissoria gold/black; Kila dusty rose; Hector skull/gold; Cavanio cream multilines; Kinanthi olive italic; Maquille Didot+sparkle; Nala prismatic serif); La Diva split hero crop (blonde hair + manicure/rose); Barbershop Pro desaturated craftsmanship close-up |
| **Not verified visually** | Full desktop/mobile scrolls, true palette fields, masonry/gallery density, hover/magnetic CTAs, marquees in motion, booking UI chrome |

---

## 1. Hero patterns (salon-specific)

| ID | Pattern | Seen in (text) | Visual note |
|---|---|---|---|
| SH1 | **Split dual-service hero** — two stacked lifestyle photos (e.g. hair result + nails) with centred serif H1 + circular services CTA | 9 La Diva | **Verified** on hero crop: dusty rose / grey split, ghost BOOK A VISIT, script accent word |
| SH2 | **Full-bleed craftsmanship close-up** — scissors/comb in action, desaturated lifestyle | 5 | **Verified** photo style; page chrome not seen |
| SH3 | **Style carousel / numbered looks** — “01 Style / Barber” slides | 6 Cavanio | text only |
| SH4 | **Tagline marquee** under hero (“Make every day a prodigy hair day”) | 2 Kila | text only — good Motion candidate |
| SH5 | **Info strip under hero** — phone / hours / contact chips | 1, 7 | mirrors dental B3 |
| SH6 | **Editorial serif + soft proof** for beauty; **bold sans + dark field** for barber | 9/11 vs 4/6/7 | logos support the split |

Mobile expectation (from dental + build-standard): text first, primary Book/WhatsApp on first screen.

---

## 2. Services & pricing (core for this industry)

| ID | Pattern | Refs | Library note |
|---|---|---|---|
| SS1 | Icon/card service grid (colour, cut, care, styling, arrangement…) | 1, 2, 3, 4 | existing `services:cards` |
| SS2 | **Tabbed / list menu with duration + price** (“50 Minute / $80”) | 6, build-standard salon recipe | already `menu:tabs` + basket — keep as salon signature |
| SS3 | **“From $” price board** in columns | 3, 7 | only when client typed prices |
| SS4 | Spa treatment cards (stone massage, waxing, skin, face) | 8 | spa profile |
| SS5 | Package / glow-up / membership band | 9, 10 | only if client sells packages |
| SS6 | Product retail strip (shampoo, serum) | 6, 10 | **optional**; omit unless client sells retail |

---

## 3. Gallery / portfolio (high priority vs dental)

Salon sites lean harder on **work galleries** than dental clinics.

| ID | Pattern | Refs |
|---|---|---|
| SG1 | Masonry / grid of finished looks | 3, 6, 11, 12 |
| SG2 | Named look + stylist credit (“Hair coloring by Amanda”) | 9 |
| SG3 | Instagram strip `@handle` | 12 (and Kinanthi handle in footer) |
| SG4 | Before/after | only with **client-owned** photos; disclaimer already in `v-zpremium` for beauty |

Photo pool gaps to fill later (Pexels tags): result close-ups (blowout, balayage, fade, nails, lashes), chair/mirror interiors, calm spa rooms, stylist-at-work (hands/tools). Avoid theme demo faces.

---

## 4. Team / about / trust

| ID | Pattern | Refs | Avoid |
|---|---|---|---|
| SA1 | Stylist cards (photo, name, role: Senior Colourist…) | 3, 7, 9, 11 | |
| SA2 | “Why us” 3–4 pillars (experience, certified, comfort) | 1, 3, 11 | invented certifications |
| SA3 | Stat row (clients, years, stylists, rating) | 1, 2, 6, 7 | **real numbers only** |
| SA4 | Skill % bars | 3 Melier | **Avoid** — breaks real-numbers rule |
| SA5 | Multi-branch address cards | 3, 6 | only if client has multiple locations |
| SA6 | Press / “As featured in” logo strip | 9, 12 | only real logos client lists |
| SA7 | About philosophy / female-led story block | 11 | rewrite client About; no invented story |

---

## 5. Booking / CTA / FAQ / extras

| ID | Pattern | Refs |
|---|---|---|
| SB1 | Book appointment CTA band + phone | almost all |
| SB2 | Opening hours card / list | 1, 3, 4, 6, 7, 11 |
| SB3 | FAQ accordion (booking advance, duration, choose stylist, payment, gender services) | 4 Barberix |
| SB4 | Gift card / membership CTA | 10 |
| SB5 | Blog / trends | 12 | skip on one-pagers unless asked |

Primary CTA for our product remains WhatsApp / book per build-standard; floating WhatsApp must clear hero CTAs on 390px.

---

## 6. Style kits to extract (3 directions)

Aligned with UI UX Pro Max beauty suggestion (soft pink `#EC4899` / lavender / Playfair+Inter) **plus** barber dark kits and existing `plum`/`lilac`:

| Kit direction | Palette cue | Type cue | Refs |
|---|---|---|---|
| **Soft editorial beauty** | Rose / cream / dusty mauve (La Diva skins list many warm neutrals) | Bodoni/Playfair + Outfit/Inter; script accent word | 9, 10, 11 |
| **Dark gold barber** | Black + gold/orange or cream multilines | Bold display or geometric retro + sans | 1, 5, 6, 7 |
| **Calm spa** | Sage / warm stone / soft white | Elegant serif, low contrast | 8, 10 |

Existing kits `plum` / `lilac` cover soft beauty; barber may need a stronger dark+gold kit if current navy/plum isn’t masculine enough — flag for build phase.

---

## 7. Interactions worth pulling later (with Motion / 21st)

From text patterns + UIUX gsap guidance (not visually confirmed on demos):

- Hero tagline **marquee** (Kila)
- Style / look **carousel** with pause on hover/focus + reduced-motion stop (Cavanio)
- Gallery lightbox / masonry reveal
- Service menu **live basket total** (already in builder — keep)
- Magnetic / circular “Our services” button (La Diva crop)
- Word/line reveal on serif headlines (beauty kits)
- Count-up stats only for client-supplied numbers

---

## 8. What to avoid (salon-specific)

- Fake “skill %” meters (Melier)
- Fake review names on live sites; preview samples OK
- Stock before/after sold as client results
- Retail / gift-card / membership / blog sections when client didn’t ask
- Multi-branch blocks for single-location shops
- Neon / harsh motion (UIUX: avoid for beauty soft UI)
- Copying Envato demo photos or theme code (licence)

---

## 9. Source-specific one-liners

1. **Scissoria** — classic hair salon stack: who-we-are, stats, 6 services, price-ish styling, why-us checklist, appointment CTA, testimonials; gold-on-black brand cue.
2. **KilaSalon** — modern short page + **marquee** + stats + single big review + click-away CTA.
3. **Melier** — branches + skill bars (**drop bars**) + price list + gallery + hours.
4. **Barberix** — grooming services + reviews + strong **FAQ** + hours/contact.
5. **Barbershop Pro** — service grid + team + atmosphere gallery; lifestyle craftsmanship photo direction.
6. **Cavanio** — numbered style showcase + duration/price services + product strip + multi-location + team + reviews.
7. **Hector** — popular haircuts gallery + priced cut types + barbers + aggregate rating line.
8. **Nala** — spa treatments + health benefits list + hours + testimonials (spa profile).
9. **La Diva main** — split dual-service hero, packages, artists, named work credits, press, soft skins library (palette goldmine when browser-captured).
10. **La Diva home-3** — spa pillars, visual journey, product gift CTA, skincare retail.
11. **Kinanthi** — philosophy pillars, signature services, team, work gallery, soft booking form CTA.
12. **Maquille** — personal MUA brand: press, portfolio collections, priced makeup packages, blog, Instagram — use sparingly for solo artists.

---

## 10. Browser follow-up needed (parent / desktop)

Capture for each of the 12 (or at least 1, 2, 6, 7, 9, 11 as priority set):

- `desktop-full.png` 1440w and `mobile-full.png` 390w
- hero crops
- colour/font extract if possible

Priority first: **9 La Diva**, **11 Kinanthi**, **6 Cavanio**, **7 Hector**, **2 Kila** (marquee), **1 Scissoria**.

---

## 11. Build-phase checklist (do not start in this review)

- [ ] Confirm/extend style kits: soft beauty, dark barber, calm spa
- [ ] Gallery variants + Instagram strip optional
- [ ] Keep tabbed menu + basket as salon signature; price board variant for barbers
- [ ] FAQ variant with salon-flavoured defaults (wording only; answers from client)
- [ ] Expand photo pools per profile
- [ ] Wire Motion: marquee, look carousel, reduced-motion
- [ ] Map 21st.dev prompts into these section slots when Abdul sends them
