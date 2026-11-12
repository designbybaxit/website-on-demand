/* =====================================================================
   SECTION VARIANTS (everything except the hero). Same contract as v-hero.js:
   { label, fits(ctx), needs(M) -> photo slots, css(M), html(M) }.
   Keep the ids the runtime, nav and tests rely on: #services #menu #why
   #about #gallery #reviews #process #faq #book, and .rv/.rv-track for sliders.
   ===================================================================== */
const notFood = c => c.fam !== 'food';
const svcLink = (M, nm) => M.wa && M.primary.kind !== 'call'
  ? `<a class="link" href="${hh(M.waLink(`Hi ${M.name}, I'd like to ask about ${nm}.`))}" target="_blank" rel="noopener">${hh(M.C.verb)} ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`
  : M.primary.kind === 'call' ? `<a class="link" href="${telHref(M.d.phone)}">Call about ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`
    : `<a class="link" href="#book" data-pick="${hh(nm)}">${hh(M.C.verb)} ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`;

/* ---------- services ---------- */
registerVariant('services', 'cards', { label: 'Photo cards in a 3-column grid', fits: notFood, html: servicesHTML });
registerVariant('services', 'rows', {
  label: 'Wide rows: photo left, details right, two per line', fits: notFood,
  html: M => `<section id="services" class="section alt"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="srows">${M.services.map((s, i) => { const nm = svcName(s.name);
    const dur = svcDuration(s);
    return `<article class="srow reveal">${M.ph.services[i] ? `<figure><img src="${uattr(M.ph.services[i])}" alt="${hh(nm)}" loading="lazy" width="640" height="420"></figure>` : ''}<div class="srow-b"><span class="srow-n">${String(i + 1).padStart(2, '0')}</span><h3>${hh(nm)}</h3>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}<div class="srow-f">${s.priceT ? `<span class="price">${hh(s.priceT)}</span>` : ''}${dur ? `<span class="dur">${hh(dur)}</span>` : ''}${svcLink(M, nm)}</div></div></article>`; }).join('')}</div></div></section>`,
  css: M => `.site .srows{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.site .srow{display:grid;grid-template-columns:42% 1fr;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;transition:transform .5s var(--ease),box-shadow .5s,border-color .5s}
.site .srow figure{margin:0;overflow:hidden;background:var(--soft);min-height:220px}
.site .srow img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.site .srow-b{padding:1.5rem 1.6rem;display:flex;flex-direction:column;gap:.45rem}
.site .srow-n{font:600 13px var(--sans);letter-spacing:.14em;color:var(--accent-text)}
.site .srow h3{font-size:1.3rem}
.site .srow p{color:var(--muted);font-size:15px}
.site .srow-f{margin-top:auto;padding-top:.6rem;display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;align-items:center}
.site .srow .price{font-weight:800}
@media (hover:hover) and (pointer:fine){.site .srow:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:transparent}.site .srow:hover img{transform:scale(1.07)}}
@media (max-width:1000px){.site .srows{grid-template-columns:1fr}}
@media (max-width:640px){.site .srow{grid-template-columns:1fr}.site .srow figure{min-height:0;aspect-ratio:16/9}}`,
});
registerVariant('services', 'bento', {
  label: 'Bento grid: one big feature tile, the rest as photo tiles with text over a gradient', fits: notFood,
  html: M => `<section id="services" class="section"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="bento n${Math.min(M.services.length, 7)}">${M.services.map((s, i) => { const nm = svcName(s.name);
    const dur = svcDuration(s);
    return `<article class="bt reveal${i === 0 ? ' big' : ''}">${M.ph.services[i] ? `<img src="${uattr(M.ph.services[i])}" alt="${hh(nm)}" loading="lazy" width="640" height="420">` : ''}<div class="bt-b"><div class="bt-top"><span class="bt-ico">${svgI(s.icon)}</span>${s.priceT ? `<span class="bt-pr">${hh(s.priceT)}</span>` : ''}${dur ? `<span class="dur">${hh(dur)}</span>` : ''}</div><h3>${hh(nm)}</h3>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}${svcLink(M, nm)}</div></article>`; }).join('')}</div></div></section>`,
  css: M => `.site .bento{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:260px;gap:1rem}
.site .bt{position:relative;border-radius:var(--radius);overflow:hidden;background:var(--deep);color:#fff;display:flex;isolation:isolate}
.site .bt.big{grid-column:span 2;grid-row:span 2}
.site .bento.n2 .bt.big,.site .bento.n1 .bt.big{grid-row:span 1}
.site .bt img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.1s var(--ease)}
.site .bt::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,.05) 25%,rgba(0,0,0,.78))}
.site .bt-b{margin-top:auto;padding:1.4rem 1.5rem;display:flex;flex-direction:column;gap:.35rem;width:100%}
.site .bt-top{display:flex;justify-content:space-between;align-items:center;position:absolute;left:1.2rem;right:1.2rem;top:1.2rem}
.site .bt-ico{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.site .bt-pr{background:var(--btn);color:var(--on-btn);font-weight:800;font-size:14px;padding:.4rem .75rem;border-radius:999px}
.site .bt h3{color:#fff;font-size:1.3rem}.site .bt.big h3{font-size:clamp(1.6rem,3vw,2.3rem)}
.site .bt p{color:rgba(255,255,255,.82);font-size:14.5px;max-width:34rem}
.site .bt .link{color:#fff;margin-top:.3rem}
@media (hover:hover) and (pointer:fine){.site .bt:hover img{transform:scale(1.07)}}
@media (max-width:1000px){.site .bento{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.site .bento{grid-template-columns:1fr;grid-auto-rows:240px}.site .bt.big{grid-column:auto;grid-row:span 1}}`,
});
registerVariant('menu', 'tabs', { label: 'Tabbed menu / service list (salon gets a live basket)', html: menuHTML });

