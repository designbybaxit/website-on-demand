/* =====================================================================
   TEMPLATE LIBRARY: core registry (see demo/LIBRARY.md)
   - LIB.sections[type][id]  section variants   registerVariant()
   - LIB.kits[id]            style kits (look)  registerKit()
   - LIB.industries[id]      industry recipes   registerIndustry()
   - LIB.photos[profileKey]  extra photo pools  registerPhotos()
   Every choice is seeded by the business name + industry (+ opts.design),
   so one client always sees the same design and two clients differ.
   ===================================================================== */
const LIB = { sections: {}, kits: {}, industries: {}, photos: {} };
function registerVariant(section, id, def) { (LIB.sections[section] = LIB.sections[section] || {})[id] = { id, section, fits: () => true, css: () => '', ...def }; }
function registerKit(id, def) { LIB.kits[id] = { id, motion: 'soft', density: 'regular', ...def }; }
function registerIndustry(id, def) { LIB.industries[id] = { id, ...def }; }
function registerPhotos(profileKey, def) { LIB.photos[profileKey] = def; }
const variantDef = (section, id) => (LIB.sections[section] || {})[id] || null;

/* FNV-1a + murmur3 finaliser: well-mixed 32-bit hash, so different decisions don't move in lockstep */
function hash32(str) {
  let h = 0x811c9dc5;
  for (const c of String(str)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193); }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}
const seedPick = (arr, ...parts) => arr[hash32(parts.join('|')) % arr.length];
function seedShuffle(arr, ...parts) {
  let s = hash32(parts.join('|')) || 1;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/* the seed base for one client: same name + industry -> same design; opts.design = "show me another design" */
const designSeed = (d, libKey, opts) => [String(cleanName(d.name) || '').toLowerCase().replace(/\s+/g, ' ').trim(), libKey, +(opts && opts.design) || 0].join('|');

/* Image URLs: Unsplash ids ("1629909613654-28e377c37b09") or Pexels ids ("px:19976556"); data:/http(s) URLs pass through */
function IMG(id, w, h) {
  if (!id) return '';
  if (/^(data:|https?:|\/)/.test(id)) return id;
  if (/^px:/.test(id)) { const n = id.slice(3); return `https://images.pexels.com/photos/${n}/pexels-photo-${n}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? '&h=' + h + '&fit=crop' : ''}`; }
  return UNS(id, w, h);
}
/* canonical photo key from any URL we generate (used by tests and the no-repeat rule) */
const photoKey = u => { const s = String(u || ''); const px = s.match(/pexels-photo-(\d+)/); if (px) return 'px:' + px[1]; const un = s.match(/photo-([0-9a-f]+-[0-9a-f]+)/); if (un) return un[1]; return s.slice(0, 120); };
