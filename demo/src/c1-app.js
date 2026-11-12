/* =====================================================================
   APP (client side of the demo): intake form -> 3 bots -> preview -> go live
   BRAND – rename the agency / change prices here; everything picks it up
   ===================================================================== */
const BRAND = { name: 'WebiMade', domain: 'webimade.com', setup: 50, monthly: 29, domainConnect: 10, currency: '$' };
const STORE_KEY = 'sitespark_demo_v2';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = hh;
const slug = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'yourbusiness';
const money = n => BRAND.currency + n;
const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const MAX_PHOTOS = 6;

$$('[data-brand]').forEach(e => e.textContent = BRAND.name);
$$('[data-brand-initial]').forEach(e => e.textContent = BRAND.name[0]);
document.title = BRAND.name + ' | Get a website for your business';
(function absolutizeShareMeta() {
  // Canonical, OG and Twitter URLs always point at the public site, even on the preview Worker.
  const site = 'https://webimade.com';
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => {
    const v = m.getAttribute('content');
    if (v && v.startsWith('/')) m.setAttribute('content', site + v);
  });
})();

const COLOURS = [['', 'Auto – match my industry'], ['#1d4ed8', 'Blue'], ['#0f766e', 'Teal'], ['#15803d', 'Green'], ['#b91c1c', 'Red'], ['#ea580c', 'Orange'], ['#c8a24a', 'Gold'], ['#6d28d9', 'Purple'], ['#be185d', 'Pink'], ['#111827', 'Black'], ['custom', 'Pick my own…']];
const COLOUR_WORDS = { blue: '#1d4ed8', teal: '#0f766e', green: '#15803d', red: '#b91c1c', orange: '#ea580c', gold: '#c8a24a', yellow: '#eab308', purple: '#6d28d9', pink: '#be185d', navy: '#1e3a8a', burgundy: '#7f1d2d', maroon: '#7f1d2d', emerald: '#047857', coral: '#f26b5b', olive: '#5b6b2a', brown: '#7c4a21', silver: '#9ca3af', champagne: '#d4b483' };
const ACT_DEFAULT = { clinic: 'book', restaurant: 'reserve', home: 'quote', realestate: 'quote', salon: 'book', law: 'quote' };
let actAuto = false;   // true while the main-action radio was picked by us, not the owner
const industryLabel = d => d.industry === 'other' ? (d.industryOther || 'Other') : (INDUSTRIES.find(i => i[0] === d.industry) || [0, d.industry])[1];
const styleLabel = k => (STYLES[k] && STYLES[k].label) || k;

/* =====================================================================
   LIVE VERSION HOOK – AI copywriting / building
   In production this POSTs the intake data to our server, which calls an
   LLM with the build standard as the system prompt and returns JSON:
   { h1, eyebrow, lead, why:[[title,text]…], faq:[[q,a]…] }
   (every field optional; missing ones fall back to the built-in copy).
   Rule for the model: use only facts from the form, never invent numbers,
   awards, years or reviews.
   The demo returns null, so the built-in industry copy is used. No network.
   ===================================================================== */
async function generateWithAI(data) {
  // const res = await fetch('/api/generate-copy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  // if (res.ok) return await res.json();
  return null;
}

/* =====================================================================
   SERVER MODE (Cloudflare Worker backend). Off in the static GitHub demo:
   the backend build sets window.WOD_API = 1 before this script.
   - /api/new makes a request id + write token, /api/img uploads photos,
     /api/save stores the details + the preview at /p/<id> (14 days),
     /api/apply records "Apply now".
   ===================================================================== */
const API = typeof window !== 'undefined' && window.WOD_API ? true : false;
async function apiJSON(path, body) {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!r.ok) throw new Error((j && j.error) || ('Server error ' + r.status));
  return j;
}
async function apiImage(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const r = await fetch(`/api/img/${current.server.id}`, { method: 'POST', headers: { 'Content-Type': blob.type || 'image/jpeg', 'X-Token': current.server.token }, body: blob });
  let j = null; try { j = await r.json(); } catch (_) {}
  if (!r.ok) throw new Error((j && j.error) || 'Photo upload failed');
  return location.origin + j.url;
}
/* Saves the request and its preview on the server; returns the preview document built with hosted photo URLs. */
async function apiSavePreview(opts) {
  const d = current.data;
  if (!current.server) current.server = await apiJSON('/api/new', { name: d.name, email: d.email });
  if (/^data:/.test(d.logo || '')) d.logo = await apiImage(d.logo);
  for (let i = 0; i < (d.photos || []).length; i++) if (/^data:/.test(d.photos[i])) d.photos[i] = await apiImage(d.photos[i]);
  for (const p of (d.ba || [])) { if (/^data:/.test(p.b)) p.b = await apiImage(p.b); if (/^data:/.test(p.a)) p.a = await apiImage(p.a); }
  const saved = buildSite(d, opts, null, {});
  current.previewM = saved.M;
  const r = await apiJSON(`/api/save/${current.server.id}`, { token: current.server.token, data: d, opts, version: current.version, revisions: current.revisions,
    styleKey: saved.M.key, placeholders: saved.M.placeholders, html: saved.doc });
  current.shareUrl = r.url; current.shareExpires = r.expiresAt; current.savedVersion = current.version;
  return saved.doc;
}
let shareSavePromise = null, shareSaveState = 'idle', shareSaveError = '';
function startShareSave(opts) {
  shareSaveState = 'saving'; shareSaveError = '';
  const p = apiSavePreview(opts).then(doc => { shareSaveState = 'ready'; return doc; }).catch(err => {
    shareSaveState = 'error'; shareSaveError = (err && err.message) || 'Please try again.'; current.shareUrl = null; throw err;
  });
  shareSavePromise = p; return p;
}
async function retryShareSave() {
  if (!API || !current || shareSaveState === 'saving') return;
  shareSaveState = 'saving'; renderShare(); setOpenPreviewState();
  try { const doc = await startShareSave(cleanOpts(current.opts)); setPreviewDoc(doc); upsert(current); renderPreview(); }
  catch (err) { console.warn(err); renderShare(); setOpenPreviewState(); }
}
function setOpenPreviewState() {
  const open = $('#openPv'); if (!open) return;
  if (API && current && current.shareUrl) { open.href = current.shareUrl; open.classList.remove('is-wait'); open.setAttribute('aria-disabled', 'false'); }
  else if (API) { open.href = '#'; open.classList.toggle('is-wait', shareSaveState === 'saving'); open.setAttribute('aria-disabled', shareSaveState === 'saving' ? 'true' : 'false'); }
  else if (previews) { open.href = previews.url; open.classList.remove('is-wait'); open.removeAttribute('aria-disabled'); }
}

/* =====================================================================
   PREVIEW BOT: the client gets the full, working website.
   - Live / server mode: "Open your website preview" is an <a> to the hosted
     /p/<id> link. If the save is still running, the button waits ("Getting
     your link…") and then opens that real URL — never an about:blank tab.
     If the save fails, a retry control is shown instead.
   - Static demo: window.open('') is called synchronously inside the click
     (so iOS Safari and popup blockers allow it) and the page is written
     straight into it. If the browser refuses, the button is a real
     <a target="_blank"> to a Blob URL and the browser follows that instead.
   - The same document runs inside the page in a sandboxed iframe with a
     desktop / mobile toggle.
   ===================================================================== */
