# SiteSpark website-on-demand demo

- `demo.html`: double-click to open. Client flow: form → 3-bot pipeline → **live preview** → request changes / approve (fake-door payment). Admin: `demo.html#admin`.
- Source lives in `src/`; rebuild with `sh build.sh` (concatenates the JS, syntax-checks it and injects it into `src/shell.html`).
- Rename agency/prices: edit `const BRAND = {...}` at the top of `src/c1-app.js`.
- AI hook: `generateWithAI(data)` (returns null in the demo, so the built-in industry copy is used).
- `pipeline/run_pipeline.py`: older backend sketch (screenshot-based); superseded by the hosted live preview below.
- `test/test_demo.py`: headless Chromium end-to-end test (`/workspace/pwenv/bin/python test/test_demo.py`). Screenshots go to `screenshots/v3/`.

## Live preview
- "Open your website preview ↗" opens the complete generated site in a new tab. Everything works: menu, buttons, animations, sliders, forms (forms only show a "nothing sent in preview" message).
- How it opens: `window.open('')` runs synchronously inside the click handler and the page is written into the new tab, which iOS Safari and popup blockers allow. If the browser refuses, the button is a real `<a target="_blank">` pointing at a Blob URL, so the browser follows that instead.
- The same page also runs inside the preview screen in a sandboxed iframe, with a Desktop (1280px) / Mobile (390px) switch.
- In this static demo the site code reaches the visitor's browser. That is accepted for the demo.

### Real clients: hosted preview link
For real clients the preview is **a hosted link on our server**, for example `https://preview.sitespark.site/<request-id>`:
- unguessable ID, `noindex`, expires after a few days (or on approval);
- the same link works on any device, so the client can open it on their phone or send it to a business partner;
- each change request gets a new version at the same link.

The live version shares the preview this way. The Blob/new-tab trick only works in the browser that built the site.

## Industry-matched content and photos
- `src/b1b-industries.js`: 34 industry profiles (graphic design, marketing, web, IT, photography, events, accountant, consultant, gym, yoga, physio, medical, dental, salon, barber, spa, restaurant, café, bakery, cleaning, gardening, electrician, roofing, builder, plumbing, auto repair, car wash, real estate, interior design, architect, law, tutoring, pets, retail).
  - `detectProfile(d)` scores keywords in the business name, "other industry" text (×5), services (×2) and about text (×1).
  - Each profile has a curated, verified set of Unsplash photos (free Unsplash License; every URL checked for HTTP 200 + image, and reviewed visually).
- Look vs content: the visual style is the nearest of the six templates. Copy, labels, forms, icons and photos follow the real business (`src/b1c-copy.js`), e.g. a design studio gets "Start a project" and "Recent work", never "free quote for plumbing".
- Photos are used in the hero, service cards (matched to each service by tags), about, why-us, process steps, gallery and booking background.
- Client uploads always come first; stock only fills the remaining slots and is flagged in the before-launch list.
- No runtime image search: the Openverse API timed out repeatedly during testing, so it is not used.

## Prices
`parsePrice` / `priceText` in `src/b2-helpers.js` read:
- `100` and `$100` → "From $100"
- `£1,250` → "From £1,250"
- `100.50` → "From $100.50"
- `from 80` → "From $80"
- `80-120` → "$80–$120"
- `100 per hour` and `£45/hr` → "… per hour"
- `35 per month` → "… per month"
- `Free quote` and `POA` are kept as text.

The currency always comes from the client's country.