/* ---------- why us ---------- */
registerVariant('why', 'split', { label: 'Photo with fact badge + tick list', needs: () => ({ split: 1 }), html: whyHTML });
registerVariant('why', 'tiles', {
  label: 'Heading + tall photo tile + one tile per real reason', needs: () => ({ split: 1 }),
  html: M => `<section id="why" class="section"><div class="wrap">${head(M, 'why')}<div class="wtiles n${M.why.length}">${M.ph.split ? `<figure class="wt-ph reveal"><img src="${uattr(M.ph.split)}" alt="${hh(M.ph.alts.split || '')}" loading="lazy" width="1000" height="800"></figure>` : ''}${M.why.map((w, i) => `<div class="wt reveal"><span class="wt-n">${String(i + 1).padStart(2, '0')}</span><h3>${hh(w[0])}</h3><p>${hh(w[1])}</p></div>`).join('')}</div><div class="wt-cta reveal">${btnPrimary(M, 'btn-lg')}</div></div></section>`,
  css: M => `.site .wtiles{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:1rem}
.site .wt-ph{grid-row:span 2;border-radius:var(--radius);overflow:hidden;margin:0;min-height:380px;background:var(--soft)}
.site .wt-ph img{width:100%;height:100%;object-fit:cover}
.site .wt{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem;transition:background-color .4s,color .4s,transform .5s var(--ease)}
.site .wt-n{font:italic 400 2rem/1 ${M.S.italic || 'var(--display)'};color:var(--accent-text)}
.site .wt h3{margin:.7rem 0 .4rem;font-size:1.2rem}
.site .wt p{color:var(--muted);font-size:15px}
.site .wt-cta{text-align:center;margin-top:2.2rem}
@media (hover:hover) and (pointer:fine){.site .wt:hover{background:var(--deep);color:#fff;transform:translateY(-4px)}.site .wt:hover p{color:rgba(255,255,255,.75)}.site .wt:hover .wt-n{color:var(--accent)}}
@media (max-width:1000px){.site .wtiles{grid-template-columns:1fr 1fr}.site .wt-ph{grid-column:1/-1;grid-row:auto;min-height:280px}}
@media (max-width:640px){.site .wtiles{grid-template-columns:1fr}}`,
});
registerVariant('why', 'sticky', {
  label: 'Sticky heading + photo on the left, large numbered reasons scrolling on the right', needs: () => ({ split: 1 }),
  html: M => `<section id="why" class="section alt"><div class="wrap wsticky"><div class="ws-l"><p class="eyebrow reveal">${hh(M.C.eyebrow.why)}</p><h2 class="reveal">${headHTML(M.C.h2.why)}</h2>${M.ph.split ? `<figure class="ws-ph reveal"><img src="${uattr(M.ph.split)}" alt="${hh(M.ph.alts.split || '')}" loading="lazy" width="1000" height="800"></figure>` : ''}</div>
<ol class="ws-list">${M.why.map((w, i) => `<li class="reveal"><span>${String(i + 1).padStart(2, '0')}</span><div><h3>${hh(w[0])}</h3><p>${hh(w[1])}</p></div></li>`).join('')}<li class="ws-cta reveal">${btnPrimary(M, 'btn-lg')}</li></ol></div></section>`,
  css: M => `.site .wsticky{display:grid;grid-template-columns:1fr 1.1fr;gap:4rem;align-items:start}
.site .ws-l{position:sticky;top:110px}
.site .ws-l h2{font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 1.6rem}
.site .ws-ph{margin:0;border-radius:var(--radius);overflow:hidden;aspect-ratio:4/3;background:var(--soft)}
.site .ws-ph img{width:100%;height:100%;object-fit:cover}
.site .ws-list{list-style:none;margin:0;padding:0;display:grid;gap:0}
.site .ws-list li{display:grid;grid-template-columns:4.2rem 1fr;gap:1rem;padding:1.8rem 0;border-bottom:1px solid var(--line)}
.site .ws-list li > span{font:400 2.6rem/1 var(--display);color:var(--accent-text)}
.site .ws-list h3{font-size:1.35rem;margin-bottom:.4rem}
.site .ws-list p{color:var(--muted)}
.site .ws-list .ws-cta{display:block;border:0;padding-top:2rem}
@media (max-width:1000px){.site .wsticky{grid-template-columns:1fr;gap:2rem}.site .ws-l{position:static}}`,
});

