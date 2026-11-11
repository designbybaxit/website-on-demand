/* =====================================================================
   TRADE WORDS (Round 1, item 5): each trade's own words for buttons, nav, section labels and form titles.
   Merged on top of the existing packs (one level deep for eyebrow / h2 / cta / ui).
   ===================================================================== */
function tradeWords(k, over) {
  const cur = PROFILE_COPY[k] || (PROFILE_COPY[k] = {});
  Object.entries(over).forEach(([f, v]) => { cur[f] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(cur[f] || {}), ...v } : v; });
}
tradeWords('barber', {
  cta: { book: 'Book a cut', quote: 'Ask a question', reserve: 'Book a cut' },
  eyebrow: { reviews: 'What clients say', book: 'Book a cut', process: 'Your visit', about: 'The shop' },
  h2: { book: 'Book your *cut.*', reviews: 'Fresh from the *chair.*', process: 'In the chair in *three* steps.' },
  steps: [['Book a cut', 'Pick a cut, a barber and a time.'], ['Take a seat', 'A quick chat about how you want it.'], ['Walk out sharp', 'Finished, styled and ready to go.']],
  // sample reviews stay labelled as samples; these are about cuts, not colour or treatments
  reviews: [['Best fade I\'ve had in years. In and out with no fuss.', 'Tom H.'], ['Good chat, sharp cut, fair price.', 'Ade O.'], ['Booked online, sat down on time and walked out looking sharp.', 'Chris M.']],
  ui: { nav: 'Cuts & prices', svcLabel: 'Cut', bookIntro: 'Pick a cut, a day and a time. We\'ll confirm by text.', bookSubmit: 'Book my cut', clientWord: 'clients' },
});
tradeWords('salon', { cta: { book: 'Book an appointment', reserve: 'Book an appointment' }, eyebrow: { book: 'Book an appointment' }, ui: { bookSubmit: 'Book my appointment' } });
tradeWords('spa', { cta: { book: 'Book a treatment', reserve: 'Book a treatment' }, eyebrow: { book: 'Book a treatment' }, ui: { nav: 'Treatments', svcLabel: 'Treatment', bookSubmit: 'Book my treatment' } });
tradeWords('dental', { cta: { book: 'Book an appointment', reserve: 'Book an appointment' }, eyebrow: { book: 'Book an appointment' }, ui: { bookSubmit: 'Request my appointment' } });
['medical', 'physio'].forEach(k => tradeWords(k, { cta: { book: 'Book an appointment', reserve: 'Book an appointment' }, eyebrow: { book: 'Book an appointment' } }));
tradeWords('restaurant', { cta: { book: 'Reserve a table', reserve: 'Reserve a table' }, eyebrow: { book: 'Reserve a table' } });
tradeWords('driving', { eyebrow: { why: 'Why pupils choose us', process: 'Your first lesson' }, h2: { why: 'Calm, clear and *patient.*' } });
tradeWords('florist', { ui: { svcLabel: 'Flowers', nav: 'Flowers' } });
tradeWords('retail', { ui: { svcLabel: 'Item', nav: 'Shop' } });
tradeWords('gym', { ui: { svcLabel: 'Session', nav: 'Training' } });
tradeWords('yoga', { ui: { svcLabel: 'Class', nav: 'Classes' } });
tradeWords('tutor', { ui: { svcLabel: 'Subject', nav: 'Lessons' } });
tradeWords('local', { cta: { book: 'Get in touch', quote: 'Get in touch', reserve: 'Get in touch' } });
/* sample reviews / figures / steps that were borrowed from a neighbouring trade (still shown as labelled samples) */
tradeWords('barber', { stats: [['10', '', 'years behind the chair'], ['200', '+', 'cuts a week'], ['4.9', '', 'average rating'], ['6', '', 'days a week']] });
tradeWords('spa', {
  reviews: [['I floated out of there. The most relaxing hour of my month.', 'Nadia F.'], ['Calm, spotless and my skin has never looked better.', 'Grace T.'], ['Booking was easy and the therapist really listened.', 'Lucy O.']],
  stats: [['8', '', 'years in the studio'], ['1000', '+', 'treatments a year'], ['4.9', '', 'average rating'], ['6', '', 'days a week']] });
tradeWords('cafe', {
  stats: [['5', '', 'years on the high street'], ['300', '+', 'coffees a day'], ['4.8', '', 'average rating'], ['7', '', 'days a week']],
  reviews: [['Best flat white in town and the pastries are always fresh.', 'Sophie L.'], ['Our favourite spot for a slow Saturday breakfast.', 'Mark & Jo'], ['Friendly staff and a lovely place to work for an hour.', 'Imran K.']] });
tradeWords('bakery', {
  steps: [['Order', 'Tell us what you\'d like and when.'], ['We bake', 'Made fresh for your date.'], ['Collect or delivery', 'Pick it up or we\'ll bring it to you.']],
  stats: [['10', '', 'years baking'], ['50', '+', 'cakes a month'], ['4.9', '', 'average rating'], ['6', '', 'days a week']],
  reviews: [['The birthday cake looked amazing and tasted even better.', 'Hannah P.'], ['Proper sourdough. We\'re here every Saturday.', 'James W.'], ['Ordered online, collected on time, everyone loved it.', 'Aisha M.']] });
tradeWords('events', { reviews: [['They thought of everything. We just enjoyed our day.', 'Sam & Leila'], ['Calm, organised and so easy to work with.', 'Priya N.'], ['Our guests are still talking about it.', 'Ollie & Kate']] });
tradeWords('carwash', { reviews: [['Car looks better than the day I bought it.', 'Dan R.'], ['Quick, careful and great value.', 'Sara P.'], ['Booked a valet online and it was ready when they said.', 'Mo A.']],
  stats: [['5', '', 'years in the trade'], ['3000', '+', 'cars cleaned'], ['4.8', '', 'average review score'], ['7', '', 'days a week']] });
['interior', 'architect'].forEach(k => tradeWords(k, {
  stats: [['60', '+', 'projects completed'], ['12', '', 'years in practice'], ['4.9', '', 'average client rating'], ['1:1', '', 'design consultations']],
  steps: [['First visit', 'We see the space and talk about how you use it.'], ['Design', 'Drawings and ideas you can react to.'], ['Make it happen', 'We guide the project through to the finish.']],
  reviews: [['They understood how we live and designed around it.', 'Clare J.'], ['Clear drawings, sensible budget, beautiful result.', 'Rohan P.'], ['Our home feels twice the size.', 'Megan T.']] }));
tradeWords('web', { stats: [['80', '+', 'sites launched'], ['8', '', 'years building for the web'], ['4.9', '', 'average client rating'], ['4', 'wk', 'typical site launch']] });
tradeWords('marketing', { stats: [['100', '+', 'campaigns run'], ['8', '', 'years in marketing'], ['4.9', '', 'average client rating'], ['2', 'wk', 'typical campaign launch']] });
