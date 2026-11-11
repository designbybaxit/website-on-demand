/* ---------------- Sections ---------------- */
const SAMPLE_REVIEW = 'Sample review, replaced with your real reviews before launch';
const SAMPLE_STATS = 'Sample figures, replaced with your real numbers before launch';
const SAMPLE_PHOTOS = 'Sample photos, replaced with your own before launch';
const NAVNAME = { calc: 'Calculator', about: 'About', gallery: 'Gallery', reviews: 'Reviews', faq: 'FAQ', area: 'Areas', beforeafter: 'Results', insurance: 'Payment' };
const navName = (k, M) => k === 'services' || k === 'menu' ? M.U.nav : k === 'why' ? (M.native && M.key === 'restaurant' ? 'Our story' : 'Why us') : NAVNAME[k] || null;
const head = (M, k, intro, extra = '') => `<div class="head reveal ${extra}"><p class="eyebrow">${hh(M.C.eyebrow[k] || '')}</p><h2>${headHTML(M.C.h2[k] || '')}</h2>${intro ? `<p>${hh(intro)}</p>` : ''}</div>`;
const svcName = n => n.replace(/^[^:]{2,24}:\s*/, '');

function nextDays(n, skipSunday) {
  const out = [], dt = new Date();
  while (out.length < n) { dt.setDate(dt.getDate() + 1); if (skipSunday && dt.getDay() === 0) continue; out.push(new Date(dt)); }
  return out;
}
const dayChips = (n, skip) => nextDays(n, skip).map((x, i) => `<button type="button" class="chipbtn${i ? '' : ' is-on'}" aria-pressed="${i ? 'false' : 'true'}"><small>${x.toLocaleDateString('en-GB', { weekday: 'short' })}</small>${x.getDate()}</button>`).join('');
const slotChips = (arr, on = 1) => arr.map((t, i) => `<button type="button" class="chipbtn${i === on ? ' is-on' : ''}" aria-pressed="${i === on}">${t}</button>`).join('');
const legalLine = () => `<p class="fine">By sending this you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>. Preview: nothing is sent until your site goes live.</p>`;
const honey = () => `<div class="hp" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"><label>Leave this field empty<input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>`;
const svcOptions = M => M.services.map(s => `<option>${hh(svcName(s.name))}</option>`).join('');

