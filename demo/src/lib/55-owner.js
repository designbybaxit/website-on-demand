/* =====================================================================
   OWNER-WORDED HERO (Round 1, item 4). The headline and lead are written from what the owner typed:
   key phrases from the description ("charcoal grill", "rooftop terrace", "open till 2 AM"), the hours,
   the town and the services. Nothing is added that was not typed. generateWithAI() returns null in
   this build (preview and production alike), so this is the path every site uses.
   ===================================================================== */
const OWN_STOP = new Set('a an the and or of in on at to for with by from our we us you your is are be it its this that who which very really just also all every each more most so as off up out into over well here there them they their than then has have had been was were will can do does done get got make made'.split(' '));
const OWN_GENERIC = new Set('friendly business company service services quality best great good professional team local people customers clients high reliable trusted amazing excellent affordable cheap top leading lovely nice welcoming warm happy experienced expert experts passionate dedicated committed offering offer provide providing based run city town area centre center station'.split(' '));
const ownCap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
/* prose form of a typed item: "seekh Kebab" -> "seekh kebab" (keeps acronyms like NHS / BBQ / AC) */
const OWN_PROPER = /^(?:pakistani|indian|italian|thai|chinese|japanese|turkish|lebanese|mexican|greek|french|spanish|american|british|english|korean|vietnamese|persian|afghan|bangladeshi|nepalese|caribbean|jamaican|portuguese|moroccan|ethiopian|nigerian|punjabi|lahori|kashmiri|neapolitan|sicilian|tuscan|cajun|hawaiian|swedish|irish|scottish|welsh|nhs|i)$/i;
const ownProse = s => String(s || '').split(/\s+/).map(w => /^[A-Z0-9&\/-]{2,}$/.test(w) ? w : OWN_PROPER.test(w) ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join(' ');
function ownLateHours(d) {
  // "Mon-Sun 5pm-2am" / "till 2 AM" -> "open till 2 AM" (only an early-morning close counts as late)
  const txt = String(d.hours || '') + ' ' + String(d.about || '');
  const m = txt.match(/(?:-|–|to|till|until)\s*(1[0-2]|[1-4])(?::(\d\d))?\s*(am|a\.m\.)/i);
  if (m) return `open till ${m[1]}${m[2] && m[2] !== '00' ? ':' + m[2] : ''} AM`;
  if (/\b24\s*\/\s*7\b|24 hours|24-hour/i.test(txt)) return 'open 24/7';
  return '';
}
function ownerPhrases(d) {
  const about = String(d.about || '').replace(/\(.*?made-up.*?\)/ig, '');
  const name = cleanName(d.name).toLowerCase();
  const out = [];
  splitSentences(about).forEach((s, si) => {
    s.replace(/[.!?]+$/, '')
      .split(/\s*(?:(?<!\d)[,;:]|[,;:](?!\d)|[()])\s*|\s+[–—-]\s+|\s+(?:on|in|at) (?:a|an|the|our) (?=\w)|\s+with (?=\w)|\s+(?:serving|offering|covering|specialising in|specializing in|plus|across|throughout|near|around)\s+|\s+(?=in (?:north|south|east|west|central|the heart of|[A-Z])\b)|\s+and (?=(?:open|we|our)\b)/i)
      .forEach((c, ci) => {
        let t = c.trim();
        for (let i = 0; i < 4; i++) t = t.replace(/^(?:and|but|so|also|here at [\w&' ]+|we(?:'re| are|'ve been| have been)?|i(?:'m| am)?|it's|this is|our|my|a|an|the|is|are|we|proudly|offer|offers|serve|serves|do|does|provide|provides|specialise in|specialize in|have|has)\s+/i, '');
        t = t.replace(/\s+(?:every|each) (?:day|night|week)$/i, '').trim();
        const words = t.split(/\s+/).filter(Boolean);
        if (!words.length || words.length > 8 || t.length < 4) return;
        if (name && t.toLowerCase() === name) return;
        const content = words.filter(w => { const x = w.toLowerCase().replace(/[^a-z0-9/]/g, ''); return x && !OWN_STOP.has(x) && !OWN_GENERIC.has(x); });
        if (!content.length) return;
        const score = content.length + (/\d/.test(t) ? 2 : 0) - si * 0.3 - ci * 0.1;
        out.push({ t, score, si, ci, content });
      });
  });
  const seen = new Set();
  return out.filter(p => { const k = p.t.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}
/* -> { h1Pool:[…], lead } built only from typed details; h1Pool is empty when nothing usable was typed */
function ownerHero(d, services, place, opts) {
  const P = ownerPhrases(d);
  const late = ownLateHours(d);
  // Only worth building the headline from the description when it says something specific about THIS business:
  // "A dental practice in town with a friendly team" (trade words + filler only) falls back to the varied stock lines.
  const tradeRe = opts && opts.tradeRe, filler = /^(practice|firm|clinic|studio|shop|agency|company|business|town|towns|city|cities|nearby|area|areas|team|staff|place|surgery|service|services|work|works|job|jobs)$/i;
  const distinct = p => (p.content || []).some(w => { const x = w.toLowerCase().replace(/[^a-z0-9/]/g, ''); return x && !filler.test(x) && !(tradeRe && tradeRe.test(x)); }) || /\d/.test(p.t);
  if (!P.some(p => p.si !== 9 && distinct(p))) {
    const sents0 = splitSentences(String(d.about || '').replace(/\(.*?made-up.*?\)/ig, '')).map(s => s.trim()).filter(Boolean);
    return { h1Pool: [], lead: sents0.slice(0, 2).join(' ') };
  }
  if (late && !P.some(p => /\b(open|till|until|24\/7)\b/i.test(p.t))) P.push({ t: late, score: 2.5, si: 9, ci: 0 });
  const best = P.slice().sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => a.si - b.si || a.ci - b.ci).map((p, i) => {
    // Round 1 item 6: keep the owner's capitals when the phrase is a proper name ("Gas Safe registered", "NHS and private")
    const w = p.t.split(/\s+/);
    if (p.ci > 0 || OWN_PROPER.test(w[0]) || /^\p{Lu}{2,}/u.test(w[0]) || (w[1] && /^\p{Lu}/u.test(w[1]))) return p.t;   // mid-sentence capitals were typed on purpose
    return p.t.replace(/^[A-Z][a-z]/, m => m.toLowerCase());
  });
  const svc = services.map(s => titleCase(s.name.replace(/^[^:]{2,24}:\s*/, ''))).filter(Boolean);
  const pool = [];
  const fit = s => s.replace(/\*/g, '').length <= 80;
  if (best.length >= 3) pool.push(`${ownCap(best[0])}, *${best[1]},* ${best[2]}.`);
  if (best.length >= 2) pool.push(`${ownCap(best[0])}, *${best[1]}.*`);
  if (best.length && place) pool.push(`${ownCap(best[0])} in *${place}.*`);
  if (svc.length >= 2) pool.push(`${ownCap(listJoin(svc.slice(0, 3)))}${place ? ` in *${place}.*` : '.'}`.replace(/^([^*]+)\.$/, (m, a) => a.replace(/(\S+)$/, '*$1.*')));
  const h1Pool = pool.filter(fit);
  // lead: the owner's own description (first two sentences, trimmed), never a stock line
  const sents = splitSentences(String(d.about || '').replace(/\(.*?made-up.*?\)/ig, '')).map(s => s.trim()).filter(Boolean);
  let lead = '';
  for (const s of sents) { const n = (lead ? lead + ' ' : '') + s.replace(/([^.!?])$/, '$1.'); if (n.length > 190 && lead) break; lead = n; if (lead.length > 120) break; }
  return { h1Pool, lead };
}
