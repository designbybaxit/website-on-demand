/* =====================================================================
   Industry section variants inspired by the salon, trades and cleaning
   reference notes (library/references). Original markup and palettes.
   Prices render as priceT. Durations appear only when the client typed them.
   No invented licences, ratings, awards or "trusted by N people" lines.
   ===================================================================== */
function svcDuration(s) {
  const t = `${s.name || ''} ${s.desc || ''} ${s.price || ''}`;
  const m = t.match(/\b(\d{1,3})(?:\s*(?:–|-|to)\s*(\d{1,3}))?\s*(minutes|minute|mins|min|hours|hour|hrs|hr)\b/i);
  if (!m) return '';
  if (/hour|hr/i.test(m[3])) {
    const many = m[2] || +m[1] !== 1;
    return m[2] ? `${m[1]}–${m[2]} ${many ? 'hrs' : 'hr'}` : `${m[1]} ${many ? 'hrs' : 'hr'}`;
  }
  return m[2] ? `${m[1]}–${m[2]} min` : `${m[1]} min`;
}
function svcPlace(name) {
  const n = String(name || '');
  if (/\boffice|commercial|workplace|janitorial\b/i.test(n)) return 'Commercial';
  if (/\bhome|house|apartment|domestic|residential\b/i.test(n)) return 'Residential';
  if (/\bpressure|driveway|patio|exterior|siding|gutter\b/i.test(n)) return 'Exterior';
  return '';
}
const priceExact = s => s.priceT ? `<span class="price">${hh(s.priceT)}</span>` : '';

/* ---------- heroes ---------- */
registerVariant('hero', 'dual', {
  label: 'Editorial split: two stacked photos, serif headline, circular services link',
  fits: c => c.profK === 'salon',
  needs: () => ({ heroExtra: 1 }),
  html: M => { const p = heroParts(M), extra = M.ph.heroExtra[0];
    const dest = M.order.includes('menu') ? '#menu' : '#services';
    return `<section class="hero hero-dual" ${p.lbl}><div class="wrap du-grid">
<div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}<a class="du-orb" href="${dest}">Services</a></div>
<div class="du-photos">${p.heroImg('', 900, 1100) ? `<figure class="du-a">${p.heroImg('', 900, 1100)}</figure>` : ''}${extra ? `<figure class="du-b"><img src="${extra}" alt="" width="700" height="820"></figure>` : ''}</div>
</div></section>`; },
  css: () => `.site .hero-dual{padding:3.2rem 0 3.6rem}
.site .du-grid{display:grid;grid-template-columns:1fr .92fr;gap:2.4rem;align-items:center}
.site .du-photos{display:grid;gap:.8rem;order:-1}
.site .du-photos figure{margin:0;overflow:hidden;border-radius:28px 28px 80px 28px;background:var(--soft);aspect-ratio:4/3}
.site .du-photos img{width:100%;height:100%;object-fit:cover}
.site .du-b{border-radius:80px 28px 28px 28px}
.site .du-orb{width:92px;height:92px;margin-top:1.2rem;border-radius:50%;display:grid;place-items:center;background:var(--btn);color:var(--on-btn);text-decoration:none;font-weight:700;letter-spacing:.04em;font-size:13px}
.site .hero-dual h1{font-size:clamp(2.6rem,5vw,4.6rem)}
@media (max-width:900px){.site .du-grid{grid-template-columns:1fr;gap:1.4rem}.site .du-photos{order:0}.site .hero-dual{padding:2.2rem 0 2.6rem}.site .du-photos figure{aspect-ratio:16/10}}`,
});