let pvBlobUrl = null;
function previewTitle() { return `${current.data.name}: website preview`; }
function setPreviewDoc(doc) {
  if (pvBlobUrl) URL.revokeObjectURL(pvBlobUrl);
  pvBlobUrl = URL.createObjectURL(new Blob([doc], { type: 'text/html;charset=utf-8' }));
  previews = { doc, url: pvBlobUrl, bytes: new Blob([doc]).size };
}
function openPreviewTab(e) {
  if (!previews) { if (e) e.preventDefault(); return; }
  if (API) {
    if (current && current.shareUrl) { current.previewOpens = (current.previewOpens || 0) + 1; upsert(current); return; }   // real hosted link: normal navigation
    if (e) e.preventDefault();
    openHostedWhenReady();
    return;
  }
  let w = null;
  try { w = window.open('', '_blank'); } catch (_) { w = null; }
  if (w && w.document) {
    if (e) e.preventDefault();
    try {
      w.document.open(); w.document.write(previews.doc); w.document.close();
      try { w.document.title = previewTitle(); } catch (_) {}
      try { w.focus(); } catch (_) {}
      current.previewOpens = (current.previewOpens || 0) + 1; upsert(current);
      $('#pvOpened').textContent = 'Opened in a new tab. Switch tabs to see it.';
      return;
    } catch (err) { try { w.close(); } catch (_) {} }
  }
  // window.open was blocked or failed: let the <a target="_blank" href="blob:..."> do its default navigation
  $('#pvOpened').innerHTML = `If no new tab appeared, <a href="${previews.url}" target="_blank" rel="noopener">tap here to open the preview</a>.`;
}
async function openHostedWhenReady() {
  const status = $('#pvOpened');
  if (status) status.textContent = 'Getting your link…';
  const btn = $('#openPv'); if (btn) btn.classList.add('is-wait');
  renderShare();
  try {
    if (shareSaveState === 'saving' && shareSavePromise) await shareSavePromise;
    else if (!current.shareUrl) await startShareSave(cleanOpts(current.opts));
  } catch (err) { console.warn(err); }
  if (current && current.shareUrl) {
    setOpenPreviewState(); renderShare();
    let w = null; try { w = window.open(current.shareUrl, '_blank', 'noopener'); } catch (_) { w = null; }
    if (!w) { if (status) status.innerHTML = `Your link is ready. <a href="${esc(current.shareUrl)}" target="_blank" rel="noopener">Tap here to open the preview</a>.`; }
    else { current.previewOpens = (current.previewOpens || 0) + 1; upsert(current); if (status) status.textContent = 'Opened in a new tab. Switch tabs to see it.'; }
  } else {
    if (status) status.textContent = 'We could not create your shareable link. Try again.';
    renderShare(); setOpenPreviewState();
  }
}
/* ---------------- State & storage ---------------- */
let editing = false, services = [], logoData = '', photos = [], baPairs = [], baDraft = {}, current = null, previews = null, device = 'desktop';
function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } }
function save(list) {
  const put = l => localStorage.setItem(STORE_KEY, JSON.stringify(l));
  try { put(list); return true; } catch (e) {
    // storage full: photos are the heavy part, so drop them from older submissions first, then from all
    try { put(list.map((s, i) => i ? { ...s, data: { ...s.data, photos: [], ba: [], photosDropped: (s.data.photos || []).length || s.data.photosDropped || 0 } } : s)); console.warn('Storage nearly full: removed photos from older submissions'); return true; }
    catch (e2) { try { put(list.map(s => ({ ...s, data: { ...s.data, photos: [], ba: [], photosDropped: (s.data.photos || []).length || s.data.photosDropped || 0 } }))); console.warn('Storage full: photos not saved'); return true; } catch (e3) { console.warn('Storage full', e3); return false; } }
  }
}
function upsert(sub) { const l = load(); const i = l.findIndex(x => x.id === sub.id); sub.updatedAt = new Date().toISOString(); if (i >= 0) l.splice(i, 1); l.unshift(sub); save(l); }

/* ---------------- Intake form ---------------- */
/* Industry: a typeable combobox. The hidden #industry / #industryOther keep the values the builder expects:
   a category key ('clinic'…'law'), or 'other' + the trade as typed. */
const IND_OPTS = [
  ...INDUSTRIES.filter(i => i[0] !== 'other').map(i => ({ label: i[1], industry: i[0], other: '', cat: true })),
  ...PROFILES.filter(p => p.k !== 'local').map(p => {
    const nat = Object.keys(NATIVE_PROFILE).find(c => NATIVE_PROFILE[c] === p.k);
    return { label: p.label, syn: p.syn || '', industry: nat || 'other', other: nat ? '' : p.label, cat: false };
  })];
function resolveIndustry(text) {
  const t = String(text || '').trim(), low = t.toLowerCase();
  if (!t) return { industry: '', other: '' };
  const hit = IND_OPTS.find(o => o.label.toLowerCase() === low);
  return hit ? { industry: hit.industry, other: hit.other } : { industry: 'other', other: t.slice(0, 40) };
}
function setIndustryValue(text) {
  const r = resolveIndustry(text);
  $('#industry').value = r.industry; $('#industryOther').value = r.other;
  syncIndustry(); syncExtras();
}
const combo = (() => {
  const inp = $('#industryInput'), list = $('#industryList');
  let items = [], active = -1;
  const mk = (q, s) => { const i = s.toLowerCase().indexOf(q.toLowerCase()); return !q || i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length)); };
  function open() {
    const q = inp.value.trim(), ql = q.toLowerCase();
    const starts = o => o.label.toLowerCase().split(/[^a-z]+/).some(w => w.startsWith(ql));
    items = q ? IND_OPTS.filter(o => (o.label + ' ' + (o.syn || '')).toLowerCase().includes(ql)).sort((a, b) => (starts(b) - starts(a)) || (b.cat - a.cat)).slice(0, 8)
      : IND_OPTS.filter(o => o.cat);
    const exact = items.some(o => o.label.toLowerCase() === ql);
    if (q && !exact) items.push({ label: q, typed: true });
    active = -1;
    list.innerHTML = items.map((o, i) => `<li role="option" id="indOpt${i}" data-i="${i}" aria-selected="false"${o.typed ? ' class="typed"' : ''}>${o.typed ? `<span>Use “<b>${esc(o.label)}</b>”</span>` : `<span>${mk(q, o.label)}</span>`}${o.cat ? '<small>Category</small>' : ''}</li>`).join('');
    list.hidden = !items.length; inp.setAttribute('aria-expanded', String(!!items.length)); inp.removeAttribute('aria-activedescendant');
    // keep the open list clear of the sticky Continue bar
    if (items.length) requestAnimationFrame(() => {
      const dock = inp.closest('form') && inp.closest('form').querySelector('.sticky-act'); if (!dock) return;
      const over = list.getBoundingClientRect().bottom - dock.getBoundingClientRect().top + 12;
      if (over > 0) window.scrollBy({ top: over, behavior: 'auto' });
    });
  }
  function close() { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); active = -1; }
  function move(n) {
    if (list.hidden) open(); if (!items.length) return;
    active = (active + n + items.length) % items.length;
    $$('li', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    const li = $('#indOpt' + active); inp.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' });
  }
  function choose(i) { const o = items[i]; if (!o) return; inp.value = o.label; setIndustryValue(o.label); close(); }
  inp.addEventListener('input', () => { setIndustryValue(inp.value); open(); });
  inp.addEventListener('focus', open);
  inp.addEventListener('click', () => { if (list.hidden) open(); });
  inp.addEventListener('blur', () => setTimeout(close, 120));
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { if (!list.hidden) { e.preventDefault(); if (active >= 0) choose(active); else close(); } }
    else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } }
    else if (e.key === 'Tab') close();
  });
  list.addEventListener('mousedown', e => e.preventDefault());   // keep focus in the input
  list.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) { choose(+li.dataset.i); inp.focus(); close(); } });
  return { close };
})();
// show the stored values as text (fill example, edit my details, start over)
function showIndustryText() {
  const v = $('#industry').value, o = $('#industryOther').value;
  const cat = INDUSTRIES.find(i => i[0] === v && v !== 'other');
  $('#industryInput').value = v === 'other' ? o : cat ? cat[1] : '';
}
$('#f-country').innerHTML = Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}">${esc(c.label)} (${esc(c.cur.trim())})</option>`).join('');
$('#colour').innerHTML = COLOURS.map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');
$('#chTheme').innerHTML += Object.keys(STYLES).map(k => `<option value="${k}">${esc(styleLabel(k))}</option>`).join('');
$('#chColour').innerHTML += COLOURS.filter(c => c[0] && c[0] !== 'custom').map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');
const EX_LABEL = { salon: 'Hair salon', clinic: 'Dental clinic', restaurant: 'Restaurant', home: 'Plumber', realestate: 'Estate agent', law: 'Law firm', graphic: 'Graphic design studio', gym: 'Gym & personal training' };
$('#exChips').innerHTML = Object.keys(EXAMPLES).map(k => `<button type="button" class="ex-chip" data-ex="${k}">${esc(EX_LABEL[k] || k)}</button>`).join('');

function syncIndustry() {
  const f = $('#intake').elements, v = f.industry.value;
  const k = v ? styleFor({ industry: v, industryOther: f.industryOther.value }) : '';
  $('#styleHint').textContent = k ? 'Style: ' + styleLabel(k) : '';
  // the default action follows the typed trade until the owner picks one themselves
  if (v && (!$('input[name=mainAction]:checked') || actAuto)) {
    let want = ACT_DEFAULT[k] || 'quote';
    try { const p = detectProfile({ name: '', industry: v, industryOther: f.industryOther.value, about: '', services: [] }); if (PROF_ACT[p.k]) want = PROF_ACT[p.k]; } catch (e) { /* keep the style default */ }
    const r = $(`input[name=mainAction][value=${want}]`); if (r) { r.checked = true; actAuto = true; } syncAction();
  }
}
function syncAction() {
  const wa = ($('input[name=mainAction]:checked') || {}).value === 'whatsapp';
  $('#waOpt').innerHTML = wa ? '<span class="req">*</span>' : '(optional)';
}
const syncColour = () => { $('#colourCustom').style.display = $('#colour').value === 'custom' ? 'block' : 'none'; };
$('#colour').onchange = syncColour;
$$('input[name=mainAction]').forEach(r => r.onchange = () => { actAuto = false; syncAction(); });

