/* Website on Demand – Cloudflare Worker (phase 1)
   Static order app + admin page are served from ./public (Workers static assets).
   This script handles: /api/*, /p/<id> (previews), /s/<slug> (live sites), /i/<id>/<key> (uploaded photos). */

const DAY = 86400;
const LIMITS = {
  newPerIpDay: 20,          // new requests per IP per day
  savesPerSubDay: 60,       // preview saves per request per day
  imgPerSub: 30,            // photo uploads per request (lifetime)
  imgBytes: 1.5 * 1024 * 1024,
  saveBytes: 1.5 * 1024 * 1024,
  htmlBytes: 900 * 1024,
  liveHtmlBytes: 2 * 1024 * 1024,
  leadBytes: 12 * 1024,
  leadsPerIpDay: 20,
  loginPerIp15m: 8,
};
const RESERVED = new Set(['www', 'mail', 'app', 'api', 'admin', 'preview', 'get', 'order', 'help', 'support', 'billing', 'status', 'blog', 'dev', 'test', 'p', 's', 'i']);
const IMG_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/* ---------- helpers ---------- */
const now = () => new Date().toISOString();
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
const bad = (msg, status = 400) => json({ error: msg }, status);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function rid(n) {
  const a = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = new Uint8Array(n); crypto.getRandomValues(b);
  let s = ''; for (const x of b) s += a[x % a.length]; return s;   // 56 chars: slight modulo bias is irrelevant here
}
async function sha256(s) { const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join(''); }
async function hmac(key, msg) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function safeEq(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
const ip = req => req.headers.get('cf-connecting-ip') || '0.0.0.0';
const slugify = s => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/;

async function readBody(req, max) {
  const len = +req.headers.get('content-length') || 0;
  if (len > max) throw new HttpErr('Too large', 413);
  const buf = await req.arrayBuffer();
  if (buf.byteLength > max) throw new HttpErr('Too large', 413);
  return buf;
}
async function readJSON(req, max) {
  const buf = await readBody(req, max);
  try { return JSON.parse(new TextDecoder().decode(buf)); } catch { throw new HttpErr('Bad JSON', 400); }
}
class HttpErr extends Error { constructor(m, s) { super(m); this.status = s; } }

/* Fixed-window rate limit kept in D1 (KV's 1,000 writes/day are saved for previews and photos). */
async function allow(env, key, limit, windowSec) {
  const t = Math.floor(Date.now() / 1000), bucket = Math.floor(t / windowSec);
  const row = await env.DB.prepare('INSERT INTO rate(k,n,exp) VALUES(?1,1,?2) ON CONFLICT(k) DO UPDATE SET n=n+1 RETURNING n')
    .bind(`${key}:${bucket}`, (bucket + 1) * windowSec).first();
  return row.n <= limit;
}
async function event(env, subId, type, detail) {
  await env.DB.prepare('INSERT INTO events(sub_id,at,type,detail) VALUES(?,?,?,?)').bind(subId, now(), type, detail == null ? null : (typeof detail === 'string' ? detail : JSON.stringify(detail))).run();
}

/* ---------- EMAIL HOOK ----------
   Phase 1: no email provider yet, so every email is recorded as an 'email_pending' event that the admin page lists
   ("would be sent"). Phase 2: set the RESEND_API_KEY secret (and EMAIL_FROM var) and the same calls send for real. */
async function sendEmail(env, subId, msg) {
  // msg = { to, subject, text, replyTo?, kind }
  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    try {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from: env.EMAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text, reply_to: msg.replyTo || env.NOTIFY_EMAIL }) });
      await event(env, subId, r.ok ? 'email_sent' : 'email_failed', { ...msg, status: r.status });
    } catch (e) { await event(env, subId, 'email_failed', { ...msg, error: String(e) }); }
    return;
  }
  await event(env, subId, 'email_pending', msg);
}

