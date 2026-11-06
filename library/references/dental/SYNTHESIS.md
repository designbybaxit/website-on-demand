# Dental references: synthesis (11 Envato templates picked by Abdul)

Captured 2 Nov 2026 (PKT) with headless Chrome. All 11 links loaded. One of them, 11-dentalkit, sits behind a SiteGround bot check that clears on its own after one automatic reload.
Each folder has `desktop-full.png` (1440 wide), `mobile-full.png` (390 wide @2x), `hero-desktop.png`, `hero-mobile.png`, `extract.json` (computed colours, fonts, buttons, widgets per section) and `breakdown.md` (section-by-section notes).
Hero overview: `contact-sheet.jpg`.

| # | Folder | One-line character |
|---|---|---|
| 1 | 01-smilecare | Teal colour field, giant heavy headline, arch cut-out, violet square buttons |
| 2 | 02-templateup-dental | Indigo + candy pink, playful rounded font, pricing plans, floating hours card |
| 3 | 03-timan | Classic plum/coral theme, photo slider hero + 3-tile info bar, ghost words |
| 4 | 04-denty | Bento hero with glass stat chips, pastel gradient cards, modern SaaS feel |
| 5 | 05-dentara | **Strongest**: cream + forest + neon mint, swash accent word, photo cards, before/after, insurance |
| 6 | 06-happy-smiles | Kids/family: organic mint blob, serif display, rotating badge, pastel trio |
| 7 | 07-dentique | Framed cyan hero card, yellow scribble underline, cut-out + floating stat cards |
| 8 | 08-usmile | Calm ice blue + black, arch shapes everywhere, arc-scattered reviews |
| 9 | 09-dentacare | Blue/green gradient, emergency + hours + quick-book strip under hero |
| 10 | 10-shinental | Olive green, arch cut-out, overlapping feature pill bar, Google rating badge |
| 11 | 11-dentalkit | Booking form inside hero, team cut-out between counters, green bands |

Ground rules when turning these into our variants:
- **Ideas only.** These notes describe layouts in my own words. No theme code, text or demo images go into the library. The demo photos are third-party stock and Abdul's Envato licence doesn't cover them, so we use our own Pexels pool.
- **Build-standard rules still win.** Real numbers only (stat chips, counters and rating chips show only facts the client typed). Sample reviews appear in previews only. Before/after sliders use **only the client's own photos**: a stock "result" would be a fake claim. Insurance and plan logos appear only when the client lists them.
- Variant names in brackets, like `hero:split`, point to what already exists in `demo/src/lib` (from `LIBRARY.md`). "NEW" means I couldn't find an equivalent by name. Check the code before building, because I only matched on names.

---

## 1. Hero patterns (8)

| ID | Pattern | How it's built | Used by | Nearest existing |
|---|---|---|---|---|
| H1 | **Colour field + arch cut-out** | Flat brand-colour (or soft grey) background, text left, a clinician cut-out standing inside a tall arch/capsule shape on the right, sometimes a plant or equipment for depth. A services/feature panel overlaps the bottom edge. | 01, 10 (02 uses a circle instead of an arch, 09 places a cut-out on a gradient photo) | `hero:arch`? |
| H2 | **Bento hero** | Two rounded tiles: a solid/gradient text tile (trust pill, H1, two buttons) and a large photo tile carrying 2–3 dark-glass stat chips stacked bottom-right. | 04 | NEW |
| H3 | **Airy split + rating chip** | Cream background, big rounded photo left with a floating white chip (avatar stack + rating), right-aligned text with one swash-underlined word and a faint brand watermark behind. | 05 | `hero:split` (add rating chip + watermark) |
| H4 | **Framed hero card** | Header and hero sit together inside one big rounded gradient card with page margin around it. Text left with a scribble-underlined accent and a video button. A centre cut-out stands in front of a glow circle, with 3 stacked stat cards on the right. | 07 | `hero:panel`? |
| H5 | **Full-bleed photo/slider + attached info bar** | Dark-overlay photo (or slider), centred headline and two buttons. Directly underneath, a 3-tile bar in brand colours: call us / opening hours / book. | 03 | `hero:fullbleed` / `hero:cinema` + NEW info bar |
| H6 | **Full-bleed + booking form** | Gradient-tinted photo, text left, white booking card right (name, phone, email, doctor, date, time), with small action cards under the text. A variant puts emergency / hours / quick-form panels in an overlapping strip. | 11, 09 | `hero:form` |
| H7 | **Organic blob over full-bleed photo** | Full-bleed portrait (child laughing) with a huge soft blob shape holding the text. A white circle badge with one big number overlaps the blob edge. | 06 | NEW |
| H8 | **Arch photo split + review count** | Light-tinted left half with text, a large review number and stars. On the right, a tall photo with a fully rounded bottom (arch) and a centred play button. | 08 (02 is similar, with a circle backdrop) | `hero:arch`? |

