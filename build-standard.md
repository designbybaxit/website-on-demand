# Website-on-Demand Build Standard (v0.1, draft for Abdul's review)

**What this is:** the rulebook the builder bot follows when a client's form answers are turned into a preview site. It is built **only** from Abdul's own materials:

- **[PB]** `DBB-Website-Build-Playbook` (the .docx, "Design by Baxit — Website Build Playbook", version of 27–28 Oct 2026)
- **[PR]** the copy-paste build prompt (the .md, "build a site in the Design by Baxit style")
- **[KIT]** `dbb-starter-kit` (theme.css, theme.js, fx.css, fx.js, hero3d.js, tailwind-input.css, README.md)
- **[CLINIC]** `work/clinic/` (index.html, style.css, app.js), the only complete reference site in the zip
- **[SALON]** `gen/salon.tpl.html` + `gen/salon.py` (template and generator; its style.css and app.js were not in the zip)

Quotes in "double quotes" are Abdul's own wording. Anything marked **(inferred)** is my gap-filling and is not in his files, so he should confirm or strike it. Copies of the files are in `reference/`, and screenshots are in `reference/screens/`.

---

## 0. The one-paragraph version

Build every client site the way Abdul builds his industry concept demos. Use one premium serif display font and one clean sans body font, and 2–3 brand colours set as CSS variables in one `:root` block. Every headline is short and has **one serif-italic accent word**. The page opens with a hero that puts the main action (WhatsApp, book or call) on the first screen. Then come a trust/stats strip (real numbers only), services as cards with their own action links, a "why us" split, a numbered process, people, reviews (real only), FAQ, a contact/booking section and a dark footer. Motion is subtle: transform and opacity only, off for touch and for reduced motion, and the page stays readable with JS off. "No fake reviews, fake stats, fake client names or fake logos": if something is missing, "leave the section out and list it under 'Placeholders to confirm'."

---

## 1. Thought process and order of work

This is how Abdul works ([PB] 3.5 "Re-skin", 3.6 "New industry demo — recipe", [PR] "Deliver"). The builder follows these steps in order:

1. **Read the inputs and pick the industry pattern.** Match the client's trade to one of his six patterns (clinic, restaurant, home services, real estate, salon, law firm; see §2.2). If nothing matches, use the generic recipe in §2.1.
2. **Pick the type and colours first.** "Pick 1 serif display font + 1 sans body font, and 2–3 brand colours that fit the industry." Put them in `:root`, because "Everything else derives from these."
3. **Write the hero.** "Hero with one emphasised word in the H1, the main action visible on the first screen (book / reserve / quote / call)."
4. **Add a trust or stats strip.** On a real site "use only true numbers", "or remove".
5. **Lay out services or the menu "as plain HTML lists with prices"** ("from" prices).
6. **Add "One interactive feature that solves the industry's main job"** (§2.3).
7. **Add "Team / people, reviews, FAQ, visit/hours/map."**
8. **Finish with "A final booking or contact section."** and the footer.
9. **Apply the safety layer:** noindex/badge/modal-forms while it is a preview (§8.2), reduced-motion rules, and JS-off readability.
10. **Run the checklist (§10) and write the "Placeholders to confirm" list.** "Template rewrites … must list every placeholder … for the client to confirm or remove before launch."

Guiding principles in his words:
- "Do not add features that are not asked for." [PR]
- "Ask only what you need." [PB 5] (about form fields, but it reflects his overall attitude)
- "Scope Before Pixels" (a section title on his About page [PB 2]): decide the content before the design.
- "Practical, and Yours to Update" [PB 2]. Lists the owner will want to change are "plain HTML" (`<li class="svc" data-price data-mins>`, `<article class="listing" data-tags>`) [PB 3.2].
- "Use simple steps." [PB intro]

---

## 2. Page structure and section order

### 2.1 Default order for a client home page
This combines [PR] "Home page order" with the [PB] 3.6 recipe and the [CLINIC] build. Adapt the names to the industry.

