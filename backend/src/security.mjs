/* Shared security helpers for the production Worker and brand-preview.
   Keep in sync with the allowlist in demo/src/b2-helpers.js (safeUrl / uattr). */

export const PRICES = { setup: 50, monthly: 29, domainConnect: 10, currency: '$' };

export const HSTS = 'max-age=31536000; includeSubDomains';
export const PERMISSIONS_POLICY = 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), interest-cohort=()';

/* Product app (/ and /admin): inline scripts/styles, Google Fonts, srcdoc iframes. */
export const APP_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://plus.unsplash.com",
  "connect-src 'self'",
  "frame-src 'self' blob:",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

/* Published client sites at /s/. Inline runtime + fonts + Pexels/Unsplash; leads post same-origin. */
export const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://plus.unsplash.com",
  "connect-src 'self'",
  "frame-src 'none'",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join('; ');

/* Untrusted preview HTML at /p/. Keep the sandbox (no allow-same-origin) so it can still be framed by the product app. */
export const PREVIEW_CSP = "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms; frame-ancestors 'self'";

const UPLOAD_PATH = /^\/i\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;
const DATA_IMG = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/i;

export function isHttpsUrl(s) {
  try {
    const u = new URL(String(s));
    return u.protocol === 'https:' && !u.username && !u.password;
  } catch {
    return false;
  }
}

export function isUploadUrl(s) {
  const t = String(s || '');
  if (UPLOAD_PATH.test(t)) return true;
  try {
    const u = new URL(t);
    return u.protocol === 'https:' && !u.username && !u.password && UPLOAD_PATH.test(u.pathname) && !u.search && !u.hash;
  } catch {
    return false;
  }
}

export function isSafeDataImg(s) {
  const t = String(s || '');
  return t.length <= 2_000_000 && DATA_IMG.test(t);
}

/** Stored/published URLs: https: or /i/<id>/<key> only. kind 'social' = https only. kind 'preview' also allows data:image. */
export function safeUrl(s, kind = 'img') {
  const t = String(s == null ? '' : s).trim();
  if (!t) return '';
  if (kind === 'social') return isHttpsUrl(t) ? t : '';
  if (isUploadUrl(t) || isHttpsUrl(t)) return t;
  if (kind === 'preview' && isSafeDataImg(t)) return t;
  return '';
}

export const FIELD_LIMITS = {
  name: 60, about: 900, phone: 30, email: 80, address: 120, hours: 300,
  reviews: 1500, headline: 90, lead: 400, ctaLabel: 80, bookingUrl: 200,
  serviceName: 80, serviceDesc: 400, servicePrice: 40, city: 80, areas: 120,
  industryOther: 60, stats: 400, insurance: 400, whatsapp: 30, country: 10,
};
export const MAX_SERVICES = 16;
export const MAX_SITE_PHOTOS = 12;

/** Strip tags and NUL so stored copy cannot carry HTML into later pages. */
export function stripHtml(s) {
  return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\u0000/g, '');
}

export function clipText(s, max, keepLines = false) {
  let t = stripHtml(s);
  if (keepLines) {
    t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map(l => l.replace(/[ \t]+/g, ' ').trimEnd()).join('\n').trim();
  } else {
    t = t.replace(/\s+/g, ' ').trim();
  }
  if (typeof max === 'number' && t.length > max) t = t.slice(0, max);
  return t;
}

function sanitizePhotoOverrides(raw, kind) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!/^(hero|about|about2|split|contact|cta|rv|circle|services:\d+|gallery:\d+|heroExtra:\d+|steps:\d+)$/.test(k)) continue;
    const url = safeUrl(v, kind);
    if (url) out[k] = url;
  }
  return Object.keys(out).length ? out : undefined;
}

