/* =====================================================================
   PREMIUM VARIANTS from the dental reference research
   (library/references/dental/SYNTHESIS.md). Our own code and words only:
   no theme code, text or images. Same contract as v-hero.js / v-sections.js.
   New sections (each hides itself when the client gave no data for it):
     infobar     quick actions under the hero (call / today's hours / book, emergency only if offered)
     beforeafter drag-to-compare slider, ONLY with the client's own uploaded pairs (d.ba)
     insurance   insurance & payment options, ONLY from facts the client typed
   ===================================================================== */

/* ---------- 1. quick-action strip (B3 / B2) ---------- */
function infoItems(M) {
  const it = [], ph = M.d.phone;
  if (M.emergency && ph) it.push({ k: 'emerg', icon: 'bolt', small: 'Emergency? Call us', big: ph, href: telHref(ph) });
  else if (ph && M.primary.kind !== 'call') it.push({ k: 'call', icon: 'phone', small: 'Call us', big: ph, href: telHref(ph) });
  if (M.hours.length) it.push({ k: 'hours', icon: 'clock', small: M.hours[0][0] || 'Opening hours', big: M.hours[0][1], href: '#book', week: M.week });
  it.push({ k: 'book', icon: M.primary.kind === 'wa' ? 'phone' : M.ctaKey === 'quote' ? 'doc' : 'calendar', small: M.primary.kind === 'form' ? (M.ctaKey === 'quote' ? 'No obligation' : M.ctaKey === 'reserve' ? 'Reserve online' : 'Book online') : M.primary.kind === 'wa' ? 'Message us' : 'Talk to us', big: M.primary.short, href: M.primary.href, wa: M.primary.kind === 'wa' });
  if (M.emergency && ph && M.primary.kind !== 'call' && it.length < 4) it.splice(1, 0, { k: 'call', icon: 'phone', small: 'General enquiries', big: ph, href: telHref(ph) });
  return it.slice(0, 4);
}
const infoCell = (x, cls = '') => `<a class="ib-i ${cls} ib-${x.k}" href="${hh(x.href)}"${x.wa ? ' target="_blank" rel="noopener"' : ''}><span class="ib-ico">${svgI(x.icon)}</span><span class="ib-t"><small${x.week ? ' data-today-label' : ''}>${hh(x.small)}</small><b${x.week ? ` data-today='${hh(JSON.stringify(x.week))}'` : ''}>${hh(x.big)}</b></span></a>`;
registerVariant('infobar', 'tiles', {
  label: 'Coloured tiles attached under the hero: call / today\'s hours / book (+ emergency line if offered)',
  html: M => { const it = infoItems(M); return `<section id="infobar" class="ib-tiles" aria-label="Quick contact"><div class="wrap"><div class="ib-row n${it.length}">${it.map((x, i) => infoCell(x, 't' + (i % 2))).join('')}</div></div></section>`; },
  css: M => `.site .ib-tiles{position:relative;z-index:2}
.site .ib-row{display:grid;grid-template-columns:repeat(var(--n,3),1fr);border-radius:0 0 var(--radius) var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.site .ib-row.n2{--n:2}.site .ib-row.n3{--n:3}.site .ib-row.n4{--n:4}
.site .ib-i{display:flex;align-items:center;gap:.9rem;padding:1.35rem 1.5rem;text-decoration:none;background:var(--deep);color:#fff;transition:filter .3s,transform .4s var(--ease)}
.site .ib-i.t1{background:var(--brand);color:${lumC(M.P.brand) > .55 ? '#141414' : '#fff'}}
.site .ib-i.ib-emerg{background:${M.P.dark ? '#7a1f1f' : '#b42318'};color:#fff}
.site .ib-ico{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.14);flex:none}
.site .ib-t small{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
.site .ib-t b{display:block;font-size:1.05rem;line-height:1.3}
@media (hover:hover) and (pointer:fine){.site .ib-i:hover{filter:brightness(1.1)}}
@media (max-width:820px){.site .ib-row,.site .ib-row.n3,.site .ib-row.n4{grid-template-columns:1fr 1fr}.site .ib-row.n3 .ib-i:last-child{grid-column:1/-1}.site .ib-i{padding:1rem}.site .ib-ico{width:38px;height:38px}.site .ib-t b{font-size:.95rem}}`,
});
registerVariant('infobar', 'float', {
  label: 'White rounded bar overlapping the hero edge, icon items split by hairlines',
  html: M => { const it = infoItems(M); return `<section id="infobar" class="ib-float" aria-label="Quick contact"><div class="wrap"><div class="ib-bar reveal n${it.length}">${it.map(x => infoCell(x)).join('')}</div></div></section>`; },
  css: M => `.site .ib-float{position:relative;z-index:3;margin-top:-2.6rem}
.site .ib-bar{display:grid;grid-template-columns:repeat(var(--n,3),1fr);background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) + 10px);box-shadow:var(--shadow);padding:.5rem}
.site .ib-bar.n2{--n:2}.site .ib-bar.n3{--n:3}.site .ib-bar.n4{--n:4}
.site .ib-bar .ib-i{display:flex;align-items:center;gap:.85rem;padding:1rem 1.2rem;text-decoration:none;color:var(--text);border-radius:var(--radius);transition:background-color .3s}
.site .ib-bar .ib-i + .ib-i{border-left:1px solid var(--line)}
.site .ib-bar .ib-ico{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--accent-text);flex:none}
.site .ib-bar .ib-emerg .ib-ico{background:#fde2e1;color:#b42318}
.site .ib-bar small{display:block;font-size:12px;color:var(--muted)}.site .ib-bar b{display:block;line-height:1.3}
@media (hover:hover) and (pointer:fine){.site .ib-bar .ib-i:hover{background:var(--soft)}}
@media (max-width:820px){.site .ib-float{margin-top:-1.4rem}.site .ib-bar,.site .ib-bar.n3,.site .ib-bar.n4{grid-template-columns:1fr 1fr}.site .ib-bar .ib-i{padding:.8rem}.site .ib-bar .ib-i + .ib-i{border-left:0}.site .ib-bar.n3 .ib-i:last-child{grid-column:1/-1}}`,
});