| # | Section | Rule | Source |
|---|---|---|---|
| 0 | Top bar (optional) | Thin dark strip: live status ("● Accepting new patients this week"), a short trust note, clickable phone. Use it for local-service trades. | [CLINIC], [PB 8.5] "top bar phone + hours" |
| 1 | Sticky header | Logo (mark + name, bold short name), anchor nav (4–6 items), secondary "Call us" ghost button plus primary action button, hamburger on mobile. | [CLINIC], [PB 1.3] |
| 2 | Hero | Eyebrow (what + where, e.g. "Family & cosmetic dentistry in Springfield"), H1 with one accent word, one-sentence value line, primary button (main action) + secondary button, a small proof line. Visual on the right: big rounded photo with 2–3 floating info "chips". | [CLINIC], [PR] |
| 3 | Marquee / trust strip | Services or skills ribbon, or a trust strip. | [PR] 2, [SALON] ribbon |
| 4 | Stats row | 3–4 numbers with short labels. **Real numbers only, or remove.** | [PR] 3, [PB 6] |
| 5 | Services | Card grid (3 columns desktop). Each card has an icon, H3, one-line description, and its **own** action link with its own wording ("Book a cleaning →", "Call the emergency line →"). On WhatsApp sites, "each button → WhatsApp with its own pre-filled text". | [CLINIC], [PR] 4 |
| 6 | Why us (split) | Photo left with a floating stat badge; eyebrow + H2 + 4 check-list items, each "**Bold lead.** explanation", then a button. | [CLINIC] `#care` |
| 7 | Work / gallery | Only if the client has photos of their work (see §9). | [PR] 5 |
| 8 | Prices "from" | "final price confirmed on WhatsApp" (or by phone). Only if the client gave prices. | [PR] 6, [PB 6] |
| 9 | Process | Numbered steps (01, 02, 03 …) in serif italic. [PR] says 3 steps, [CLINIC] uses 4. Optionally an offer band under it. | [PR] 7, [CLINIC] |
| 10 | About / team | People cards (photo, name, role). Only with real people and photos. | [PR] 8 |
| 11 | Reviews | **Real only, or remove.** In [CLINIC] the quote cards scroll in a marquee. | [PR] 9 |
| 12 | FAQ | `<details>` accordion, first one open, left column with H2 + "Can't see yours? Call us at …". | [PR] 10, [CLINIC] |
| 13 | Final CTA / contact or booking | Copy + hours/address list on the left, form card on the right. | [PR] 11, [CLINIC] `#book` |
| 14 | Footer | Dark brand-colour footer: logo, address · phone, Privacy, Terms, contact. | [PR] 12 |
| + | Floating WhatsApp button | On every page (§6). | [PR], [PB 5] |

### 2.2 Industry variants (use the matching order) [PB 3.1]
- **Clinic (dental/medical):** hero → stats → services → care (split) → visit → team → reviews marquee → book (day + time chips) → FAQ. *No outcome claims.*
- **Restaurant/cafe:** hero (reservation bar) → story → signature dishes → tabbed menu with prices → gallery → press → private dining/events → reserve.
- **Home services (plumbing/HVAC/electrical):** 24/7 emergency bar + hero → trust → services → two-step instant quote + booking windows → flat-rate pricing + membership → stats band → service-area map → review breakdown → guarantee → FAQ.
- **Real estate:** hero with Buy/Rent/Sell search → stats → filterable listings → home-valuation form → mortgage calculator → neighbourhood guides → agents.
- **Salon/spa:** arched editorial hero → tabbed service menu (durations + prices) with booking basket (live total) → stylists → stylist/day/time booking → gallery → gift cards + membership → reviews → visit.
- **Law firm:** hero with free case-evaluation form → awards → practice areas → case results + disclaimer → process → attorneys → testimonial → FAQ → CTA band; mobile call bar; attorney-advertising note.
- **Generic local service** (Elementor plan [PB 8.5]): top bar phone + hours → hero with quote form → 6 service icons → why choose us (only verifiable claims) → Call/Quote/Fix → before/after → reviews slot → service area + map → FAQ → sticky mobile call button → footer with NAP.

### 2.3 One "wow" feature per site [PB 3.2, PR]
"One interactive feature that fits [INDUSTRY]": booking day/time chips (clinic), tabbed menu with prices (restaurant), two-step quote (home services), listing filter + mortgage calculator (real estate), booking basket with live total (salon), case-evaluation form (law).

### 2.4 Pages
His default list is "HOME, ABOUT, SERVICES, CONTACT, PRIVACY, TERMS, 404 — adjust" [PR]. His concept demos are **one page** ("One folder = index.html + style.css + app.js") [PB 3.2]. **Open question Q1.**

---

## 3. Copywriting: tone and voice

