/* =====================================================================
   APP (client side of the demo): intake form -> 3 bots -> preview -> go live
   BRAND – rename the agency / change prices here; everything picks it up
   ===================================================================== */
const BRAND = { name: 'SiteSpark', domain: 'sitespark.site', setup: 50, monthly: 29, domainConnect: 10, currency: '$' };
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
document.title = BRAND.name + ' – Your website, ready to preview';

const COLOURS = [['', 'Auto – match my industry'], ['#1d4ed8', 'Blue'], ['#0f766e', 'Teal'], ['#15803d', 'Green'], ['#b91c1c', 'Red'], ['#ea580c', 'Orange'], ['#c8a24a', 'Gold'], ['#6d28d9', 'Purple'], ['#be185d', 'Pink'], ['#111827', 'Black'], ['custom', 'Pick my own…']];
const COLOUR_WORDS = { blue: '#1d4ed8', teal: '#0f766e', green: '#15803d', red: '#b91c1c', orange: '#ea580c', gold: '#c8a24a', yellow: '#eab308', purple: '#6d28d9', pink: '#be185d', navy: '#1e3a8a' };
const ACT_DEFAULT = { clinic: 'book', restaurant: 'reserve', home: 'quote', realestate: 'quote', salon: 'book', law: 'quote' };
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
  const built = buildSite(d, opts, null, {});
  const r = await apiJSON(`/api/save/${current.server.id}`, { token: current.server.token, data: d, opts, version: current.version, revisions: current.revisions,
    styleKey: built.M.key, placeholders: built.M.placeholders, html: built.doc });
  current.shareUrl = r.url; current.shareExpires = r.expiresAt; current.savedVersion = current.version;
  return built.doc;
}

/* =====================================================================
   PREVIEW BOT: the client gets the full, working website.
   - "Open your website preview" opens it in a NEW TAB: window.open('') is
     called synchronously inside the click (so iOS Safari and popup blockers
     allow it) and the page is written straight into it. If the browser
     refuses, the button is a real <a target="_blank"> to a Blob URL and the
     browser follows that instead.
   - The same document runs inside the page in a sandboxed iframe with a
     desktop / mobile toggle.
   Live version: the preview is a hosted, expiring link on our server
   (e.g. https://preview.<domain>/<id>), so it works on any device and can be shared.
   ===================================================================== */
