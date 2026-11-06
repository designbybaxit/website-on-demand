/* =====================================================================
   STYLE KITS: the LOOK of a site (fonts, palette, radius, spacing, motion).
   A kit never decides the content or the conversion widget; the industry
   recipe does. Fields:
   gf (Google Fonts css2 query), display / sans / italic (font stacks),
   headSerif (headings in the display font?), headWeight, headLs, em
   ('italic' serif accent | 'mark' highlighter | 'color' plain colour),
   radius (px), pal {bg surface text muted brand accent soft accentText warm line [deep]},
   dark, btnFrom ('brand'|'accent'), onBtn (force button text colour),
   motion ('soft'|'rise'|'slide'|'curtain'), density ('compact'|'regular'|'airy').
   ===================================================================== */
const LEGACY_KIT = { clinic: 'mint-clinic', restaurant: 'ember', home: 'navy-yellow', realestate: 'forest-brass', salon: 'plum', law: 'oxblood' };
Object.entries(LEGACY_KIT).forEach(([style, id]) => {
  const S = STYLES[style];
  registerKit(id, { label: S.label, legacyOf: style, gf: S.gf, display: S.display, sans: S.sans, italic: S.italic, headSerif: S.headSerif, headWeight: S.headWeight, headLs: S.headLs, em: S.em, radius: S.radius, pal: S.pal, dark: !!S.dark,
    motion: { clinic: 'soft', restaurant: 'curtain', home: 'slide', realestate: 'rise', salon: 'rise', law: 'soft' }[style], density: 'regular' });
});
const F = {   // font pairs used by more than one kit
  fraunces: 'family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700', dmserif: 'family=DM+Serif+Display:ital@0;1',
};
registerKit('ocean', { label: 'Ocean (Fraunces + DM Sans, deep blue + sky)', gf: F.fraunces + '&family=DM+Sans:opsz,wght@9..40,400..700', display: 'Fraunces, Georgia, serif', sans: '"DM Sans", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.03em', em: 'italic', radius: 18, motion: 'curtain',
  pal: { bg: '#f4f8fc', surface: '#ffffff', text: '#0e2a47', muted: '#46607a', brand: '#0e2a47', accent: '#5fb4ff', soft: '#e3f1ff', accentText: '#1f6fc4', warm: '#ffe1c7', line: '#dbe6f1' } });
registerKit('coral', { label: 'Coral (Playfair Display + Manrope, slate + coral)', gf: 'family=Playfair+Display:ital,wght@0,500..800;1,500..800&family=Manrope:wght@400..800', display: '"Playfair Display", Georgia, serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: true, headWeight: 600, headLs: '-0.02em', em: 'italic', radius: 26, motion: 'rise', density: 'airy',
  pal: { bg: '#fbf7f4', surface: '#ffffff', text: '#23323a', muted: '#5b6970', brand: '#23323a', accent: '#f08a6c', soft: '#fde9e2', accentText: '#c4563a', warm: '#ffd8c2', line: '#ece3dd' } });
registerKit('sage', { label: 'Sage (DM Serif Display + Figtree, forest + sage)', gf: F.dmserif + '&family=Figtree:wght@400..800', display: '"DM Serif Display", Georgia, serif', sans: 'Figtree, system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 14, motion: 'slide',
  pal: { bg: '#f3f6f2', surface: '#ffffff', text: '#1f3a33', muted: '#4e645d', brand: '#1f3a33', accent: '#9fd3b6', soft: '#e2f2e8', accentText: '#2f7a56', warm: '#f3e3c3', line: '#dce6df' } });
registerKit('noir-gold', { label: 'Noir & champagne (Cormorant + Jost, dark)', gf: 'family=Cormorant:ital,wght@0,400..700;1,400..700&family=Jost:wght@300..700', display: 'Cormorant, Georgia, serif', sans: 'Jost, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.01em', em: 'italic', radius: 4, dark: true, motion: 'curtain', density: 'airy',
  pal: { bg: '#100e0d', surface: '#1a1716', text: '#f3ede6', muted: '#b9aea3', brand: '#d4b483', accent: '#d4b483', soft: 'rgba(212,180,131,.12)', accentText: '#e0c28f', warm: '#8c6a43', line: 'rgba(243,237,230,.12)' } });
registerKit('terracotta', { label: 'Terracotta (Fraunces + Karla, cream + clay)', gf: F.fraunces + '&family=Karla:wght@400..800', display: 'Fraunces, Georgia, serif', sans: 'Karla, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.025em', em: 'italic', radius: 30, motion: 'rise', density: 'airy',
  pal: { bg: '#f8f1ea', surface: '#fffaf5', text: '#3d2218', muted: '#75584b', brand: '#5a2e1f', accent: '#d27d56', soft: '#f6e2d6', accentText: '#b0532d', warm: '#f0cdb4', line: '#ead9cc' } });