### 3.1 Rules
- **Headlines are short, with one accent word.** "Every H1/H2 is short, Title Case, with one accent word" [PR]. The studio site's real examples: "A Website, a Brand, and Simple Automation", "Three Lines of Work", "Starting Prices in USD", "Quote, Agree, Build", "Get a Free Quote" [PB 1.3]. **Note:** his industry demos use *sentence case with a full stop* instead ("Gentle care for a *brighter* smile."). See Q2.
- **Accent word placement:** studio guidance says "one accent word at the end" [PB 1.3]. In the demos the accent can be mid-line ("Leave feeling like *yourself,* only more so.") or a closing phrase ("Book your visit in *under a minute.*").
- **Eyebrow above every section heading:** 1–3 plain words, uppercase in CSS ("Treatments", "Why patients choose us", "Your first visit", "Meet the team", "Patient stories", "Online booking", "FAQ").
- **Value line:** 1–2 sentences that name the customer's worry and remove it, with concrete specifics. "Modern dentistry without the nerves. Same-week appointments, clear prices before any treatment, and a calm studio the whole family will actually like visiting."
- **Concrete over generic:** times, prices, specifics ("Same-day emergency slots, every weekday", "In-studio whitening in about an hour"). *(inferred from the examples)* Never generic filler like "quality service you can trust".
- **Benefit-led check items:** "**Clear prices, up front.** You get a written treatment plan and cost before anything starts. No surprise bills."
- **Action links speak in the customer's voice (first person, specific):** "Book for my child →", "Brighten my smile →", "Plan my implant →", "Free aligner consult →", "Claim this offer", "Build your appointment", "Get my free mockup →".
- **FAQ answers are warm, plain and reassuring:** "You're in good company. Tell us when you book and we'll plan extra time, explain each step…"
- **Plain English everywhere,** including Privacy and Terms ("Plain-English Privacy and Terms pages").
- **Honest pricing language:** "Prices are 'from' prices. The page says the final quote is confirmed on WhatsApp."
- **Microcopy under forms:** "By sending this you agree to the Terms and Privacy Policy."

### 3.2 Example lines from his site, to copy the voice
| Slot | His line |
|---|---|
| H1 | "Gentle care for a *brighter* smile." / "Leave feeling like *yourself,* only more so." / "Find the place you'll call *home*." |
| Services H2 | "Everything your smile needs, *under one roof.*" / "Choose your *treatments*" |
| Services intro | "From six-month checkups to full smile makeovers, every plan starts with a clear explanation and a written price." |
| Why-us H2 | "Modern technology. *Old-fashioned* kindness." |
| Process H2 | "Simple from the *first click.*" (steps: "Book online", "Quick paperwork", "Exam & clean", "Your plan") |
| Team H2 | "Dentists who *listen* first." / "Stylists with *a point of view*" |
| Reviews H2 | "Rated *4.9 out of 5* by our neighbours." |
| Booking H2 | "Book your visit in *under a minute.*" / "Pick your stylist and a *time that suits.*" |
| FAQ H2 | "Good *questions.*" |
| Gift H2 | "Give the gift of *an hour off.*" |
| Visit H2 | "12 Linden Row, *Springfield*" |
| Ad landing H1 | "A salon website that looks as good as your work." |
| Note | "No cost, no obligation." |

### 3.3 Writing from the client's form (inferred)
The client's "About" text is the raw material. Rewrite it in the voice above (short, specific, warm), but **never add facts the client did not give**: no years, awards, insurance, guarantees, ratings or certifications they did not state. Unknown specifics become placeholders (§9).

---

## 4. Design system (from the actual CSS)

He has three styles: **Neutral** (theme.css, dark default + light toggle), **Bold Colour** (fx.css, cream + ink stickers), and **Industry demo style** (each demo has its own fonts and palette) [PR "Style"]. For client sites the builder uses the **Industry demo style**, with [CLINIC] as the master template. *(inferred: the demos are his pattern for business sites; Neutral and Bold Colour are his own studio brand. See Q3.)*

### 4.1 Tokens (one `:root` block, nothing hard-coded in sections)
From [CLINIC] style.css, "RE-SKIN: change the colour tokens below. Everything else derives from them.":
```css
:root {
  --bg: #f5f8f7;        /* page background, near-white tinted */
  --surface: #ffffff;   /* cards, alternate sections */
  --ink: #0c3b44;       /* primary brand colour (text, primary buttons, footer) */
  --ink-2: #3d5c63;     /* muted text */
  --mint: #78d6c6;      /* accent */
  --mint-soft: #dff5f0; /* soft tint of accent (icon chips, blobs) */
  --peach: #ffd9bf;     /* warm secondary blob */
  --line: #dde7e5;      /* borders */
  --radius: 22px;
  --shadow: 0 30px 60px -30px rgb(12 59 68 / .35);
  --ease: cubic-bezier(.2,.8,.2,1);
  --serif: "Instrument Serif", Georgia, serif;
  --sans: "Plus Jakarta Sans", system-ui, sans-serif;
}
```
The pattern [PB 3.2] is "2–3 brand tokens plus --bg, --paper, --muted, --line, --ease … --serif, --sans". Checklist: "Tokens defined once …, no random hex values in sections." *(Note: [CLINIC] itself breaks this slightly. It hard-codes `#0f7466` for accent text and eyebrows, so the builder should add it as a token, e.g. `--accent-text`.)*