function renderSvcs() {
  $('#svcList').innerHTML = services.map((s, i) => `<div class="svc" data-i="${i}">
   <input type="text" placeholder="Service name" value="${esc(s.name)}" data-k="name" maxlength="60" aria-label="Service name">
   <input class="d" type="text" placeholder="Short description" value="${esc(s.desc)}" data-k="desc" maxlength="160" aria-label="Description">
   <input type="text" placeholder="Price (optional)" value="${esc(s.price)}" data-k="price" maxlength="30" aria-label="Price">
   <button type="button" class="btn ghost sm" data-rm="${i}" title="Remove" aria-label="Remove service" ${services.length < 2 ? 'disabled' : ''}>✕</button></div>`).join('');
}
$('#svcList').addEventListener('input', e => { const r = e.target.closest('.svc'); if (r && e.target.dataset.k) services[+r.dataset.i][e.target.dataset.k] = e.target.value; });
$('#svcList').addEventListener('click', e => { const i = e.target.dataset.rm; if (i !== undefined && services.length > 1) { services.splice(+i, 1); renderSvcs(); } });
$('#addSvc').onclick = () => { if (services.length < 12) { services.push({ name: '', desc: '', price: '' }); renderSvcs(); } };

function readImage(file, max, type, q) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(im.width * s)); c.height = Math.max(1, Math.round(im.height * s));
        const ctx = c.getContext('2d'); if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL(type, q)); };
      im.onerror = () => rej(new Error('unreadable'));
      im.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}
function setLogo(url) {
  logoData = url || '';
  $('#logoPrev').innerHTML = logoData ? `<img src="${uattr(logoData)}" alt="logo">` : 'No logo';
  $('#logoClear').style.display = logoData ? 'inline-flex' : 'none';
}
$('#logoFile').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { setLogo(await readImage(f, 256, 'image/png')); } catch { alert('Sorry, that image could not be read. Try a PNG or JPG.'); }
};
$('#logoClear').onclick = () => { setLogo(''); $('#logoFile').value = ''; };
function renderPhotos() {
  $('#photoList').innerHTML = photos.map((p, i) => `<figure><img src="${uattr(p)}" alt="Photo ${i + 1}"><button type="button" data-rmp="${i}" aria-label="Remove photo ${i + 1}">✕</button></figure>`).join('');
  $('#photoCount').textContent = `${photos.length} / ${MAX_PHOTOS}`;
  $('#photoFile').disabled = photos.length >= MAX_PHOTOS;
}
$('#photoFile').onchange = async e => {
  const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
  for (const f of files) { try { photos.push(await readImage(f, 1200, 'image/jpeg', 0.78)); } catch { alert(`Sorry, "${f.name}" could not be read.`); } }
  e.target.value = ''; renderPhotos();
};
$('#photoList').onclick = e => { const i = e.target.dataset.rmp; if (i !== undefined) { photos.splice(+i, 1); renderPhotos(); } };

/* before / after pairs: the client's own work only; the site shows a slider only when these exist */
const MAX_BA = 4;
function renderBA() {
  $('#baList').innerHTML = baPairs.map((p, i) => `<figure><img src="${uattr(p.b)}" alt="Before ${i + 1}"><img src="${uattr(p.a)}" alt="After ${i + 1}">${p.t ? `<figcaption>${esc(p.t)}</figcaption>` : ''}<button type="button" data-rmba="${i}" aria-label="Remove pair ${i + 1}">✕</button></figure>`).join('');
  $('#baCount').textContent = `${baPairs.length} / ${MAX_BA}`;
  const full = baPairs.length >= MAX_BA;
  ['baBefore', 'baAfter'].forEach(id => $('#' + id).disabled = full);
  $('label[for=baBefore]').classList.toggle('ok', !!baDraft.b); $('label[for=baAfter]').classList.toggle('ok', !!baDraft.a);
  $('#baAdd').disabled = full || !(baDraft.b && baDraft.a);
  $('#baStage').textContent = full ? 'That is the maximum.' : baDraft.b && baDraft.a ? 'Both photos ready: press Add pair.' : baDraft.b ? 'Before photo ready. Now the after photo.' : baDraft.a ? 'After photo ready. Now the before photo.' : '';
}
['b', 'a'].forEach(k => { $(k === 'b' ? '#baBefore' : '#baAfter').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { baDraft[k] = await readImage(f, 1200, 'image/jpeg', 0.8); } catch { alert(`Sorry, "${f.name}" could not be read.`); }
  e.target.value = ''; renderBA();
}; });
$('#baAdd').onclick = () => { if (!(baDraft.b && baDraft.a) || baPairs.length >= MAX_BA) return; baPairs.push({ b: baDraft.b, a: baDraft.a, t: $('#baLabel').value.trim().slice(0, 40) }); baDraft = {}; $('#baLabel').value = ''; renderBA(); };
$('#baList').onclick = e => { const i = e.target.dataset.rmba; if (i !== undefined) { baPairs.splice(+i, 1); renderBA(); } };
function syncExtras() {
  const v = $('#industry').value;
  $('#baField').style.display = !v || ['clinic', 'salon', 'home', 'other'].includes(v) ? '' : 'none';
  $('#insField').style.display = !v || ['clinic', 'salon', 'other'].includes(v) ? '' : 'none';
}

