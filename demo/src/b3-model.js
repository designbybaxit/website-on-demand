/* ---------------- Model: everything the page needs, from the form only ---------------- */
function paletteFor(S, key, opts) {
  // Round 1 item 10: a change request ("dark with gold accent", "navy and white", "light and minimal") recolours
  // EVERY token: brand, buttons, accent, links, badges, soft fills, warm tints, footer/topbar (deep) and focus.
  const p = { ...S.pal };
  const light = !(S.dark);
  const c = opts.accent && /^#[0-9a-f]{6}$/i.test(opts.accent) ? opts.accent : '';
  let dark = S.dark && opts.dark !== false || (!S.dark && opts.dark === true);
  if (c) {
    if (light && S.pal.text === S.pal.brand) p.text = lumC(c) < 0.3 ? c : mixC(c, '#000000', 0.6);
    p.brand = c; p.accent = c;
    p.accentText = light ? (lumC(c) < 0.45 ? c : mixC(c, '#000000', 0.45)) : (lumC(c) > 0.35 ? c : mixC(c, '#ffffff', 0.45));
    p.soft = light ? mixC(c, '#ffffff', 0.9) : rgba(c, 0.14);
    p.warm = light ? mixC(c, '#ffffff', 0.72) : mixC(c, '#000000', 0.45);
    if (S.btnFrom === 'accent') p.soft = light ? mixC(c, '#ffffff', 0.85) : p.soft;
  }
  if (!S.dark && dark) {
    const b = c || p.brand, a = c || p.accent;
    Object.assign(p, { bg: c ? mixC(c, '#0a0a0a', 0.93) : mixC(b, '#060606', 0.8), surface: c ? mixC(c, '#141414', 0.88) : mixC(b, '#0b0b0b', 0.62), text: '#f3f1ee', muted: 'rgba(243,241,238,.7)', line: 'rgba(255,255,255,.12)',
      soft: rgba(/^#/.test(a) ? a : '#ffffff', 0.14), accentText: lumC(a) > 0.45 ? a : mixC(a, '#ffffff', 0.5), brand: a, accent: a, warm: mixC(a, '#000000', 0.45) });
  }
  if (S.dark && !dark) {
    const a = c || (/^#/.test(p.accent) ? p.accent : p.brand);
    Object.assign(p, { bg: '#fbf6ef', surface: '#ffffff', text: '#2a1d14', muted: '#6d5a4a', line: '#eadfce', soft: mixC(a, '#ffffff', 0.88), warm: mixC(a, '#ffffff', 0.7),
      accentText: lumC(a) < 0.45 ? a : mixC(a, '#000000', 0.45) });
    if (lumC(p.brand) > 0.6) p.brand = mixC(p.brand, '#000000', 0.35);
  }
  if (opts.minimal || opts.white) {
    // plain white (or near-black) canvas, hairline borders, colour only on actions and accents
    const a = /^#/.test(p.brand) ? p.brand : '#111111';
    if (dark) Object.assign(p, { bg: '#0b0b0b', surface: '#151515', line: 'rgba(255,255,255,.1)' });
    else Object.assign(p, { bg: '#ffffff', surface: opts.minimal ? '#fafafa' : '#ffffff', line: '#e9e9e9', soft: mixC(a, '#ffffff', 0.93), warm: mixC(a, '#ffffff', 0.86), text: lumC(p.text) < 0.2 ? p.text : '#151515', muted: '#5c5c5c' });
  }
  p.btn = S.btnFrom === 'accent' ? p.accent : p.brand;
  p.onBtn = S.onBtn && !c && !(dark && !S.dark) ? S.onBtn : lumC(p.btn) > 0.6 ? '#141414' : '#ffffff';
  p.deep = dark ? mixC(/^#/.test(p.bg) ? p.bg : '#111111', '#000000', 0.35)
    : c ? (lumC(c) < 0.35 ? c : mixC(c, '#000000', 0.55)) : (S.pal.deep || S.pal.brand);
  if (!dark && S.dark && !c) p.deep = lumC(p.brand) < 0.35 ? p.brand : mixC(p.brand, '#000000', 0.6);
  p.onDeep = '#ffffff';
  p.dark = dark;
  p.custom = !!(c || typeof opts.dark === 'boolean' || opts.minimal || opts.white);
  return p;
}

/* True only when the client themselves said quotes or estimates are free (about, trade, service name, description or a typed price). */
function offersFreeQuote(d) {
  const services = d && d.services || [];
  const raw = [d && d.about, d && d.industryOther, d && d.name, ...services.map(s => [s && s.name, s && s.desc, s && s.price].filter(Boolean).join(' '))].filter(Boolean).join(' ');
  const text = String(raw).replace(/\(.*?made-up.*?\)/ig, '');
  return /\bfree\s+(?:quotes?|estimates?)\b|\bquotes?\s+(?:are|is)\s+free\b|\bno[- ](?:charge|fee)\s+(?:for\s+)?quotes?\b/i.test(text);
}
function siteModel(d, opts = {}, ai = null) {
  d = sanitizeSiteData(d, { allowData: true });
  // content + imagery follow the real business; the look is the nearest of the six styles
  const prof = detectProfile(d);
  const key = opts.style && STYLES[opts.style] ? opts.style : (d.industry && d.industry !== 'other' && STYLES[d.industry] ? d.industry : prof.style);
  let { C, U, native } = copyFor(prof, key);
  C = { ...C, cta: { ...(C.cta || {}) }, eyebrow: { ...(C.eyebrow || {}) }, h2: { ...(C.h2 || {}) } };
  U = { ...U };
  const freeQuote = offersFreeQuote(d);
  if (freeQuote) {
    if (C.cta.quote === 'Get a quote') C.cta.quote = 'Get a free quote';
    if (U.quoteTitle === 'Get a quote') U.quoteTitle = 'Get a free quote';
    if (U.formSubmit === 'Get my quote') U.formSubmit = 'Get my free quote';
    if (U.actQuote === 'Get a quote in two quick steps.') U.actQuote = 'Get a free quote in two quick steps.';
    if (C.eyebrow.book === 'Get a quote') C.eyebrow.book = 'Free quote';
  }
  const fam = prof.fam;
  // TEMPLATE LIBRARY: kit (look) + hero + section variants + order, seeded by name + industry (+ opts.design)
  const design = pickDesign({ d, prof, key, opts, fam, profK: prof.k });
  const kit = LIB.kits[design.kit] || LIB.kits[LEGACY_KIT[key]];
  // the kit decides light/dark: a light kit must not inherit the legacy style's dark flag
  const S = { ...STYLES[key], ...kit, dark: !!kit.dark, btnFrom: kit.btnFrom || 'brand' }, seed = hash32(design.seed);
  const P = paletteFor(S, key, { ...opts, dark: typeof opts.dark === 'boolean' ? opts.dark : (opts.style ? prof.dark : undefined) });
  const country = COUNTRIES[d.country] || COUNTRIES.UK, cur = country.cur;
  const name = cleanName(d.name) || 'Your business';
  const words = name.split(/\s+/);
  const logoBold = words.length > 1 ? words[0] : name, logoRest = words.length > 1 ? words.slice(1).join(' ') : '';
  const initials = (words.filter(w => /^[A-Za-z0-9]/.test(w) && !/^(ltd|limited|co\.?|the|and|of|&)$/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')) || name[0].toUpperCase();
  const services = (d.services || []).filter(s => s.name).map(s => ({ ...s, name: titleCase(String(s.name).trim()), priceT: priceText(s.price, cur), icon: iconFor(s.name.replace(/^[^:]{2,24}:\s*(?=.)/, m => /drink/i.test(m) ? m : ''), fam === 'legal' ? 'scales' : fam === 'property' ? 'home' : fam === 'trade' || fam === 'auto' ? 'wrench' : fam === 'food' ? 'plate' : 'sparkle', s.desc || '') }));
  const plainNames = services.map(s => s.name.replace(/^[^:]{2,24}:\s*/, ''));
  const wa = waDigits(d);
  const waLink = t => wa ? `https://wa.me/${wa}?text=${encodeURIComponent(t)}` : '';
  const act = d.mainAction || (typeof PROF_ACT !== 'undefined' && PROF_ACT[prof.k]) || ({ dental: 'book', health: 'book', wellness: 'book', fitness: 'book', beauty: 'book', pets: 'book', education: 'book', food: 'reserve', auto: 'book' })[fam] || 'quote';
  const ctaKey = act === 'reserve' || (fam === 'food' && act === 'book') ? 'reserve' : act === 'quote' ? 'quote' : 'book';
  let primary;
  if (act === 'call' && d.phone) primary = { label: 'Call ' + d.phone, short: 'Call us', href: telHref(d.phone), kind: 'call' };
  else if (act === 'whatsapp' && wa) primary = { label: 'Message us on WhatsApp', short: 'WhatsApp us', href: waLink(`Hi ${name}, I found your website and I'd like to ask about…`), kind: 'wa' };
  else primary = { label: C.cta[ctaKey], short: C.cta[ctaKey], href: '#book', kind: 'form' };
  if (opts.ctaLabel && String(opts.ctaLabel).trim()) {
    const lab = String(opts.ctaLabel).trim();
    primary = { ...primary, label: lab, short: lab };
  }
  const place = d.city || '';
  const hasDental = /dent|teeth|tooth|smile|orthod|hygien/i.test(name + ' ' + plainNames.join(' '));
  const hours = parseHours(d.hours);
  const facts = extractFacts(d, services, hours);
  // copy variants (lib/50-copy.js): headline, lead opener, section titles and why-us titles, seeded like the design
  const cx = copyX(prof, design.seed, { facts, services, place, d });
  C = { ...C, eyebrow: { insurance: 'Paying for treatment', beforeafter: 'Before & after', ...C.eyebrow }, h2: { insurance: 'Cover, plans and *payment.*', beforeafter: 'See the *difference.*', ...C.h2, ...cx.h2 } };
  if (freeQuote && C.h2.book === 'Get your *quote.*') C.h2.book = 'Get your *free* quote.';
  if (prof.fam !== 'dental' && prof.fam !== 'health') C.eyebrow.insurance = 'Paying';
  if (cx.lead) C.leadOpen = cx.lead;
  const h1Pool = fam === 'dental' && !hasDental && C.h1Health ? C.h1Health : (cx.h1Pool || C.h1);
  // hero words come from the owner's own description, hours, town and services (lib/55-owner.js); stock lines only if nothing was typed
  const own = ownerHero(d, services, place, { ...opts, tradeRe: prof.kw });
  const ownIx = own.h1Pool.length ? (+opts.design || 0) % own.h1Pool.length : 0;
  const h1 = opts.headline ? clientHeadline(opts.headline) : (ai && ai.h1) || (own.h1Pool.length ? own.h1Pool[ownIx] : cx.h1Pool && h1Pool === cx.h1Pool ? seedPick(h1Pool, design.seed, 'h1') : pick(h1Pool, seed));

  // Eyebrow: what + where, from the client's own services
  const eyeSvc = plainNames.slice(0, 2).map((s, i) => i ? lowerFirst(s) : s);
  const eyebrow = (ai && ai.eyebrow) || (eyeSvc.length ? eyeSvc.join(' · ') : (d.industryOther || INDUSTRIES.find(i => i[0] === d.industry)?.[1] || '')) + (place ? ' in ' + place : '');

  // Lead: his voice, built only from inputs
  const svcList = listJoin(plainNames.slice(0, 3).map((s, i) => i ? lowerFirst(s) : s));
  const anyPrice = services.some(s => s.priceT);
  const pricedN = services.filter(s => s.priceT && /\d/.test(s.priceT)).length;
  // "clear prices" is only claimed when most services really show a price (and never for a food menu)
  const pricesClear = fam !== 'food' && services.length > 0 && pricedN / services.length >= 0.6;
  const actLine = primary.kind === 'wa' ? 'Message us on WhatsApp any time.' : primary.kind === 'call' ? `Call ${d.phone} to talk it through.` :
    ({ book: 'Book online in under a minute.', reserve: 'Reserve your table online in seconds.', quote: U.actQuote })[ctaKey];
  let lead = (ai && ai.lead) || [own.lead || (own.h1Pool.length ? '' : C.leadOpen), svcList ? `${svcList}${place ? ' in ' + place : ''}${pricesClear ? ', with clear prices up front' : ''}.` : '', actLine].filter(Boolean).join(' ');
  if (opts.lead && String(opts.lead).trim()) lead = String(opts.lead).trim();

  // Photos: client's own first, then the curated set for the REAL industry
  // section order: the recipe's rhythm, gated by what fits the real business
  let order = design.order.slice();
  if (fam !== 'property') order = order.filter(k => k !== 'calc');
  if (order.includes('menu') && !['food', 'beauty', 'pets', 'retail', 'events', 'wellness'].includes(fam)) order = order.map(k => k === 'menu' ? 'services' : k);
  if (!order.includes('menu') && fam === 'food') order = order.map(k => k === 'services' ? 'menu' : k);
  const ai0 = order.findIndex(k => k === 'services' || k === 'menu');
  if (!order.includes('about')) order.splice(ai0 >= 0 ? ai0 + 1 : 2, 0, 'about');
  // research sections: shown only when the client gave the data for them
  const BA_FAMS = ['dental', 'beauty', 'trade', 'auto', 'pets', 'health', 'wellness', 'creative'];
  const ba = BA_FAMS.includes(fam) ? (Array.isArray(d.ba) ? d.ba : []).filter(p => p && p.b && p.a).slice(0, 4).map(p => ({ b: p.b, a: p.a, t: String(p.t || '').slice(0, 40) })) : [];
  // cover / finance / payment section only where it fits the trade (never restaurants, salons, shops…)
  const ins = ['dental', 'health', 'wellness', 'pets', 'auto', 'trade'].includes(fam) ? insuranceFacts(d) : { features: [], plans: [], any: false };
  const emergency = offersEmergency(d, services);
  const week = weekHours(hours);
  if (!ba.length) order = order.filter(k => k !== 'beforeafter');
  if (!ins.any) order = order.filter(k => k !== 'insurance');
  // the client's own uploads and facts always get their section, even when the recipe left it out
  const putBefore = (k, targets) => { if (order.includes(k)) return; const i = order.findIndex(x => targets.includes(x)); order.splice(i < 0 ? order.length : i, 0, k); };
  if (ba.length) { const i = order.indexOf('services'); if (!order.includes('beforeafter')) order.splice(i < 0 ? 1 : i + 1, 0, 'beforeafter'); }
  if (ins.any) putBefore('insurance', ['faq', 'book', 'cta']);
  if (order.includes('infobar') && order[0] !== 'hero') order = order.filter(k => k !== 'infobar');
  order = [...new Set(order)];
  let heroV = design.hero;
  if (heroV === 'search' && fam !== 'property') heroV = 'split';
  const V = { ...design.variants, hero: heroV };
  if (heroV === 'field' && V.infobar === 'float') V.infobar = 'tiles';   // the field hero already has an overlapping panel
  // Photos: client's own first, then the curated set for the REAL industry; each photo once per page
  const up = (d.photos || []).filter(Boolean);
  const stock = !up.length;
  const need = {};
  const addNeed = n => Object.entries(n || {}).forEach(([k, v]) => { need[k] = Math.max(need[k] || 0, v); });
  const vdef = k => variantDef(k === 'hero' ? 'hero' : k, V[k] || Object.keys(LIB.sections[k] || {})[0]);
  ['hero', ...order].forEach(k => { const v = vdef(k); if (v && v.needs) addNeed(v.needs()); });
  if (order.includes('menu') && (fam === 'food' || fam === 'beauty')) need.svcShown = services.map(() => true);   // every item may get its own matched photo
  else if (order.includes('menu')) { const seen = new Set(); need.svcShown = services.map(s => { const m = s.name.match(/^([^:]{2,24}):/); const g = (m ? m[1] : 'Menu').toLowerCase(); if (seen.has(g)) return false; seen.add(g); return true; }); }
  else if (!order.includes('services')) need.svcShown = services.map(() => false);
  if (!d.about) { need.about = 0; need.about2 = 0; }
  const ph = allocPhotos(prof, up, services, name, need, design.seed, [d.name, d.industryOther, d.about].join(' '), { designIx: +opts.design || 0, biz: `${String(name).toLowerCase()}|${prof.k}` });
  applyPhotoOverrides(ph, d.photoOverrides);
  // Reviews and stats: real ones if given; otherwise visibly-tagged samples (preview only)
  const realReviews = parseReviews(d.reviews);
  const reviews = realReviews.length ? realReviews.map(r => ({ q: r[0], n: r[1], sample: false })) :
    C.reviews.map(r => ({ q: r[0], n: r[1], sample: true }));
  const realStats = parseStats(d.stats);
  const fStats = factStats(facts, { d, services, fam, U });
  const stats = realStats.length ? realStats.map(s => ({ v: s[0], suf: s[1], l: s[2], sample: false })) :
    fStats.length >= 2 && facts.some(f => f.stat) ? fStats :
    C.stats.map(s => ({ v: s[0], suf: s[1], l: s[2], sample: true }));
  // Round 1 item 7: a rating out of 5 always reads "4.8 ★"
  stats.forEach(s => { if (/^[1-5](\.\d)?$/.test(String(s.v)) && (/★/.test(s.suf) || /\b(rating|rated|review score|stars?)\b/i.test(s.l))) { s.suf = ' ★'; s.text = true; s.l = s.l.replace(/^(?:stars?|★)\s*/i, '').replace(/^\/\s*5\s*/, '') || 'average rating'; } });

  // "Why us" points written only from what the client told us
  const sentences = splitSentences(d.about);
  const why = facts.filter(f => f.why).filter((f, i, l) => l.findIndex(g => g.why[1] === f.why[1]) === i).slice(0, 2).map(f => f.why);
  const aboutLine = sentences.find(s => /famil|since|years|qualified|registered|insured|certified|independent|founded|award|trained|specialis|accredit|local|experience/i.test(s));
  if (services.length > 1) why.push([cx.why.all, `${listJoin(plainNames.slice(0, 3).map((s, i) => i ? lowerFirst(s) : s))}${plainNames.length > 3 ? ' and more' : ''}, all with ${name}.`]);
  if (pricesClear && !why.some(w => /price/i.test(w[0]))) why.push([cx.why.price, pricedN === services.length ? 'Every service on this page shows its price, so you know where you stand.' : 'Most services on this page show their price, so you know where you stand.']);
  const late = hours.find(h => /sat|sun|24|late|evening|weekend/i.test(h.join(' ')));
  if (late) why.push([cx.why.late, `${late[0] ? late[0] + ': ' : ''}${late[1]}.`.replace('..', '.')]);
  else if (hours.length) why.push([cx.why.hours, `${hours[0][0] ? hours[0][0] + ': ' : ''}${hours[0][1]}.`.replace('..', '.')]);
  const channels = [d.phone && 'call', wa && 'WhatsApp', d.email && 'email'].filter(Boolean);
  if (channels.length > 1) why.push([cx.why.reach, `${listJoin(channels).replace(/^./, c => c.toUpperCase())}, whichever suits you best.`]);
  if (place) why.push([cx.why.local, d.address ? `Find us at ${d.address}.` : `Based in ${place}${d.areas ? ', covering ' + d.areas : ''}.`]);
  const whyFinal = ((ai && ai.why) || why).slice(0, 4);

  // FAQ written only from inputs
  const faq = [];
  const how = primary.kind === 'wa' ? `Tap the WhatsApp button and send us a message${d.phone ? `, or call ${d.phone}` : ''}.` :
    primary.kind === 'call' ? `Call us on ${d.phone}${wa ? ' or message us on WhatsApp' : ''}.` :
      `Use the ${ctaKey === 'reserve' ? 'reservation' : ctaKey === 'quote' ? U.formNoun : 'booking'} form on this page${d.phone ? `, or call ${d.phone}` : ''}${wa ? '. You can also message us on WhatsApp' : ''}.`;
  faq.push([{ book: 'How do I book?', reserve: 'How do I reserve a table?', quote: U.faqQuote }[ctaKey], how]);
  const priced = services.filter(s => s.priceT && /\d/.test(s.priceT));
  if (priced.length) faq.push(['What does it cost?', `${priced.slice(0, 3).map(s => `${s.name.replace(/^[^:]{2,24}:\s*/, '')}: ${s.priceT.replace(/^From /, 'from ')}`).join('; ')}.${fam === 'food' ? '' : priced.length < services.length ? ' Ask us about anything without a price.' : ''}`]);
  if (hours.length) faq.push(['When are you open?', hours.map(h => (h[0] ? h[0] + ': ' : '') + h[1]).join(' · ') + '.']);
  if (d.address || place) faq.push([fam === 'trade' || fam === 'auto' ? 'Which areas do you cover?' : 'Where are you?', d.address ? `You'll find us at ${d.address}.${d.areas ? ' We also cover ' + d.areas + '.' : ''}` : `We're based in ${place}${d.areas ? ' and cover ' + d.areas : ''}.`]);
  if (services.length) faq.push(['What services do you offer?', `${listJoin(plainNames.slice(0, 6))}. Ask us if you need something not listed.`]);
  const faqFinal = ((ai && ai.faq) || faq).slice(0, 5);

  const placeholders = [];
  if (reviews[0].sample) placeholders.push('Sample reviews: replace with real reviews (with permission) or remove before launch.');
  if (stats[0].sample) placeholders.push('Sample figures: replace with real numbers or remove before launch.');
  if (stock) placeholders.push(`Stock photos (free-licence Unsplash/Pexels, matched to ${prof.label.toLowerCase()}): swap for your own photos if you have them.`);
  else if (ph.mixed) placeholders.push('Some sections use matched stock photos (Unsplash/Pexels): add more of your own photos to replace them.');
  if (!d.address) placeholders.push('No address given: map and address line left out.');
  if (!hours.length) placeholders.push('No opening hours given: hours list left out.');
  if (!wa) placeholders.push('No WhatsApp number: floating WhatsApp button left out.');

  // law: "when did it happen?" only fits incident-type matters
  const incident = /injur|accident|claim|negligen|crash|incident|dismiss|crim|arrest/i.test(plainNames.join(' '));
  const q2 = fam === 'legal' && !incident ? { q: UI_BASE.q2, opts: UI_BASE.q2opts } : { q: U.q2, opts: U.q2opts };
  // food without table booking: visit steps, not "reserve / arrive"
  const steps = fam === 'food' && ctaKey !== 'reserve' ? [['Find us', d.address ? d.address + '.' : place ? `We're in ${place}.` : 'Our details are below.'], ['Drop in', hours.length ? `${hours[0][0] ? hours[0][0] + ': ' : ''}${hours[0][1]}.`.replace('..', '.') : 'Pop in whenever we\'re open.'], ['Enjoy', plainNames.length ? `Try the ${lowerFirst(plainNames[0])}.` : 'Pull up a seat and enjoy.']] : C.steps;
  const heroQuote = ['fullbleed', 'panel'].includes(heroV) && (['trade', 'auto'].includes(fam) || prof.k === 'cleaning') && primary.kind === 'form' && ctaKey === 'quote';
  return { key, prof, order, heroV, V, design, kit, facts, pricesClear, freeQuote, q2, steps, heroQuote, fam, native, U, S, C, P, d, opts, seed, name, logoBold, logoRest, initials, services, plainNames, wa, waLink, primary, ctaKey, place, cur,
    ba, ins, emergency, week, cx,
    h1, eyebrow, lead, ph, stock, reviews, stats, hours, why: whyFinal, faq: faqFinal, placeholders, svcList, anyPrice };
}