Palettes he used per industry [PB 3.1]: clinic `#0c3b44`/`#78d6c6`; restaurant `#120e0b`/`#ff7a3d`/`#e6b65c`; home services `#0b1f3a`/`#ffc21a`; real estate `#1d3b2f`/`#c9a46a`; salon `#3b1d2c`/`#c4727f`/`#f5e9e4`; law `#7b1e2b`/`#c2a36b`/`#151515`.

### 4.2 Fonts
- "one premium serif display font + one clean sans body font from Google Fonts (home services uses one strong sans)" [PB 3.2].
- His pairs: Instrument Serif / Plus Jakarta Sans (clinic), Cormorant Garamond / Manrope (restaurant), Archivo (home services), DM Serif Display / Inter Tight (real estate), Bodoni Moda / Outfit (salon), Libre Caslon Display + Text / Libre Franklin (law).
- Load with `preconnect` to fonts.googleapis.com and fonts.gstatic.com, `display=swap`, "only the weights you use".
- **Important detail:** in the demos the headings are set in the **sans at weight 700** (`h1,h2,h3 {font-weight:700; letter-spacing:-0.03em; line-height:1.08}`). The serif is used **only** for the accent `<em>` (italic 400, letter-spacing -0.01em, accent-text colour), the step numbers, and the review quotes.

### 4.3 Type scale ([CLINIC])
| Element | CSS |
|---|---|
| Body | `400 16px/1.6 var(--sans)` |
| H1 (hero) | `clamp(2.6rem, 5.6vw, 4.6rem)`, 700, -0.03em, lh 1.08 |
| H2 (section head) | `clamp(2rem, 4vw, 3.2rem)` (split/booking: `clamp(2rem,4vw,3rem)`) |
| H3 (card) | `1.2rem` |
| Lead | `1.12rem`, `--ink-2`, max-width 34rem |
| Eyebrow | `13px`, 700, `letter-spacing:.14em`, uppercase, accent-text colour |
| Card text | `15px`, `--ink-2` |
| Stat number | `2.4rem`, 800, -0.04em (mobile 1.9rem) |
| Review quote | serif `1.35rem/1.3` |
| Step number | serif italic `2rem` |
| Small/fine | 12–14px |

### 4.4 Layout and spacing
- Container: `.wrap { width: min(1200px, 100% - 2.5rem); margin-inline: auto; }`
- Section padding: `6rem 0` desktop (96px), `4.2rem 0` under 640px. ([PB] Tailwind version: `py-24 sm:py-28`, i.e. "~96–112px desktop, ~64px mobile".)
- Section heads are centred, max-width 640px, margin-bottom 3.2rem (FAQ uses a left-aligned head in a two-column layout).
- Alternate section backgrounds: `--bg` and `--surface` (white); booking gets a gradient `--bg → --mint-soft`; footer and offer band use solid `--ink`.
- Grids: hero `1.05fr 1fr` gap 3.5rem; cards 3 columns gap 1.2rem; split 1fr 1fr gap 4.5rem; steps 4 columns; team 3 columns; stats 4 columns inside one bordered rounded box.

### 4.5 Shape, borders and shadows
- Radius: cards and images `22px` (`--radius`), hero image `32px`, form card/offer band `28px`, inputs and chips `14px`, icon tile `16px`, **buttons fully rounded (`999px`)**.
- Borders: `1px solid var(--line)`.
- Shadow: one soft brand-tinted shadow (`--shadow`), plus a smaller one on primary buttons (`0 10px 24px -12px`).

### 4.6 Buttons
- `.btn`: inline-flex, `padding .7rem 1.2rem`, `600 15px/1`, pill, `white-space:nowrap`. `.btn-lg`: `1rem 1.6rem`, 16px.
- Primary: `--ink` background, white text, soft shadow; hover `translateY(-2px)` with a bigger shadow.
- Ghost: white background, `--line` border; hover border becomes `--ink` and the button lifts 2px.
- Light: white on dark bands.
- An arrow SVG after the label, which nudges `translateX(4px)` on hover.
- Text links in cards: 700 14px, accent-text colour, ending in "→".

### 4.7 Imagery
- Large rounded hero photo (aspect 11/10) with slight `scale(1.06)` and 2–3 frosted-glass floating chips (`rgb(255 255 255/.9)` + `backdrop-filter: blur(10px)`) carrying real facts (next slot, offer, comfort option).
- Split-section photo (aspect 5/4) with a solid `--ink` stat badge overlapping the corner.
- Team portraits at aspect 7/8 that zoom to 1.06 on hover.
- Source pattern: "Unsplash CDN URLs with ?w=…&q=70&auto=format&fit=crop, loading="lazy", width and height set"; hero image has `srcset`, `sizes` and `fetchpriority="high"`.
- Every image has meaningful alt text; decorative avatars use `alt=""`.

