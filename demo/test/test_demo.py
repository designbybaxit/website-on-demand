"""End-to-end test for the website-on-demand demo (builder v3: live new-tab preview, industry-matched photos, price parser).
Run:  /workspace/pwenv/bin/python test/test_demo.py   (from the demo folder; needs network for fonts/photos)
"""
import asyncio, base64, json, os, sys, threading, http.server, functools, io
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
SHOTS = os.path.join(ROOT, 'screenshots', 'v3'); os.makedirs(SHOTS, exist_ok=True)
SITES = '/tmp/wod-sites'; os.makedirs(SITES, exist_ok=True)
PORT = 8799
INDUSTRIES = ['salon', 'clinic', 'restaurant', 'home', 'realestate', 'law', 'graphic', 'gym']
fails = []
def check(cond, msg):
    print(('  PASS ' if cond else '  FAIL ') + msg)
    if not cond: fails.append(msg)

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    s = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), h); threading.Thread(target=s.serve_forever, daemon=True).start(); return s

def save_dataurl(url, path):
    open(path, 'wb').write(base64.b64decode(url.split(',', 1)[1]))

VIS_TEXT = "(()=>{const c=document.querySelector('.site').cloneNode(true); c.querySelectorAll('script,style').forEach(e=>e.remove()); return c.textContent})()"
WRONG = r'\b(plumb\w*|boiler|leak\w*|taps?|solicitor\w*|case review|patients?|mortgage|call-out|gas safe)\b'

async def check_live_page(p, key, mobile, tag):
    """The generated site in a new tab / frame: script running, nothing watermarked, links + widgets work."""
    await p.wait_for_selector('.site.js', timeout=20000); await p.wait_for_timeout(900)
    txt = await p.evaluate(VIS_TEXT)
    check('PREVIEW ·' not in txt.upper() and 'Preview by' not in txt and await p.locator('.pv-badge').count() == 0, f'{tag}: no watermark / preview badge')
    url0 = p.url
    # in-page link scrolls without leaving the page
    if mobile and await p.locator('.burger').count():
        await p.click('.burger'); await p.wait_for_timeout(400)
        link = p.locator('#mnav a[href^="#"]').first
    else:
        link = p.locator('.hdr a[href^="#"]:not([href="#"])').nth(1)
    await link.click(); await p.wait_for_timeout(1400)
    check(p.url == url0 and await p.evaluate('scrollY') > 300, f'{tag}: menu link scrolls inside the page (url {p.url[:30]}, y {await p.evaluate("Math.round(scrollY)")})')
    # FAQ accordion
    await p.evaluate("document.querySelector('#faq').scrollIntoView()"); await p.wait_for_timeout(500)
    q = p.locator('#faq summary').nth(1)
    if await q.count():
        before = await p.evaluate("document.querySelectorAll('#faq details')[1].open"); await q.click(); await p.wait_for_timeout(400)
        check(await p.evaluate("document.querySelectorAll('#faq details')[1].open") != before, f'{tag}: FAQ opens/closes')
    # reviews slider
    if await p.locator('.rv .next').count():
        await p.evaluate("document.querySelector('#reviews').scrollIntoView()"); await p.wait_for_timeout(400)
        t0 = await p.evaluate("document.querySelector('.rv-track').style.transform"); await p.click('.rv .next'); await p.wait_for_timeout(500)
        check(await p.evaluate("document.querySelector('.rv-track').style.transform") != t0, f'{tag}: review slider moves')
    # demo form opens the "nothing sent" modal
    await p.evaluate("document.querySelector('#book').scrollIntoView()"); await p.wait_for_timeout(400)
    await p.click('#book form [type=submit]'); await p.wait_for_timeout(300)
    check(await p.evaluate("!document.querySelector('.modal').hidden"), f'{tag}: booking/contact form responds (preview modal)')