/* ---------- stats ---------- */
registerVariant('stats', 'boxed', { label: 'Bordered strip under the hero', html: M => statsHTML(M, false) });
registerVariant('stats', 'band', { label: 'Full-width dark band', html: M => statsHTML(M, true) });

/* ---------- about ---------- */
registerVariant('about', 'duo', { label: 'Two overlapping photos + the client\'s own words', needs: () => ({ about: 1, about2: 1 }), html: aboutHTML });
registerVariant('about', 'wide', {
  label: 'Panoramic photo banner, then heading and story side by side', needs: () => ({ about: 1 }),
  html: M => { const sents = splitSentences(M.d.about); const paras = [sents.slice(0, 2).join(' '), sents.slice(2, 5).join(' ')].map(t => t.trim()).filter(Boolean);
    const facts = M.facts.filter(f => f.proof).slice(0, 4).map(f => f.proof);
    if (M.place) facts.push(M.place);
    return `<section id="about" class="section about-sec"><div class="wrap">${M.ph.about ? `<figure class="aw-ph reveal"><img src="${uattr(M.ph.about)}" alt="${hh(M.ph.alts.about || M.name)}" loading="lazy" width="1600" height="700"></figure>` : ''}
<div class="aw"><div><p class="eyebrow reveal">${hh(M.C.eyebrow.about)}</p><h2 class="reveal">${headHTML(M.C.h2.about)}</h2></div><div class="aw-copy">${paras.map(p => `<p class="reveal">${hh(p)}</p>`).join('')}${facts.length ? `<ul class="about-facts reveal">${facts.map(f => `<li>${svgI('check')}${hh(f)}</li>`).join('')}</ul>` : ''}</div></div></div></section>`; },
  css: M => `.site .aw-ph{margin:0 0 3rem;border-radius:calc(var(--radius) * 1.2 + 4px);overflow:hidden;aspect-ratio:21/8;background:var(--soft)}
.site .aw-ph img{width:100%;height:100%;object-fit:cover}
.site .aw{display:grid;grid-template-columns:1fr 1.2fr;gap:4rem}
.site .aw h2{font-size:clamp(2rem,4vw,3.2rem);margin-top:.8rem}
.site .aw-copy p{color:var(--muted);font-size:1.08rem;margin-bottom:1rem}
@media (max-width:1000px){.site .aw{grid-template-columns:1fr;gap:1.4rem}}
@media (max-width:640px){.site .aw-ph{aspect-ratio:4/3;margin-bottom:2rem}}`,
});

