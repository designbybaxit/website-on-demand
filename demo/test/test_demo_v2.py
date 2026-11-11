"""End-to-end test for the website-on-demand demo (builder v2).
Run:  /workspace/pwenv/bin/python test/test_demo.py   (from the demo folder; needs network for fonts/photos)
"""
import asyncio, base64, json, os, sys, threading, http.server, functools, io
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SHOTS = os.path.join(ROOT, 'screenshots', 'v2'); os.makedirs(SHOTS, exist_ok=True)
SITES = '/tmp/wod-sites'; os.makedirs(SITES, exist_ok=True)
PORT = 8799
INDUSTRIES = ['salon', 'clinic', 'restaurant', 'home', 'realestate', 'law']
fails = []
def check(cond, msg):
    print(('  PASS ' if cond else '  FAIL ') + msg)
    if not cond: fails.append(msg)


async def form_goto(pg, step):
    await pg.locator(f'#formSteps li[data-fs="{step}"]').click()

async def form_build(pg):
    for _ in range(6):
        if await pg.is_visible('#buildBtn'):
            await pg.click('#buildBtn')
            return
        await pg.click('#formNext')
    raise RuntimeError('build button never appeared')

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    s = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), h); threading.Thread(target=s.serve_forever, daemon=True).start(); return s

def save_dataurl(url, path):
    open(path, 'wb').write(base64.b64decode(url.split(',', 1)[1]))

