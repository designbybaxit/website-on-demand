/* ---------------- Hero variants: CSS + markup ---------------- */
function heroCSS(M) {
  const { S, P } = M;
  const v = M.heroV;
  const darkHero = `.site .hero-dark h1{color:#fff}.site .hero-dark h1 em{color:var(--accent)}.site .hero-dark .lead{color:rgba(255,255,255,.8)}.site .hero-dark .eyebrow{color:var(--accent)}.site .hero-dark .proof{color:rgba(255,255,255,.78)}.site .hero-dark .proof .i{color:var(--accent)}.site .hero-dark .btn-ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.28);color:#fff}`;
  const bgImg = `.site .bgimg{position:absolute;inset:-8% 0 0;z-index:-2}.site .bgimg img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.04)}`;
  if (v === 'cinema') return darkHero + bgImg + `
.site .hero-cinema{padding:0;color:#fff;min-height:780px;display:grid;align-items:center;text-align:center}
.site .hero-cinema::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(18,14,11,.35),rgba(18,14,11,.82) 70%),linear-gradient(180deg,rgba(18,14,11,.25),rgba(18,14,11,.95) 92%)}
.site .hero-cinema .inner{padding:7rem 0 4rem;max-width:900px;margin:0 auto}
.site .hero-cinema .eyebrow::before{display:none}
.site .hero-cinema h1{font-size:clamp(3rem,7vw,6rem);line-height:1}
.site .hero-cinema .lead{margin-left:auto;margin-right:auto}
.site .resbar{display:grid;grid-template-columns:repeat(3,1fr) auto;gap:.6rem;background:rgba(27,21,17,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(244,236,225,.16);border-radius:22px;padding:.7rem;margin:2.4rem auto 0;max-width:780px;text-align:left}
.site .resbar label{display:grid;gap:.25rem;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,236,225,.6);padding:.2rem .4rem}
.site .resbar select{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.14);padding:.7rem .8rem}
.site .resbar select option{color:#111}
.site .resbar .btn{align-self:stretch;border-radius:16px}
.site .embers{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.site .embers i{position:absolute;bottom:-10px;width:5px;height:5px;border-radius:50%;background:var(--warm);opacity:0;box-shadow:0 0 10px 2px var(--warm);animation:s-rise 9s linear infinite}
@keyframes s-rise{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:.85}100%{transform:translateY(-640px) translateX(40px) scale(.3);opacity:0}}
.site .scrollcue{display:inline-flex;flex-direction:column;align-items:center;gap:.4rem;margin-top:2.4rem;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6);text-decoration:none}
.site .scrollcue span{width:1px;height:42px;background:linear-gradient(var(--accent),transparent);animation:s-cue 2.2s ease-in-out infinite;transform-origin:top}
@keyframes s-cue{0%{transform:scaleY(0)}50%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}
@media (max-width:640px){.site .hero-cinema{min-height:0}.site .hero-cinema .inner{padding:3.2rem 0 3rem}.site .hero-cinema h1{font-size:clamp(2.6rem,12vw,3.3rem)}.site .resbar{grid-template-columns:1fr 1fr;margin-top:1.6rem}.site .resbar .btn{grid-column:1/-1;padding:1rem}.site .resbar label:nth-child(3){grid-column:1/-1}.site .scrollcue{display:none}}`;
  if (v === 'quote') return darkHero + bgImg + `
.site .hero-quote{background:var(--deep);color:#fff;padding:4.5rem 0 5rem}
.site .hero-quote::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,${P.deep} 30%,${rgba(/^#/.test(P.deep) ? P.deep : '#0b1f3a', .78)} 60%,${rgba(/^#/.test(P.deep) ? P.deep : '#0b1f3a', .55)})}
.site .hero-quote .bgimg img{opacity:.55}
.site .hero-quote .hero-grid{grid-template-columns:1.1fr .9fr}
.site .hero-quote h1 em{background:none;color:var(--accent);position:relative;white-space:nowrap}
.site .hero-quote h1 em::after{content:"";position:absolute;left:0;right:0;bottom:-.04em;height:.12em;border-radius:.1em;background:var(--accent);transform-origin:left;transform:scaleX(1);transition:transform 1s var(--ease) .9s}
.site.js:not(.ready) .hero-quote h1 em::after{transform:scaleX(0)}
.site .grid-lines{position:absolute;inset:0;z-index:-1;background-image:linear-gradient(to right,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.06) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 20% 40%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse 60% 70% at 20% 40%,#000 20%,transparent 75%)}
.site .topbar.alert{background:var(--accent);color:#0b1f3a}
.site .topbar.alert a{color:#0b1f3a}`;
  if (v === 'search') return `
.site .hero-search{padding:1.2rem 0 3.5rem}
.site .hs-frame{position:relative;border-radius:36px;overflow:hidden;min-height:660px;display:grid;align-items:end;color:#fff;isolation:isolate;background:var(--deep)}
.site .hs-frame .bgimg{position:absolute;inset:-8% 0 0;z-index:-2}
.site .hs-frame .bgimg img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.05)}
.site .hs-frame::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(13,30,23,.05) 20%,rgba(13,30,23,.78) 78%),linear-gradient(90deg,rgba(13,30,23,.55),transparent 65%)}
.site .hs-inner{padding:4rem;max-width:820px}
.site .hs-inner .eyebrow{color:#fff}
.site .hs-inner h1{color:#fff}.site .hs-inner h1 em{color:var(--accent)}
.site .hs-inner .lead{color:rgba(255,255,255,.85)}
.site .hs-search{--text:#1d3b2f;--muted:#5b6b63;--line:#e3e0d8;--surface:#ffffff;margin-top:2rem;background:#fff;color:#1d3b2f;border-radius:22px;padding:.55rem;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);max-width:680px}
.site .hs-tabs{display:flex;gap:.3rem;padding:.2rem .2rem .55rem}
.site .hs-tabs button{border:0;background:transparent;font:700 14px var(--sans);padding:.5rem .95rem;border-radius:999px;color:#4f6259;cursor:pointer;transition:background-color .25s,color .25s}
.site .hs-tabs button[aria-selected="true"]{background:var(--brand);color:#fff}
.site .hs-row{display:flex;gap:.5rem}
.site .hs-row input{flex:1;background:#f5f2ec;border-color:transparent;color:#1d3b2f}
.site .hs-chips{position:absolute;right:2.4rem;top:2.4rem;display:grid;gap:.7rem;justify-items:end}
.site .hs-chips .chip{position:relative;left:auto;right:auto;top:auto;bottom:auto}
@media (max-width:640px){.site .hero-search{padding:.6rem 0 2.5rem}.site .hs-frame{min-height:0;border-radius:26px}.site .hs-inner{padding:6rem 1.3rem 1.4rem}.site .hs-row{flex-direction:column}.site .hs-chips{display:none}.site .hs-inner h1{font-size:clamp(2.3rem,10.5vw,2.9rem)}}`;
  if (v === 'arch') return `
.site .hero-arch .hero-grid{grid-template-columns:1fr 1fr}
.site .arch-wrap{position:relative;max-width:470px;margin-left:auto;width:100%}
.site .arch{border-radius:999px 999px 30px 30px;overflow:hidden;aspect-ratio:4/5;box-shadow:var(--shadow);background:var(--soft);transform:translateY(var(--py-img,0px))}
.site .arch img{width:100%;height:100%;object-fit:cover;transform:scale(1.05)}
.site .circle{position:absolute;left:-14%;bottom:6%;width:200px;height:200px;border-radius:50%;overflow:hidden;border:8px solid var(--bg);box-shadow:var(--shadow);transform:translate(var(--px,0),var(--py,0));transition:transform .6s var(--ease)}
.site .circle img{width:100%;height:100%;object-fit:cover}
.site .spinb{position:absolute;right:-6%;top:-4%;width:128px;height:128px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;text-decoration:none;box-shadow:var(--shadow)}
.site .spinb svg{position:absolute;inset:0;width:100%;height:100%;animation:s-rot 16s linear infinite}
.site .spinb text{font:600 10.5px var(--sans);letter-spacing:.2em;fill:#fff}
.site .spinb b{font-size:26px;transition:transform .4s var(--spring)}
.site .spinb:hover b{transform:rotate(-45deg)}
@keyframes s-rot{to{transform:rotate(360deg)}}
.site .hero-arch .lead{max-width:31rem}
@media (max-width:1000px){.site .hero-arch .hero-grid,.site .hero-quote .hero-grid,.site .hero-form .hero-grid{grid-template-columns:1fr}.site .arch-wrap{margin:0 auto;max-width:400px}}
@media (max-width:640px){.site .arch-wrap{max-width:300px}.site .circle{width:120px;height:120px;left:-8%;border-width:5px}.site .spinb{width:96px;height:96px;right:-4%}.site .spinb text{font-size:9px}}`;
  if (v === 'form') return darkHero + `
.site .hero-form{background:var(--deep);color:#fff;padding:5rem 0 5.5rem}
.site .hero-form .bgimg{position:absolute;right:0;top:0;bottom:0;width:58%;z-index:-2;-webkit-mask-image:linear-gradient(90deg,transparent,#000 55%);mask-image:linear-gradient(90deg,transparent,#000 55%)}
.site .hero-form .bgimg img{width:100%;height:100%;object-fit:cover;opacity:.42;filter:grayscale(.3);transform:translateY(var(--py-img,0px)) scale(1.05)}
.site .hero-form::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.6}
.site .hero-form .hero-grid{grid-template-columns:1.05fr .95fr}
.site .hero-form .qcard{--text:#151515;--muted:#5f5a52;--line:#e6dfd3;--surface:#ffffff;--bg:#faf7f2;background:#fff;color:#151515}
.site .hero-form .qcard h3{font-family:var(--display);font-weight:400;font-size:1.7rem;letter-spacing:-0.01em}
.site .hero-form .eyebrow{color:var(--accent)}
.site .trustline{display:flex;gap:1.4rem;flex-wrap:wrap;margin-top:2.2rem;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.14);font-size:13px;color:rgba(255,255,255,.7)}
.site .trustline b{display:block;font:400 1.35rem var(--display);color:#fff}`;
  return `.site .hero-split{}`;
}