/* ---------- auth (admin) ---------- */
const COOKIE = 'wod_admin';
async function sessionValue(env, exp) { return `${exp}.${await hmac(env.ADMIN_PASSWORD + '|session', String(exp))}`; }
async function isAdmin(req, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const c = (req.headers.get('cookie') || '').split(/;\s*/).find(x => x.startsWith(COOKIE + '='));
  if (!c) return false;
  const v = c.slice(COOKIE.length + 1), exp = +v.split('.')[0];
  if (!exp || exp < Date.now() / 1000) return false;
  return safeEq(v, await sessionValue(env, exp));
}

/* ---------- pages ---------- */
function plainPage(title, body, status = 200, extraHead = '') {
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">${extraHead}
<title>${esc(title)}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f7fb;color:#1f2430}
.c{max-width:480px;margin:24px;padding:36px 32px;background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(20,30,60,.08);text-align:center}h1{font-size:24px;margin:0 0 10px;letter-spacing:-.3px}p{color:#5a6273;margin:0 0 18px}
a.b{display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600}.ic{font-size:40px;margin-bottom:6px}</style></head>
<body><div class="c">${body}</div></body></html>`, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' } });
}
const expiredPage = () => plainPage('Preview expired', `<div class="ic">⏳</div><h1>This preview has expired</h1><p>Website previews are kept for 14 days. You can build a new one in a couple of minutes.</p><a class="b" href="/">Build my website preview</a>`, 404);
const offlinePage = () => plainPage('Website offline', `<div class="ic">🌙</div><h1>This website is offline right now</h1><p>Sorry, this page isn't available at the moment. Please check back soon.</p>`, 404);

/* ---------- handlers ---------- */
async function apiNew(req, env) {
  if (!await allow(env, 'new:' + ip(req), LIMITS.newPerIpDay, DAY)) return bad('Too many new requests from your connection today. Please try again tomorrow.', 429);
  const b = await readJSON(req, 4096);
  const id = rid(18), token = rid(32), t = now();
  await env.DB.prepare('INSERT INTO submissions(id,token_hash,created_at,updated_at,status,name,email,ip,ip_country) VALUES(?,?,?,?,?,?,?,?,?)')
    .bind(id, await sha256(token), t, t, 'previewing', String(b.name || '').slice(0, 120), String(b.email || '').slice(0, 200), ip(req), req.cf && req.cf.country || null).run();
  await event(env, id, 'created', { name: b.name, email: b.email });
  // occasional cleanup of old rate-limit rows
  if (Math.random() < 0.1) await env.DB.prepare('DELETE FROM rate WHERE exp < ?').bind(Math.floor(Date.now() / 1000)).run();
  return json({ id, token });
}
async function subWithToken(env, id, token) {
  if (!/^[A-Za-z0-9]{10,40}$/.test(id || '') || typeof token !== 'string') throw new HttpErr('Not found', 404);
  const s = await env.DB.prepare('SELECT * FROM submissions WHERE id=?').bind(id).first();
  if (!s || !safeEq(s.token_hash, await sha256(token))) throw new HttpErr('Not found', 404);
  return s;
}
async function apiImg(req, env, id) {
  const s = await subWithToken(env, id, req.headers.get('x-token'));
  const type = (req.headers.get('content-type') || '').split(';')[0].trim();
  if (!IMG_TYPES.has(type)) return bad('Only JPG, PNG or WebP photos');
  if (s.img_count >= LIMITS.imgPerSub) return bad('Too many photos for this request', 429);
  const buf = await readBody(req, LIMITS.imgBytes);
  if (!buf.byteLength) return bad('Empty file');
  const k = rid(10);
  await env.KV.put(`img:${id}:${k}`, buf, { metadata: { type } });
  await env.DB.prepare('UPDATE submissions SET img_count=img_count+1 WHERE id=?').bind(id).run();
  return json({ url: `/i/${id}/${k}` });
}
async function getImg(env, id, k) {
  if (!/^[A-Za-z0-9]{10,40}$/.test(id) || !/^[A-Za-z0-9]{6,20}$/.test(k)) return new Response('Not found', { status: 404 });
  const { value, metadata } = await env.KV.getWithMetadata(`img:${id}:${k}`, { type: 'stream', cacheTtl: 3600 });
  if (!value) return new Response('Not found', { status: 404 });
  return new Response(value, { headers: { 'content-type': (metadata && metadata.type) || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff', 'access-control-allow-origin': '*' } });
}
async function apiSave(req, env, id) {
  const b = await readJSON(req, LIMITS.saveBytes);
  const s = await subWithToken(env, id, b.token);
  if (!await allow(env, 'save:' + id, LIMITS.savesPerSubDay, DAY)) return bad('Too many updates today for this website. Please try again tomorrow.', 429);
  const d = b.data || {}, html = String(b.html || '');
  if (!html.startsWith('<!DOCTYPE html>') || html.length > LIMITS.htmlBytes) return bad('Preview is missing or too large');
  if (/data:image\//.test(JSON.stringify(d))) return bad('Photos must be uploaded first');
  const days = +env.PREVIEW_DAYS || 14, applied = s.status !== 'previewing';
  const ttl = (applied ? 60 : days) * DAY, exp = new Date(Date.now() + ttl * 1000).toISOString(), t = now();
  await env.KV.put(`pv:${id}`, html, { expirationTtl: ttl });
  await env.DB.prepare(`UPDATE submissions SET updated_at=?, name=?, slug=?, email=?, phone=?, country=?, industry=?, data_json=?, opts_json=?, version=?, revisions_json=?, placeholders_json=?, style_key=?, preview_expires_at=? WHERE id=?`)
    .bind(t, String(d.name || '').slice(0, 120), slugify(d.name), String(d.email || '').slice(0, 200), String(d.phone || '').slice(0, 60), String(d.country || '').slice(0, 10),
      d.industry === 'other' ? 'other: ' + String(d.industryOther || '').slice(0, 60) : String(d.industry || '').slice(0, 60),
      JSON.stringify(d), JSON.stringify(b.opts || {}), +b.version || 1, JSON.stringify(b.revisions || []), JSON.stringify(b.placeholders || []), String(b.styleKey || '').slice(0, 30), exp, id).run();
  const origin = new URL(req.url).origin, url = `${origin}/p/${id}`;
  const first = !s.data_json;
  await event(env, id, first ? 'preview_saved' : 'preview_updated', { version: +b.version || 1, notes: (b.revisions || []).slice(-1)[0] || null });
  if (first) {
    await sendEmail(env, id, { kind: 'client_preview', to: d.email, subject: `Your website preview for ${d.name}`,
      text: `Hi,\n\nYour website preview for ${d.name} is ready:\n${url}\n\nOpen it on your phone or share it with a partner. The link works until ${exp.slice(0, 10)}.\nWhen you're happy, press "Approve" and then "Apply now".\n\n${env.BRAND_NAME}` });
    await sendEmail(env, id, { kind: 'admin_new', to: env.NOTIFY_EMAIL, subject: `New preview: ${d.name} (${d.country || '?'})`,
      text: `New website preview\nBusiness: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCountry: ${d.country}\nIndustry: ${d.industry}${d.industryOther ? ' / ' + d.industryOther : ''}\nPreview: ${url}\nAdmin: ${origin}/admin` });
  }
  return json({ ok: true, url, expiresAt: exp });
}
async function apiApply(req, env, id) {
  const b = await readJSON(req, 8192);
  const s = await subWithToken(env, id, b.token);
  if (!s.data_json) return bad('Please build your preview first');
  const apply = { email: String(b.email || '').slice(0, 200), domain: b.domain === 'connect' ? 'connect own domain' : 'free address', dueToday: +b.dueToday || null,
    currency: String(b.currency || '').slice(0, 4), setup: +b.setup || null, monthly: +b.monthly || null, version: +b.version || s.version, at: now(), ip: ip(req) };
  const t = now(), status = s.status === 'published' ? s.status : 'applied';
  await env.DB.prepare('UPDATE submissions SET status=?, apply_json=?, applied_at=?, updated_at=? WHERE id=?').bind(status, JSON.stringify(apply), t, t, id).run();
  // keep the preview while Abdul arranges payment
  const html = await env.KV.get(`pv:${id}`);
  if (html) await env.KV.put(`pv:${id}`, html, { expirationTtl: 60 * DAY });
  await env.DB.prepare('UPDATE submissions SET preview_expires_at=? WHERE id=?').bind(new Date(Date.now() + 60 * DAY * 1000).toISOString(), id).run();
  await event(env, id, 'applied', apply);
  const d = JSON.parse(s.data_json), origin = new URL(req.url).origin;
  await sendEmail(env, id, { kind: 'admin_applied', to: env.NOTIFY_EMAIL, subject: `APPLIED: ${d.name} – send payment link`,
    text: `${d.name} pressed Apply now.\nEmail: ${apply.email}\nPhone: ${d.phone}\nCountry: ${d.country}\nPlan: ${apply.currency}${apply.setup} setup + ${apply.currency}${apply.monthly}/month, ${apply.domain} (due today ${apply.currency}${apply.dueToday})\nPreview (v${apply.version}): ${origin}/p/${id}\nAdmin: ${origin}/admin\n\nAll details:\n${JSON.stringify(d, null, 2)}` });
  await sendEmail(env, id, { kind: 'client_applied', to: apply.email, subject: `We've got your application – ${d.name}`,
    text: `Hi,\n\nThanks for applying! We've saved your website (${origin}/p/${id}).\nWe'll send you a secure payment link shortly; your website goes live as soon as it's paid.\n\nQuestions? Just reply to this email.\n\n${env.BRAND_NAME}` });
  return json({ ok: true });
}
async function getPreview(env, id) {
  if (!/^[A-Za-z0-9]{10,40}$/.test(id)) return expiredPage();
  const html = await env.KV.get(`pv:${id}`, { cacheTtl: 60 });
  if (!html) return expiredPage();
  env.DB.prepare('UPDATE submissions SET preview_opens=preview_opens+1 WHERE id=?').bind(id).run().catch(() => {});
  return new Response(html, { headers: {
    'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, max-age=30', 'x-robots-tag': 'noindex, nofollow', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer',
    // preview HTML is built in the visitor's browser, so it is untrusted: run it in an opaque-origin sandbox (no cookies, no same-origin API access)
    'content-security-policy': "sandbox allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms; frame-ancestors 'self'" } });
}
async function getSite(env, slug) {
  if (!SLUG_RE.test(slug)) return offlinePage();
  const html = await env.KV.get(`site:${slug}`, { cacheTtl: 60 });
  if (!html) return offlinePage();
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN' } });
}
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
async function apiLead(req, env, slug) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (!SLUG_RE.test(slug)) return bad('Not found', 404);
  if (!await allow(env, 'lead:' + ip(req), LIMITS.leadsPerIpDay, DAY)) return json({ error: 'Too many messages' }, 429, CORS);
  const b = await readJSON(req, LIMITS.leadBytes);
  const s = await env.DB.prepare("SELECT id, name, email, data_json FROM submissions WHERE published_slug=? AND status='published'").bind(slug).first();
  if (!s) return json({ error: 'Not found' }, 404, CORS);
  const fields = {}; for (const [k, v] of Object.entries(b.fields || {}).slice(0, 30)) fields[String(k).slice(0, 40)] = String(v).slice(0, 2000);
  await env.DB.prepare('INSERT INTO leads(slug,sub_id,at,data_json,ip) VALUES(?,?,?,?,?)').bind(slug, s.id, now(), JSON.stringify(fields), ip(req)).run();
  const d = JSON.parse(s.data_json || '{}');
  await sendEmail(env, s.id, { kind: 'owner_lead', to: d.email || s.email, subject: `New enquiry from your website (${s.name})`,
    text: `You have a new enquiry from your website:\n\n${Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nSent via ${env.BRAND_NAME}`, replyTo: fields.email || undefined });
  return json({ ok: true }, 200, CORS);
}

/* ---------- admin API ---------- */
async function adminLogin(req, env) {
  if (!env.ADMIN_PASSWORD) return bad('Admin password not configured', 500);
  if (!await allow(env, 'login:' + ip(req), LIMITS.loginPerIp15m, 900)) return bad('Too many attempts. Wait 15 minutes.', 429);
  const b = await readJSON(req, 1024);
  if (!safeEq(await sha256(String(b.password || '')), await sha256(env.ADMIN_PASSWORD))) { await event(env, null, 'admin_login_failed', { ip: ip(req) }); return bad('Wrong password', 401); }
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=${await sessionValue(env, exp)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${12 * 3600}` });
}
async function adminList(env) {
  const subs = (await env.DB.prepare('SELECT id,created_at,updated_at,status,name,slug,email,phone,country,industry,data_json,opts_json,version,revisions_json,placeholders_json,style_key,preview_expires_at,preview_opens,img_count,apply_json,applied_at,paid_json,published_slug,published_at,ip_country FROM submissions ORDER BY created_at DESC LIMIT 300').all()).results;
  const events = (await env.DB.prepare('SELECT id,sub_id,at,type,detail FROM events ORDER BY id DESC LIMIT 1000').all()).results;
  const leads = (await env.DB.prepare('SELECT id,slug,sub_id,at,data_json FROM leads ORDER BY id DESC LIMIT 300').all()).results;
  return json({ subs, events, leads });
}
async function adminPublish(req, env, id, origin) {
  const b = await readJSON(req, LIMITS.liveHtmlBytes + 64 * 1024);
  const s = await env.DB.prepare('SELECT * FROM submissions WHERE id=?').bind(id).first();
  if (!s) return bad('Not found', 404);
  const slug = String(b.slug || '');
  if (!SLUG_RE.test(slug) || RESERVED.has(slug)) return bad('Choose another web address (letters, numbers and dashes only)');
  const clash = await env.DB.prepare("SELECT id FROM submissions WHERE published_slug=? AND id<>? AND status='published'").bind(slug, id).first();
  if (clash) return bad('That web address is already used by another live site');
  const html = String(b.html || '');
  if (!html.startsWith('<!DOCTYPE html>') || html.length > LIMITS.liveHtmlBytes) return bad('Live HTML missing or too large');
  if (/class="sample-tag"/.test(html)) return bad('Refusing to publish: the live HTML still contains sample content');
  // if the site moves to a new address, take the old one down
  if (s.published_slug && s.published_slug !== slug) await env.KV.delete(`site:${s.published_slug}`);
  await env.KV.put(`site:${slug}`, html);
  const t = now(), paid = s.paid_json ? JSON.parse(s.paid_json) : null;
  const newPaid = b.paid ? { provider: 'manual', amount: String(b.paid.amount || '').slice(0, 20), currency: String(b.paid.currency || '').slice(0, 4), reference: String(b.paid.reference || '').slice(0, 120), at: t } : paid;
  await env.DB.prepare("UPDATE submissions SET status='published', paid_json=?, published_slug=?, published_at=?, updated_at=? WHERE id=?").bind(newPaid ? JSON.stringify(newPaid) : null, slug, t, t, id).run();
  if (b.paid && !paid) await event(env, id, 'paid', newPaid);
  const url = `${origin}/s/${slug}`;
  await event(env, id, s.published_at ? 'republished' : 'published', { url, bytes: html.length });
  if (!s.published_at || s.status !== 'published') {
    const d = JSON.parse(s.data_json || '{}'), apply = s.apply_json ? JSON.parse(s.apply_json) : {};
    await sendEmail(env, id, { kind: 'client_live', to: apply.email || d.email || s.email, subject: `Your website is live: ${d.name}`,
      text: `Hi,\n\nGreat news: your website for ${d.name} is live:\n${url}\n\nYour monthly plan covers hosting, security and small changes. For any change, just reply to this email or write to ${env.NOTIFY_EMAIL}.\n\n${env.BRAND_NAME}`, replyTo: env.NOTIFY_EMAIL });
  }
  return json({ ok: true, url });
}
async function adminUnpublish(env, id) {
  const s = await env.DB.prepare('SELECT * FROM submissions WHERE id=?').bind(id).first();
  if (!s) return bad('Not found', 404);
  if (s.published_slug) await env.KV.delete(`site:${s.published_slug}`);
  const t = now();
  await env.DB.prepare("UPDATE submissions SET status='unpublished', updated_at=? WHERE id=?").bind(t, id).run();
  await event(env, id, 'unpublished', { slug: s.published_slug });
  return json({ ok: true });
}

/* ---------- router ---------- */
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname, m = req.method;
    try {
      let r;
      if (p.startsWith('/api/')) {
        if (m === 'POST' && p === '/api/new') return await apiNew(req, env);
        if (m === 'POST' && (r = p.match(/^\/api\/img\/([A-Za-z0-9]+)$/))) return await apiImg(req, env, r[1]);
        if (m === 'POST' && (r = p.match(/^\/api\/save\/([A-Za-z0-9]+)$/))) return await apiSave(req, env, r[1]);
        if (m === 'POST' && (r = p.match(/^\/api\/apply\/([A-Za-z0-9]+)$/))) return await apiApply(req, env, r[1]);
        if ((m === 'POST' || m === 'OPTIONS') && (r = p.match(/^\/api\/lead\/([a-z0-9-]+)$/))) return await apiLead(req, env, r[1]);
        if (m === 'POST' && p === '/api/admin/login') return await adminLogin(req, env);
        if (m === 'POST' && p === '/api/admin/logout') return json({ ok: true }, 200, { 'set-cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
        if (p.startsWith('/api/admin/')) {
          if (!await isAdmin(req, env)) return bad('Please log in', 401);
          if (m !== 'GET' && req.headers.get('x-wod-admin') !== '1') return bad('Bad request', 400);   // CSRF belt and braces (cookie is SameSite=Strict too)
          if (m === 'GET' && p === '/api/admin/list') return await adminList(env);
          if (m === 'POST' && (r = p.match(/^\/api\/admin\/publish\/([A-Za-z0-9]+)$/))) return await adminPublish(req, env, r[1], url.origin);
          if (m === 'POST' && (r = p.match(/^\/api\/admin\/unpublish\/([A-Za-z0-9]+)$/))) return await adminUnpublish(env, r[1]);
        }
        return bad('Not found', 404);
      }
      if ((m === 'GET' || m === 'HEAD') && (r = p.match(/^\/p\/([A-Za-z0-9]+)\/?$/))) return await getPreview(env, r[1]);
      if ((m === 'GET' || m === 'HEAD') && (r = p.match(/^\/s\/([a-z0-9-]+)\/?$/))) return await getSite(env, r[1]);
      if ((m === 'GET' || m === 'HEAD') && (r = p.match(/^\/i\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)$/))) return await getImg(env, r[1], r[2]);
      if (p.startsWith('/s/')) return offlinePage();
      if (p.startsWith('/p/')) return expiredPage();
      return env.ASSETS.fetch(req);
    } catch (e) {
      if (e instanceof HttpErr) return bad(e.message, e.status);
      console.error(e && e.stack || e);
      return bad('Server error', 500);
    }
  },
};
