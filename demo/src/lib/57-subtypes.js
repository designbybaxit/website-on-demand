/* =====================================================================
   PHOTO SUB-TYPES (Round 1, item 3). When the owner's own words (name, trade, description, menu)
   signal a cuisine or sub-trade, that set replaces the generic one, so a Pakistani grill gets karahi,
   kebabs and naan, not pasta. Menu / service item photos are matched by keyword only (lib/40-select).
   All ids: real Pexels photo pages found by web search, fetched at 360 and 1600 wide (HTTP 200
   image/jpeg) and checked by eye on a contact sheet on 10 Nov 2026. Rejected: px:16736229 (not desi).
   ===================================================================== */
const SUBTYPES = {
  restaurant: [
    { k: 'desi', rx: /pakistan|indian|\bdesi\b|karahi|kadai|tikka|kebab|kabab|biryani|tandoor|\bnaan\b|curry|lahor|punjab|balti|\bbbq\b|barbecue|charcoal|seekh|nihari|haleem|tandoori|masala|halal grill/ig,
      heroes: ['px:38762914', 'px:37058630', 'px:35610087', 'px:6522658', 'px:9562310', 'px:28180797'],
      pool: [['px:6522658', 'seekh kebab kebabs naan grill'], ['px:5250389', 'kebab kebabs skewers grill tomatoes'], ['px:28180797', 'kebab skewers grill chef charcoal'], ['px:37080264', 'bbq skewers grill charcoal tikka'],
        ['px:37058630', 'charcoal grill bbq skewers kebab'], ['px:35610087', 'grill charcoal bbq street skewers'], ['px:23708587', 'street food grill chef kitchen'], ['px:38762914', 'bbq platter mixed grill kebab tikka'],
        ['px:36202022', 'karahi kadai curry chicken'], ['px:6522616', 'chicken tikka'], ['px:30021858', 'chicken tikka rice'], ['px:31771054', 'tandoori chicken'], ['px:9609832', 'tandoori chicken chutney'],
        ['px:36895285', 'tandoori chicken leg'], ['px:32558917', 'naan tandoor bread roti'], ['px:30666774', 'naan bread garlic'], ['px:20446413', 'naan curry daal'], ['px:9562310', 'tandoor naan chef kitchen bread'],
        ['px:5410410', 'biryani rice'], ['px:37309267', 'biryani rice chicken'], ['px:35267287', 'biryani lamb mutton rice raita'], ['px:34341985', 'biryani rice vegetable']] },
    { k: 'italian', rx: /italian|pizza|pizzeria|pasta|trattoria|spaghetti|carbonara|lasagn|risotto|margherita|neapolitan|calzone/ig,
      heroes: ['px:30120984', 'px:36430040', 'px:32872507', 'px:4431588'],
      pool: [['px:30120984', 'pizza oven chef wood fired kitchen'], ['px:36430040', 'pizza oven wood fired'], ['px:32872507', 'pizza neapolitan oven margherita'], ['px:30343606', 'pizza margherita slice'],
        ['px:35760004', 'pizza margherita slice'], ['px:6940996', 'pizza margherita sharing'], ['px:4431588', 'pasta spaghetti garlic'], ['px:11653569', 'pasta spaghetti tomato pomodoro'],
        ['px:29039082', 'pasta spaghetti carbonara'], ['px:39345361', 'pasta carbonara']] },
    { k: 'burger', rx: /burger|fast food|\bfries\b|\bdiner\b|smash|cheeseburger|hot dog|wings/ig,
      heroes: ['px:29349611', 'px:33858065', 'px:2725744', 'px:19055025'],
      pool: [['px:29349611', 'burger burgers grill chef kitchen'], ['px:31023375', 'burger burgers grill patties'], ['px:33858065', 'burger cheeseburger grill flame'], ['px:12031043', 'burger cheeseburger fries'],
        ['px:2725744', 'burger cheeseburger fries chips'], ['px:19345995', 'burger cheeseburger fries'], ['px:19055025', 'burger cheeseburger fries'], ['px:22119675', 'burger fries chips']] },
    { k: 'asian', rx: /sushi|ramen|japanese|\basian\b|dim sum|dumpling|noodle|chinese|\bthai\b|korean|vietnam|\bpho\b|\bbao\b|nigiri|maki|gyoza/ig,
      heroes: ['px:8951178', 'px:8951045', 'px:36772661', 'px:39999752'],
      pool: [['px:8951045', 'sushi chef kitchen'], ['px:8951178', 'sushi chef platter'], ['px:8951083', 'sushi chef roll maki'], ['px:36772661', 'sushi platter nigiri salmon maki'],
        ['px:10296398', 'sushi nigiri salmon'], ['px:33712134', 'sushi nigiri'], ['px:4353085', 'sushi maki temaki nigiri'], ['px:35981914', 'sushi nigiri roe'],
        ['px:40000084', 'ramen noodles'], ['px:39999752', 'ramen noodles broth'], ['px:31263150', 'ramen noodles egg'],
        ['px:32393806', 'dim sum dumplings gyoza'], ['px:16845585', 'dumplings dim sum'], ['px:32393811', 'dim sum shumai dumplings']] },
  ],
};
/* the sub-type a business belongs to, from its own words (most keyword hits wins), else null */
function subtypeFor(prof, blob) {
  const L = SUBTYPES[prof.k]; if (!L) return null;
  let best = null, n = 0;
  L.forEach(s => { const c = (String(blob).match(s.rx) || []).length; if (c > n) { n = c; best = s; } });
  return best;
}
// generic restaurant shots that are not about one cuisine (rooms, service): kept alongside a sub-type set
const SUB_NEUTRAL = /interior|dining room|waiter|guests|friends group/;
// restaurants: typed cuisines are detected as restaurants too (a "Pizzeria" fell to the generic profile)
(p => { if (p) p.kw = new RegExp(p.kw.source + '|pizz|burger|sushi|ramen|kebab|kabab|\\bgrill\\b|\\bbbq\\b|curry|biryani|tandoor|karahi|noodle|dim sum|takeaway|diner\\b|trattoria', 'i'); })(PROFILES.find(p => p.k === 'restaurant'));
// barbers: drop the salon interior that sat in the barber set; add clipper / haircut shots
(p => { if (!p) return; const bad = ['1560066984-138dadb4c035']; p.pool = p.pool.filter(x => !bad.includes(x[0])); p.gallery = p.gallery.filter(id => !bad.includes(id)); })(PROFILES.find(p => p.k === 'barber'));
(x => { if (x) x.pool.push(['px:7447133', 'barber cut fade haircut clippers skin'], ['px:9992817', 'barber cut haircut mens'], ['px:36043163', 'clippers fade skin haircut barber']); })(LIB.photos.barber);
// general clinics: clean clinic interiors, reception and consultations (dental keeps its own set)
registerPhotos('medical', { heroes: ['px:7016405', 'px:8459996', 'px:31844508', 'px:7108284', 'px:6749750'],
  pool: [['px:7016405', 'clinic room interior exam'], ['px:16571731', 'exam room clinic interior'], ['px:6285383', 'consultation doctor gp appointments'], ['px:6749750', 'doctor patient consultation checkup'],
    ['px:8459996', 'waiting room clinic interior'], ['px:7108284', 'reception clinic interior'], ['px:7108329', 'reception registration clinic patients'], ['px:31844508', 'reception clinic interior']] });