registerKit('lilac', { label: 'Lilac (Libre Baskerville + Nunito Sans, ink + lilac)', gf: 'family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300..800', display: '"Libre Baskerville", Georgia, serif', sans: '"Nunito Sans", system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 20, motion: 'slide',
  pal: { bg: '#f7f5fb', surface: '#ffffff', text: '#2d2340', muted: '#625a72', brand: '#2d2340', accent: '#b9a3e3', soft: '#eee8fa', accentText: '#6d55a8', warm: '#f6d6e4', line: '#e6e1ef' } });
registerKit('graphite-orange', { label: 'Graphite & safety orange (Space Grotesk)', gf: 'family=Space+Grotesk:wght@400..700', display: '"Space Grotesk", system-ui, sans-serif', sans: '"Space Grotesk", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'mark', radius: 8, motion: 'slide', density: 'compact', onBtn: '#16181d',
  pal: { bg: '#f3f3f1', surface: '#ffffff', text: '#16181d', muted: '#555a63', brand: '#16181d', accent: '#ff7a1a', soft: '#ffe6d6', accentText: '#16181d', warm: '#ff7a1a', line: '#e1e1dc' } });
registerKit('teal-mint', { label: 'Deep teal & mint (Manrope)', gf: 'family=Manrope:wght@400..800', display: 'Manrope, system-ui, sans-serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.04em', em: 'mark', radius: 14, motion: 'rise',
  pal: { bg: '#f2f7f6', surface: '#ffffff', text: '#0b3b3c', muted: '#47605f', brand: '#0b3b3c', accent: '#2ee6a6', soft: '#d9fbef', accentText: '#0b3b3c', warm: '#2ee6a6', line: '#d9e6e3' } });
registerKit('red-condensed', { label: 'Navy & signal red (Barlow Condensed + Barlow)', gf: 'family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800', display: '"Barlow Condensed", system-ui, sans-serif', sans: 'Barlow, system-ui, sans-serif',
  headSerif: true, headWeight: 700, headLs: '-0.01em', em: 'color', radius: 6, motion: 'slide', density: 'compact',
  pal: { bg: '#f5f6f8', surface: '#ffffff', text: '#13233a', muted: '#4d5b70', brand: '#13233a', accent: '#e63946', soft: '#fde3e5', accentText: '#c1121f', warm: '#e63946', line: '#e0e4ea' } });
registerKit('fresh-aqua', { label: 'Fresh aqua (Outfit)', gf: 'family=Outfit:wght@300..800', display: 'Outfit, system-ui, sans-serif', sans: 'Outfit, system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'color', radius: 24, motion: 'rise', density: 'airy',
  pal: { bg: '#f3fbfa', surface: '#ffffff', text: '#0b4f6c', muted: '#4b6d7b', brand: '#0b4f6c', accent: '#4dd9c0', soft: '#dcf7f1', accentText: '#0b6e5e', warm: '#c8f1ff', line: '#d7ece9' } });
registerKit('lemon', { label: 'Lemon fresh (Plus Jakarta Sans, navy + lemon)', gf: 'family=Plus+Jakarta+Sans:wght@400..800', display: '"Plus Jakarta Sans", system-ui, sans-serif', sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.04em', em: 'mark', radius: 18, motion: 'soft',
  pal: { bg: '#fbfaf3', surface: '#ffffff', text: '#1b2a41', muted: '#4f5b6d', brand: '#1b2a41', accent: '#ffe066', soft: '#fff6cc', accentText: '#1b2a41', warm: '#ffe066', line: '#ebe8da' } });
registerKit('lavender', { label: 'Lavender calm (DM Serif Display + DM Sans)', gf: F.dmserif + '&family=DM+Sans:opsz,wght@9..40,400..700', display: '"DM Serif Display", Georgia, serif', sans: '"DM Sans", system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 22, motion: 'curtain', btnFrom: 'brand',
  pal: { bg: '#f6f5ff', surface: '#ffffff', text: '#2a2550', muted: '#5f5a80', brand: '#2a2550', accent: '#8f7cf7', soft: '#ebe7ff', accentText: '#5b46d6', warm: '#ffd9ec', line: '#e3e0f5' } });
registerKit('bistro', { label: 'Bistro (Fraunces + Work Sans, olive + paprika, light)', gf: F.fraunces + '&family=Work+Sans:wght@400..700', display: 'Fraunces, Georgia, serif', sans: '"Work Sans", system-ui, sans-serif',
  headSerif: true, headWeight: 600, headLs: '-0.02em', em: 'italic', radius: 12, motion: 'curtain',
  pal: { bg: '#f6f1e7', surface: '#fffaf1', text: '#2b2a22', muted: '#6a6352', brand: '#2f3e2c', accent: '#c8553d', soft: '#f3e2d3', accentText: '#a83f2a', warm: '#e9b872', line: '#e6dccb' } });
