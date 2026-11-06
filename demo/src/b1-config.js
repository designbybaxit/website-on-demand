/* =====================================================================
   SITE BUILDER v2, following the Design by Baxit build standard
   (build-standard.md). One long single-file page per client. Style comes
   from the industry (his font + palette pairs). No invented facts: sample
   reviews/figures appear only in the preview and are visibly tagged.
   ===================================================================== */
const STUDIO = { name: 'Design by Baxit', url: 'https://designbybaxit.com/' };
const COUNTRIES = {
  UK: { label: 'United Kingdom', cur: '£', code: '44' },
  IE: { label: 'Ireland', cur: '€', code: '353' },
  CA: { label: 'Canada', cur: 'C$', code: '1' },
  AU: { label: 'Australia', cur: 'A$', code: '61' },
  NZ: { label: 'New Zealand', cur: 'NZ$', code: '64' },
  US: { label: 'United States', cur: '$', code: '1' },
  AE: { label: 'United Arab Emirates', cur: 'AED ', code: '971' },
  PK: { label: 'Pakistan', cur: 'Rs ', code: '92' },
};
const UNS = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? '&h=' + h : ''}&q=70&auto=format&fit=crop`;

/* [key, label shown in the form, nearest style] */
const INDUSTRIES = [
  ['clinic', 'Dental / health clinic', 'clinic'],
  ['restaurant', 'Restaurant / café', 'restaurant'],
  ['home', 'Home services (plumbing, electrical, cleaning…)', 'home'],
  ['realestate', 'Real estate / lettings', 'realestate'],
  ['salon', 'Hair salon / beauty / spa', 'salon'],
  ['law', 'Law firm / legal services', 'law'],
  ['other', 'Other (type it, we match the closest style)', null],
];
const OTHER_MAP = [
  [/caf[eé]|coffee|bak|pizza|takeaway|food|bar|pub|bistro|kitchen|cater|deli|dessert|grill/i, 'restaurant'],
  [/barber|beauty|nail|lash|brow|spa|massage|make.?up|tattoo|aesthetic|hair/i, 'salon'],
  [/physio|chiro|vet|optic|pharm|therap|health|medical|dent|clinic|osteo|gp|doctor|nutrition|fitness|gym|yoga|pilates|trainer/i, 'clinic'],
  [/law|legal|solicit|attorney|account|tax|consult|advis|financ|insur|notary|immigration|mortgage broker/i, 'law'],
  [/estate|letting|property|realt|home stag|interior|architect|survey/i, 'realestate'],
];
const styleFor = d => d.industry === 'other' ? ((OTHER_MAP.find(m => m[0].test(d.industryOther || '')) || [0, 'home'])[1]) : d.industry;

/* --- The six styles: fonts + palettes from his industry demos (playbook 3.1) --- */
const STYLES = {
  clinic: {
    label: 'Clinic (Instrument Serif + Plus Jakarta Sans, ink + mint)', schema: 'MedicalClinic',
    gf: 'family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400..800',
    display: '"Instrument Serif", Georgia, serif', sans: '"Plus Jakarta Sans", system-ui, sans-serif',
    headSerif: false, headWeight: 700, headLs: '-0.03em', em: 'italic', hero: 'split', radius: 22,
    pal: { bg: '#f5f8f7', surface: '#ffffff', text: '#0c3b44', muted: '#3d5c63', brand: '#0c3b44', accent: '#78d6c6', soft: '#dff5f0', accentText: '#0f7466', warm: '#ffd9bf', line: '#dde7e5' },
    photos: { hero: '1629909613654-28e377c37b09', split: '1598256989800-fe5f95da9787', gallery: ['1629909615184-74f495363b67', '1588776814546-1ffcf47267a5', '1609840114035-3c981b782dfe', '1606811971618-4486d14f3f99'] },
    alts: { hero: 'Bright, modern treatment room', split: 'Calm treatment room with a patient chair' },
    order: ['hero', 'stats', 'services', 'why', 'process', 'reviews', 'gallery', 'book', 'faq'],
  },
  restaurant: {
    label: 'Restaurant (Cormorant Garamond + Manrope, ember + gold, dark)', schema: 'Restaurant',
    gf: 'family=Cormorant+Garamond:ital,wght@0,500..700;1,500..700&family=Manrope:wght@400..800',
    display: '"Cormorant Garamond", Georgia, serif', sans: 'Manrope, system-ui, sans-serif',
    headSerif: true, headWeight: 600, headLs: '-0.015em', em: 'italic', hero: 'cinema', radius: 18, dark: true,
    pal: { bg: '#120e0b', surface: '#1b1511', text: '#f4ece1', muted: '#bfae99', brand: '#ff7a3d', accent: '#e6b65c', soft: 'rgba(230,182,92,.12)', accentText: '#e6b65c', warm: '#ff7a3d', line: 'rgba(244,236,225,.13)' },
    photos: { hero: '1517248135467-4c7edcad34c4', split: '1551218808-94e220e084d2', gallery: ['1414235077428-338989a2e8c0', '1504674900247-0877df9cc836', '1600891964092-4316c288032e', '1514933651103-005eec06c04b', '1565299624946-b28f40a0ae38'] },
    alts: { hero: 'Warmly lit restaurant dining room', split: 'Chef preparing fresh ingredients' },
    order: ['hero', 'ribbon', 'why', 'menu', 'gallery', 'reviews', 'process', 'book', 'faq'],
  },
  home: {
    label: 'Home services (Archivo, navy + safety yellow)', schema: 'HomeAndConstructionBusiness',
    gf: 'family=Archivo:ital,wght@0,400..900;1,400..900',
    display: 'Archivo, system-ui, sans-serif', sans: 'Archivo, system-ui, sans-serif',
    headSerif: false, headWeight: 800, headLs: '-0.035em', em: 'mark', hero: 'quote', radius: 16,
    pal: { bg: '#f4f6fa', surface: '#ffffff', text: '#0b1f3a', muted: '#4a5b75', brand: '#0b1f3a', accent: '#ffc21a', soft: '#fff3cc', accentText: '#0b1f3a', warm: '#ffc21a', line: '#dfe4ee' },
    photos: { hero: '1621905251189-08b45d6a269e', split: '1584622650111-993a426fbf0a', gallery: ['1620626011761-996317b8d101', '1556911220-bff31c812dba', '1585704032915-c3400ca199e7', '1607472586893-edb57bdc0e39'] },
    alts: { hero: 'Tradesperson working on an electrical panel', split: 'Freshly fitted modern bathroom' },
    order: ['hero', 'ribbon', 'services', 'stats', 'why', 'process', 'reviews', 'gallery', 'area', 'book', 'faq'],
  },
  realestate: {
    label: 'Real estate (DM Serif Display + Inter Tight, forest + brass)', schema: 'RealEstateAgent',
    gf: 'family=DM+Serif+Display:ital@0;1&family=Inter+Tight:wght@400..700',
    display: '"DM Serif Display", Georgia, serif', sans: '"Inter Tight", system-ui, sans-serif',
    headSerif: true, headWeight: 400, headLs: '-0.02em', em: 'italic', hero: 'search', radius: 20,
    pal: { bg: '#f7f5f0', surface: '#ffffff', text: '#1d3b2f', muted: '#4f6259', brand: '#1d3b2f', accent: '#c9a46a', soft: '#efe6d6', accentText: '#9a7838', warm: '#e8dcc4', line: '#e4ded2' },
    photos: { hero: '1600596542815-ffad4c1539a9', split: '1600607687939-ce8a6c25118c', gallery: ['1600585154340-be6161a56a0c', '1568605114967-8130f3a36994', '1560448204-e02f11c3d0e2', '1570129477492-45c003edd2be'] },
    alts: { hero: 'Modern white house with a pool', split: 'Bright open-plan living room' },
    order: ['hero', 'stats', 'services', 'calc', 'why', 'gallery', 'process', 'reviews', 'book', 'faq'],
  },
  salon: {
    label: 'Salon & spa (Bodoni Moda + Outfit, plum + rose)', schema: 'BeautySalon',
    gf: 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Outfit:wght@300..700',
    display: '"Bodoni Moda", Georgia, serif', sans: 'Outfit, system-ui, sans-serif',
    headSerif: true, headWeight: 500, headLs: '-0.02em', em: 'italic', hero: 'arch', radius: 24,
    pal: { bg: '#fbf6f3', surface: '#ffffff', text: '#3b1d2c', muted: '#6e5662', brand: '#3b1d2c', accent: '#c4727f', soft: '#f5e9e4', accentText: '#a8505f', warm: '#f1d3cc', line: '#eadcd6' },
    photos: { hero: '1562322140-8baeececf3df', circle: '1570172619644-dfd03ed5d881', split: '1521590832167-7bcbfaa6381f', gallery: ['1522337360788-8b13dee7a37e', '1487412947147-5cebf100ffc2', '1604654894610-df63bc536371', '1544161515-4ab6ce6db874'] },
    alts: { hero: 'Stylist blow-drying a client\'s hair in a bright salon', circle: 'Client relaxing during a facial', split: 'Salon interior with styling chairs and mirrors' },
    order: ['hero', 'ribbon', 'menu', 'why', 'gallery', 'process', 'reviews', 'book', 'faq'],
  },
  law: {
    label: 'Law firm (Libre Caslon + Libre Franklin, oxblood + gold)', schema: 'LegalService',
    gf: 'family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@400..800',
    display: '"Libre Caslon Display", "Libre Caslon Text", Georgia, serif', italic: '"Libre Caslon Text", Georgia, serif', sans: '"Libre Franklin", system-ui, sans-serif',
    headSerif: true, headWeight: 400, headLs: '-0.01em', em: 'italic', hero: 'form', radius: 6,
    pal: { bg: '#f7f4ef', surface: '#ffffff', text: '#151515', muted: '#55504a', brand: '#7b1e2b', accent: '#c2a36b', soft: '#efe7d8', accentText: '#7b1e2b', warm: '#e9dcc3', line: '#e2dbcf', deep: '#151515' },
    photos: { hero: '1589829545856-d10d557cf95f', split: '1505664194779-8beaceb93744', gallery: ['1450101499163-c8848c66ca85', '1521791055366-0d553872125f', '1497366811353-6870744d04b2', '1423592707957-3b212afa6733'] },
    alts: { hero: 'Statue of Lady Justice holding scales', split: 'Shelves of law books in a library' },
    order: ['hero', 'ribbon', 'services', 'stats', 'process', 'why', 'reviews', 'cta', 'book', 'faq'],
  },
};

/* --- Copy library per style (his voice: short, warm, specific; sentence case + full stop) --- */
const COPY = {
  clinic: {
    h1: ['Gentle care for a *brighter* smile.', 'Calm, modern care for the *whole* family.', 'Healthy smiles start with a *gentle* hello.'],
    h1Health: ['Expert care that puts *you* first.', 'Feel better, *sooner,* close to home.', 'Calm, modern care for the *whole* family.'],
    leadOpen: 'Modern care without the nerves.',
    eyebrow: { services: 'Treatments', why: 'Why patients choose us', process: 'Your first visit', reviews: 'Patient stories', book: 'Online booking', faq: 'FAQ', gallery: 'Inside the clinic', stats: '' },
    h2: { services: 'Everything you need, *under one roof.*', why: 'Modern care. *Old-fashioned* kindness.', process: 'Simple from the *first click.*', reviews: 'Kind words from our *patients.*', book: 'Book your visit in *under a minute.*', faq: 'Good *questions.*', gallery: 'A calm place to *feel at ease.*' },
    servicesIntro: 'Every visit starts with a clear explanation, so you always know what happens next.',
    steps: [['Book online', 'Pick a treatment and a time that suits you, day or night.'], ['Meet the team', 'An unhurried chat about what you need, with nothing rushed.'], ['Your plan', 'Clear next steps and options, explained in plain English.']],
    verb: 'Book', cta: { book: 'Book a visit', quote: 'Ask a question', reserve: 'Book a visit' },
    reviews: [['I used to dread appointments. Everyone explained each step and I felt completely at ease.', 'Jordan M.'], ['Booked online late at night and was seen that same week. Quick, calm and friendly.', 'Priya S.'], ['My kids actually ask when they can go back. That says it all.', 'Chris L.']],
    stats: [['15', '', 'years caring for local families'], ['12000', '+', 'happy patients'], ['4.9', '', 'average rating'], ['48', 'h', 'typical wait for a new visit']],
  },
  restaurant: {
    h1: ['A table worth *coming back* to.', 'Pull up a chair. *Stay* a while.', 'Made to share, *made* to remember.'],
    leadOpen: 'Good food, a warm room and people who love to look after you.',
    eyebrow: { menu: 'The menu', why: 'Our story', process: 'Your evening', reviews: 'Guest notes', book: 'Reservations', faq: 'Good to know', gallery: 'From the kitchen', stats: '' },
    h2: { menu: 'Something for *every* appetite.', why: 'Cooked with *care,* served with heart.', process: 'Your table, in *three* easy steps.', reviews: 'What our guests *say.*', book: 'Reserve your *table.*', faq: 'Before you *visit.*', gallery: 'A taste of the *evening.*' },
    menuIntro: 'A taste of what is on. Ask our team about today\'s specials.',
    steps: [['Reserve', 'Choose a date, a time and how many of you are coming.'], ['Arrive', 'We\'ll have your table ready and a warm welcome waiting.'], ['Enjoy', 'Settle in, order at your pace and leave room for dessert.']],
    verb: 'Reserve', cta: { book: 'Reserve a table', quote: 'Ask about events', reserve: 'Reserve a table' },
    reviews: [['The kind of place you book again before you\'ve even paid the bill.', 'Aoife K.'], ['Every dish arrived just right, and the staff remembered it was our anniversary.', 'Daniel R.'], ['Brought the whole family on a Sunday. Relaxed, generous and delicious.', 'Mei L.']],
    stats: [['10', '', 'years on the high street'], ['40', '', 'seats in the dining room'], ['4.8', '', 'average guest rating'], ['7', '', 'days a week']],
  },
  home: {
    h1: ['Fixed right, *first* time.', 'The local team that *turns up.*', 'Your home in *safe* hands.'],
    leadOpen: 'Friendly, tidy and on time.',
    eyebrow: { services: 'What we do', why: 'Why homeowners call us', process: 'How it works', reviews: 'Customer reviews', book: 'Free quote', faq: 'FAQ', gallery: 'Recent work', area: 'Where we work', stats: '' },
    h2: { services: 'Jobs big and small, *done properly.*', why: 'No fuss. No mess. *No surprises.*', process: 'From call to *sorted.*', reviews: 'Trusted by your *neighbours.*', book: 'Get your *free* quote.', faq: 'Straight *answers.*', gallery: 'Work we\'re *proud* of.', area: 'Proudly *local.*' },
    servicesIntro: 'Tell us the job and we\'ll tell you the price before we start.',
    steps: [['Tell us the job', 'Pick the service, add a postcode and how soon you need us.'], ['Get your price', 'We confirm a clear price with you before any work begins.'], ['We get it done', 'We turn up when agreed, finish the job and tidy up after.']],
    verb: 'Quote for', cta: { book: 'Book a visit', quote: 'Get a free quote', reserve: 'Book a visit' },
    reviews: [['Turned up when they said, explained everything and left the place spotless.', 'Gareth P.'], ['Called in the morning, sorted by the afternoon. Fair price and no fuss.', 'Sophie W.'], ['Clear quote, tidy work, and they even showed me how to avoid it happening again.', 'Imran H.']],
    stats: [['12', '+', 'years serving the area'], ['3500', '+', 'jobs completed'], ['4.9', '', 'average review score'], ['2', 'h', 'typical emergency response']],
  },
  realestate: {
    h1: ['Find the place you\'ll call *home.*', 'Sell smarter. Move *happier.*', 'Your next move, *made simple.*'],
    leadOpen: 'Local agents who know every street.',
    eyebrow: { services: 'How we help', why: 'Why move with us', process: 'Selling with us', reviews: 'Client stories', book: 'Free valuation', faq: 'FAQ', gallery: 'Homes we love', calc: 'Mortgage calculator', stats: '' },
    h2: { services: 'Buying, selling or letting, *sorted.*', why: 'Local knowledge. *Honest* advice.', process: 'Three steps to *sold.*', reviews: 'Moves we\'ve *made happen.*', book: 'What is your home *worth?*', faq: 'Questions, *answered.*', gallery: 'The kind of homes we *love.*', calc: 'What could you *afford?*' },
    servicesIntro: 'Whatever your next step, you get one agent who keeps you updated from start to finish.',
    steps: [['Book a valuation', 'We visit, look around and talk through the local market.'], ['Agree a plan', 'Photos, pricing and viewings planned around you.'], ['Move', 'We handle offers and paperwork so you can focus on the move.']],
    verb: 'Ask about', cta: { book: 'Book a valuation', quote: 'Book a free valuation', reserve: 'Book a viewing' },
    reviews: [['Sold in three weeks and they kept us updated every step of the way.', 'Hannah & Tom B.'], ['Honest advice on price from day one. No games, no pressure.', 'Ravi K.'], ['Found our first flat with them. Patient, friendly and always on the phone.', 'Ellie J.']],
    stats: [['250', '+', 'homes sold last year'], ['21', '', 'days average to sale agreed'], ['98', '%', 'of asking price achieved'], ['4.9', '', 'average client rating']],
  },
  salon: {
    h1: ['Leave feeling like *yourself,* only more so.', 'Hair, skin and nails, *beautifully* done.', 'Your hour of *calm* starts here.'],
    leadOpen: 'A calm, light-filled studio with unhurried appointments and honest advice.',
    eyebrow: { menu: 'Service menu', why: 'The studio', process: 'Your visit', reviews: 'Guest love', book: 'Book online', faq: 'FAQ', gallery: 'Recent work', stats: '' },
    h2: { menu: 'Choose your *treatments.*', why: 'Unhurried, honest and *a little* indulgent.', process: 'Booking in *three* taps.', reviews: 'Words from the *chair.*', book: 'Pick a *time that suits.*', faq: 'Before you *book.*', gallery: 'Fresh from the *chair.*' },
    menuIntro: 'Tap + to add services. We total the price, then you pick a time.',
    steps: [['Choose treatments', 'Add the services you want to your booking.'], ['Pick a time', 'Choose a day and a slot that fits your week.'], ['Relax', 'Sit back, we take care of the rest.']],
    verb: 'Book', cta: { book: 'Book now', quote: 'Ask a question', reserve: 'Book now' },
    reviews: [['I\'ve never had a colour I loved this much. Felt listened to from the first minute.', 'Grace T.'], ['The most relaxing hour of my month. Booking online took seconds.', 'Nadia F.'], ['Honest advice about what my hair actually needed. I won\'t go anywhere else.', 'Lucy O.']],
    stats: [['9', '', 'years in the studio'], ['850', '+', 'guest reviews'], ['4.9', '', 'average rating'], ['6', '', 'days a week']],
  },
  law: {
    h1: ['Clear advice, *on your side.*', 'Straight answers when it *matters* most.', 'Legal help that *speaks* your language.'],
    leadOpen: 'Plain-English advice from people who listen first.',
    eyebrow: { services: 'Practice areas', why: 'Why clients choose us', process: 'How it works', reviews: 'Client stories', book: 'Free case review', faq: 'FAQ', cta: '', stats: '' },
    h2: { services: 'How we can *help.*', why: 'Experienced, honest and *in your corner.*', process: 'Three steps to *clarity.*', reviews: 'Trusted when it *counts.*', book: 'Tell us what *happened.*', faq: 'Questions clients *ask.*', cta: 'Talk to someone *today.*' },
    servicesIntro: 'Every case starts with a free, no-obligation conversation in plain English.',
    steps: [['Tell us what happened', 'Share a few details online or by phone, in confidence.'], ['Free case review', 'We explain your options and the likely next steps.'], ['Next steps', 'If you go ahead, we agree the plan and costs up front.']],
    verb: 'Ask about', cta: { book: 'Book a consultation', quote: 'Free case review', reserve: 'Book a consultation' },
    reviews: [['They explained everything in plain English and never made me feel rushed.', 'Michael D.'], ['Clear about costs from the first call. I always knew where I stood.', 'Sarah N.'], ['Calm, professional and genuinely on my side through a difficult time.', 'Owen G.']],
    stats: [['25', '+', 'years of combined experience'], ['1200', '+', 'clients helped'], ['24', 'h', 'typical reply time'], ['4.9', '', 'average client rating']],
  },
};