let pvBlobUrl = null;
function previewTitle() { return `${current.data.name}: website preview`; }
function setPreviewDoc(doc) {
  if (pvBlobUrl) URL.revokeObjectURL(pvBlobUrl);
  pvBlobUrl = URL.createObjectURL(new Blob([doc], { type: 'text/html;charset=utf-8' }));
  previews = { doc, url: pvBlobUrl, bytes: new Blob([doc]).size };
}
function openPreviewTab(e) {
  if (!previews) return;
  if (API && current && current.shareUrl) { current.previewOpens = (current.previewOpens || 0) + 1; return; }   // real hosted link: normal navigation
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
$('#industry').innerHTML += INDUSTRIES.map(i => `<option value="${i[0]}">${esc(i[1])}</option>`).join('');
$('#f-country').innerHTML = Object.entries(COUNTRIES).map(([k, c]) => `<option value="${k}">${esc(c.label)} (${esc(c.cur.trim())})</option>`).join('');
$('#colour').innerHTML = COLOURS.map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');
$('#chTheme').innerHTML += Object.keys(STYLES).map(k => `<option value="${k}">${esc(styleLabel(k))}</option>`).join('');
$('#chColour').innerHTML += COLOURS.filter(c => c[0] && c[0] !== 'custom').map(c => `<option value="${c[0]}">${c[1]}</option>`).join('');
const EX_LABEL = { salon: 'Hair salon', clinic: 'Dental clinic', restaurant: 'Restaurant', home: 'Plumber', realestate: 'Estate agent', law: 'Law firm', graphic: 'Graphic design studio', gym: 'Gym & personal training' };
$('#exPick').innerHTML = Object.keys(EXAMPLES).map(k => `<option value="${k}">${esc(EX_LABEL[k] || k)}</option>`).join('');

function syncIndustry() {
  const f = $('#intake').elements, v = f.industry.value;
  $('#industryOther').style.display = v === 'other' ? 'block' : 'none';
  const k = v ? styleFor({ industry: v, industryOther: f.industryOther.value }) : '';
  $('#styleHint').textContent = k ? 'Style: ' + styleLabel(k) : '';
  if (v && !$('input[name=mainAction]:checked')) { const r = $(`input[name=mainAction][value=${ACT_DEFAULT[k] || 'quote'}]`); if (r) r.checked = true; syncAction(); }
}
function syncAction() {
  const wa = ($('input[name=mainAction]:checked') || {}).value === 'whatsapp';
  $('#waOpt').innerHTML = wa ? '<span class="req">*</span>' : '(optional)';
}
const syncColour = () => { $('#colourCustom').style.display = $('#colour').value === 'custom' ? 'block' : 'none'; };
$('#industry').onchange = syncIndustry; $('#industryOther').oninput = syncIndustry; $('#colour').onchange = syncColour;
$$('input[name=mainAction]').forEach(r => r.onchange = syncAction);

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
  $('#logoPrev').innerHTML = logoData ? `<img src="${logoData}" alt="logo">` : 'No logo';
  $('#logoClear').style.display = logoData ? 'inline-flex' : 'none';
}
$('#logoFile').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { setLogo(await readImage(f, 256, 'image/png')); } catch { alert('Sorry, that image could not be read. Try a PNG or JPG.'); }
};
$('#logoClear').onclick = () => { setLogo(''); $('#logoFile').value = ''; };
function renderPhotos() {
  $('#photoList').innerHTML = photos.map((p, i) => `<figure><img src="${p}" alt="Photo ${i + 1}"><button type="button" data-rmp="${i}" aria-label="Remove photo ${i + 1}">✕</button></figure>`).join('');
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
  $('#baList').innerHTML = baPairs.map((p, i) => `<figure><img src="${p.b}" alt="Before ${i + 1}"><img src="${p.a}" alt="After ${i + 1}">${p.t ? `<figcaption>${esc(p.t)}</figcaption>` : ''}<button type="button" data-rmba="${i}" aria-label="Remove pair ${i + 1}">✕</button></figure>`).join('');
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
$('#industry').addEventListener('change', syncExtras);

const TEXT_FIELDS = ['name', 'industryOther', 'city', 'areas', 'about', 'phone', 'whatsapp', 'email', 'address', 'hours', 'reviews', 'stats', 'insurance', 'facebook', 'instagram', 'other'];
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
  syncIndustry(); syncAction(); syncExtras();
  $$('#intake .invalid').forEach(el => el.classList.remove('invalid')); $('#formErr').style.display = 'none';
}
$('#fillExample').onclick = () => fillForm(EXAMPLES[$('#exPick').value]);

function readForm() {
  const f = $('#intake').elements, g = k => f[k].value.trim();
  return { name: g('name'), industry: f.industry.value, industryOther: g('industryOther'), country: f.country.value, city: g('city'), areas: g('areas'), about: g('about'),
    services: services.map(s => ({ name: s.name.trim(), desc: s.desc.trim(), price: s.price.trim() })).filter(s => s.name),
    mainAction: ($('input[name=mainAction]:checked') || {}).value || '', phone: g('phone'), whatsapp: g('whatsapp'), email: g('email'), address: g('address'), hours: f.hours.value.trim(),
    reviews: f.reviews.value.trim(), stats: f.stats.value.trim(), insurance: baShown('#insField') ? f.insurance.value.trim() : '',
    colour: f.colour.value === 'custom' ? $('#colourCustom').value : f.colour.value,
    facebook: g('facebook'), instagram: g('instagram'), other: g('other'), logo: logoData, photos: photos.slice(), ba: baShown('#baField') ? baPairs.map(p => ({ ...p })) : [] };
}
function baShown(sel) { return $(sel).style.display !== 'none'; }
function validate(d) {
  const bad = { name: !d.name, industry: !d.industry || (d.industry === 'other' && !d.industryOther), about: d.about.length < 30,
    services: !d.services.length, phone: d.phone.replace(/\D/g, '').length < 6, email: !isEmail(d.email),
    whatsapp: d.mainAction === 'whatsapp' ? d.whatsapp.replace(/\D/g, '').length < 6 : false };
  $$('#intake .f[data-f]').forEach(el => el.classList.toggle('invalid', !!bad[el.dataset.f]));
  const ok = !Object.values(bad).some(Boolean);
  $('#formErr').style.display = ok ? 'none' : 'block';
  if (!ok) $('#intake .invalid').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  return ok;
}
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

