/* =====================================================================
   INDUSTRY RECIPES: which kits, section variants and section orders an
   industry may use. profiles = PROFILES keys (b1b-industries.js) it covers.
   A section key missing from `variants` may use every registered variant
   whose fits(M) allows it. Orders are gated afterwards by what the client
   actually gave us (no gallery without photos, no calc outside property…).
   ===================================================================== */
registerIndustry('dental', {
  profiles: ['dental'], label: 'Dental',
  kits: ['mint-clinic', 'ocean', 'coral', 'sage',
    // from the 11-template research (SYNTHESIS.md §12); dent-clinical-sans is the one all-sans kit
    'dent-forest-mint', 'dent-ice-arch', 'dent-navy-violet', 'dent-kids-pastel', 'dent-plum-coral', 'dent-bento-blue', 'dent-clinical-sans'],
  hero: ['split', 'fullbleed', 'mosaic', 'editorial', 'panel', 'arch', 'bento', 'framed', 'blob', 'booking', 'field'],
  orders: [
    ['hero', 'stats', 'services', 'why', 'process', 'reviews', 'beforeafter', 'gallery', 'insurance', 'book', 'faq'],
    ['hero', 'services', 'about', 'stats', 'reviews', 'process', 'gallery', 'insurance', 'cta', 'book', 'faq'],
    ['hero', 'why', 'services', 'gallery', 'beforeafter', 'reviews', 'stats', 'faq', 'book'],
    ['hero', 'services', 'stats', 'about', 'process', 'reviews', 'insurance', 'faq', 'cta', 'book'],
    // the six research orders (SYNTHESIS.md §13); sections without client data drop out
    ['hero', 'infobar', 'services', 'why', 'stats', 'process', 'reviews', 'insurance', 'faq', 'book'],
    ['hero', 'infobar', 'stats', 'services', 'cta', 'why', 'reviews', 'faq', 'book'],
    ['hero', 'services', 'beforeafter', 'about', 'reviews', 'process', 'cta', 'faq', 'book'],
    ['hero', 'stats', 'about', 'services', 'reviews', 'beforeafter', 'insurance', 'book', 'faq'],
    ['hero', 'about', 'ribbon', 'services', 'reviews', 'faq', 'book'],
    ['hero', 'infobar', 'services', 'why', 'insurance', 'process', 'reviews', 'faq', 'cta', 'book'],
  ],
});
registerIndustry('salon', {
  profiles: ['salon'], label: 'Hair & beauty salon',
  kits: ['salon-editorial', 'salon-blush', 'salon-olive', 'plum', 'lilac'],
  hero: ['dual', 'editorial', 'arch', 'mosaic', 'booking', 'framed'],
  orders: [
    ['hero', 'infobar', 'menu', 'why', 'gallery', 'process', 'reviews', 'book', 'faq'],
    ['hero', 'ribbon', 'menu', 'gallery', 'about', 'reviews', 'cta', 'book', 'faq'],
    ['hero', 'menu', 'beforeafter', 'why', 'gallery', 'reviews', 'process', 'book', 'faq'],
    ['hero', 'gallery', 'menu', 'about', 'reviews', 'faq', 'book'],
    ['hero', 'infobar', 'about', 'menu', 'process', 'gallery', 'reviews', 'cta', 'book'],
  ],
});
registerIndustry('barber', {
  profiles: ['barber'], label: 'Barbers',
  kits: ['barber-gold', 'barber-ink', 'barber-amber', 'noir-gold'],
  hero: ['craft', 'fullbleed', 'panel', 'mosaic', 'quote'],
  orders: [
    ['hero', 'infobar', 'menu', 'why', 'gallery', 'reviews', 'process', 'book', 'faq'],
    ['hero', 'menu', 'gallery', 'about', 'reviews', 'cta', 'book', 'faq'],
    ['hero', 'ribbon', 'menu', 'process', 'reviews', 'gallery', 'faq', 'book'],
    ['hero', 'menu', 'why', 'gallery', 'reviews', 'book', 'faq'],
  ],
});
registerIndustry('spa', {
  profiles: ['spa'], label: 'Spa & skincare',
  kits: ['spa-stone', 'spa-mist', 'spa-linen', 'lavender'],
  hero: ['editorial', 'split', 'blob', 'booking', 'framed', 'arch'],
  orders: [
    ['hero', 'menu', 'why', 'about', 'gallery', 'reviews', 'process', 'book', 'faq'],
    ['hero', 'infobar', 'about', 'menu', 'gallery', 'reviews', 'cta', 'book', 'faq'],
    ['hero', 'menu', 'beforeafter', 'process', 'reviews', 'gallery', 'faq', 'book'],
    ['hero', 'ribbon', 'menu', 'why', 'reviews', 'gallery', 'book', 'faq'],
  ],
});
registerIndustry('plumbing', {
  profiles: ['plumbing'], label: 'Plumbing & heating',
  kits: ['plumb-harbor', 'plumb-trust', 'plumb-navy', 'plumb-sky'],
  hero: ['estimate', 'quote', 'panel', 'fullbleed', 'bento', 'split'],
  orders: [
    ['hero', 'infobar', 'services', 'why', 'process', 'reviews', 'gallery', 'area', 'book', 'faq'],
    ['hero', 'services', 'stats', 'why', 'gallery', 'reviews', 'area', 'cta', 'book', 'faq'],
    ['hero', 'infobar', 'services', 'about', 'process', 'beforeafter', 'reviews', 'area', 'faq', 'book'],
    ['hero', 'services', 'why', 'gallery', 'reviews', 'process', 'area', 'book', 'faq'],
    ['hero', 'ribbon', 'services', 'process', 'why', 'reviews', 'area', 'cta', 'book'],
  ],
});
registerIndustry('electric', {
  profiles: ['electric'], label: 'Electricians',
  kits: ['volt-edge', 'volt-signal', 'volt-night', 'volt-paper'],
  hero: ['power', 'fullbleed', 'panel', 'bento', 'field', 'mosaic'],
  orders: [
    ['hero', 'infobar', 'services', 'why', 'process', 'gallery', 'reviews', 'area', 'book', 'faq'],
    ['hero', 'services', 'stats', 'why', 'reviews', 'gallery', 'area', 'cta', 'book', 'faq'],
    ['hero', 'services', 'process', 'about', 'gallery', 'reviews', 'area', 'faq', 'book'],
    ['hero', 'infobar', 'services', 'why', 'gallery', 'beforeafter', 'reviews', 'area', 'book', 'faq'],
    ['hero', 'ribbon', 'services', 'why', 'process', 'reviews', 'cta', 'area', 'book', 'faq'],
  ],
});
registerIndustry('trades', {
  profiles: ['roofing', 'build'], label: 'Roofing & building',
  kits: ['navy-yellow', 'graphite-orange', 'teal-mint', 'red-condensed'],
  hero: ['quote', 'fullbleed', 'panel', 'mosaic', 'bento', 'field'],
  orders: [
    ['hero', 'ribbon', 'services', 'stats', 'why', 'process', 'reviews', 'gallery', 'area', 'book', 'faq'],
    ['hero', 'services', 'why', 'process', 'gallery', 'reviews', 'area', 'cta', 'book', 'faq'],
    ['hero', 'stats', 'services', 'about', 'reviews', 'gallery', 'area', 'faq', 'book'],
    ['hero', 'services', 'process', 'why', 'reviews', 'area', 'gallery', 'cta', 'book', 'faq'],
    ['hero', 'infobar', 'services', 'why', 'beforeafter', 'reviews', 'process', 'area', 'book', 'faq'],
    ['hero', 'infobar', 'stats', 'services', 'gallery', 'reviews', 'area', 'cta', 'book', 'faq'],
  ],
});
registerIndustry('cleaning', {
  profiles: ['cleaning'], label: 'Home & office cleaning',
  kits: ['clean-air', 'clean-linen', 'clean-office', 'clean-sun', 'fresh-aqua'],
  hero: ['airy', 'quote', 'mosaic', 'editorial', 'bento', 'panel'],
  orders: [
    ['hero', 'services', 'why', 'process', 'reviews', 'gallery', 'area', 'book', 'faq'],
    ['hero', 'ribbon', 'services', 'about', 'gallery', 'reviews', 'cta', 'area', 'book', 'faq'],
    ['hero', 'infobar', 'services', 'process', 'why', 'beforeafter', 'reviews', 'gallery', 'area', 'faq', 'book'],
    ['hero', 'services', 'gallery', 'why', 'reviews', 'process', 'area', 'book', 'faq'],
  ],
});
registerIndustry('pressure', {
  profiles: ['pressure'], label: 'Exterior pressure washing',
  kits: ['wash-industrial', 'wash-concrete', 'wash-signal', 'wash-slate'],
  hero: ['industrial', 'fullbleed', 'panel', 'quote', 'mosaic'],
  orders: [
    ['hero', 'infobar', 'services', 'why', 'process', 'gallery', 'reviews', 'area', 'book', 'faq'],
    ['hero', 'services', 'process', 'gallery', 'why', 'reviews', 'area', 'cta', 'book', 'faq'],
    ['hero', 'ribbon', 'services', 'about', 'gallery', 'reviews', 'area', 'faq', 'book'],
    ['hero', 'services', 'why', 'gallery', 'process', 'reviews', 'area', 'book', 'faq'],
  ],
});
registerIndustry('local', {
  profiles: ['local'], label: 'Local business',
  kits: ['local-paper', 'local-ink', 'local-stone'],
  hero: ['split', 'editorial', 'panel', 'mosaic', 'framed'],
  orders: [
    ['hero', 'services', 'why', 'about', 'process', 'gallery', 'reviews', 'faq', 'book'],
    ['hero', 'about', 'services', 'gallery', 'why', 'cta', 'book', 'faq'],
    ['hero', 'services', 'process', 'reviews', 'gallery', 'faq', 'book'],
    ['hero', 'ribbon', 'services', 'why', 'gallery', 'process', 'cta', 'book', 'faq'],
  ],
});
registerIndustry('restaurant', {
  profiles: ['restaurant'], label: 'Restaurants',
  kits: ['ember', 'bistro', 'noir-dining', 'cafe-cream'],
  hero: ['cinema', 'fullbleed', 'editorial', 'mosaic', 'panel'],
  orders: [
    ['hero', 'ribbon', 'why', 'menu', 'gallery', 'reviews', 'process', 'book', 'faq'],
    ['hero', 'menu', 'about', 'gallery', 'reviews', 'cta', 'book', 'faq'],
    ['hero', 'about', 'menu', 'reviews', 'gallery', 'faq', 'book'],
  ],
});
registerIndustry('cafe', {
  profiles: ['cafe', 'bakery'], label: 'Cafés & bakeries',
  kits: ['cafe-cream', 'bistro', 'cafe-sage'],
  hero: ['mosaic', 'editorial', 'fullbleed', 'panel', 'cinema'],
  orders: [
    ['hero', 'ribbon', 'menu', 'about', 'gallery', 'reviews', 'book', 'faq'],
    ['hero', 'about', 'menu', 'gallery', 'reviews', 'faq', 'book'],
    ['hero', 'menu', 'why', 'gallery', 'reviews', 'cta', 'book', 'faq'],
  ],
});
/* Fallbacks: every other profile keeps its native style's order, with kits by family */
const FALLBACK_KITS = {
  creative: ['studio-ink', 'studio-paper', 'navy-yellow'], tech: ['mint-clinic', 'ocean', 'studio-paper'], events: ['plum', 'terracotta', 'noir-gold'],
  pro: ['oxblood', 'ocean', 'sage'], fitness: ['volt', 'graphite-orange', 'navy-yellow'], wellness: ['sage', 'lilac', 'mint-clinic'], health: ['mint-clinic', 'ocean', 'sage'],
  auto: ['navy-yellow', 'red-condensed', 'graphite-orange'], trade: ['navy-yellow', 'teal-mint', 'graphite-orange'], education: ['mint-clinic', 'lemon', 'ocean'],
  pets: ['mint-clinic', 'coral', 'lemon'], retail: ['plum', 'terracotta', 'studio-paper'], property: ['forest-brass', 'ocean', 'sage'], legal: ['oxblood', 'ocean', 'forest-brass'],
  food: ['ember', 'bistro'], beauty: ['plum', 'lilac'], dental: ['mint-clinic', 'ocean'],
};
const FALLBACK_HERO = { creative: ['split', 'editorial', 'mosaic'], tech: ['split', 'panel', 'mosaic'], events: ['arch', 'editorial', 'fullbleed'], pro: ['split', 'panel', 'editorial'],
  fitness: ['fullbleed', 'panel', 'split'], wellness: ['split', 'mosaic', 'editorial'], health: ['split', 'fullbleed', 'panel'], auto: ['quote', 'fullbleed', 'panel'], trade: ['quote', 'fullbleed', 'panel'],
  education: ['split', 'mosaic', 'panel'], pets: ['split', 'mosaic', 'fullbleed'], retail: ['arch', 'mosaic', 'editorial'], property: ['search'], legal: ['form'] };
function industryFor(prof, key) {
  const hit = Object.values(LIB.industries).find(r => r.profiles.includes(prof.k));
  if (hit) return hit;
  const S = STYLES[key];
  return { id: 'fallback-' + prof.fam, label: prof.label, fallback: true, kits: FALLBACK_KITS[prof.fam] || [LEGACY_KIT[key]], hero: FALLBACK_HERO[prof.fam] || [S.hero], orders: [S.order] };
}