async def flow(b, key, mobile, upload=False):
    print(f'\n== flow: {key} ({"mobile" if mobile else "desktop"}) ==')
    ctx = await b.new_context(viewport={'width': 390, 'height': 844} if mobile else {'width': 1400, 'height': 900},
                              device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
    pg = await ctx.new_page(); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    # validation: WhatsApp required when it is the main action
    await pg.click(f'#exChips [data-ex={key}]')
    await pg.check('input[name=mainAction][value=whatsapp]', force=True); await pg.fill('#f-wa', '')
    await form_build(pg)
    check(await pg.is_visible('[data-f=whatsapp] .err-msg'), 'WhatsApp required when main action is WhatsApp')
    await pg.click('#exChips .ex-chip')
    if upload:
        await pg.set_input_files('#photoFile', [os.path.join(HERE, 'photo1.jpg'), os.path.join(HERE, 'photo2.jpg')])
        await pg.wait_for_function("document.querySelectorAll('#photoList img').length === 2")
    await form_build(pg)
    await pg.wait_for_selector('#screen-preview.on', timeout=120000)
    log = await pg.text_content('#buildLog')
    check('Fonts embedded' in log and 'Fonts embedded: 0' not in log, 'web fonts embedded in preview picture')
    check('photos embedded' in log, 'photos embedded in preview picture')
    pv = await pg.evaluate('({mode:previews.mode, dw:previews.desktop.w, mw:previews.mobile.w, d:previews.desktop.url.slice(0,22), mh:previews.mobile.h, ms:previews.mobile.scale})')
    check(pv['mode'] == 'image', f'preview is a picture (mode={pv["mode"]})')
    check(pv['d'] == 'data:image/jpeg;base64', 'preview is a JPEG data URL')
    check(pv['dw'] == 1280 and pv['mw'] <= 585, f'sizes desktop {pv["dw"]}, mobile {pv["mw"]}x{pv["mh"]}')
    check(pv['mw'] * pv['mh'] <= 16e6, 'mobile picture under the iOS canvas limit')
    check(await pg.evaluate("!document.querySelector('.site')"), 'no site markup in the client DOM')
    url = await pg.evaluate('previews.desktop.url'); save_dataurl(url, f'/tmp/wod-pv-{key}-desktop.jpg')
    url = await pg.evaluate('previews.mobile.url'); save_dataurl(url, f'/tmp/wod-pv-{key}-mobile.jpg')
    if upload:
        # the uploaded photo must be used (hero) instead of stock
        hero_uses_upload = await pg.evaluate("(()=>{const M=buildSite(current.data,{},null,{}).M; return M.ph.hero.startsWith('data:image/jpeg') && !M.stock})()")
        check(hero_uses_upload, 'uploaded photos replace stock photos')
    await pg.screenshot(path=f'{SHOTS}/app-preview-{key}-{"m" if mobile else "d"}.png')
    await pg.click('.toggle button[data-dev=mobile]'); await pg.wait_for_timeout(300)
    check(await pg.evaluate("document.querySelector('#pvImg').naturalWidth") == pv['mw'], 'mobile toggle shows the mobile picture')
    if key == 'salon' and not mobile: await pg.screenshot(path=f'{SHOTS}/app-preview-salon-mobile-toggle.png')
    # change request loop
    await pg.click('#reqBtn'); await pg.click('#chips [data-t="Make it darker"]'); await pg.click('#rerunBtn')
    await pg.wait_for_selector('#screen-preview.on', timeout=120000)
    check(await pg.inner_text('#pvRev') == 'Version 2', 'change request builds version 2')
    check(await pg.evaluate('current.opts.dark === true'), 'darker option applied')
    # approval
    await pg.click('#approveBtn')
    pre = await pg.inner_text('#apPre'); tbl = await pg.inner_text('#priceTbl')
    check('Before launch' in pre, 'approval shows the before-launch list')
    if await pg.evaluate("current.placeholders.some(p=>/^Sample reviews/.test(p))"):
        check('Sample reviews' in pre and 'never published' in pre, 'sample reviews must be replaced or removed before launch')
    check('$79' in tbl and '$50' in tbl and '$29' in tbl, 'pricing $50 + $29/mo')
    await pg.check('input[name=dom][value=connect]'); check('$89' in await pg.inner_text('#priceTbl'), 'own domain adds $10')
    if not mobile and key == 'salon': await pg.screenshot(path=f'{SHOTS}/app-approve-salon.png', full_page=True)
    await pg.click('#payBtn'); await pg.wait_for_selector('#screen-thanks.on')
    # admin
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html#admin'); await pg.wait_for_selector('#screen-admin.on')
    await pg.click('[data-view]'); await pg.wait_for_timeout(2500)
    fr = pg.frame_locator('#smFrame')
    check(await fr.locator('.site.js').count() == 1, 'admin full site runs its script (sandboxed)')
    if not mobile and key == 'law': await pg.screenshot(path=f'{SHOTS}/app-admin-full-site.png')
    check(not errs, f'no console errors in the app {errs[:2]}')
    await ctx.close()

async def fallback(b):
    print('\n== locked-frame fallback ==')
    pg = await b.new_page(viewport={'width': 1400, 'height': 900})
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html?preview=iframe')
    await pg.click('#exChips [data-ex=home]'); await form_build(pg)
    await pg.wait_for_selector('#screen-preview.on', timeout=120000); await pg.wait_for_timeout(2500)
    check(await pg.evaluate("previews.mode") == 'frame', 'fallback uses the locked frame')
    check(await pg.evaluate("document.querySelector('#lockedFrame iframe').getAttribute('sandbox')") == '', 'locked frame is script-less')
    await pg.screenshot(path=f'{SHOTS}/app-fallback-frame.png')
    await pg.close()

async def site_checks(b):
    # write the full generated sites (what goes live), then check each one
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    docs = await pg.evaluate("Object.fromEntries(Object.keys(EXAMPLES).map(k=>[k, buildSite(EXAMPLES[k]).doc]))")
    inl = await pg.evaluate("inlineMarkup(buildSite(EXAMPLES.law,{},null,{pv:true}).markup, STYLES.law).then(r=>({unsplash:r.html.includes('https://images.unsplash'), font:/url\\(\"data:font\\/woff2|url\\(\"data:application\\/(font-)?woff2|url\\(\"data:application\\/octet-stream/.test(r.html), fonts:r.fonts}))")
    check(not inl['unsplash'] and inl['font'], f'inlined preview markup has no remote photos and embeds fonts ({inl})')
    await pg.close()
    for k, doc in docs.items():
        open(f'{SITES}/{k}.html', 'w').write(doc)
    for k in INDUSTRIES:
        print(f'\n== site: {k} ==')
        for label, vp, mob in [('desktop', {'width': 1440, 'height': 900}, False), ('mobile', {'width': 390, 'height': 844}, True)]:
            ctx = await b.new_context(viewport=vp, is_mobile=mob, has_touch=mob, device_scale_factor=2 if mob else 1)
            p = await ctx.new_page(); errs = []
            p.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); p.on('pageerror', lambda e: errs.append(str(e)))
            await p.goto(f'file://{SITES}/{k}.html', wait_until='networkidle', timeout=60000); await p.wait_for_timeout(1400)
            r = await p.evaluate("""()=>{const c=document.querySelector('.hero .btn-primary, .hero button[type=submit]'); const b=c&&c.getBoundingClientRect();
              return {sw:document.documentElement.scrollWidth, iw:innerWidth, cta:b?b.bottom:9999, ctaTop:b?b.top:9999, fonts:[...document.fonts].filter(f=>f.status==='loaded').length}}""")
            if mob:
                check(r['sw'] <= r['iw'], f'{k} mobile: no horizontal scroll ({r["sw"]} vs {r["iw"]})')
                check(r['cta'] <= 844, f'{k} mobile: main CTA above the fold (bottom {round(r["cta"])}px)')
            check(r['fonts'] > 0, f'{k} {label}: web fonts loaded')
            await p.screenshot(path=f'{SHOTS}/site-{k}-{label}-hero.png')
            # interactions: FAQ accordion + slider + menu
            if not mob:
                await p.evaluate("document.querySelector('#faq')&&document.querySelector('#faq').scrollIntoView()"); await p.wait_for_timeout(500)
                faq = p.locator('.faq-item button, .faq summary').nth(1)
                if await faq.count(): await faq.click(); await p.wait_for_timeout(300)
            check(not errs, f'{k} {label}: no console errors {errs[:2]}')
            await ctx.close()
        # reduced motion: no running animations, reveals visible
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce'); p = await ctx.new_page()
        await p.goto(f'file://{SITES}/{k}.html', wait_until='networkidle'); await p.wait_for_timeout(800)
        rm = await p.evaluate("""()=>{const anims=document.getAnimations().filter(a=>a.playState==='running' && (a.effect.getTiming().duration>20 || a.effect.getTiming().iterations===Infinity));
          const hidden=[...document.querySelectorAll('.reveal')].filter(e=>getComputedStyle(e).opacity<0.99).length; return {anims:anims.length, hidden, slider:document.querySelector('[data-slider]')?.dataset.autoplay||''}}""")
        check(rm['anims'] == 0 and rm['hidden'] == 0, f'{k}: reduced motion respected ({rm})')
        await ctx.close()
        # no JavaScript: page still readable
        ctx = await b.new_context(viewport={'width': 1280, 'height': 900}, java_script_enabled=False); p = await ctx.new_page()
        await p.goto(f'file://{SITES}/{k}.html'); await p.wait_for_timeout(500)
        nj = await p.evaluate("""()=>({hidden:[...document.querySelectorAll('.reveal, h1 .w')].filter(e=>getComputedStyle(e).opacity<0.99).length, h1:document.querySelector('h1').innerText.length})""")
        check(nj['hidden'] == 0 and nj['h1'] > 5, f'{k}: readable without JavaScript ({nj})')
        await ctx.close()

async def main():
    # two small test photos
    from PIL import Image
    for i, col in enumerate([(180, 120, 90), (60, 110, 150)]):
        p = os.path.join(HERE, f'photo{i+1}.jpg')
        if not os.path.exists(p): Image.new('RGB', (1600, 1100), col).save(p, quality=85)
    srv = serve()
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        # wipe storage once
        pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html'); await pg.evaluate('localStorage.clear()'); await pg.close()
        for k in ['salon', 'restaurant', 'law']: await flow(b, k, mobile=False)
        for k in ['clinic', 'home', 'realestate']: await flow(b, k, mobile=True, upload=(k == 'clinic'))
        await fallback(b)
        await site_checks(b)
        await b.close()
    srv.shutdown()
    print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED:\n - ' + '\n - '.join(fails)))
    sys.exit(1 if fails else 0)
asyncio.run(main())