/* ---------------- Pipeline ---------------- */
function botSet(n, state, status, lines) {
  const b = $('#bot' + n); b.className = 'bot ' + state;
  $('.st', b).innerHTML = (state === 'run' ? '<span class="spin"></span> ' : '') + esc(status);
  if (lines) $('ul', b).innerHTML = lines.map(l => `<li>${esc(l)}</li>`).join('');
  $('.ic', b).textContent = state === 'done' ? '✓' : n;
}
const cleanOpts = o => { const r = {}; if (o.style) r.style = o.style; if (o.accent) r.accent = o.accent; if (typeof o.dark === 'boolean') r.dark = o.dark; if (o.headline) r.headline = o.headline; if (+o.design > 0) r.design = +o.design; return r; };
let running = false;
async function runPipeline(change) {
  if (running) return; running = true;
  try {
    show('pipeline');
    $('#pipeTitle').textContent = change ? 'Updating your website…' : 'Building your website…';
    [1, 2, 3].forEach(n => botSet(n, '', 'Waiting…', []));
    const d = current.data, t0 = performance.now();
    // 1 · Intake bot
    botSet(1, 'run', 'Checking your details…');
    await sleep(700);
    const rv = parseReviews(d.reviews).length, st = parseStats(d.stats).length;
    botSet(1, 'done', 'Details received', change ? [`Change request for ${current.id} (version ${current.version})`, ...change.summary, 'Passed to Builder bot'] : [
      `New request ${current.id}: "${d.name}"`,
      `Industry: ${industryLabel(d)} (matched: ${detectProfile(d).label})${d.city ? ' · ' + d.city : ''} · ${COUNTRIES[d.country].label} (${COUNTRIES[d.country].cur.trim()})`,
      `${d.services.length} service${d.services.length > 1 ? 's' : ''}; main action: ${d.mainAction || 'default for the industry'}${d.whatsapp ? '; WhatsApp on' : ''}`,
      `${d.photos.length ? d.photos.length + ' photo' + (d.photos.length > 1 ? 's' : '') + ' uploaded' : 'No photos, so stock photos will be used'}; logo: ${d.logo ? 'uploaded' : 'text logo'}`,
      `${rv ? rv + ' real review' + (rv > 1 ? 's' : '') : 'No reviews, so labelled sample reviews in the preview'}; ${st ? st + ' figure' + (st > 1 ? 's' : '') : 'no figures given'}`,
      'Details packaged and passed to Builder bot']);
    // 2 · Builder bot
    botSet(2, 'run', 'Writing copy and designing your website…');
    await sleep(900);
    const ai = await generateWithAI(d);
    const opts = cleanOpts(current.opts);
    const desk = buildSite(d, opts, ai, {});
    const M = desk.M;
    current.styleKey = M.key; current.placeholders = M.placeholders.slice();
    const words = desk.markup.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    botSet(2, 'done', 'Website designed', [
      `Business type: ${M.prof.label}; design: ${M.kit.label.replace(/ \(.*$/, "")} kit, ${M.heroV} hero${opts.accent ? ', main colour ' + opts.accent : ''}${M.P.dark ? ', dark' : ''}`,
      ai ? 'Copy written by AI' : 'Copy: AI hook not connected in this demo, so the built-in industry copy wrote it from your details',
      `Sections: header, ${M.order.join(', ')}, footer`,
      `About ${words} words; one long page that works on phones and desktops`,
      `${M.placeholders.length} item${M.placeholders.length === 1 ? '' : 's'} to swap before launch`,
      'Website files kept on our side; passed to Preview bot']);
    // 3 · Preview bot
    botSet(3, 'run', API ? 'Saving your preview and making your private link…' : 'Preparing your live preview…');
    await sleep(500);
    let doc = desk.doc, saveNote = 'Live version: a private, expiring preview link on our server';
    if (API) {
      try { doc = await apiSavePreview(opts); saveNote = 'Private preview link ready: open it on any phone or computer, or share it'; }
      catch (err) { console.warn(err); current.shareUrl = null; saveNote = 'Could not save your preview link just now (' + err.message + '). You can still view it here; we will retry when you continue.'; }
    }
    setPreviewDoc(doc);
    const log = [`Full working website ready (${Math.round(previews.bytes / 1024)} KB, one file)`,
      'Opens in a new tab: menu, buttons, animations, sliders and forms all work (forms send nothing in a preview)',
      'Also shown below with a desktop / mobile switch',
      saveNote];
    botSet(3, 'done', 'Preview ready', [...log, `Total time: ${((performance.now() - t0) / 1000).toFixed(1)}s`]);
    current.status = change ? 'changes applied, awaiting approval' : 'preview sent, awaiting approval';
    upsert(current);
    await sleep(700);
    device = innerWidth < 700 ? 'mobile' : 'desktop';
    $('#changes').classList.remove('on');
    show('preview'); renderPreview();
  } catch (err) {
    console.error(err);
    botSet(2, 'err', 'Something went wrong: ' + (err && err.message));
  } finally { running = false; }
}