registerKit('cafe-cream', { label: 'Café cream (DM Serif Display + Nunito, coffee + caramel)', gf: F.dmserif + '&family=Nunito:wght@400..800', display: '"DM Serif Display", Georgia, serif', sans: 'Nunito, system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 22, motion: 'rise',
  pal: { bg: '#f5ede3', surface: '#fffaf4', text: '#3b2418', muted: '#6f5646', brand: '#4a2c21', accent: '#d9a05b', soft: '#f3e1c9', accentText: '#9a5f1c', warm: '#e7b77a', line: '#e8d9c6' } });
registerKit('cafe-sage', { label: 'Café sage (Fraunces + Inter, green + honey)', gf: F.fraunces + '&family=Inter:wght@400..700', display: 'Fraunces, Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'italic', radius: 16, motion: 'slide',
  pal: { bg: '#f4f7f2', surface: '#ffffff', text: '#1e3b2f', muted: '#4f6459', brand: '#1e3b2f', accent: '#e3a64f', soft: '#f7ead3', accentText: '#9b6516', warm: '#cfe3c5', line: '#dde6dc' } });
registerKit('noir-dining', { label: 'Noir dining (Playfair Display + Inter, black + brass, dark)', gf: 'family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Inter:wght@400..700', display: '"Playfair Display", Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.015em', em: 'italic', radius: 2, dark: true, motion: 'curtain', density: 'airy',
  pal: { bg: '#0d0d0d', surface: '#171615', text: '#f2efe9', muted: '#b3ab9f', brand: '#c9a227', accent: '#c9a227', soft: 'rgba(201,162,39,.12)', accentText: '#dcb84a', warm: '#7a1f1f', line: 'rgba(242,239,233,.12)' } });
registerKit('studio-ink', { label: 'Studio ink (Syne + Inter, black + vermilion)', gf: 'family=Syne:wght@500..800&family=Inter:wght@400..700', display: 'Syne, system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: true, headWeight: 700, headLs: '-0.03em', em: 'color', radius: 10, motion: 'slide', btnFrom: 'brand',
  pal: { bg: '#f5f4f0', surface: '#ffffff', text: '#111111', muted: '#55534d', brand: '#111111', accent: '#ff5a36', soft: '#ffe4dc', accentText: '#d63d1c', warm: '#ffd36b', line: '#e4e2dc' } });
registerKit('studio-paper', { label: 'Studio paper (Instrument Serif + Inter, warm grey + cobalt)', gf: 'family=Instrument+Serif:ital@0;1&family=Inter:wght@400..700', display: '"Instrument Serif", Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: false, headWeight: 600, headLs: '-0.035em', em: 'italic', radius: 12, motion: 'curtain', density: 'airy', btnFrom: 'brand',
  pal: { bg: '#f6f5f2', surface: '#ffffff', text: '#1a1a1a', muted: '#5d5b57', brand: '#1a1a1a', accent: '#3d5afe', soft: '#e6eaff', accentText: '#2f45c9', warm: '#ffd9c7', line: '#e5e3de' } });
registerKit('volt', { label: 'Volt (Archivo, graphite + lime, dark)', gf: 'family=Archivo:ital,wght@0,400..900;1,400..900', display: 'Archivo, system-ui, sans-serif', sans: 'Archivo, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.04em', em: 'color', radius: 10, dark: true, motion: 'slide', density: 'compact', btnFrom: 'accent',
  pal: { bg: '#0c0d0f', surface: '#15171a', text: '#f2f4f5', muted: '#a4aab0', brand: '#c6ff3d', accent: '#c6ff3d', soft: 'rgba(198,255,61,.12)', accentText: '#c6ff3d', warm: '#c6ff3d', line: 'rgba(255,255,255,.12)' } });

/* per-kit button shapes and the legacy quirks that used to be hard-coded per style */
Object.assign(LIB.kits['navy-yellow'], { btnFrom: 'accent' });
Object.assign(LIB.kits.oxblood, { btnRadius: '4px' });
Object.assign(LIB.kits['red-condensed'], { btnRadius: '6px' });
Object.assign(LIB.kits['noir-dining'], { btnRadius: '2px' });
Object.assign(LIB.kits['noir-gold'], { btnRadius: '2px' });
Object.assign(LIB.kits['graphite-orange'], { btnRadius: '8px', btnFrom: 'accent' });
Object.assign(LIB.kits['teal-mint'], { btnFrom: 'accent' });
Object.assign(LIB.kits.lemon, { btnFrom: 'accent' });
Object.assign(LIB.kits['studio-ink'], { btnRadius: '10px' });

/* ---------- photo shape language + rotating badge (kit traits) ----------
   shape: 'rounded' (default) | 'arch' | 'circle' | 'blob' — applied to the hero photo,
   the why/about photos and the new hero frames (see shapeCSS in 40-select.js).
   badge: true -> a slowly rotating text stamp on the hero / about photo (static with reduced motion). */
