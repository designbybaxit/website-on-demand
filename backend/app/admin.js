/* Admin page logic. The site builder (b1–b8) is bundled above this script, so "Mark as paid & publish"
   rebuilds the site here in Abdul's own (trusted) browser in LIVE mode and uploads the finished HTML.
   (Keeps the Worker well inside the free plan's 10 ms CPU limit.) */
const A$ = (s, r = document) => r.querySelector(s);
const TZ = 'Asia/Karachi';
const fmt = iso => iso ? new Date(iso).toLocaleString('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' PKT' : '';
let DATA = { subs: [], events: [], leads: [] };
const openSet = new Set();
async function api(path, body) {
  const r = await fetch(path, body === undefined ? { credentials: 'same-origin' } : { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', 'x-wod-admin': '1' }, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch (_) {}
  if (r.status === 401) { showLogin(); throw new Error((j && j.error) || 'Please log in'); }
  if (!r.ok) throw new Error((j && j.error) || 'Error ' + r.status);
  return j;
}
function showLogin() { A$('#loginBox').style.display = 'block'; A$('#app').style.display = 'none'; A$('#hdrActs').style.display = 'none'; A$('#pw').focus(); }
A$('#loginForm').onsubmit = async e => {
  e.preventDefault(); A$('#loginErr').textContent = '';
  try { await api('/api/admin/login', { password: A$('#pw').value }); A$('#pw').value = ''; load(); } catch (err) { A$('#loginErr').textContent = err.message; }
};
A$('#logout').onclick = async () => { await api('/api/admin/logout', {}).catch(() => {}); showLogin(); };
A$('#refresh').onclick = () => load();
async function load() {
  try { DATA = await api('/api/admin/list'); } catch (_) { return; }
  A$('#loginBox').style.display = 'none'; A$('#app').style.display = 'block'; A$('#hdrActs').style.display = 'block';
  render();
}
const J = s => { try { return s ? JSON.parse(s) : null; } catch (_) { return null; } };
function render() {
  const S = DATA.subs, n = st => S.filter(s => s.status === st).length;
  A$('#stats').innerHTML = [[S.length, 'Requests'], [n('previewing'), 'Previewing'], [n('applied'), 'Applied (send payment link)'], [n('published'), 'Live'], [n('unpublished'), 'Offline'], [DATA.leads.length, 'Enquiries']]
    .map(x => `<div class="stat"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
  const origin = location.origin;
  A$('#tbl').innerHTML = `<tr><th>Created</th><th>Business</th><th class="hide-m">Contact</th><th>Status</th><th>Links</th><th>Actions</th></tr>` + (S.length ? S.map(s => {
    const ap = J(s.apply_json), paid = J(s.paid_json), live = s.published_slug ? `${origin}/s/${s.published_slug}` : '';
    const ph = J(s.placeholders_json) || [];
    return `<tr><td>${esc(fmt(s.created_at))}<div class="note">${esc(s.id)}</div></td>
     <td><b>${esc(s.name || '(not saved yet)')}</b><div class="note">${esc(s.industry || '')}${s.country ? ' · ' + esc(s.country) : ''}${s.ip_country ? ' · from ' + esc(s.ip_country) : ''} · v${s.version || 0} · ${s.img_count} photo upload${s.img_count === 1 ? '' : 's'}</div></td>
     <td class="hide-m">${esc(s.email || '')}<div class="note">${esc(s.phone || '')}</div></td>
     <td><span class="pill ${esc(s.status)}">${esc(s.status)}</span>${ap ? `<div class="note">Applied ${esc(fmt(ap.at))}: ${esc(ap.currency)}${esc(ap.setup)} + ${esc(ap.currency)}${esc(ap.monthly)}/mo, ${esc(ap.domain)}, due today ${esc(ap.currency)}${esc(ap.dueToday)}${ap.email && ap.email !== s.email ? ' · ' + esc(ap.email) : ''}</div>` : ''}${paid ? `<div class="note">Paid: ${esc(paid.currency)}${esc(paid.amount)} ${paid.reference ? '· ' + esc(paid.reference) : ''} (${esc(fmt(paid.at))})</div>` : ''}${ph.length ? `<div class="note">${ph.length} before-launch note${ph.length === 1 ? '' : 's'}</div>` : ''}</td>
     <td>${s.data_json ? `<a href="/p/${esc(s.id)}" target="_blank" rel="noopener">Preview</a><div class="note">${s.preview_opens} open${s.preview_opens === 1 ? '' : 's'} · until ${esc(fmt(s.preview_expires_at))}</div>` : '<span class="note">no preview</span>'}${live ? `<div style="margin-top:6px"><a href="${esc(live)}" target="_blank" rel="noopener">${s.status === 'published' ? 'Live site' : 'Live address (offline)'}</a></div>` : ''}</td>
     <td><div class="acts">${s.data_json ? `<button class="btn g" data-pub="${esc(s.id)}">${s.status === 'published' ? 'Re-publish (rebuild)' : s.published_slug ? 'Publish again' : 'Mark as paid & publish'}</button>` : ''}${s.status === 'published' ? `<button class="btn r" data-unpub="${esc(s.id)}">Unpublish</button>` : ''}<button class="btn" data-det="${esc(s.id)}">${openSet.has(s.id) ? 'Hide' : 'Details'}</button></div></td></tr>
     <tr class="det${openSet.has(s.id) ? ' on' : ''}" id="det-${esc(s.id)}"><td colspan="6">${detail(s)}</td></tr>`;
  }).join('') : '<tr><td colspan="6" class="note" style="text-align:center;padding:28px">No requests yet.</td></tr>');
  const mails = DATA.events.filter(e => /^email_/.test(e.type));
  A$('#mails').innerHTML = mails.length ? mails.slice(0, 60).map(e => { const m = J(e.detail) || {}; const sub = S.find(s => s.id === e.sub_id);
    return `<div class="mail"><span class="note">${esc(fmt(e.at))} · ${esc(e.type === 'email_pending' ? 'NOT SENT (email not connected)' : e.type)} · ${esc(m.kind || '')}${sub ? ' · ' + esc(sub.name) : ''}</span><b>To: ${esc(m.to)}</b><b>${esc(m.subject)}</b><details><summary class="note">Show text</summary><pre style="white-space:pre-wrap;font-size:12px">${esc(m.text)}</pre></details></div>`; }).join('') : '<p class="note">None yet.</p>';
  A$('#leads').innerHTML = DATA.leads.length ? DATA.leads.map(l => `<div class="mail"><span class="note">${esc(fmt(l.at))} · /s/${esc(l.slug)}</span><pre style="white-space:pre-wrap;font-size:12px;margin:4px 0 0">${esc(Object.entries(J(l.data_json) || {}).map(([k, v]) => k + ': ' + v).join('\n'))}</pre></div>`).join('') : '<p class="note">None yet.</p>';
}
function detail(s) {
  const d = J(s.data_json) || {}, ev = DATA.events.filter(e => e.sub_id === s.id), revs = J(s.revisions_json) || [], ph = J(s.placeholders_json) || [];
  const fields = Object.entries(d).filter(([k]) => k !== 'photos' && k !== 'logo' && k !== 'services').map(([k, v]) => `${k}: ${v}`).join('\n');
  const svcs = (d.services || []).map(x => `• ${x.name}${x.price ? ' – ' + x.price : ''}${x.desc ? ' (' + x.desc + ')' : ''}`).join('\n');
  const imgs = [d.logo, ...(d.photos || [])].filter(Boolean).map(u => `<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="" style="height:60px;border-radius:6px;margin:0 6px 6px 0;border:1px solid var(--line)"></a>`).join('');
  return `<div class="grid"><div><b>All details</b><pre>${esc(fields)}\n\nServices:\n${esc(svcs)}\n\nOptions: ${esc(s.opts_json)}</pre>${imgs ? `<b>Logo & photos</b><div>${imgs}</div>` : ''}</div>
  <div><b>Before launch</b><pre>${esc(ph.join('\n') || '–')}</pre><b>Change requests</b><pre>${esc(revs.map(r => `${fmt(r.at)}: ${[r.notes, r.style, r.accent, r.headline].filter(Boolean).join(' · ')}`).join('\n') || '–')}</pre>
  <b>History</b><pre>${esc(ev.map(e => `${fmt(e.at)}  ${e.type}`).join('\n'))}</pre></div></div>`;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slugOf = s => String(s).toLowerCase().replace(/&/g, 'and').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'site';

/* Build the LIVE site (no sample reviews/figures, real enquiry forms) in this browser, then upload it. */
function buildLive(s, slug) {
  const d = sanitizeSiteData(J(s.data_json) || {}, { allowData: false }), opts = J(s.opts_json) || {};
  const url = `${location.origin}/s/${slug}`;
  const out = buildSite(d, opts, null, { live: true, leadUrl: `${location.origin}/api/lead/${slug}`, url });
  if (/class="sample-tag"/.test(out.doc)) throw new Error('Live build still contains sample content');
  return out.doc;
}
A$('#tbl').onclick = async e => {
  const t = e.target;
  if (t.dataset.det) { const id = t.dataset.det; openSet.has(id) ? openSet.delete(id) : openSet.add(id); render(); return; }
  if (t.dataset.pub) {
    const s = DATA.subs.find(x => x.id === t.dataset.pub); if (!s) return;
    const ap = J(s.apply_json) || {}, already = s.status === 'published' || !!J(s.paid_json);
    const slug = prompt('Web address for this site (letters, numbers, dashes):\n' + location.origin + '/s/…', s.published_slug || s.slug || slugOf(s.name));
    if (slug === null) return;
    let paid = null;
    if (!already) {
      const amount = prompt(`Amount received (e.g. ${(ap.dueToday || 79)}). Leave as is if not sure:`, ap.dueToday ? String(ap.dueToday) : '');
      if (amount === null) return;
      const reference = prompt('Payment reference / note (optional):', '') || '';
      paid = { amount, currency: ap.currency || '$', reference };
    }
    t.disabled = true; t.textContent = 'Publishing…';
    try {
      const html = buildLive(s, slug.trim().toLowerCase());
      const r = await api(`/api/admin/publish/${s.id}`, { slug: slug.trim().toLowerCase(), html, paid });
      await load();
      alert('Published: ' + r.url);
    } catch (err) { alert('Could not publish: ' + err.message); render(); }
    return;
  }
  if (t.dataset.unpub) {
    const s = DATA.subs.find(x => x.id === t.dataset.unpub); if (!s) return;
    if (!confirm(`Take "${s.name}" offline? Visitors will see a polite "offline" page. You can publish it again any time.`)) return;
    t.disabled = true;
    try { await api(`/api/admin/unpublish/${s.id}`, {}); await load(); } catch (err) { alert('Could not unpublish: ' + err.message); render(); }
  }
};
load();