const TEXT_FIELDS = ['name', 'industryOther', 'city', 'areas', 'about', 'phone', 'whatsapp', 'email', 'address', 'hours', 'reviews', 'stats', 'insurance', 'facebook', 'instagram', 'other'];
const FORM_STEPS = [
  { id: 1, label: 'Your business', fields: ['name', 'industry', 'about'] },
  { id: 2, label: 'Services', fields: ['services'] },
  { id: 3, label: 'Contact', fields: ['phone', 'email', 'whatsapp'] },
  { id: 4, label: 'Extras', fields: [] }
];
let formStep = 1, formMax = 1;
function fieldErrors(d) {
  return { name: !d.name, industry: !d.industry || (d.industry === 'other' && !d.industryOther), about: d.about.length < 30,
    services: !d.services.length, phone: d.phone.replace(/\D/g, '').length < 6, email: !isEmail(d.email),
    whatsapp: d.mainAction === 'whatsapp' ? d.whatsapp.replace(/\D/g, '').length < 6 : false };
}
function applyErrors(bad, keys) {
  const allow = keys ? new Set(keys) : null;
  $$('#intake .f[data-f]').forEach(el => {
    const on = !allow || allow.has(el.dataset.f);
    el.classList.toggle('invalid', !!(on && bad[el.dataset.f]));
  });
}
function stepForField(f) {
  const i = FORM_STEPS.findIndex(s => s.fields.includes(f));
  return i >= 0 ? i + 1 : 4;
}
function showFormStep(n, opts) {
  n = Math.max(1, Math.min(FORM_STEPS.length, n));
  formStep = n;
  formMax = Math.max(formMax, n);
  $$('#intake .form-step').forEach(el => {
    const on = +el.dataset.fs === n;
    el.classList.remove('on');
    if (on) { void el.offsetWidth; el.classList.add('on'); }
  });
  $$('#formSteps li').forEach(li => {
    const i = +li.dataset.fs;
    li.classList.toggle('on', i === n);
    li.classList.toggle('done', i < n);
    li.classList.toggle('reached', i <= formMax && i !== n);
    const open = i <= formMax;
    li.tabIndex = open ? 0 : -1;
    li.setAttribute('aria-disabled', open ? 'false' : 'true');
    if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  $('#formProgressBar').style.width = ((n / FORM_STEPS.length) * 100) + '%';
  const last = n === FORM_STEPS.length;
  $('#formBack').hidden = n === 1;
  $('#formNext').hidden = last;
  $('#buildBtn').hidden = !last;
  $('#formStepNote').textContent = last ? 'All optional. Skip if you like.' : ('Step ' + n + ' of ' + FORM_STEPS.length + ' · ' + FORM_STEPS[n - 1].label);
  $('#screen-form').classList.toggle('form-deep', n > 1);
  if (!opts || !opts.keepErr) $('#formErr').style.display = 'none';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  if (!opts || !opts.noFocus) {
    const root = $('#intake .form-step.on');
    const invalid = root && root.querySelector('.invalid input, .invalid select, .invalid textarea');
    const first = invalid || (root && root.querySelector('input:not([type=hidden]):not([type=file]):not([type=radio]), select, textarea'));
    if (first) try { first.focus({ preventScroll: true }); } catch (_) {}
  }
}
function goFormStep(n) {
  n = +n;
  if (!n || n === formStep) return;
  if (n > formMax + 1) return;
  if (n > formStep && !validateStep(formStep)) return;
  if (n > formMax && n !== formStep + 1) return;
  showFormStep(n);
}
function validateStep(step, d) {
  d = d || readForm();
  const keys = FORM_STEPS[step - 1].fields;
  const bad = fieldErrors(d);
  applyErrors(bad, keys);
  const ok = keys.every(k => !bad[k]);
  $('#formErr').style.display = ok ? 'none' : 'block';
  if (!ok) {
    const el = $('#intake .form-step.on .invalid');
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    const inp = el && el.querySelector('input,select,textarea');
    if (inp) try { inp.focus({ preventScroll: true }); } catch (_) {}
  }
  return ok;
}
function fillForm(d) {
  const f = $('#intake').elements;
  TEXT_FIELDS.forEach(k => f[k].value = d[k] || '');
  f.industry.value = d.industry || ''; f.country.value = COUNTRIES[d.country] ? d.country : 'UK';
  $$('input[name=mainAction]').forEach(r => r.checked = r.value === d.mainAction);
  const known = COLOURS.some(c => c[0] === (d.colour || ''));
  f.colour.value = known ? (d.colour || '') : 'custom'; if (!known) $('#colourCustom').value = d.colour; syncColour();
  services = (d.services || []).map(s => ({ ...s })); if (!services.length) services = [{ name: '', desc: '', price: '' }]; renderSvcs();
  setLogo(d.logo || ''); photos = (d.photos || []).slice(0, MAX_PHOTOS); renderPhotos();
  baPairs = (d.ba || []).slice(0, MAX_BA).map(p => ({ ...p })); baDraft = {}; renderBA();
  actAuto = false; showIndustryText(); syncIndustry(); syncAction(); syncExtras();
  $$('#intake .invalid').forEach(el => el.classList.remove('invalid')); $('#formErr').style.display = 'none';
}
$('#exChips').onclick = e => {
  const b = e.target.closest('.ex-chip'); if (!b) return;
  fillForm(EXAMPLES[b.dataset.ex]); formMax = FORM_STEPS.length; showFormStep(formStep, { noFocus: true });
  $$('#exChips .ex-chip').forEach(c => { c.classList.toggle('on', c === b); c.setAttribute('aria-pressed', c === b); });
  $('#exDone').textContent = `✓ Filled with the ${b.textContent} example. Check the fields below, or jump to any step.`;
};
showFormStep(1, { noFocus: true });

function readForm() {
  const f = $('#intake').elements, g = k => f[k].value.trim();
  const raw = { name: g('name'), industry: f.industry.value, industryOther: g('industryOther'), country: f.country.value, city: g('city'), areas: g('areas'), about: g('about'),
    services: services.map(s => ({ name: s.name.trim(), desc: s.desc.trim(), price: s.price.trim() })).filter(s => s.name),
    mainAction: ($('input[name=mainAction]:checked') || {}).value || '', phone: g('phone'), whatsapp: g('whatsapp'), email: g('email'), address: g('address'), hours: f.hours.value.trim(),
    reviews: f.reviews.value.trim(), stats: f.stats.value.trim(), insurance: baShown('#insField') ? f.insurance.value.trim() : '',
    colour: f.colour.value === 'custom' ? $('#colourCustom').value : f.colour.value,
    facebook: g('facebook'), instagram: g('instagram'), other: g('other'), logo: logoData, photos: photos.slice(), ba: baShown('#baField') ? baPairs.map(p => ({ ...p })) : [] };
  if (current && current.data) {
    if (current.data.photoOverrides) raw.photoOverrides = current.data.photoOverrides;
    if (current.data.bookingUrl) raw.bookingUrl = current.data.bookingUrl;
  }
  return sanitizeSiteData(raw, { allowData: true });
}
function baShown(sel) { return $(sel).style.display !== 'none'; }
function validate(d) {
  const bad = fieldErrors(d);
  applyErrors(bad);
  const ok = !Object.values(bad).some(Boolean);
  $('#formErr').style.display = ok ? 'none' : 'block';
  if (!ok) {
    const first = Object.keys(bad).find(k => bad[k]);
    const dest = stepForField(first);
    if (dest !== formStep) showFormStep(dest, { noFocus: true, keepErr: true });
    const el = $('#intake .invalid');
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    const inp = el && el.querySelector('input,select,textarea');
    if (inp) try { inp.focus({ preventScroll: true }); } catch (_) {}
  }
  return ok;
}
$('#formNext').onclick = () => goFormStep(formStep + 1);
$('#formBack').onclick = () => showFormStep(formStep - 1);
$('#formProgress').addEventListener('click', e => {
  const li = e.target.closest('li[data-fs]');
  if (li) goFormStep(li.dataset.fs);
});
$('#formProgress').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const li = e.target.closest('li[data-fs]');
  if (!li) return;
  e.preventDefault();
  goFormStep(li.dataset.fs);
});
$('#intake').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.matches('textarea,button,[type=submit],[type=file]')) return;
  e.preventDefault();
  if (formStep < FORM_STEPS.length) $('#formNext').click();
  else $('#buildBtn').click();
});
$('#intake').onsubmit = e => {
  e.preventDefault();
  const d = readForm();
  if (!validate(d)) return;
  const keep = editing && current ? current : null;   // 'Edit my details' keeps the same request
  editing = false;
  current = keep ? { ...keep, data: d, version: keep.version + 1, revisions: [...keep.revisions, { at: new Date().toISOString(), notes: 'Edited details in the form' }] }
    : { id: 'S' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), data: d, version: 1, revisions: [], status: 'building', interest: null,
      opts: { style: '', accent: d.colour || '', dark: undefined, headline: '' } };
  if (keep) current.opts = { ...current.opts, accent: d.colour || current.opts.accent };
  runPipeline(keep ? { summary: ['Updated details from the form'] } : null);
};