Object.assign(LIB.kits.sage, { shape: 'arch' });
Object.assign(LIB.kits.coral, { shape: 'circle', badge: true });
Object.assign(LIB.kits.lilac, { shape: 'blob' });
Object.assign(LIB.kits.terracotta, { shape: 'arch', badge: true });
Object.assign(LIB.kits.lavender, { shape: 'blob', badge: true });
Object.assign(LIB.kits['cafe-cream'], { shape: 'arch', badge: true });
Object.assign(LIB.kits['fresh-aqua'], { shape: 'blob' });
Object.assign(LIB.kits.plum, { shape: 'arch' });

/* ---------- dental kits from the 11-template research (library/references/dental/SYNTHESIS.md §12) ----------
   Serif display + one italic accent word (build standard). dent-clinical-sans is the one all-sans kit
   (Abdul's decision): its accent word gets a highlight underline (em: 'under') instead of italics. */
registerKit('dent-forest-mint', { label: 'Forest & mint (Fraunces + Inter Tight, cream)', gf: F.fraunces + '&family=Inter+Tight:wght@400..700', display: 'Fraunces, Georgia, serif', sans: '"Inter Tight", system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.025em', em: 'italic', radius: 24, motion: 'rise', density: 'airy', shape: 'rounded',
  pal: { bg: '#f6f9f1', surface: '#ffffff', text: '#0e2a20', muted: '#5f6664', brand: '#1a6951', accent: '#3ce7b3', soft: '#e3f3ea', accentText: '#1a6951', warm: '#dff7ec', line: '#dde6da', deep: '#0e2a20' } });
registerKit('dent-ice-arch', { label: 'Ice blue arches (DM Serif Display + DM Sans)', gf: F.dmserif + '&family=DM+Sans:opsz,wght@9..40,400..700', display: '"DM Serif Display", Georgia, serif', sans: '"DM Sans", system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 22, motion: 'soft', shape: 'arch', badge: true,
  pal: { bg: '#f3faff', surface: '#ffffff', text: '#0b2530', muted: '#4f6470', brand: '#0b7f99', accent: '#00cae0', soft: '#dbeefa', accentText: '#0b6f87', warm: '#fff3c2', line: '#d6e8f2', deep: '#0b2530' } });
registerKit('dent-navy-violet', { label: 'Navy & violet (Playfair Display + Red Hat Text)', gf: 'family=Playfair+Display:ital,wght@0,500..900;1,500..900&family=Red+Hat+Text:wght@400..700', display: '"Playfair Display", Georgia, serif', sans: '"Red Hat Text", system-ui, sans-serif',
  headSerif: true, headWeight: 800, headLs: '-0.02em', em: 'italic', radius: 12, motion: 'slide', density: 'regular', btnRadius: '4px', shape: 'rounded',
  pal: { bg: '#ffffff', surface: '#e9eff8', text: '#030541', muted: '#4f5363', brand: '#482afd', accent: '#39c3b9', soft: '#e7f9f5', accentText: '#482afd', warm: '#c6fff1', line: '#dfe5f0', deep: '#030541' } });
registerKit('dent-kids-pastel', { label: 'Kids pastel (Marcellus + Nunito, mint + butter)', gf: 'family=Marcellus&family=Nunito:wght@400..800&family=Fraunces:ital,opsz,wght@1,9..144,400..600', display: 'Marcellus, Georgia, serif', sans: 'Nunito, system-ui, sans-serif', italic: 'Fraunces, Georgia, serif',
  headSerif: true, headWeight: 400, headLs: '-0.01em', em: 'italic', radius: 20, motion: 'rise', btnRadius: '14px', onBtn: '#2c3e50', shape: 'blob', badge: true,
  pal: { bg: '#f3fffb', surface: '#ffffff', text: '#2c3e50', muted: '#546e7a', brand: '#80edc4', accent: '#ffe18b', soft: '#e6faf3', accentText: '#1f7a5c', warm: '#dadeff', line: '#d5efe6', deep: '#2c3e50' } });
registerKit('dent-plum-coral', { label: 'Plum & coral (Cormorant Garamond + Rubik)', gf: 'family=Cormorant+Garamond:ital,wght@0,500..700;1,500..700&family=Rubik:wght@400..700', display: '"Cormorant Garamond", Georgia, serif', sans: 'Rubik, system-ui, sans-serif',
  headSerif: true, headWeight: 600, headLs: '-0.01em', em: 'italic', radius: 10, motion: 'curtain', btnRadius: '6px', shape: 'arch',
  pal: { bg: '#fbf8fc', surface: '#ffffff', text: '#2a1b3d', muted: '#6b6488', brand: '#614379', accent: '#ff8a8b', soft: '#f3ecf7', accentText: '#9b3654', warm: '#ffe0dd', line: '#ebe3f0', deep: '#2a1b3d' } });
registerKit('dent-bento-blue', { label: 'Bento blue (Newsreader + Inter, glass chips)', gf: 'family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Inter:wght@400..700', display: 'Newsreader, Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.025em', em: 'italic', radius: 24, motion: 'rise', shape: 'rounded',
  pal: { bg: '#fafeff', surface: '#ffffff', text: '#1f2937', muted: '#5e656e', brand: '#0a6cdb', accent: '#ffc857', soft: '#e8f6f1', accentText: '#0a5fc0', warm: '#ffc857', line: '#e2e8ee', deep: '#0b2545' } });