function heroParts(M) {
  const { ph } = M;
  const h1 = `<h1 class="hero-h1" id="hero-title" data-edit="headline">${headHTML(M.h1, true)}</h1>`;
  const eyebrow = `<p class="eyebrow">${hh(M.eyebrow)}</p>`;
  const lead = `<p class="lead" data-edit="lead">${hh(M.lead)}</p>`;
  const prim = btnPrimary(M, 'btn-lg');
  const sec = secondaryBtn(M, 'btn-lg');
  const actions = `<div class="hero-actions">${prim}${sec}</div>`;
  // proof line: the client's real facts first (licences, years, welcome lines), then plain facts from the form
  const proofItems = M.facts.filter(f => f.proof).map(f => f.proof);
  if (M.pricesClear) proofItems.push('Clear, upfront prices');
  if (M.wa) proofItems.push('Reply on WhatsApp');
  if (M.place) proofItems.push('Local to ' + M.place);
  const proof = proofItems.length ? `<div class="proof">${[...new Set(proofItems)].slice(0, 3).map(t => `<span>${svgI('check')}${hh(t)}</span>`).join('')}</div>` : '';
  const heroImg = (cls, w, h, alt) => `<img src="${uattr(ph.hero)}"${ph.heroSet ? ` srcset="${escSrcset(ph.heroSet)}" sizes="(max-width: 900px) 92vw, 50vw"` : ''} alt="${hh(alt || ph.alts.hero)}" width="${w}" height="${h}" fetchpriority="high"${cls ? ` class="${cls}"` : ''}>`;
  const chipData = heroChips(M);
  const chips = chipData.map((c, i) => `<div class="chip chip-${'abc'[i]}" data-depth="${[30, 50, 20][i]}"><span class="chip-ico">${svgI(c[0])}</span><div><small>${hh(c[1])}</small><b>${hh(c[2])}</b></div></div>`).join('');
  return { h1, eyebrow, lead, prim, sec, actions, proof, heroImg, chipData, chips, lbl: 'aria-labelledby="hero-title"' };
}
function heroHTML(M) {
  const { S, C, P, d, ph } = M, v = M.heroV;
  const { h1, eyebrow, lead, actions, proof, heroImg, chips } = heroParts(M);
  const lbl = 'aria-labelledby="hero-title"';
  if (v === 'cinema') {
    const embers = Array.from({ length: 14 }, (_, i) => `<i style="left:${(i * 7.3 + 3) % 100}%;animation-delay:${(i * 0.63).toFixed(2)}s;animation-duration:${(7 + (i % 5)).toFixed(1)}s"></i>`).join('');
    return `<section class="hero hero-cinema hero-dark" ${lbl}><div class="bgimg" aria-hidden="true">${heroImg('', 1600, 1000)}</div><div class="embers" aria-hidden="true">${embers}</div>
<div class="wrap"><div class="inner">${eyebrow}${h1}${lead}${M.fam === 'food' && M.ctaKey === 'reserve' ? resBar(M) : actions}<a class="scrollcue" href="#${M.order.includes('menu') ? 'menu' : 'services'}">Explore the ${hh(M.U.nav.toLowerCase())}<span></span></a></div></div></section>`;
  }
  if (v === 'quote') {
    return `<section class="hero hero-quote hero-dark" ${lbl}><div class="bgimg" aria-hidden="true">${heroImg('', 1600, 1000)}</div><div class="grid-lines" aria-hidden="true"></div>
<div class="wrap hero-grid"><div class="hero-copy">${eyebrow}${h1}${lead}${actions}${proof}</div>${quoteCard(M)}</div></section>`;
  }
  if (v === 'search') {
    return `<section class="hero hero-search" ${lbl}><div class="wrap"><div class="hs-frame"><div class="bgimg" aria-hidden="true">${heroImg('', 1600, 1000)}</div>
<div class="hs-chips" aria-hidden="true">${chips}</div>
<div class="hs-inner">${eyebrow}${h1}${lead}<form class="hs-search" data-demo-form><div class="hs-tabs" role="tablist" aria-label="What do you want to do?">${['Buy', 'Rent', 'Sell'].map((t, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}">${t}</button>`).join('')}</div>
<div class="hs-row"><input type="text" aria-label="Area or postcode" placeholder="${hh(M.place ? 'Search ' + M.place + ' by area or postcode' : 'Area or postcode')}"><button class="btn btn-primary" type="submit">Search ${svgI('arrow')}</button></div></form></div></div></div></section>`;
  }
  if (v === 'arch') {
    return `<section class="hero hero-arch" ${lbl}><div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
