/* Minimal preview API for wod-brand-preview only. Not production.
   Lets /api/new, /api/save, /api/img and /p/<id> work so the shareable
   preview link can be demonstrated, without touching production D1/KV. */
const DAY = 86400;
const PREVIEW_DAYS = 14;
const store = caches.default;

function json(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...extra } });
}
function bad(msg, status = 400) { return json({ error: msg }, status); }
function rid(n) {
  const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const b = new Uint8Array(n); crypto.getRandomValues(b);
  return Array.from(b, x => a[x % a.length]).join('');
}
function keyUrl(kind, id, extra) {
  return new Request('https://wod-brand-preview.store/' + kind + '/' + id + (extra ? '/' + extra : ''));
}
async function putStore(kind, id, body, type, extra, ttl = PREVIEW_DAYS * DAY) {
  const res = new Response(body, { headers: { 'content-type': type, 'cache-control': 'max-age=' + ttl } });
  await store.put(keyUrl(kind, id, extra), res);
}
async function getStore(kind, id, extra) {
  return store.match(keyUrl(kind, id, extra));
}

async function handle(req) {
  const url = new URL(req.url), p = url.pathname, m = req.method;
  if (m === 'POST' && p === '/api/new') {
    const id = rid(18), token = rid(32);
    await putStore('meta', id, JSON.stringify({ token, created: Date.now() }), 'application/json');
    return json({ id, token });
  }
  if (m === 'POST' && p.startsWith('/api/img/')) {
    const id = p.slice('/api/img/'.length);
    const meta = await getStore('meta', id);
    if (!meta) return bad('Not found', 404);
    const rec = await meta.json();
    if (rec.token !== req.headers.get('x-token')) return bad('Not found', 404);
    const type = (req.headers.get('content-type') || 'image/jpeg').split(';')[0].trim();
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return bad('Only JPG, PNG or WebP photos');
    const buf = await req.arrayBuffer();
    if (!buf.byteLength) return bad('Empty file');
    const k = rid(10);
    await putStore('img', id, buf, type, k);
    return json({ url: `/i/${id}/${k}` });
  }
  if (m === 'POST' && p.startsWith('/api/save/')) {
    const id = p.slice('/api/save/'.length);
    const meta = await getStore('meta', id);
    if (!meta) return bad('Not found', 404);
    const rec = await meta.json();
    let b; try { b = await req.json(); } catch { return bad('Invalid JSON'); }
    if (rec.token !== b.token) return bad('Not found', 404);
    const html = String(b.html || '');
    if (!html.startsWith('<!DOCTYPE html>') || html.length > 2_000_000) return bad('Preview is missing or too large');
    const exp = new Date(Date.now() + PREVIEW_DAYS * DAY * 1000).toISOString();
    rec.expiresAt = exp;
    await putStore('meta', id, JSON.stringify(rec), 'application/json');
    await putStore('pv', id, html, 'text/html;charset=utf-8');
    return json({ ok: true, url: `${url.origin}/p/${id}`, expiresAt: exp });
  }
  if (m === 'POST' && p.startsWith('/api/apply/')) {
    return bad('This is a preview of the product. Applications are taken on the live site.', 400);
  }
  if (m === 'GET' && p.startsWith('/p/')) {
    const id = p.slice('/p/'.length).split('/')[0];
    const pv = await getStore('pv', id);
    if (!pv) return new Response('This preview link has expired or was not found.', { status: 404, headers: { 'content-type': 'text/plain;charset=utf-8' } });
    return new Response(pv.body, { headers: { 'content-type': 'text/html;charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'private, max-age=60' } });
  }
  if (m === 'GET' && p.startsWith('/i/')) {
    const parts = p.slice('/i/'.length).split('/');
    const img = await getStore('img', parts[0], parts[1]);
    if (!img) return new Response('Not found', { status: 404 });
    return new Response(img.body, { headers: { 'content-type': img.headers.get('content-type') || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  }
  return null;
}

function withPreviewNoindex(res) {
  // Preview Worker only: never compete with https://webimade.com in search results.
  // Do not copy this wrapper into the production worker.
  const h = new Headers(res.headers);
  h.set('x-robots-tag', 'noindex, nofollow');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

export default {
  async fetch(req, env) {
    let res;
    try {
      const r = await handle(req);
      res = r || await env.ASSETS.fetch(req);
    } catch (err) {
      res = json({ error: 'Server error' }, 500);
    }
    return withPreviewNoindex(res);
  }
};