registerKit('dent-clinical-sans', { label: 'Clinical sans (DM Sans + Inter, teal + mint underline)', gf: 'family=DM+Sans:opsz,wght@9..40,400..800&family=Inter:wght@400..700', display: '"DM Sans", system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'under', radius: 16, motion: 'soft', shape: 'rounded',
  pal: { bg: '#f5fafa', surface: '#ffffff', text: '#0f2a33', muted: '#4d636a', brand: '#0e5e6f', accent: '#7fe3d0', soft: '#e1f6f2', accentText: '#0e5e6f', warm: '#d4f5ee', line: '#dbe8e8', deep: '#0f2a33' } });

/* ---------- salon, barber, spa, trades and cleaning kits (original; reference moods only) ---------- */
registerKit('salon-editorial', { label: 'Editorial rose (Bodoni Moda + Outfit, script accent)', gf: 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,500..800;1,6..96,500..800&family=Outfit:wght@300..700&family=Great+Vibes', display: '"Bodoni Moda", Georgia, serif', sans: 'Outfit, system-ui, sans-serif', italic: '"Great Vibes", cursive',
  headSerif: true, headWeight: 500, headLs: '-0.02em', em: 'italic', emStyle: 'normal', radius: 28, motion: 'rise', density: 'airy', shape: 'rounded', btnRadius: '999px',
  pal: { bg: '#f6f1ea', surface: '#fffdfb', text: '#2a2420', muted: '#5c514b', brand: '#2c3a32', accent: '#c47d86', soft: '#f3e4e1', accentText: '#8a3d49', warm: '#eadfce', line: '#eadfd4', deep: '#24302a' } });
registerKit('salon-blush', { label: 'Blush photo (Newsreader + Manrope)', gf: 'family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Manrope:wght@400..700', display: 'Newsreader, Georgia, serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.025em', em: 'italic', radius: 22, motion: 'soft', density: 'airy', shape: 'arch',
  pal: { bg: '#fff5f2', surface: '#ffffff', text: '#2c1c1c', muted: '#6a4e4a', brand: '#8d3040', accent: '#e7b1a6', soft: '#fde8e4', accentText: '#8d3040', warm: '#f6d5cc', line: '#f0ddd8', deep: '#3a2224' } });
registerKit('salon-olive', { label: 'Cream and olive (Fraunces + Karla)', gf: F.fraunces + '&family=Karla:wght@400..700', display: 'Fraunces, Georgia, serif', sans: 'Karla, system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.02em', em: 'italic', radius: 18, motion: 'rise', shape: 'arch', badge: true,
  pal: { bg: '#f4f3ea', surface: '#ffffff', text: '#1e2618', muted: '#5a5e4e', brand: '#3d4a2e', accent: '#c6a15a', soft: '#e7efe0', accentText: '#6d5420', warm: '#efe2c4', line: '#e3e0d2', deep: '#2a3324' } });
registerKit('barber-gold', { label: 'Charcoal and gold (Cormorant + Outfit, dark)', gf: 'family=Cormorant:ital,wght@0,500..700;1,500..700&family=Outfit:wght@300..700', display: 'Cormorant, Georgia, serif', sans: 'Outfit, system-ui, sans-serif',
  headSerif: true, headWeight: 600, headLs: '-0.02em', em: 'italic', radius: 8, motion: 'slide', dark: true, btnFrom: 'accent', onBtn: '#1a140c',
  pal: { bg: '#14120f', surface: '#1e1b16', text: '#f7f1e6', muted: '#d2c4ae', brand: '#e6c27a', accent: '#e6c27a', soft: 'rgba(230,194,122,.14)', accentText: '#e6c27a', warm: '#e6c27a', line: 'rgba(247,241,230,.14)', deep: '#0c0b09' } });
registerKit('barber-ink', { label: 'Ink and cream (Barlow Condensed + Inter, dark)', gf: 'family=Barlow+Condensed:wght@600;700&family=Inter:wght@400..700', display: '"Barlow Condensed", system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.03em', em: 'mark', radius: 2, motion: 'slide', dark: true, btnFrom: 'brand', onBtn: '#111111',
  pal: { bg: '#101010', surface: '#1a1a1a', text: '#f5f5f2', muted: '#c8c8c2', brand: '#f5f5f2', accent: '#e0b080', soft: 'rgba(224,176,128,.14)', accentText: '#e0b080', warm: '#e0b080', line: 'rgba(245,245,242,.14)', deep: '#070707' } });
