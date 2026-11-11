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

export function sanitizeSiteData(d, opts = {}) {
  const kind = opts.allowData ? 'preview' : 'img';
  if (!d || typeof d !== 'object') return {};
  const out = { ...d };
  out.logo = safeUrl(d.logo, kind);
  out.photos = Array.isArray(d.photos) ? d.photos.map(p => safeUrl(p, kind)).filter(Boolean) : [];
  if (Array.isArray(d.ba)) {
    out.ba = d.ba.map(p => p && typeof p === 'object' ? { ...p, b: safeUrl(p.b, kind), a: safeUrl(p.a, kind) } : p)
      .filter(p => p && p.b && p.a);
  }
  out.facebook = safeUrl(d.facebook, 'social');
  out.instagram = safeUrl(d.instagram, 'social');
  out.other = safeUrl(d.other, 'social');
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
