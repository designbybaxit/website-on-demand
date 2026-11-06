"""Live end-to-end test of the Website on Demand backend (phase 1).
Run: /workspace/pwenv/bin/python test/test_e2e.py [BASE_URL]
Reads the admin password from ../ADMIN_PASSWORD.txt (never printed). Screenshots -> ../screenshots/
"""
import asyncio, os, re, sys, json, urllib.request
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
DEMO_TEST = os.path.join(os.path.dirname(ROOT), 'demo', 'test')
BASE = (sys.argv[1] if len(sys.argv) > 1 else 'https://wod.designbybaxit.workers.dev').rstrip('/')
SHOTS = os.path.join(ROOT, 'screenshots'); os.makedirs(SHOTS, exist_ok=True)
PW = open(os.path.join(ROOT, 'ADMIN_PASSWORD.txt')).read().strip()
NAME, SLUG = 'Test Plumbing Co', 'test-plumbing-co'
fails = []
def check(c, m):
    print(('  PASS ' if c else '  FAIL ') + m, flush=True)
    if not c: fails.append(m)
def shot(name): return os.path.join(SHOTS, name)
SCROLL = "(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,200))} await new Promise(r=>setTimeout(r,3000)); scrollTo(0,0)})()"
VIS = "(()=>{const c=document.querySelector('.site').cloneNode(true); c.querySelectorAll('script,style').forEach(e=>e.remove()); return c.textContent})()"

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # ---------- 1. client fills the form and builds a preview ----------
        print('== 1. client: form -> preview -> share link')
        c1 = await b.new_context(viewport={'width': 1400, 'height': 900}); pg = await c1.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE + '/'); await pg.wait_for_selector('#intake')
        check(await pg.locator('.foot a[href="#admin"]').count() == 0, 'client page has no admin link')
        await pg.select_option('#exPick', 'home'); await pg.click('#fillExample')
        await pg.fill('#f-name', NAME)
        await pg.fill('#f-about', 'Test Plumbing Co is a TEST business used to check the Website on Demand system. Family-run, Gas Safe registered plumbing and heating in Leeds. Not a real company.')
        await pg.fill('#f-email', 'test-plumbing@example.com')
        await pg.fill('[name=reviews]', '')   # no real reviews: preview gets labelled samples, live site must get none
        await pg.fill('[name=stats]', '')
        await pg.fill('.svc[data-i="0"] input[data-k=price]', '£95')
        await pg.fill('.svc[data-i="1"] input[data-k=price]', '80-120')
        await pg.set_input_files('#photoFile', [os.path.join(DEMO_TEST, 'photo1.jpg'), os.path.join(DEMO_TEST, 'photo2.jpg')])
        await pg.wait_for_function("document.querySelectorAll('#photoList img').length === 2")
        # a before/after pair (drawn test images labelled TEST UPLOAD, standing in for the client's own photos)
        FX = os.path.join(DEMO_TEST, 'fixtures')
        check(await pg.is_visible('#baField'), 'before/after upload offered for home services')
        await pg.set_input_files('#baBefore', os.path.join(FX, 'ba-before-1.jpg')); await pg.wait_for_function('!!baDraft.b')
        await pg.set_input_files('#baAfter', os.path.join(FX, 'ba-after-1.jpg')); await pg.wait_for_function('!!baDraft.a')
        await pg.fill('#baLabel', 'Bathroom refit'); await pg.click('#baAdd')
        await pg.screenshot(path=shot('01-form.png'))
        await pg.click('#buildBtn')
        await pg.wait_for_selector('#screen-preview.on', timeout=120000)
        await pg.wait_for_selector('#shareUrl', timeout=10000)
        share = await pg.input_value('#shareUrl')
        check(re.match(re.escape(BASE) + r'/p/[A-Za-z0-9]{18}$', share) is not None, f'share link created: {share}')
        check((await pg.get_attribute('#openPv', 'href')) == share, '"Open your website preview" button points at the share link')
        check('Private preview link ready' in await pg.inner_text('#bot3'), 'preview bot reports the saved link')
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path=shot('02-preview-screen.png'))
        sid = share.rsplit('/', 1)[1]
        # ---------- 2. share link in a fresh browser, desktop + mobile ----------
        print('== 2. share link in fresh contexts')
        for label, kw in [('desktop', dict(viewport={'width': 1400, 'height': 900})), ('mobile', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True))]:
            c = await b.new_context(**kw); q = await c.new_page(); perr = []
            q.on('pageerror', lambda e: perr.append(str(e)))
            r = await q.goto(share); await q.wait_for_selector('.site.js', timeout=20000); await q.wait_for_timeout(1500)
            h = r.headers
            check(r.status == 200 and 'noindex' in h.get('x-robots-tag', '') and 'sandbox' in h.get('content-security-policy', ''), f'{label}: preview 200, noindex, sandboxed')
            txt = await q.evaluate(VIS)
            check(NAME in txt and 'From £95' in txt and '£80–£120' in txt, f'{label}: name and prices exactly as typed (From £95, £80–£120)')
            check(await q.locator('.sample-tag').count() > 0, f'{label}: preview shows labelled sample reviews (preview only)')
            await q.evaluate(SCROLL)
            imgs = await q.evaluate("Array.from(document.querySelectorAll('img')).filter(i=>i.src.includes('/i/')).map(i=>[i.src,i.naturalWidth])")
            check(len(imgs) > 0 and all(w > 0 for _, w in imgs), f'{label}: uploaded photos served from /i/ ({len(imgs)} img tags load)')
            check(await q.locator('.pv-badge').count() == 0, f'{label}: no watermark')
            ba = await q.evaluate("Array.from(document.querySelectorAll('[data-ba] img')).map(i=>[i.src,i.naturalWidth])")
            check(len(ba) >= 2 and all('/i/' in u and w > 0 for u, w in ba), f'{label}: before/after slider shows the uploaded pair from /i/ ({len(ba)} images)')
            if label == 'mobile' and await q.locator('.burger').count():
                await q.click('.burger'); await q.wait_for_timeout(400)
                check(await q.evaluate("document.querySelector('.burger').getAttribute('aria-expanded')") == 'true', 'mobile: menu opens')
                await q.click('.burger'); await q.wait_for_timeout(300)
            check(not perr, f'{label}: no page errors {perr[:2]}')
            await q.screenshot(path=shot(f'03-share-link-{label}.png'))
            if label == 'mobile': await q.screenshot(path=shot('03-share-link-mobile-full.png'), full_page=True)
            await c.close()
        # ---------- 2b. step through designs, then go back one ----------
        print('== 2b. design back / forward')
        check(await pg.inner_text('#dPos') == 'Design 1 of 1', 'design nav: Design 1 of 1')
        for want in ['Design 2 of 2', 'Design 3 of 3']:
            await pg.click('#dNext'); await pg.wait_for_function(f"document.querySelector('#dPos').textContent === '{want}' && !designBusy", timeout=60000)
        await pg.click('#dPrev'); await pg.wait_for_function("document.querySelector('#dPos').textContent === 'Design 2 of 3' && !designBusy", timeout=60000)
        st = await pg.evaluate("({d: current.opts.design, saved: current.savedVersion === current.version, url: current.shareUrl})")
        check(st['d'] == 1 and st['saved'] and st['url'] == share, f'"Previous design" back to design 2, saved on the server {st}')
        shown_doc = await pg.evaluate('previews.doc')
        c = await b.new_context(); q = await c.new_page(); await q.goto(share); await q.wait_for_selector('.site.js', timeout=20000)
        same_hero = await q.evaluate("document.querySelector('.hero') && document.querySelector('.hero').className")
        check(same_hero is not None and same_hero in shown_doc, f'share link now shows the design on screen ({same_hero})')
        await c.close()
        await pg.screenshot(path=shot('02b-design-nav.png'))
        # ---------- 3. Apply now ----------
        print('== 3. approve -> Apply now')
        await pg.click('#approveBtn'); await pg.wait_for_selector('#screen-approve.on')
        check((await pg.inner_text('#payBtn')).startswith('Apply now'), 'button says Apply now')
        await pg.screenshot(path=shot('04-approve.png'))
        await pg.click('#payBtn'); await pg.wait_for_selector('#screen-thanks.on', timeout=20000)
        check('Application received' in await pg.inner_text('#screen-thanks'), 'thanks screen shown')
        await pg.screenshot(path=shot('05-applied.png'))
        check(not errs, f'client app: no page errors {errs[:2]}')
        # ---------- 4. admin ----------
        check('Sample' in await pg.inner_text('#apPre'), 'before-launch box lists the sample reviews')
        print('== 4. admin')
        r = urllib.request.Request(BASE + '/api/admin/list')
        r.add_header('User-Agent', 'Mozilla/5.0 wod-e2e')
        try: urllib.request.urlopen(r); check(False, 'admin API refuses without login')
        except urllib.error.HTTPError as e: check(e.code == 401, f'admin API refuses without login ({e.code})')
        ca = await b.new_context(viewport={'width': 1400, 'height': 900}); ad = await ca.new_page()
        await ad.goto(BASE + '/admin'); await ad.wait_for_selector('#loginBox', state='visible')
        await ad.fill('#pw', 'wrong-password'); await ad.click('#loginForm button'); await ad.wait_for_timeout(1500)
        check('Wrong password' in await ad.inner_text('#loginErr'), 'wrong password rejected')
        await ad.fill('#pw', PW); await ad.click('#loginForm button')
        await ad.wait_for_selector('#app', state='visible', timeout=15000)
        L = await ad.evaluate("fetch('/api/admin/list').then(r=>r.json())")
        sub = next((x for x in L['subs'] if x['id'] == sid), None)
        od = json.loads(sub['opts_json'] or '{}') if sub else {}; dd = json.loads(sub['data_json'] or '{}') if sub else {}
        check(od.get('design') == 1, f'server keeps the design that was on screen at Apply (opts_json design={od.get("design")})')
        check(len(dd.get('ba') or []) == 1 and all('/i/' in dd['ba'][0][k] for k in 'ba') and dd['ba'][0]['t'] == 'Bathroom refit', 'data_json keeps the before/after pair as /i/ photo URLs')
        row = ad.locator('tr', has_text=sid).first
        check('applied' in await row.inner_text(), 'admin lists the submission as applied')
        check(await ad.locator('#mails .mail').count() >= 2, 'admin shows emails that would be sent')
        await ad.screenshot(path=shot('06-admin-list.png'))
        answers = iter([SLUG, '79', 'TEST - not a real payment'])
        dialogs = []
        async def on_dialog(d):
            dialogs.append(d.message)
            if d.type == 'prompt': await d.accept(next(answers, ''))
            else: await d.accept()
        ad.on('dialog', on_dialog)
        await ad.click(f'button[data-pub="{sid}"]')
        await ad.wait_for_function("document.body.innerText.includes('Live site')", timeout=30000); await ad.wait_for_timeout(800)
        check(any('Published:' in m for m in dialogs), 'publish confirmed')
        live = f'{BASE}/s/{SLUG}'
        # ---------- 5. live site ----------
        print('== 5. live site')
        async def live_check(label, kw):
            c = await b.new_context(**kw); q = await c.new_page()
            r = await q.goto(live); await q.wait_for_selector('.site.js', timeout=20000); await q.wait_for_timeout(1500)
            html = await q.content(); txt = await q.evaluate(VIS)
            check(r.status == 200, f'{label}: live site loads (200)')
            check(await q.locator('.sample-tag').count() == 0 and await q.locator('#reviews').count() == 0 and 'Sample review' not in txt, f'{label}: no sample reviews / sample tags')
            check('From £95' in txt and '£80–£120' in txt, f'{label}: prices exactly as typed')
            check('index, follow' in html and 'noindex' not in html.split('</head>')[0], f'{label}: live page is indexable')
            check(await q.locator('[data-ba]').count() == 1, f'{label}: live site keeps the before/after slider')
            await q.evaluate(SCROLL)
            imgs = await q.evaluate("Array.from(document.querySelectorAll('img')).map(i=>i.naturalWidth)")
            check(len(imgs) > 3 and all(w > 0 for w in imgs), f'{label}: all {len(imgs)} images load')
            return c, q
        c, q = await live_check('desktop', dict(viewport={'width': 1400, 'height': 900}))
        await q.screenshot(path=shot('07-live-desktop.png'))
        await q.screenshot(path=shot('07-live-desktop-full.png'), full_page=True)
        # real enquiry form
        await q.evaluate("document.querySelector('#book').scrollIntoView()"); await q.wait_for_timeout(500)
        form = q.locator('#book form').first
        for sel, val in [('input[name=name]', 'Test Visitor'), ('input[name=phone]', '0113 000 0000'), ('input[name=email]', 'visitor@example.com')]:
            if await form.locator(sel).count(): await form.locator(sel).first.fill(val)
        async with q.expect_response(lambda r: '/api/lead/' in r.url, timeout=15000) as lr:
            await form.locator('[type=submit]').last.click()
        check((await lr.value).status == 200, 'live contact form sends an enquiry (/api/lead 200)')
        await q.wait_for_timeout(500)
        check('on its way' in await q.inner_text('.modal'), 'visitor sees "message is on its way"')
        await q.screenshot(path=shot('08-live-enquiry-sent.png'))
        await c.close()
        c, q = await live_check('mobile', dict(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True))
        await q.screenshot(path=shot('09-live-mobile.png')); await c.close()
        # ---------- 6. unpublish -> offline -> publish again ----------
        print('== 6. unpublish / re-publish')
        await ad.click('#refresh'); await ad.wait_for_timeout(1500)
        check(await ad.locator('#leads .mail').count() >= 1, 'enquiry visible in admin')
        await ad.click(f'button[data-unpub="{sid}"]')
        await ad.wait_for_function("document.body.innerText.includes('unpublished')", timeout=20000)
        c = await b.new_context(); q = await c.new_page()
        r = await q.goto(live + '?after-unpublish')
        check(r.status == 404 and 'offline' in (await q.inner_text('body')).lower(), 'unpublished site shows polite offline page')
        await q.screenshot(path=shot('10-offline-page.png'))
        answers = iter([SLUG])
        await ad.click(f'button[data-pub="{sid}"]')
        await ad.wait_for_function("document.body.innerText.includes('Live site')", timeout=30000); await ad.wait_for_timeout(1000)
        await q.wait_for_timeout(2000)
        r = await q.goto(live + '?after-republish')
        check(r.status == 200 and await q.locator('.site').count() == 1, 'site live again after re-publish')
        await c.close()
        await ad.locator(f'button[data-det="{sid}"]').click(); await ad.wait_for_timeout(500)
        await ad.screenshot(path=shot('11-admin-after.png'), full_page=True)
        await b.close()
    print('\nSHARE', share); print('LIVE', live)
    print('\nRESULT:', 'ALL PASSED' if not fails else f'{len(fails)} FAILED: ' + '; '.join(fails))
asyncio.run(main())