registerKit('barber-amber', { label: 'Dark amber (Fraunces + Source Sans 3)', gf: F.fraunces + '&family=Source+Sans+3:wght@400..700', display: 'Fraunces, Georgia, serif', sans: '"Source Sans 3", system-ui, sans-serif',
  headSerif: true, headWeight: 560, headLs: '-0.02em', em: 'italic', radius: 12, motion: 'rise', dark: true, btnFrom: 'accent', onBtn: '#1a120c',
  pal: { bg: '#1a120c', surface: '#27190f', text: '#f8efe4', muted: '#ddcbb6', brand: '#ffb25b', accent: '#ffb25b', soft: 'rgba(255,178,91,.14)', accentText: '#ffb25b', warm: '#ffb25b', line: 'rgba(248,239,228,.14)', deep: '#100b07' } });
registerKit('spa-stone', { label: 'Warm stone (Cormorant Garamond + Nunito Sans)', gf: 'family=Cormorant+Garamond:ital,wght@0,500..700;1,500..700&family=Nunito+Sans:wght@400..700', display: '"Cormorant Garamond", Georgia, serif', sans: '"Nunito Sans", system-ui, sans-serif',
  headSerif: true, headWeight: 500, headLs: '-0.02em', em: 'italic', radius: 24, motion: 'soft', density: 'airy', shape: 'arch',
  pal: { bg: '#f3f1ec', surface: '#ffffff', text: '#24302c', muted: '#5c6762', brand: '#3d5348', accent: '#c9b8a4', soft: '#e7efe9', accentText: '#3d5348', warm: '#efe4d4', line: '#e4e0d8', deep: '#24302c' } });
registerKit('spa-mist', { label: 'Mist (DM Serif Display + Figtree)', gf: F.dmserif + '&family=Figtree:wght@400..700', display: '"DM Serif Display", Georgia, serif', sans: 'Figtree, system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 26, motion: 'soft', density: 'airy', shape: 'blob',
  pal: { bg: '#f2f6f4', surface: '#ffffff', text: '#1c2b28', muted: '#51615c', brand: '#1f6a5c', accent: '#b7d4c8', soft: '#e5f3ee', accentText: '#1f6a5c', warm: '#dceee6', line: '#d7e6e0', deep: '#16332c' } });
registerKit('spa-linen', { label: 'Linen (Newsreader + Outfit)', gf: 'family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Outfit:wght@300..700', display: 'Newsreader, Georgia, serif', sans: 'Outfit, system-ui, sans-serif',
  headSerif: true, headWeight: 460, headLs: '-0.02em', em: 'italic', radius: 20, motion: 'rise', density: 'airy',
  pal: { bg: '#f7f3ee', surface: '#ffffff', text: '#3a2e28', muted: '#6b574c', brand: '#7a4e3c', accent: '#e4d0c0', soft: '#f4e8df', accentText: '#7a4e3c', warm: '#f0ddd0', line: '#eadfd4', deep: '#3a2e28' } });
registerKit('volt-edge', { label: 'Volt edge (Syne + Manrope, indigo + amber)', gf: 'family=Syne:wght@500..800&family=Manrope:wght@400..700', display: 'Syne, system-ui, sans-serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.04em', em: 'color', radius: 22, motion: 'slide', btnRadius: '12px',
  pal: { bg: '#f4f6fb', surface: '#ffffff', text: '#14182e', muted: '#4a5168', brand: '#1c2260', accent: '#e85d04', soft: '#ffe8d8', accentText: '#c2410c', warm: '#ffd7b8', line: '#e1e5f0', deep: '#141433' } });
registerKit('volt-signal', { label: 'Signal night (Archivo, navy + yellow, dark)', gf: 'family=Archivo:wght@400..800', display: 'Archivo, system-ui, sans-serif', sans: 'Archivo, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.04em', em: 'mark', radius: 16, motion: 'slide', dark: true, btnFrom: 'accent', onBtn: '#14182e',
  pal: { bg: '#0c1224', surface: '#151c33', text: '#f4f7ff', muted: '#c5cce0', brand: '#ffe14a', accent: '#ffe14a', soft: 'rgba(255,225,74,.14)', accentText: '#ffe14a', warm: '#ffe14a', line: 'rgba(244,247,255,.14)', deep: '#070b16' } });
registerKit('volt-night', { label: 'Night cyan (Space Grotesk, dark)', gf: 'family=Space+Grotesk:wght@400..700', display: '"Space Grotesk", system-ui, sans-serif', sans: '"Space Grotesk", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'color', radius: 14, motion: 'slide', dark: true, btnFrom: 'accent', onBtn: '#06231e',
  pal: { bg: '#101418', surface: '#1a2128', text: '#eef3f6', muted: '#c5d0d6', brand: '#3ee0c5', accent: '#3ee0c5', soft: 'rgba(62,224,197,.14)', accentText: '#9af3e2', warm: '#3ee0c5', line: 'rgba(238,243,246,.14)', deep: '#0a0d10' } });
