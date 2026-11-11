/* =====================================================================
   SELECTION: kit + hero + section variants + section order, then photos,
   then the client's real facts. Pure functions of (form data, opts), so the
   admin rebuild at publish time produces exactly what the client approved.
   ===================================================================== */
const SECTION_TYPES = ['services', 'menu', 'why', 'stats', 'about', 'gallery', 'reviews', 'process', 'faq', 'cta', 'book', 'footer', 'infobar', 'beforeafter', 'insurance'];
/* Round 1 item 11: designs 1, 2 and 3 in the preview ("Show me another design") must differ in LAYOUT,
   not just colour: a different hero structure from the previous two designs, a different section order
   where the industry has more than one, and re-rolled section variants when too few changed. */
const HERO_GENERIC = ['split', 'editorial', 'fullbleed', 'panel', 'mosaic', 'framed', 'arch'];
function pickDesign(ctx) {
  const base = pickDesign0(ctx), ix = +(ctx.opts && ctx.opts.design) || 0;
  if (!ix || (ctx.opts && ctx.opts.style) || ctx.noSpread) return base;
  const prev = [];
  for (let j = Math.max(0, ix - 2); j < ix; j++) prev.push(pickDesign({ ...ctx, opts: { ...ctx.opts, design: j }, noSpread: j === 0 }));
  const ind = industryFor(ctx.prof, ctx.key);
  const fitsH = h => LIB.sections.hero[h] && LIB.sections.hero[h].fits(ctx);
  const used = new Set(prev.map(p => p.hero));
  if (used.has(base.hero)) {
    const own = ind.hero.filter(h => fitsH(h) && !used.has(h));
    const gen = HERO_GENERIC.filter(h => fitsH(h) && !used.has(h));
    const pool = own.length ? own : gen;
    if (pool.length) base.hero = seedPick(pool, base.seed, 'hero-spread'); base.variants.hero = base.hero;
  }
  const last = prev[prev.length - 1];
  if (ind.orders.length > 1 && base.order.join() === last.order.join()) { base.orderIx = (last.orderIx + 1) % ind.orders.length; base.order = ind.orders[base.orderIx].slice(); }
  const seen = o => prev.some(p => p.order.join() === o.join());
  if (ind.orders.length === 1 || seen(base.order)) {
    // one recipe only: rearrange the middle sections so the page reads in a different order
    const fixed = new Set(['hero', 'infobar', 'ribbon', 'book', 'faq', 'cta']);
    const mid = base.order.map((k, i) => [k, i]).filter(([k]) => !fixed.has(k));
    if (mid.length >= 3) {
      const ks = mid.map(m => m[0]);
      const opts2 = [[ks[1], ks[0], ...ks.slice(2)], [...ks.slice(1, 3), ks[0], ...ks.slice(3)], [ks[0], ks[2], ks[1], ...ks.slice(3)]];
      const start = ix % 2 ? 0 : 1;
      for (let n = 0; n < 3; n++) {
        const re = opts2[(start + n) % 3], o = base.order.slice();
        mid.forEach(([, i], m) => { o[i] = re[m]; });
        if (!seen(o)) { base.order = o; break; }
      }
    }
  }
  const changed = () => SECTION_TYPES.filter(t => base.order.includes(t) && base.variants[t] !== last.variants[t]).length;
  for (let r = 0; r < 4 && changed() < 3; r++) SECTION_TYPES.forEach(t => {
    if (!base.order.includes(t) || base.variants[t] !== last.variants[t]) return;
    const all = Object.values(LIB.sections[t] || {}).filter(v => v.fits(ctx) && (!ind.variants || !ind.variants[t] || ind.variants[t].includes(v.id))).map(v => v.id).filter(id => id !== last.variants[t]);
    if (all.length) base.variants[t] = seedPick(all, base.seed, 'spread-' + t + r);
  });
  return base;
}
function pickDesign0(ctx) {
  const { d, prof, key, opts } = ctx;
  const ind = industryFor(prof, key);
  const seed = designSeed(d, ind.id, opts);
  const forced = opts.style && STYLES[opts.style];
  const kitId = forced ? LEGACY_KIT[opts.style] : seedPick(ind.kits.filter(k => LIB.kits[k]), seed, 'kit');
  const heroes = (forced ? [STYLES[opts.style].hero] : ind.hero).filter(h => LIB.sections.hero[h] && LIB.sections.hero[h].fits(ctx));
  const hero = heroes.length ? seedPick(heroes, seed, 'hero') : 'split';
  const orders = forced ? [STYLES[opts.style].order] : ind.orders;
  const orderIx = hash32(seed + '|order') % orders.length;
  const variants = { hero };
  SECTION_TYPES.forEach(t => {
    const all = Object.values(LIB.sections[t] || {}).filter(v => v.fits(ctx) && (!ind.variants || !ind.variants[t] || ind.variants[t].includes(v.id)));
    variants[t] = all.length ? seedPick(all.map(v => v.id), seed, t) : null;
  });
  return { industry: ind.id, kit: kitId, hero, order: orders[orderIx].slice(), orderIx, variants, seed };
}

