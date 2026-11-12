/* Content editor sidebar on the client preview screen.
   Layout stays locked; words, photos and the client's own prices can be changed.
   Autosaves through the existing /api/save path (server sanitizes). */
(function () {
  const PREVIEW_MS = 420;
  const SAVE_MS = 1600;
  const PHOTO_KEYS = [
    ['hero', 'Top of the page'],
    ['about', 'About'],
    ['about2', 'About (second photo)'],
    ['split', 'Story / why-us photo'],
    ['contact', 'Contact section'],
    ['cta', 'Bottom call-to-action'],
    ['rv', 'Reviews photo'],
  ];

  let previewTimer = 0, saveTimer = 0, open = false, filling = false, dirty = false, saving = false;
  let statusTimer = 0;

  const editorEl = () => $('#siteEditor');
  const previewScreen = () => $('#screen-preview');
  const btn = () => $('#editSiteBtn');

  function setStatus(msg, kind) {
    const el = $('#edStatus'); if (!el) return;
    el.textContent = msg || '';
    el.className = 'ed-status' + (kind === 'err' ? ' is-err' : kind === 'muted' ? ' is-muted' : '');
    if (statusTimer) clearTimeout(statusTimer);
    if (msg && kind !== 'err') statusTimer = setTimeout(() => { if (el.textContent === msg) { el.textContent = ''; el.className = 'ed-status is-muted'; } }, 3500);
  }

  function reviewsToText(d, M) {
    if (d.reviews && String(d.reviews).trim()) return String(d.reviews);
    if (M && M.reviews && M.reviews.length) return M.reviews.map(r => `${r.q} — ${r.n}`).join('\n');
    return '';
  }

  function parseReviewLines(txt) {
    return String(txt || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 8).map(l => {
      const m = l.match(/^["“]?(.+?)["”]?\s*(?:—|–|\s-\s|\|)\s*([^—–|]{1,40})$/);
      return m ? { q: m[1].trim(), n: m[2].trim() } : { q: l.replace(/^["“]|["”]$/g, ''), n: '' };
    });
  }

  function photoSlots(M) {
    const ph = (M && M.ph) || {}, ov = (current.data && current.data.photoOverrides) || {}, slots = [];
    PHOTO_KEYS.forEach(([k, label]) => {
      if (ph[k] || ov[k]) slots.push({ key: k, label, url: ov[k] || ph[k] || '', overridden: !!ov[k] });
    });
    (M && M.services || []).forEach((s, i) => {
      const key = 'services:' + i;
      const url = ov[key] || (ph.services && ph.services[i]) || '';
      if (url || s) slots.push({ key, label: 'Photo: ' + (s && s.name ? svcName(s.name) : 'service ' + (i + 1)), url, overridden: !!ov[key] });
    });
    (ph.gallery || []).forEach((url, i) => {
      const key = 'gallery:' + i;
      slots.push({ key, label: 'Gallery photo ' + (i + 1), url: ov[key] || url, overridden: !!ov[key] });
    });
    return slots;
  }

  function field(name, label, value, opts) {
    const id = 'ed-' + name.replace(/[^a-z0-9]+/gi, '-');
    const ta = opts && opts.area;
    const max = (opts && opts.max) || '';
    const ph = (opts && opts.placeholder) || '';
    const typ = (opts && opts.type) || 'text';
    if (ta) return `<label for="${id}">${hh(label)}<textarea id="${id}" data-ed="${hh(name)}" maxlength="${max || ''}" placeholder="${hh(ph)}">${hh(value || '')}</textarea></label>`;
    return `<label for="${id}">${hh(label)}<input id="${id}" type="${hh(typ)}" data-ed="${hh(name)}" maxlength="${max || ''}" placeholder="${hh(ph)}" value="${hh(value || '')}"></label>`;
  }

  function openAccordions() {
    return $$('#edBody details.ed-acc').filter(el => el.open).map(el => ((el.querySelector('summary') || {}).textContent || '').trim());
  }
  function restoreAccordions(names) {
    if (!names || !names.length) return;
    $$('#edBody details.ed-acc').forEach(el => {
      const n = ((el.querySelector('summary') || {}).textContent || '').trim();
      if (names.includes(n)) el.open = true;
    });
  }
  function renderBody() {
    if (!current || !current.data) return;
    const keepOpen = openAccordions();
    const d = current.data, o = current.opts || {}, M = current.previewM;
    const svcs = (d.services && d.services.length ? d.services : (M && M.services) || []).map(s => ({ name: s.name || '', desc: s.desc || '', price: s.price || '' }));
    const revs = parseReviewLines(reviewsToText(d, M));
    const slots = photoSlots(M);
    const sampleNote = M && M.reviews && M.reviews[0] && M.reviews[0].sample && !String(d.reviews || '').trim();

    const svcHtml = svcs.map((s, i) => `<div class="ed-svc" data-svc="${i}">
      <div class="ed-svc-top"><span>Service ${i + 1}</span>${svcs.length > 1 ? `<button type="button" class="ed-mini danger" data-act="rm-svc" data-i="${i}">Remove</button>` : ''}</div>
      ${field('svc-name-' + i, 'Name', s.name, { max: 80 })}
      ${field('svc-desc-' + i, 'Description', s.desc, { area: true, max: 400 })}
      ${field('svc-price-' + i, 'Price (as you want it shown)', s.price, { max: 40, placeholder: 'e.g. £80 or from £40' })}
    </div>`).join('') + (svcs.length < MAX_SERVICES ? `<button type="button" class="ed-add" data-act="add-svc">+ Add a service</button>` : '');

    const rvHtml = revs.map((r, i) => `<div class="ed-rv" data-rv="${i}">
      <div class="ed-svc-top"><span>Review ${i + 1}</span><button type="button" class="ed-mini danger" data-act="rm-rv" data-i="${i}">Remove</button></div>
      ${field('rv-q-' + i, 'Quote', r.q, { area: true, max: 280 })}
      ${field('rv-n-' + i, 'Customer name', r.n, { max: 40, placeholder: 'e.g. Helen R.' })}
    </div>`).join('') + (revs.length < 8 ? `<button type="button" class="ed-add" data-act="add-rv">+ Add a review</button>` : '');

    const photoHtml = slots.length ? slots.map(s => `<div class="ed-photo" data-photo="${hh(s.key)}">
      <div class="ed-photo-top"><span>${hh(s.label)}</span></div>
      ${s.url ? `<img src="${uattr(s.url)}" alt="">` : '<p class="ed-hint">No photo in this section yet.</p>'}
      <div class="ed-photo-actions">
        <button type="button" class="ed-mini" data-act="up-photo" data-key="${hh(s.key)}">Use my photo</button>
        ${s.overridden ? `<button type="button" class="ed-mini" data-act="rv-photo" data-key="${hh(s.key)}">Revert</button>` : ''}
      </div>
    </div>`).join('') : '<p class="ed-hint">Photos will appear here once the preview is ready.</p>';

    $('#edBody').innerHTML = `
      <details class="ed-acc" open><summary>Business</summary><div class="ed-fields">
        ${field('name', 'Business name', d.name, { max: 60 })}
      </div></details>
      <details class="ed-acc" open><summary>Headline</summary><div class="ed-fields">
        ${field('headline', 'Headline', o.headline || (M && M.h1 ? String(M.h1).replace(/\*/g, '') : ''), { max: 90 })}
        ${field('lead', 'Subtext under the headline', o.lead || (M && M.lead) || '', { area: true, max: 400 })}
        ${field('ctaLabel', 'Main button label', o.ctaLabel || (M && M.primary && M.primary.label) || '', { max: 80 })}
      </div></details>
      <details class="ed-acc"><summary>About</summary><div class="ed-fields">
        ${field('about', 'About your business', d.about, { area: true, max: 900 })}
      </div></details>
      <details class="ed-acc" open><summary>Services and prices</summary><div class="ed-fields" id="edServices">${svcHtml}</div></details>
      <details class="ed-acc"><summary>Reviews</summary><div class="ed-fields" id="edReviews">
        ${sampleNote ? '<p class="ed-hint">These start as sample reviews. Your own words replace them on the site.</p>' : ''}
        ${rvHtml}
      </div></details>
      <details class="ed-acc"><summary>Photos</summary><div class="ed-fields" id="edPhotos">
        <p class="ed-hint">Swap a section photo for one of your own. JPG, PNG or WebP, up to 1.5 MB. Revert goes back to the original.</p>
        ${photoHtml}
      </div></details>
      <details class="ed-acc"><summary>Contact</summary><div class="ed-fields">
        ${field('phone', 'Phone', d.phone, { max: 30, type: 'tel' })}
        ${field('email', 'Email', d.email, { max: 80, type: 'email' })}
        ${field('address', 'Address', d.address, { max: 120 })}
        ${field('hours', 'Opening hours (one per line)', d.hours, { area: true, max: 300, placeholder: 'Mon–Fri: 8am–6pm' })}
        ${field('bookingUrl', 'Booking link', d.bookingUrl, { max: 200, type: 'url', placeholder: 'https://…' })}
      </div></details>`;
    restoreAccordions(keepOpen);
  }

  function readEditor() {
    const val = name => { const el = $(`#edBody [data-ed="${name}"]`); return el ? el.value : ''; };
    const d = { ...(current.data || {}) };
    d.name = val('name');
    d.about = val('about');
    d.phone = val('phone');
    d.email = val('email');
    d.address = val('address');
    d.hours = val('hours');
    d.bookingUrl = val('bookingUrl');
    const svcs = [];
    $$('#edServices .ed-svc').forEach((row, i) => {
      svcs.push({
        name: ($('#ed-svc-name-' + i) || {}).value || '',
        desc: ($('#ed-svc-desc-' + i) || {}).value || '',
        price: ($('#ed-svc-price-' + i) || {}).value || '',
      });
    });
    d.services = svcs.filter(s => s.name.trim());
    const lines = [];
    $$('#edReviews .ed-rv').forEach((row, i) => {
      const q = (($('#ed-rv-q-' + i) || {}).value || '').trim();
      const n = (($('#ed-rv-n-' + i) || {}).value || '').trim();
      if (q) lines.push(n ? `${q} — ${n}` : q);
    });
    d.reviews = lines.join('\n');
    const o = { ...(current.opts || {}) };
    o.headline = val('headline');
    o.lead = val('lead');
    o.ctaLabel = val('ctaLabel');
    return {
      data: sanitizeSiteData(d, { allowData: true }),
      opts: sanitizeOpts(o),
    };
  }

  function applyEditor() {
    if (!current) return;
    const next = readEditor();
    current.data = next.data;
    current.opts = { ...(current.opts || {}), ...next.opts };
    if (!current._editorTouched) {
      current._editorTouched = true;
      current.version = (current.version || 1) + 1;
    }
    dirty = true;
  }

  function rebuildPreview() {
    if (!current) return;
    try {
      const opts = cleanOpts(current.opts);
      const built = buildSite(current.data, opts, null, {});
      current.previewM = built.M;
      current.styleKey = built.M.key;
      current.placeholders = built.M.placeholders.slice();
      setPreviewDoc(built.doc);
      upsert(current);
      renderPreview({ instant: true });
    } catch (err) {
      console.warn(err);
      setStatus('Could not refresh the preview just now.', 'err');
    }
  }

  async function autosave() {
    if (!current || !API) { dirty = false; if (!API) setStatus('Saved on this device', 'muted'); return; }
    if (saving) { scheduleSave(); return; }
    saving = true;
    setStatus('Saving…', 'muted');
    try {
      const opts = cleanOpts(current.opts);
      await startShareSave(opts);
      dirty = false;
      upsert(current);
      setStatus('Saved', '');
    } catch (err) {
      console.warn(err);
      setStatus('Could not save just now. We will retry.', 'err');
    } finally { saving = false; }
  }

  function schedulePreview() {
    if (previewTimer) clearTimeout(previewTimer);
    previewTimer = setTimeout(() => { previewTimer = 0; rebuildPreview(); }, PREVIEW_MS);
  }
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = 0; autosave(); }, SAVE_MS);
  }

  function onChange() {
    if (filling || !open) return;
    applyEditor();
    schedulePreview();
    scheduleSave();
  }

  function addService() {
    applyEditor();
    current.data.services = (current.data.services || []).concat([{ name: 'New service', desc: '', price: '' }]);
    filling = true; renderBody(); filling = false;
    onChange();
    const last = $$('#edServices [data-ed^="svc-name-"]').pop();
    if (last) last.focus();
  }
  function addReview() {
    applyEditor();
    const cur = String(current.data.reviews || '').trim();
    current.data.reviews = cur ? cur + '\nA lovely comment — Your customer' : 'A lovely comment — Your customer';
    filling = true; renderBody(); filling = false;
  }

  function fileFromButton(btnEl) {
    return new Promise(resolve => {
      let inp = $('#edFile');
      if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file'; inp.id = 'edFile'; inp.className = 'ed-file';
        inp.accept = 'image/jpeg,image/png,image/webp';
        document.body.appendChild(inp);
      }
      inp.value = '';
      inp.onchange = () => { const f = inp.files && inp.files[0]; resolve(f || null); };
      inp.click();
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      if (file.size > 1.5 * 1024 * 1024) return reject(new Error('Please choose a photo under 1.5 MB.'));
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return reject(new Error('Please use a JPG, PNG or WebP photo.'));
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(new Error('Could not read that photo.'));
      r.readAsDataURL(file);
    });
  }

  async function uploadPhoto(key) {
    try {
      const file = await fileFromButton();
      if (!file) return;
      setStatus('Uploading photo…', 'muted');
      const dataUrl = await readFileAsDataUrl(file);
      let url = dataUrl;
      if (API) {
        if (!current.server) current.server = await apiJSON('/api/new', { name: current.data.name, email: current.data.email });
        url = await apiImage(dataUrl);
      }
      current.data.photoOverrides = { ...(current.data.photoOverrides || {}), [key]: url };
      applyEditor();
      filling = true; renderBody(); filling = false;
      rebuildPreview();
      scheduleSave();
      setStatus('Photo updated', '');
    } catch (err) {
      console.warn(err);
      setStatus((err && err.message) || 'Photo upload failed.', 'err');
    }
  }

  function revertPhoto(key) {
    if (current.data.photoOverrides) {
      const ov = { ...current.data.photoOverrides };
      delete ov[key];
      current.data.photoOverrides = Object.keys(ov).length ? ov : undefined;
    }
    applyEditor();
    filling = true; renderBody(); filling = false;
    rebuildPreview();
    scheduleSave();
    setStatus('Photo reverted', 'muted');
  }

  function bindBody() {
    const body = $('#edBody'); if (!body || body._edBound) return;
    body._edBound = true;
    body.addEventListener('input', onChange);
    body.addEventListener('change', onChange);
    body.addEventListener('click', ev => {
      const b = ev.target.closest('[data-act]'); if (!b) return;
      const act = b.dataset.act;
      if (act === 'add-svc') { ev.preventDefault(); addService(); }
      else if (act === 'rm-svc') {
        ev.preventDefault();
        applyEditor();
        const i = +b.dataset.i;
        current.data.services = (current.data.services || []).filter((_, j) => j !== i);
        if (!current.data.services.length) current.data.services = [{ name: 'Service', desc: '', price: '' }];
        filling = true; renderBody(); filling = false;
        onChange();
      }
      else if (act === 'add-rv') { ev.preventDefault(); addReview(); }
      else if (act === 'rm-rv') {
        ev.preventDefault();
        applyEditor();
        const i = +b.dataset.i;
        const recs = parseReviewLines(current.data.reviews).filter((_, j) => j !== i);
        current.data.reviews = recs.map(r => r.n ? `${r.q} — ${r.n}` : r.q).join('\n');
        filling = true; renderBody(); filling = false;
        onChange();
      }
      else if (act === 'up-photo') { ev.preventDefault(); uploadPhoto(b.dataset.key); }
      else if (act === 'rv-photo') { ev.preventDefault(); revertPhoto(b.dataset.key); }
    });
  }

  function focusField(name) {
    const map = { headline: 'headline', lead: 'lead', about: 'about', name: 'name', cta: 'ctaLabel' };
    const key = map[name] || name;
    const acc = $(`#edBody [data-ed="${key}"]`);
    if (!acc) return;
    const box = acc.closest('details'); if (box) box.open = true;
    acc.focus(); acc.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function syncEditorTop() {
    const top = document.querySelector('header.top');
    const h = (open && top && innerWidth >= 980) ? Math.ceil(top.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--editor-top', h + 'px');
  }

  function openSiteEditor() {
    if (!current || !previewScreen()) return;
    open = true;
    syncEditorTop();
    const aside = editorEl();
    aside.hidden = false;
    $('#edBackdrop').hidden = false;
    previewScreen().classList.add('editor-open');
    const b = btn(); if (b) b.setAttribute('aria-expanded', 'true');
    filling = true; renderBody(); filling = false;
    bindBody();
    setStatus('', 'muted');
    requestAnimationFrame(() => { try { $('#edClose').focus(); } catch (_) {} });
  }

  function closeSiteEditor(opts) {
    if (!open && !(previewScreen() && previewScreen().classList.contains('editor-open'))) return;
    if (open && !(opts && opts.silent)) { applyEditor(); scheduleSave(); }
    open = false;
    const aside = editorEl();
    if (aside) aside.hidden = true;
    const bd = $('#edBackdrop'); if (bd) bd.hidden = true;
    if (previewScreen()) previewScreen().classList.remove('editor-open');
    syncEditorTop();
    const b = btn(); if (b) { b.setAttribute('aria-expanded', 'false'); if (!opts || !opts.silent) try { b.focus(); } catch (_) {} }
  }

  async function flushSiteEditor() {
    if (previewTimer) { clearTimeout(previewTimer); previewTimer = 0; }
    if (open) applyEditor();
    if (dirty) rebuildPreview();
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = 0; }
    if (dirty || saving) await autosave();
  }

  window.closeSiteEditor = closeSiteEditor;
  window.flushSiteEditor = flushSiteEditor;
  window.openSiteEditor = openSiteEditor;

  function toggle() {
    if (open) closeSiteEditor();
    else openSiteEditor();
  }

  function init() {
    const b = btn(); if (!b) return;
    b.addEventListener('click', toggle);
    const close = $('#edClose'); if (close) close.addEventListener('click', () => closeSiteEditor());
    const bd = $('#edBackdrop'); if (bd) bd.addEventListener('click', () => closeSiteEditor());
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && open) { ev.preventDefault(); closeSiteEditor(); }
    });
    addEventListener('resize', syncEditorTop);
    addEventListener('message', ev => {
      const data = ev.data;
      if (!data || !data.wodEdit) return;
      if (!open) openSiteEditor();
      setTimeout(() => focusField(data.wodEdit), 50);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