export function sanitizeSiteData(d, opts = {}) {
  const kind = opts.allowData ? 'preview' : 'img';
  if (!d || typeof d !== 'object') return {};
  const out = { ...d };
  out.name = clipText(d.name, FIELD_LIMITS.name);
  out.about = clipText(d.about, FIELD_LIMITS.about, true);
  out.phone = clipText(d.phone, FIELD_LIMITS.phone);
  out.email = clipText(d.email, FIELD_LIMITS.email);
  out.address = clipText(d.address, FIELD_LIMITS.address);
  out.hours = clipText(d.hours, FIELD_LIMITS.hours, true);
  out.reviews = clipText(d.reviews, FIELD_LIMITS.reviews, true);
  out.city = clipText(d.city, FIELD_LIMITS.city);
  out.areas = clipText(d.areas, FIELD_LIMITS.areas);
  out.industryOther = clipText(d.industryOther, FIELD_LIMITS.industryOther);
  out.stats = clipText(d.stats, FIELD_LIMITS.stats, true);
  out.insurance = clipText(d.insurance, FIELD_LIMITS.insurance, true);
  out.whatsapp = clipText(d.whatsapp, FIELD_LIMITS.whatsapp);
  out.country = clipText(d.country, FIELD_LIMITS.country);
  if (Array.isArray(d.services)) {
    out.services = d.services.slice(0, MAX_SERVICES).map(s => s && typeof s === 'object' ? {
      name: clipText(s.name, FIELD_LIMITS.serviceName),
      desc: clipText(s.desc, FIELD_LIMITS.serviceDesc, true),
      price: clipText(s.price, FIELD_LIMITS.servicePrice),
    } : null).filter(s => s && s.name);
  }
  out.logo = safeUrl(d.logo, kind);
  out.photos = Array.isArray(d.photos) ? d.photos.map(p => safeUrl(p, kind)).filter(Boolean).slice(0, MAX_SITE_PHOTOS) : [];
  if (Array.isArray(d.ba)) {
    out.ba = d.ba.map(p => p && typeof p === 'object' ? { ...p, b: safeUrl(p.b, kind), a: safeUrl(p.a, kind) } : p)
      .filter(p => p && p.b && p.a);
  }
  out.facebook = safeUrl(d.facebook, 'social');
  out.instagram = safeUrl(d.instagram, 'social');
  out.other = safeUrl(d.other, 'social');
  out.bookingUrl = safeUrl(d.bookingUrl, 'social');
  const ov = sanitizePhotoOverrides(d.photoOverrides, kind);
  if (ov) out.photoOverrides = ov;
  else delete out.photoOverrides;
  return out;
}

/** Keep only known preview options; clip any client-edited copy. Does not touch WebiMade plan prices. */
export function sanitizeOpts(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {};
  if (o.style) out.style = clipText(o.style, 40);
  if (o.accent) out.accent = clipText(o.accent, 20);
  if (o.minimal) out.minimal = true;
  if (o.white) out.white = true;
  if (typeof o.dark === 'boolean') out.dark = o.dark;
  if (o.headline) out.headline = clipText(o.headline, FIELD_LIMITS.headline);
  if (o.lead) out.lead = clipText(o.lead, FIELD_LIMITS.lead, true);
  if (o.ctaLabel) out.ctaLabel = clipText(o.ctaLabel, FIELD_LIMITS.ctaLabel);
  if (+o.design > 0) out.design = Math.min(99, Math.floor(+o.design));
  return out;
}

export function applyPrices(body) {
  const connect = body && body.domain === 'connect';
  return {
    currency: PRICES.currency,
    setup: PRICES.setup,
    monthly: PRICES.monthly,
    dueToday: PRICES.setup + PRICES.monthly + (connect ? PRICES.domainConnect : 0),
    domain: connect ? 'connect own domain' : 'free address',
  };
}

export function sniffImage(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'image/png';
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}

export function leadHasHoneypot(body) {
  if (!body || typeof body !== 'object') return false;
  const filled = v => typeof v === 'string' && v.trim() !== '';
  if (filled(body.company_url)) return true;
  const fields = body.fields;
  return !!(fields && typeof fields === 'object' && filled(fields.company_url));
}

export function adminHostAllowed(req, env) {
  const allowed = String((env && env.ADMIN_HOST) || '').trim().toLowerCase();
  if (!allowed) return true;
  let host = '';
  try { host = (req.headers.get('host') || new URL(req.url).hostname || '').toLowerCase(); } catch { host = ''; }
  host = host.split(':')[0];
  return host === allowed;
}

export function isAdminPath(pathname) {
  return pathname === '/admin' || pathname === '/admin.html' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');
}