/* ---------- 2. before / after (G1 / G2): client's own photo pairs only ---------- */
function baSlider(M, p, i, big) {
  const t = p.t ? ': ' + p.t : '';
  return `<div class="ba${big ? ' ba-big' : ''} ba-frame" data-ba style="--pos:50%"><img class="ba-a" src="${uattr(p.a)}" alt="${hh(M.name + ', after' + t)}" loading="lazy" width="1200" height="900">
<div class="ba-b"><img src="${uattr(p.b)}" alt="${hh(M.name + ', before' + t)}" loading="lazy" width="1200" height="900"></div>
<span class="ba-tag ba-tb">Before</span><span class="ba-tag ba-ta">After</span><span class="ba-h" aria-hidden="true"><i>${svgI('arrow')}</i></span>
<input class="ba-r" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after${hh(t)}"></div>`;
}
const baNote = M => M.fam === 'dental' || M.fam === 'health' ? `Real results from ${M.name}. Every patient is different, and results vary.` : M.fam === 'beauty' ? `Real results from ${M.name}. Results vary from person to person.` : `Real work by ${M.name}.`;
const baPicker = M => M.ba.length > 1 ? `<div class="ba-pick" role="group" aria-label="Choose a result">${M.ba.map((p, i) => `<button type="button" class="ba-p${i ? '' : ' is-on'}" aria-pressed="${i ? 'false' : 'true'}" data-b="${uattr(p.b)}" data-a="${uattr(p.a)}" data-t="${hh(p.t || 'Result ' + (i + 1))}"><img src="${uattr(p.a)}" alt="" width="120" height="90" loading="lazy"><span>${hh(p.t || 'Result ' + (i + 1))}</span></button>`).join('')}</div>` : '';
const baCSS = M => `.site .ba{position:relative;overflow:hidden;border-radius:calc(var(--radius) + 6px);aspect-ratio:4/3;background:var(--soft);box-shadow:var(--shadow);user-select:none;touch-action:pan-y}
.site .ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.site .ba-b{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--pos)) 0 0)}
.site .ba-h{position:absolute;top:0;bottom:0;left:var(--pos);width:3px;margin-left:-1.5px;background:#fff;pointer-events:none}
.site .ba-h i{position:absolute;top:50%;left:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:#fff;color:#111;display:grid;place-items:center;box-shadow:0 8px 30px rgba(0,0,0,.25)}
.site .ba-h .i{width:20px;height:20px}
.site .ba-tag{position:absolute;top:1rem;padding:.35rem .7rem;border-radius:999px;font:700 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;background:rgba(0,0,0,.55);color:#fff;pointer-events:none}
.site .ba-tb{left:1rem}.site .ba-ta{right:1rem}
.site .ba-r{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0;-webkit-appearance:none;appearance:none}
.site .ba-r:focus-visible + *,.site .ba:focus-within{outline:3px solid var(--accent);outline-offset:3px}
.site .ba-pick{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem}
.site .ba-p{display:flex;align-items:center;gap:.5rem;border:1px solid var(--line);background:var(--surface);color:var(--text);border-radius:999px;padding:.3rem .8rem .3rem .3rem;font:600 13px var(--sans);cursor:pointer}
.site .ba-p img{width:34px;height:34px;border-radius:50%;object-fit:cover}
.site .ba-p.is-on{border-color:var(--brand);box-shadow:0 0 0 2px var(--brand) inset}
.site .ba-note{font-size:13px;opacity:.75;margin-top:.9rem}`;
registerVariant('beforeafter', 'band', {
  label: 'Full-width brand band with one big drag-to-compare slider (client photos only)',
  html: M => `<section id="beforeafter" class="section ba-band"><div class="wrap"><div class="head reveal"><p class="eyebrow">${hh(M.C.eyebrow.beforeafter || 'Before & after')}</p><h2>${headHTML(M.C.h2.beforeafter || 'See the *difference.*')}</h2><p>Drag the handle to compare.</p></div>
<div class="ba-wrap reveal">${baSlider(M, M.ba[0], 0, true)}${baPicker(M)}<p class="ba-note">${hh(baNote(M))}</p></div></div></section>`,
  css: M => baCSS(M) + `.site .ba-band{background:var(--deep);color:#fff}.site .ba-band h2{color:#fff}.site .ba-band h2 em{color:var(--accent)}.site .ba-band .eyebrow{color:var(--accent)}.site .ba-band .head p{color:rgba(255,255,255,.75)}
.site .ba-wrap{max-width:980px;margin:0 auto}.site .ba-big{aspect-ratio:16/10}
.site .ba-band .ba-p{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff}.site .ba-band .ba-p.is-on{box-shadow:0 0 0 2px var(--accent) inset}
@media (max-width:640px){.site .ba-big{aspect-ratio:4/3.4}}`,
});
registerVariant('beforeafter', 'side', {
  label: 'Text and a note card beside the slider (client photos only)',
  html: M => `<section id="beforeafter" class="section alt"><div class="wrap ba-side"><div class="ba-copy"><p class="eyebrow reveal">${hh(M.C.eyebrow.beforeafter || 'Before & after')}</p><h2 class="reveal">${headHTML(M.C.h2.beforeafter || 'See the *difference.*')}</h2>
<p class="reveal">These are ${M.ba.length > 1 ? M.ba.length + ' ' : ''}real ${M.fam === 'dental' ? 'patient results' : 'results'} from ${hh(M.name)}. Drag the handle to compare.</p>${baPicker(M)}<p class="ba-note reveal">${hh(baNote(M))}</p>${btnPrimary(M, 'reveal')}</div>
<div class="reveal">${baSlider(M, M.ba[0], 0, false)}</div></div></section>`,
  css: M => baCSS(M) + `.site .ba-side{display:grid;grid-template-columns:.85fr 1.15fr;gap:3.5rem;align-items:center}.site .ba-copy h2{font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 1rem}.site .ba-copy > p{color:var(--muted)}.site .ba-copy .btn{margin-top:1.4rem}
@media (max-width:1000px){.site .ba-side{grid-template-columns:1fr;gap:2rem}}`,
});