### 4.8 Icons and logo
- Inline SVG line icons in a 24 viewBox, `stroke-width:1.7`, round caps and joins, no fill, inside a 52px `--mint-soft` rounded tile. On card hover the tile turns `--ink` and the stroke turns `--mint`.
- Logo: inline `<svg class="logo-mark">` (a 40×40 rounded square in `--ink` with a simple symbol in `--mint`) + `<span><b>Short</b> Rest of name</span>`. The footer uses inverted colours.
- Favicon: an inline data-URI SVG that matches the logo mark.

### 4.9 Decorative background
- Hero: two big blurred blobs (`filter:blur(60px)`, opacity .45–.55) in `--mint-soft` and `--peach`, drifting slowly (14s/18s alternate).
- Offer band: a radial accent glow in the corner.

### 4.10 Animation and motion
- "Rule: animate only transform and opacity. Never animate width, height, top, left." *(The [CLINIC] steps underline animates `width`. That is a small slip against his own rule, so use `scaleX` instead.)*
- Scroll reveal: `.js .reveal { opacity:0; transform:translateY(26px); transition .8s var(--ease) }`, `.in` sets it visible; stagger `--d` = index × 0.08s (cycles every 6); IntersectionObserver threshold .12, rootMargin -40px bottom.
- Count-up stats (1.6s, easeOutQuart), shown instantly under reduced motion.
- Header gains a border and shadow after 10px of scroll; frosted `rgb(bg/.8)` + `blur(14px)`.
- Nav underline: `scaleX` sweep in `--mint`.
- Cards: hover lift -6px, a soft circle grows from the corner, the icon tile rotates -8deg.
- Hero tilt plus parallax chips **only** on `(hover: hover) and (pointer: fine)`.
- Gentle bob on the chips and a pulsing "live" dot.
- Reviews marquee 40s linear, pauses on hover, edges faded with a mask.
- FAQ "+" rotates 45° when open.
- **Safety:** "Pointer effects only under (hover: hover) and (pointer: fine)"; "Everything off under prefers-reduced-motion"; "Reveal-hiding is scoped to a .js class … If JavaScript fails, the page is fully visible, not blank."
- Optional 3D hero (Three.js r160, lazy, WebGL and not Save-Data, CSS fallback, pauses off-screen). For client previews: **do not use** *(inferred: he calls it "optional", and it would not show in a screenshot preview anyway)*.

---

## 5. Responsive behaviour ([CLINIC] breakpoints, [PB 6] "Mobile")
- "Design for 390×844 first. The hero CTA must be visible on the first screen and not covered by the WhatsApp button."
- **≤1000px:** the nav hides and the burger shows (44px, X animation, `aria-expanded`). The mobile nav slides open (max-height) with full-width links plus the primary button. Hero, split, booking and FAQ go to 1 column; cards, steps and stats go to 2 columns.
- **≤640px:** `.hide-sm` items hide (e.g. "Call us" ghost button, the middle top-bar text); header height 64px; hero padding `2.5rem 0 3.5rem`; **hero buttons go full width** (`flex: 1 1 100%`); cards, steps and team go to 1 column; the third hero chip hides; the offer band stacks; the form's two-column row becomes one column; sections use `4.2rem` padding.
- **≤380px:** the header primary button hides (the burger menu still has it).
- "No horizontal scroll (overflow-x: clip on main)" ([CLINIC] uses `overflow-x:hidden` on body). Verified: no horizontal scroll at 390 and 1440.
- Touch devices get no hover or pointer effects. "Sticky call bar where calling is the main action."

---

## 6. Conversion elements
- **Main action decides everything:** "Main action for visitors: [BOOK / CALL / GET A QUOTE / RESERVE / WHATSAPP]" [PR]. It appears in the header button, the hero primary button, every service card link, the mid-page offer and the final section.
- **WhatsApp first** (his studio pattern and the prompt default): "WhatsApp is the primary CTA. Floating button on every page." Links use `https://wa.me/[DIGITS]?text=[URL-ENCODED MESSAGE THAT NAMES THE PAGE]`; "Each service/package button has its own pre-filled WhatsApp text." Floating button on mobile: "48px, 1rem from the corner, must not cover the hero buttons at 390×844. Add body bottom padding."
- **Phone:** always a `tel:` link (top bar, header ghost button, emergency card, FAQ intro).
- **Backup form** fields: "name, email, WhatsApp (optional), service, budget, message. … No gender field. Ask only what you need." Validation with `data-rule` (`required`, `email`, `phone` 7–15 digits if filled). "If sending fails, the visitor's input is kept." Booking-style form for booking trades ([CLINIC]: treatment select, day chips (next 5 days, no Sundays), time chips with disabled taken slots, name, mobile).
- **Anti-spam** (before any network call): honeypot off-screen with `tabindex="-1"` and `aria-hidden` ("if filled, show success and send nothing"), reject if filled in under 4 seconds, reject more than 2 links, 45-second cooldown, and the endpoint built in JS at runtime ("not in action=""").
- **Trust elements:** hero proof (avatars + star rating + count), stats row, floating hero chips, a why-us check list, a stat badge on a photo, a team section, a review marquee, an offer band ("New patient special … $99"), hours and address list. **Each one appears only when the client supplied the facts** (§9).
- **Hours + address** sit beside the final form as a bordered key/value list.