registerKit('volt-paper', { label: 'Paper volt (Outfit, cobalt + amber)', gf: 'family=Outfit:wght@400..800', display: 'Outfit, system-ui, sans-serif', sans: 'Outfit, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.04em', em: 'color', radius: 18, motion: 'rise', btnRadius: '10px',
  pal: { bg: '#f7f8fa', surface: '#ffffff', text: '#12141c', muted: '#4e5563', brand: '#123a8a', accent: '#ffb703', soft: '#fff4d4', accentText: '#8a5a00', warm: '#ffe7a8', line: '#e4e6ec', deep: '#102454' } });
registerKit('plumb-harbor', { label: 'Harbour blue (Plus Jakarta Sans)', gf: 'family=Plus+Jakarta+Sans:wght@400..800', display: '"Plus Jakarta Sans", system-ui, sans-serif', sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.035em', em: 'color', radius: 18, motion: 'soft', btnRadius: '12px',
  pal: { bg: '#f3f7fb', surface: '#ffffff', text: '#0e2744', muted: '#4a6278', brand: '#155e9c', accent: '#2f8fd6', soft: '#e3f0fa', accentText: '#155e9c', warm: '#d5e8f8', line: '#d7e3ee', deep: '#0e2744' } });
registerKit('plumb-trust', { label: 'Trust white (DM Sans)', gf: 'family=DM+Sans:opsz,wght@9..40,400..700', display: '"DM Sans", system-ui, sans-serif', sans: '"DM Sans", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.03em', em: 'color', radius: 14, motion: 'soft',
  pal: { bg: '#ffffff', surface: '#f4f7fb', text: '#0b1f3a', muted: '#4a5b75', brand: '#0b3a6e', accent: '#3d8bfd', soft: '#e7f0fb', accentText: '#0b3a6e', warm: '#d6e6fb', line: '#dce4ef', deep: '#0b1f3a' } });
registerKit('plumb-navy', { label: 'Friendly navy (Fraunces + Source Sans 3)', gf: F.fraunces + '&family=Source+Sans+3:wght@400..700', display: 'Fraunces, Georgia, serif', sans: '"Source Sans 3", system-ui, sans-serif',
  headSerif: true, headWeight: 560, headLs: '-0.02em', em: 'italic', radius: 16, motion: 'rise',
  pal: { bg: '#f7f5f2', surface: '#ffffff', text: '#10243a', muted: '#4e5d6e', brand: '#163a5f', accent: '#5aa6e0', soft: '#e7f1f8', accentText: '#0e4f86', warm: '#d7e9f6', line: '#e3ddd4', deep: '#10243a' } });
registerKit('plumb-sky', { label: 'Sky and amber (Manrope)', gf: 'family=Manrope:wght@400..800', display: 'Manrope, system-ui, sans-serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.035em', em: 'color', radius: 20, motion: 'soft',
  pal: { bg: '#eef6fb', surface: '#ffffff', text: '#0c2438', muted: '#3f5a6e', brand: '#0e6fa8', accent: '#f0b429', soft: '#fff4d6', accentText: '#8a5a10', warm: '#ffe7a8', line: '#d5e4ef', deep: '#0c2438' } });
registerKit('clean-air', { label: 'Airy sky (Outfit)', gf: 'family=Outfit:wght@300..800', display: 'Outfit, system-ui, sans-serif', sans: 'Outfit, system-ui, sans-serif',
  headSerif: false, headWeight: 720, headLs: '-0.04em', em: 'color', radius: 24, motion: 'rise', density: 'airy',
  pal: { bg: '#f3f8ff', surface: '#ffffff', text: '#1a2332', muted: '#516075', brand: '#1d4ed8', accent: '#e8b931', soft: '#fff6d4', accentText: '#7a5b10', warm: '#ffe9a8', line: '#dde6f2', deep: '#16315f' } });
registerKit('clean-linen', { label: 'Linen blue (Plus Jakarta Sans)', gf: 'family=Plus+Jakarta+Sans:wght@400..800', display: '"Plus Jakarta Sans", system-ui, sans-serif', sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.03em', em: 'color', radius: 22, motion: 'soft', density: 'airy',
  pal: { bg: '#f7fbff', surface: '#ffffff', text: '#1c2836', muted: '#516070', brand: '#0f6e8c', accent: '#9fd3e0', soft: '#e5f6fa', accentText: '#0f6e8c', warm: '#d4eef4', line: '#d7e6ee', deep: '#123848' } });
registerKit('clean-office', { label: 'Office slate (Manrope)', gf: 'family=Manrope:wght@400..800', display: 'Manrope, system-ui, sans-serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.035em', em: 'color', radius: 12, motion: 'slide', density: 'regular',
  pal: { bg: '#f4f6f8', surface: '#ffffff', text: '#1b2430', muted: '#516070', brand: '#1f3a5f', accent: '#1f8a84', soft: '#e5f5f4', accentText: '#0f6e68', warm: '#d5eeec', line: '#dce2e8', deep: '#1b2430' } });