/* Photos: client uploads first, then the curated stock for the REAL industry.
   No photo appears twice on one page; optional slots are simply left out when the pool runs dry. */
const STOP = new Set(['and', 'the', 'for', 'with', 'your', 'our', 'from', 'all', 'any', 'new', 'full', 'per', 'hour', 'one', 'two', 'day', 'free', 'quote', 'service', 'services', 'package', 'basic', 'standard', 'premium']);
const stemW = w => w.slice(0, 5);
function photoPool(prof, blob) {
  const sub = typeof subtypeFor === 'function' ? subtypeFor(prof, blob || '') : null;
  if (sub) {
    // the owner's cuisine / sub-trade set, plus the trade's room / service shots (never another cuisine's dishes)
    const base = LIB.photos[prof.k] || { heroes: [], pool: [] };
    const tags = new Map(); sub.pool.forEach(x => tags.set(x[0], x[1]));
    base.pool.forEach(x => { if (SUB_NEUTRAL.test(x[1]) && !tags.has(x[0])) tags.set(x[0], x[1]); });
    return { ids: [...tags.keys()], tags, only: new Set(), heroes: sub.heroes.slice(), extra: base, sub: sub.k };
  }
  const extra = LIB.photos[prof.k] || { heroes: [], pool: [] };
  const tags = new Map();
  const add = (id, t) => { if (!id) return; tags.set(id, ((tags.get(id) || '') + ' ' + (t || '')).trim()); };
  const only = new Set();   // subject-specific shots (a toothache, an implant model): only used when a service asks for them
  extra.pool.forEach(x => { add(x[0], x[1]); if (x[2] && x[2].only) only.add(x[0]); });
  prof.pool.forEach(x => add(x[0], x[1]));
  [prof.hero, prof.split, prof.about, ...prof.gallery, prof.contact].forEach(id => add(id, ''));
  return { ids: [...tags.keys()], tags, only, heroes: [...new Set([...(extra.heroes || []), prof.hero])], extra };
}
function allocPhotos(prof, up, services, name, need, seed, biasText, rot) {
  const blob = `${biasText || ''} ${name || ''} ${services.map(s => (s.name || '') + ' ' + (s.desc || '')).join(' ')}`;
  const P = photoPool(prof, blob), used = new Set(), label = prof.label.replace(/ &.*$/, '');
  // menus (food, salons, barbers): an item gets a photo only when its name matches a photo's keywords
  const strict = prof.fam === 'food' || prof.fam === 'beauty';
  const take = id => { if (!id || used.has(id)) return null; used.add(id); return id; };
  const free = () => P.ids.filter(id => !used.has(id) && !P.only.has(id));
  const freeAll = () => P.ids.filter(id => !used.has(id));
  const firstFree = list => list.find(id => !used.has(id));
  const tagWords = id => (P.tags.get(id) || '').toLowerCase().split(/\s+/).filter(Boolean);
  const upl = up.slice();
  // 1. hero: an upload, else a seeded pick from the people-at-work list.
  // Cleaning leans residential or commercial from the client's own words, without inventing a menu.
  let heroList = P.heroes.slice();
  if (prof.k === 'cleaning') {
    const office = /\boffice|commercial|workplace|janitorial\b/i.test(blob);
    const home = /\bhome|house|apartment|domestic|residential|kitchen|bathroom|\bflat\b/i.test(blob);
    const prefer = office && !home ? /office|commercial|janitorial|team/i : (!office ? /kitchen|bathroom|vacuum|mop|domestic|window|home|floor/i : null);
    if (prefer) {
      const ranked = P.ids.filter(id => prefer.test(P.tags.get(id) || ''));
      if (ranked.length) heroList = [...new Set(ranked.concat(heroList))];
    }
  }
  // Hero rotates through the trade's hero list by design number (order fixed per business), so
  // "Show me another design" never repeats the previous design's hero photo.
  let heroStock = null;
  if (!upl.length) {
    const hl = heroList.filter(id => !P.only.has(id) && !used.has(id));
    if (rot && hl.length) {
      const order = prof.k === 'cleaning' ? hl : seedShuffle(hl, rot.biz, 'heroRot');
      heroStock = take(order[rot.designIx % order.length]);
    } else heroStock = take(seedShuffle(heroList, seed, 'heroPhoto').find(id => !used.has(id)));
  }
  const hero = upl.length ? upl.shift() : heroStock;
  const heroExtra = [];
  for (let i = 0; i < (need.heroExtra || 0); i++) heroExtra.push(take(seedShuffle(P.heroes.concat(free()), seed, 'hx' + i).find(id => !used.has(id))));
  // 2. service / menu cards: best tag match, ties broken by the seed
  const shown = need.svcShown || services.map(() => true);
  const svc = services.map((s, i) => {
    if (!shown[i]) return null;
    const words = (String(s.name + ' ' + (s.desc || '')).toLowerCase().match(/[a-z]{3,}/g) || []).filter(w => !STOP.has(w));
    const cands = seedShuffle(freeAll(), seed, 'svc' + i);
    let best = null, bestScore = 0;
    cands.forEach(id => {
      const hits = tagWords(id).reduce((a, t) => a + (words.some(w => stemW(w) === stemW(t) || (t.length > 3 && w.startsWith(t)) || (w.length > 3 && t.startsWith(w))) ? 1 : 0), 0);
      if (hits > bestScore) { best = id; bestScore = hits; }
    });
    return take(best || (strict ? null : cands.find(id => !P.only.has(id))));
  });
  // 3. the rest, in page-importance order; uploads fill the people/place slots first
  // a preferred "place" shot rotates with similar shots (interiors, team, reception) so businesses don't all share one photo
  const PLACE = /\b(interior|clinic|room|studio|shop|reception|premises|team|salon|workshop|van|kitchen|dining|counter)\b/;
  const placeLike = () => free().filter(id => PLACE.test(P.tags.get(id) || ''));
  const slot = (prefer) => upl.length ? upl.shift() : take(firstFree(prefer
    ? [...seedShuffle([prefer, ...placeLike()].filter(id => !used.has(id)).slice(0, 6), seed, 'pref' + used.size), ...seedShuffle(free(), seed, 'slot' + used.size)]
    : seedShuffle(free(), seed, 'slot' + used.size)));
  const split = need.split ? slot(prof.split) : null;
  const about = need.about ? slot(prof.about) : null;
  const about2 = need.about2 ? slot(null) : null;
  const circle = need.circle ? take(firstFree(seedShuffle(free(), seed, 'circle'))) : null;
  const contact = need.contact ? take(firstFree([prof.contact, ...seedShuffle(free(), seed, 'contact')].filter(Boolean))) : null;
  const cta = need.cta ? take(firstFree(seedShuffle(free(), seed, 'cta'))) : null;
  const rv = need.rv ? take(firstFree(seedShuffle(free(), seed, 'rv'))) : null;
  let gallery = [], galleryStock = true;
  if (upl.length >= 3) { gallery = upl.splice(0); galleryStock = false; }
  else if (need.gallery) { const g = seedShuffle(free(), seed, 'gallery').slice(0, need.gallery); if (g.length >= 3) { g.forEach(take); gallery = g; } }
  const fresh = free();
  const steps = need.steps && fresh.length >= 3 ? seedShuffle(fresh, seed, 'steps').slice(0, 3).map(take) : null;
  const W = (id, w, h) => id ? IMG(id, w, h) : '';
  const isUp = x => /^data:/.test(x || '');
  return {
    hero: isUp(hero) ? hero : W(hero, 1100),
    heroSet: isUp(hero) || !hero ? '' : `${W(hero, 640)} 640w, ${W(hero, 1100)} 1100w, ${W(hero, 1600)} 1600w`,
    heroExtra: heroExtra.filter(Boolean).map(id => W(id, 700, 820)),
    split: isUp(split) ? split : W(split, 1000),
    about: isUp(about) ? about : W(about, 900),
    about2: isUp(about2) ? about2 : W(about2, 700),
    circle: W(circle, 420),
    gallery: galleryStock ? gallery.map(id => W(id, 800)) : gallery,
    galleryStock,
    services: svc.map((id, i) => id ? W(id, 640, 420) : ''),
    steps: steps ? steps.map(id => W(id, 640, 400)) : null,
    contact: W(contact, 1400),
    cta: W(cta, 1400),
    rv: W(rv, 800, 1000),
    mixed: up.length > 0,
    heroId: hero && !isUp(hero) ? hero : 'upload',
    alts: { hero: isUp(hero) ? `${name}: photo` : label, split: isUp(split) ? `Inside ${name}` : label + ' at work', circle: `${name}: detail`, about: isUp(about) ? `${name}: photo` : label },
  };
}

