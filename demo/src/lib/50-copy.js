/* =====================================================================
   COPY VARIANTS: headlines, lead openers, section titles and "why us" titles
   per industry, chosen with the same seed as the design (name + industry +
   opts.design), so two businesses in one industry rarely share a headline.
   Truthful by construction: no superlatives, no numbers, and lines that make a
   claim (emergencies, Gas Safe, family-run…) are only in the pool when the
   client's own facts say so. {place} lines appear only when a town was given.
   ===================================================================== */
const CX = {};
const cxReg = (keys, def) => keys.forEach(k => { CX[k] = mergeCopy(CX[k] || {}, def); });
/* section-title packs shared by a family */
const H2_DENTAL = {
  services: ['Everything your smile *needs.*', 'Treatments for *every* smile.', 'Care for the *whole* family.', 'What we can do *for you.*'],
  why: ['Care that puts *you* first.', 'Why patients *choose* us.', 'A calmer kind of *dentist.*', 'Small touches, *big* difference.'],
  process: ['Your first visit, *step by step.*', 'Simple from the *first* hello.', 'Booking in *three* easy steps.'],
  reviews: ['Kind words from our *patients.*', 'What patients *say.*', 'Smiles, in their *own words.*'],
  faq: ['Good *questions.*', 'Before your *visit.*', 'Things patients *ask.*'],
  book: ['Book your *visit.*', 'Find a time that *suits* you.', 'Let\'s get you *booked in.*'],
  cta: ['Ready for a *healthier* smile?', 'Your next check-up *starts* here.', 'Let\'s look after your *smile.*'],
  about: ['The team behind *your* smile.', 'A practice that *listens.*', 'Meet the *practice.*'],
  gallery: ['A look *inside.*', 'Inside the *practice.*', 'Where you\'ll be *looked after.*'],
  insurance: ['Cover, plans and *payment.*', 'Paying for *treatment.*', 'Ways to *pay.*'],
  beforeafter: ['See the *difference.*', 'Real smiles, *real* results.', 'Before and *after.*'],
};
const H2_TRADE = {
  services: ['Every job, *big or small.*', 'What we *take on.*', 'Jobs we do *every* day.'],
  why: ['Why locals *call us.*', 'Tidy work, *honest* advice.', 'The team you\'ll *keep.*', 'Done properly, *every* time.'],
  process: ['Sorted in *three* steps.', 'From first call to *finished.*', 'How it *works.*'],
  reviews: ['What customers *say.*', 'Words from *happy* homes.', 'Our neighbours, *in their words.*'],
  faq: ['Straight *answers.*', 'Before you *call.*', 'Good *questions.*'],
  book: ['Tell us about the *job.*', 'Let\'s get it *sorted.*', 'Ask for your *quote.*'],
  cta: ['Got a job for *us?*', 'Let\'s get it *sorted.*', 'Ready when *you* are.'],
  gallery: ['Work we\'re *proud* of.', 'Recent *jobs.*', 'Fresh from the *van.*'],
  insurance: ['Ways to *pay.*', 'Paying for *the work.*'],
  beforeafter: ['See the *difference.*', 'Before and *after.*', 'Our work, *side by side.*'],
};
const H2_CLEAN = { ...H2_TRADE,
  services: ['Cleans for *every* home.', 'Pick your *clean.*', 'What we *clean.*'],
  why: ['Why homes *choose* us.', 'Cleaners you can *trust.*', 'The little things, *done.*'],
  gallery: ['Before you know it, *sparkling.*', 'Fresh from a *clean.*', 'Spaces we\'ve *refreshed.*'],
  beforeafter: ['See the *difference.*', 'Before and *after.*', 'Spotless, *side by side.*'],
};
const H2_BEAUTY = {
  menu: ['Pick your *treatment.*', 'The *menu.*', 'Something for *everyone.*'],
  why: ['Why clients *come back.*', 'Time that\'s *all yours.*', 'Skilled hands, *warm* welcome.'],
  process: ['Booking in *three* taps.', 'Your visit, *step by step.*'],
  reviews: ['Kind words from our *clients.*', 'What clients *say.*', 'In their *own words.*'],
  faq: ['Before your *visit.*', 'Good *questions.*'],
  book: ['Book your *appointment.*', 'Find your *time.*', 'Let\'s get you *booked in.*'],
  cta: ['Ready for *you* time?', 'Your chair is *waiting.*', 'Treat *yourself.*'],
  gallery: ['Fresh from the *chair.*', 'Recent *work.*', 'Looks we *love.*'],
  insurance: ['Ways to *pay.*'], beforeafter: ['See the *difference.*', 'Before and *after.*', 'The *transformation.*'],
};
const H2_FOOD = {
  menu: ['Something for *every* craving.', 'From the *kitchen.*', 'Our *menu.*'],
  why: ['Why people *come back.*', 'Made with *care.*', 'The little *things.*'],
  reviews: ['Words from our *guests.*', 'What guests *say.*', 'Happy *tables.*'],
  faq: ['Before you *visit.*', 'Good *questions.*'],
  gallery: ['A taste of the *day.*', 'From our *tables.*', 'Plates we *love.*'],
  cta: ['Come and *see us.*', 'Hungry *yet?*', 'Your table is *waiting.*'],
};
const WHY_T = {
  all: ['Everything in one place.', 'One team for it all.', 'Plenty to choose from.'],
  price: ['Clear prices, up front.', 'Prices you can see.', 'No guessing on price.'],
  late: ['Open when it suits you.', 'Hours that fit your week.', 'Easy to fit in.'],
  hours: ['Easy to plan around.', 'Clear opening hours.'],
  reach: ['Easy to reach.', 'Talk to us your way.', 'Get in touch your way.'],
  local: ['Local to {place}.', 'Right here in {place}.', 'Based in {place}.'],
};
cxReg(['dental'], {
  h1: ['Gentle care for a *brighter* smile.', 'Calm, modern care for the *whole* family.', 'Healthy smiles start with a *gentle* hello.', 'Your smile, in *careful* hands.', 'Brighter smiles, *calmer* visits.',
    'Care you can *smile* about.', 'Healthy teeth, *happy* smiles.', 'Where good smiles *begin.*', 'Feel at home in the *dentist\'s* chair.', 'Look after your smile, *your* way.', 'Modern dentistry, *gently* done.', 'Smile more, *worry* less.'],
  place: ['Friendly dental care in *{place}.*', 'Your local dentist in *{place}.*', 'Smiles looked after in *{place}.*'],
  when: [[F => F.welcome && /nervous|anxious/i.test(F.welcome.proof), 'Nervous? You\'re in *kind* hands.'], [F => F.emerg || F['247'] || F.sameday, 'In pain? Let\'s get you *seen.*'], [F => F.fam && /family/i.test(F.fam.proof), 'A family practice that *knows* your name.'],
    [(F, s) => /kid|child|children|paediatric|family/i.test(s), 'Smiles for every age, *first teeth up.*']],
  lead: ['Modern care without the nerves.', 'Gentle, unhurried dental care.', 'Friendly dentistry that puts you at ease.', 'Clear advice and careful treatment.'],
  h2: H2_DENTAL,
});
cxReg(['plumbing'], {
  h1: ['Fixed right, *first* time.', 'The local team that *turns up.*', 'Your home in *safe* hands.', 'Plumbing and heating, *sorted.*', 'Warm homes, *working* taps.', 'No drips, no drama, *just done.*',
    'Heating and plumbing you can *count on.*', 'Honest plumbing, *tidy* work.', 'Leaks fixed, *homes* happy.', 'Tidy plumbers, *clear* advice.'],
  place: ['Plumbing and heating across *{place}.*', 'Your local plumbers in *{place}.*'],
  when: [[F => F['247'], 'Burst pipe? We\'re on call *24/7.*'], [F => F.body && /gas safe/i.test(F.body.proof), 'Gas Safe engineers, *tidy* work.'], [(F, s) => /boiler/i.test(s), 'From dripping taps to *new boilers.*'], [F => F.fam && /family/i.test(F.fam.proof), 'A family firm that *turns up.*']],
  lead: ['Friendly, tidy and on time.', 'Straightforward plumbing and heating.', 'Reliable help for your home.', 'Honest advice and careful work.'],
  h2: { ...H2_TRADE, services: ['Plumbing and heating, *done properly.*', 'What we *fix.*', 'Every job, *big or small.*', 'From taps to *heating.*'] },
});
cxReg(['electric'], {
  h1: ['Safe, tidy *electrical* work.', 'Power you can *rely on.*', 'Wired right, *first* time.', 'Lights on, *worries* off.', 'Electrics done *properly.*', 'Bright ideas, *safe* wiring.', 'Careful electricians, *clear* advice.', 'Your home, *safely* powered.'],
  place: ['Your local electricians in *{place}.*', 'Electrical work across *{place}.*'],
  when: [[F => F.body && /NICEIC|NAPIT|ELECSA/.test(F.body.proof), 'Registered electricians, *properly* done.'], [(F, s) => /rewire/i.test(s), 'From sockets to *full rewires.*'], [F => F['247'], 'Power cut? We\'re on call *24/7.*']],
  lead: ['Safe, tidy and on time.', 'Electrical work done properly.', 'Friendly electricians who explain things.'],
  h2: { ...H2_TRADE, services: ['Electrics for *every* job.', 'What we *wire.*', 'Every job, *big or small.*'] },
});
cxReg(['cleaning'], {
  h1: ['Spotless, *every* time.', 'Come home to *clean.*', 'Reliable cleaners you can *trust.*', 'A cleaner home, *without* lifting a finger.', 'Fresh, tidy and *ready* for you.', 'More free time, *less* cleaning.',
    'Clean homes, *happy* weekends.', 'We clean, *you* relax.', 'The clean you\'ve been *waiting* for.', 'Sparkling rooms, *friendly* faces.'],
  place: ['Home cleaning across *{place}.*', 'Your local cleaners in *{place}.*'],
  when: [[F => F.eco, 'Spotless, with *kinder* products.'], [F => F.dbs || F.ins, 'Vetted cleaners, *spotless* homes.'],
    [(F, s) => /\boffice|commercial|workplace\b/i.test(s) && !/\bhome|house|apartment|domestic|residential\b/i.test(s), 'Offices cleaned, *properly.*'],
    [(F, s) => /\boffice|commercial\b/i.test(s) && /\bhome|house|apartment|domestic|residential\b/i.test(s), 'Homes and offices, *carefully* cleaned.']],
  lead: ['Friendly, reliable cleaners.', 'Careful cleaning for busy homes.', 'Thorough, tidy and on time.'],
  h2: H2_CLEAN,
});
cxReg(['pressure'], {
  h1: ['Exterior wash, *done properly.*', 'Driveways, patios and *walls.*', 'Clean on the *outside.*', 'The outside of the property, *washed.*', 'Pressure washing, *carefully* done.', 'Fresh kerb appeal, *without* the fuss.'],
  place: ['Exterior washing across *{place}.*', 'Pressure washing in *{place}.*'],
  when: [[(F, s) => /driveway/i.test(s), 'Driveways washed, *properly.*'], [(F, s) => /roof|gutter/i.test(s), 'Roofs and gutters, *washed* down.']],
  lead: ['Exterior cleaning for homes and small commercial fronts.', 'We wash the outside. You tell us which surfaces.'],
  h2: { ...H2_TRADE, services: ['Surfaces we *wash.*', 'Exterior work, *listed* plainly.', 'What you can *book.*'], gallery: ['Exterior *surfaces.*', 'The kind of *property* we wash.', 'Outside, *up close.*'] },
});
cxReg(['local'], {
  h1: ['Your work, *clearly* set out.', 'A straightforward page for a *real* business.', 'What you offer, *in plain sight.*', 'Services, prices and a way to *get in touch.*', 'Built from what you *told* us.', 'A simple page that *says* what you do.'],
  place: ['Based in *{place}.*', 'Serving *{place}.*'],
  lead: ['The services you listed, in your own words.', 'A straightforward page for the work you do.', 'Your services and prices, set out clearly.'],
  h2: { services: ['What you *offer.*', 'Your *services.*', 'Listed as you *wrote* them.'], why: ['From your own *words.*', 'What you *told* us.'], gallery: ['A sense of a *workplace.*', 'Example photos, *not* your premises.'], book: ['Get in *touch.*', 'Tell us what you *need.*'], about: ['In your *words.*', 'About the *business.*'] },
});
cxReg(['salon'], {
  h1: ['Leave feeling like *yourself,* only more so.', 'Hair, skin and nails, *beautifully* done.', 'Your hour of *calm* starts here.', 'Hair you\'ll *love* leaving with.', 'Your style, *beautifully* done.', 'Colour, cuts and *calm.*',
    'Feel good from *roots to ends.*', 'Time for *you.*', 'Beauty with a *personal* touch.', 'Good hair days *start* here.'],
  place: ['Hair and beauty in *{place}.*', 'Your salon in *{place}.*'],
  lead: ['Skilled stylists and a warm welcome.', 'Relaxed appointments, lovely results.', 'Cuts, colour and care, without the rush.'],
  h2: H2_BEAUTY,
});
cxReg(['barber'], {
  h1: ['Sharp cuts, *good* company.', 'Look sharp. *Feel* sharper.', 'Your chair is *waiting.*', 'Fresh fades, *proper* chats.', 'Clean cuts, *every* visit.', 'Classic cuts, *modern* style.', 'Sharp lines, *easy* booking.', 'The chair you\'ll *look forward* to.'],
  place: ['Barbers in the heart of *{place}.*', 'Your barbers in *{place}.*'],
  lead: ['Skilled barbers, good chat and no rushing.', 'Proper cuts and a friendly chair.', 'Fades, trims and beard work done right.'],
  h2: H2_BEAUTY,
});
cxReg(['spa'], {
  h1: ['Your hour of *calm* starts here.', 'Relax, restore, *glow.*', 'Time out, *beautifully* done.', 'Breathe out. *Unwind.*', 'Calm hands, *glowing* skin.', 'Slow down and *feel* better.', 'Treatments that *restore.*'],
  place: ['A quiet hour in *{place}.*'],
  lead: ['Calm treatments in a quiet space.', 'Skilled therapists, unhurried time.'],
  h2: H2_BEAUTY,
});
cxReg(['restaurant'], {
  h1: ['A table worth *coming back* to.', 'Pull up a chair. *Stay* a while.', 'Made to share, *made* to remember.', 'Good food, *good* people.', 'Seasonal plates, *warm* welcome.', 'Come hungry, *leave* happy.',
    'Dinner, *done* beautifully.', 'A table *waiting* for you.', 'Cooked with care, *served* with love.'],
  place: ['Eating well in *{place}.*', 'Your table in *{place}.*'],
  lead: ['Honest cooking and a warm welcome.', 'Food made with care, served with a smile.', 'Good plates, good company.'],
  h2: H2_FOOD,
});
cxReg(['cafe'], {
  h1: ['Good coffee, *good* company.', 'Your new favourite *corner.*', 'Brewed with *care.*', 'Coffee first, *everything* else after.', 'Fresh bakes and *proper* coffee.', 'Slow mornings *start* here.', 'Your daily cup, *done right.*', 'Pull up a stool, *stay* a while.'],
  place: ['Your coffee stop in *{place}.*'],
  lead: ['Great coffee, fresh bakes and a warm welcome.', 'Coffee, cake and somewhere to sit.', 'Proper coffee and good food, all day.'],
  h2: H2_FOOD,
});
cxReg(['bakery'], {
  h1: ['Baked fresh, *every* morning.', 'Made by hand, *made* with love.', 'Proper bread, *beautiful* cakes.', 'Bread worth *getting up* for.', 'Fresh out of the *oven.*', 'Small batches, *big* flavour.', 'Cakes for every *celebration.*'],
  place: ['Fresh baking in *{place}.*'],
  lead: ['Bread, pastries and cakes, made with care.', 'Baked by hand, in small batches.'],
  h2: H2_FOOD,
});
/* -> { h1Pool, lead, h2, why } for this business, or null pieces where we keep the base copy */
function copyX(prof, seed, ctx) {
  const X = CX[prof.k] || null, F = {}; (ctx.facts || []).forEach(f => { F[f.k] = f; });
  const svcText = [ctx.d && ctx.d.name, ctx.d && ctx.d.industryOther, ctx.d && ctx.d.about, ctx.services.map(s => s.name + ' ' + (s.desc || '')).join(' ')].filter(Boolean).join(' ');
  const fill = t => t.replace(/\{place\}/g, ctx.place);
  let h1Pool = null, lead = null; const h2 = {};
  if (X) {
    h1Pool = [...X.h1, ...(ctx.place ? (X.place || []).map(fill) : []), ...(X.when || []).filter(w => w[0](F, svcText)).map(w => w[1])];
    if (X.lead) lead = seedPick(X.lead, seed, 'lead');
    Object.entries(X.h2 || {}).forEach(([k, arr]) => { if (arr && arr.length) h2[k] = seedPick(arr, seed, 'h2-' + k); });
  }
  const why = {}; Object.entries(WHY_T).forEach(([k, arr]) => { why[k] = fill(seedPick(arr, seed, 'why-' + k)); });
  return { h1Pool, lead, h2, why };
}
