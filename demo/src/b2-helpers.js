/* ---------------- Builder helpers ---------------- */
const ICONS = {
  tooth: 'M7 4c2-1 3.4-.6 5 .4C13.6 3.4 15 3 17 4c2 1.4 1.6 5-.2 8-.8 1.4-1 4-1.6 6.6-.4 1.3-1.6 1.3-2 0L12 14l-1.2 4.6c-.4 1.3-1.6 1.3-2 0C8.2 16 8 13.4 7.2 12 5.4 9 5 5.4 7 4z',
  sparkle: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  shield: 'M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6zM9 12l2 2 4-4',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  child: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  smile: 'M3 12c3-4 15-4 18 0M3 12c3 4 15 4 18 0M8 10.5v3M12 10v4M16 10.5v3',
  implant: 'M8 3h8l-1 6H9zM9 9l1 12h4l1-12M10 13h4M10 17h4',
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  drop: 'M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  flame: 'M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 2-5 5-5 8a7 7 0 0 0 7 7z',
  home: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
  key: 'M15 7a4 4 0 1 1-3.9 4.9L4 19v2h3v-2h2v-2h2l1.1-1.1A4 4 0 0 1 15 7zM16 9h.01',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sign: 'M4 21V4M4 4h14l-3 4 3 4H4',
  scales: 'M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  briefcase: 'M4 7h16v13H4zM9 7V4h6v3M4 12h16',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6M17 11a3 3 0 0 0 0-6M22 21c-.6-2.6-2-4.4-4-5.3',
  car: 'M3 13l2-6h14l2 6v5H3zM7 18v2M17 18v2M3 13h18M7 15.5h.01M17 15.5h.01',
  scissors: 'M6 6a3 3 0 1 0 0 .01M6 18a3 3 0 1 0 0 .01M8.5 7.5 20 18M8.5 16.5 20 6',
  brush: 'M20 4 9 15M9 15a3 3 0 0 0-4 3c0 1-1 2-2 2 2 1 6 1 7-2a3 3 0 0 0-1-3z',
  leaf: 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8',
  hand: 'M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-.5A5.5 5.5 0 0 1 5 14.5V11a1.5 1.5 0 0 1 3 0',
  plate: 'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM2 4v6M2 7h1.5M22 4v16',
  glass: 'M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v7M8 21h8',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  pin: 'M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  check: 'M5 12l5 5L20 7',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  wa: '',
};
const ICON_RULES = [   // whole-word starts only: "identity" must not hit "dent", "outlet" must not hit "let"
  [/\b(logo|brand|identit)/i, 'star'], [/\b(packag|label)/i, 'briefcase'], [/\b(print|brochure|flyer|poster|business card|stationer)/i, 'doc'], [/\b(social|content|influenc)/i, 'users'], [/\b(website|web|app|ux|ui|seo|digital)\b/i, 'chart'],
  [/\b(wine|cocktail|drinks?\b|bar\b)/i, 'glass'], [/\b(event|private dining|party|function|wedding)/i, 'calendar'], [/\b(starter|main|dessert|brunch|lunch|dinner|cake|bread|pastr)/i, 'plate'],
  [/\b(membership|induction)/i, 'calendar'], [/\b(personal train|coach|one-to-one|1-1)/i, 'users'], [/\b(hiit|spin|cardio|running)/i, 'heart'], [/\b(strength|kettlebell|barbell|weights?|conditioning|crossfit)\b/i, 'bolt'], [/\b(yoga|pilates|stretch|meditat)/i, 'leaf'],
  [/\b(emergenc|urgent|24\/?7|leak|burst)/i, 'shield'], [/\b(boiler|heating|gas|furnace)/i, 'flame'], [/\b(plumb|pipe|drain|taps?\b|bathroom)/i, 'drop'],
  [/\b(electric|wiring|rewir|socket|lighting|ev charg|solar)/i, 'bolt'], [/\b(garden|landscap|lawn|trees?\b|hedge)/i, 'leaf'],
  [/\b(kids|child|famil)/i, 'child'], [/\b(aligner|brace|orthod|straighten)/i, 'smile'], [/\b(implant|crown|bridge)/i, 'implant'], [/\b(whiten|glow|facial|skin)/i, 'sparkle'],
  [/\b(check-?ups?|hygien|dental|dentist|tooth|teeth)/i, 'tooth'], [/\b(clean|valet|detail)/i, 'sparkle'],  [/\b(physio|massage|therap|sports? injur)/i, 'hand'], [/\b(hair|cuts?\b|colour|color|balayage|blow-?dry|styling|barber|beard|fade)/i, 'scissors'], [/\b(nail|lash|brow|make-?up|manicure|pedicure)/i, 'brush'],
  [/\b(sale|sell|sold)/i, 'sign'], [/\b(lettings?|rent|tenan|landlord)/i, 'key'], [/\b(valuation|apprais|market)/i, 'chart'], [/\b(buy|homes?\b|propert|house|mortgage)/i, 'home'],
  [/\b(injur|accident|claim|medical neg)/i, 'shield'], [/\b(divorc|custody)/i, 'users'], [/\b(employ|business|compan|commercial)/i, 'briefcase'], [/\b(wills?\b|probate|estate|convey|contract)/i, 'doc'], [/\b(motor|cars?\b|road|mot\b|servic(e|ing) your car)/i, 'car'], [/\b(immigra|visa|court|crim|dispute)/i, 'scales'],
];
const iconFor = (name, fallback, desc = '') => (ICON_RULES.find(r => r[0].test(name)) || ICON_RULES.find(r => r[0].test(desc)) || [0, fallback || 'sparkle'])[1];
const svgI = (k, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k] || ICONS.sparkle}"/></svg>`;
const WA_SVG = '<svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