/* ---------- The client's real facts, pulled only from what they typed ---------- */
const BODIES = /\b(Gas Safe|NICEIC|NAPIT|ELECSA|GDC|CQC|HCPC|RICS|SRA|TrustMark|Checkatrade|OFTEC|HETAS|FENSA|CSCS|BICSc|CIPHE|DHA|MOH|DED|RERA)\b/;
function extractFacts(d, services, hours) {
  const about = String(d.about || '').replace(/\(.*?made-up.*?\)/ig, '');
  const svcText = services.map(s => s.name + '. ' + (s.desc || '') + '. ' + (s.price || '')).join(' ');
  const all = about + ' ' + svcText + ' ' + (d.hours || '');
  const sent = re => splitSentences(about).find(s => re.test(s));
  const F = [];   // {k, proof, chip:[icon,small,bold], why:[title, body], stat:{...}}
  const add = f => { if (!F.some(x => x.k === f.k)) F.push(f); };
  const body = all.match(BODIES);
  if (body) {
    const b = body[1], gs = /gas safe/i.test(b);
    add({ k: 'body', proof: gs ? 'Gas Safe registered' : `${b} registered`, chip: ['shield', gs ? 'Gas Safe' : b, 'registered'], why: [`${gs ? 'Gas Safe' : b} registered.`, sent(BODIES) || `We're registered with ${b}.`] });
  }
  if (/\bfully insured\b/i.test(all)) add({ k: 'ins', proof: 'Fully insured', chip: ['shield', 'Fully', 'insured'], why: ['Fully insured.', sent(/insured/i) || 'Every job is fully insured.'] });
  else if (/\binsured\b/i.test(all)) add({ k: 'ins', proof: 'Insured', chip: ['shield', 'Insured', 'for your peace of mind'], why: ['Insured.', sent(/insured/i)] });
  if (/\blicen[cs]ed\b/i.test(all)) add({ k: 'lic', proof: 'Licensed', why: ['Licensed.', sent(/licen[cs]ed/i)] });
  if (/\bDBS\b/.test(all)) add({ k: 'dbs', proof: 'DBS checked', why: ['DBS checked.', sent(/\bDBS\b/)] });
  const yr = about.match(/\b(\d{1,2})\+?\s*years?\b(?:\s+of)?\s*(experience|trading|in business|serving|looking after|caring|on the|in the trade)?/i);
  const since = about.match(/\b(?:since|established(?: in)?|est\.?|founded(?: in)?|opened(?: in)?|trading since)\s*((?:19|20)\d\d)\b/i);
  const nowY = new Date().getFullYear();
  if (since && +since[1] <= nowY) add({ k: 'since', proof: `Established ${since[1]}`, chip: ['calendar', 'Established', since[1]], why: [`Here since ${since[1]}.`, sent(/since|established|founded|opened/i)], stat: { v: since[1], suf: '', l: 'the year we opened our doors', text: true } });
  else if (yr && +yr[1] > 0) {
    // Round 1 item 8: exactly as typed: "12 years" stays "12 years" (a "+" only when the owner typed one)
    const plus = /^\d{1,2}\+/.test(yr[0]) ? '+' : '', kind = (yr[2] || '').toLowerCase(), of = /\bof\s/i.test(yr[0]) && kind ? 'of ' : '';
    const n = `${yr[1]}${plus} year${+yr[1] === 1 ? '' : 's'}`, tail = kind ? ` ${of}${kind}` : '';
    add({ k: 'years', proof: n + tail, chip: ['star', n, kind ? of + kind : ''], why: [`${n}${tail}.`, sent(/years?/i)], stat: { v: yr[1], suf: plus, l: `year${+yr[1] === 1 ? '' : 's'}${tail}` } });
  }
  const rt = about.match(/\b(?:rated|rating(?: of)?|average(?: of)?)\s+([1-5]\.\d|[1-5])(?:\s*(?:\/\s*5|out of (?:5|five)|stars?|★))*(?:\s+(?:on|from|across)\s+(Google|Trustpilot|Tripadvisor|TripAdvisor|Yelp|Facebook|Checkatrade|Treatwell|Fresha|Booksy|Rated People|Which\?|Airbnb|Feefo|Doctify|Zocdoc))?/i);
  if (rt) add({ k: 'rating', proof: `${rt[1]} ★${rt[2] ? ' on ' + rt[2] : ' rating'}`, chip: ['star', `${rt[1]} ★`, rt[2] ? 'on ' + rt[2] : 'rating'], stat: { v: rt[1], suf: ' ★', l: rt[2] ? 'on ' + rt[2] : 'average rating', text: true } });
  // only when the business says it about ITSELF ("X is a family-run practice", "we're independent"), not "for independent businesses"
  const fam = about.match(/\b(?:is|are|we're|we are|we've been|has been)\s+(?:an?\s+)?(?:small[, ]+|proudly\s+|friendly[, ]+)*(family[- ]run|family[- ]owned|independent(?:ly owned)?|locally owned)\b/i);
  if (fam) { const f = fam[1].toLowerCase().replace(/ /g, '-').replace('independently-owned', 'independently owned'); const F1 = f[0].toUpperCase() + f.slice(1);
    add({ k: 'fam', proof: F1, why: [/^family/.test(f) ? 'Family-run, and proud of it.' : /^indep/.test(f) ? 'Proudly independent.' : 'Locally owned.', sent(new RegExp(fam[1].replace(/[- ]/g, '[- ]'), 'i'))] }); }
  const fq = (about + ' ' + services.map(s => s.name).join('. ')).match(/\bfree (quotes?|consultations?|estimates?|assessments?|survey|valuations?|check-?ups?)\b/i);
  if (fq) add({ k: 'free', proof: 'Free ' + fq[1].toLowerCase().replace(/s?$/, 's').replace('surveys', 'surveys'), chip: ['sparkle', 'Free', fq[1].toLowerCase()] });
  if (/\b24\s*\/\s*7\b|\b24 hours\b|24-hour/i.test(all)) add({ k: '247', proof: /emergenc|call.?out/i.test(all) ? '24/7 emergency call-outs' : 'Open 24/7', chip: ['clock', 'Available', '24/7'], why: ['There when you need us.', sent(/24\s*\/\s*7|24 hours|24-hour/i) || 'Available 24 hours a day, 7 days a week.'], stat: { v: '24/7', suf: '', l: /emergenc|call.?out/i.test(all) ? 'emergency call-outs' : 'open every day', text: true } });
  else if (/\bsame[- ]day\b/i.test(all)) add({ k: 'sameday', proof: 'Same-day appointments' .replace('appointments', /plumb|electric|repair|call.?out|job/i.test(all) ? 'call-outs' : 'appointments'), why: ['Same-day help.', sent(/same[- ]day/i)] });
  else if (services.some(s => /emergenc/i.test(s.name))) add({ k: 'emerg', proof: 'Emergency appointments'.replace('appointments', /\bdent|tooth|teeth/i.test(all) ? 'appointments' : 'call-outs') });
  const wel = about.match(/\b((?:nervous|anxious|new|nhs|private|walk-?in|dog|pet|kid|child|famil|wheelchair|student)[\w-]*(?: [a-z]+)?)\s+(?:are\s+|is\s+)?(?:always\s+|very\s+|all\s+)?welcome\b/i);
  if (wel) add({ k: 'welcome', proof: wel[1][0].toUpperCase() + wel[1].slice(1).toLowerCase() + ' welcome', why: [wel[1][0].toUpperCase() + wel[1].slice(1).toLowerCase() + ' welcome.', sent(/welcome/i)] });
  const lang = about.match(/\bwe (?:also )?speak ([A-Z][a-z]+(?:(?:,| and| &) ?[A-Z][a-z]+)*)/);
  if (lang) add({ k: 'lang', proof: 'We speak ' + lang[1], why: ['We speak your language.', sent(/speak/)] });
  if (/\b(fixed[- ]price|fixed prices|fixed fees|up-?front (?:price|pricing|quote|costs?)|costs up[- ]?front|no hidden (?:fees|charges|costs))/i.test(all)) { const t = /no hidden/i.test(all) ? 'No hidden charges' : /costs? up[- ]?front|up-?front costs?|fixed fees/i.test(all) ? 'Costs agreed up front' : 'Fixed, upfront prices';
    add({ k: 'fixed', proof: t, why: [t + '.', sent(/fixed|up[- ]?front|hidden/i)] }); }
  const nc = all.match(/\bno (?:call-?out (?:fee|charge)s?|overtime(?: charges?)?)(?: (?:in|during|on|for) [a-z -]{3,24}?)?(?=[.,;!]|$)/i);   // keep the client's own qualifier ("in working hours")
  if (nc) { const t = nc[0][0].toUpperCase() + nc[0].slice(1); add({ k: 'nocall', proof: t, why: [t + '.', sent(/call-?out|overtime/i)] }); }
  const g = all.match(/\b(\d+)[- ](year|month)s?\b[^.]{0,20}\b(guarantee|warranty)\b/i);
  if (g) add({ k: 'guar', proof: `${g[1]}-${g[2].toLowerCase()} ${g[3].toLowerCase()}`, chip: ['shield', `${g[1]}-${g[2].toLowerCase()}`, g[3].toLowerCase()], why: [`${g[1]}-${g[2].toLowerCase()} ${g[3].toLowerCase()}.`, sent(/guarantee|warranty/i)], stat: { v: g[1], suf: g[2][0].toLowerCase() === 'y' ? 'yr' : 'mo', l: g[3].toLowerCase() + ' on our work' } });
  else if (/\bguarantee[d]?\b|satisfaction guaranteed/i.test(about)) add({ k: 'guar', proof: 'Work guaranteed', why: ['Guaranteed.', sent(/guarantee/i)] });
  if (/\b(eco[- ]friendly|non-?toxic|pet[- ]safe|plant[- ]based)\b/i.test(all)) add({ k: 'eco', proof: 'Eco-friendly products', why: ['Kind products.', sent(/eco|toxic|pet[- ]safe|plant/i)] });
  if (/\b(direct billing|insurance accepted|we accept (?:most )?insurance|nhs (?:and|&) private|0% finance|interest[- ]free|payment plans?|spread the cost)\b/i.test(all)) {
    const m = all.match(/\b(direct billing|insurance accepted|we accept (?:most )?insurance|nhs (?:and|&) private|0% finance|interest[- ]free|payment plans?|spread the cost)\b/i)[1];
    add({ k: 'pay', proof: /finance|interest|plan|spread/i.test(m) ? 'Payment plans available' : /nhs/i.test(m) ? 'NHS & private' : 'Insurance accepted', why: [/finance|interest|plan|spread/i.test(m) ? 'Spread the cost.' : 'Easy to pay.', sent(new RegExp(m.replace(/[%]/g, '.'), 'i'))] });
  }
  const dr = about.match(/\b(Dr\.? [A-Z][a-z]+(?: [A-Z][a-z]+)?)/);
  if (dr) add({ k: 'dr', why: [`Led by ${dr[1]}.`, sent(/\bDr\.? [A-Z]/)] });
  // opening-hours facts (only what the hours literally say)
  const H = hours.map(h => h.join(' ')).join(' | ');
  const sat = /\bsat/i.test(H) && !/sat[a-z]*[^|]*closed/i.test(H), sun = /\bsun/i.test(H) && !/sun[a-z]*[^|]*closed/i.test(H) && !/sun[–-]mon:\s*closed/i.test(H);
  const daily = /\b(7 days|daily|every day|mon[a-z]*\s*[–-]\s*sun)/i.test(H);
  const late = hours.some(h => { const m = h[1].match(/[–-]\s*(\d{1,2})(?::\d\d)?\s*pm/i); return m && +m[1] >= 8 && +m[1] < 12; });
  if (daily || (sat && sun)) add({ k: 'wkend', proof: daily ? 'Open 7 days' : 'Open weekends', stat: daily ? { v: '7', suf: '', l: 'days a week' } : null });
  else if (sat) add({ k: 'wkend', proof: 'Open Saturdays' });
  if (late) add({ k: 'late', proof: 'Late opening', why: ['Open late.', `${(hours.find(h => /[–-]\s*(?:[89]|1[01])(?::\d\d)?\s*pm/i.test(h[1])) || hours[0]).join(': ').replace(/^: /, '')}.`] });
  F.forEach(f => { if (f.why && !f.why[1]) delete f.why; });
  return F;
}
/* real stats from facts: needs two statable facts, never invents a number */
function factStats(F, M) {
  const out = F.filter(f => f.stat).map(f => ({ ...f.stat, sample: false }));
  const areas = (M.d.areas || '').split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  if (M.services.length >= 3 && M.fam !== 'food') out.push({ v: String(M.services.length), suf: '', l: `${M.U.nav.toLowerCase()} under one roof`, sample: false });
  if (areas.length >= 3) out.push({ v: String(areas.length), suf: '', l: 'areas we cover', sample: false });
  return out.filter(Boolean).slice(0, 4);
}