/* ---------------- Preview (client side, fully interactive) ---------------- */
function fitFrame() {
  const box = $('#liveBox'); if (!box) return;
  const fr = $('iframe', box), vw = device === 'mobile' ? 390 : 1280, vh = device === 'mobile' ? 844 : 860;
  const k = Math.min(1, box.clientWidth / vw);
  fr.style.cssText = `width:${vw}px;height:${Math.round(vh)}px;transform:scale(${k});transform-origin:0 0`;
  box.style.height = Math.round(vh * k) + 'px';
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
  designBusy = true; renderDesignNav();
  const from = +current.opts.design || 0;
  try {
    $('#dNote').textContent = 'Building design ' + (to + 1) + '…';
    current.opts.design = to; current.designMax = Math.max(current.designMax || 0, to);
    current.version++;
    current.revisions.push({ at: new Date().toISOString(), design: to, notes: `Switched to design ${to + 1}` });
    const opts = cleanOpts(current.opts), ai = await generateWithAI(current.data);
    const built = buildSite(current.data, opts, ai, {});
    current.styleKey = built.M.key; current.placeholders = built.M.placeholders.slice();
    let doc = built.doc;
    if (API) { try { doc = await apiSavePreview(opts); } catch (err) { console.warn(err); current.shareUrl = null; } }
    setPreviewDoc(doc); upsert(current);
    $('#dNote').textContent = API && !current.shareUrl ? 'Showing design ' + (to + 1) + '. We could not save it just now; we will retry when you press Apply.' : 'Step back and forth through designs. The one showing when you press Apply is the one we keep.';
    designBusy = false; renderPreview();
  } catch (err) {
    console.error(err); current.opts.design = from; $('#dNote').textContent = 'Sorry, that design could not be built.';
    designBusy = false; renderDesignNav();
  }
}
$('#dPrev').onclick = () => switchDesign((+current.opts.design || 0) - 1);
$('#dNext').onclick = () => switchDesign((+current.opts.design || 0) + 1);
function renderPreview() {
  renderDesignNav();
  $$('.toggle button').forEach(b => { b.classList.toggle('on', b.dataset.dev === device); b.setAttribute('aria-selected', b.dataset.dev === device); });
  $('#pvRev').textContent = 'Version ' + current.version;
  const ph = current.placeholders || [];
  const samp = ph.filter(p => /^Sample|^Stock|^Some sections/.test(p));
  $('#pvSamples').textContent = samp.length ? 'Yellow "sample" tags mark placeholder content (' + samp.map(s => s.split(/[:(]/)[0].trim().toLowerCase()).join(', ') + '). We replace them with your real ones, or remove them, before launch.' : '';
  const open = $('#openPv'); open.href = (API && current.shareUrl) || previews.url; open.onclick = openPreviewTab;
  $('#pvOpened').textContent = '';
  if (API) renderShare();
  const host = API ? `${location.host}/s/${slug(current.data.name)}` : `${slug(current.data.name)}.${BRAND.domain}`;
  const inner = `<div class="live" id="liveBox"><iframe id="liveFrame" title="Live preview of your website" sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"></iframe></div>`;
  $('#stage').innerHTML = device === 'desktop'
    ? `<div class="browser"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">🔒 ${esc(host)} · preview</span></div>${inner}</div>`
    : `<div class="phone"><div class="screenwrap">${inner}</div></div>`;
  fitFrame();
  $('#liveFrame').srcdoc = previews.doc;
}
addEventListener('resize', () => { if ($('#screen-preview').classList.contains('on')) fitFrame(); });
$$('.toggle button').forEach(b => b.onclick = () => { device = b.dataset.dev; renderPreview(); });

/* ---------------- Request changes -> re-run builder ---------------- */
$('#reqBtn').onclick = () => { $('#changes').classList.toggle('on'); if ($('#changes').classList.contains('on')) $('#changes').scrollIntoView({ behavior: 'smooth' }); };
$('#chips').onclick = e => { const t = e.target.dataset.t; if (t) { const n = $('#chNotes'); n.value = (n.value.trim() ? n.value.trim().replace(/[.]?$/, '. ') : '') + t; } };
$('#editDetails').onclick = () => { editing = true; fillForm(current.data); show('form'); };
$('#rerunBtn').onclick = () => {
  const notes = $('#chNotes').value.trim(), lower = notes.toLowerCase(), headline = $('#chHeadline').value.trim();
  let style = $('#chTheme').value, accent = $('#chColour').value, dark;
  if (/\b(dark|darker|black|moody|night)\b/.test(lower)) dark = true;
  else if (/\b(light|lighter|bright|brighter|white)\b/.test(lower)) dark = false;
  if (!style) { const m = lower.match(/\b(clinic|restaurant|salon|spa|law|legal|estate|property|plumb|trade)\w*/); if (m) style = { clinic: 'clinic', restaurant: 'restaurant', salon: 'salon', spa: 'salon', law: 'law', legal: 'law', estate: 'realestate', property: 'realestate', plumb: 'home', trade: 'home' }[m[1]]; }
  if (!accent) { const w = Object.keys(COLOUR_WORDS).find(w => new RegExp('\\b' + w + '\\b').test(lower)); if (w) accent = COLOUR_WORDS[w]; }
  const reshuffle = /\b(another|different|new|next|fresh)\s+(design|look|layout|template)\b|\breshuffle\b/.test(lower);
  if (!style && !accent && !headline && !notes && dark === undefined) { $('#chNotes').focus(); $('#chNotes').placeholder = 'Tell us what to change first…'; return; }
  const o = current.opts, summary = [];
  if (style && style !== (o.style || current.styleKey)) { o.style = style; summary.push(`Style → ${styleLabel(style)}`); }
  if (accent && accent !== o.accent) { o.accent = accent; summary.push(`Main colour → ${accent}`); }
  if (dark !== undefined && dark !== o.dark) { o.dark = dark; summary.push(dark ? 'Darker look' : 'Lighter look'); }
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
$('#approveBtn').onclick = () => {
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
$('#startOver').onclick = () => { $('#intake').reset(); services = [{ name: '', desc: '', price: '' }]; renderSvcs(); setLogo(''); photos = []; renderPhotos(); baPairs = []; baDraft = {}; renderBA(); syncExtras(); syncIndustry(); syncColour(); syncAction(); current = null; previews = null; show('form'); };

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
  let box = $('#shareBox');
  if (!box) { box = document.createElement('div'); box.id = 'shareBox'; box.className = 'card'; box.style.cssText = 'margin-top:14px'; $('.open-card').after(box); }
  if (!current.shareUrl) { box.innerHTML = '<p class="note" style="margin:0">Your private preview link could not be saved yet. Check your connection; we will try again when you continue.</p>'; return; }
  const exp = current.shareExpires ? new Date(current.shareExpires).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  box.innerHTML = `<h2 style="margin:0 0 4px;font-size:18px">Your private preview link</h2><p class="hint" style="margin:0 0 10px">Open it on your phone or send it to a partner. Only people with the link can see it${exp ? `; it works until ${esc(exp)}` : ''}.</p>
   <div class="row" style="gap:8px;flex-wrap:nowrap"><input type="text" id="shareUrl" readonly value="${esc(current.shareUrl)}" style="flex:1;min-width:0" aria-label="Preview link"><button type="button" class="btn sm" id="shareCopy">Copy link</button></div>`;
  $('#shareUrl').onclick = e => e.target.select();
  $('#shareCopy').onclick = async () => { try { await navigator.clipboard.writeText(current.shareUrl); } catch (_) { $('#shareUrl').select(); document.execCommand && document.execCommand('copy'); } $('#shareCopy').textContent = 'Copied ✓'; setTimeout(() => { const b = $('#shareCopy'); if (b) b.textContent = 'Copy link'; }, 1800); };
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
  $$('.foot a[href="#admin"]').forEach(a => a.remove());
}

/* ---------------- Router ---------------- */
function show(name) {
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === 'screen-' + name));
  const idx = name === 'thanks' ? 3 : ['form', 'pipeline', 'preview', 'approve'].indexOf(name);
  $$('#stepsNav span').forEach((s, i) => s.classList.toggle('on', i === idx));
  $('#stepsNav').style.visibility = name === 'admin' ? 'hidden' : 'visible';
  window.scrollTo(0, 0);
}
function route() {
  if (location.hash === '#admin' && API) { location.href = '/admin'; return; }
  if (location.hash === '#admin') { renderAdmin(); show('admin'); }
  else if (!$('.screen.on') || $('#screen-admin').classList.contains('on')) { show(current && previews ? 'preview' : 'form'); if (current && previews) renderPreview(); }
}
window.addEventListener('hashchange', route);
services = [{ name: '', desc: '', price: '' }]; renderSvcs(); renderPhotos(); renderBA(); syncExtras();
route();