Things every hero shares on mobile: the text stacks above the image, the main button sits in the first screen, and stat chips drop below the photo.

## 2. Services patterns (8)

| ID | Pattern | Used by | Nearest existing |
|---|---|---|---|
| S1 | **Icon tile panel overlapping the hero** (4x2 icons with hairline dividers, one photo tile) | 01, 02 (pink intro tile + 3 cards), 10 (single feature pill bar) | NEW |
| S2 | **Icon card grid** 3x2 / 3x3, each with its own button | 03, 09, 11, 08 (4 columns on a tinted band) | `services:cards` |
| S3 | **Gradient-head cards** (top half brand gradient + white line icon, bottom text + underlined link) | 05 | `services:cards` restyle |
| S4 | **2x2 large pastel gradient cards**, each tinted differently | 04 | `services:bento`? |
| S5 | **Photo-topped cards with an icon tab** overlapping the photo edge | 07, 10 | NEW (or a cards option) |
| S6 | **Featured treatment photo cards** (2x2 close-up photos, frosted label card at the bottom, big outline icon watermark, last tile is a CTA card) | 05 | NEW |
| S7 | **Alternating promo tiles** (coloured text panel + photo, side by side) | 02 | `services:rows`? |
| S8 | **Pricing / membership plans** (3 cards, raised highlighted middle, "most popular" badge) | 02, 03, 11 | NEW, but use only when the client gives plan prices, shown exactly as typed |

## 3. About / why-us / team patterns (9)

| ID | Pattern | Used by |
|---|---|---|
| A1 | Split photo + 2x2 checklist chips + button, photo in an offset colour frame | 05 |
| A2 | Split with **numbered list** (01/02/03 with hairlines) + tall dentist portrait | 04 |
| A3 | Split with progress bars ("skills") + photo with floating cards | 02, 07, 09, 10. **Avoid:** made-up percentages break the real-numbers rule |
| A4 | **Photo mosaic** (3-col collage) with a floating years badge | 01 |
| A5 | Lead dentist feature: staggered photos or a cut-out, name eyebrow, signature | 01, 09 |
| A6 | Vision / mission / motto card stack overlapping a photo | 10, 07 |
| A7 | Circle-cropped photo + rotating text badge stamp | 06, 08 (circle + blob) |
| T1 | Team cards with a coloured frame or panel (amber), gradient-background portraits (green), **arch-top** portraits (cyan), or a circle avatar with a verified tick + rating | 04, 05, 08, 01 |
| T2 | Group cut-out of clinicians between two big counters | 11 |

## 4. Trust / proof patterns (11)

| ID | Pattern | Used by |
|---|---|---|
| P1 | Stat row (4 numbers, thin left rule or icon) | 05, 06, 08, 03, 09, 11 |
| P2 | Glass / white **stat chips on the hero photo** | 04, 07 |
| P3 | **Rating chip with avatar stack** ("4.9 from N patients") | 05, 07, 04 (pill), 06 |
| P4 | Google rating badge beside reviews | 01, 10 |
| P5 | **Insurance / payment section** (features + accepted-plans logo strip + "questions about coverage?" bar) | 05, 06 (logo strip only) |
| P6 | Partner logo strip | 10, 11 |
| P7 | Review carousel | 01, 09 |
| P8 | Pastel-tinted review cards (each a different tint) | 04 |
| P9 | **Bento reviews** (mixed dark/brand/light cards + a photo tile with play button) | 05 |
| P10 | Reviews scattered around a curved arc | 08 |
| P11 | Single big quote next to a cut-out | 11, 03 (speech bubble beside counters) |

