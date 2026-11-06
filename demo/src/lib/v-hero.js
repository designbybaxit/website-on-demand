/* =====================================================================
   HERO VARIANTS. Each: fits(ctx) -> allowed for this business?
   needs(M) -> extra photo slots; css(M) -> its own CSS; html(M) -> markup.
   Keep: .hero .btn-primary in the first screen on a 390x844 phone,
   h1#hero-title with .w word spans (heroParts), and no text in images.
   ===================================================================== */
const quoteFits = c => ['trade', 'auto'].includes(c.fam) || c.profK === 'cleaning';
/* legacy heroes (b5-hero.js) */
registerVariant('hero', 'split', { label: 'Split: copy + tilting photo with fact chips (+ the kit\'s rotating stamp)',
  html: M => M.S.badge ? heroHTML(M).replace('<div class="hero-visual" data-tilt>', '<div class="hero-visual" data-tilt>' + spinBadge(M, 'hv-badge')) : heroHTML(M),
  css: M => heroCSS(M) + '.site .hv-badge{left:-6%;bottom:-5%}@media (max-width:640px){.site .hv-badge{left:auto;right:-2%;bottom:-6%}}' });
registerVariant('hero', 'arch', { label: 'Arch photo + circle detail + spinning badge', needs: () => ({ circle: 1 }), html: heroHTML, css: heroCSS });
registerVariant('hero', 'cinema', { label: 'Cinematic full-screen photo, embers (food)', fits: c => ['food', 'events'].includes(c.fam), html: heroHTML, css: heroCSS });
registerVariant('hero', 'quote', { label: 'Dark photo + 2-step instant quote card', fits: quoteFits, html: heroHTML, css: heroCSS });
registerVariant('hero', 'form', { label: 'Dark + case review card (legal)', fits: c => c.fam === 'legal', html: heroHTML, css: heroCSS });
registerVariant('hero', 'search', { label: 'Framed photo + property search', fits: c => c.fam === 'property', html: heroHTML, css: heroCSS });

const heroDarkCSS = `.site .hero-dark h1{color:#fff}.site .hero-dark h1 em{color:var(--accent)}.site .hero-dark .lead{color:rgba(255,255,255,.82)}.site .hero-dark .eyebrow{color:var(--accent)}.site .hero-dark .proof{color:rgba(255,255,255,.8)}.site .hero-dark .proof .i{color:var(--accent)}.site .hero-dark .btn-ghost{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.3);color:#fff}`;
/* the side slot: a quote card for trades, otherwise a stack of real-fact chips */
function heroSide(M, parts, cls = '') {
  if (M.heroQuote) return quoteCard(M);
  return parts.chipData.length ? `<div class="fact-stack ${cls}" aria-label="At a glance">${parts.chipData.map((c, i) => `<div class="fs-item" style="--i:${i}"><span class="chip-ico">${svgI(c[0])}</span><div><small>${hh(c[1])}</small><b>${hh(c[2])}</b></div></div>`).join('')}</div>` : '';
}
const factStackCSS = `.site .fact-stack{display:grid;gap:.7rem;align-self:end;justify-self:end;width:min(340px,100%)}
.site .fs-item{display:flex;align-items:center;gap:.8rem;padding:.95rem 1.1rem;border-radius:calc(var(--radius) * .8 + 6px);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#fff;transition:transform .9s var(--spring),opacity .8s var(--ease);transition-delay:calc(var(--i) * 120ms + 500ms)}
.site.js:not(.ready) .fs-item{opacity:0;transform:translateX(30px)}
.site .fs-item small{display:block;font-size:12px;opacity:.75}.site .fs-item b{display:block;line-height:1.3}
.site .fs-item .chip-ico{background:var(--accent);color:var(--deep)}
.site .fact-stack.light .fs-item{background:${'var(--surface)'};color:var(--text);border-color:var(--line);box-shadow:var(--shadow)}
.site .fact-stack.light .fs-item .chip-ico{background:var(--soft);color:var(--accent-text)}`;