/* ---------- 3. insurance & payment (P5): client facts only ---------- */
const covBar = M => `<div class="cov reveal"><p><b>Questions about your cover?</b> Ask us before you book.</p><div class="cov-a">${M.d.phone ? `<a class="btn btn-light" href="${telHref(M.d.phone)}">${svgI('phone')} ${hh(M.d.phone)}</a>` : ''}${M.primary.kind === 'form' ? `<a class="btn btn-ghost" href="#book">Ask about coverage</a>` : ''}</div></div>`;
const insPlans = M => M.ins.plans.length ? `<div class="ins-plans reveal"><small>Plans we accept</small><div>${M.ins.plans.map(n => `<span>${hh(n)}</span>`).join('')}</div></div>` : '';
const insCSS = `.site .ins-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem}
.site .ins-f{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.5rem}
.site .section.alt .ins-f{background:var(--bg)}
.site .ins-f .ib-ico{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--soft);color:var(--accent-text);margin-bottom:1rem}
.site .ins-f h3{font-size:1.2rem;margin-bottom:.35rem}.site .ins-f p{color:var(--muted);font-size:15px}
.site .ins-plans{margin-top:1.4rem;padding:1.2rem 1.4rem;border:1px dashed var(--line);border-radius:var(--radius);display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
.site .ins-plans small{font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:12px;color:var(--muted)}
.site .ins-plans div{display:flex;gap:.5rem;flex-wrap:wrap}
.site .ins-plans span{padding:.45rem .9rem;border-radius:999px;background:var(--surface);border:1px solid var(--line);font-weight:700;font-size:14px}
.site .cov{margin-top:1.4rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;background:var(--deep);color:#fff;border-radius:calc(var(--radius) + 4px);padding:1.3rem 1.6rem}
.site .cov p{color:rgba(255,255,255,.85)}.site .cov b{color:#fff}
.site .cov-a{display:flex;gap:.6rem;flex-wrap:wrap}
.site .cov .btn-ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.3);color:#fff}`;
registerVariant('insurance', 'cards', {
  label: 'Feature cards from the client\'s payment facts + accepted plans strip + "questions about cover?" bar',
  html: M => `<section id="insurance" class="section alt"><div class="wrap">${head(M, 'insurance')}<div class="ins-grid">${M.ins.features.map(f => `<div class="ins-f reveal"><span class="ib-ico">${svgI(f.icon)}</span><h3>${hh(f.t)}</h3><p>${hh(f.b)}</p></div>`).join('')}</div>${insPlans(M)}${covBar(M)}</div></section>`,
  css: M => insCSS,
});
registerVariant('insurance', 'split', {
  label: 'Heading + coverage card left, payment facts as a list right',
  html: M => `<section id="insurance" class="section"><div class="wrap ins-split"><div><p class="eyebrow reveal">${hh(M.C.eyebrow.insurance)}</p><h2 class="reveal">${headHTML(M.C.h2.insurance)}</h2>${covBar(M)}</div>
<div><ul class="ins-list">${M.ins.features.map(f => `<li class="reveal"><span class="ib-ico">${svgI(f.icon)}</span><div><h3>${hh(f.t)}</h3><p>${hh(f.b)}</p></div></li>`).join('')}</ul>${insPlans(M)}</div></div></section>`,
  css: M => insCSS + `.site .ins-split{display:grid;grid-template-columns:.9fr 1.1fr;gap:3.5rem;align-items:start}.site .ins-split h2{font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 .4rem}
.site .ins-list{list-style:none;margin:0;padding:0;display:grid}.site .ins-list li{display:grid;grid-template-columns:52px 1fr;gap:1rem;padding:1.3rem 0;border-bottom:1px solid var(--line)}
.site .ins-list .ib-ico{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--accent-text)}.site .ins-list h3{font-size:1.15rem;margin-bottom:.25rem}.site .ins-list p{color:var(--muted)}
@media (max-width:1000px){.site .ins-split{grid-template-columns:1fr;gap:1.6rem}}`,
});