registerVariant('hero', 'craft', {
  label: 'Dark craftsmanship hero: full-bleed work photo, bold headline, exact price if given',
  fits: c => c.profK === 'barber',
  html: M => { const p = heroParts(M);
    const priced = M.services.find(s => s.priceT && /\d/.test(s.priceT));
    const line = priced ? `<p class="cr-price"><span>${hh(svcName(priced.name))}</span><b>${hh(priced.priceT)}</b></p>` : '';
    return `<section class="hero hero-craft hero-dark" ${p.lbl}><div class="bgimg" aria-hidden="true">${p.heroImg('', 1600, 1000)}</div>
<div class="wrap hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${line}${p.proof}</div></section>`; },
  css: () => heroDarkCSS + `.site .hero-craft{padding:4.2rem 0 4.6rem;background:#111}
.site .hero-craft .bgimg{position:absolute;inset:0;z-index:-2}
.site .hero-craft .bgimg img{width:100%;height:100%;object-fit:cover;filter:saturate(.75)}
.site .hero-craft::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(8,8,8,.88),rgba(8,8,8,.55) 70%,rgba(8,8,8,.35))}
.site .hero-craft h1{font-size:clamp(2.8rem,6vw,5rem);max-width:14ch}
.site .cr-price{display:flex;gap:1rem;align-items:baseline;margin-top:1.1rem;color:#fff}
.site .cr-price b{font-size:1.35rem}
.site .cr-price span{opacity:.8}
@media (max-width:640px){.site .hero-craft{padding:2.3rem 0 2.8rem}.site .hero-craft::before{background:linear-gradient(180deg,rgba(8,8,8,.55),rgba(8,8,8,.88))}}`,
});