## 5. Process patterns (3)

| ID | Pattern | Used by |
|---|---|---|
| R1 | **Staircase timeline**: steps rise left to right, with pill step tags and thin vertical rules | 05 |
| R2 | 4 step cards in a row, big faint numbers, the active card lifts | 07 |
| R3 | Vertical icon-row list beside a text block | 11 |

(Our standard says 3 steps. R1 and R2 both work with 3.)

## 6. Gallery / before-after patterns (4)

| ID | Pattern | Used by |
|---|---|---|
| G1 | **Drag-to-compare before/after slider**, full width on a brand-colour band | 05, 08 |
| G2 | Before/after beside a text + quote card | 06 |
| G3 | Masonry photo showcase with a ghost word behind the title | 03 |
| G4 | 3-column photo collage with a badge | 01 |

## 7. Booking / contact patterns (8)

| ID | Pattern | Used by |
|---|---|---|
| B1 | Booking form inside the hero | 11 |
| B2 | Overlapping 3-panel strip: emergency phone / hours / quick form | 09 |
| B3 | 3-tile info bar under the hero: call / hours / book | 03 |
| B4 | Form card with a coloured header beside welcome text + photo | 03 |
| B5 | Split photo + full appointment form (service, doctor, date, time) | 06, 07 (cut-out on gradient band) |
| B6 | Form card + photo + brand-colour contact info card (address, email, phone with circle icons) | 04, 08 |
| B7 | **Floating opening-hours card** on a photo (days and times joined by dotted leaders) | 02, 07 |
| B8 | Contact-channel icon row (WhatsApp, Messenger, phone, Instagram) in a CTA band | 01 |

## 8. FAQ patterns (4)

| ID | Pattern | Used by |
|---|---|---|
| F1 | Full-width accordion with solid brand-colour bars | 04 |
| F2 | Centred narrow accordion, soft grey rows, + icons | 05 |
| F3 | Split: accordion (active item is a filled pill) + arch photo | 08 |
| F4 | Plain full-width accordion with ? icons | 09 |

## 9. CTA patterns (7)

| ID | Pattern | Used by |
|---|---|---|
| C1 | Full-bleed close-up photo + dark glass card bottom-left | 04 |
| C2 | Split: photo card with contact overlay + brand-gradient card | 05 |
| C3 | Cut-out clinician on a colour band | 09, 02 (with quote boxes) |
| C4 | Dark/blurred photo banner, centred headline | 05, 10, 02 |
| C5 | Emergency banner (gradient over a face, 24h icon, phone) | 03, 09 |
| C6 | Video card CTA with play button | 10, 06 (scooped-corner frame) |
| C7 | Announcement/offer bar above the header | 10 |

## 10. Footer patterns (6)

| ID | Pattern | Used by |
|---|---|---|
| FT1 | Dark 4-column (logo + socials, links, contact) | 01, 09, 11 |
| FT2 | Big CTA headline footer | 04 (we have `footer:bigcta`) |
| FT3 | Light footer with a huge faint **logo-mark watermark** + newsletter arrow input | 05 |
| FT4 | Newsletter card or headline row on top | 02, 06, 07 |
| FT5 | Tinted light footer (ice blue / pale green) | 08, 10 |
| FT6 | Footer with a photo-thumbnail grid | 03 |

**Pattern count: 8 hero, 8 services, 9 about/why/team, 11 trust/proof, 3 process, 4 gallery/before-after, 8 booking/contact, 4 FAQ, 7 CTA, 6 footer: 68 in total.**

---

## 11. Typography and colour findings

- Fonts across the 11: DM Sans (2), Poppins (4), Inter (2), Inclusive Sans, Inter Tight, Red Hat Display, Yusei Magic, Roboto Flex, Rubik, Heebo, Plus Jakarta Sans, Marcellus (the only serif), Nunito, Onest, Golos Text.
- **10 of 11 use an all-sans look.** Our build standard asks for a serif display font plus one serif-italic accent word. Dentara's mint swash underline does the same job in a sans style. Suggestion: keep a serif in most dental kits, but allow one sans "clinical" kit that uses `em: 'mark'` (swash/highlight) as its accent. Abdul should confirm.
- Colour families: green/mint (05, 04, 10, 11, 09 partly), cyan/ice blue (07, 08), navy + violet/teal (01), indigo/plum + pink/coral (02, 03), pastel kids (06).
- Buttons: 7 of 11 use full pills, 3 use square or small radius (01, 03, 11), and 07 uses 8px.