/* ---------- 4. Dentara-style premium pieces ---------- */
registerVariant('services', 'feature', {
  label: 'Large treatment photo cards with frosted labels and an outline icon; last tile is a call-to-action card', fits: notFood,
  html: M => { const n = M.services.length;
    const cards = M.services.map((s, i) => { const nm = svcName(s.name);
      const dur = svcDuration(s);
      return `<article class="ft reveal${M.ph.services[i] ? '' : ' no-img'}">${M.ph.services[i] ? `<img src="${uattr(M.ph.services[i])}" alt="${hh(nm)}" loading="lazy" width="640" height="420">` : ''}<span class="ft-wm" aria-hidden="true">${svgI(s.icon)}</span>
<div class="ft-lab"><h3>${hh(nm)}</h3>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}<div class="ft-f">${s.priceT ? `<span class="price">${hh(s.priceT)}</span>` : ''}${dur ? `<span class="dur">${hh(dur)}</span>` : ''}${svcLink(M, nm)}</div></div></article>`; }).join('');
    const one = M.U.svcLabel.toLowerCase();
    const cta = `<div class="ft ft-cta reveal"><h3>${headHTML(`Not sure which ${one} you *need?*`)}</h3><p>Tell us what's on your mind and we'll help you choose.</p>${btnPrimary(M, 'btn-light').replace('btn btn-primary btn-light', 'btn btn-light')}</div>`;
    return `<section id="services" class="section"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="feat${n % 2 ? ' odd' : ''}">${cards}${n % 2 ? cta : ''}</div>${n % 2 ? '' : `<div class="feat-after reveal">${btnPrimary(M, 'btn-lg')}</div>`}</div></section>`; },
  css: M => `.site .feat{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.site .ft{position:relative;min-height:400px;border-radius:calc(var(--radius) + 6px);overflow:hidden;background:var(--soft);display:flex;align-items:flex-end;padding:1rem;isolation:isolate}
.site .ft > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.2s var(--ease)}
.site .ft-wm{position:absolute;right:1.2rem;top:1.2rem;width:84px;height:84px;color:#fff;opacity:.75;z-index:-1}
.site .ft-wm .i{width:100%;height:100%;stroke-width:1}
.site .ft.no-img .ft-wm{color:var(--accent-text);opacity:.25}
.site .ft-lab{width:100%;background:rgba(255,255,255,.78);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);color:#14201c;border-radius:var(--radius);padding:1.2rem 1.3rem;border:1px solid rgba(255,255,255,.6)}
.site .ft-lab h3{font-size:1.35rem;color:#14201c}.site .ft-lab p{color:#3d4a45;font-size:14.5px;margin-top:.3rem}
.site .ft-f{display:flex;gap:.5rem 1.2rem;align-items:center;flex-wrap:wrap;margin-top:.6rem}.site .ft-f .price{font-weight:800}.site .ft-lab .link{color:#14201c}
.site .ft-cta{background:linear-gradient(140deg,var(--brand),var(--deep));color:#fff;flex-direction:column;align-items:flex-start;justify-content:flex-end;gap:.8rem;padding:2rem}
.site .ft-cta h3{color:#fff;font-size:clamp(1.6rem,3vw,2.2rem)}.site .ft-cta h3 em{color:var(--accent)}.site .ft-cta p{color:rgba(255,255,255,.82)}
.site .feat-after{text-align:center;margin-top:2rem}
@media (hover:hover) and (pointer:fine){.site .ft:hover > img{transform:scale(1.06)}}
@media (max-width:760px){.site .feat{grid-template-columns:1fr}.site .ft{min-height:330px}}`,
});
registerVariant('process', 'stairs', {
  label: 'Staircase: three steps rising left to right, pill step tags and thin vertical rules',
  html: M => `<section id="process" class="section"><div class="wrap">${head(M, 'process')}<ol class="stairs">${M.steps.map((s, i) => `<li class="reveal" style="--k:${i}"><span class="st-tag">Step ${String(i + 1).padStart(2, '0')}</span><h3>${hh(s[0])}</h3><p>${hh(s[1])}</p></li>`).join('')}</ol><div class="stairs-cta reveal">${btnPrimary(M, 'btn-lg')}</div></div></section>`,
  css: M => `.site .stairs{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem;align-items:end}
.site .stairs li{position:relative;padding:0 0 0 1.4rem;border-left:1px solid var(--line);margin-bottom:calc((2 - var(--k)) * 4.5rem)}
.site .stairs li::before{content:"";position:absolute;left:-5px;top:0;width:9px;height:9px;border-radius:50%;background:var(--brand)}
.site .st-tag{display:inline-block;padding:.35rem .85rem;border-radius:999px;background:var(--soft);color:var(--accent-text);font:700 12px var(--sans);letter-spacing:.1em;text-transform:uppercase}
.site .stairs h3{font-size:clamp(1.4rem,2.4vw,1.9rem);margin:1rem 0 .5rem}.site .stairs p{color:var(--muted);max-width:30ch}
.site .stairs li:last-child .st-tag{background:var(--btn);color:var(--on-btn)}
.site .stairs-cta{margin-top:3rem;text-align:center}
@media (max-width:820px){.site .stairs{grid-template-columns:1fr;gap:2rem}.site .stairs li{margin-bottom:0}}`,
});
registerVariant('reviews', 'bento', {
  label: 'Mixed bento wall: one dark and one brand card, light cards and a photo tile with the main action',
  needs: () => ({ rv: 1 }),
  html: M => { const R = M.reviews.slice(0, 5);
    const card = (r, i) => `<blockquote class="rb rb${i} reveal"><span class="stars" aria-label="5 out of 5">★★★★★</span><p>${hh(r.q)}</p><footer><span class="av" aria-hidden="true">${hh(r.n.trim()[0] || '★')}</span><cite>${hh(r.n)}</cite></footer>${r.sample ? `<span class="sample-tag">${SAMPLE_REVIEW}</span>` : ''}</blockquote>`;
    const photo = M.ph.rv ? `<div class="rb rb-ph reveal"><img src="${uattr(M.ph.rv)}" alt="" loading="lazy" width="800" height="1000"><div><b>${hh(M.C.h2.cta.replace(/\*/g, ''))}</b>${btnPrimary(M).replace('btn btn-primary', 'btn btn-light')}</div></div>` : '';
    return `<section id="reviews" class="section alt"><div class="wrap">${head(M, 'reviews', R[0].sample ? '' : 'In their own words.')}<div class="rbento n${R.length}">${R.slice(0, 2).map(card).join('')}${photo}${R.slice(2).map((r, i) => card(r, i + 2)).join('')}</div></div></section>`; },
  css: M => `.site .rbento{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;grid-auto-flow:dense}
.site .rb{margin:0;border-radius:calc(var(--radius) + 4px);padding:1.6rem;display:flex;flex-direction:column;gap:.9rem;background:var(--bg);border:1px solid var(--line);position:relative}
.site .rb p{font:400 1.08rem/1.5 ${M.S.em === 'italic' ? (M.S.italic || 'var(--display)') : 'var(--sans)'}}
.site .rb0{background:var(--deep);color:#fff;border-color:transparent;grid-row:span 2;justify-content:flex-end}.site .rb0 p{font-size:1.35rem}
.site .rb1{background:var(--brand);color:${lumC(M.P.brand) > .55 ? '#141414' : '#fff'};border-color:transparent}
.site .rb .stars{color:var(--star,#f5b301);letter-spacing:.1em}
.site .rb footer{display:flex;align-items:center;gap:.6rem;font-weight:700;font-size:14px;margin-top:auto}.site .rb cite{font-style:normal}
.site .rb .av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--accent-text);font-weight:800}
.site .rb-ph{padding:0;overflow:hidden;min-height:320px;grid-row:span 2;justify-content:flex-end;color:#fff;isolation:isolate}
.site .rb-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.site .rb-ph::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.72))}
.site .rb-ph div{padding:1.5rem;display:grid;gap:.8rem;justify-items:start}.site .rb-ph b{font:500 1.4rem/1.2 var(--display)}
.site .rb .sample-tag{align-self:flex-start}
@media (max-width:1000px){.site .rbento{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.site .rbento{grid-template-columns:1fr}.site .rb0,.site .rb-ph{grid-row:auto}}`,
});
registerVariant('footer', 'watermark', {
  label: 'Light footer with a huge faint logo-mark watermark behind the columns',
  html: M => footerHTML(M).replace('<footer class="footer"><div class="wrap">', `<footer class="footer foot-wm"><span class="wm" aria-hidden="true">${hh(M.d.logo ? M.initials : M.logoBold)}</span><div class="wrap">`),
  css: M => `.site .foot-wm{position:relative;overflow:hidden;background:${M.P.dark ? 'var(--surface)' : 'var(--soft)'};color:var(--muted);border-top:1px solid var(--line)}
.site .foot-wm .wm{position:absolute;left:50%;bottom:-.18em;transform:translateX(-50%);font:700 clamp(8rem,24vw,22rem)/1 var(--display);letter-spacing:-.04em;color:var(--text);opacity:.05;white-space:nowrap;pointer-events:none}
.site .foot-wm .wrap{position:relative}
.site .foot-wm .brand,.site .foot-wm h4,.site .foot-wm a:hover{color:var(--text)}
.site .foot-wm .logo-mark{background:var(--btn);color:var(--on-btn)}
.site .foot-wm .foot-base{border-color:var(--line)}
.site .foot-wm .foot-base a{color:var(--accent-text);text-decoration:underline;text-underline-offset:2px}`,
});