async def flow(b, key, mobile, upload=False):
    print(f'\n== flow: {key} ({"mobile" if mobile else "desktop"}) ==')
    ctx = await b.new_context(viewport={'width': 390, 'height': 844} if mobile else {'width': 1400, 'height': 900},
                              device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
    pg = await ctx.new_page(); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    await pg.select_option('#exPick', key); await pg.click('#fillExample')
    await pg.check('input[name=mainAction][value=whatsapp]', force=True); await pg.fill('#f-wa', '')
    await pg.click('#buildBtn')
    check(await pg.is_visible('[data-f=whatsapp] .err-msg'), 'WhatsApp required when main action is WhatsApp')
    await pg.click('#fillExample')
    if upload:
        await pg.set_input_files('#photoFile', [os.path.join(HERE, 'photo1.jpg'), os.path.join(HERE, 'photo2.jpg')])
        await pg.wait_for_function("document.querySelectorAll('#photoList img').length === 2")
    await pg.click('#buildBtn')
    await pg.wait_for_selector('#screen-preview.on', timeout=120000)
    log = await pg.inner_text('#bot3')
    check('new tab' in log and 'JPEG' not in log and 'watermark' not in log.lower(), 'preview bot prepares the live site (no picture, no watermark)')
    doc_ok = await pg.evaluate("!/pv-badge|PREVIEW ·|Preview<\\/span> by|Shown as a picture/i.test(previews.doc) && previews.url.startsWith('blob:')")
    check(doc_ok, 'preview document has no badge/watermark; blob fallback URL ready')
    check(await pg.get_attribute('#openPv', 'target') == '_blank' and (await pg.get_attribute('#openPv', 'href')).startswith('blob:'), 'open button is a real new-tab link (blob fallback)')
    if upload:
        r = await pg.evaluate("(()=>{const M=buildSite(current.data,{},null,{}).M; return {hero:M.ph.hero.startsWith('data:image/jpeg'), split:M.ph.split.startsWith('data:image/jpeg'), svc:M.ph.services.filter(Boolean).every(u=>/images\\.(unsplash|pexels)\\.com/.test(u)), note:M.placeholders.some(p=>/^Some sections use matched stock/.test(p))}})()")
        check(r['hero'] and r['split'], 'uploaded photos used first (hero, split)')
        check(r['svc'] and r['note'], 'remaining slots use matched stock, flagged in the before-launch list')
    # embedded live frame
    await pg.wait_for_timeout(1500)
    fr = pg.frame_locator('#liveFrame')
    check(await fr.locator('.site.js').count() == 1, 'embedded preview runs the real site')
    await pg.screenshot(path=f'{SHOTS}/app-preview-{key}-{"m" if mobile else "d"}.png')
    if key == 'graphic' and not mobile: await pg.screenshot(path=f'{SHOTS}/app-preview-step-open-button.png', clip={'x': 0, 'y': 0, 'width': 1400, 'height': 900})
    await pg.click('.toggle button[data-dev=mobile]'); await pg.wait_for_timeout(1200)
    check(await pg.evaluate("document.querySelector('#liveFrame').style.width") == '390px', 'mobile toggle shows the 390px live site')
    check(await pg.frame_locator('#liveFrame').locator('.burger').count() == 1, 'mobile frame shows the mobile header')
    if key == 'graphic' and not mobile: await pg.screenshot(path=f'{SHOTS}/app-preview-mobile-toggle.png')
    await pg.click('.toggle button[data-dev=desktop]'); await pg.wait_for_timeout(300)
    # new tab: the full working site
    async with ctx.expect_page() as pop:
        await pg.click('#openPv')
    tab = await pop.value
    terrs = []; tab.on('pageerror', lambda e: terrs.append(str(e)))
    await tab.wait_for_load_state()
    check(await tab.evaluate("!!document.querySelector('.site')"), f'new tab opened with the full site ({tab.url[:20]})')
    check((await tab.title()).startswith(await pg.evaluate('current.data.name')), 'new tab is titled with the business name')
    await check_live_page(tab, key, mobile, 'new tab')
    await tab.keyboard.press('Escape'); check(await tab.evaluate("document.querySelector('.modal').hidden"), 'new tab: preview modal closes with Escape')
    await tab.evaluate("document.documentElement.style.scrollBehavior='auto'; scrollTo(0,0)"); await tab.wait_for_timeout(1500)
    await tab.screenshot(path=f'{SHOTS}/newtab-{key}-{"m" if mobile else "d"}.png')
    check(not terrs, f'new tab: no script errors {terrs[:2]}')
    await tab.close()
    check('new tab' in await pg.inner_text('#pvOpened'), 'app confirms the tab opened')
    # change request loop
    await pg.click('#reqBtn'); await pg.click('#chips [data-t="Make it darker"]'); await pg.click('#rerunBtn')
    await pg.wait_for_selector('#screen-preview.on', timeout=120000)
    check(await pg.inner_text('#pvRev') == 'Version 2', 'change request builds version 2')
    check(await pg.evaluate('current.opts.dark === true'), 'darker option applied')
    check(await pg.evaluate("/is-dark/.test(previews.doc)"), 'new preview document reflects the change')
    # approval
    await pg.click('#approveBtn')
    pre = await pg.inner_text('#apPre'); tbl = await pg.inner_text('#priceTbl')
    check('Before launch' in pre, 'approval shows the before-launch list')
    check(await pg.locator('#apThumb iframe').count() == 1 and (await pg.get_attribute('#apOpen', 'href')).startswith('blob:'), 'approval shows the approved version + open link')
    if await pg.evaluate("current.placeholders.some(p=>/^Sample reviews/.test(p))"):
        check('Sample reviews' in pre and 'never published' in pre, 'sample reviews must be replaced or removed before launch')
    check('$79' in tbl and '$50' in tbl and '$29' in tbl, 'pricing $50 + $29/mo')
    await pg.evaluate("document.querySelector('input[name=dom][value=connect]').scrollIntoView({block:'center'})"); await pg.check('input[name=dom][value=connect]'); check('$89' in await pg.inner_text('#priceTbl'), 'own domain adds $10')
    if not mobile and key == 'salon': await pg.wait_for_timeout(1200); await pg.screenshot(path=f'{SHOTS}/app-approve-salon.png', full_page=True)
    await pg.click('#payBtn'); await pg.wait_for_selector('#screen-thanks.on')
    # admin
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html#admin'); await pg.wait_for_selector('#screen-admin.on')
    await pg.click('[data-view]'); await pg.wait_for_timeout(2500)
    check(await pg.frame_locator('#smFrame').locator('.site.js').count() == 1, 'admin full site runs its script (sandboxed)')
    check(not errs, f'no console errors in the app {errs[:2]}')
    await ctx.close()

PRICE_CASES = [('100', '$', 'From $100'), ('$100', '$', 'From $100'), ('£1,250', '£', 'From £1,250'), ('100.50', '$', 'From $100.50'),
    ('from 80', '€', 'From €80'), ('80-120', '$', '$80–$120'), ('100 per hour', '$', '$100 per hour'), ('£45/hr', '£', '£45 per hour'),
    ('35 per month', '£', '£35 per month'), ('30 – 45', 'AED ', 'AED 30–AED 45'), ('Free quote', '$', 'Free quote'), ('POA', '£', 'POA'),
    ('2,100', '£', 'From £2,100'), ('10+', '$', 'From $10'), ('99 each', '$', '$99 each'), ('', '$', '')]

async def unit_checks(b):
    print('\n== price parser ==')
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    for raw, cur, want in PRICE_CASES:
        got = await pg.evaluate('([r,c])=>priceText(r,c)', [raw, cur])
        check(got == want, f'priceText({raw!r}, {cur!r}) = {got!r} (want {want!r})')
    check(await pg.evaluate("priceNum('£1,250')") == 1250 and await pg.evaluate("priceNum('100.50')") == 100.5 and await pg.evaluate("priceNum('80-120')") == 80, 'priceNum reads the starting number')
    print('\n== industry matching ==')
    cases = {'graphic': 'graphic', 'gym': 'gym', 'home': 'plumbing', 'clinic': 'dental', 'law': 'law', 'salon': 'salon', 'restaurant': 'restaurant', 'realestate': 'realestate'}
    for ex, want in cases.items():
        got = await pg.evaluate(f"detectProfile(EXAMPLES.{ex}).k"); check(got == want, f'{ex} example matches profile {want} (got {got})')
    free = {'Wedding photographer in Leeds': 'photo', 'Yoga and pilates studio': 'yoga', 'Mobile car valeting': 'carwash', 'Bookkeeping & tax returns': 'accountant',
            'Dog grooming salon': 'pets', 'Web design agency': 'web', 'Electrician': 'electric', 'Bakery and cake shop': 'bakery', 'Maths tutoring': 'tutor', 'Barber shop': 'barber'}
    for txt, want in free.items():
        got = await pg.evaluate("t=>detectProfile({name:'Test Co',industry:'other',industryOther:t,about:'',services:[]}).k", txt)
        check(got == want, f'"{txt}" -> {want} (got {got})')
    # every curated profile image appears only on its own industry
    n = await pg.evaluate("PROFILES.length"); check(n >= 25, f'{n} curated industry profiles')
    for ex in ['graphic', 'gym']:
        r = await pg.evaluate("""k=>{const B=buildSite(EXAMPLES[k]), M=B.M, P=M.prof; const own=p=>{const x=LIB.photos[p.k]||{pool:[],heroes:[]}; return new Set([p.hero,p.split,p.about,p.contact,...p.gallery,...p.pool.map(x=>x[0]),...x.pool.map(y=>y[0]),...(x.heroes||[])].filter(Boolean));};
          const ids=own(P); const used=[...new Set([...B.doc.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>photoKey(m[1])))];
          const pids=[...own(PROFILES.find(p=>p.k==='plumbing'))].filter(id=>!ids.has(id));
          return {used:used.length, foreign:used.filter(id=>!ids.has(id)), plumb:used.filter(id=>pids.includes(id)), svcImgs:M.ph.services.filter(Boolean).length, svc:M.services.length, prices:M.services.map(s=>s.priceT), heroRepeat:M.ph.services.filter(u=>u===M.ph.hero).length}}""", ex)
        check(not r['foreign'] and not r['plumb'], f'{ex}: all {r["used"]} photos come from its own curated set (foreign {r["foreign"]})')
        check(r['svcImgs'] == r['svc'] and r['heroRepeat'] == 0, f'{ex}: every service card has its own photo (not the hero)')
        print('   prices:', r['prices'])
    g = await pg.evaluate("buildSite(EXAMPLES.graphic).M.services.map(s=>s.priceT)")
    check(g == ['From $100', 'From $450', 'From $1,200', '$80–$120', '$100 per hour'], f'graphic design prices render right {g}')
    await pg.close()


LIB_JS = r"""(()=>{
  const sig = M => ({kit:M.kit.id, hero:M.heroV, services:M.V.services, why:M.V.why, order:M.design.orderIx, gallery:M.V.gallery, reviews:M.V.reviews, about:M.V.about, book:M.V.book, cta:M.V.cta, faq:M.V.faq, process:M.V.process, footer:M.V.footer, photo:M.ph.heroId});
  const imgs = doc => [...doc.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>photoKey(m[1]));
  const dups = doc => { const a=imgs(doc); return [...new Set(a.filter((x,i)=>a.indexOf(x)!==i))]; };
  const fam = (base, names) => names.map(n => { const B = buildSite({...EXAMPLES[base], name:n}); return {name:n, sig:sig(B.M), dups:dups(B.doc), n:imgs(B.doc).length}; });
  const pairs = list => { const out=[]; for (let i=0;i<list.length;i++) for (let j=i+1;j<list.length;j++) { const a=list[i].sig, b=list[j].sig; out.push([list[i].name, list[j].name, Object.keys(a).filter(k=>a[k]!==b[k]).length]); } return out; };
  const dental = fam('clinic', ['Bright Smile Dental','Oakwood Family Dentistry','Harbour Dental Care','Pearl Dental Clinic','Meadow Lane Dental']);
  const plumb = fam('home', ['Swift Flow Plumbing','Redline Heating & Plumbing','A1 Pipeworks','Northside Plumbers','BlueTap Plumbing & Heating']);
  const same = Object.keys(EXAMPLES).every(k => buildSite(EXAMPLES[k]).doc === buildSite(JSON.parse(JSON.stringify(EXAMPLES[k]))).doc);
  const sameCase = JSON.stringify(sig(buildSite({...EXAMPLES.clinic, name:'Pearl Dental Clinic'}).M)) === JSON.stringify(sig(buildSite({...EXAMPLES.clinic, name:'  pearl dental clinic '}).M));
  const exDups = Object.fromEntries(Object.keys(EXAMPLES).map(k => [k, dups(buildSite(EXAMPLES[k]).doc)]));
  const reshuf = ['clinic','home','salon','restaurant'].map(k => { const a=sig(buildSite(EXAMPLES[k],{}).M), b=sig(buildSite(EXAMPLES[k],{design:1}).M); return Object.keys(a).filter(x=>a[x]!==b[x]).length; });
  const live = Object.keys(EXAMPLES).map(k => buildSite(EXAMPLES[k], {}, null, {live:true, leadUrl:'https://x/api/lead'}).doc).filter(d => /class="sample-tag"|Sample review|Sample figures|Sample photos/.test(d)).length;
  const kitsPer = Object.fromEntries(Object.values(LIB.industries).map(r => [r.id, r.kits.length]));
  const variants = Object.fromEntries(Object.entries(LIB.sections).map(([k,v]) => [k, Object.keys(v).length]));
  return {dental, plumb, dp:pairs(dental), pp:pairs(plumb), same, sameCase, exDups, reshuf, live, kitsPer, variants};
})()"""

async def library_checks(b):
    print('\n== template library ==')
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    r = await pg.evaluate(LIB_JS); await pg.close()
    check(r['same'], 'same business data always builds the identical page (deterministic)')
    check(r['sameCase'], 'name case / spacing does not change the design')
    for fam in ['dental', 'plumb']:
        for x in r[fam]: print(f"   {x['name']:<28} {x['sig']['kit']:<16} {x['sig']['hero']:<10} svc={x['sig']['services']:<6} why={x['sig']['why']:<7} order#{x['sig']['order']} gallery={x['sig']['gallery']} reviews={x['sig']['reviews']} imgs={x['n']}")
        low = [p for p in r[fam[0] + 'p'] if p[2] < 3]
        check(not low, f'{fam}: 5 businesses get visibly different designs (every pair differs in >=3 of kit/hero/sections/order/photo; min {min(p[2] for p in r[fam[0]+"p"])}) {low[:2]}')
        check(all(not x['dups'] for x in r[fam]), f'{fam}: no photo repeats on any page {[x["dups"] for x in r[fam] if x["dups"]][:1]}')
        check(len({x['sig']['kit'] for x in r[fam]}) >= 2 and len({x['sig']['hero'] for x in r[fam]}) >= 2, f'{fam}: at least 2 kits and 2 hero layouts across 5 businesses')
    check(not any(r['exDups'].values()), f'no photo repeats on any example page {r["exDups"]}')
    check(all(n >= 2 for n in r['reshuf']), f'"Show me another design" (opts.design) changes the design {r["reshuf"]}')
    check(r['live'] == 0, 'live (published) pages never carry sample tags')
    check(all(n >= 3 for n in r['kitsPer'].values()), f'>=3 style kits per priority industry {r["kitsPer"]}')
    v = r['variants']; check(v['hero'] >= 3 and sum(1 for k in ['services','why','stats','gallery','reviews','process','faq','cta','book','footer','about'] if v.get(k, 0) >= 2) >= 10, f'variant registry: {v}')

RESEARCH_JS = r"""(()=>{
  const C = EXAMPLES.clinic, px = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const ns = doc => doc.replace(/<script[\s\S]*?<\/script>/g, '');
  const sec = (doc, id) => { const m = doc.match(new RegExp('<section[^>]*id="' + id + '"[\\s\\S]*?</section>')); return m ? m[0] : ''; };
  const noEm = { ...C, about: 'Meadow Lane Dental is an independent practice in York with unhurried appointments.', services: C.services.filter(s => !/emergenc/i.test(s.name + s.desc)), hours: 'Mon–Fri: 8am–6pm\nSaturday: 9am–1pm' };
  const withInfobar = d => { for (let i = 0; i < 40; i++) { const B = buildSite(d, { design: i }); if (B.M.order.includes('infobar')) return B; } return null; };
  const a = withInfobar(noEm), b = withInfobar({ ...noEm, about: noEm.about + ' We see emergency patients the same day.' });
  const plain = buildSite(noEm), ins = buildSite({ ...noEm, insurance: 'NHS & private patients\nWe accept Bupa, AXA and Denplan\n0% finance over 12 months' });
  const ba = buildSite({ ...noEm, ba: [{ b: px, a: px.replace('CYII', 'CYIJ'), t: 'Whitening' }] });
  const baHalf = buildSite({ ...noEm, ba: [{ b: px, a: '', t: 'x' }] });
  const baFood = buildSite({ ...EXAMPLES.restaurant, ba: [{ b: px, a: px, t: 'x' }] });
  const baSec = sec(ba.doc, 'beforeafter'), insSec = sec(ins.doc, 'insurance');
  const baImgs = [...baSec.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1]);
  // headline variety: 20 dental and 20 plumbing businesses with neutral details
  const names = ['Bright','Oak','Harbour','Pearl','Meadow','Cedar','Willow','River','Park','Hill','Stone','North','South','Kings','Queens','Abbey','Grove','Bridge','Castle','Elm'];
  const share = (base, suf, about) => { const h = names.map(n => buildSite({ ...EXAMPLES[base], name: n + suf, about }).M.h1); let s = 0, t = 0; for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) { t++; if (h[i] === h[j]) s++; } return { rate: s / t, distinct: new Set(h).size }; };
  const wk = weekHours([['Mon–Thu', '8am–7pm'], ['Friday', '8am–4pm'], ['Saturday', '9am–1pm'], ['Sunday', 'Closed']]);
  return {
    plainOrder: plain.M.order, insOrder: ins.M.order,
    noInsSec: !/id="insurance"/.test(plain.doc), noBaSec: !/data-ba/.test(ns(plain.doc)) && !/id="beforeafter"/.test(plain.doc),
    insShown: !!insSec, insPlans: ['Bupa', 'AXA', 'Denplan'].every(n => insSec.includes(n)), insNoLogos: !/<img/.test(insSec), insAsk: /Ask about coverage/.test(insSec),
    baShown: /data-ba/.test(baSec), baOnlyClient: baImgs.length >= 2 && baImgs.every(u => u.startsWith('data:image/png')), baHalfHidden: !/data-ba/.test(ns(baHalf.doc)), baFoodHidden: !/data-ba/.test(ns(baFood.doc)),
    baLive: /data-ba/.test(buildSite({ ...noEm, ba: [{ b: 'https://x.test/i/a', a: 'https://x.test/i/b', t: 'W' }] }, {}, null, { live: true, leadUrl: 'https://x/api/lead' }).doc),
    infobarFound: !!a && !!b, ibNoEm: a ? !!sec(a.doc, 'infobar') && !/Emergency/i.test(sec(a.doc, 'infobar')) : null,
    ibEm: b ? /Emergency/i.test(sec(b.doc, 'infobar')) : null,
    ibToday: a ? /data-today=/.test(a.doc) : null,
    week: wk, dental: share('clinic', ' Dental', 'A dental practice in town with a friendly team.'), plumb: share('home', ' Plumbing', 'A plumbing firm covering the city and nearby towns.'),
  };
})()"""

async def research_checks(b):
    print('\n== dental research sections ==')
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    r = await pg.evaluate(RESEARCH_JS); await pg.close()
    check(r['noInsSec'] and r['noBaSec'], f'no insurance or before/after section without client data ({r["plainOrder"]})')
    check(r['insShown'] and r['insPlans'] and r['insNoLogos'] and r['insAsk'], f'insurance section from client facts: plan names as text, no logos, "Ask about coverage" bar ({r["insOrder"]})')
    check(r['baShown'] and r['baOnlyClient'], 'before/after slider only shows the client\'s own uploaded pairs')
    check(r['baHalfHidden'] and r['baFoodHidden'], 'no slider for half a pair, or for industries where it makes no sense')
    check(r['baLive'], 'before/after with hosted (/i/) photos stays on the published site')
    check(r['infobarFound'] and r['ibNoEm'] is True and r['ibEm'] is True, f'quick-action strip: emergency line only when the client offers emergencies ({r["ibNoEm"]}, {r["ibEm"]})')
    check(r['ibToday'], "quick-action strip carries the week's hours for 'today'")
    check(r['week'] == ['Closed', '8am–7pm', '8am–7pm', '8am–7pm', '8am–7pm', '8am–4pm', '9am–1pm'], f'weekHours reads ranges ({r["week"]})')
    for k in ['dental', 'plumb']:
        check(r[k]['rate'] <= 0.12 and r[k]['distinct'] >= 10, f'{k}: 20 businesses rarely share a headline (pair share {r[k]["rate"]:.3f}, {r[k]["distinct"]} distinct)')

async def research_flow(b):
    print('\n== before/after upload + design back/forward (demo) ==')
    ctx = await b.new_context(viewport={'width': 1400, 'height': 900}); pg = await ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    await pg.select_option('#exPick', 'restaurant'); await pg.click('#fillExample')
    check(not await pg.is_visible('#baField'), 'before/after upload hidden for restaurants')
    await pg.select_option('#exPick', 'clinic'); await pg.click('#fillExample')
    check(await pg.is_visible('#baField') and await pg.is_visible('#f-insurance'), 'before/after upload and insurance field shown for clinics')
    F = os.path.join(HERE, 'fixtures')
    await pg.set_input_files('#baBefore', os.path.join(F, 'ba-before-1.jpg')); await pg.wait_for_function("!!baDraft.b")
    check(await pg.is_disabled('#baAdd'), 'Add pair waits for both photos')
    await pg.set_input_files('#baAfter', os.path.join(F, 'ba-after-1.jpg')); await pg.wait_for_function("!!baDraft.a")
    await pg.fill('#baLabel', 'Whitening'); await pg.click('#baAdd')
    check(await pg.locator('#baList figure').count() == 1, 'pair added to the form')
    await pg.fill('#f-insurance', 'NHS & private patients\nWe accept Bupa and Denplan')
    await pg.click('#buildBtn'); await pg.wait_for_selector('#screen-preview.on', timeout=120000)
    d = await pg.evaluate("({n:current.data.ba.length, t:current.data.ba[0].t, jpg:current.data.ba[0].b.startsWith('data:image/jpeg'), ins:current.data.insurance})")
    check(d['n'] == 1 and d['t'] == 'Whitening' and d['jpg'] and 'Bupa' in d['ins'], f'form data carries the pair and insurance text {d}')
    fr = pg.frame_locator('#liveFrame')
    await pg.wait_for_timeout(1200)
    check(await fr.locator('[data-ba]').count() == 1 and await fr.locator('#insurance').count() == 1, 'preview shows the before/after slider and insurance section')
    src = await fr.locator('[data-ba] .ba-a').get_attribute('src')
    check(src.startswith('data:image/jpeg'), 'slider shows the uploaded after photo (not stock)')
    await fr.locator('[data-ba] .ba-r').evaluate("r=>{r.value=20; r.dispatchEvent(new Event('input'))}")
    check((await fr.locator('[data-ba]').evaluate("e=>e.style.getPropertyValue('--pos')")) == '20%', 'dragging the slider moves the split')
    # design back / forward
    check(await pg.inner_text('#dPos') == 'Design 1 of 1' and await pg.is_disabled('#dPrev'), 'design nav starts at "Design 1 of 1", Previous disabled')
    docs = [await pg.evaluate('previews.doc')]
    for want in ['Design 2 of 2', 'Design 3 of 3']:
        await pg.click('#dNext'); await pg.wait_for_function(f"document.querySelector('#dPos').textContent === '{want}' && !designBusy", timeout=30000)
        docs.append(await pg.evaluate('previews.doc'))
    check(len(set(docs)) == 3, 'each "next design" builds a different page')
    await pg.click('#dPrev'); await pg.wait_for_function("document.querySelector('#dPos').textContent === 'Design 2 of 3' && !designBusy", timeout=30000)
    back = await pg.evaluate("({d:current.opts.design, same: previews.doc === buildSite(current.data, cleanOpts(current.opts), null, {}).doc})")
    check(back['d'] == 1 and back['same'] and (await pg.evaluate('previews.doc')) == docs[1], f'"Previous design" returns to the exact earlier design {back}')
    check(await pg.inner_text('#dNext') == 'Next design →', 'forward button reads "Next design" when later designs exist')
    check(await pg.locator('#chips [data-t="Show me another design"]').count() == 1, '"Show me another design" chip kept')
    await pg.click('#approveBtn'); await pg.wait_for_timeout(600)
    check((await pg.evaluate("document.querySelector('#apThumb iframe').srcdoc")) == docs[1], 'approval shows the design that was on screen')
    await pg.fill('#payEmail', 'test@example.com'); await pg.click('#payBtn'); await pg.wait_for_selector('#screen-thanks.on')
    st = await pg.evaluate(f"JSON.parse(localStorage.getItem(STORE_KEY))[0]")
    check(st['opts'].get('design') == 1 and len(st['data']['ba']) == 1, f'saved request keeps design #2 and the pair (design {st["opts"].get("design")})')
    check(not errs, f'no script errors {errs[:2]}')
    await ctx.close()

INDUSTRY_JS = r"""(()=>{
  const sig = M => ({kit:M.kit.id, hero:M.heroV, services:M.V.services, menu:M.V.menu, why:M.V.why, gallery:M.V.gallery, reviews:M.V.reviews, about:M.V.about, book:M.V.book, process:M.V.process, order:M.design.orderIx, photo:M.ph.heroId, ind:M.design.industry});
  const imgs = doc => [...doc.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => photoKey(m[1]));
  const dups = doc => { const a = imgs(doc); return [...new Set(a.filter((x, i) => a.indexOf(x) !== i))]; };
  const own = k => { const p = PROFILES.find(x => x.k === k); const x = LIB.photos[k] || {pool:[], heroes:[]}; return new Set([p.hero, p.split, p.about, p.contact, ...(p.gallery||[]), ...p.pool.map(y => y[0]), ...x.pool.map(y => y[0]), ...(x.heroes||[])].filter(Boolean)); };
  const forbid = new Set([...own('dental'), ...own('plumbing'), ...own('electric')]);
  const base = (name, trade, extra) => ({ name, industry:'other', industryOther:trade, country:'UK', city:'Leeds', about:'A small independent team.', phone:'0113 496 0000', email:'hi@example.com', mainAction:/salon|barber|spa/i.test(trade) ? 'book' : 'quote', hours:'Mon–Fri: 9am–6pm', address:'1 Sample Street, Leeds', services:[{name:'Standard visit', desc:'The usual appointment. About 50 minutes.', price:'£60'}, {name:'Longer visit', price:'80-120'}, {name:'Ask first', price:'Free quote'}], ...extra });
  const batch = (trade, names) => names.map(n => { const B = buildSite(base(n, trade)); return { sig:sig(B.M), dups:dups(B.doc), prices:B.M.services.map(s => s.priceT), dur:/50 min/.test(B.doc), prof:B.M.prof.k }; });
  const pairs = list => { let min = 99; for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const a = list[i].sig, b = list[j].sig; const d = Object.keys(a).filter(k => a[k] !== b[k]).length; if (d < min) min = d; } return min; };
  const names = ['Alpha Works','Bravo & Co','Cedar Lane','North House','Elm Street'];
  const trades = ['Hair salon','Barber shop','Day spa and massage','Plumber','Electrician','House cleaning','Office cleaning','Pressure washing'];
  const varied = Object.fromEntries(trades.map(t => { const list = batch(t, names.map(n => n + ' ' + t.split(' ')[0])); return [t, { prof:list[0].prof, ind:list[0].sig.ind, min:pairs(list), kits:new Set(list.map(x => x.sig.kit)).size, heroes:new Set(list.map(x => x.sig.hero)).size, dups:list.some(x => x.dups.length), prices:list[0].prices, dur:list.every(x => x.dur) }]; }));
  const alias = (trade, extra) => detectProfile({ name:'Test Co', industry:'other', industryOther:trade, about:'', services:[], ...extra }).k;
  const aliases = {
    barber: alias('Barber shop'), barbershop: alias('Gents barbershop'), spa: alias('Day spa and massage'), salon: alias('Hair salon'),
    nails: alias('Nail bar'), electric: alias('Electrician in Leeds'), sparky: alias('Sparky and rewires'), plumber: alias('Emergency plumber'),
    house: alias('House cleaning service'), office: alias('Office and commercial cleaning'), pressure: alias('Pressure washing driveways'), power: alias('Power wash and soft wash'),
  };
  const dropdown = {
    electric: detectProfile({ name:'Bright Spark Electrical', industry:'home', industryOther:'', about:'', services:[{name:'Rewire', desc:'Full rewire'}] }).k,
    cleaning: detectProfile({ name:'Sparkle Cleaning', industry:'home', industryOther:'', about:'', services:[{name:'Domestic clean'}] }).k,
    pressure: detectProfile({ name:'Kerb Pressure Washing', industry:'home', industryOther:'', about:'', services:[{name:'Driveway wash'}] }).k,
    plumbing: detectProfile(EXAMPLES.home).k,
  };
  const customD = { name:'Willow Baskets', industry:'other', industryOther:'Underwater basket weaving', country:'UK', city:'York', about:'We weave baskets to order.', phone:'01904 000000', email:'hi@example.com', mainAction:'quote', hours:'Mon–Fri: 9am–5pm', address:'1 Lane, York', services:[{name:'Custom basket', desc:'Woven to order in about 2 hours.', price:'£45'}, {name:'Repair', price:'18'}, {name:'Note', price:'Free quote'}] };
  const custom = buildSite(customD), empty = buildSite({ name:'', industry:'other', industryOther:'', about:'', services:[{name:'General help', price:'40'}], country:'UK', city:'York', phone:'01904000000', mainAction:'quote' });
  const used = imgs(custom.doc);
  const live = buildSite(customD, {}, null, { live:true, leadUrl:'https://x/api/lead' }).doc;
  const again = buildSite(JSON.parse(JSON.stringify(customD)), { design:2 }).doc;
  const first = buildSite(customD, { design:2 }).doc;
  const other = buildSite(customD, { design:1 }).doc;
  const office = buildSite(base('Desk Co', 'Office cleaning', { about:'Commercial office cleaning for workplaces.', services:[{name:'Office clean', price:'99'}, {name:'Restroom clean', price:'40'}, {name:'Floor care', price:'55'}] }));
  const house = buildSite(base('Desk Co', 'House cleaning', { about:'Regular domestic cleaning for houses and apartments.', services:[{name:'Home clean', price:'99'}, {name:'Kitchen clean', price:'40'}, {name:'Bathroom clean', price:'55'}] }));
  const keys = PROFILES.map(p => p.k);
  const kept = ['graphic','marketing','web','it','photo','events','accountant','consult','gym','yoga','physio','medical','dental','salon','barber','spa','restaurant','cafe','bakery','cleaning','garden','electric','roofing','build','plumbing','auto','carwash','realestate','interior','architect','law','tutor','pets','retail'];
  return {
    varied, aliases, dropdown, kept: kept.every(k => keys.includes(k)), n: keys.length,
    customProf: custom.M.prof.k, emptyProf: empty.M.prof.k,
    customForeign: used.filter(id => forbid.has(id)),
    customHas: { hero: /id="hero-title"/.test(custom.doc), services: /id="services"|id="menu"/.test(custom.doc), book: /id="book"/.test(custom.doc), prices: ['From £45','From £18','Free quote'].every(p => custom.doc.includes(p)), dur: /2 hrs/.test(custom.doc) },
    emptyHas: { hero: /id="hero-title"/.test(empty.doc), book: /id="book"/.test(empty.doc) },
    liveClean: !/class="sample-tag"|Sample review|Sample figures|Sample photos/.test(live),
    persist: first === again && first !== other,
    photoSplit: office.M.ph.heroId !== house.M.ph.heroId,
    recipes: ['salon','barber','spa','plumbing','electric','cleaning','pressure','local'].every(id => LIB.industries[id] && LIB.industries[id].kits.length >= 3),
    restaurant: LIB.industries.restaurant && LIB.industries.restaurant.profiles.includes('restaurant'),
  };
})()"""

async def industry_library_checks(b):
    print('\n== industry design library ==')
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    r = await pg.evaluate(INDUSTRY_JS); await pg.close()
    check(r['kept'] and r['n'] >= 34, f'all original industry profiles kept ({r["n"]})')
    want_alias = {'barber':'barber','barbershop':'barber','spa':'spa','salon':'salon','nails':'salon','electric':'electric','sparky':'electric','plumber':'plumbing','house':'cleaning','office':'cleaning','pressure':'pressure','power':'pressure'}
    bad_alias = {k: r['aliases'][k] for k, want in want_alias.items() if r['aliases'][k] != want}
    check(not bad_alias, f'industry aliases {bad_alias or r["aliases"]}')
    check(r['dropdown'] == {'electric':'electric','cleaning':'cleaning','pressure':'pressure','plumbing':'plumbing'}, f'dropdown text overrides the coarse home choice when it clearly names a trade {r["dropdown"]}')
    for trade, row in r['varied'].items():
        check(row['min'] >= 3 and not row['dups'] and row['kits'] >= 2 and row['heroes'] >= 2, f'{trade}: varied designs (min {row["min"]}, kits {row["kits"]}, heroes {row["heroes"]}, dups {row["dups"]}, {row["prof"]}/{row["ind"]})')
        check(row['prices'] == ['From £60', '£80–£120', 'Free quote'] and row['dur'], f'{trade}: exact prices and a typed duration {row["prices"]}')
    check(r['customProf'] == 'local' and r['emptyProf'] == 'local' and not r['customForeign'], f'unknown and empty trades use the neutral pool, not dental/plumbing/electrical photos {r["customProf"]} {r["customForeign"]}')
    check(all(r['customHas'].values()) and all(r['emptyHas'].values()), f'fallback pages are complete and keep typed prices/durations {r["customHas"]} {r["emptyHas"]}')
    check(r['liveClean'] and r['persist'] and r['photoSplit'], f'live sample strip, design persistence, office vs home photos {r["liveClean"]} {r["persist"]} {r["photoSplit"]}')
    check(r['recipes'] and r['restaurant'], 'split recipes each have 3+ kits and the restaurant recipe is unchanged')

async def site_checks(b):
    # write the full generated sites (what goes live), then check each one
    pg = await b.new_page(); await pg.goto(f'http://127.0.0.1:{PORT}/demo.html')
    docs = await pg.evaluate("Object.fromEntries(Object.keys(EXAMPLES).map(k=>[k, buildSite(EXAMPLES[k]).doc]))")
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
            txt = await p.evaluate(VIS_TEXT)
            if k in ('graphic', 'gym'):
                import re as _re
                bad = sorted(set(m.lower() for m in _re.findall(WRONG, txt, _re.I)) - ({'solicitor', 'solicitors', 'case review'} if k == 'law' else set()) - ({'patient', 'patients'} if k == 'clinic' else set()) - ({'mortgage'} if k == 'realestate' else set()))
                check(not bad, f'{k} {label}: no wrong-industry words ({bad})')
            imgs = await p.evaluate("""()=>{const all=[...document.querySelectorAll('.site img')]; all.forEach(i=>i.loading='eager'); return all.length}""")
            await p.wait_for_timeout(600)
            broken = await p.evaluate("""async()=>{const all=[...document.querySelectorAll('.site img')]; await Promise.all(all.map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r; setTimeout(r,8000)}))); return all.filter(i=>!i.naturalWidth).map(i=>i.src.slice(0,80))}""")
            check(imgs >= 10 and not broken, f'{k} {label}: {imgs} images, all load ({broken[:2]})')
            await p.screenshot(path=f'{SHOTS}/site-{k}-{label}-hero.png')
            if not mob:
                for sec in ['services', 'about', 'gallery', 'process', 'book', 'menu']:
                    if await p.locator(f'#{sec}').count():
                        await p.evaluate(f"document.querySelector('#{sec}').scrollIntoView()"); await p.wait_for_timeout(900)
                        await p.screenshot(path=f'{SHOTS}/site-{k}-{sec}.png')
                await p.evaluate("scrollTo(0,0)"); await p.wait_for_timeout(300)
            else:
                await p.screenshot(path=f'{SHOTS}/site-{k}-mobile-full.png', full_page=True)
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
        await unit_checks(b)
        await library_checks(b)
        await industry_library_checks(b)
        await research_checks(b)
        await research_flow(b)
        if os.environ.get('FAST'): await b.close(); srv.shutdown(); print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED:\n - ' + '\n - '.join(fails))); sys.exit(1 if fails else 0)
        for k in ['graphic', 'salon', 'restaurant', 'law']: await flow(b, k, mobile=False)
        for k in ['gym', 'clinic', 'home', 'realestate']: await flow(b, k, mobile=True, upload=(k == 'clinic'))
        await site_checks(b)
        await b.close()
    srv.shutdown()
    print('\n' + ('ALL PASSED' if not fails else f'{len(fails)} FAILED:\n - ' + '\n - '.join(fails)))
    sys.exit(1 if fails else 0)
asyncio.run(main())