## 12. Proposed dental style kits (6)

All fonts are on Google Fonts (each query was checked and returned 200). Text-on-colour pairs were checked for 4.5:1 contrast or better unless noted. The kit ids are new and don't clash with the existing ones.

| Kit id | Inspired by | Palette | Fonts (display + body) | Radius / buttons | Accent word | Motion |
|---|---|---|---|---|---|---|
| `dent-forest-mint` | 05 | bg `#F6F9F1`, surface `#FFFFFF`, text `#0E2A20`, muted `#5F6664`, brand `#1A6951` (white text 6.6:1), accent `#3CE7B3` (dark text 9.7:1), soft `#E3F3EA`, line `#DDE6DA` | Fraunces + Inter Tight | cards 24px, pill buttons | `mark`: mint swash under one word | rise; counters; swash draws in on reveal |
| `dent-ice-arch` | 08, 07 | bg `#F3FAFF`, surface `#FFFFFF`, text `#0B2530`, muted `#4F6470`, brand `#0B7F99` (white 4.7:1), accent `#00CAE0` (use dark text on it, 8:1), soft `#DBEEFA`, pop `#FFD100` (optional highlight) | DM Serif Display + DM Sans | arch crops (full-round tops/bottoms), pill buttons | italic | soft; arch images reveal with a mask wipe |
| `dent-navy-violet` | 01 | bg `#FFFFFF`, alt `#E9EFF8`, text `#030541` (16:1 on alt), muted `#5A5A5A`, brand `#482AFD` (white 6.9:1), accent `#39C3B9`, soft `#C6FFF1` | Playfair Display (800) + Red Hat Text | 4px buttons, 12px cards, square-ish | italic | slide; overlapping panel rises over the hero |
| `dent-kids-pastel` | 06 | bg `#F3FFFB`, alt `#E6FAF3`, text `#2C3E50`, muted `#546E7A` (5.3:1), brand `#80EDC4` (slate text 7.8:1), accent `#FFE18B` (slate text 8.6:1), tertiary `#DADEFF` | Marcellus + Nunito | organic blobs, circle crops, 20px cards, small rounded buttons | colour | rise + gentle pop; rotating badge stamp (off for reduced motion) |
| `dent-plum-coral` | 03, 02 | bg `#FBF8FC`, surface `#FFFFFF`, text `#2A1B3D`, muted `#6B6488` (5.2:1), brand `#614379` (white 8.1:1), accent `#FF8A8B` (**dark text only**: 7:1 with `#2A1B3D`, fails with white) | Cormorant Garamond (600) + Rubik | 6px, ghost-outline secondary | italic | curtain; ghost word behind section titles |
| `dent-bento-blue` | 04, 10, 11 | bg `#FAFEFF`, surface `#FFFFFF`, text `#1F2937`, muted `#5E656E` (5.8:1), brand `#0A6CDB` (white 5:1), accent `#2E7562` green, warm `#FFC857` (ink text 9.5:1), soft `#E8F6F1` | Newsreader + Inter | 24px bento tiles, pill buttons, glass chips | italic | rise; glass chips float in one after another; cards lift on hover |

Optional seventh, sans-only: `dent-clinical-sans` (Inclusive Sans or DM Sans + Inter, `em: 'mark'`). Use it only if Abdul accepts a non-serif dental kit.

## 13. Recommended dental section orders (6)

Section ids follow LIBRARY.md. Proposed new ids: `infobar`, `team`, `beforeafter`, `insurance` (each is dropped if the client gave no data for it).