/* ---------- gallery ---------- */
registerVariant('gallery', 'mosaic', { label: 'Mosaic grid of up to 5 photos', needs: () => ({ gallery: 5 }), html: galleryHTML });
registerVariant('gallery', 'strip', {
  label: 'Horizontal snap-scroll film strip with arrow buttons', needs: () => ({ gallery: 6 }),
  html: M => { const g = M.ph.gallery.slice(0, 6);
    return `<section id="gallery" class="section"><div class="wrap"><div class="gs-head">${head(M, 'gallery', '', 'left')}<div class="gs-ctrl"><button type="button" class="rv-btn" data-strip-prev aria-label="Previous photos">${svgI('arrow')}</button><button type="button" class="rv-btn" data-strip-next aria-label="More photos">${svgI('arrow')}</button></div></div></div>
<div class="gstrip" data-strip tabindex="0" aria-label="Photo gallery">${g.map((src, i) => `<figure class="reveal"><img src="${uattr(src)}" alt="${hh(M.ph.galleryStock ? M.prof.label + ' example ' + (i + 1) : M.name + ' photo ' + (i + 1))}" loading="lazy" width="800" height="600"></figure>`).join('')}</div>
${M.ph.galleryStock ? `<div class="wrap"><div class="sample-row"><span class="sample-tag">${SAMPLE_PHOTOS}</span></div></div>` : ''}</section>`; },
  css: M => `.site .gs-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem}
.site .gs-ctrl{display:flex;gap:.5rem}.site .gs-ctrl [data-strip-prev] .i{transform:rotate(180deg)}
.site .gstrip{display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 max(1.25rem,calc((100% - 1200px) / 2)) 1rem;scrollbar-width:none;overscroll-behavior-x:contain}
.site .gstrip::-webkit-scrollbar{display:none}
.site .gstrip figure{flex:0 0 min(440px,78%);aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;scroll-snap-align:start;margin:0;background:var(--soft)}
.site .gstrip figure:nth-child(even){aspect-ratio:4/4.4;align-self:end}
.site .gstrip img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover) and (pointer:fine){.site .gstrip figure:hover img{transform:scale(1.05)}}
.site.nojs .gs-ctrl{display:none}`,
});

/* ---------- reviews ---------- */
registerVariant('reviews', 'slider', { label: 'One big quote at a time, arrows, dots, swipe, autoplay', html: reviewsHTML });
registerVariant('reviews', 'wall', {
  label: 'Masonry wall of every review',
  html: M => { const R = M.reviews;
    return `<section id="reviews" class="section alt"><div class="wrap">${head(M, 'reviews', R[0].sample ? '' : 'In their own words.')}<div class="rwall">${R.map(r => `<blockquote class="rw reveal"><span class="stars" aria-label="5 out of 5">★★★★★</span><p>${hh(r.q)}</p><footer><span class="av" aria-hidden="true">${hh(r.n.trim()[0] || '★')}</span><cite>${hh(r.n)}</cite></footer>${r.sample ? `<span class="sample-tag">${SAMPLE_REVIEW}</span>` : ''}</blockquote>`).join('')}</div></div></section>`; },
  css: M => `.site .rwall{columns:3 300px;column-gap:1.1rem}
.site .rw{break-inside:avoid;margin:0 0 1.1rem;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem;display:flex;flex-direction:column;gap:.9rem;transition:transform .5s var(--ease),box-shadow .5s}
.site .rw p{font:400 1.12rem/1.5 ${M.S.em === 'mark' ? 'var(--sans)' : (M.S.italic || 'var(--display)')}}
.site .rw .stars{color:var(--star,#f5b301);letter-spacing:.1em}
.site .rw footer{display:flex;align-items:center;gap:.6rem;font-weight:700;font-size:14px}
.site .rw cite{font-style:normal}
.site .rw .av{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--accent-text);font-weight:800}
@media (hover:hover) and (pointer:fine){.site .rw:hover{transform:translateY(-4px) rotate(-.4deg);box-shadow:var(--shadow)}}`,
});