/* ---------- 5. heroes H1 / H2 / H4 / H6 / H7 ---------- */
const factChip = (c, cls = '') => `<div class="gchip ${cls}"><span class="chip-ico">${svgI(c[0])}</span><div><small>${hh(c[1])}</small><b>${hh(c[2])}</b></div></div>`;
const gchipCSS = `.site .gchip{display:flex;align-items:center;gap:.7rem;padding:.75rem 1rem;border-radius:calc(var(--radius) * .7 + 6px);background:rgba(10,14,18,.55);color:#fff;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.site .gchip small{display:block;font-size:12px;opacity:.8}.site .gchip b{display:block;line-height:1.25}
.site .gchip .chip-ico{background:var(--accent);color:var(--deep)}`;
registerVariant('hero', 'bento', {
  label: 'Bento hero: brand-colour text tile + big photo tile with glass fact chips',
  html: M => { const p = heroParts(M);
    return `<section class="hero hero-bento" ${p.lbl}><div class="wrap hb-grid"><div class="hb-text hero-dark">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>
<div class="hb-photo">${p.heroImg('', 1100, 1000)}<div class="hb-chips">${p.chipData.map((c, i) => factChip(c, 'c' + i)).join('')}</div>${spinBadge(M, 'hb-badge')}</div></div></section>`; },
  css: M => heroDarkCSS + gchipCSS + `.site .hero-bento{padding:1.4rem 0 3.5rem}
.site .hb-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:1rem;min-height:620px}
.site .hb-text{border-radius:calc(var(--radius) + 10px);padding:3.4rem 3rem;background:radial-gradient(120% 90% at 0% 0%,${rgba(/^#/.test(M.P.accent) ? M.P.accent : '#ffffff', .22)},transparent 60%),linear-gradient(150deg,var(--brand),var(--deep));display:flex;flex-direction:column;justify-content:center;color:#fff}
.site .hb-text .lead{max-width:34rem}
.site .hb-photo{position:relative;border-radius:calc(var(--radius) + 10px);overflow:hidden;background:var(--soft)}
.site .hb-photo img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.06)}
.site .hb-chips{position:absolute;right:1.2rem;bottom:1.2rem;display:grid;gap:.6rem;justify-items:end}
.site .hb-chips .gchip{transition:opacity .8s var(--ease),transform .9s var(--spring)}
.site .hb-chips .c1{transition-delay:.15s}.site .hb-chips .c2{transition-delay:.3s}
.site.js:not(.ready) .hb-chips .gchip{opacity:0;transform:translateY(24px)}
.site .hb-badge{left:1.2rem;top:1.2rem}
@media (max-width:1000px){.site .hb-grid{grid-template-columns:1fr;min-height:0}.site .hb-photo{min-height:380px}}
@media (max-width:640px){.site .hero-bento{padding:.8rem 0 2.4rem}.site .hb-text{padding:2rem 1.3rem}.site .hb-photo{min-height:260px}.site .hb-chips .gchip:not(.c0){display:none}}`,
});
registerVariant('hero', 'framed', {
  label: 'Framed hero card: one big rounded gradient card, copy left, round photo in a glow ring, fact cards stacked right',
  html: M => { const p = heroParts(M);
    return `<section class="hero hero-framed" ${p.lbl}><div class="wrap"><div class="fr-card"><div class="fr-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}</div>
<div class="fr-mid"><span class="fr-glow" aria-hidden="true"></span><div class="fr-ph shape-me">${p.heroImg('', 800, 800)}</div>${spinBadge(M, 'fr-badge')}</div>
<div class="fr-side">${p.chipData.map((c, i) => `<div class="fr-stat" style="--i:${i}"><span class="chip-ico">${svgI(c[0])}</span><div><small>${hh(c[1])}</small><b>${hh(c[2])}</b></div></div>`).join('')}</div></div></div></section>`; },
  css: M => `.site .hero-framed{padding:1.2rem 0 3.5rem}
.site .fr-card{position:relative;display:grid;grid-template-columns:1.15fr .95fr .7fr;gap:2rem;align-items:center;padding:3.6rem 3rem;border-radius:calc(var(--radius) * 1.4 + 12px);background:linear-gradient(135deg,var(--soft),${M.P.dark ? 'var(--surface)' : '#ffffff'} 55%,var(--warm));overflow:hidden;border:1px solid var(--line)}
.site .fr-copy h1{font-size:clamp(2.5rem,4.6vw,4.1rem)}
.site .fr-mid{position:relative;display:grid;place-items:center}
.site .fr-glow{position:absolute;width:92%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,var(--accent),transparent 68%);opacity:.45;filter:blur(10px);animation:s-glow 7s ease-in-out infinite alternate}
@keyframes s-glow{to{transform:scale(1.08);opacity:.6}}
.site .fr-ph{position:relative;width:100%;aspect-ratio:1/1;border-radius:50%;overflow:hidden;border:10px solid ${M.P.dark ? 'var(--surface)' : '#fff'};box-shadow:var(--shadow);transition:transform 1.2s var(--spring),opacity 1s var(--ease)}
.site.js:not(.ready) .fr-ph{transform:scale(.85);opacity:0}
.site .fr-ph img{width:100%;height:100%;object-fit:cover}
.site .fr-badge{right:-4%;top:-4%}
.site .fr-side{display:grid;gap:.8rem}
.site .fr-stat{display:flex;gap:.7rem;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:.9rem 1rem;box-shadow:0 18px 40px -26px rgba(0,0,0,.35);transition:transform .9s var(--spring),opacity .8s var(--ease);transition-delay:calc(var(--i) * 140ms + 400ms)}
.site.js:not(.ready) .fr-stat{opacity:0;transform:translateX(26px)}
.site .fr-stat small{display:block;font-size:12px;color:var(--muted)}.site .fr-stat b{display:block;line-height:1.25}
@media (prefers-reduced-motion:reduce){.site .fr-glow{animation:none}}
@media (max-width:1100px){.site .fr-card{grid-template-columns:1.1fr .9fr}.site .fr-side{grid-column:1/-1;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}}
@media (max-width:760px){.site .hero-framed{padding:.6rem 0 2.4rem}.site .fr-card{grid-template-columns:1fr;padding:2rem 1.3rem;gap:1.6rem}.site .fr-mid{max-width:260px;margin:0 auto}.site .fr-side{display:none}}`,
});
registerVariant('hero', 'blob', {
  label: 'Full-bleed photo with a big soft blob holding the copy; a round badge with one real number (or the rotating stamp)',
  html: M => { const p = heroParts(M);
    const st = M.facts.find(f => f.stat && /^\d{1,4}$/.test(String(f.stat.v)));
    const badge = st ? `<div class="bl-num" aria-label="${hh(st.stat.v + st.stat.suf + ' ' + st.stat.l)}"><b>${hh(st.stat.v + st.stat.suf)}</b><small>${hh(st.k === 'since' ? 'established' : st.stat.l.split(' ').slice(0, 2).join(' '))}</small></div>` : spinBadge(M, 'bl-badge');
    return `<section class="hero hero-blob" ${p.lbl}><div class="bgimg" aria-hidden="true">${p.heroImg('', 1600, 1000)}</div>
<div class="wrap"><div class="bl-shape"><div class="bl-in">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>${badge}</div></div></section>`; },
  css: M => `.site .hero-blob{min-height:min(800px,100vh);display:grid;align-items:center;padding:4rem 0}
.site .hero-blob .bgimg{position:absolute;inset:0;z-index:-2;overflow:hidden}
.site .hero-blob .bgimg img{width:100%;height:100%;object-fit:cover;object-position:70% center;transform:translateY(var(--py-img,0px)) scale(1.04)}
.site .bl-shape{position:relative;width:min(640px,100%);padding:4.2rem 4rem 4.6rem;background:${M.P.dark ? rgba(/^#/.test(M.P.bg) ? M.P.bg : '#111111', .9) : rgba(/^#/.test(M.P.bg) ? M.P.bg : '#ffffff', .93)};border-radius:62% 38% 55% 45%/48% 58% 42% 52%;box-shadow:var(--shadow);transition:border-radius 1.6s var(--ease),transform 1.2s var(--spring),opacity 1s var(--ease);animation:s-blob2 18s ease-in-out infinite}
@keyframes s-blob2{0%,100%{border-radius:62% 38% 55% 45%/48% 58% 42% 52%}50%{border-radius:48% 52% 44% 56%/58% 46% 54% 42%}}
.site.js:not(.ready) .bl-shape{transform:scale(.92);opacity:0}
.site .bl-in h1{font-size:clamp(2.4rem,4.8vw,4rem)}
.site .bl-num{position:absolute;right:-1.5rem;bottom:1.5rem;width:132px;height:132px;border-radius:50%;background:var(--surface);box-shadow:var(--shadow);display:grid;place-content:center;text-align:center;border:6px solid var(--accent)}
.site .bl-num b{font:600 2rem/1 var(--display)}.site .bl-num small{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);max-width:90px}
.site .bl-badge{right:-1rem;bottom:1rem}
@media (prefers-reduced-motion:reduce){.site .bl-shape{animation:none}}.site.pv .bl-shape{animation:none}
@media (max-width:760px){.site .hero-blob{min-height:0;padding:12rem 0 2.6rem}.site .hero-blob .bgimg{bottom:auto;height:15rem}.site .bl-shape{padding:2rem 1.4rem;border-radius:28px;animation:none}.site .bl-num{width:96px;height:96px;right:.6rem;top:-3.2rem;bottom:auto}.site .bl-num b{font-size:1.5rem}.site .bl-badge{display:none}}`,
});
function bookCard(M) {
  return `<form class="qcard reveal" data-quote data-demo-form novalidate><h3>${hh(M.C.cta.book || 'Book a visit')}</h3><p class="sub">Two quick steps. We'll confirm by phone or email.</p><div class="qsteps"><span class="on"></span><span></span></div>
<div class="qpane" data-step="1"><label>${hh(M.U.svcLabel)}<select name="service" data-service>${svcOptions(M)}<option>Not sure yet</option></select></label><label>When suits you?<select name="when"><option>As soon as possible</option><option>This week</option><option>Next week</option><option>I'm flexible</option></select></label><button type="button" class="btn btn-primary btn-block" data-next>Continue ${svgI('arrow')}</button></div>
<div class="qpane" data-step="2" hidden><div class="row2"><label>Name<input type="text" name="name" autocomplete="name" placeholder="Your name"></label><label>Mobile<input name="phone" type="tel" autocomplete="tel" placeholder="Your number"></label></div><label>Email <span style="font-weight:400;opacity:.7">(optional)</span><input name="email" type="email" autocomplete="email" placeholder="you@email.com"></label>
<div class="qnav"><button type="button" class="btn btn-ghost" data-back>Back</button><button class="btn btn-primary" type="submit">${hh(M.U.bookSubmit)}</button></div></div>${honey()}<p class="fine" style="margin-top:.9rem">Preview: nothing is sent until the site goes live.</p></form>`;
}
registerVariant('hero', 'booking', {
  label: 'Tinted full-bleed photo, copy left, two-step booking card right (booking businesses)',
  fits: c => ['dental', 'health', 'beauty', 'wellness', 'pets', 'fitness'].includes(c.fam),
  html: M => { const p = heroParts(M);
    const side = M.primary.kind === 'form' && M.ctaKey === 'book' && M.services.length ? bookCard(M) : heroSide(M, p);
    return `<section class="hero hero-booking hero-dark" ${p.lbl}><div class="bgimg" aria-hidden="true">${p.heroImg('', 1600, 1000)}</div>
<div class="wrap hero-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>${side}</div></section>`; },
  css: M => heroDarkCSS + factStackCSS + `.site .hero-booking{padding:5rem 0 5.5rem;background:var(--deep)}
.site .hero-booking .bgimg{position:absolute;inset:0;z-index:-2;overflow:hidden}
.site .hero-booking .bgimg img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.05)}
.site .hero-booking::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(100deg,${rgba(/^#/.test(M.P.deep) ? M.P.deep : '#0b2530', .94)} 0%,${rgba(/^#/.test(M.P.deep) ? M.P.deep : '#0b2530', .78)} 50%,${rgba(/^#/.test(M.P.brand) ? M.P.brand : '#0b7f99', .45)})}
.site .hero-booking .hero-grid{grid-template-columns:1.1fr .9fr}
.site .hero-booking .qcard{max-width:440px;justify-self:end;width:100%}
@media (max-width:640px){.site .hero-booking{padding:2.4rem 0 3rem}.site .hero-booking .fact-stack{display:none}}`,
});
registerVariant('hero', 'field', {
  label: 'Flat brand-colour field, copy left, tall arch photo right, a white service panel overlapping the bottom edge',
  html: M => { const p = heroParts(M);
    const tiles = M.services.slice(0, 4).map(s => `<a class="fd-t" href="#${M.order.includes('menu') ? 'menu' : 'services'}"><span class="chip-ico">${svgI(s.icon)}</span><span>${hh(svcName(s.name))}</span></a>`).join('');
    return `<section class="hero hero-field" ${p.lbl}><div class="fd-bg" aria-hidden="true"></div><div class="wrap hero-grid"><div class="hero-copy hero-dark">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>
<div class="fd-arch"><div class="fd-ph">${p.heroImg('', 900, 1125)}</div>${spinBadge(M, 'fd-badge')}</div></div>${tiles ? `<div class="wrap"><nav class="fd-panel" aria-label="${hh(M.U.nav)}">${tiles}</nav></div>` : ''}</section>`; },
  css: M => heroDarkCSS + `.site .hero-field{padding:4.5rem 0 0;background:var(--bg)}
.site .fd-bg{position:absolute;left:0;right:0;top:0;bottom:4.5rem;z-index:-1;background:var(--deep)}
.site .fd-bg::after{content:"";position:absolute;right:-8%;top:-20%;width:46%;aspect-ratio:1;border-radius:50%;background:var(--brand);opacity:.35;filter:blur(2px)}
.site .hero-field .hero-grid{grid-template-columns:1.1fr .9fr;align-items:end}
.site .hero-field .hero-copy{padding-bottom:7rem}
.site .fd-arch{position:relative;justify-self:end;width:min(440px,100%)}
.site .fd-ph{aspect-ratio:4/5;border-radius:999px 999px 0 0;overflow:hidden;background:var(--soft);transform-origin:bottom;transition:transform 1.3s var(--ease),opacity 1s}
.site.js:not(.ready) .fd-ph{transform:scaleY(.86);opacity:0}
.site .fd-ph img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.05)}
.site .fd-badge{left:-12%;top:18%}
.site .fd-panel{position:relative;margin-top:-4.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.site .fd-t{display:flex;align-items:center;gap:.8rem;padding:1.4rem 1.3rem;text-decoration:none;color:var(--text);font-weight:700;transition:background-color .3s}
.site .fd-t + .fd-t{border-left:1px solid var(--line)}
@media (hover:hover) and (pointer:fine){.site .fd-t:hover{background:var(--soft)}}
@media (max-width:1000px){.site .hero-field .hero-copy{padding-bottom:1rem}.site .fd-arch{justify-self:center;width:min(360px,80%)}.site .fd-bg{bottom:3rem}.site .fd-panel{margin-top:-3rem}}
@media (max-width:640px){.site .hero-field{padding-top:2.4rem}.site .fd-arch{width:min(260px,72%)}.site .fd-panel{grid-template-columns:1fr 1fr}.site .fd-t{padding:1rem .9rem;font-size:14px}.site .fd-t + .fd-t{border-left:0}.site .fd-t:nth-child(even){border-left:1px solid var(--line)}.site .fd-t:nth-child(n+3){border-top:1px solid var(--line)}}`,
});