/* CSS for every variant used on this page (each variant ships its own) */
function libCSS(M) {
  const out = [], seen = new Set();
  // highlighter-style accents ("mark") read as a strike-through on dark photo sections: use an underline there instead
  out.push(shapeCSS(M)); if (M.S.badge) out.push(spinBadgeCSS);
  if (M.S.em === 'under') out.push(emUnderCSS);
  if (M.S.em === 'mark' || M.S.em === 'under') out.push(`.site .hero-dark:not(.hero-quote) h1 em,.site .cta-photo h2 em,.site .book-ov h2 em,.site .offer h3 em,.site .cta-band h2 em,.site .bt h3 em{background:none;color:var(--accent);position:relative;white-space:nowrap}.site .hero-dark:not(.hero-quote) h1 em::after,.site .cta-photo h2 em::after,.site .book-ov h2 em::after,.site .offer h3 em::after,.site .cta-band h2 em::after,.site .bt h3 em::after{content:"";position:absolute;left:0;right:0;bottom:-.02em;height:.1em;border-radius:.1em;background:var(--accent);opacity:.9}`);
  ['hero', ...M.order, 'footer'].forEach(k => {
    const v = variantDef(k, k === 'hero' ? M.heroV : M.V[k] || Object.keys(LIB.sections[k] || {})[0]);
    if (!v || seen.has(v.css)) return; seen.add(v.css);
    out.push(v.css(M));
  });
  return out.join('\n');
}
/* kit motion personality: how things enter as you scroll (all switched off by reduced motion / picture mode) */
function motionCSS(M) {
  const m = M.S.motion;
  if (m === 'slide') return `.site.js .reveal:not(.in){transform:translateX(-34px)}.site.js .reveal:nth-child(even):not(.in){transform:translateX(34px)}`;
  if (m === 'soft') return `.site.js .reveal:not(.in){transform:scale(.96)}`;
  if (m === 'curtain') return `.site.js .reveal:not(.in){transform:translateY(40px)}
.site.js .card-img,.site.js .srow figure,.site.js .step-img,.site.js .gallery figure,.site.js .wt-ph,.site.js .aw-ph{position:relative}
.site.js .card-img::after,.site.js .srow figure::after,.site.js .step-img::after,.site.js .gallery figure::after,.site.js .wt-ph::after,.site.js .aw-ph::after{content:"";position:absolute;inset:0;background:var(--accent);transform-origin:right;transition:transform 1.1s var(--ease) .2s;pointer-events:none}
.site.js .reveal.in .card-img::after,.site.js .reveal.in.srow figure::after,.site.js .srow.in figure::after,.site.js .reveal.in .step-img::after,.site.js .gallery figure.in::after,.site.js .wt-ph.in::after,.site.js .aw-ph.in::after,.site.js .steps li.in .step-img::after{transform:scaleX(0)}
@media (prefers-reduced-motion:reduce){.site.js .card-img::after,.site.js .srow figure::after,.site.js .step-img::after,.site.js .gallery figure::after,.site.js .wt-ph::after,.site.js .aw-ph::after{display:none}}
.site.pv .card-img::after,.site.pv .srow figure::after,.site.pv .step-img::after,.site.pv .gallery figure::after,.site.pv .wt-ph::after,.site.pv .aw-ph::after{display:none}`;
  return '';
}