---

## 7. Technical rules
- **Stack:** "Static HTML + CSS + vanilla JS. No framework, no CMS, no build step to serve." Demos: "One folder = index.html + style.css + app.js." "For a single-page demo, a hand-written style.css with a :root token block (like the kit demo) is fine." Tailwind (v4.3.3) only if precompiled, "never from a CDN".
- **Libraries:** none, apart from Google Fonts (and Three.js only for the optional 3D hero).
- **Head:** `lang`, charset, viewport, a unique `<title>` ("Page — Brand"), meta description, canonical (clean URL, no .html), Open Graph + Twitter tags, og-image 1200×630, `theme-color` = `--bg`, data-URI SVG favicon (+ apple-touch-icon for a live site), font preconnects, `preconnect` to the image CDN, and the script loaded with `defer`.
- **JSON-LD:** "the right local business type with services/offers, contact point, address, WebSite".
- **Files for a live site:** `sitemap.xml`, `robots.txt` (allow all, explicitly allow GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended), `llms.txt`, `_headers` (HTML max-age=0; CSS/JS 1 day; images 30 days; nosniff), `404.html`.
- **Hosting:** Cloudflare Pages (no build command, root output). "Other static hosts (Netlify, Vercel, any server) also work."
- **Performance:** images sized in the URL, `loading="lazy"` below the fold, width and height on every image, `fetchpriority="high"` on the hero image, only the font weights used, animations pause off-screen. "Run Lighthouse mobile and report the real scores (do not guess)." The Elementor target is "85+".
- **Accessibility:** a skip link to `#main`; "One H1 per page, logical headings, alt text on all images, real buttons, aria-pressed on toggles, aria-label on icon buttons, tabs with role="tab"/"tabpanel", visible focus" ([CLINIC]: `:focus-visible {outline:3px solid var(--mint); outline-offset:3px}`); `aria-labelledby` on the hero; landmark `<nav aria-label>`; dialogs with `role="dialog" aria-modal`, Escape closes them.
- **Secrets and tracking:** no API keys in HTML or JS; "No tracking unless I give IDs."
- **Brand-swap comment:** the HTML carries a top comment naming the brand, where colours live and where the logo is ([CLINIC], [SALON]).
- **Generators:** repeating content (service rows, listings) is built by tiny functions from data ([SALON] `svc(name, desc, mins, price)`) so it stays consistent. This maps directly onto the builder bot.

---

## 8. Honesty and legal
### 8.1 Content honesty (strict)
- "No fake reviews, fake stats, fake client names or fake logos. If something is missing, leave the section out and list it under 'Placeholders to confirm'."
- "Use only true numbers."
- Industry rules: "law = results disclaimer + attorney advertising note; medical = no outcome claims."
- Plain-English Privacy and Terms, "linked in the footer and under every form".

### 8.2 Preview status (inferred)
A client preview is not yet a live client site. Until approval, use his concept-demo safety pattern: `<meta name="robots" content="noindex, follow">`, forms call `preventDefault()` and open a "this is a demo/preview" modal, and a small fixed badge. **Unlike his concept demos, the preview must not contain fictional people, reviews or numbers.** It uses only the client's real inputs plus clearly marked placeholders. After approval: remove the badge and modal, remove noindex, and wire the real form. (See Q4 on the badge wording and brand.)

---