registerVariant('hero', 'fullbleed', {
  label: 'Full-bleed photo with slow Ken Burns zoom, copy left, quote card or fact stack right',
  html: M => { const p = heroParts(M);
    return `<section class="hero hero-full hero-dark" ${p.lbl}><div class="bgimg" aria-hidden="true"><div class="kb">${p.heroImg('', 1600, 1000)}</div></div>
<div class="wrap hero-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>${heroSide(M, p)}</div></section>`; },
  css: M => heroDarkCSS + factStackCSS + `
.site .hero-full{min-height:min(820px,100vh);display:grid;align-items:center;padding:5rem 0 5.5rem;background:var(--deep)}
.site .hero-full .bgimg{position:absolute;inset:-6% 0 0;z-index:-2;overflow:hidden}
.site .hero-full .kb{position:absolute;inset:0;animation:s-kb 22s ease-in-out infinite alternate}
.site .hero-full .bgimg img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px))}
.site .hero-full::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(8,10,14,.86) 0%,rgba(8,10,14,.62) 48%,rgba(8,10,14,.25) 100%),linear-gradient(0deg,rgba(8,10,14,.55),transparent 40%)}
.site .hero-full .hero-grid{grid-template-columns:1.15fr .85fr}
.site .hero-full h1{font-size:clamp(2.8rem,6vw,5.2rem)}
@keyframes s-kb{from{transform:scale(1.02)}to{transform:scale(1.14) translate(-1.5%,-1.2%)}}
@media (max-width:1000px){.site .hero-full .fact-stack{justify-self:start}}
@media (max-width:640px){.site .hero-full{min-height:0;padding:2.6rem 0 3rem}.site .hero-full::before{background:linear-gradient(180deg,rgba(8,10,14,.72),rgba(8,10,14,.86))}.site .hero-full .fact-stack{display:none}}`,
});

registerVariant('hero', 'mosaic', {
  label: 'Copy left, three-photo collage right (people at work + two details)',
  needs: () => ({ heroExtra: 2 }),
  html: M => { const p = heroParts(M), x = M.ph.heroExtra;
    const extra = x.map((src, i) => `<figure class="mo-${'bc'[i]}" data-depth="${[26, 40][i]}"><img src="${src}" alt="" width="700" height="820" loading="eager"></figure>`).join('');
    return `<section class="hero hero-mosaic" ${p.lbl}><div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span></div>
<div class="wrap hero-grid"><div class="hero-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>
<div class="mosaic${x.length < 2 ? ' solo' : ''}"><figure class="mo-a hero-img">${p.heroImg('', 900, 1100)}</figure>${extra}${p.chipData[0] ? `<div class="chip chip-a" data-depth="30"><span class="chip-ico">${svgI(p.chipData[0][0])}</span><div><small>${hh(p.chipData[0][1])}</small><b>${hh(p.chipData[0][2])}</b></div></div>` : ''}</div></div></section>`; },
  css: M => `
.site .mosaic{position:relative;display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:1fr 1fr;gap:1rem;height:560px}
.site .mosaic figure{border-radius:var(--radius);overflow:hidden;background:var(--soft);box-shadow:var(--shadow);margin:0;transition:transform .9s var(--spring),opacity .9s var(--ease)}
.site .mosaic .hero-img{aspect-ratio:auto;transform:none}
.site .mosaic img{width:100%;height:100%;object-fit:cover}
.site .mosaic .mo-a{grid-row:1/3}
.site .mosaic .mo-a img{transform:translateY(var(--py-img,0px)) scale(1.08)}
.site .mosaic .mo-b,.site .mosaic .mo-c{translate:var(--px,0) var(--py,0)}
.site .mosaic .mo-c{transition-delay:.15s}
.site.js:not(.ready) .mosaic figure{opacity:0;transform:translateY(40px) scale(.96)}
.site .mosaic.solo{grid-template-columns:1fr}.site .mosaic.solo .mo-a{grid-row:auto}
.site .mosaic .chip-a{left:-7%;top:auto;bottom:10%}
@media (max-width:1000px){.site .mosaic{height:420px}}
@media (max-width:640px){.site .mosaic{height:200px;gap:.5rem}.site .mosaic .chip{display:none}}`,
});