registerVariant('hero', 'power', {
  label: 'Bold gradient field, photo card and the client\'s own service names',
  fits: c => c.profK === 'electric',
  html: M => { const p = heroParts(M);
    const chips = M.services.slice(0, 4).map(s => `<a class="pw-chip" href="#services">${hh(svcName(s.name))}</a>`).join('');
    return `<section class="hero hero-power" ${p.lbl}><div class="wrap"><div class="pw-shell"><div class="pw-grid">
<div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}${chips ? `<div class="pw-chips">${chips}</div>` : ''}</div>
<figure class="pw-photo">${p.heroImg('', 900, 1100)}</figure>
</div></div></div></section>`; },
  css: M => `.site .hero-power{padding:1rem 0 1.2rem;background:var(--bg)}
.site .pw-shell{border-radius:28px;overflow:hidden;color:#fff;background:${userTone(M) ? `linear-gradient(105deg,var(--deep) 0%,${mixC(/^#/.test(M.P.deep) ? M.P.deep : '#111111', /^#/.test(M.P.brand) ? M.P.brand : '#333333', .5)} 52%,${/^#/.test(M.P.brand) ? mixC(M.P.brand, '#000000', .15) : 'var(--brand)'} 100%)` : 'linear-gradient(105deg,#141433 0%,#241e62 48%,#c2410c 100%)'};padding:2.6rem 2.2rem}
.site .pw-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:1.6rem;align-items:center}
.site .hero-power h1,.site .hero-power .lead,.site .hero-power .eyebrow,.site .hero-power .proof{color:#fff}
.site .hero-power h1 em{color:${userTone(M) ? (/^#/.test(M.P.accent) ? mixC(M.P.accent, '#ffffff', .55) : '#fff') : '#ffe1c4'}}
.site .hero-power .eyebrow{color:${userTone(M) ? (/^#/.test(M.P.accent) ? mixC(M.P.accent, '#ffffff', .65) : '#fff') : '#ffd7b0'}}
.site .hero-power .proof{color:rgba(255,255,255,.86)}
.site .hero-power .btn-ghost{color:#fff;border-color:rgba(255,255,255,.45)}
.site .pw-photo{margin:0;border-radius:20px;overflow:hidden;min-height:280px;background:rgba(0,0,0,.2)}
.site .pw-photo img{width:100%;height:100%;object-fit:cover;min-height:280px}
.site .pw-chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.site .pw-chip{color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.4);border-radius:999px;padding:.55rem .9rem;font-size:14px;font-weight:650}
@media (max-width:900px){.site .pw-grid{grid-template-columns:1fr}.site .pw-shell{padding:1.6rem 1.15rem 1.3rem}.site .pw-photo{min-height:0}.site .pw-photo img{min-height:0;aspect-ratio:16/10}}`,
});

registerVariant('hero', 'estimate', {
  label: 'Friendly split with a two-step estimate card and the real phone number',
  fits: c => c.profK === 'plumbing',
  html: M => { const p = heroParts(M);
    const call = M.d.phone ? `<a class="est-call" href="${telHref(M.d.phone)}">${svgI('phone')}<span><small>Call</small><b>${hh(M.d.phone)}</b></span></a>` : '';
    return `<section class="hero hero-est" ${p.lbl}><div class="wrap est-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${call}${p.proof}</div>${quoteCard(M)}</div></section>`; },
  css: () => `.site .hero-est{padding:3rem 0 3.4rem;background:linear-gradient(180deg,var(--soft),var(--bg) 70%)}
.site .est-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:1.6rem;align-items:start}
.site .est-call{display:inline-flex;align-items:center;gap:.7rem;margin-top:.9rem;text-decoration:none;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:.55rem .8rem .55rem .55rem;color:var(--text)}
.site .est-call .i, .site .est-call svg{width:36px;height:36px}
.site .est-call small{display:block;color:var(--muted);font-size:12px}
.site .hero-est .qcard{margin:0}
@media (max-width:900px){.site .est-grid{grid-template-columns:1fr}.site .hero-est{padding:2.1rem 0 2.4rem}}`,
});

registerVariant('hero', 'airy', {
  label: 'Airy gradient, cleaner photo and an estimate card',
  fits: c => c.profK === 'cleaning',
  html: M => { const p = heroParts(M);
    const pills = M.services.slice(0, 3).map(s => { const tag = svcPlace(s.name); return `<span class="ay-pill">${tag ? `<small>${hh(tag)}</small>` : ''}${hh(svcName(s.name))}</span>`; }).join('');
    const side = (M.ctaKey === 'quote' || M.primary.kind === 'form') && M.services.length ? quoteCard(M) : '';
    return `<section class="hero hero-airy" ${p.lbl}><div class="wrap ay-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${pills ? `<div class="ay-pills">${pills}</div>` : ''}${p.proof}</div>
<figure class="ay-photo">${p.heroImg('', 900, 1100)}</figure>${side}</div></section>`; },
  css: M => `.site .hero-airy{padding:2.8rem 0 3rem;background:${userTone(M) ? 'linear-gradient(160deg,var(--soft) 0%,var(--bg) 46%,var(--surface) 100%)' : 'linear-gradient(160deg,#e7f2ff 0%,#f7fbff 42%,#fff6d8 100%)'}}
.site .ay-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:1.4rem 1.6rem;align-items:center}
.site .ay-grid .qcard{grid-column:2;grid-row:2}
.site .ay-photo{margin:0;border-radius:28px;overflow:hidden;background:var(--soft);aspect-ratio:4/5}
.site .ay-photo img{width:100%;height:100%;object-fit:cover}
.site .ay-pills{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.9rem}
.site .ay-pill{background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:.45rem .75rem;font-size:14px}
.site .ay-pill small{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent-text)}
.site .hero-airy h1{font-size:clamp(2.5rem,5vw,4.4rem)}
@media (max-width:900px){.site .ay-grid,.site .ay-grid .qcard{grid-template-columns:1fr;grid-column:auto;grid-row:auto}.site .hero-airy{padding:2rem 0 2.4rem}.site .ay-photo{aspect-ratio:16/10;order:2}}`,
});

registerVariant('hero', 'industrial', {
  label: 'Hard-edged exterior hero with photo and estimate card',
  fits: c => c.profK === 'pressure',
  html: M => { const p = heroParts(M);
    return `<section class="hero hero-ind" ${p.lbl}><div class="wrap ind-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>
<figure class="ind-photo">${p.heroImg('', 1000, 800)}</figure>${M.services.length ? quoteCard(M) : ''}</div></section>`; },
  css: () => `.site .hero-ind{padding:2.4rem 0 2.8rem;background:var(--deep);color:#fff}
.site .hero-ind h1,.site .hero-ind .lead,.site .hero-ind .proof{color:#fff}
.site .hero-ind h1 em{color:var(--accent)}
.site .hero-ind .eyebrow{color:var(--accent)}
.site .hero-ind .btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.55)}
.site .ind-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:1.2rem 1.4rem;align-items:start}
.site .ind-photo{margin:0;border-radius:4px;overflow:hidden;background:#000}
.site .ind-photo img{width:100%;height:100%;object-fit:cover;aspect-ratio:4/3;filter:contrast(1.05)}
.site .hero-ind .qcard{grid-column:1 / -1}
.site .hero-ind h1{font-size:clamp(2.6rem,5.4vw,4.6rem);text-transform:uppercase;letter-spacing:-0.03em}
@media (max-width:900px){.site .ind-grid{grid-template-columns:1fr}.site .hero-ind{padding:2rem 0 2.2rem}}`,
});

/* ---------- menus and services ---------- */
registerVariant('menu', 'duration', {
  label: 'Service rows with a typed duration and the exact price',
  fits: c => c.fam === 'beauty',
  html: M => { const groups = groupServices(M.services);
    const rows = groups.map(g => `<div class="dur-g"><h3>${hh(g.name)}</h3><ul>${g.items.map(s => {
      const dur = svcDuration(s);
      return `<li class="reveal"><div><b>${hh(s.name)}</b>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}</div><div class="dur-meta">${dur ? `<span class="dur">${hh(dur)}</span>` : ''}${priceExact(s)}</div></li>`;
    }).join('')}</ul></div>`).join('');
    const salon = M.key === 'salon' && M.ctaKey === 'book';
    const first = M.services[0];
    const basket = salon && first ? `<aside class="basket reveal" aria-live="polite"><p class="eyebrow">Your appointment</p><h3>Your booking</h3><ul data-basket><li><span>${hh(svcName(first.name))}</span><span>${hh(first.priceT || '')}</span></li></ul><a class="btn btn-primary btn-block" href="#book">Choose a time ${svgI('arrow')}</a><p class="fine">Final price confirmed at your appointment.</p></aside>` : '';
    return `<section id="menu" class="section alt"><div class="wrap">${head(M, 'menu', M.C.menuIntro)}<div class="dur-grid${basket ? ' with-basket' : ''}"><div>${rows}</div>${basket}</div></div></section>`; },
  css: () => `.site .dur-grid{display:grid;grid-template-columns:1fr;gap:1.4rem}
.site .dur-grid.with-basket{grid-template-columns:1.4fr .7fr;align-items:start}
.site .dur-g + .dur-g{margin-top:1.4rem}
.site .dur-g h3{font-size:1.15rem;margin-bottom:.4rem}
.site .dur-g ul{list-style:none;margin:0;padding:0}
.site .dur-g li{display:grid;grid-template-columns:1fr auto;gap:.8rem 1.2rem;padding:.85rem 0;border-bottom:1px solid var(--line);align-items:center}
.site .dur-g p{color:var(--muted);font-size:14.5px;margin-top:.2rem}
.site .dur-meta{display:flex;flex-wrap:wrap;gap:.35rem .7rem;justify-content:flex-end;align-items:center;text-align:right}
.site .dur{font-size:13px;letter-spacing:.04em;color:var(--accent-text)}
.site .dur-meta .price{font-weight:800}
@media (max-width:800px){.site .dur-grid.with-basket{grid-template-columns:1fr}.site .dur-g li{grid-template-columns:1fr}.site .dur-meta{justify-content:flex-start;text-align:left}}`,
});

registerVariant('menu', 'ledger', {
  label: 'Barber price board: name and exact price, no invented times',
  fits: c => c.profK === 'barber',
  html: M => { const items = M.services.map(s => { const dur = svcDuration(s); return `<li class="reveal"><span>${hh(svcName(s.name))}</span><span class="dur-meta">${dur ? `<span class="dur">${hh(dur)}</span>` : ''}${priceExact(s)}</span></li>`; }).join('');
    return `<section id="menu" class="section"><div class="wrap">${head(M, 'menu', M.C.menuIntro)}<ul class="ld-list">${items}</ul></div></section>`; },
  css: () => `.site .ld-list{list-style:none;margin:0;padding:0;border-top:2px solid var(--text);columns:2;column-gap:2.4rem}
.site .ld-list li{display:flex;justify-content:space-between;gap:1rem;padding:.9rem 0;border-bottom:1px solid var(--line);font-size:1.05rem;break-inside:avoid}
.site .ld-list .price{font-weight:800}
@media (max-width:700px){.site .ld-list{columns:1}}`,
});

registerVariant('services', 'fresh', {
  label: 'Airy photo service cards; residential or commercial label only if the name says so',
  fits: c => c.profK === 'cleaning',
  html: M => `<section id="services" class="section"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="fr-grid">${M.services.map((s, i) => {
    const tag = svcPlace(s.name);
    return `<article class="fr reveal">${M.ph.services[i] ? `<img src="${M.ph.services[i]}" alt="${hh(svcName(s.name))}" width="640" height="420">` : ''}<div><${'h3'}>${hh(svcName(s.name))}</h3>${tag ? `<small>${hh(tag)}</small>` : ''}${s.desc ? `<p>${hh(s.desc)}</p>` : ''}<div class="fr-f">${priceExact(s)}${svcLink(M, svcName(s.name))}</div></div></article>`;
  }).join('')}</div></div></section>`,
  css: () => `.site .fr-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.site .fr{background:var(--surface);border:1px solid var(--line);border-radius:22px;overflow:hidden;display:grid;grid-template-columns:.9fr 1.1fr}
.site .fr img{width:100%;height:100%;object-fit:cover;min-height:160px}
.site .fr > div{padding:1.1rem 1.15rem 1.2rem;display:flex;flex-direction:column;gap:.35rem}
.site .fr small{color:var(--accent-text);letter-spacing:.08em;text-transform:uppercase;font-size:11px;font-weight:700}
.site .fr p{color:var(--muted);font-size:14.5px}
.site .fr-f{margin-top:auto;display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center}
@media (max-width:800px){.site .fr-grid{grid-template-columns:1fr}.site .fr{grid-template-columns:1fr}.site .fr img{aspect-ratio:16/9;min-height:0}}`,
});

registerVariant('services', 'yard', {
  label: 'Exterior job rows with a photo and the exact price',
  fits: c => c.profK === 'pressure',
  html: M => `<section id="services" class="section alt"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="yd">${M.services.map((s, i) => `<article class="yd-row reveal"><span class="yd-n">${String(i + 1).padStart(2, '0')}</span>${M.ph.services[i] ? `<img src="${M.ph.services[i]}" alt="${hh(svcName(s.name))}" width="640" height="420">` : ''}<div><h3>${hh(svcName(s.name))}</h3>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}<div class="yd-f">${priceExact(s)}${svcLink(M, svcName(s.name))}</div></div></article>`).join('')}</div></div></section>`,
  css: () => `.site .yd{display:grid;gap:.8rem}
.site .yd-row{display:grid;grid-template-columns:auto 180px 1fr;gap:1rem;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:.7rem;overflow:hidden}
.site .yd-n{font:800 1.4rem/1 var(--display);color:var(--accent-text);padding-left:.4rem}
.site .yd-row img{width:180px;height:120px;object-fit:cover;border-radius:4px}
.site .yd-row p{color:var(--muted);font-size:14.5px}
.site .yd-f{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;margin-top:.35rem}
@media (max-width:800px){.site .yd-row{grid-template-columns:1fr}.site .yd-row img{width:100%;height:auto;aspect-ratio:16/9}}`,
});

registerVariant('gallery', 'masonry', {
  label: 'Masonry work gallery',
  fits: c => c.fam === 'beauty',
  needs: () => ({ gallery: 6 }),
  html: M => { const g = M.ph.gallery.slice(0, 6);
    return `<section id="gallery" class="section"><div class="wrap">${head(M, 'gallery')}<div class="ms">${g.map((src, i) => `<figure class="reveal"><img src="${src}" alt="${hh(M.ph.galleryStock ? M.prof.label + ' example ' + (i + 1) : M.name + ' photo ' + (i + 1))}" loading="lazy" width="800" height="600"></figure>`).join('')}</div>${M.ph.galleryStock ? `<div class="sample-row"><span class="sample-tag">${SAMPLE_PHOTOS}</span></div>` : ''}</div></section>`; },
  css: () => `.site .ms{columns:3;column-gap:.8rem}
.site .ms figure{break-inside:avoid;margin:0 0 .8rem;border-radius:18px;overflow:hidden;background:var(--soft)}
.site .ms img{width:100%;height:auto}
@media (max-width:900px){.site .ms{columns:2}}
@media (max-width:560px){.site .ms{columns:1}}`,
});