/* ---------------- Pipeline: a friendly "building your website" animation over the real build ---------------- */
// Beats add s1..s6 to #bx (CSS assembles the mock site), then .done, then the preview is revealed.
// The details of each build still go to the console and to the hidden #buildLog (for the team and the tests).
const buildLog = lines => { $('#buildLog').textContent = lines.join('\n'); console.info('[build]\n' + lines.join('\n')); };
function buildAnim(d, change) {
  const bx = $('#bx'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name = String(d.name || '').trim() || 'Your business';
  let kind = (d.industry === 'other' ? d.industryOther : industryLabel(d)) || '';
  kind = kind.split(/[\/(,]/)[0].trim().toLowerCase();
  const beats = change ? ['Reading your changes…', 'Updating the look…', 'Refreshing your headline…', 'Re-laying your page…', 'Checking your services…', 'Almost ready…']
    : ['Reading your details…', kind ? `Picking a look for your ${kind}…` : `Picking a look for ${name}…`, 'Writing your headline…', 'Laying out your page…',
      `Adding your ${d.services && d.services.length > 1 ? d.services.length + ' services' : 'services'}…`, 'Almost ready…'];
  const waitMsgs = ['Adding the final touches…', 'Polishing the details…', 'Making it look good on phones…', 'Almost ready…'];
  // ~8.5s in total (about 7s for changes): 6 slow beats + a short finish, so people can watch the site come together. The real site must be on screen for at least MIN_SHOW before we move on.
  const per = reduce ? 200 : change ? 1000 : 1250, MIN_SHOW = reduce ? 700 : 5000, FINISH = reduce ? 250 : 900;
  const steps = $$('#bxSteps li');
  let alive = true, workDone = false, beat = -1, doc = null, loaded = false, revealedAt = 0;
  // The real website, scaled into the browser window and the phone. Beats "scroll" it so people see it come together.
  const frames = [
    { box: $('#bx .bx-real'), fr: $('#bxFrame'), w: 1280, h: 2600, pan: [0, 0, 0, 560, 1180, 0] },
    { box: $('#bx .bx-ph-real'), fr: $('#bxPhFrame'), w: 390, h: 2800, pan: [0, 0, 0, 760, 1560, 0] }];
  frames.forEach(f => { f.reel = $('.bx-reel', f.box); f.fr.onload = null; f.fr.removeAttribute('srcdoc'); f.fr.style.cssText = `width:${f.w}px;height:${f.h}px`; f.reel.style.transform = ''; });
  const place = () => frames.forEach(f => {
    const k = (f.box.clientWidth || f.w * .4) / f.w, y = f.pan[Math.max(0, Math.min(beat, 5))] || 0;
    f.reel.style.transform = `scale(${k}) translateY(${-y}px)`;
  });
  const reveal = () => {
    if (revealedAt || !loaded || !alive) return;
    place(); revealedAt = performance.now(); bx.classList.add('real');
  };
  const msg = t => { const m = $('#bxMsg'); m.textContent = t; m.style.animation = 'none'; void m.offsetWidth; m.style.animation = ''; };
  const bar = p => { $('#bxBar').style.width = p + '%'; };
  bx.className = 'bx'; $('#bxErr').hidden = true; $('#bxType').textContent = ''; bar(4);
  $('#bxUrl').textContent = slug(name) + '.' + BRAND.domain.split('.').pop();
  $('#pipeTitle').textContent = change ? 'Updating your website…' : 'Building your website…';
  $('#pipeSub').textContent = change ? `Making your changes to ${name}.` : `Sit tight, we're putting ${name} online.`;
  steps.forEach(li => li.className = '');
  const type = async () => {   // the mock headline "writes itself" (only seen if the real site is not ready yet)
    const el = $('#bxType');
    if (reduce) { el.textContent = name; return; }
    const step = Math.max(18, Math.min(60, 620 / name.length));
    for (let i = 1; i <= name.length && alive; i++) { el.textContent = name.slice(0, i); await sleep(step); }
  };
  const beatsDone = (async () => {
    await new Promise(r => requestAnimationFrame(() => r()));
    for (let i = 0; i < beats.length && alive; i++) {
      beat = i;
      bx.classList.add('s' + (i + 1)); msg(beats[i]); bar(Math.round(8 + (i + 1) * 84 / beats.length));
      steps.forEach((li, j) => li.className = j < i ? 'ok' : j === i ? 'on' : '');
      if (i === 2) type();
      if (i >= 1) { reveal(); if (revealedAt) place(); }
      await sleep(per);
    }
  })();
  // a slow build keeps the scene alive with gentle messages until the work is done
  beatsDone.then(async () => { for (let k = 0; alive && !workDone; k++) { await sleep(1700); if (alive && !workDone) msg(waitMsgs[k % waitMsgs.length]); } });
  return {
    setDoc(html) {   // the real HTML from buildSite: load it into the scene, reveal on the next beat
      if (!alive || doc) return; doc = html;
      const f0 = frames[0], f1 = frames[1];
      const ready = () => { if (loaded) return; loaded = true; if (beat >= 1) reveal(); };
      f0.fr.onload = ready; setTimeout(ready, 1200);
      f0.fr.srcdoc = html;
      setTimeout(() => { if (alive) f1.fr.srcdoc = html; }, 160);
    },
    async finish() {
      workDone = true; await beatsDone; if (!alive) return;
      if (!revealedAt) { for (let t = 0; !loaded && t < 15; t++) await sleep(100); loaded = true; reveal(); }
      const left = MIN_SHOW - (performance.now() - revealedAt); if (left > 0) await sleep(left);
      $('#bxType').textContent = name;
      steps.forEach(li => li.className = 'ok');
      bx.classList.add('done'); bar(100); msg(change ? 'Your changes are ready!' : 'Your website is ready!');
      await sleep(FINISH); alive = false;
    },
    fail(err) {
      alive = false; workDone = true;
      bx.classList.add('err');
      $('#bxErrMsg').textContent = (err && err.message ? 'Details: ' + err.message + '. ' : '') + 'Your details are safe. Please try again, or go back and check them.';
      $('#bxErr').hidden = false;
      $('#pipeTitle').textContent = 'We hit a snag';
      $('#pipeSub').textContent = 'Nothing is lost. You can try again right away.';
      $('#bxErr').scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };
}
const cleanOpts = o => sanitizeOpts(o || {});
let running = false, lastChange = null;
async function runPipeline(change) {
  if (running) return; running = true; lastChange = change || null;
  let anim = null;
  try {
    previewBurstDone = false;
    if (stepMax > 1) stepMax = 1;
    show('pipeline');
    const d = current.data, t0 = performance.now();
    anim = buildAnim(d, change);
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));   // let the first beat paint before the (synchronous) build work
    const rv = parseReviews(d.reviews).length, st = parseStats(d.stats).length;
    const log = change ? [`Change request for ${current.id} (version ${current.version})`, ...change.summary] : [
      `New request ${current.id}: "${d.name}"`,
      `Industry: ${industryLabel(d)} (matched: ${detectProfile(d).label})${d.city ? ' · ' + d.city : ''} · ${COUNTRIES[d.country].label} (${COUNTRIES[d.country].cur.trim()})`,
      `${d.services.length} service${d.services.length > 1 ? 's' : ''}; main action: ${d.mainAction || 'default for the industry'}${d.whatsapp ? '; WhatsApp on' : ''}`,
      `${d.photos.length ? d.photos.length + ' photo' + (d.photos.length > 1 ? 's' : '') + ' uploaded' : 'No photos, so stock photos will be used'}; logo: ${d.logo ? 'uploaded' : 'text logo'}`,
      `${rv ? rv + ' real review' + (rv > 1 ? 's' : '') : 'No reviews, so labelled sample reviews in the preview'}; ${st ? st + ' figure' + (st > 1 ? 's' : '') : 'no figures given'}`];
    const ai = await generateWithAI(d);
    const opts = cleanOpts(current.opts);
    const desk = buildSite(d, opts, ai, {});
    anim.setDoc(desk.doc);   // show the real website inside the build animation straight away
    const M = desk.M;
    current.previewM = M;
    current.styleKey = M.key; current.placeholders = M.placeholders.slice();
    const words = desk.markup.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    log.push(`Business type: ${M.prof.label}; design: ${M.kit.label.replace(/ \(.*$/, "")} kit, ${M.heroV} hero${opts.accent ? ', main colour ' + opts.accent : ''}${M.P.dark ? ', dark' : ''}`,
      ai ? 'Copy written by AI' : 'Copy written from your details by the built-in industry copy',
      `Sections: header, ${M.order.join(', ')}, footer`,
      `About ${words} words; one long page that works on phones and desktops`,
      `${M.placeholders.length} item${M.placeholders.length === 1 ? '' : 's'} to swap before launch`);
    let doc = desk.doc, saveNote = 'Live version: a private, expiring preview link on our server';
    if (API) {
      try { doc = await startShareSave(opts); saveNote = 'Private preview link ready: open it on any phone or computer, or share it'; }
      catch (err) { console.warn(err); current.shareUrl = null; saveNote = 'Could not save your preview link just now (' + err.message + '). You can still view it here; we will retry when you continue.'; }
    }
    setPreviewDoc(doc);
    log.push(`Full working website ready (${Math.round(previews.bytes / 1024)} KB, one file)`,
      'Opens in a new tab: menu, buttons, animations, sliders and forms all work (forms send nothing in a preview)',
      'Also shown below with a desktop / mobile switch', saveNote, `Build time: ${((performance.now() - t0) / 1000).toFixed(1)}s`);
    buildLog(log);
    current.status = change ? 'changes applied, awaiting approval' : 'preview sent, awaiting approval';
    upsert(current);
    await anim.finish();
    device = innerWidth < 700 ? 'mobile' : 'desktop';
    $('#changes').classList.remove('on');
    show('preview'); renderPreview();
  } catch (err) {
    console.error(err);
    if (anim) anim.fail(err);
    else { show('pipeline'); $('#bx').className = 'bx err'; $('#bxErrMsg').textContent = 'Details: ' + (err && err.message); $('#bxErr').hidden = false; }
  } finally { running = false; }
}
$('#bxBack').onclick = () => { $('#bx').className = 'bx'; show('form'); };
$('#bxRetry').onclick = () => { if (current) runPipeline(lastChange); };

/* ---------------- Preview (client side, fully interactive) ---------------- */
function fitFrame() {
  const box = $('#liveBox'); if (!box) return;
  const fr = $('iframe', box), all = $$('iframe', box), vw = device === 'mobile' ? 390 : 1280, vh = device === 'mobile' ? 844 : 860;
  const k = Math.min(1, box.clientWidth / vw);
  // Website first: size the frame so the whole window fits in the first view (never shorter than a useful minimum).
  const top = box.getBoundingClientRect().top + scrollY, mob = device === 'mobile';
  const h = Math.round(Math.max(mob ? 460 : 420, Math.min(vh * k, innerHeight - top - (mob ? 22 : 24))));
  all.forEach(f => { const op = f.style.opacity; f.style.cssText = `width:${vw}px;height:${Math.round(h / k)}px;transform:scale(${k});transform-origin:0 0` + (op !== '' ? `;opacity:${op}` : ''); });
  void fr;
  box.style.height = h + 'px';
}
function renderDesignNav() {
  const i = +current.opts.design || 0, n = Math.max(current.designMax || 0, i) + 1;
  $('#dPos').textContent = `Design ${i + 1} of ${n}`;
  $('#dPrev').disabled = i === 0 || designBusy;
  $('#dNext').disabled = designBusy;
  $('#dNext').textContent = i + 1 < n ? 'Next design →' : 'Show me another design →';
}
/* Switch design without the full pipeline: rebuild, save (server mode), show. */
let designBusy = false;
async function switchDesign(to) {
  if (designBusy || running || to < 0) return;
  if (typeof flushSiteEditor === 'function') await flushSiteEditor();
  designBusy = true; renderDesignNav();
  const from = +current.opts.design || 0;
  try {
    $('#dNote').textContent = 'Building design ' + (to + 1) + '…';
    current.opts.design = to; current.designMax = Math.max(current.designMax || 0, to);
    // Round 1 item 12: browsing designs is not a change, so the version number stays put
    current.revisions.push({ at: new Date().toISOString(), design: to, designSwitch: true, notes: `Switched to design ${to + 1}` });
    const opts = cleanOpts(current.opts), ai = await generateWithAI(current.data);
    const built = buildSite(current.data, opts, ai, {});
    current.styleKey = built.M.key; current.placeholders = built.M.placeholders.slice(); current.previewM = built.M;
    let doc = built.doc;
    if (API) { try { doc = await startShareSave(opts); } catch (err) { console.warn(err); current.shareUrl = null; } }
    setPreviewDoc(doc); upsert(current);
    $('#dNote').textContent = API && !current.shareUrl ? 'Showing design ' + (to + 1) + '. We could not save it just now; we will retry when you press Apply.' : 'Step back and forth through designs. Your words, photos and prices stay. The one showing when you press Apply is the one we keep.';
    designBusy = false; renderPreview();
  } catch (err) {
    console.error(err); current.opts.design = from; $('#dNote').textContent = 'Sorry, that design could not be built.';
    designBusy = false; renderDesignNav();
  }
}
$('#dPrev').onclick = () => switchDesign((+current.opts.design || 0) - 1);
$('#dNext').onclick = () => switchDesign((+current.opts.design || 0) + 1);
function liveFrameDoc() {
  return (typeof withEditHook === 'function' && previews && previews.doc) ? withEditHook(previews.doc) : (previews && previews.doc) || '';
}
function renderPreview(mode) {
  renderDesignNav();
  $$('.toggle button').forEach(b => { b.classList.toggle('on', b.dataset.dev === device); b.setAttribute('aria-selected', b.dataset.dev === device); });
  $('#pvRev').textContent = 'Version ' + current.version;
  const ph = current.placeholders || [];
  const samp = ph.filter(p => /^Sample|^Stock|^Some sections/.test(p));
  $('#pvSamples').textContent = samp.length ? 'Yellow "sample" tags mark placeholder content (' + samp.map(s => s.split(/[:(]/)[0].trim().toLowerCase()).join(', ') + '). We replace them with your real ones, or remove them, before launch.' : '';
  const open = $('#openPv'); if (open) open.onclick = openPreviewTab;
  setOpenPreviewState();
  const opened = $('#pvOpened'); if (opened) opened.textContent = '';
  renderShare();
  placeOpenInShareRow();
  const host = API ? `${location.host}/s/${slug(current.data.name)}` : `${slug(current.data.name)}.${BRAND.domain}`;
  const inner = `<div class="live" id="liveBox"><iframe id="liveFrame" title="Live preview of your website" sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"></iframe></div>`;
  // Round 1 item 13: no white flash. Same device: the old page stays on screen while the new one loads
  // underneath, then the new one fades in. Device change: a loader shows until the new page is ready.
  const stage = $('#stage'), old = $('#liveFrame'), sameDev = old && stage.dataset.dev === device;
  const liveHtml = liveFrameDoc();
  if (sameDev) {
    if (old.dataset.doc === previews.doc) { stage.querySelectorAll('.url').forEach(u => u.textContent = `🔒 ${host} · preview`); fitFrame(); return; }
    const box = $('#liveBox');
    if (mode && mode.instant) {
      box.querySelectorAll('iframe:not(#liveFrame)').forEach(f => f.remove());
      stage.querySelectorAll('.url').forEach(u => u.textContent = `🔒 ${host} · preview`);
      old.dataset.doc = previews.doc;
      old.srcdoc = liveHtml;
      fitFrame();
      return;
    }
    const nf = document.createElement('iframe');
    nf.title = old.title; nf.setAttribute('sandbox', old.getAttribute('sandbox'));
    box.querySelectorAll('iframe:not(#liveFrame)').forEach(f => f.remove());
    box.appendChild(nf); nf.style.opacity = '0'; fitFrame(); nf.style.opacity = '0';
    let done = false;
    const swap = () => {
      if (done) return; done = true;
      requestAnimationFrame(() => { nf.classList.add('pv-in'); nf.style.opacity = '1'; });
      setTimeout(() => { if (old.isConnected) old.remove(); nf.id = 'liveFrame'; nf.classList.remove('pv-in'); nf.style.opacity = ''; }, 260);
    };
    nf.onload = swap; setTimeout(swap, 2500);
    nf.dataset.doc = previews.doc; nf.srcdoc = liveHtml;
    return;
  }
  stage.dataset.dev = device;
  stage.innerHTML = device === 'desktop'
    ? `<div class="browser"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">🔒 ${esc(host)} · preview</span></div>${inner}</div>`
    : `<div class="phone"><div class="screenwrap">${inner}</div></div>`;
  fitFrame();
  const fr = $('#liveFrame'), lb = $('#liveBox');
  lb.classList.add('pv-loading'); fr.style.opacity = '0';
  const shown = () => { lb.classList.remove('pv-loading'); fr.classList.add('pv-in'); fr.style.opacity = '1'; setTimeout(() => { fr.classList.remove('pv-in'); fr.style.opacity = ''; }, 260); };
  let once = false; const show1 = () => { if (!once) { once = true; requestAnimationFrame(shown); } };
  fr.onload = show1; setTimeout(show1, 2500);
  fr.dataset.doc = previews.doc; fr.srcdoc = liveHtml;
}
addEventListener('resize', () => { if ($('#screen-preview').classList.contains('on')) fitFrame(); });
$$('.toggle button').forEach(b => b.onclick = () => { device = b.dataset.dev; renderPreview(); });

/* ---------------- Request changes -> re-run builder ---------------- */
$('#reqBtn').onclick = () => { $('#changes').classList.toggle('on'); if ($('#changes').classList.contains('on')) $('#changes').scrollIntoView({ behavior: 'smooth' }); };
$('#chips').onclick = e => { const t = e.target.dataset.t; if (t) { const n = $('#chNotes'); n.value = (n.value.trim() ? n.value.trim().replace(/[.]?$/, '. ') : '') + t; } };
$('#editDetails').onclick = () => { editing = true; fillForm(current.data); formMax = FORM_STEPS.length; showFormStep(1, { noFocus: true }); show('form'); };
$('#rerunBtn').onclick = () => {
  const notes = $('#chNotes').value.trim(), lower = notes.toLowerCase(), headline = $('#chHeadline').value.trim();
  let style = $('#chTheme').value, accent = $('#chColour').value, dark;
  if (/\b(dark|darker|black|moody|night)\b/.test(lower)) dark = true;
  else if (/\b(light|lighter|bright|brighter|white)\b/.test(lower)) dark = false;
  const minimal = /\b(minimal|minimalist|clean|simple|plain|simpler)\b/.test(lower) || undefined, white = (dark !== true && /\bwhite\b/.test(lower)) || undefined;
  if (!style) { const m = lower.match(/\b(clinic|restaurant|salon|spa|law|legal|estate|property|plumb|trade)\w*/); if (m) style = { clinic: 'clinic', restaurant: 'restaurant', salon: 'salon', spa: 'salon', law: 'law', legal: 'law', estate: 'realestate', property: 'realestate', plumb: 'home', trade: 'home' }[m[1]]; }
  if (!accent) { const hits = Object.keys(COLOUR_WORDS).map(w => [w, lower.search(new RegExp('\\b' + w + '\\b'))]).filter(h => h[1] >= 0).sort((a, b) => a[1] - b[1]); if (hits.length) accent = COLOUR_WORDS[hits[0][0]]; }
  const reshuffle = /\b(another|different|new|next|fresh)\s+(design|look|layout|template)\b|\breshuffle\b/.test(lower);
  if (!style && !accent && !headline && !notes && dark === undefined) { $('#chNotes').focus(); $('#chNotes').placeholder = 'Tell us what to change first…'; return; }
  const o = current.opts, summary = [];
  if (style && style !== (o.style || current.styleKey)) { o.style = style; summary.push(`Style → ${styleLabel(style)}`); }
  if (accent && accent !== o.accent) { o.accent = accent; summary.push(`Main colour → ${accent}`); }
  if (dark !== undefined && dark !== o.dark) { o.dark = dark; summary.push(dark ? 'Darker look' : 'Lighter look'); }
  if (minimal && !o.minimal) { o.minimal = true; summary.push('Minimal look: white canvas, colour only on buttons and accents'); }
  if (white && !o.white) { o.white = true; summary.push('White background'); }
  if (dark === true && (o.minimal || o.white) && !minimal) { o.white = false; }
  if (reshuffle) { o.design = (+o.design || 0) + 1; current.designMax = Math.max(current.designMax || 0, o.design); summary.push(`New design from the template library (#${o.design + 1})`); }
  if (headline) { o.headline = headline; summary.push(`Headline → "${clientHeadline(headline).replace(/\*/g, '')}"`); }
  if (notes) summary.push(`Note saved for the team: "${notes.length > 90 ? notes.slice(0, 90) + '…' : notes}"`);
  current.version++;
  current.revisions.push({ at: new Date().toISOString(), style, accent, dark, headline, notes, design: o.design || 0 });
  ['chTheme', 'chColour', 'chHeadline', 'chNotes'].forEach(id => $('#' + id).value = '');
  runPipeline({ summary: summary.length ? summary : ['No automatic change matched, so the note is saved for the team'] });
};

/* ---------------- Approve & go live (fake door, no payment) ---------------- */
function priceRows() {
  const dom = $('input[name=dom]:checked').value === 'connect';
  const today = BRAND.setup + BRAND.monthly + (dom ? BRAND.domainConnect : 0);
  $('#priceTbl').innerHTML = `<tr><td>Website setup <span class="note">(one-time)</span></td><td>${money(BRAND.setup)}</td></tr>
   <tr><td>Hosting &amp; maintenance <span class="note">(first month)</span></td><td>${money(BRAND.monthly)}/mo</td></tr>
   ${dom ? `<tr><td>Connect your own domain <span class="note">(one-time)</span></td><td>${money(BRAND.domainConnect)}</td></tr>` : ''}
   <tr class="tot"><td>Due today</td><td>${money(today)}</td></tr>
   <tr><td class="note" colspan="2" style="text-align:left;font-weight:400">Then ${money(BRAND.monthly)}/month. Cancel any time.</td></tr>`;
  $('#payBtn').textContent = API ? 'Apply now →' : `Pay ${money(today)} & go live`;
  return { dom, today };
}
$('#domFee').textContent = '+' + money(BRAND.domainConnect);
$$('input[name=dom]').forEach(r => r.onchange = priceRows);
$('#approveBtn').onclick = async () => {
  if (typeof flushSiteEditor === 'function') await flushSiteEditor();
  $('#apOpen').href = (API && current.shareUrl) || previews.url;
  $('#apName').textContent = current.data.name; $('#apRev').textContent = current.version;
  $('#freeSub').textContent = API ? `${location.host}/s/${slug(current.data.name)}` : `${slug(current.data.name)}.${BRAND.domain}`;
  $('#apThumb').innerHTML = '<iframe title="Approved version" sandbox="allow-scripts" tabindex="-1" aria-hidden="true"></iframe>';
  const tf = $('#apThumb iframe'); $('#apThumb').style.height = '';
  requestAnimationFrame(() => { const k = $('#apThumb').clientWidth / 1280; tf.style.cssText = `width:1280px;height:${Math.round(380 / k)}px;transform:scale(${k});transform-origin:0 0`; tf.srcdoc = previews.doc; });
  const ph = current.placeholders || [];
  $('#apPre').innerHTML = `<b>Before launch</b>${ph.length ? `We go through this list with you before the site goes live. Sample reviews and sample figures are never published: they are replaced with your real ones or removed.<ul>${ph.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : 'Nothing to swap: everything on the site came from your details.'}`;
  $('#payEmail').value = current.data.email; $('#payEmail').style.borderColor = '';
  priceRows();
  current.status = 'approved, viewing price'; current.approvedAt = new Date().toISOString(); upsert(current);
  show('approve');
};
$('#backPreview').onclick = () => { show('preview'); renderPreview(); };
$('#apOpen').onclick = openPreviewTab;
$('#payBtn').onclick = async () => {
  const email = $('#payEmail').value.trim();
  if (!isEmail(email)) { $('#payEmail').style.borderColor = 'var(--bad)'; $('#payEmail').focus(); return; }
  const { dom, today } = priceRows();
  if (API) {
    const btn = $('#payBtn'), err = $('#applyErr');
    btn.disabled = true; btn.textContent = 'Sending…'; err.textContent = '';
    try {
      // whatever design is showing now is the one saved and published
      if (!current.shareUrl || current.savedVersion !== current.version) await apiSavePreview(cleanOpts(current.opts));
      await apiJSON(`/api/apply/${current.server.id}`, { token: current.server.token, email, domain: dom ? 'connect' : 'free', dueToday: today, currency: BRAND.currency, setup: BRAND.setup, monthly: BRAND.monthly, version: current.version });
    } catch (e2) { err.textContent = 'Sorry, that did not go through: ' + e2.message + '. Please try again.'; btn.disabled = false; priceRows(); return; }
    btn.disabled = false; priceRows();
    current.status = 'applied';
    current.interest = { at: new Date().toISOString(), email, domain: dom ? 'connect own domain' : 'free subdomain', dueToday: today };
    upsert(current);
    $('#thxEmail').textContent = email;
    $('#thxLink').innerHTML = current.shareUrl ? `Your preview stays here: <a href="${esc(current.shareUrl)}" target="_blank" rel="noopener">${esc(current.shareUrl)}</a>` : '';
    show('thanks');
    return;
  }
  current.status = 'clicked pay (fake door)';
  current.interest = { at: new Date().toISOString(), email, domain: dom ? 'connect own domain' : 'free subdomain', dueToday: today };
  upsert(current);
  $('#thxEmail').textContent = email;
  show('thanks');
};
$('#startOver').onclick = () => { $('#intake').reset(); $('#exDone').textContent = ''; $$('#exChips .ex-chip').forEach(c => { c.classList.remove('on'); c.removeAttribute('aria-pressed'); }); $('#industry').value = ''; $('#industryOther').value = ''; showIndustryText(); services = [{ name: '', desc: '', price: '' }]; renderSvcs(); setLogo(''); photos = []; renderPhotos(); baPairs = []; baDraft = {}; renderBA(); syncExtras(); syncIndustry(); syncColour(); syncAction(); current = null; previews = null; formMax = 1; stepMax = 0; previewBurstDone = false; showFormStep(1, { noFocus: true }); show('form'); };

/* ---------------- Admin (#admin) ---------------- */
function renderAdmin() {
  const l = load(), n = f => l.filter(f).length;
  $('#stats').innerHTML = [[l.length, 'Submissions'], [n(x => x.revisions.length), 'Asked for changes'], [n(x => x.approvedAt), 'Approved'], [n(x => x.interest), 'Clicked pay']]
    .map(s => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
  const pill = s => /pay/.test(s) ? 'g' : /approved/.test(s) ? 'b' : '';
  const lastRev = s => { const r = s.revisions[s.revisions.length - 1]; return r.notes || [r.style, r.accent, r.headline].filter(Boolean).join(', ') || '–'; };
  $('#admTbl').innerHTML = `<tr><th>When</th><th>Business</th><th class="hide-m">Contact</th><th class="hide-m">Style</th><th>Status</th><th></th></tr>` +
    (l.length ? l.map(s => `<tr><td>${esc(new Date(s.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }))}<div class="note">${esc(s.id)}</div></td>
     <td><b>${esc(s.data.name)}</b><div class="note">${esc(industryLabel(s.data))}${s.data.city ? ' · ' + esc(s.data.city) : ''}${s.data.logo ? ' · logo' : ''}${(s.data.photos || []).length ? ' · ' + s.data.photos.length + ' photos' : ''}</div></td>
     <td class="hide-m">${esc(s.data.email)}<div class="note">${esc(s.data.phone)}${s.data.whatsapp ? ' · WA ' + esc(s.data.whatsapp) : ''}</div></td>
     <td class="hide-m">${esc(s.styleKey || s.opts.style || '')} ${s.opts.accent ? `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${esc(s.opts.accent)};vertical-align:-1px"></span>` : ''}<div class="note">v${s.version} · ${s.revisions.length} change${s.revisions.length === 1 ? '' : 's'}${(s.placeholders || []).length ? ' · ' + s.placeholders.length + ' to swap' : ''}</div></td>
     <td><span class="pill ${pill(s.status)}">${esc(s.status)}</span>${s.interest ? `<div class="note">${esc(s.interest.email)} · ${esc(s.interest.domain)} · ${money(s.interest.dueToday)} today</div>` : ''}${s.revisions.length ? `<div class="note">Last request: ${esc(lastRev(s))}</div>` : ''}</td>
     <td><button class="btn sm" data-view="${esc(s.id)}">View full site</button></td></tr>`).join('')
      : `<tr><td colspan="6" class="note" style="text-align:center;padding:30px">No submissions yet. Open the client view and build a site.</td></tr>`);
}
let smUrl = null, smName = 'site';
$('#admTbl').onclick = e => {
  const id = e.target.dataset.view; if (!id) return;
  const s = load().find(x => x.id === id); if (!s) return;
  const doc = buildSite(s.data, cleanOpts(s.opts), null, {}).doc;
  $('#smTitle').textContent = `${s.data.name}: full site (v${s.version})`;
  $('#smFrame').srcdoc = doc;
  if (smUrl) URL.revokeObjectURL(smUrl);
  smUrl = URL.createObjectURL(new Blob([doc], { type: 'text/html' })); smName = slug(s.data.name);
  $('#siteModal').classList.add('on');
};
$('#smOpen').onclick = () => { if (!smUrl) return; const w = window.open('', '_blank'); if (w) { w.document.open(); w.document.write($('#smFrame').srcdoc); w.document.close(); } else window.open(smUrl, '_blank'); };
$('#smDownload').onclick = () => { if (!smUrl) return; const a = document.createElement('a'); a.href = smUrl; a.download = smName + '.html'; document.body.appendChild(a); a.click(); a.remove(); };
$('#smClose').onclick = () => { $('#siteModal').classList.remove('on'); $('#smFrame').srcdoc = ''; };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#siteModal').classList.contains('on')) $('#smClose').click(); });
$('#exportBtn').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' }));
  a.download = `${slug(BRAND.name)}-submissions-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
};
$('#clearBtn').onclick = () => { if (confirm('Delete all saved submissions in this browser?')) { localStorage.removeItem(STORE_KEY); renderAdmin(); } };

/* ---------------- Server mode: share link box and wording ---------------- */
function renderShare() {
  const box = $('#shareBox'), bar = $('#shareBar');
  if (!box) return;
  parkOpenButton();
  if (!API) { box.hidden = true; box.innerHTML = ''; if (bar) bar.classList.remove('has-link'); return; }
  box.hidden = false; if (bar) bar.classList.add('has-link');
  if (shareSaveState === 'saving') {
    box.innerHTML = '<p class="pv-share-wait note" role="status" style="margin:0"><span class="spin" aria-hidden="true"></span> Getting your link…</p>';
    return;
  }
  if (!current.shareUrl) {
    box.innerHTML = `<div class="pv-share-err" role="alert"><p class="note" style="margin:0;color:var(--bad)">We could not save your shareable link just now. Check your connection and try again${shareSaveError ? ' (' + esc(shareSaveError) + ')' : ''}.</p>
      <button type="button" class="btn sm" id="shareRetry">Try again</button></div>`;
    $('#shareRetry').onclick = () => retryShareSave();
    return;
  }
  const exp = current.shareExpires ? new Date(current.shareExpires).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  box.innerHTML = `<div class="pv-share-meta"><span class="pv-share-label">Your shareable link</span><span class="pv-share-hint">${exp ? 'Private · works until ' + esc(exp) : 'Private — only people with the link can see it'}</span></div>
    <div class="pv-share-row"><input type="text" id="shareUrl" readonly value="${esc(current.shareUrl)}" aria-label="Preview link"><button type="button" class="btn sm" id="shareCopy">Copy link</button></div>`;
  $('#shareUrl').onclick = e => e.target.select();
  $('#shareCopy').onclick = async () => { try { await navigator.clipboard.writeText(current.shareUrl); } catch (_) { $('#shareUrl').select(); document.execCommand && document.execCommand('copy'); } $('#shareCopy').textContent = 'Copied ✓'; setTimeout(() => { const b = $('#shareCopy'); if (b) b.textContent = 'Copy link'; }, 1800); };
  placeOpenInShareRow();
}
function parkOpenButton() {
  const open = document.querySelector('.pv-open');
  const bar = $('#shareBar');
  if (open && bar && open.parentElement !== bar) bar.appendChild(open);
}
function placeOpenInShareRow() {
  const row = document.querySelector('#shareBox .pv-share-row');
  const open = document.querySelector('.pv-open');
  const bar = $('#shareBar');
  if (row && open && !row.contains(open)) row.appendChild(open);
  else if (!row && open && bar && open.parentElement !== bar) bar.appendChild(open);
}
if (API) {
  const pvNote = $$('#screen-preview > p.note'); if (pvNote.length) pvNote[pvNote.length - 1].innerHTML = 'Happy with it? Approve it, then press <b>Apply now</b>. No payment is taken on this page.';
  const ap = $('#screen-approve .hero-a p'); if (ap) ap.textContent = "Here's exactly what it costs. No payment is taken now: apply, and we'll send you a secure payment link.";
  const payNote = document.createElement('p'); payNote.className = 'note'; payNote.id = 'applyErr'; payNote.setAttribute('role', 'alert'); payNote.style.cssText = 'color:var(--bad);margin:8px 0 0;text-align:center'; $('#payBtn').after(payNote);
  const lbl = $('label[for=payEmail]'); if (lbl) lbl.textContent = 'Your email';
  const th = $('#screen-thanks'); if (th) {
    $('h1', th).textContent = 'Application received';
    $('p', th).innerHTML = "Thank you! We've saved your website and your details. We'll email <b id=\"thxEmail\"></b> a secure payment link, and your website goes live as soon as it's paid.";
    $('p.note', th).id = 'thxLink'; $('p.note', th).textContent = '';
  }
  $$('.foot .foot-admin').forEach(el => el.remove());
}

/* ---------------- Router ---------------- */
const STEP_NAMES = ['form', 'pipeline', 'preview', 'approve'];
let stepMax = 0;
let previewBurstDone = false;

function updateSteps(name) {
  const idx = name === 'thanks' ? 3 : STEP_NAMES.indexOf(name);
  if (idx > stepMax) stepMax = idx;
  $$('#stepsNav .step, #stepsNav span').forEach((s, i) => {
    const reached = i <= stepMax && idx >= 0;
    s.classList.toggle('on', i === idx);
    s.classList.toggle('done', i < idx);
    s.classList.toggle('is-enabled', reached);
    s.setAttribute('aria-disabled', reached ? 'false' : 'true');
    s.tabIndex = reached ? 0 : -1;
    if (i === idx) s.setAttribute('aria-current', 'step');
    else s.removeAttribute('aria-current');
  });
}

function showPipelineDone() {
  show('pipeline');
  const bx = $('#bx');
  if (!bx) return;
  bx.className = 'bx s1 s2 s3 s4 s5 s6 done';
  $('#bxErr').hidden = true;
  const bar = $('#bxBar'); if (bar) bar.style.width = '100%';
  const name = current && current.data && current.data.name;
  const title = $('#pipeTitle'); if (title) title.textContent = 'Your website is ready!';
  const sub = $('#pipeSub'); if (sub) sub.textContent = name ? `Here's how we put ${name} together.` : '';
  const msg = $('#bxMsg'); if (msg) msg.textContent = 'Your website is ready!';
  $$('#bxSteps li').forEach(li => { li.className = 'ok'; });
}

function goStep(name) {
  const idx = STEP_NAMES.indexOf(name);
  if (idx < 0 || idx > stepMax) return;
  if (name === 'form') { show('form'); return; }
  if (name === 'pipeline') {
    if (running) { show('pipeline'); return; }
    if (current) showPipelineDone();
    return;
  }
  if (name === 'preview') {
    if (current && previews) { show('preview'); renderPreview(); }
    return;
  }
  if (name === 'approve') {
    if (typeof $('#approveBtn').onclick === 'function') $('#approveBtn').onclick();
    else show('approve');
  }
}

function goHome(e) {
  if (e) e.preventDefault();
  if (location.hash === '#admin') {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {}
  }
  show('form');
  const start = document.getElementById('start');
  if (start) start.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, 0);
}

