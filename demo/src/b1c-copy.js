/* =====================================================================
   COPY FOR THE REAL INDUSTRY. The six style packs in COPY stay for the
   native industries; every other business gets a family pack, so a design
   studio never reads like a plumber. Sample reviews/figures stay tagged.
   UI = the small labels inside forms, chips and FAQ.
   ===================================================================== */
const UI_BASE = {
  nav: 'Services', offerEyebrow: 'Popular choice', svcLabel: 'Service',
  quoteTitle: 'Get a quote', quoteSub: 'Two quick steps. No obligation.', quoteNote: 'Final price confirmed with you before any work starts.', quoteWhen: ['As soon as possible', 'In the next few weeks', 'I\'m flexible'], quoteWhenLabel: 'When do you need it?', quoteWhere: '',
  caseTitle: 'Book a consultation', caseSub: 'No obligation, plain English.', q1: 'What do you need help with?', q2: 'When would you like to start?', q2opts: ['As soon as possible', 'In the next month', 'Just exploring'], caseNote: 'We reply within one working day.', caseSubmit: 'Request a call back',
  formMsg: 'Tell us a little about what you need', formMsgPh: 'A few sentences are enough.', formSubmit: 'Send my enquiry', soon: null, postcode: false,
  bookIntro: 'Pick a service, a day and a time. We\'ll confirm by text or email.', bookSubmit: 'Request appointment', contactIntro: 'Tell us what you need and we\'ll get back to you with clear next steps.',
  chipQuote: 'Reply within a day', actQuote: 'Get in touch in two quick steps.', faqQuote: 'How do I get started?', formNoun: 'enquiry', trust: null, legal: '', schema: 'LocalBusiness', clientWord: 'customers',
};
const UI_NATIVE = {
  clinic: { nav: 'Treatments', svcLabel: 'Treatment', bookIntro: 'Choose a treatment and a time. We\'ll confirm by text or email.', legal: 'Treatment results vary from person to person. Your clinician will explain your options before any treatment.', schema: 'Dentist', faqQuote: 'How do I ask a question?' },
  restaurant: { nav: 'Menu', offerEyebrow: 'From the menu', schema: 'Restaurant' },
  home: { quoteTitle: 'Get a quote', soon: ['Emergency', 'This week', 'Flexible'], postcode: true, quoteWhen: ['Emergency, today', 'This week', 'I\'m flexible'], quoteWhenLabel: 'How soon?', quoteWhere: 'Postcode', formMsg: 'Tell us about the job', formMsgPh: 'A few sentences are enough, photos welcome on WhatsApp.', formSubmit: 'Get my quote', contactIntro: 'Tell us what you need and we\'ll come back with a clear price.', chipQuote: 'Quote in 2 steps', actQuote: 'Get a quote in two quick steps.', faqQuote: 'How do I get a quote?', formNoun: 'quote', schema: 'Plumber', clientWord: 'homeowners' },
  realestate: { chipQuote: 'Valuation in 1 minute', actQuote: 'Book a free valuation in under a minute.', faqQuote: 'How do I book a valuation?', formNoun: 'valuation', schema: 'RealEstateAgent' },
  salon: { schema: 'BeautySalon', bookIntro: 'Pick a service, a day and a time. We\'ll confirm your appointment.' },
  law: { nav: 'Practice areas', svcLabel: 'Area of law', caseTitle: 'Free case review', caseSub: 'Confidential, no obligation, plain English.', q2: 'When did it happen?', q2opts: ['In the last month', '1–12 months ago', 'Over a year ago', 'It\'s ongoing'], caseNote: 'Contacting us does not create a client relationship.', caseSubmit: 'Request my review',
    formMsg: 'Briefly, what happened?', formMsgPh: 'A few sentences are enough. Everything you share is confidential.', formSubmit: 'Request my free case review', contactIntro: 'Tell us a little about your situation. It\'s free and confidential.', chipQuote: 'Free case review', actQuote: 'Start with a free, confidential case review.', faqQuote: 'How do I get a case review?', formNoun: 'case review', trust: ['Free', 'first case review'],
    legal: 'The information on this website is general information, not legal advice. Contacting us does not create a client relationship. Past results do not guarantee future outcomes.', schema: 'LegalService', clientWord: 'clients' },
};
/* family packs: same keys as COPY entries */
const FAM_COPY = {
  creative: {
    h1: ['Design that makes people *stop* and look.', 'Ideas that look good *and* work hard.', 'Make your brand *impossible* to ignore.'],
    leadOpen: 'Thoughtful design that gets you noticed.',
    eyebrow: { services: 'What we do', why: 'Why clients pick us', process: 'How we work', reviews: 'Client words', book: 'Start a project', faq: 'FAQ', gallery: 'Recent work', area: 'Where we work', cta: '', menu: 'What we do', stats: '', about: 'The studio' },
    h2: { services: 'Everything your brand needs, *done properly.*', why: 'Clear thinking. *Beautiful* work.', process: 'From brief to *launch.*', reviews: 'What clients *say.*', book: 'Tell us about your *project.*', faq: 'Good *questions.*', gallery: 'Work we\'re *proud* of.', area: 'Working *near* you.', cta: 'Got a project in *mind?*', menu: 'What we *do.*', about: 'A studio that *listens* first.' },
    servicesIntro: 'Every project starts with a proper conversation about what you need and why.', menuIntro: 'Pick what you need. We\'ll shape the brief together.',
    steps: [['Brief', 'A short call to understand your goals, audience and timeline.'], ['Design', 'Concepts, feedback and refinements until it feels right.'], ['Deliver', 'Final files, launch support and everything you need to use them.']],
    verb: 'Ask about', cta: { book: 'Book a call', quote: 'Start a project', reserve: 'Book a call' },
    reviews: [['They got our brand straight away and the new look has changed how customers see us.', 'Amelia R.'], ['Clear process, quick replies and genuinely creative ideas. Would hire again.', 'Tom H.'], ['Our new website and logo finally look like the business we are.', 'Sana K.']],
    stats: [['120', '+', 'projects delivered'], ['8', '', 'years in the studio'], ['4.9', '', 'average client rating'], ['2', 'wk', 'typical brand turnaround']],
    ui: { quoteTitle: 'Start a project', quoteSub: 'Two quick steps. No obligation.', quoteNote: 'We reply with ideas and a clear price, usually within a day.', formMsg: 'Tell us about the project', formMsgPh: 'Goals, deadline, links you like… a few lines is plenty.', formSubmit: 'Send my brief', chipQuote: 'Reply within a day', actQuote: 'Tell us about your project in two quick steps.', faqQuote: 'How do we get started?', formNoun: 'brief', contactIntro: 'Share a few details and we\'ll come back with ideas, a timeline and a clear price.', schema: 'ProfessionalService', clientWord: 'clients' },
  },
  tech: {
    h1: ['Tech that just *works.*', 'Fast, friendly IT help *when* you need it.', 'Less downtime, *more* done.'],
    leadOpen: 'Friendly experts who explain things in plain English.',
    eyebrow: { services: 'How we help', why: 'Why businesses call us', process: 'How it works', reviews: 'Client words', book: 'Get support', faq: 'FAQ', gallery: 'Recent work', area: 'Where we work', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Support for every *device.*', why: 'Quick fixes. *Clear* advice.', process: 'Sorted in *three* steps.', reviews: 'What clients *say.*', book: 'Tell us what\'s *wrong.*', faq: 'Straight *answers.*', gallery: 'Behind the *scenes.*', area: 'Local *support.*', cta: 'Need help *today?*', about: 'Real people, *real* help.' },
    servicesIntro: 'Tell us the problem and we\'ll tell you the price before we start.',
    steps: [['Tell us the problem', 'Call, message or fill in the form with a few details.'], ['We diagnose', 'Remote or on-site, with a clear price before any work.'], ['Back to work', 'Fixed, tested and explained so it stays fixed.']],
    verb: 'Ask about', cta: { book: 'Book a repair', quote: 'Get IT help', reserve: 'Book a repair' },
    reviews: [['Our server went down on a Monday morning and they had us running by lunch.', 'Rachel P.'], ['Patient, clear and never made me feel silly for asking.', 'George M.'], ['Fixed my laptop the same day for a fair price.', 'Aisha B.']],
    stats: [['10', '+', 'years fixing tech'], ['2500', '+', 'devices repaired'], ['1', 'h', 'typical response time'], ['4.9', '', 'average rating']],
    ui: { quoteTitle: 'Get IT help', quoteNote: 'Clear price before any work starts.', formMsg: 'What\'s the problem?', formMsgPh: 'Device, what happened, any error messages…', formSubmit: 'Request support', chipQuote: 'Reply within the hour', actQuote: 'Get help in two quick steps.', faqQuote: 'How do I get help?', formNoun: 'support request', soon: ['Urgent', 'This week', 'Flexible'], schema: 'ProfessionalService' },
  },
  events: {
    h1: ['Moments worth *remembering.*', 'Your day, *beautifully* captured.', 'Every detail, *taken care* of.'],
    leadOpen: 'Calm, creative and organised, so you can enjoy the day.',
    eyebrow: { services: 'Packages', menu: 'Packages', why: 'Why couples and clients choose us', process: 'How it works', reviews: 'Kind words', book: 'Check your date', faq: 'FAQ', gallery: 'Recent work', area: 'Where we work', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Packages for *every* occasion.', menu: 'Choose your *package.*', why: 'Relaxed, creative and *on* your side.', process: 'Simple from *hello* to the big day.', reviews: 'Words from *happy* clients.', book: 'Is your date *free?*', faq: 'Before you *book.*', gallery: 'Moments we *love.*', area: 'Travelling *to you.*', cta: 'Let\'s plan *something* special.', about: 'The people *behind* the lens.' },
    servicesIntro: 'Every package starts with a relaxed chat about your plans.', menuIntro: 'Pick a package. We\'ll tailor it to your day.',
    steps: [['Check your date', 'Send your date and a few details about your plans.'], ['Plan together', 'A relaxed call to shape the day around you.'], ['Enjoy it', 'We take care of the details so you can be in the moment.']],
    verb: 'Ask about', cta: { book: 'Check my date', quote: 'Check my date', reserve: 'Check my date' },
    reviews: [['We forgot the camera was there, and the photos are better than we ever imagined.', 'Ella & James W.'], ['Organised, calm and so creative. Every detail was perfect.', 'Priya N.'], ['Our guests are still talking about it. Thank you for everything.', 'Hannah C.']],
    stats: [['150', '+', 'events covered'], ['9', '', 'years of experience'], ['4.9', '', 'average rating'], ['6', 'wk', 'typical delivery']],
    ui: { quoteTitle: 'Check your date', quoteNote: 'We reply with availability and a clear price.', quoteWhenLabel: 'When is it?', quoteWhen: ['This year', 'Next year', 'Not sure yet'], formMsg: 'Tell us about your plans', formMsgPh: 'Date, venue, number of guests…', formSubmit: 'Check my date', chipQuote: 'Reply within a day', actQuote: 'Check your date in two quick steps.', faqQuote: 'How do I check my date?', formNoun: 'enquiry', bookSubmit: 'Request a call', clientWord: 'clients' },
  },
  pro: {
    h1: ['Clear advice that *moves* you forward.', 'Less stress, *more* clarity.', 'Experts on *your* side.'],
    leadOpen: 'Straight-talking advice from people who listen first.',
    eyebrow: { services: 'Services', why: 'Why clients choose us', process: 'How it works', reviews: 'Client stories', book: 'Get in touch', faq: 'FAQ', cta: '', stats: '', gallery: 'At work', area: 'Where we work', about: 'About us' },
    h2: { services: 'How we can *help.*', why: 'Organised, honest and *in your corner.*', process: 'Three steps to *clarity.*', reviews: 'Trusted when it *counts.*', book: 'Tell us what you *need.*', faq: 'Questions clients *ask.*', cta: 'Talk to someone *today.*', gallery: 'Behind the *scenes.*', area: 'Local *advice.*', about: 'People who *care* about the details.' },
    servicesIntro: 'Every relationship starts with a no-obligation conversation in plain English.',
    steps: [['Tell us about you', 'Share a few details online or by phone.'], ['We talk it through', 'An honest chat about your options and the likely costs.'], ['We get to work', 'A clear plan, fixed fees where possible and regular updates.']],
    verb: 'Ask about', cta: { book: 'Book a consultation', quote: 'Book a consultation', reserve: 'Book a consultation' },
    reviews: [['Clear about fees from the first call. I always knew where I stood.', 'Sarah N.'], ['They took a weight off my shoulders and explained everything simply.', 'Daniel F.'], ['Organised, quick to reply and genuinely helpful.', 'Olivia T.']],
    stats: [['15', '+', 'years of experience'], ['400', '+', 'clients helped'], ['24', 'h', 'typical reply time'], ['4.9', '', 'average client rating']],
    ui: { chipQuote: 'Reply within a day', actQuote: 'Book a no-obligation consultation.', faqQuote: 'How do we get started?', formNoun: 'consultation', schema: 'ProfessionalService', clientWord: 'clients', formSubmit: 'Request a consultation' },
  },
  fitness: {
    h1: ['Stronger starts *today.*', 'Train hard. *Feel* amazing.', 'Your best shape, *with* real support.'],
    leadOpen: 'Coaching that meets you where you are.',
    eyebrow: { services: 'Memberships & training', why: 'Why members stay', process: 'Getting started', reviews: 'Member stories', book: 'Book a session', faq: 'FAQ', gallery: 'Inside the gym', area: 'Where we are', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Find your *fit.*', why: 'Real coaching. *Real* results.', process: 'Start in *three* steps.', reviews: 'Results that *speak.*', book: 'Book your first *session.*', faq: 'Before you *start.*', gallery: 'Built to *train.*', area: 'Close to *home.*', cta: 'Ready when *you* are.', about: 'A gym that feels like *a team.*' },
    servicesIntro: 'Whatever your goal, we\'ll help you build a plan you can stick to.',
    steps: [['Book a session', 'Pick a time that suits and tell us your goals.'], ['Meet your coach', 'A friendly chat, a look around and a plan made for you.'], ['Start training', 'Show up, follow the plan and watch the progress.']],
    verb: 'Ask about', cta: { book: 'Book a session', quote: 'Book a free taster', reserve: 'Book a session' },
    reviews: [['Never thought I\'d enjoy the gym. The coaches make every session fun.', 'Marcus L.'], ['Stronger, fitter and more confident in three months.', 'Jess O.'], ['Friendly, clean and never too busy. Best decision this year.', 'Kieran D.']],
    stats: [['500', '+', 'members'], ['30', '', 'classes a week'], ['12', '', 'qualified coaches'], ['4.9', '', 'average rating']],
    ui: { quoteTitle: 'Book a session', quoteSub: 'Pick what you\'re after. Takes a minute.', quoteNote: 'We\'ll confirm your time by text.', quoteWhenLabel: 'When suits you?', quoteWhen: ['This week', 'Next week', 'I\'m flexible'], formMsg: 'Your goals', formMsgPh: 'e.g. get stronger, lose weight, train for a race…', formSubmit: 'Book my session', chipQuote: 'Start this week', actQuote: 'Book your first session in a minute.', faqQuote: 'How do I start?', formNoun: 'booking', bookIntro: 'Pick a session, a day and a time. We\'ll confirm by text.', bookSubmit: 'Book my session', schema: 'ExerciseGym', clientWord: 'members' },
  },
  wellness: {
    h1: ['Breathe, move, *feel* at home.', 'Find your *calm.*', 'Stronger body, *quieter* mind.'],
    leadOpen: 'Welcoming classes for every body and every level.',
    eyebrow: { services: 'Classes', why: 'Why people stay', process: 'Your first class', reviews: 'Student stories', book: 'Book a class', faq: 'FAQ', gallery: 'Inside the studio', area: 'Where we are', cta: '', stats: '', about: 'The studio' },
    h2: { services: 'Find your *practice.*', why: 'Unhurried, kind and *welcoming.*', process: 'Simple from the *first click.*', reviews: 'Kind words from our *students.*', book: 'Book your *first class.*', faq: 'Before you *come.*', gallery: 'A calm place to *move.*', area: 'Close to *home.*', cta: 'Roll out your *mat.*', about: 'A space to *slow down.*' },
    servicesIntro: 'Beginners always welcome. Tell us what you\'re looking for and we\'ll suggest a class.',
    steps: [['Book a class', 'Pick a class and a time that suits you.'], ['Arrive early', 'Meet your teacher and settle in. Mats provided.'], ['Keep going', 'Come back when it suits, at your own pace.']],
    verb: 'Book', cta: { book: 'Book a class', quote: 'Ask a question', reserve: 'Book a class' },
    reviews: [['The kindest teachers. I left my first class feeling lighter.', 'Sophie A.'], ['Perfect for beginners. Nobody judges, everyone helps.', 'Ben C.'], ['My favourite hour of the week.', 'Leila M.']],
    stats: [['20', '+', 'classes a week'], ['8', '', 'teachers'], ['6', '', 'years in the studio'], ['4.9', '', 'average rating']],
    ui: { nav: 'Classes', svcLabel: 'Class', bookIntro: 'Pick a class, a day and a time. We\'ll save your spot.', bookSubmit: 'Book my spot', faqQuote: 'How do I ask a question?', schema: 'SportsActivityLocation', clientWord: 'students' },
  },
  health: {
    h1: ['Expert care that puts *you* first.', 'Feel better, *sooner,* close to home.', 'Calm, modern care for the *whole* family.'],
    leadOpen: 'Care that puts you first.',
    eyebrow: { services: 'Treatments', why: 'Why patients choose us', process: 'Your first visit', reviews: 'Patient stories', book: 'Online booking', faq: 'FAQ', gallery: 'Inside the clinic', area: 'Where we are', cta: '', stats: '', about: 'About the clinic' },
    h2: { services: 'Care that fits *your* life.', why: 'Modern care. *Old-fashioned* kindness.', process: 'Simple from the *first click.*', reviews: 'Kind words from our *patients.*', book: 'Book your visit in *under a minute.*', faq: 'Good *questions.*', gallery: 'A calm place to *feel at ease.*', area: 'Close to *home.*', cta: 'Feel better *soon.*', about: 'Care that *listens.*' },
    servicesIntro: 'Every visit starts with a proper assessment and a clear explanation.',
    steps: [['Book online', 'Pick a treatment and a time that suits you.'], ['Assessment', 'An unhurried chat and assessment of what you need.'], ['Your plan', 'Clear treatment and exercises, explained in plain English.']],
    verb: 'Book', cta: { book: 'Book an appointment', quote: 'Ask a question', reserve: 'Book an appointment' },
    reviews: [['Finally understood what was wrong and how to fix it. Pain-free in weeks.', 'Laura K.'], ['Booked online and was seen the next day. Calm, friendly and thorough.', 'Mohammed A.'], ['Clear advice and exercises that actually worked.', 'Fiona D.']],
    stats: [['12', '+', 'years of care'], ['6000', '+', 'patients helped'], ['4.9', '', 'average rating'], ['48', 'h', 'typical wait']],
    ui: { nav: 'Treatments', svcLabel: 'Treatment', bookIntro: 'Choose a treatment and a time. We\'ll confirm by text or email.', legal: 'Treatment results vary from person to person. Your clinician will explain your options before any treatment.', faqQuote: 'How do I ask a question?', schema: 'MedicalClinic', clientWord: 'patients' },
  },
  auto: {
    h1: ['Back on the road, *fast.*', 'Honest repairs, *fair* prices.', 'Your car in *safe* hands.'],
    leadOpen: 'Friendly, honest and quick.',
    eyebrow: { services: 'What we do', why: 'Why drivers choose us', process: 'How it works', reviews: 'Customer reviews', book: 'Book in', faq: 'FAQ', gallery: 'In the workshop', area: 'Where we work', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Every job, *done properly.*', why: 'No jargon. No surprises. *Just* honest work.', process: 'Booked in to *sorted.*', reviews: 'Trusted by local *drivers.*', book: 'Book your car *in.*', faq: 'Straight *answers.*', gallery: 'Work we\'re *proud* of.', area: 'Proudly *local.*', cta: 'Need it done *today?*', about: 'A garage you can *trust.*' },
    servicesIntro: 'We confirm the price with you before we start, every time.',
    steps: [['Book in', 'Pick the job and a time that suits you.'], ['We check it over', 'We confirm the price with you before any work.'], ['Drive away', 'Fixed, cleaned and ready when we said.']],
    verb: 'Book', cta: { book: 'Book my car in', quote: 'Get a quote', reserve: 'Book my car in' },
    reviews: [['Honest, quick and cheaper than the dealer. Car runs like new.', 'Craig B.'], ['Called with the price before doing anything. No nasty surprises.', 'Natalie S.'], ['Booked online, dropped off at 8, ready by 4.', 'Ahmed Y.']],
    stats: [['15', '+', 'years in the trade'], ['8000', '+', 'cars looked after'], ['4.9', '', 'average review score'], ['1', 'day', 'typical turnaround']],
    ui: { quoteTitle: 'Get a quote', quoteNote: 'Price confirmed with you before any work starts.', quoteWhenLabel: 'When do you need it?', quoteWhen: ['Today', 'This week', 'I\'m flexible'], quoteWhere: 'Car registration', formMsg: 'What does the car need?', formMsgPh: 'Make, model and what\'s happening…', formSubmit: 'Get my quote', soon: ['Urgent', 'This week', 'Flexible'], chipQuote: 'Quote in 2 steps', actQuote: 'Book in or get a quote in two quick steps.', faqQuote: 'How do I get a quote?', formNoun: 'quote', bookIntro: 'Pick the job, a day and a time. We\'ll confirm by text.', bookSubmit: 'Book my car in', schema: 'AutoRepair', clientWord: 'drivers' },
  },
  trade: {
    h1: ['Done right, *first* time.', 'The local team that *turns up.*', 'Reliable work, *fair* prices.'],
    leadOpen: 'Friendly, tidy and on time.',
    eyebrow: { services: 'What we do', why: 'Why customers call us', process: 'How it works', reviews: 'Customer reviews', book: 'Get a quote', faq: 'FAQ', gallery: 'Recent work', area: 'Where we work', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Jobs big and small, *done properly.*', why: 'No fuss. No mess. *No surprises.*', process: 'From call to *sorted.*', reviews: 'Trusted by your *neighbours.*', book: 'Get your *quote.*', faq: 'Straight *answers.*', gallery: 'Work we\'re *proud* of.', area: 'Proudly *local.*', cta: 'Need it done *soon?*', about: 'A local team you can *trust.*' },
    servicesIntro: 'Tell us the job and we\'ll tell you the price before we start.',
    steps: [['Tell us the job', 'Pick the service and tell us how soon you need us.'], ['Get your price', 'We confirm a clear price with you before any work begins.'], ['We get it done', 'We turn up when agreed, finish the job and tidy up after.']],
    verb: 'Quote for', cta: { book: 'Book a visit', quote: 'Get a quote', reserve: 'Book a visit' },
    reviews: [['Turned up when they said, explained everything and left the place spotless.', 'Gareth P.'], ['Clear quote, tidy work and a fair price. Will use again.', 'Sophie W.'], ['Friendly, reliable and the finish is brilliant.', 'Imran H.']],
    stats: [['12', '+', 'years serving the area'], ['3500', '+', 'jobs completed'], ['4.9', '', 'average review score'], ['48', 'h', 'typical quote time']],
    ui: { quoteTitle: 'Get a quote', soon: ['Urgent', 'This week', 'Flexible'], postcode: true, quoteWhen: ['As soon as possible', 'This week', 'I\'m flexible'], quoteWhenLabel: 'How soon?', quoteWhere: 'Postcode', formMsg: 'Tell us about the job', formMsgPh: 'A few sentences are enough, photos welcome on WhatsApp.', formSubmit: 'Get my quote', contactIntro: 'Tell us what you need and we\'ll come back with a clear price.', chipQuote: 'Quote in 2 steps', actQuote: 'Get a quote in two quick steps.', faqQuote: 'How do I get a quote?', formNoun: 'quote', schema: 'HomeAndConstructionBusiness' },
  },
  education: {
    h1: ['Confidence that shows in *every* lesson.', 'Learning that *clicks.*', 'Patient teaching, *real* progress.'],
    leadOpen: 'Friendly, patient teaching that builds real confidence.',
    eyebrow: { services: 'Lessons', why: 'Why families choose us', process: 'Getting started', reviews: 'Parent & student stories', book: 'Book a lesson', faq: 'FAQ', gallery: 'Learning in action', area: 'Where we teach', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Lessons that *fit* your goals.', why: 'Patient, clear and *encouraging.*', process: 'Start in *three* easy steps.', reviews: 'Progress you can *see.*', book: 'Book a *first lesson.*', faq: 'Questions parents *ask.*', gallery: 'Learning, *made* enjoyable.', area: 'Close to *home.*', cta: 'Ready to *start?*', about: 'Teaching that *builds* confidence.' },
    servicesIntro: 'Every student starts with a short chat about goals, level and how they learn best.',
    steps: [['Book a first lesson', 'Pick a subject and a time that suits.'], ['Meet your tutor', 'We find the gaps and set clear, friendly goals.'], ['See progress', 'Regular lessons and updates so everyone can see the progress.']],
    verb: 'Book', cta: { book: 'Book a lesson', quote: 'Ask about lessons', reserve: 'Book a lesson' },
    reviews: [['My son went from dreading maths to actually enjoying it.', 'Claire J.'], ['Patient, encouraging and so well organised.', 'Rohan P.'], ['Passed my exam with a grade I didn\'t think was possible.', 'Megan T.']],
    stats: [['300', '+', 'students taught'], ['10', '', 'years teaching'], ['4.9', '', 'average rating'], ['1:1', '', 'or small groups']],
    ui: { nav: 'Lessons', svcLabel: 'Subject', bookIntro: 'Pick a subject, a day and a time. We\'ll confirm by text.', bookSubmit: 'Book my lesson', faqQuote: 'How do I ask a question?', schema: 'EducationalOrganization', clientWord: 'students' },
  },
  pets: {
    h1: ['Happy pets, *happy* owners.', 'Gentle care for your *best* friend.', 'Treated like *family.*'],
    leadOpen: 'Gentle, patient care from people who adore animals.',
    eyebrow: { services: 'Services', menu: 'Services', why: 'Why pet owners trust us', process: 'Your first visit', reviews: 'Happy owners', book: 'Book online', faq: 'FAQ', gallery: 'Recent visitors', area: 'Where we work', cta: '', stats: '', about: 'About us' },
    h2: { services: 'Everything your pet *needs.*', menu: 'Choose your *services.*', why: 'Calm, gentle and *patient.*', process: 'Booking in *three* taps.', reviews: 'Tails *wagging.*', book: 'Book a *visit.*', faq: 'Before you *book.*', gallery: 'Our favourite *visitors.*', area: 'Close to *home.*', cta: 'Treat them *today.*', about: 'People who *love* animals.' },
    servicesIntro: 'Tell us about your pet and we\'ll suggest the right service.', menuIntro: 'Tap + to add services. We total the price, then you pick a time.',
    steps: [['Book online', 'Pick a service and a time that suits you.'], ['Meet the team', 'A quick hello so your pet can settle in.'], ['Pick up', 'A happy, clean and calm pet ready to go home.']],
    verb: 'Book', cta: { book: 'Book a visit', quote: 'Ask a question', reserve: 'Book a visit' },
    reviews: [['Our nervous rescue dog actually pulls us through the door now.', 'Kate W.'], ['Gentle, patient and he came home looking amazing.', 'Joe M.'], ['Easy to book and always on time. We trust them completely.', 'Anita R.']],
    stats: [['2000', '+', 'happy pets'], ['8', '', 'years caring for pets'], ['4.9', '', 'average rating'], ['6', '', 'days a week']],
    ui: { nav: 'Services', bookIntro: 'Pick a service, a day and a time. We\'ll confirm by text.', schema: 'LocalBusiness', clientWord: 'pet owners' },
  },
  retail: {
    h1: ['Find something you\'ll *love.*', 'Thoughtfully chosen, *beautifully* made.', 'Your new favourite *shop.*'],
    leadOpen: 'Things you won\'t find everywhere, chosen with care.',
    eyebrow: { services: 'Shop', menu: 'Shop', why: 'Why people shop with us', process: 'How it works', reviews: 'Customer love', book: 'Get in touch', faq: 'FAQ', gallery: 'In the shop', area: 'Where we are', cta: '', stats: '', about: 'Our story' },
    h2: { services: 'What we *stock.*', menu: 'Browse the *shop.*', why: 'Independent, friendly and *personal.*', process: 'Shopping, *made* easy.', reviews: 'Words from our *customers.*', book: 'Ask us *anything.*', faq: 'Before you *visit.*', gallery: 'A look *inside.*', area: 'Come and *visit.*', cta: 'Pop in *today.*', about: 'A shop with *heart.*' },
    servicesIntro: 'Ask us about anything you see. We\'re happy to help you choose.', menuIntro: 'A taste of what\'s in store. Ask about anything you can\'t see.',
    steps: [['Browse', 'Have a look online or pop into the shop.'], ['Ask us', 'Message or call and we\'ll help you choose.'], ['Collect or delivery', 'Pick it up or we\'ll get it to you.']],
    verb: 'Ask about', cta: { book: 'Visit the shop', quote: 'Ask about an item', reserve: 'Reserve an item' },
    reviews: [['Always find something special here. The team are lovely.', 'Rosie B.'], ['Helpful, friendly and beautifully presented.', 'Liam K.'], ['My go-to for gifts. Never disappoints.', 'Hana S.']],
    stats: [['5', '', 'years on the high street'], ['300', '+', 'products'], ['4.9', '', 'average rating'], ['7', '', 'days a week']],
    ui: { formMsg: 'What are you looking for?', formMsgPh: 'Item, size, colour…', formSubmit: 'Send my question', schema: 'Store' },
  },
};
/* per-profile tweaks on top of the family pack */
const PROFILE_COPY = {
  photo: { h1: ['Moments worth *remembering.*', 'Your story, *beautifully* told.', 'Natural photos you\'ll *love* forever.'] },
  marketing: { h1: ['More customers, *less* guesswork.', 'Marketing that *actually* works.', 'Get seen by the *right* people.'], h2: { services: 'Grow with the *right* mix.', gallery: 'Campaigns we\'re *proud* of.' } },
  web: { h1: ['Websites that *win* customers.', 'Fast, beautiful sites that *sell.*', 'Your business, *online* and growing.'], h2: { services: 'Everything your website *needs.*', gallery: 'Sites we\'ve *launched.*' } },
  interior: { h1: ['Rooms that feel *like you.*', 'Beautiful homes, *thoughtfully* designed.', 'Design that makes home *feel* better.'], eyebrow: { services: 'Services', gallery: 'Recent projects' }, h2: { gallery: 'Spaces we\'ve *transformed.*' } },
  architect: { h1: ['Spaces designed *around* you.', 'Ideas built to *last.*', 'From sketch to *home.*'], eyebrow: { gallery: 'Recent projects' } },
  accountant: { h1: ['Numbers sorted, *stress* gone.', 'Clear accounts, *calmer* business.', 'More time for the *work* you love.'] },
  consult: { h1: ['Clear advice that *moves* you forward.', 'Grow with *confidence.*', 'Less stress, *more* clarity.'] },
  cleaning: { h1: ['Spotless, *every* time.', 'Come home to *clean.*', 'Reliable cleaners you can *trust.*'], h2: { gallery: 'Before you know it, *sparkling.*' },
    servicesIntro: 'Home cleans, office cleans, or both: only the services you actually offer are listed here.' },
  pressure: { h1: ['Exterior wash, *done properly.*', 'The outside, *washed.*'], leadOpen: 'Exterior washing for the surfaces you name.',
    eyebrow: { services: 'Exterior work', gallery: 'Outside', book: 'Ask for a price' },
    h2: { services: 'Surfaces we *wash.*', gallery: 'Exterior *surfaces.*', book: 'Tell us the *surface.*' },
    servicesIntro: 'Driveways, patios, siding and the other exterior jobs you listed. Nothing indoors is added for you.' },
  local: { h1: ['Your work, *clearly* set out.', 'What you offer, *in plain sight.*'], leadOpen: 'A clear page built from the details you gave us.',
    eyebrow: { services: 'Services', gallery: 'Workplace', book: 'Get in touch', about: 'About' },
    h2: { services: 'What you *offer.*', gallery: 'Example photos, *not* your premises.', book: 'Get in *touch.*', about: 'In your *words.*' },
    servicesIntro: 'These are the services you listed. Prices are shown only where you typed them.',
    cta: { book: 'Get in touch', quote: 'Get in touch', reserve: 'Get in touch' },
    ui: { chipQuote: 'No obligation', actQuote: 'Send a few details and we will come back to you.', quoteTitle: 'Get in touch', quoteSub: 'Two quick steps.', quoteNote: 'Nothing is sent until this website is live.', formSubmit: 'Send message', contactIntro: 'Send a few details and we will come back to you.' } },
  garden: { h1: ['Gardens you\'ll *love* coming home to.', 'Beautiful outdoor spaces, *done properly.*', 'Your garden in *good* hands.'] },
  roofing: { h1: ['A roof you can *rely* on.', 'Watertight, *first* time.', 'Your home in *safe* hands.'] },
  carwash: { h1: ['Showroom shine, *every* time.', 'Clean inside *and* out.', 'Your car, *looking* its best.'], steps: [['Book in', 'Pick a package and a time that suits.'], ['We clean', 'Hand-finished inside and out.'], ['Drive away', 'Gleaming, fresh and ready to go.']] },
  barber: { h1: ['Sharp cuts, *good* company.', 'Look sharp. *Feel* sharper.', 'Your chair is *waiting.*'], leadOpen: 'Skilled barbers, good chat and no rushing.', eyebrow: { menu: 'Price list', gallery: 'Fresh cuts', why: 'The shop' }, h2: { menu: 'Pick your *cut.*', gallery: 'Fresh from the *chair.*', why: 'Old-school skills, *modern* style.' } },
  spa: { h1: ['Your hour of *calm* starts here.', 'Relax, restore, *glow.*', 'Time out, *beautifully* done.'] },
  cafe: { h1: ['Good coffee, *good* company.', 'Your new favourite *corner.*', 'Brewed with *care.*'], leadOpen: 'Great coffee, fresh bakes and a warm welcome.', eyebrow: { menu: 'The menu', gallery: 'From the counter', book: 'Book a table' }, h2: { menu: 'Something for *every* craving.', gallery: 'A taste of the *day.*' }, cta: { book: 'Book a table', quote: 'Ask about catering', reserve: 'Book a table' } },
  bakery: { h1: ['Baked fresh, *every* morning.', 'Made by hand, *made* with love.', 'Proper bread, *beautiful* cakes.'], leadOpen: 'Bread, pastries and cakes, baked fresh.', eyebrow: { menu: 'Today\'s bakes', gallery: 'From the oven', book: 'Order' }, h2: { menu: 'Fresh from the *oven.*', gallery: 'Still *warm.*', book: 'Order a *cake.*' }, cta: { book: 'Order a cake', quote: 'Order a cake', reserve: 'Order a cake' } },
  medical: {}, physio: {}, gym: {}, yoga: {}, tutor: {}, pets: {}, retail: {}, events: {}, it: {}, graphic: {}, auto: {}, electric: {}, build: {},
};
/* which family packs are content-native to which style (use COPY[style] as base instead) */
const FAM_NATIVE = { dental: 'clinic', food: 'restaurant', beauty: 'salon', property: 'realestate', legal: 'law' };
function mergeCopy(base, over) {
  const out = { ...base };
  Object.entries(over || {}).forEach(([k, v]) => { out[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(base[k] || {}), ...v } : v; });
  return out;
}
/* -> { C, U, native } */
function copyFor(prof, styleKey) {
  const nativeStyle = FAM_NATIVE[prof.fam];
  let C, U;
  if (nativeStyle) {
    C = mergeCopy(COPY[nativeStyle], PROFILE_COPY[prof.k] || {});
    U = { ...UI_BASE, ...(UI_NATIVE[nativeStyle] || {}), ...((PROFILE_COPY[prof.k] || {}).ui || {}) };
  } else if (prof.k === 'plumbing') {
    C = COPY.home; U = { ...UI_BASE, ...UI_NATIVE.home };
  } else {
    const F = FAM_COPY[prof.fam] || FAM_COPY.pro;
    C = mergeCopy(F, PROFILE_COPY[prof.k] || {});
    U = { ...UI_BASE, ...(F.ui || {}), ...((PROFILE_COPY[prof.k] || {}).ui || {}) };
  }
  // the gaps every pack needs (sections can move between styles)
  const G = FAM_COPY.pro;
  C = { ...C, eyebrow: { ...G.eyebrow, ...C.eyebrow }, h2: { ...G.h2, ...C.h2 }, servicesIntro: C.servicesIntro || G.servicesIntro, menuIntro: C.menuIntro || C.servicesIntro || G.servicesIntro };
  if (!C.eyebrow.about) C.eyebrow.about = 'About us';
  if (!C.h2.about) C.h2.about = 'The people *behind* the work.';
  return { C, U, native: !!nativeStyle && nativeStyle === styleKey || (prof.k === 'plumbing' && styleKey === 'home') };
}