/* ---------- process ---------- */
registerVariant('process', 'steps', { label: 'Three steps in a row (+ offer card)', needs: () => ({ steps: 1 }), html: processHTML });
registerVariant('process', 'timeline', {
  label: 'Vertical timeline whose line draws in as you scroll', needs: () => ({ steps: 1 }),
  html: M => `<section id="process" class="section"><div class="wrap">${head(M, 'process')}<ol class="tline">${M.steps.map((s, i) => `<li class="reveal"><span class="tl-dot">${i + 1}</span><div class="tl-c"><h3>${hh(s[0])}</h3><p>${hh(s[1])}</p></div>${M.ph.steps ? `<figure class="tl-ph"><img src="${uattr(M.ph.steps[i])}" alt="" loading="lazy" width="640" height="400"></figure>` : ''}</li>`).join('')}</ol></div></section>`,
  css: M => `.site .tline{list-style:none;margin:0 auto;padding:0;max-width:920px;position:relative}
.site .tline::before{content:"";position:absolute;left:23px;top:8px;bottom:8px;width:2px;background:var(--line)}
.site .tline li{position:relative;display:grid;grid-template-columns:48px 1fr 260px;gap:1.6rem;align-items:center;padding:1.4rem 0}
.site .tline li::after{content:"";position:absolute;left:23px;top:0;width:2px;height:100%;background:var(--brand);transform:scaleY(0);transform-origin:top;transition:transform 1s var(--ease) .2s}
.site .tline li.in::after{transform:scaleY(1)}
.site .tl-dot{position:relative;z-index:1;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--btn);color:var(--on-btn);font-weight:800}
.site .tl-c h3{font-size:1.3rem;margin-bottom:.35rem}.site .tl-c p{color:var(--muted)}
.site .tl-ph{margin:0;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10;background:var(--soft)}
.site .tl-ph img{width:100%;height:100%;object-fit:cover}
.site .tline li:not(:has(.tl-ph)){grid-template-columns:48px 1fr}
@media (max-width:640px){.site .tline li{grid-template-columns:48px 1fr}.site .tl-ph{grid-column:2}}`,
});

/* ---------- FAQ ---------- */
registerVariant('faq', 'split', { label: 'Heading left, accordion right', html: faqHTML });
registerVariant('faq', 'center', {
  label: 'Centred heading, single accordion column with +/− markers',
  html: M => `<section id="faq" class="section alt"><div class="wrap">${head(M, 'faq', M.d.phone ? `Can't see yours? Call us on ${M.d.phone}.` : '')}<div class="faq faq-c">${M.faq.map((f, i) => `<details class="reveal"${i ? '' : ' open'}><summary>${hh(f[0])}</summary><p>${hh(f[1])}</p></details>`).join('')}</div></div></section>`,
  css: M => `.site .faq-c{max-width:780px;margin:0 auto}`,
});

/* ---------- CTA ---------- */
registerVariant('cta', 'band', { label: 'Colour band with button', html: ctaHTML });
registerVariant('cta', 'photo', {
  label: 'Full-width photo with dark overlay and a big headline', needs: () => ({ cta: 1 }),
  html: M => `<section class="cta-photo">${M.ph.cta ? `<div class="bgimg" aria-hidden="true"><img src="${uattr(M.ph.cta)}" alt="" loading="lazy" width="1600" height="800"></div>` : ''}<div class="wrap cta-p-in reveal"><h2>${headHTML(M.C.h2.cta)}</h2><p>${M.fam === 'legal' ? 'Free, confidential and no obligation. ' : 'No obligation. '}${M.d.phone ? 'Call ' + hh(M.d.phone) + ' or use the form below.' : 'Use the form below.'}</p><div class="hero-actions">${btnPrimary(M, 'btn-lg')}${M.d.phone && M.primary.kind !== 'call' ? `<a class="btn btn-ghost btn-lg" href="${telHref(M.d.phone)}">${svgI('phone')} Call ${hh(M.d.phone)}</a>` : ''}</div></div></section>`,
  css: M => `.site .cta-photo{position:relative;isolation:isolate;padding:7rem 0;color:#fff;text-align:center;background:var(--deep);overflow:hidden}
.site .cta-photo .bgimg{position:absolute;inset:0;z-index:-2}.site .cta-photo .bgimg img{width:100%;height:100%;object-fit:cover}
.site .cta-photo::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.72))}
.site .cta-p-in{max-width:820px}
.site .cta-photo h2{font-size:clamp(2.2rem,5vw,3.8rem);color:#fff}.site .cta-photo h2 em{color:var(--accent)}
.site .cta-photo p{margin-top:1rem;color:rgba(255,255,255,.82)}
.site .cta-photo .hero-actions{justify-content:center}
.site .cta-photo .btn-ghost{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.35);color:#fff}
@media (max-width:640px){.site .cta-photo{padding:4.5rem 0}}`,
});