function topbarHTML(M) {
  const { d } = M;
  const emergency = (M.fam === 'trade' || M.fam === 'auto' || M.fam === 'tech') && /emergenc|24\s*\/?\s*7|24 hours|call.?out/i.test(d.hours + ' ' + M.plainNames.join(' '));
  if (!d.phone && !M.hours.length) return '';
  const left = emergency ? `<span><b>Emergency call-outs</b>${M.hours.find(h => /24|emergenc/i.test(h.join(' '))) ? ' · ' + hh(M.hours.find(h => /24|emergenc/i.test(h.join(' '))).join(': ').replace(/^: /, '')) : ''}</span>` :
    `<span><i class="dot"></i>${M.hours.length ? hh((M.hours[0][0] ? M.hours[0][0] + ': ' : '') + M.hours[0][1]) : 'Get in touch today'}</span>`;
  const mid = d.address || M.place ? `<span class="hide-sm">${svgI('pin')} ${hh(d.address || M.place)}</span>` : '';
  const right = d.phone ? `<a href="${telHref(d.phone)}">${svgI('phone')}${hh(d.phone)}</a>` : '';
  return `<div class="topbar${emergency ? ' alert' : ''}"><div class="wrap topbar-in">${left}${mid}${right}</div></div>`;
}
function logoHTML(M) {
  const mark = M.d.logo ? `<span class="logo-mark img"><img src="${M.d.logo}" alt="" width="120" height="44"></span>` : `<span class="logo-mark" aria-hidden="true">${hh(M.initials)}</span>`;
  return `${mark}<span><b>${hh(M.logoBold)}</b>${M.logoRest ? ' ' + hh(M.logoRest) : ''}</span>`;
}
function headerHTML(M) {
  const links = M.order.filter(k => navName(k, M) && k !== 'hero' && k !== 'book' && hasSection(M, k)).slice(0, 5).map(k => `<a href="#${k}">${navName(k, M)}</a>`).join('');
  const call = M.d.phone && M.primary.kind !== 'call' ? `<a class="btn btn-ghost hide-sm" href="${telHref(M.d.phone)}">Call us</a>` : '';
  return `<header class="hdr" id="top"><div class="wrap hdr-in"><a href="#top" class="brand" aria-label="${hh(M.name)} home">${logoHTML(M)}</a>
<nav class="nav" aria-label="Main">${links}</nav>
<div class="hdr-cta">${call}<a class="btn btn-primary" href="${hh(M.primary.href)}"${M.primary.kind === 'wa' ? ' target="_blank" rel="noopener"' : ''}>${hh(M.primary.short)}</a><button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button></div></div>
<nav class="mnav" id="mnav" aria-label="Mobile">${links}<a href="${hh(M.primary.href)}" class="btn btn-primary">${hh(M.primary.short)}</a></nav></header>`;
}
function hasSection(M, k) {
  if (k === 'gallery') return M.ph.gallery.length >= 3;
  if (k === 'area') return !!(M.d.areas || M.place);
  if (k === 'services' || k === 'menu') return M.services.length > 0;
  if (k === 'why') return M.why.length >= 2;
  if (k === 'about') return !!M.d.about;
  if (k === 'faq') return M.faq.length >= 2;
  if (k === 'beforeafter') return !!(M.ba && M.ba.length);
  if (k === 'insurance') return !!(M.ins && M.ins.any);
  if (k === 'infobar') return infoItems(M).length >= 2;
  return true;
}
function ribbonHTML(M) {
  let items = (M.plainNames.length >= 3 ? M.plainNames : [...M.plainNames, ...(M.place ? [M.place] : []), M.primary.short]).slice(0, 8);
  const base = []; while (base.length < 10) base.push(...items);
  const run = base.map(t => `<span>${hh(t)}</span><i>✦</i>`).join('');
  return `<div class="ribbon" aria-hidden="true"><div class="ribbon-track">${run}${run.replace(/<span>/g, '<span class="dup">').replace(/<i>/g, '<i class="dup">')}</div></div>`;
}
function statsHTML(M, band) {
  if (!M.stats.length) return '';
  const st = M.stats;
  const cells = st.map(s => {
    if (s.text || !/^\d+(\.\d+)?$/.test(String(s.v))) return `<div class="stat reveal"><b>${hh(s.v + s.suf)}</b><span>${hh(s.l)}</span></div>`;
    const n = parseFloat(s.v), dec = (String(s.v).split('.')[1] || '').length;
    const disp = (dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-GB')) + s.suf;
    return `<div class="stat reveal"><b data-count="${n}" data-dec="${dec}" data-suffix="${hh(s.suf)}">${hh(disp)}</b><span>${hh(s.l)}</span></div>`;
  }).join('');
  const tag = st[0].sample ? `<div class="sample-row"><span class="sample-tag">${SAMPLE_STATS}</span></div>` : '';
  return `<section class="stats${band ? ' band' : ''}" aria-label="At a glance"><div class="wrap"><div class="stats-grid" style="--n:${st.length}">${cells}</div>${tag}</div></section>`;
}
function servicesHTML(M) {
  const n = M.services.length;
  const cls = n === 2 ? 'n2' : n === 4 ? 'n4' : '';
  const cards = M.services.map((s, i) => {
    const nm = svcName(s.name);
    const act = M.wa && M.primary.kind !== 'call'
      ? `<a class="link" href="${hh(M.waLink(`Hi ${M.name}, I'd like to ask about ${nm}.`))}" target="_blank" rel="noopener">${hh(M.C.verb)} ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`
      : M.primary.kind === 'call' ? `<a class="link" href="${telHref(M.d.phone)}">Call about ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`
        : `<a class="link" href="#book" data-pick="${hh(nm)}">${hh(M.C.verb)} ${hh(lowerFirst(nm))} ${svgI('arrow')}</a>`;
    const dur = svcDuration(s);
    return `<article class="card${M.ph.services[i] ? ' has-img' : ''} reveal">${M.ph.services[i] ? `<figure class="card-img"><img src="${M.ph.services[i]}" alt="${hh(nm)}" loading="lazy" width="640" height="420"></figure>` : ''}<div class="card-body"><div class="ico">${svgI(s.icon)}</div><h3>${hh(nm)}</h3>${s.desc ? `<p>${hh(s.desc)}</p>` : ''}${s.priceT ? `<div class="price">${hh(s.priceT)}</div>` : ''}${dur ? `<div class="dur">${hh(dur)}</div>` : ''}${act}</div></article>`;
  }).join('');
  return `<section id="services" class="section alt"><div class="wrap">${head(M, 'services', M.C.servicesIntro)}<div class="cards ${cls}">${cards}</div></div></section>`;
}
function whyHTML(M) {
  const rev = M.key === 'restaurant' || M.key === 'law';
  const fb = M.facts.find(f => f.chip);
  const badge = fb ? [fb.chip[0], fb.chip[1], fb.chip[2]] : M.hours.length ? ['clock', M.hours[0][0] || 'Open', M.hours[0][1]] : M.place ? ['pin', 'Find us', M.place] : ['phone', 'Talk to us', M.d.phone];
  const story = '';
  return `<section id="why" class="section${M.key === 'law' ? ' alt' : ''}"><div class="wrap split${rev ? ' rev' : ''}">
<div class="split-media reveal"><div class="frame">${M.ph.split ? `<img src="${M.ph.split}" alt="${hh(M.ph.alts.split || '')}" loading="lazy" width="1000" height="800">` : ''}</div><div class="badge-float"><span class="bi">${svgI(badge[0])}</span><div><b>${hh(badge[1])}</b><span>${hh(badge[2])}</span></div></div></div>
<div class="split-copy"><p class="eyebrow reveal">${hh(M.C.eyebrow.why)}</p><h2 class="reveal">${headHTML(M.C.h2.why)}</h2>${story}
<ul class="checks">${M.why.map(w => `<li class="reveal"><b>${hh(w[0])}</b> ${hh(w[1])}</li>`).join('')}</ul>${btnPrimary(M, 'reveal')}</div></div></section>`;
}
function processHTML(M) {
  const steps = M.steps.map((s, i) => `<li class="reveal">${M.ph.steps ? `<figure class="step-img"><img src="${M.ph.steps[i]}" alt="" loading="lazy" width="640" height="400"></figure>` : ''}<span class="num">0${i + 1}</span><h3>${hh(s[0])}</h3><p>${hh(s[1])}</p></li>`).join('');
  const offerSvc = M.services.find(s => s.priceT && /\d/.test(s.priceT));
  const offer = offerSvc ? `<div class="offer reveal"><div><p class="eyebrow">${hh(M.U.offerEyebrow)}</p><h3>${hh(svcName(offerSvc.name))}, <em>${hh(offerSvc.priceT)}</em></h3>${offerSvc.desc ? `<p>${hh(offerSvc.desc)}</p>` : ''}</div>${btnPrimary(M, 'btn-light btn-lg').replace('btn btn-primary btn-light', 'btn btn-light')}</div>` : '';
  return `<section id="process" class="section${M.key === 'law' ? '' : ' alt'}"><div class="wrap">${head(M, 'process')}<ol class="steps">${steps}</ol>${M.key !== 'restaurant' && M.key !== 'salon' ? offer : ''}</div></section>`;
}
function menuHTML(M) {
  const groups = groupServices(M.services), salon = M.key === 'salon' && M.ctaKey === 'book';
  // food / salon / barber menus: each item shows its own keyword-matched photo (or none); other menus keep one photo per group
  const perItem = M.fam === 'food' || M.fam === 'beauty';
  const itemImg = s => { const idx = M.services.findIndex(x => svcName(x.name) === s.name); return idx >= 0 ? M.ph.services[idx] || '' : ''; };
  let gi = 0; const gImg = perItem ? groups.map(() => '') : groups.map(g => { const idx = M.services.findIndex(s => svcName(s.name) === g.items[0].name); return M.ph.services[idx >= 0 ? idx : gi++] || ''; });
  const tabs = groups.length > 1 ? `<div class="tabs" role="tablist" aria-label="Menu sections">${groups.map((g, i) => `<button class="tab" type="button" role="tab" id="t-${i}" aria-controls="m-${i}" aria-selected="${i ? 'false' : 'true'}"${i ? ' tabindex="-1"' : ''}>${hh(g.name)}</button>`).join('')}</div>` : '';
  const panels = groups.map((g, i) => `<ul class="menu-list" id="m-${i}" role="tabpanel"${groups.length > 1 ? ` aria-labelledby="t-${i}"` : ''}${i ? ' hidden' : ''}>${gImg[i] ? `<li class="menu-img" aria-hidden="true"><img src="${gImg[i]}" alt="" loading="lazy" width="640" height="420"></li>` : ''}${g.items.map((s, j) => {
    const dur = svcDuration(s);
    const pr = `${dur ? `<span class="dur">${hh(dur)}</span>` : ''}${s.priceT ? `<span class="pr">${hh(s.priceT)}</span>` : ''}`;
    const im = perItem ? itemImg(s) : '';
    const imgT = im ? `<img class="mi-img" src="${im}" alt="${hh(s.name)}" loading="lazy" width="640" height="420">` : '';
    const wrap = body => im ? `${imgT}<div class="mi-b">${body}</div>` : body;
    if (!salon) return `<li class="mi${im ? ' has-img' : ''} reveal">${wrap(`<h4>${hh(s.name)}</h4>${pr}${s.desc ? `<p>${hh(s.desc)}</p>` : ''}`)}</li>`;
    const on = i === 0 && j === 0;
    return `<li class="mi svc${im ? ' has-img' : ''} reveal">${wrap(`<h4>${hh(s.name)}</h4>${pr}${s.desc ? `<p>${hh(s.desc)}</p>` : '<p></p>'}`)}<button type="button" class="add" data-name="${hh(s.name)}" data-price="${priceNum(s.price)}" aria-pressed="${on}" aria-label="Add ${hh(s.name)} to booking">+</button></li>`;
  }).join('')}</ul>`).join('');
  const first = groups[0].items[0];
  const basket = salon ? `<aside class="basket reveal" aria-live="polite" data-cur="${hh(M.cur)}"><p class="eyebrow">${hh(M.C.eyebrow.book ? 'Your appointment' : '')}</p><h3>Your booking</h3><ul data-basket><li><span>${hh(first.name)}</span><span>${hh(M.cur + priceNum(first.price))}</span></li></ul>
<div class="tot"><span>Estimated total</span><b data-total>${hh(M.cur + priceNum(first.price))}</b></div><a class="btn btn-primary btn-block" href="#book">Choose a time ${svgI('arrow')}</a><p class="fine" style="margin-top:.8rem">Final price confirmed at your appointment.</p></aside>` : '';
  return `<section id="menu" class="section${M.key === 'salon' ? ' alt' : ''}"><div class="wrap">${head(M, 'menu', M.C.menuIntro)}<div class="menu-grid${salon ? ' with-basket' : ''}"><div class="menu-main">${tabs}${panels}</div>${basket}</div></div></section>`;
}
function calcHTML(M) {
  const c = M.cur, P0 = 350000 * 0.85, r0 = 4.5 / 1200, n0 = 300, pm0 = P0 * r0 / (1 - Math.pow(1 + r0, -n0)), fm = n => c + Math.round(n).toLocaleString('en-GB');
  return `<section id="calc" class="section"><div class="wrap">${head(M, 'calc', 'Move the sliders to get a feel for monthly repayments. Example only, not financial advice.')}
<div class="calc reveal" data-calc data-cur="${hh(c)}"><div>
<label><span class="row">Property price <output data-o="price">${hh(c)}350,000</output></span><input type="range" min="50000" max="1500000" step="5000" value="350000" data-k="price" aria-label="Property price"></label>
<label><span class="row">Deposit <output data-o="dep">15%</output></span><input type="range" min="5" max="50" step="1" value="15" data-k="dep" aria-label="Deposit percent"></label>
<label><span class="row">Interest rate <output data-o="rate">4.5%</output></span><input type="range" min="1" max="9" step="0.1" value="4.5" data-k="rate" aria-label="Interest rate"></label>
<label><span class="row">Term <output data-o="term">25 years</output></span><input type="range" min="5" max="35" step="1" value="25" data-k="term" aria-label="Term in years"></label></div>
<div class="calc-out"><small>Estimated monthly repayment</small><div class="big" data-o="pm">${hh(fm(pm0))}</div><small data-o="loan">Loan ${hh(fm(P0))} over 25 years</small>${btnPrimary(M).replace('btn btn-primary', 'btn btn-light')}</div></div></div></section>`;
}
function galleryHTML(M) {
  const g = M.ph.gallery.slice(0, 5);
  const fig = g.map((src, i) => `<figure class="reveal"><img src="${src}" alt="${hh(M.ph.galleryStock ? M.prof.label + ' example ' + (i + 1) : M.name + ' photo ' + (i + 1))}" loading="lazy" width="800" height="600"></figure>`).join('');
  return `<section id="gallery" class="section"><div class="wrap">${head(M, 'gallery')}<div class="gallery g${g.length}">${fig}</div>${M.ph.galleryStock ? `<div class="sample-row"><span class="sample-tag">${SAMPLE_PHOTOS}</span></div>` : ''}</div></section>`;
}
function reviewsHTML(M) {
  const R = M.reviews;
  const cards = R.map((r, i) => `<blockquote class="rv-card" id="rv-${i}"><span class="qm" aria-hidden="true">“</span><p>${hh(r.q)}</p><footer><cite><span class="av" aria-hidden="true">${hh(r.n.trim()[0] || '★')}</span><span>${hh(r.n)}<br><span class="stars" aria-label="5 out of 5">★★★★★</span></span></cite>${r.sample ? `<span class="sample-tag">${SAMPLE_REVIEW}</span>` : ''}</footer></blockquote>`).join('');
  return `<section id="reviews" class="section${M.key === 'law' ? '' : ' alt'}"><div class="wrap rv"><div>${head(M, 'reviews', R[0].sample ? '' : 'In their own words.', 'left')}
<div class="rv-ctrl"><button class="rv-btn prev" type="button" aria-label="Previous review">${svgI('arrow')}</button><button class="rv-btn next" type="button" aria-label="Next review">${svgI('arrow')}</button><div class="dots">${R.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div></div></div>
<div class="rv-view reveal" aria-roledescription="carousel" aria-label="Reviews"><div class="rv-track">${cards}</div></div></div></section>`;
}
function areaHTML(M) {
  const list = (M.d.areas || '').split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  const all = [...new Set([...(M.place ? [M.place] : []), ...list])].slice(0, 14);
  return `<section id="area" class="section"><div class="wrap">${head(M, 'area', M.place ? `Based in ${M.place}${list.length ? ' and covering the areas below' : ''}. Not sure if we cover you? Just ask.` : '')}<div class="area">${all.map(a => `<span class="reveal">${svgI('pin')}${hh(a)}</span>`).join('')}</div></div></section>`;
}
function ctaHTML(M) {
  return `<section class="section" style="padding-top:0"><div class="wrap"><div class="cta-band reveal"><div><h2>${headHTML(M.C.h2.cta)}</h2><p>${M.fam === 'legal' ? 'Free, confidential and no obligation. ' : 'No obligation. '}${M.d.phone ? 'Call ' + hh(M.d.phone) + ' or use the form below.' : 'Use the form below.'}</p></div><div class="hero-actions" style="margin:0">${btnPrimary(M, 'btn-lg').replace('btn btn-primary', 'btn btn-light')}</div></div></div></section>`;
}
function infoList(M) {
  const rows = M.hours.map(h => `<li><span>${hh(h[0] || 'Hours')}</span><b>${hh(h[1])}</b></li>`);
  if (M.d.address) rows.push(`<li><span>Address</span><b>${hh(M.d.address)}</b></li>`);
  if (M.d.phone) rows.push(`<li><span>Phone</span><b><a href="${telHref(M.d.phone)}">${hh(M.d.phone)}</a></b></li>`);
  if (M.d.email) rows.push(`<li><span>Email</span><b><a href="mailto:${hh(M.d.email)}">${hh(M.d.email)}</a></b></li>`);
  return rows.length ? `<ul class="hours">${rows.join('')}</ul>` : '';
}
function bookParts(M) {
  const U = M.U, f = M.fam;
  let form, intro;
  const nameRow = `<div class="row2"><label>Name<input type="text" name="name" autocomplete="name" placeholder="Your name"></label><label>Mobile<input name="phone" type="tel" autocomplete="tel" placeholder="Your number"></label></div>`;
  if (M.ctaKey === 'reserve' && f === 'food') {
    intro = 'Tell us when and how many. We\'ll confirm your table.';
    form = `<form class="form-card reveal" data-demo-form novalidate>${honey()}<fieldset><legend>Date</legend><div class="days" data-chips>${dayChips(5, false)}</div></fieldset>
<fieldset><legend>Time</legend><div class="slots" data-chips>${slotChips(M.prof.k === 'cafe' || M.prof.k === 'bakery' ? ['9:00 am', '10:30 am', '12:00 pm', '1:00 pm', '2:30 pm', '4:00 pm'] : ['5:30 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '9:00 pm'], 2)}</div></fieldset>
<div class="row2"><label>Guests<select name="guests">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<option${n === 2 ? ' selected' : ''}>${n} ${n > 1 ? 'guests' : 'guest'}</option>`).join('')}<option>Larger group</option></select></label><label>Occasion<select name="occasion"><option>Just because</option><option>Birthday</option><option>Anniversary</option><option>Business</option></select></label></div>
${nameRow}<button class="btn btn-primary btn-lg btn-block" type="submit">Request a table</button>${legalLine()}</form>`;
  } else if (f === 'food') {
    // a café / restaurant without table booking: a simple message form, never a service picker of menu dishes
    intro = M.d.address ? `Find us at ${M.d.address}. Questions, large orders or events? Send us a message.` : 'Questions, large orders or events? Send us a message.';
    form = `<form class="form-card reveal" data-demo-form novalidate>${honey()}<label>What's it about?<select name="topic"><option>A general question</option><option>A large order</option><option>An event or party</option><option>Something else</option></select></label>
${nameRow}<label>Email<input type="email" name="email" autocomplete="email" placeholder="you@email.com"></label><label>Message<textarea name="message" placeholder="How can we help?"></textarea></label>
<button class="btn btn-primary btn-lg btn-block" type="submit">Send message</button>${legalLine()}</form>`;
  } else if (f === 'property' && M.ctaKey !== 'book') {
    intro = 'Tell us about your property and we\'ll arrange a free valuation.';
    form = `<form class="form-card reveal" data-demo-form novalidate>${honey()}<label>Property address<input type="text" name="address" placeholder="House number and street"></label>
<div class="row2"><label>Property type<select name="type"><option>Flat / apartment</option><option>Terraced house</option><option>Semi-detached</option><option>Detached</option><option>Bungalow</option></select></label><label>Bedrooms<select name="beds"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5+</option></select></label></div>
<fieldset><legend>I want to</legend><div class="slots" data-chips>${slotChips(['Sell', 'Let', 'Just curious'], 0)}</div></fieldset>
${nameRow}<button class="btn btn-primary btn-lg btn-block" type="submit">Book my free valuation</button>${legalLine()}</form>`;
  } else if (M.ctaKey === 'book' || M.ctaKey === 'reserve') {
    intro = U.bookIntro;
    form = `<form class="form-card reveal" data-demo-form novalidate>${honey()}<label>${hh(U.svcLabel)}<select name="service" data-service>${svcOptions(M)}</select></label>
<fieldset><legend>Day</legend><div class="days" data-chips>${dayChips(5, true)}</div></fieldset>
<fieldset><legend>Time</legend><div class="slots" data-chips>${slotChips(['9:00 am', '10:30 am', '12:00 pm', '2:00 pm', '3:30 pm', '5:00 pm'], 2)}</div></fieldset>
${nameRow}<button class="btn btn-primary btn-lg btn-block" type="submit">${hh(U.bookSubmit)}</button>${legalLine()}</form>`;
  } else {
    intro = U.contactIntro;
    const second = U.postcode ? ['Postcode', 'postcode', 'e.g. LS1 4AB'] : ['Email', 'email', 'you@email.com'];
    form = `<form class="form-card reveal" data-demo-form novalidate>${honey()}<label>${hh(U.svcLabel)}<select name="service" data-service>${svcOptions(M)}<option>Something else</option></select></label>
${U.soon ? `<fieldset><legend>How soon?</legend><div class="slots" data-chips>${slotChips(U.soon, 1)}</div></fieldset>` : ''}
<div class="row2"><label>Name<input type="text" name="name" autocomplete="name" placeholder="Your name"></label><label>${second[0]}<input type="${second[1] === 'email' ? 'email' : 'text'}" name="${second[1]}" placeholder="${second[2]}"></label></div>
<label>Phone or WhatsApp<input name="phone" type="tel" autocomplete="tel" placeholder="Your number"></label>
<label>${hh(U.formMsg)}<textarea name="message" placeholder="${hh(U.formMsgPh)}"></textarea></label>
<button class="btn btn-primary btn-lg btn-block" type="submit">${hh(U.formSubmit)}</button>${legalLine()}</form>`;
  }
  const waBtn = M.wa ? `<a class="btn btn-wa" style="margin-top:1.6rem" href="${hh(M.waLink(`Hi ${M.name}, I'd like to ${M.ctaKey === 'reserve' ? 'book a table' : M.ctaKey === 'quote' ? 'ask about ' + U.formNoun.replace(/^(quote|brief|enquiry)$/, 'a $1').replace('a enquiry', 'an enquiry') : 'book'}.`))}" target="_blank" rel="noopener">${WA_SVG} Prefer WhatsApp? Message us</a>` : '';
  return { intro, form, waBtn, eyebrow: M.fam === 'food' && M.ctaKey !== 'reserve' ? 'Visit us' : M.C.eyebrow.book, h2: M.fam === 'food' && M.ctaKey !== 'reserve' ? 'Come and *see us.*' : M.C.h2.book };
}
function bookHTML(M) {
  const b = bookParts(M);
  return `<section id="book" class="section book-sec">${M.ph.contact ? `<div class="book-bg" aria-hidden="true"><img src="${M.ph.contact}" alt="" loading="lazy" width="1400" height="900"></div>` : ''}<div class="wrap book"><div class="book-copy reveal"><p class="eyebrow">${hh(b.eyebrow)}</p><h2>${headHTML(b.h2)}</h2><p>${hh(b.intro)}</p>${infoList(M)}${b.waBtn}</div>${b.form}</div></section>`;
}

/* About: the client's own words + two photos */
function aboutHTML(M) {
  const sents = splitSentences(M.d.about);
  const paras = [sents.slice(0, 2).join(' '), sents.slice(2, 5).join(' ')].map(t => t.trim()).filter(Boolean);
  const facts = [];
  if (M.place) facts.push(['pin', M.place]);
  if (M.services.length) facts.push(['sparkle', `${M.services.length} ${M.services.length > 1 ? M.U.nav.toLowerCase() : M.U.nav.toLowerCase().replace(/s$/, '')}`]);
  if (M.hours.length) facts.push(['clock', (M.hours[0][0] ? M.hours[0][0] + ': ' : '') + M.hours[0][1]]);
  return `<section id="about" class="section about-sec"><div class="wrap about">
<div class="about-media reveal"><figure class="am-a"><img src="${M.ph.about}" alt="${hh(M.ph.alts.about || M.name)}" loading="lazy" width="900" height="1100"></figure>${M.ph.about2 ? `<figure class="am-b"><img src="${M.ph.about2}" alt="" loading="lazy" width="700" height="700"></figure>` : ''}</div>
<div class="about-copy"><p class="eyebrow reveal">${hh(M.C.eyebrow.about)}</p><h2 class="reveal">${headHTML(M.C.h2.about)}</h2>${paras.map(p => `<p class="reveal">${hh(p)}</p>`).join('')}
${facts.length ? `<ul class="about-facts reveal">${facts.map(f => `<li>${svgI(f[0])}${hh(f[1])}</li>`).join('')}</ul>` : ''}</div></div></section>`;
}
function faqHTML(M) {
  return `<section id="faq" class="section"><div class="wrap faq-wrap"><div class="head left reveal"><p class="eyebrow">${hh(M.C.eyebrow.faq)}</p><h2>${headHTML(M.C.h2.faq)}</h2>${M.d.phone ? `<p>Can't see yours? Call us on <a href="${telHref(M.d.phone)}">${hh(M.d.phone)}</a>.</p>` : ''}</div>
<div class="faq">${M.faq.map((f, i) => `<details class="reveal"${i ? '' : ' open'}><summary>${hh(f[0])}</summary><p>${hh(f[1])}</p></details>`).join('')}</div></div></section>`;
}
function resBar(M) {
  const days = nextDays(6, false);
  return `<form class="resbar" data-demo-form><label>Date<select name="date">${days.map((x, i) => `<option>${i ? x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Tomorrow'}</option>`).join('')}</select></label>
<label>Time<select name="time">${['6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm'].map((t, i) => `<option${i === 2 ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
<label>Guests<select name="guests">${[1, 2, 3, 4, 5, 6, 8].map(n => `<option${n === 2 ? ' selected' : ''}>${n} ${n > 1 ? 'guests' : 'guest'}</option>`).join('')}</select></label>
<button class="btn btn-primary btn-lg" type="submit">${hh(M.C.cta.reserve)} ${svgI('arrow')}</button></form>`;
}
function quoteCard(M) {
  const opts = M.services.slice(0, 6).map((s, i) => `<button type="button" class="qopt${i ? '' : ' is-on'}" aria-pressed="${i ? 'false' : 'true'}" data-price="${hh(s.priceT)}" data-name="${hh(svcName(s.name))}">${svgI(s.icon)}<span>${hh(svcName(s.name))}</span></button>`).join('');
  const s0 = M.services[0] || { priceT: '', name: '' };
  return `<form class="qcard reveal" data-quote data-demo-form novalidate><h3>${hh(M.U.quoteTitle)}</h3><p class="sub">${hh(M.U.quoteSub)}</p><div class="qsteps"><span class="on"></span><span></span></div>
<div class="qpane" data-step="1"><div class="qopts">${opts}</div><div class="qresult"><div><small>Typical price</small><b data-qprice>${hh(s0.priceT || 'Ask us')}</b></div><button type="button" class="btn btn-primary" data-next>Next ${svgI('arrow')}</button></div></div>
<div class="qpane" data-step="2" hidden><label>${hh(M.U.quoteWhenLabel)}<select name="when">${M.U.quoteWhen.map((t, i) => `<option${i === 1 ? ' selected' : ''}>${hh(t)}</option>`).join('')}</select></label><div class="row2"><label>${hh(M.U.quoteWhere || 'Email')}<input type="${M.U.quoteWhere ? 'text' : 'email'}" name="${M.U.quoteWhere ? 'where' : 'email'}" placeholder="${M.U.quoteWhere === 'Postcode' ? 'e.g. LS1 4AB' : M.U.quoteWhere ? '' : 'you@email.com'}"></label><label>Phone<input name="phone" type="tel" placeholder="Your number"></label></div>
<div class="qnav"><button type="button" class="btn btn-ghost" data-back>Back</button><button class="btn btn-primary" type="submit">Send my request</button></div></div>${honey()}<p class="fine" style="margin-top:.9rem">${hh(M.U.quoteNote)}</p></form>`;
}
function caseCard(M) {
  return `<form class="qcard reveal" data-quote data-demo-form novalidate><h3>${hh(M.U.caseTitle)}</h3><p class="sub">${hh(M.U.caseSub)}</p><div class="qsteps"><span class="on"></span><span></span></div>
<div class="qpane" data-step="1"><label>${hh(M.U.q1)}<select name="area" data-service>${svcOptions(M)}<option>Something else</option></select></label><label>${hh(M.q2.q)}<select name="when">${M.q2.opts.map(t => `<option>${hh(t)}</option>`).join('')}</select></label><button type="button" class="btn btn-primary btn-block" data-next>Continue ${svgI('arrow')}</button></div>
<div class="qpane" data-step="2" hidden><div class="row2"><label>Name<input type="text" name="name" placeholder="Your name"></label><label>Phone<input name="phone" type="tel" placeholder="Your number"></label></div><label>Email<input name="email" type="email" placeholder="you@email.com"></label>
<div class="qnav"><button type="button" class="btn btn-ghost" data-back>Back</button><button class="btn btn-primary" type="submit">${hh(M.U.caseSubmit)}</button></div></div>${honey()}<p class="fine" style="margin-top:.9rem">${hh(M.U.caseNote)}</p></form>`;
}
function footerHTML(M) {
  const d = M.d, yr = new Date().getFullYear();
  const about = splitSentences(d.about)[0] || '';
  const visit = [d.address, ...M.hours.slice(0, 3).map(h => (h[0] ? h[0] + ': ' : '') + h[1])].filter(Boolean);
  const socials = [['Facebook', d.facebook], ['Instagram', d.instagram], ['Reviews', d.other]].filter(s => s[1]);
  const legal = M.U.legal ? `<p class="legal">${hh(M.U.legal)}</p>` : '';
  return `<footer class="footer"><div class="wrap"><div class="footer-in"><div><a href="#top" class="brand">${logoHTML(M)}</a><p>${hh(about.trim())}</p></div>
<div><h4>Visit</h4><ul>${visit.length ? visit.map(v => `<li>${hh(v)}</li>`).join('') : `<li>${hh(M.place || 'Get in touch')}</li>`}</ul></div>
<div><h4>Contact</h4><ul>${d.phone ? `<li><a href="${telHref(d.phone)}">${hh(d.phone)}</a></li>` : ''}${d.email ? `<li><a href="mailto:${hh(d.email)}">${hh(d.email)}</a></li>` : ''}${M.wa ? `<li><a href="${hh(M.waLink('Hi ' + M.name))}" target="_blank" rel="noopener">WhatsApp</a></li>` : ''}${socials.map(s => `<li><a href="${hh(s[1])}" target="_blank" rel="noopener">${s[0]}</a></li>`).join('')}</ul></div></div>
${legal}<div class="foot-base"><span>© ${yr} ${hh(d.name)} · <a href="#privacy">Privacy</a> · <a href="#terms">Terms</a></span><span>Website by <a href="${STUDIO.url}" target="_blank" rel="noopener">${STUDIO.name}</a></span></div></div></footer>`;
}
function fixedUI(M) {
  const wa = M.wa ? `<a class="wa-float" href="${hh(M.waLink(`Hi ${M.name}, I'm on your website and I'd like to ask about…`))}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_SVG}<span class="wa-label">Chat on WhatsApp</span></a>` : '';
  const callbar = ['legal', 'trade', 'auto', 'tech', 'pro'].includes(M.fam) && M.d.phone ? `<div class="callbar"><a class="btn btn-light" href="${telHref(M.d.phone)}">${svgI('phone')} Call now</a>${M.primary.kind === 'form' ? `<a class="btn btn-primary" href="#book">${hh(M.primary.short)}</a>` : ''}</div>` : '';
  const modal = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="dm-title" hidden><div class="m-card"><button class="m-x" type="button" aria-label="Close">×</button>${M.live ? `<p class="eyebrow">${hh(M.name)}</p><h3 id="dm-title">Thanks, your message is on its way.</h3><p data-m-msg>We'll get back to you as soon as we can. If it's urgent, call or message us.</p>` : `<p class="eyebrow">Website preview</p><h3 id="dm-title">This form goes live at launch.</h3><p>Nothing was sent. Once ${hh(M.name)} approves this website, this form will send real requests straight to ${M.d.email ? hh(M.d.email) : 'the team'}.</p>`}<div class="m-actions">${M.wa ? `<a class="btn btn-wa" href="${hh(M.waLink('Hi ' + M.name))}" target="_blank" rel="noopener">${WA_SVG} WhatsApp</a>` : ''}${M.d.phone ? `<a class="btn btn-ghost" href="${telHref(M.d.phone)}">Call ${hh(M.d.phone)}</a>` : ''}</div></div></div>`;
  return { html: `<div class="progress" aria-hidden="true"></div>${wa}${callbar}${modal}`, callbar: !!callbar };
}