registerKit('clean-sun', { label: 'Sunlit (Nunito)', gf: 'family=Nunito:wght@400..800', display: 'Nunito, system-ui, sans-serif', sans: 'Nunito, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.03em', em: 'color', radius: 26, motion: 'rise', density: 'airy',
  pal: { bg: '#f8faf6', surface: '#ffffff', text: '#1c2418', muted: '#556352', brand: '#2f6b3a', accent: '#f2c14e', soft: '#fff6d8', accentText: '#6f5410', warm: '#ffe7a3', line: '#e3eadc', deep: '#1c3320' } });
registerKit('wash-industrial', { label: 'Industrial (Barlow Condensed + Barlow)', gf: 'family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@600;700;800', display: '"Barlow Condensed", system-ui, sans-serif', sans: 'Barlow, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.03em', em: 'mark', radius: 4, motion: 'slide', btnRadius: '4px',
  pal: { bg: '#f2f3f1', surface: '#ffffff', text: '#1a1c1a', muted: '#4e5550', brand: '#1a1c1a', accent: '#d6e000', soft: '#f4f8c8', accentText: '#4d5c00', warm: '#eef3b0', line: '#dddfd8', deep: '#121412' } });
registerKit('wash-concrete', { label: 'Concrete (Archivo)', gf: 'family=Archivo:wght@400..800', display: 'Archivo, system-ui, sans-serif', sans: 'Archivo, system-ui, sans-serif',
  headSerif: false, headWeight: 800, headLs: '-0.04em', em: 'color', radius: 6, motion: 'slide', btnRadius: '4px',
  pal: { bg: '#eceae6', surface: '#ffffff', text: '#1e2428', muted: '#4e585e', brand: '#24343c', accent: '#1a8a9a', soft: '#e3f3f5', accentText: '#0e6e7c', warm: '#cfe8ec', line: '#ddd9d2', deep: '#1e2428' } });
registerKit('wash-signal', { label: 'Signal wash (Space Grotesk, dark)', gf: 'family=Space+Grotesk:wght@400..700', display: '"Space Grotesk", system-ui, sans-serif', sans: '"Space Grotesk", system-ui, sans-serif',
  headSerif: false, headWeight: 700, headLs: '-0.035em', em: 'mark', radius: 8, motion: 'slide', dark: true, btnFrom: 'accent', onBtn: '#142006',
  pal: { bg: '#14181b', surface: '#1e2529', text: '#f3f6f4', muted: '#c9d2cc', brand: '#c6f135', accent: '#c6f135', soft: 'rgba(198,241,53,.14)', accentText: '#d4ff8a', warm: '#c6f135', line: 'rgba(243,246,244,.14)', deep: '#0c0f11' } });
registerKit('wash-slate', { label: 'Slate wash (Manrope)', gf: 'family=Manrope:wght@400..800', display: 'Manrope, system-ui, sans-serif', sans: 'Manrope, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.035em', em: 'color', radius: 10, motion: 'slide', btnRadius: '6px',
  pal: { bg: '#e7eaee', surface: '#ffffff', text: '#161c22', muted: '#45515c', brand: '#1c3d55', accent: '#e07a2f', soft: '#fde8d8', accentText: '#9a4510', warm: '#f8d7c0', line: '#d5dbe2', deep: '#161c22' } });
registerKit('local-paper', { label: 'Local paper (Instrument Serif + Inter)', gf: 'family=Instrument+Serif:ital@0;1&family=Inter:wght@400..700', display: '"Instrument Serif", Georgia, serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', radius: 16, motion: 'rise',
  pal: { bg: '#f7f4ef', surface: '#ffffff', text: '#231e1a', muted: '#5c534c', brand: '#1e3a8a', accent: '#c9842a', soft: '#fff1dc', accentText: '#8a4b12', warm: '#f3ddb8', line: '#e6e0d6', deep: '#1e3a8a' } });
registerKit('local-ink', { label: 'Local ink (Syne + Inter)', gf: 'family=Syne:wght@500..800&family=Inter:wght@400..700', display: 'Syne, system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif',
  headSerif: false, headWeight: 750, headLs: '-0.04em', em: 'color', radius: 12, motion: 'slide',
  pal: { bg: '#f6f6f4', surface: '#ffffff', text: '#161616', muted: '#555555', brand: '#161616', accent: '#e23d2b', soft: '#fde8e5', accentText: '#b42318', warm: '#f8d2cc', line: '#e4e4e0', deep: '#161616' } });
registerKit('local-stone', { label: 'Local stone (Fraunces + Source Sans 3)', gf: F.fraunces + '&family=Source+Sans+3:wght@400..700', display: 'Fraunces, Georgia, serif', sans: '"Source Sans 3", system-ui, sans-serif',
  headSerif: true, headWeight: 520, headLs: '-0.02em', em: 'italic', radius: 18, motion: 'soft',
  pal: { bg: '#f3f1ec', surface: '#ffffff', text: '#2a2824', muted: '#5e5952', brand: '#5c4a3a', accent: '#d7b48a', soft: '#f6ecdf', accentText: '#6b4e2e', warm: '#efe0cc', line: '#e5dfd4', deep: '#3a3228' } });