/* ---------- booking / contact ---------- */
registerVariant('book', 'split', { label: 'Copy + contact details left, form right, faint photo behind', needs: () => ({ contact: 1 }), html: bookHTML });
registerVariant('book', 'overlay', {
  label: 'Form card floating over a full photo, contact details on a glass panel', needs: () => ({ contact: 1 }),
  html: M => { const b = bookParts(M);
    return `<section id="book" class="section book-ov">${M.ph.contact ? `<div class="bgimg" aria-hidden="true"><img src="${uattr(M.ph.contact)}" alt="" loading="lazy" width="1400" height="900"></div>` : ''}<div class="wrap book"><div class="book-copy reveal"><p class="eyebrow">${hh(b.eyebrow)}</p><h2>${headHTML(b.h2)}</h2><p>${hh(b.intro)}</p>${infoList(M)}${b.waBtn}</div>${b.form}</div></section>`; },
  css: M => `.site .book-ov{position:relative;isolation:isolate;background:var(--deep);color:#fff}
.site .book-ov .bgimg{position:absolute;inset:0;z-index:-2}.site .book-ov .bgimg img{width:100%;height:100%;object-fit:cover}
.site .book-ov::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(6,8,12,.88),rgba(6,8,12,.55))}
.site .book-ov .book-copy h2{color:#fff}.site .book-ov .book-copy h2 em{color:var(--accent)}.site .book-ov .eyebrow{color:var(--accent)}
.site .book-ov .book-copy > p{color:rgba(255,255,255,.82)}
.site .book-ov .hours{--line:rgba(255,255,255,.16);--muted:rgba(255,255,255,.7);--text:#fff;color:#fff}
.site .book-ov .hours a{color:#fff}
.site .book-ov .form-card{--text:${M.P.dark ? M.P.text : '#151515'};color:var(--text)}`,
});

/* ---------- footer ---------- */
registerVariant('footer', 'classic', { label: 'Brand + visit + contact columns', html: footerHTML });
registerVariant('footer', 'bigcta', {
  label: 'Huge closing line with the main action, then the columns',
  html: M => footerHTML(M).replace('<footer class="footer"><div class="wrap">', `<footer class="footer foot-big"><div class="wrap"><div class="fb-top reveal"><h2>${headHTML(M.C.h2.cta)}</h2>${btnPrimary(M, 'btn-lg')}</div>`),
  css: M => `.site .fb-top{display:flex;justify-content:space-between;align-items:end;gap:2rem;padding:1rem 0 3rem;margin-bottom:3rem;border-bottom:1px solid var(--line)}
.site .fb-top h2{font-size:clamp(2.2rem,5.5vw,4.4rem);max-width:780px}
@media (max-width:640px){.site .fb-top{flex-direction:column;align-items:flex-start}}`,
});

/* ---------- single-variant sections ---------- */
registerVariant('ribbon', 'marquee', { label: 'Scrolling ribbon of service names', html: ribbonHTML });
registerVariant('calc', 'mortgage', { label: 'Mortgage calculator (property)', fits: c => c.fam === 'property', html: calcHTML });
registerVariant('area', 'chips', { label: 'Areas covered as chips', html: areaHTML });
