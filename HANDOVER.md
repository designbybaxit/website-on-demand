# Website on Demand: project handover (from Idea Lab, Nov 2, 2026)

## Owner
Abdul Basit, Lahore, Pakistan (Asia/Karachi). He runs VoxBase Solutions (an AI automation agency) and has about 7 years of web design for US clients. His design brand is "Design by Baxit" and his GitHub is `designbybaxit`.
How he likes to work: step by step, plain answers, no sales calls. Never invent data. Validate that people will pay before heavy building, and set clear stop rules.

## The idea
A small business fills in a form (name, logo, about, services, prices, contact, photos). The AI builder makes a premium one-page website in Abdul's build standard. The client opens a live interactive preview, asks for changes or approves, then pays **$50 setup + $29/month** (hosting and maintenance), plus **$10** to connect a domain. The process is fully automated.
- Launch plan (agreed earlier, not started): test with Meta ads in Canada, Ireland and the UK, about $500 per country, with stop rules.
- Payments: Pakistan payment options are limited. The realistic route is a UK Ltd or US LLC with Stripe. A UAE company (via the DFHQ bot) was mentioned. Dodo Payments doesn't accept Pakistan-based sellers.
- Market research with sources: `/workspace/website-on-demand/research.md`. The closest competitors are Website Request ($29/mo + $149 setup), No Hassle Websites (£29/mo) and OpenForWeb.

## Abdul's standing requirements for generated sites (all confirmed by him)
1. Follow his build standard: `/workspace/website-on-demand/build-standard.md`, written from his reference site and playbook. Defaults he accepted: one long page, style matched to the industry, stock photos only where the client uploaded none, AI-written FAQ and why-us from the client's inputs, sentence case, and a 3-step process.
2. Sites must look "ridiculously amazing" so people instantly buy: clean, modern, fun, with plenty of animations and interactive elements, and matching each industry's standards.
3. Images in the hero AND every section, matching the client's actual industry. License-free is fine, but a graphic design studio must never get kitchen or tap photos.
4. The preview is a clickable link that opens the full interactive site in a new tab (menus, animations, sliders), never a screenshot. No watermark. He accepts that this exposes the code.
5. Prices must display exactly as typed (that bug is fixed: $100 now shows "From $100").
6. Reviews: he asked for "fake reviews" so clients understand the section. They're built as clearly marked sample reviews, shown in the preview only and listed in the "Before launch" box to replace before going live. I explained the legal risk of fake reviews on a live site; keep them out of live sites.

## Reference material Abdul provided
`/workspace/website-on-demand/reference/`: his Lumen Dental site, a salon template (missing its CSS/JS), his style code, `notes-docx.txt` (his playbook text) and `screens/` (screenshots of his clinic site). The original attachments are a zip, an .md and a .docx.

## The demo builder (current version v3)
- Folder: `/workspace/website-on-demand/demo/`. Read `demo/README.md` first; it covers the preview mechanics, the 34 industry profiles, photos and price parsing.
- Source is in `demo/src/` (JS parts plus `shell.html`). Rebuild with `sh demo/build.sh`, which produces `demo/demo.html` (about 287 KB, a single file). The v1 backup is `demo-v1-backup.html`.
- Tests: `/workspace/pwenv/bin/python demo/test/test_demo.py` (headless Chromium via Playwright; WebKit can't run on the box). Screenshots go to `demo/screenshots/v3/`.
- How it works: there's NO backend. Everything runs in the visitor's browser: form, then a fake 3-step "AI" pipeline, then the generated site, then request changes or approve (a fake-door payment). There's an admin view at `demo.html#admin`. No AI calls; copy comes from industry templates. `generateWithAI(data)` is a stub hook. Photos are hotlinked from Unsplash (verified URL sets per industry).
- The app brand is still `const BRAND` = "SiteSpark" with $ prices, in `src/c1-app.js`.
- `demo/pipeline/run_pipeline.py` is an old screenshot-based backend sketch and has been superseded.

## Hosting (current)
- Live on GitHub Pages, free with no credit limits (about 10 updates an hour): public repo https://github.com/designbybaxit/website-on-demand, branch `main`, root.
  - https://designbybaxit.github.io/website-on-demand/demo.html (website-on-demand demo)
  - https://designbybaxit.github.io/website-on-demand/app-demo.html (UK landlord dashboard demo, a different project)
  - https://designbybaxit.github.io/website-on-demand/ (UK landlord checker, a different project)
- To update, copy the new `demo/demo.html` to `/workspace/publish/demo.html` and upload it to the repo. So far that's been done in the box browser, which is signed in to GitHub as designbybaxit, via "Add file → Upload files" and a commit to main. Then check the live URL with curl. Cursor's GitHub connector is connected as designbybaxit, but it can't commit files or create repos.
- Old hosting: Netlify project `guileless-sfogliatella-985dee` on the team "golden-pips-network-support-team" (login thegoldenpipsnetwork@gmail.com; the box browser is signed in). It's on the free plan: 300 credits/month, and each deploy costs 15 credits. 119 credits were left on Nov 2; the period runs Oct 31 to Nov 29. Avoid deploying there. Abdul may delete it.
- The box can't open SSH tunnels (localhost.run, pinggy and cloudflared are all blocked).
- DoorMart (the Superstore bot's project) stays on Netlify. Abdul decided not to move it.

## Open questions for Abdul (not answered yet)
- Remove the "Website by Design by Baxit" credit in each generated site's footer?
- The app's brand name (SiteSpark or Design by Baxit) and the app's currency.
- Has he tested on Safari, iPhone or iPad? Only Chrome has been tested.
- The open questions in `build-standard.md` section 12.

## Known limitations of v3
Untested on Safari/iOS. A photo can repeat on image-heavy pages. The new tab shows `about:blank` in its address bar. App branding is still SiteSpark.

## Next big step (agreed direction, not started)
A real backend: (1) save each submission so Abdul receives the client's details; (2) save each generated site under its own expiring preview link (e.g. `/preview/<id>`, noindex); (3) Stripe checkout for $50 + $29/mo on approval; (4) on payment, publish the site permanently and connect the domain. GitHub Pages can't run backend code, so use something like Cloudflare (Pages + Workers, free tier) for the dynamic parts. Optionally, real AI copywriting per site via an AI API, at a small cost per site.

## Right now
Waiting on Abdul to test v3 on the GitHub link and send feedback.