function celebratePreview() {
  if (previewBurstDone) return;
  previewBurstDone = true;
  const layer = $('#pvBurst');
  if (!layer) return;
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) { layer.innerHTML = ''; return; }
  const colors = ['#0F5B59', '#14A69A', '#55C7B0', '#A6F3E1', '#DFF6F1'];
  const bits = [];
  for (let i = 0; i < 16; i++) {
    const ang = (Math.PI * 2 * i) / 16 + (Math.random() * 0.4 - 0.2);
    const dist = 48 + Math.random() * 90;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist * 0.72 - 10;
    bits.push(`<i style="--x:18%;--y:38%;--s:${(5 + Math.random()*5).toFixed(1)}px;--c:${colors[i % colors.length]};--r:${Math.round(Math.random()*80-20)}deg;--dx:${dx.toFixed(1)}px;--dy:${dy.toFixed(1)}px"></i>`);
  }
  layer.innerHTML = bits.join('');
  setTimeout(() => { if (layer) layer.innerHTML = ''; }, 1000);
}

function show(name) {
  const leavingEditor = name !== 'editor' && document.body.classList.contains('ed-mode');
  if (leavingEditor && typeof flushSiteEditor === 'function') flushSiteEditor();
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === 'screen-' + name));
  document.body.classList.toggle('ed-mode', name === 'editor');
  const idx = name === 'thanks' ? 3 : STEP_NAMES.indexOf(name);
  if (idx >= 0) updateSteps(name);
  $('#stepsNav').style.visibility = (name === 'admin' || name === 'editor') ? 'hidden' : 'visible';
  window.scrollTo(0, 0);
  if (name === 'preview') celebratePreview();
  else if (leavingEditor && typeof closeSiteEditor === 'function') closeSiteEditor({ silent: true });
}