const hh = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* URL allowlist (keep in sync with backend/src/security.mjs). Stored/published: https: or /i/<id>/<key>. */
const SAFE_UPLOAD = /^\/i\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;
const SAFE_DATA_IMG = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/i;
function isHttpsUrl(s) {
  try { const u = new URL(String(s)); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}
function isUploadUrl(s) {
  const t = String(s || '');
  if (SAFE_UPLOAD.test(t)) return true;
  try { const u = new URL(t); return u.protocol === 'https:' && !u.username && !u.password && SAFE_UPLOAD.test(u.pathname) && !u.search && !u.hash; } catch { return false; }
}
function isSafeDataImg(s) {
  const t = String(s || '');
  return t.length <= 2e6 && SAFE_DATA_IMG.test(t);
}
function safeUrl(s, kind = 'img') {
  const t = String(s == null ? '' : s).trim();
  if (!t) return '';
  if (kind === 'social') return isHttpsUrl(t) ? t : '';
  if (isUploadUrl(t) || isHttpsUrl(t)) return t;
  if (kind === 'preview' && isSafeDataImg(t)) return t;
  return '';
}
const uattr = (s, kind = 'preview') => hh(safeUrl(s, kind) || '');
const safeHref = (s, kind = 'social') => hh(safeUrl(s, kind) || '');
function escSrcset(s) {
  return String(s || '').split(',').map(part => {
    const bits = part.trim().split(/\s+/);
    if (!bits[0]) return '';
    const url = safeUrl(bits[0], 'preview');
    if (!url) return '';
    return hh(url) + (bits[1] ? ' ' + bits.slice(1).join(' ') : '');
  }).filter(Boolean).join(', ');
}
function sanitizeSiteData(d, opts = {}) {
  const kind = opts.allowData ? 'preview' : 'img';
  if (!d || typeof d !== 'object') return {};
  const out = { ...d };
  out.logo = safeUrl(d.logo, kind);
  out.photos = Array.isArray(d.photos) ? d.photos.map(p => safeUrl(p, kind)).filter(Boolean) : [];
  if (Array.isArray(d.ba)) out.ba = d.ba.map(p => p && typeof p === 'object' ? { ...p, b: safeUrl(p.b, kind), a: safeUrl(p.a, kind) } : p).filter(p => p && p.b && p.a);
  out.facebook = safeUrl(d.facebook, 'social');
  out.instagram = safeUrl(d.instagram, 'social');
  out.other = safeUrl(d.other, 'social');
  return out;
}

const hashStr = s => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const pick = (arr, seed) => arr[seed % arr.length];
const cleanName = n => String(n || '').replace(/\s*\((demo|example)\)\s*/ig, ' ').trim();
/* Round 1 item 6: item names render in Title Case everywhere ("seekh kebab" -> "Seekh Kebab"), keeping
   acronyms and brand casing the owner typed (NHS, BBQ, MOT, iPhone, uPVC) and a few known ones typed lowercase. */
const TC_SMALL = new Set(['a', 'an', 'and', 'or', 'of', 'the', 'with', 'in', 'on', 'for', 'to', 'at', 'by', 'per', 'from', 'vs', 'via', 'de', 'la', 'le', 'du', 'al', 'e', 'n']);
const TC_KNOWN = { iphone: 'iPhone', ipad: 'iPad', imac: 'iMac', macbook: 'MacBook', upvc: 'uPVC', mot: 'MOT', bbq: 'BBQ', nhs: 'NHS', ac: 'AC', tv: 'TV', cctv: 'CCTV', led: 'LED', diy: 'DIY', ev: 'EV', hiit: 'HIIT', gp: 'GP', eicr: 'EICR', pat: 'PAT', vat: 'VAT', seo: 'SEO', ppc: 'PPC', ux: 'UX', ui: 'UI', hgv: 'HGV', ipl: 'IPL', hd: 'HD', '4x4': '4x4', dbs: 'DBS', gcse: 'GCSE', sats: 'SATs', ielts: 'IELTS', bmw: 'BMW', vw: 'VW', pc: 'PC', wifi: 'WiFi', pvc: 'PVC', rgb: 'RGB', mma: 'MMA', bjj: 'BJJ', wp: 'WP' };
function titleCase(str) {
  let first = true;
  return String(str || '').replace(/[^\s/]+/g, w => {
    const isFirst = first; first = /[:(]$/.test(w);
    const core = w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''), lc = core.toLowerCase();
    if (!core) { if (/[:(]$/.test(w)) first = true; return w; }
    if (TC_KNOWN[lc] && core === lc) return w.replace(core, TC_KNOWN[lc]);
    if (/\d/.test(core) || /[A-Z]/.test(core.slice(1)) || /^\p{Lu}{2,}$/u.test(core)) return w;   // acronyms, brands, sizes: as typed
    if (!isFirst && TC_SMALL.has(lc)) return w.replace(core, lc);
    return w.replace(core, core[0].toLocaleUpperCase() + core.slice(1));
  });
}
const lowerFirst = s => titleCase(s);
/* Round 1 item 10: true once the owner asked for a colour / tone change; hand-tuned decorative colours then give way to the tokens */
const userTone = M => !!(M && M.opts && (M.opts.accent || typeof M.opts.dark === 'boolean' || M.opts.minimal || M.opts.white));   // was: lower-case the first letter in running text; item names now keep Title Case
const listJoin = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1] : (arr[0] || '');
function hx(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mixC(a, b, t) { if (!/^#/.test(a) || !/^#/.test(b)) return a; const x = hx(a), y = hx(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
function lumC(h) { if (!/^#/.test(h)) return 0.5; const [r, g, b] = hx(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
const rgba = (h, a) => { const [r, g, b] = hx(h); return `rgba(${r},${g},${b},${a})`; };

/* "*word*" marks the accent word. Every word gets its own span so the hero can stagger them in. */
function headHTML(src, words = false) {
  const parts = String(src).split(/(\*[^*]+\*)/).filter(Boolean);
  return parts.map(p => {
    const acc = /^\*.*\*$/.test(p), t = acc ? p.slice(1, -1) : p;
    if (!words) return acc ? `<em>${hh(t)}</em>` : hh(t);
    const ws = t.split(/(\s+)/).map(w => /^\s+$/.test(w) || !w ? w : `<span class="w">${hh(w)}</span>`).join('');
    return acc ? `<em>${ws}</em>` : ws;
  }).join('');
}
/* A client-typed headline: sentence case + full stop, accent on the last word. */
function clientHeadline(t) {
  t = String(t).trim().replace(/\s+/g, ' ');
  if (!/[.!?]$/.test(t)) t += '.';
  const m = t.match(/^(.*?)(\S+?)([.!?]+)$/);
  return m ? `${m[1]}*${m[2]}*${m[3]}` : t;
}
/* ---------- Prices: "100", "$100", "£1,250", "100.50", "from 80", "80-120", "100 per hour", "Free quote" ---------- */
const UNIT_WORDS = [[/^(hour|hours|hr|hrs|h|hourly)$/, 'hour'], [/^(month|months|mo|monthly|pcm)$/, 'month'], [/^(week|weeks|wk|weekly)$/, 'week'], [/^(day|days|daily)$/, 'day'],
  [/^(night|nights)$/, 'night'], [/^(session|sessions)$/, 'session'], [/^(class|classes)$/, 'class'], [/^(person|people|head|pp|guest)$/, 'person'], [/^(visit|visits)$/, 'visit'],
  [/^(room|rooms)$/, 'room'], [/^(item|items|piece)$/, 'item'], [/^(page|pages)$/, 'page'], [/^(lesson|lessons)$/, 'lesson'], [/^(sq ?m|m2|sqm)$/, 'm²'], [/^(sq ?ft|ft2)$/, 'sq ft'], [/^(each|ea)$/, 'each']];
function parsePrice(p) {
  const raw = String(p ?? '').trim();
  if (!raw) return null;
  const nums = (raw.match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => parseFloat(x.replace(/,/g, ''))).filter(n => isFinite(n));
  if (!nums.length) return { kind: 'text', text: raw, min: 0, max: 0 };
  const lower = raw.toLowerCase();
  const range = nums.length >= 2 && /\d\s*(?:-|–|—|to)\s*\D{0,5}\d/.test(raw) && nums[1] > nums[0];
  let unit = '';
  const um = lower.match(/(?:\/|\bper\b|\ba\b|\ban\b)\s*([a-z]{1,8}(?: ?[a-z0-9]{1,2})?)/) || lower.match(/\b(hourly|monthly|weekly|daily|each|pp|pcm)\b/);
  if (um) { const w = um[1].trim(); const hit = UNIT_WORDS.find(u => u[0].test(w)); if (hit) unit = hit[1]; }
  const from = /\b(from|starting|starts|min(imum)?)\b|\+\s*$/.test(lower);
  return { kind: 'num', min: nums[0], max: range ? nums[1] : nums[0], range, unit, from };
}
function fmtMoney(n, cur) {
  const s = Math.abs(n % 1) > 0.001 ? n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Math.round(n).toLocaleString('en-GB');
  return (cur || '') + s;
}
function priceText(p, cur) {
  const r = parsePrice(p);
  if (!r) return '';
  if (r.kind === 'text') return r.text;                                    // "Free quote", "POA", "Ask us"
  const u = r.unit ? (r.unit === 'each' ? ' each' : ' per ' + r.unit) : '';
  if (r.range) return `${fmtMoney(r.min, cur)}–${fmtMoney(r.max, cur)}${u}`;
  if (r.from || !r.unit) return `From ${fmtMoney(r.min, cur)}${u}`;
  return `${fmtMoney(r.min, cur)}${u}`;
}
const priceNum = p => { const r = parsePrice(p); return r && r.kind === 'num' ? r.min : 0; };
function waDigits(d) {
  let n = String(d.whatsapp || '').replace(/[^\d+]/g, '');
  if (!n) return '';
  if (n.startsWith('+')) return n.slice(1);
  if (n.startsWith('00')) return n.slice(2);
  const code = (COUNTRIES[d.country] || COUNTRIES.UK).code;
  if (n.startsWith('0')) return code + n.slice(1);
  return n;
}
const telHref = p => 'tel:' + String(p || '').replace(/[^\d+]/g, '');
function parseHours(txt) {
  return String(txt || '').split('\n').map(s => s.trim()).filter(Boolean).map(l => {
    const m = l.match(/^([^:]{1,28}):\s*(.+)$/); return m ? [m[1].trim(), m[2].trim()] : ['', l];
  });
}
function parseReviews(txt) {
  return String(txt || '').split('\n').map(s => s.trim()).filter(s => s.length > 8).slice(0, 8).map(l => {
    const m = l.match(/^["“]?(.+?)["”]?\s*(?:—|–|\s-\s|\|)\s*([^—–|]{2,40})$/);
    return m ? [m[1].trim(), m[2].trim()] : [l.replace(/^["“]|["”]$/g, ''), 'Verified customer'];
  });
}
function parseStats(txt) {
  return String(txt || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 4).map(l => {
    const m = l.match(/^([<>~]?\s*[\d.,]*\d)\s*((?:[+%×★]|[a-z]{1,3}(?![a-z]))*)\s*(?:\||—|–|-|:)?\s*(.*)$/i);
    if (!m) return null;
    return [m[1].replace(/[,\s<>~]/g, ''), m[2] || '', (m[3] || '').trim() || ''];
  }).filter(Boolean);
}
/* "Starters: Burrata" -> group "Starters", name "Burrata" */
function groupServices(services) {
  const groups = [];
  services.forEach(s => {
    const m = s.name.match(/^([^:]{2,24}):\s*(.+)$/);
    const g = m ? m[1].trim() : 'Menu', name = m ? m[2].trim() : s.name;
    let G = groups.find(x => x.name.toLowerCase() === g.toLowerCase());
    if (!G) groups.push(G = { name: g, items: [] });
    G.items.push({ ...s, name });
  });
  return groups;
}
// Round 1 item 7: a typed rating always reads "4.8 ★" ("rated 4.8/5", "4.8 stars", "rating of 4.8 out of 5")
const fmtRating = t => String(t).replace(/\b(rated|rating(?: of)?|scored?|score of|average(?: of)?|reviews? average)\s+([1-5](?:\.\d)?)(?:\s*(?:\/\s*5(?:\.0)?|out of (?:5|five)|stars?|★))*/gi, '$1 $2 ★')
  .replace(/\b([1-5]\.\d)\s*(?:\/\s*5(?:\.0)?|out of (?:5|five)|stars?)(?!\w)(?:\s*★)?/gi, '$1 ★');
// Round 1 item 7: never split inside a number ("4.8", "£12.50", "v2.0") or after an abbreviation like "St." / "Dr."
const splitSentences = t => (String(t || '').replace(/\(.*?made-up.*?\)/ig, '').replace(/\s+/g, ' ')
  .replace(/(\d)\.(?=\d)/g, '$1\u2024').replace(/\b(St|Dr|Mr|Mrs|Ms|No|Rd|approx|est|etc)\.(?= [a-z0-9])/g, '$1\u2024').concat(/[.!?]\s*$/.test(String(t || '').trim()) || !String(t || '').trim() ? '' : '.')
  .match(/[^.!?]+[.!?]+/g) || []).map(x => fmtRating(x.replace(/\u2024/g, '.')));

/* Photos: see allocPhotos() in lib/40-select.js (uploads first, curated stock, never a repeat on one page) */