/* ---------- Insurance & payment: only what the client typed (optional "insurance" field + their about text) ---------- */
function insuranceFacts(d) {
  const field = String(d.insurance || '').trim(), about = String(d.about || '').replace(/\(.*?made-up.*?\)/ig, '');
  const txt = field + '\n' + about;
  const sents = [...field.split(/\n|(?<=\.)\s+/), ...splitSentences(about)].map(s => s.trim()).filter(Boolean);
  const sent = re => { const s = sents.find(x => re.test(x) && x.length >= 30); return s ? s.replace(/\s*[.]?$/, '.') : ''; };
  const F = [];
  if (/\bNHS\b/.test(txt)) {
    const both = /\bprivate\b/i.test(txt);
    F.push({ k: 'nhs', icon: 'shield', t: both ? 'NHS & private' : 'NHS patients', b: sent(/\bNHS\b/) || (both ? 'We see both NHS and private patients.' : 'We see NHS patients.') });
  }
  const fin = txt.match(/\b(0% finance|interest[- ]free(?: finance| credit)?|payment plans?|pay monthly|monthly payments|spread the cost|finance (?:is )?available)\b/i);
  if (fin) F.push({ k: 'fin', icon: 'calendar', t: /0%|interest/i.test(fin[1]) ? 'Interest-free finance' : 'Payment plans', b: sent(new RegExp(fin[1].replace(/[%]/g, '.'), 'i')) || 'Ask us about spreading the cost.' });
  const mem = txt.match(/\b((?:practice |dental |care )?membership(?: plan)?|dental plan|care plan)s?\b/i);
  if (mem && !/payment plan/i.test(mem[0])) F.push({ k: 'mem', icon: 'sparkle', t: 'Membership plan', b: sent(new RegExp(mem[1], 'i')) || 'Ask us about our membership plan.' });
  if (/\bdirect(?:ly)? bill/i.test(txt) || /\bbill (?:your )?insur/i.test(txt)) F.push({ k: 'direct', icon: 'check', t: 'Direct billing', b: sent(/bill/i) || 'We can bill your insurer directly.' });
  // accepted plans / insurers: the names exactly as typed (field list), or "we accept X, Y and Z" in the about text
  // accepted plans / insurers: names exactly as typed. A line counts when it mentions accepting/insurers, or is a bare list of names.
  const generic = /^(?:nhs|private|patients?|plans?|insurance|insurers?|and more|others?|most (?:major )?insurers?)$/i;
  const nameOk = s => s && s.length <= 32 && /^[A-Z0-9]/.test(s) && s.split(/\s+/).length <= 4 && !generic.test(s) && !/\d+\s*(?:months?|years?|%)|£|\$|€/.test(s);
  const listOf = s => s.split(/\s*(?:,|;|\/|\band\b|&)\s*/).map(x => x.trim().replace(/[.:!]$/, '')).filter(Boolean);
  let names = [];
  // a bare list of names only counts in the insurance field itself, never in the about text ("Family run since 2012." is not an insurer)
  [...field.split(/\n/).map(l => [l, true]), ...splitSentences(about).map(l => [l, false])].forEach(([line, isField]) => {
    const m = line.match(/\b(?:accept(?:s|ed|ing)?|work with|registered with|providers?|insurers?|insurance)\b(?:\s*(?:plans?|from|including|like|such as|:))*\s*(.+)$/i);
    if (m) names.push(...listOf(m[1]).filter(nameOk));
    else if (isField && line === line.replace(/\b(?:finance|interest|payment|monthly|spread|membership|plan|bill|nhs|private|patients?|cover|welcome)\b/ig, '') && listOf(line).every(nameOk)) names.push(...listOf(line));
  });
  names = [...new Set(names)].slice(0, 12);
  if (names.length && !F.some(f => f.k === 'direct')) F.push({ k: 'plans', icon: 'shield', t: 'Insurance welcome', b: `We accept ${names.length > 3 ? names.slice(0, 3).join(', ') + ' and more' : listJoin(names)}.` });
  return { features: F.slice(0, 4), plans: names, any: F.length > 0 || names.length > 0 };
}
/* does the client say they offer emergencies? (services, about text or hours) */
const offersEmergency = (d, services) => /emergenc|toothache|urgent appointments?|same[- ]day emergency|24\s*\/\s*7|24-hour|24 hours/i.test([d.about, d.hours, ...services.map(s => s.name + ' ' + (s.desc || ''))].join(' '));
/* opening hours per weekday (0 = Sunday … 6 = Saturday) from the client's own lines; null where the lines don't say */
function weekHours(hours) {
  const D = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], wk = [null, null, null, null, null, null, null];
  const ix = w => D.indexOf(String(w).toLowerCase().slice(0, 3));
  hours.forEach(([label, time]) => {
    const L = String(label || '').toLowerCase(); if (!L) return;
    let days = [];
    if (/daily|every ?day|7 days|mon[a-z]*\s*(?:–|-|to)\s*sun/.test(L)) days = [0, 1, 2, 3, 4, 5, 6];
    else if (/weekdays?/.test(L)) days = [1, 2, 3, 4, 5];
    else if (/weekends?/.test(L)) days = [0, 6];
    else L.split(/,|&|\band\b/).forEach(part => {
      const r = part.match(/([a-z]{3})[a-z]*\.?\s*(?:–|-|to)\s*([a-z]{3})[a-z]*/);
      if (r && ix(r[1]) >= 0 && ix(r[2]) >= 0) { let a = ix(r[1]); const b = ix(r[2]); for (let n = 0; n < 7; n++) { days.push(a); if (a === b) break; a = (a + 1) % 7; } }
      else { const one = part.match(/\b(sun|mon|tue|wed|thu|fri|sat)[a-z]*/); if (one) days.push(ix(one[1])); }
    });
    days.forEach(n => { if (n >= 0 && wk[n] === null) wk[n] = time; });
  });
  return wk;
}
/* em: 'under' (the sans dental kit): a highlight underline that draws in */
const emUnderCSS = `.site h1 em,.site h2 em,.site h3 em{font-style:normal;font-family:inherit;font-weight:inherit;letter-spacing:inherit;color:inherit;background:linear-gradient(var(--accent),var(--accent)) no-repeat 0 88%/100% .34em;padding:0 .06em;transition:background-size 1s var(--ease) .5s}
.site.js:not(.ready) .hero h1 em,.site.js .reveal:not(.in) h2 em,.site.js h2.reveal:not(.in) em{background-size:0 .34em}`;
/* kit photo shapes: same sections, a completely different silhouette */
function shapeCSS(M) {
  const sh = M.S.shape || 'rounded';
  const T = ['.hero-img', '.split-media .frame', '.about-media .am-a', '.ws-ph', '.wt-ph', '.ba-frame', '.shape-me'].map(x => '.site ' + x);
  const morph = `@keyframes s-blob{0%,100%{border-radius:58% 42% 46% 54%/46% 52% 48% 54%}50%{border-radius:44% 56% 58% 42%/56% 44% 56% 44%}}`;
  if (sh === 'arch') return `${T.join(',')}{border-radius:50% 50% var(--radius) var(--radius)/30% 30% var(--radius) var(--radius)!important;overflow:hidden}`;
  if (sh === 'circle') return `.site .hero-img:not(.mo-a),.site .split-media .frame,.site .about-media .am-a,.site .shape-me{border-radius:50%!important;aspect-ratio:1/1!important;overflow:hidden}.site .ws-ph,.site .wt-ph{border-radius:calc(var(--radius) * 2 + 20px)!important}`;
  if (sh === 'blob') return `${morph}${T.filter(x => !/ba-frame/.test(x)).join(',')}{border-radius:58% 42% 46% 54%/46% 52% 48% 54%!important;overflow:hidden;animation:s-blob 16s ease-in-out infinite}@media (prefers-reduced-motion:reduce){${T.join(',')}{animation:none}}.site.pv .hero-img{animation:none}`;
  return '';
}
/* rotating text stamp (kit trait); the text is the business name + place, never a claim */
function spinBadge(M, cls = '') {
  if (!M.S.badge) return '';
  const txt = `${M.name} · ${M.place || M.primary.short} · `.toUpperCase().slice(0, 46);
  const id = 'sb' + (hash32(M.name + cls) % 9999);
  return `<a class="spin-badge ${cls}" href="${hh(M.primary.href)}" aria-label="${hh(M.primary.label)}"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="${id}" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#${id}">${hh(txt)}</textPath></text></svg><span aria-hidden="true">${svgI('arrow')}</span></a>`;
}
const spinBadgeCSS = `.site .spin-badge{position:absolute;z-index:3;width:116px;height:116px;border-radius:50%;background:var(--surface);color:var(--text);display:grid;place-items:center;box-shadow:var(--shadow);text-decoration:none}
.site .spin-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:s-rot 18s linear infinite}
.site .spin-badge text{font:700 10px var(--sans);letter-spacing:.18em;fill:currentColor}
.site .spin-badge span{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--btn);color:var(--on-btn);transform:rotate(-45deg);transition:transform .4s var(--spring)}
.site .spin-badge:hover span{transform:rotate(0)}
@keyframes s-rot{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.site .spin-badge svg{animation:none}}.site.pv .spin-badge svg{animation:none}
@media (max-width:640px){.site .spin-badge{width:88px;height:88px}.site .spin-badge text{font-size:9px}.site .spin-badge span{width:34px;height:34px}}`;