registerVariant('hero', 'editorial', {
  label: 'Centred magazine headline over a wide panoramic photo that opens like a curtain',
  html: M => { const p = heroParts(M);
    const chips = p.chipData.slice(0, 2).map((c, i) => `<div class="chip chip-${'ab'[i]}" data-depth="${[24, 40][i]}"><span class="chip-ico">${svgI(c[0])}</span><div><small>${hh(c[1])}</small><b>${hh(c[2])}</b></div></div>`).join('');
    return `<section class="hero hero-ed" ${p.lbl}><div class="hero-bg" aria-hidden="true"><span class="blob b1"></span><span class="blob b3"></span></div>
<div class="wrap"><div class="ed-copy">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div>
<div class="ed-strip"><div class="bgimg">${p.heroImg('', 1600, 700)}</div>${chips}</div></div></section>`; },
  css: M => `
.site .hero-ed{padding:4.2rem 0 4.5rem}
.site .ed-copy{text-align:center;max-width:980px;margin:0 auto}
.site .ed-copy .eyebrow::before{display:none}
.site .ed-copy h1{font-size:clamp(2.8rem,6.4vw,5.6rem)}
.site .ed-copy .lead{margin-inline:auto;max-width:40rem}
.site .ed-copy .hero-actions,.site .ed-copy .proof{justify-content:center}
.site .ed-strip{position:relative;margin-top:3.2rem;aspect-ratio:21/8;border-radius:calc(var(--radius) * 1.3 + 4px);clip-path:inset(0 0 round calc(var(--radius) * 1.3 + 4px));transition:clip-path 1.5s var(--ease) .3s}
.site.js:not(.ready) .ed-strip{clip-path:inset(18% 14% round calc(var(--radius) * 1.3 + 4px))}
.site .ed-strip .bgimg{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.site .ed-strip img{width:100%;height:118%;object-fit:cover;transform:translateY(calc(var(--py-img,0px) - 6%))}
.site .ed-strip .chip-a{left:3%;top:auto;bottom:8%}.site .ed-strip .chip-b{right:3%;top:10%}
@media (max-width:640px){.site .hero-ed{padding:2.4rem 0 3rem}.site .ed-strip{aspect-ratio:4/3;margin-top:2rem}.site .ed-strip .chip-b{display:none}.site .ed-copy .proof{justify-content:flex-start;text-align:left}}`,
});

registerVariant('hero', 'panel', {
  label: 'Split screen: solid colour panel with copy, edge-to-edge photo with a card over it',
  html: M => { const p = heroParts(M);
    return `<section class="hero hero-panel hero-dark" ${p.lbl}><div class="pn-copy"><div class="pn-in">${p.eyebrow}${p.h1}${p.lead}${p.actions}${p.proof}</div></div>
<div class="pn-media"><div class="bgimg">${p.heroImg('', 1200, 1100)}</div><div class="pn-side">${heroSide(M, p, M.heroQuote ? '' : 'light')}</div></div></section>`; },
  css: M => heroDarkCSS + factStackCSS + `
.site .hero-panel{display:grid;grid-template-columns:1fr 1fr;padding:0;min-height:700px;background:var(--deep)}
.site .pn-copy{display:flex;align-items:center;justify-content:flex-end;padding:5rem 3.5rem 5rem 1.25rem;position:relative}
.site .pn-copy::after{content:"";position:absolute;left:0;bottom:0;height:5px;width:100%;background:var(--accent);transform-origin:left;transition:transform 1.4s var(--ease) .4s}
.site.js:not(.ready) .pn-copy::after{transform:scaleX(0)}
.site .pn-in{max-width:560px;width:100%}
.site .pn-media{position:relative;overflow:hidden;display:grid;align-items:end;padding:2.4rem}
.site .pn-media .bgimg{position:absolute;inset:0;z-index:-1}
.site .pn-media img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.06);transition:transform 1.6s var(--ease)}
.site.js:not(.ready) .pn-media img{transform:scale(1.22)}
.site .pn-side{position:relative;display:grid;justify-items:end}
.site .pn-side .qcard{width:min(440px,100%)}
@media (max-width:1000px){.site .hero-panel{grid-template-columns:1fr}.site .pn-copy{justify-content:flex-start;padding:3rem 1.25rem}.site .pn-media{min-height:420px}}
@media (max-width:640px){.site .pn-copy{padding:2.4rem 1.25rem 2.6rem}.site .pn-media{min-height:280px;padding:1rem}.site .pn-side .fact-stack{display:none}.site .pn-media:has(.qcard){min-height:0;padding:1rem 1rem 2rem}.site .pn-media:has(.qcard) .bgimg{opacity:.55}}`,
});
