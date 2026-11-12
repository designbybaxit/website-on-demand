/* ---------------- Assemble one single-file site ---------------- */
const gfURL = S => `https://fonts.googleapis.com/css2?${S.gf}&display=swap`;
function sectionHTML(M, k) {
  if (!hasSection(M, k)) return '';
  // every section renders through the template library (lib/v-*.js); the variant was picked in siteModel
  const v = variantDef(k, k === 'hero' ? M.heroV : M.V[k] || Object.keys(LIB.sections[k] || {})[0]);
  if (!v) return '';
  if (k === 'hero') M.heroV = v.id;
  return v.html(M);
}
const footerVariant = M => (variantDef('footer', M.V.footer) || variantDef('footer', 'classic')).html(M);
const SCHEMA_TYPE = { clinic: 'MedicalClinic', restaurant: 'Restaurant', home: 'HomeAndConstructionBusiness', realestate: 'RealEstateAgent', salon: 'BeautySalon', law: 'LegalService' };
function buildSite(d, opts = {}, ai = null, mode = {}) {
  const M = siteModel(d, opts, ai);
  if (mode.edit) M.edit = true;
  if (mode.live) {
    // LIVE MODE (published sites): sample reviews / sample figures are never published, stock-photo tags hidden,
    // forms post real enquiries to mode.leadUrl, page is indexable.
    M.live = true;
    if (!M.reviews.length || M.reviews[0].sample) M.order = M.order.filter(k => k !== 'reviews');
    if (!M.stats.length || M.stats[0].sample) M.order = M.order.filter(k => k !== 'stats');
    M.ph.galleryStock = false;
    M.leadUrl = mode.leadUrl || '';
    M.liveUrl = mode.url || '';
  }
  const fx = fixedUI(M);
  const sections = M.order.map(k => sectionHTML(M, k)).join('\n');
  const cls = ['site', 's-' + M.key, 'k-' + M.kit.id, 'h-' + M.heroV, M.P.dark ? 'is-dark' : '', fx.callbar ? 'has-callbar' : '', mode.pv ? 'pv' : '', 'nojs'].filter(Boolean).join(' ');
  const markup = `<div class="${cls}"${M.live && M.leadUrl ? ` data-lead="${hh(M.leadUrl)}"` : ''} style="--pvh:${mode.pvh || 900}px"><style>${siteCSS(M)}
.site.nojs .rv-view{overflow-x:auto;scroll-snap-type:x mandatory}.site.nojs .rv-card{scroll-snap-align:start}.site.pv .rv-view{overflow:hidden}</style>
<a class="skip" href="#main">Skip to content</a>${topbarHTML(M)}${headerHTML(M)}<main id="main">${sections}</main>${footerVariant(M)}${fx.html}</div>`;
  return { M, markup, doc: fullSiteDoc(M, markup) };
}
function fullSiteDoc(M, markup) {
  const d = M.d, desc = M.lead.length > 155 ? M.lead.slice(0, 152).replace(/\s+\S*$/, '') + '…' : M.lead;
  const t0 = `${M.name}: ${M.eyebrow}`;
  const title = t0.length > 70 ? t0.slice(0, 70).replace(/[\s·,:;–-]+\S*$/, '') : t0;
  const fav = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${M.P.brand}"/><text x="16" y="21" font-family="Arial" font-weight="700" font-size="13" text-anchor="middle" fill="${lumC(M.P.brand) > .6 ? '#141414' : '#ffffff'}">${hh(M.initials)}</text></svg>`)}`;
  const ld = { '@context': 'https://schema.org', '@type': M.U.schema || (M.native && SCHEMA_TYPE[M.key]) || 'LocalBusiness', name: M.name, description: desc,
    telephone: d.phone || undefined, email: d.email || undefined, address: d.address ? { '@type': 'PostalAddress', streetAddress: d.address, addressLocality: d.city || undefined, addressCountry: d.country || 'GB' } : undefined,
    areaServed: M.place || undefined, sameAs: [d.facebook, d.instagram].filter(Boolean),
    hasOfferCatalog: M.services.length ? { '@type': 'OfferCatalog', name: 'Services', itemListElement: M.services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: svcName(s.name) }, ...(priceNum(s.price) ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: priceNum(s.price) } } : {}) })) } : undefined };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${hh(title)}</title>
<meta name="description" content="${hh(desc)}">
<meta name="robots" content="${M.live ? 'index, follow' : 'noindex, follow'}">${M.live && M.liveUrl ? `<link rel="canonical" href="${hh(M.liveUrl)}">` : ''}
<meta property="og:type" content="website"><meta property="og:title" content="${hh(title)}"><meta property="og:description" content="${hh(desc)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${/^#/.test(M.P.bg) ? M.P.bg : '#ffffff'}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.pexels.com https://images.unsplash.com https://plus.unsplash.com; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'">
<link rel="icon" href="${fav}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com"><link rel="preconnect" href="https://images.pexels.com">
<link rel="stylesheet" href="${gfURL(M.S)}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>html,body{margin:0;background:${/^#/.test(M.P.bg) ? M.P.bg : '#fff'}}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style>
</head>
<body>
<!-- BRAND SWAP: business "${hh(M.name)}". Design: kit ${hh(M.kit.id)}, hero ${hh(M.heroV)}, recipe ${hh(M.design.industry)} #${M.design.orderIx + 1}${M.opts.design ? ', reshuffle ' + (+M.opts.design) : ''}. Colours live in the .site token block at the top of the <style>. Built by ${STUDIO.name} (website-on-demand builder v2). -->
${markup}
<script>(${siteRuntime.toString()})();</script>${M.edit ? editHookScript() : ''}
</body>
</html>`;
}

function editHookScript() {
  const src = function () {
    document.addEventListener('click', function (e) {
      const t = e.target && e.target.closest && e.target.closest('[data-edit]');
      if (!t) return;
      e.preventDefault();
      try { parent.postMessage({ wodEdit: t.getAttribute('data-edit') }, '*'); } catch (err) {}
    }, true);
  };
  return '<script>(' + src.toString() + ')();<\/script>';
}
/* Hook is only attached to the in-app iframe, never to the stored /p/ or share document. */
function withEditHook(doc) {
  const hook = editHookScript();
  if (!doc || String(doc).indexOf('wodEdit') !== -1) return doc;
  return String(doc).includes('</body>') ? String(doc).replace('</body>', hook + '\n</body>') : String(doc) + hook;
}