## 9. Adapting to the client's form inputs
| Input situation | What the builder does | Basis |
|---|---|---|
| **Logo uploaded** | Use it in the header (height ~38px) and footer; make the favicon from it; pull `--ink`/accent from it if no colour was chosen *(inferred)*. | [CLINIC] logo slot |
| **No logo** | Make a text logo in his pattern: a simple inline SVG mark (rounded square in `--ink` with the initial or a trade symbol in the accent) + `<b>Short name</b> rest of name`. Data-URI favicon from the same mark. | [PB 3.5] "Replace the inline <svg class="logo-mark">", [PB 8.6] "Make logo options as SVG + PNG" |
| **No colour chosen** | Use the industry palette from §4.1. | [PB 3.1/3.6] |
| **Client colour chosen** | That becomes `--ink` (primary); derive a lighter accent and a soft tint; check contrast *(inferred)*. | "2–3 brand colours" |
| **Industry matches one of his six** | Use that section order (§2.2) and wow feature (§2.3). | [PB 3.1] |
| **Industry doesn't match** | Generic recipe §2.1; wow feature = quote/booking form *(inferred)*. | [PB 3.6] |
| **No photos uploaded** | His demos use Unsplash photos with sized URLs. For a client preview, use relevant Unsplash stock of the *place or work type*, **never** photos that pretend to show the client's staff, team or finished jobs *(inferred; see Q5)*. Skip the team and gallery sections entirely. | [PB 3.2], [PB 6] honesty |
| **Photos uploaded** | Hero photo = best one; split photo = second; gallery from the rest; write alt text describing each. | [CLINIC] |
| **Services without prices** | Card with description + action link ("Ask for a quote →"); no prices section. | [PR] |
| **Services with prices** | Show as "from" prices with "final price confirmed on WhatsApp/by phone" | [PB 6] |
| **Service without description** | Write one short, specific line from the service name, with no invented claims; add it to placeholders *(inferred)*. | §3.3 |
| **No reviews / no real numbers** | Remove the reviews section, the stats row, the hero star rating and the stat badge. Do **not** invent them. Optionally use a "slot for real reviews later". | [PB 6] |
| **Google-reviews link given** | Link to it ("Read our Google reviews →") but do not quote ratings that weren't supplied *(inferred)*. | honesty rule |
| **No hours / no address** | Leave those rows out of the visit list; no map. | "leave the section out" |
| **WhatsApp number given** | WhatsApp is the main action: floating button + pre-filled messages per service. | [PR] |
| **No WhatsApp** | Main action = Call (`tel:`) or the booking/quote form; sticky mobile call bar for call-first trades. | [PB 6] Mobile |
| **No FAQ given** | Write 3–4 FAQs from the client's services and hours using *only* facts they gave, or leave it out *(inferred; see Q6)*. | — |
| **About text is thin** | Short hero and value line built from it; skip the about section; list "About story" in placeholders. | — |
| **Medical / legal** | No outcome claims / results disclaimer + attorney-advertising note. | [PB 6] |
| **Always** | Output a "Placeholders to confirm" list alongside the preview. | [PB 6], [PR Deliver] |

---

## 10. Quality checklist (must pass before a preview goes out)
Based on [PB] section 9 and [PR] "Deliver", trimmed to what applies to a preview.

**Design**
- [ ] Tokens defined once in `:root`; no stray hex values in sections.
- [ ] Every H1/H2 has exactly one accent word (serif italic `<em>`).
- [ ] Section order follows §2.1 or the matching §2.2 variant.
- [ ] One serif display + one sans body font from Google Fonts, `display=swap`, only used weights.
- [ ] Motion uses only transform/opacity, is off for reduced motion, and is off for touch.
- [ ] Page is readable with JavaScript off (reveal scoped to `.js`).

**Content**
- [ ] No invented reviews, ratings, stats, years, awards, people, client names or logos.
- [ ] Prices shown as "from", with the confirm line.
- [ ] Copy follows the §3 voice; no generic filler; client facts not changed.
- [ ] Industry legal lines present (medical/law).
- [ ] "Placeholders to confirm" list produced.

**Conversion**
- [ ] Main action visible on the first screen at 390×844 and 1440×900.
- [ ] Floating WhatsApp (if a number was given) does not cover the hero buttons at 390×844; body has bottom padding.
- [ ] Each service button has its own action or pre-filled text.
- [ ] Phone is a `tel:` link; email is a `mailto:` link.
- [ ] Preview forms open the demo modal and send nothing.

**SEO / tech**
- [ ] Unique title "Page — Brand", meta description, OG/Twitter, theme-color, favicon, JSON-LD local business.
- [ ] `noindex` while in preview.
- [ ] No API keys; no tracking IDs unless supplied.

**Mobile / performance / a11y**
- [ ] No horizontal scroll at 390 px.
- [ ] Hamburger menu works; hero buttons go full width under 640px.
- [ ] Images sized, lazy below the fold, width/height set, hero `fetchpriority="high"`.
- [ ] One H1, logical headings, alt text, skip link, visible focus, `aria-label` on icon buttons, `aria-expanded` on the burger, tabs with roles.
- [ ] Screenshots captured at 390×844 and 1440×900 (these become the preview images).
- [ ] Lighthouse mobile run and real scores recorded (internal only; see Q7).

---