export function baseSecHeaders() {
  return {
    'strict-transport-security': HSTS,
    'x-content-type-options': 'nosniff',
    'permissions-policy': PERMISSIONS_POLICY,
    'referrer-policy': 'strict-origin-when-cross-origin',
  };
}

export function withSecHeaders(headers, extra = {}) {
  return { ...baseSecHeaders(), ...headers, ...extra };
}

export function applyAssetHeaders(req, res) {
  const path = new URL(req.url).pathname;
  const type = res.headers.get('content-type') || '';
  const html = type.includes('text/html');
  const admin = path === '/admin' || path === '/admin.html' || path.startsWith('/admin/');
  const h = new Headers(res.headers);
  h.set('strict-transport-security', HSTS);
  h.set('x-content-type-options', 'nosniff');
  h.set('permissions-policy', PERMISSIONS_POLICY);
  if (!h.has('referrer-policy')) h.set('referrer-policy', 'strict-origin-when-cross-origin');
  if (html) {
    h.set('content-security-policy', APP_CSP + "; frame-ancestors 'none'");
    h.set('x-frame-options', 'DENY');
  }
  if (admin) {
    if (!h.has('x-robots-tag')) h.set('x-robots-tag', 'noindex, nofollow');
    if (!h.has('cache-control')) h.set('cache-control', 'no-store');
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export function leadCorsHeaders(req) {
  const origin = req.headers.get('origin') || req.headers.get('Origin');
  let here = '';
  try { here = new URL(req.url).origin; } catch { here = ''; }
  if (origin && here && origin === here) {
    return {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'vary': 'Origin',
    };
  }
  return {};
}


/* Owner-only editor access. The raw token is stored in an HttpOnly cookie, never
   in the public /p/ HTML. Public share-link viewers do not get the edit bar. */
export const EDIT_ID_RE = /^[A-Za-z0-9]{10,40}$/;
export const EDIT_TOKEN_RE = /^[A-Za-z0-9]{10,64}$/;
export function isEditId(id) { return EDIT_ID_RE.test(id || ''); }
export function editCookieName(id) { return isEditId(id) ? 'wod_ed_' + id : ''; }
export function tokenFromCookie(req, id) {
  if (!req || !isEditId(id)) return '';
  const raw = (req.headers && req.headers.get && req.headers.get('cookie')) || '';
  const name = editCookieName(id);
  if (!name) return '';
  for (const part of String(raw).split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === name && EDIT_TOKEN_RE.test(v)) return v;
  }
  return '';
}
export function requestEditToken(req, id, bodyToken) {
  const fromBody = typeof bodyToken === 'string' && EDIT_TOKEN_RE.test(bodyToken) ? bodyToken : '';
  const fromHeader = (req && req.headers && req.headers.get && req.headers.get('x-token')) || '';
  const headerTok = EDIT_TOKEN_RE.test(fromHeader) ? fromHeader : '';
  return tokenFromCookie(req, id) || headerTok || fromBody || '';
}
export function ownerCookieHeader(id, token, maxAge) {
  const name = editCookieName(id);
  if (!name || !EDIT_TOKEN_RE.test(token || '')) return '';
  const age = Math.max(0, Math.floor(+maxAge || 0));
  return `${name}=${token}; Path=/; SameSite=Lax; Secure; HttpOnly; Max-Age=${age}`;
}
export function ownerEditBarHtml(id) {
  if (!isEditId(id)) return '';
  const href = '/edit/' + id;
  return `<div id="wod-owner-bar" style="position:sticky;top:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;gap:14px;padding:10px 16px;background:#0A3336;color:#fff;font:600 14px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 8px 24px rgba(10,51,54,.28)">
  <span style="opacity:.85">You built this website.</span>
  <a href="${href}" target="_blank" rel="noopener" style="background:#14A69A;color:#fff;text-decoration:none;font-weight:700;padding:8px 14px;border-radius:10px">Edit your site ↗</a>
</div>`;
}
export function withOwnerEditBar(html, id) {
  const bar = ownerEditBarHtml(id);
  if (!bar || !html) return html;
  return String(html).replace(/<body([^>]*)>/i, `<body$1>${bar}`);
}