<div class="wrap hero-grid"><div class="hero-copy">${eyebrow}${h1}${lead}${actions}${proof}</div>
<div class="arch-wrap" data-tilt><div class="arch">${heroImg('', 900, 1125)}</div><div class="circle" data-depth="40"><img src="${uattr(ph.circle)}" alt="${hh(ph.alts.circle || '')}" width="420" height="420"></div>
<a class="spinb" href="${M.primary.href}" aria-label="${hh(M.primary.label)}"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="cp" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#cp">${hh((M.primary.short + ' · ' + (M.place || 'online') + ' · ').toUpperCase())}</textPath></text></svg><b aria-hidden="true">↘</b></a></div></div></section>`;
  }
  if (v === 'form') {
    const tl = [];
    if (M.services.length) tl.push([String(M.services.length), M.services.length > 1 ? M.U.nav.toLowerCase() : M.U.nav.toLowerCase().replace(/s$/, '')]);
    if (M.U.trust) tl.push(M.U.trust);
    if (M.place) tl.push([M.place, M.fam === 'legal' ? 'local office' : 'based here']);
    return `<section class="hero hero-form hero-dark" ${lbl}><div class="bgimg" aria-hidden="true">${heroImg('', 1400, 1000)}</div>
<div class="wrap hero-grid"><div class="hero-copy">${eyebrow}${h1}${lead}${actions}<div class="trustline">${tl.map(t => `<span><b>${hh(t[0])}</b>${hh(t[1])}</span>`).join('')}</div></div>${caseCard(M)}</div></section>`;
  }
  return `<section class="hero hero-split" ${lbl}><div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span></div>
<div class="wrap hero-grid"><div class="hero-copy">${eyebrow}${h1}${lead}${actions}${proof}</div>
<div class="hero-visual" data-tilt><div class="hero-img">${heroImg('', 1100, 1000)}</div>${chips}</div></div></section>`;
}
/* Floating chips carry real facts from the form only */
function heroChips(M) {
  const out = [], s = M.services;
  if (M.primary.kind === 'form') out.push(['calendar', M.ctaKey === 'quote' ? (M.freeQuote ? 'Free quote' : 'Get a quote') : 'Book online', M.ctaKey === 'reserve' ? 'Reserve in seconds' : M.ctaKey === 'quote' ? M.U.chipQuote : 'In under a minute']);
  else if (M.primary.kind === 'wa') out.push(['phone', 'Message us', 'On WhatsApp']);
  else out.push(['phone', 'Call us', M.d.phone]);
  const pr = s.find(x => x.priceT && /\d/.test(x.priceT));
  if (pr) out.push(['sparkle', pr.name.replace(/^[^:]{2,24}:\s*/, ''), pr.priceT]);
  else if (s[0]) out.push([s[0].icon, 'Popular', s[0].name.replace(/^[^:]{2,24}:\s*/, '')]);
  const fc = M.facts.find(f => f.chip);
  if (fc) out.push(fc.chip);
  else if (M.hours.length) out.push(['clock', M.hours[0][0] || 'Opening hours', M.hours[0][1]]);
  else if (M.place) out.push(['pin', 'Find us', M.place]);
  return out.slice(0, 3);
}
function btnPrimary(M, extra = '') {
  const p = M.primary;
  const ic = p.kind === 'wa' ? WA_SVG : p.kind === 'call' ? svgI('phone') : svgI('arrow');
  const ext = p.kind === 'wa' ? ' target="_blank" rel="noopener"' : '';
  return p.kind === 'wa' ? `<a class="btn btn-primary ${extra}" href="${hh(p.href)}"${ext}>${ic}${hh(p.label)}</a>` : `<a class="btn btn-primary ${extra}" href="${hh(p.href)}">${hh(p.label)} ${ic}</a>`;
}
function secondaryBtn(M, extra = '') {
  const first = M.order.find(k => ['services', 'menu', 'calc'].includes(k));
  if (M.primary.kind !== 'call' && M.d.phone && M.fam !== 'beauty') return `<a class="btn btn-ghost ${extra}" href="${telHref(M.d.phone)}">${svgI('phone')} Call ${hh(M.d.phone)}</a>`;
  return `<a class="btn btn-ghost ${extra}" href="#${first || 'services'}">${({ menu: M.fam === 'food' ? 'See the menu' : 'See ' + M.U.nav.toLowerCase(), calc: 'Mortgage calculator', services: 'Explore services' })[first] || 'Explore services'}</a>`;
}