const brandHome = $('#brandHome');
if (brandHome) brandHome.addEventListener('click', goHome);

$('#stepsNav').addEventListener('click', ev => {
  const step = ev.target.closest('[data-step]');
  if (!step || step.getAttribute('aria-disabled') === 'true') return;
  goStep(step.dataset.step);
});
$('#stepsNav').addEventListener('keydown', ev => {
  if (ev.key !== 'Enter' && ev.key !== ' ') return;
  const step = ev.target.closest('[data-step]');
  if (!step || step.getAttribute('aria-disabled') === 'true') return;
  ev.preventDefault();
  goStep(step.dataset.step);
});

function route() {
  if (typeof window.WOD_EDIT_ID !== 'undefined' && window.WOD_EDIT_ID) return; // editor boot takes over
  if (location.hash === '#admin' && API) { location.href = '/admin'; return; }
  if (location.hash === '#admin') { renderAdmin(); show('admin'); }
  else if (!$('.screen.on') || $('#screen-admin').classList.contains('on')) { show(current && previews ? 'preview' : 'form'); if (current && previews) renderPreview(); }
}
window.addEventListener('hashchange', route);
services = [{ name: '', desc: '', price: '' }]; renderSvcs(); renderPhotos(); renderBA(); syncExtras();
route();