## 11. Conflicts between his docs and the current demo (`demo/demo.html`, `demo/pipeline/run_pipeline.py`)
1. **The demo form has no WhatsApp field and no "main action" choice.** His standard makes WhatsApp (or book/call/quote/reserve) the backbone of every CTA. The form needs "WhatsApp number" and "Main action for visitors".
2. **The form asks for no photos, reviews, real numbers, prices style, team or FAQ.** His sections depend on these. Without them, the honesty rule forces those sections out, so the site comes out "basic". The form needs optional fields for photos (hero/work/team), real reviews (with permission), real stats (years, jobs), and the industry's key facts.
3. **Single-document, in-browser build vs his multi-file static site.** The demo assembles one HTML string with inline styles. His standard is `index.html + style.css + app.js` (or Tailwind precompiled), Cloudflare Pages, plus sitemap, robots, llms.txt, _headers and 404. Fine for a preview, but the "go live" step must output his file set.
4. **In-browser preview rasterising (SVG foreignObject → canvas) won't show his design properly.** External Google Fonts and Unsplash images generally don't load inside a foreignObject image, so the preview would fall back to system fonts and lose photos. *(inferred from how browsers handle foreignObject; not yet tested with a DBB-style page.)* The server-side Playwright screenshot route (already sketched in `run_pipeline.py`) is the one that matches his standard.
5. **Styles.** The demo offers generic "Style" themes and a colour list. His system is industry-driven (font pair + palette per industry, §4.1/4.2).
6. **Headlines.** The demo's templates write lines like "Plumbers you can rely on in Leeds" without an accent word, and the "why" items are generic claims ("Fully insured", "Trusted locally", "Customers keep coming back"). These break his "no unverified claims" rule ("why choose us (only verifiable claims)").
7. **Branding.** The demo is branded "SiteSpark" with `$` prices ($50 setup + $29/mo + $10 domain). His docs are "Design by Baxit" with USD studio packages (Starter from $499 etc.). The plan for the target countries uses local currency (C$, €, £). The brand and currency shown on previews need deciding.
8. **Hosting.** The demo assumes `yourbusiness.sitespark.site`; his docs deploy on Cloudflare Pages (with a www → apex Redirect Rule). The current Netlify demo host is only for showing demos.
9. **Lighthouse and the "Placeholders to confirm" deliverables** have no place in the current pipeline (bot 2/bot 3 logs). They need adding.
10. **Change requests.** The demo lets the client change "Style", "Main colour" and "New headline". Fine, but a client headline must be re-shaped to the one-accent-word rule.

---

## 12. Questions for Abdul (ambiguous or contradictory points)
- **Q1 Pages:** for the $50 product, one long page (like his demos) or Home/About/Services/Contact + Privacy/Terms/404 (his prompt default)?
- **Q2 Headline case:** the prompt and studio site say "Title Case" ("Three Lines of Work"); his industry demos use sentence case with a full stop ("Gentle care for a *brighter* smile."). Which for clients?
- **Q3 Style:** should client sites always use the Industry demo style (my reading), or should clients also be able to get the Neutral (dark) or Bold Colour (cream/sticker) looks?
- **Q4 Brand on previews:** the badge and footer line: "Design by Baxit", "VoxBase Solutions" or "SiteSpark"? And keep a small "Website by …" credit after launch?
- **Q5 Stock photos:** when the client uploads no photos, is relevant Unsplash stock OK on a *real* client site (his demos use it, but only as fictional concepts)? Or should we use photo-free layouts and ask the client for photos?
- **Q6 FAQ and "why us":** may the builder write FAQs and why-us points from the client's own inputs, or leave those sections out unless the client supplies them?
- **Q7 Lighthouse:** run it on every preview automatically (slower, real scores), or only before go-live?
- **Q8 Process steps:** 3 steps (prompt) or 4 (clinic)? Or whatever fits the trade?
- **Q9 Years of experience:** his studio hero and stats say "8+ years"; elsewhere he has said about 7 years. Which is correct for his own marketing? (This does not affect client sites.)
- **Q10 Studio-site sections:** the playbook describes his studio home page (marquee, packages, care plans), but the zip has no studio HTML, only the clinic demo and the salon template. Is the studio site itself worth sending (or its URL), or are the demos the standard he wants?

---

## 13. What was in the zip, and what couldn't be checked
- Rendered: `work/clinic/index.html` at 1440 and 390 (screens in `reference/screens/`: `clinic-desktop-hero.png`, `clinic-desktop-full.png`, `clinic-mobile-hero.png`, `clinic-mobile-full.png`). No horizontal scroll at either width.
- `gen/salon.py` runs and generates the salon page, but the salon's own `style.css`/`app.js` are not in the kit (the README says so), so it renders unstyled. Only its HTML and copy were used.
- `theme.css`/`fx.css`/`theme.js`/`fx.js`/`hero3d.js` are for his studio site, whose HTML pages (index, about, etc.) are not included, so those layers were read as code but not rendered.
- The playbook mentions five more demos (restaurant, home services, real estate, salon CSS, law) and `re.py`/`law.tpl.html`; those files are not in the zip.