1. **Trust-first family clinic:** hero (H3) → infobar (B3: call/hours/book) → services (S3) → why (A1) → stats (P1, real only) → process (R1, 3 steps) → reviews (P9) → faq (F2) → book (B6) → footer (FT3)
2. **Booking-first / emergency:** hero (H6, form) → stats → services (S2) → cta (C5 emergency, only if the client offers emergency appointments) → why (A2) → reviews (P7) → faq (F1) → book → footer (FT1)
3. **Cosmetic / smile makeover:** hero (H2 bento) → services (S6 featured treatments) → beforeafter (G1, client photos only) → about (A5 lead dentist) → reviews (P8) → process (R2) → cta (C1) → faq → book → footer (FT2)
4. **Kids & family:** hero (H7 blob) → stats (P1 in an overlapping panel) → about (A7 circle + badge) → services (S2 pastel) → team (T1) → reviews → book (B5 with child-photo split) → insurance (P5 strip) → footer (FT4)
5. **Calm premium (arch):** hero (H8) → about (A7) → ribbon (statement quote with highlight) → services (S2 on tinted band) → reviews (P10 or `reviews:wall`) → faq (F3 split + arch photo) → team (T1 arch-top) → book (B6) → footer (FT5)
6. **NHS/insurance-heavy practice (UK/Ireland):** hero (H1 colour field + arch) → services panel (S1 overlapping) → why (A4 mosaic) → insurance (P5: NHS & private, payment plans, accepted plans) → process (R3) → reviews (P4 Google badge + cards) → faq → cta (B8 contact channels incl. WhatsApp) → book → footer (FT1)

## 14. Dental photo subjects we need (pool target about 40)

People at work come first, because heroes need them. All photos must show **gloves and masks used properly, modern clean rooms, and no readable branding**.

| Subject | Count | Used in |
|---|---|---|
| Dentist examining a smiling patient in the chair (mirror/probe, gloves) | 5 | hero, why |
| Smiling patient close-up (healthy natural teeth, varied ages/ethnicities) | 5 | hero H2/H3/H7, featured treatment cards, CTA C1 |
| Dentist talking a patient through an X-ray / intraoral scan on a screen | 3 | about, technology, process |
| Modern treatment room, empty (chair, lamp, monitor) | 3 | why, gallery, banner |
| Reception / waiting area, bright and calm | 2 | about, contact |
| Team group shot (2–4 clinicians in scrubs, not cut-out) | 2 | team, about |
| Single clinician portrait, arms crossed or smiling (waist up, plain background, suits arch/circle crops) | 4 | arch heroes, lead dentist, team |
| Child at the dentist (with parent, laughing, holding a toothbrush) | 4 | kids kit, family services |
| Clear aligners / orthodontics (hand holding an aligner, braces smile) | 2 | orthodontics card |
| Whitening (shade guide against teeth, bright smile) | 2 | whitening card |
| Implant / restorative (tooth model, crown on a tray, dental microscope) | 2 | implants card |
| Hygienist cleaning / polishing | 2 | hygiene card |
| Older adult patient smiling (dentures or implants audience) | 2 | implants, family |
| Nervous patient being reassured (hand on shoulder, calm talk) | 1 | "nervous patients welcome" fact |
| Emergency / toothache (person holding their jaw, not graphic) | 1 | emergency CTA (only if offered) |

Shapes to plan crops for: arch (tall 3:4 with headroom), circle (centred face), wide 16:9 banner with a clear left third for text, and square close-ups.

## 15. The strongest ideas we don't have yet (priority order)

1. **Practical "at a glance" strip under the hero** (call / today's hours / book, or an emergency line). Used by 03, 09 and 11, it answers the three things a dental visitor wants first. It builds from data we already collect (phone, hours).
2. **Before/after drag slider** (05, 06, 08). This is the single most "dental" interaction. It must use the client's own photos only, so it needs a "before/after photo pair" upload field in the intake form.
3. **Insurance & payment section** (05, 06): accepted plans strip, payment plans, "ask about coverage" bar. It pairs with facts we already extract (NHS & private, payment plans) and with UAE insurers later.
4. **Shape language as a kit trait**: arch, circle and blob crops plus a rotating badge stamp (01, 06, 08, 10). The same section looks completely different depending on its crop, which is a cheap way to make sites vary.
5. **Dentara-style pieces**: featured treatment photo cards with frosted labels, the staircase 3-step process, bento reviews (with sample tags in previews), and a watermark footer. These make the most premium page in the set.

Also worth a look: the bento hero with glass stat chips (04), and the framed hero card (07).
