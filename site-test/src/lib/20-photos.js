/* =====================================================================
   PHOTO POOLS (added to each profile's curated Unsplash set in b1b-industries.js)
   Every id below was checked on 2 Nov 2026: HTTP 200 + image/jpeg from the CDN,
   and looked at on a contact sheet (library/photo-check/) to confirm the subject.
   "px:<n>" = Pexels photo n (Pexels licence: free for commercial use, no attribution needed).
   heroes = people-at-work photos preferred for the hero (picked by seed).
   pool   = [id, tags]; tags are matched against each service's words.
   Removed after a full-size look: px:32588548 (a company logo on the apron is readable at hero size).
   ===================================================================== */
registerPhotos('dental', {
  heroes: ['px:19976556', 'px:16903232', 'px:4270940', 'px:7803063', 'px:5355702', 'px:19976578', 'px:12917374'],
  pool: [['px:19976578', 'dentist patient checkup exam treatment'], ['px:19976556', 'dentist patient checkup treatment hygiene'], ['px:19976594', 'dentist procedure treatment root canal filling crown'],
    ['px:6812558', 'clinic room dentist treatment implants'], ['px:16903232', 'checkup exam dentist patient emergency'], ['px:3845942', 'cleaning hygiene hygienist scale polish'], ['px:4270940', 'checkup exam hygiene cleaning'],
    ['px:3881439', 'dentist clinic nervous comfort'], ['px:7803063', 'smile patient whitening cosmetic'], ['px:7803058', 'patient chair comfort nervous sedation'], ['px:5355702', 'smile patient consultation cosmetic veneers'],
    ['px:4971499', 'patient chair smile new patients'], ['px:8260438', 'kids child children family paediatric'], ['px:6627379', 'kids child boy checkup'], ['px:7800561', 'kids child children family'],
    ['px:6501922', 'kids child smile checkup'], ['px:12917374', 'kids child family dentist'], ['px:28470229', 'aligners invisalign straighten orthodontic clear braces'], ['px:13207280', 'aligners retainer orthodontic mould straighten braces'],
    ['px:3884085', 'tools tray equipment hygiene sterile'], ['px:4270967', 'tools equipment instruments'], ['px:5355918', 'tools equipment instruments'], ['px:6528786', 'tools instruments'],
    // 2 Nov 2026 additions towards the synthesis' 15 subjects (all Pexels, fetched + viewed; logo/brand shots rejected)
    ['px:6627575', 'whitening shade colour cosmetic veneers bleaching'], ['px:5355901', 'whitening shade cosmetic veneers dentist patient'], ['px:6627273', 'kids child teen whitening shade family'],
    ['px:6502305', 'implants implant crown bridge restorative missing tooth', { only: true }], ['px:6502306', 'implants implant crown dentures restorative', { only: true }],
    ['px:4687282', 'xray x-ray scan consultation checkup new patient digital'], ['px:7803056', 'xray x-ray consultation scan checkup dentist patient'], ['px:5622254', 'xray x-ray consultation plan treatment'],
    ['px:7803051', 'xray x-ray dentist clinic technology'], ['px:5622033', 'checkup exam older senior dentures implants'], ['px:5622004', 'microscope exam older senior root canal endodontic'],
    ['px:6809668', 'emergency toothache pain urgent', { only: true }], ['px:6193198', 'emergency toothache pain urgent', { only: true }],
    ['px:31043313', 'dentist team portrait lead about'], ['px:37458356', 'dentist team portrait lead about'], ['px:37458097', 'team dentists about practice'],
    ['px:3845735', 'hygiene hygienist cleaning scale polish checkup'], ['px:3845806', 'checkup exam hygiene men patient'], ['px:6812461', 'clinic room surgery practice modern'],
    ['px:6473194', 'clinic room surgery practice'], ['px:4971556', 'checkup patient dentist exam'], ['px:7298633', 'smile cosmetic whitening veneers bonding'], ['px:8727478', 'smile older senior dentures implants']],
});
LIB.photos.dental.heroes.push('px:5355901', 'px:7803056', 'px:4971556', 'px:3845806');
registerPhotos('salon', {
  heroes: ['px:4981475', 'px:7388939', 'px:8834111', 'px:8468036', '1562322140-8baeececf3df'],
  pool: [['px:4981475', 'cut haircut ladies style trim'], ['px:15659458', 'cut haircut scissors short'], ['px:7388939', 'colour dye tint curly afro'], ['px:7389078', 'colour dye tint mens curly'],
    ['px:8468036', 'colour highlights blonde balayage toner'], ['px:8834111', 'blow dry styling blowout'], ['px:8834087', 'blow dry styling'], ['px:23349899', 'mens cut haircut gents'],
    ['px:14267564', 'nails manicure file'], ['px:4530187', 'nails manicure polish gel'], ['px:19239100', 'nails manicure pedicure salon'], ['px:5128220', 'lashes lash extensions eyelash'],
    ['px:8554941', 'lashes brows lash lift tint'], ['px:16554435', 'lashes extensions'], ['px:29391092', 'lashes extensions lash'], ['px:7750124', 'salon interior studio mirrors'],
    ['px:37229293', 'facial skin skincare spa'], ['px:36497924', 'facial brows skin treatment']],
});
registerPhotos('barber', {
  heroes: ['px:5568409', 'px:7518731', '1622286342621-4bd786c2447c'],
  pool: [['px:5568409', 'barber cut fade haircut skin'], ['px:7518731', 'barber shop cut'], ['px:23349899', 'mens cut haircut gents scissor'], ['px:3993309', 'shop chairs barber'], ['px:15659458', 'cut scissors short']],
});
registerPhotos('spa', { heroes: ['px:37229293', '1570172619644-dfd03ed5d881'], pool: [['px:37229293', 'facial skin skincare spa'], ['px:36497924', 'facial brows skin treatment'], ['px:8554941', 'lashes brows lash lift tint'], ['px:4530187', 'nails manicure polish']] });
registerPhotos('plumbing', {
  heroes: ['px:29226620', 'px:34938439', 'px:34938442'],
  pool: [['px:29226620', 'radiator radiators heating pipes install'], ['px:34938439', 'boiler boilers heating service repair'], ['px:34938442', 'boiler heating engineer service gas'],
    ['px:7859953', 'boiler controls heating gas service water heater'], ['px:6419128', 'pipes fittings install repipe leak leaks repair'], ['px:28169591', 'pipes copper fittings repipe'], ['px:30547730', 'bathroom sink basin taps'],
    ['px:10833566', 'taps tap sink basin'], ['px:3761559', 'taps tap sink faucet'], ['px:7587378', 'basin sink bathroom'], ['px:12644994', 'radiator valve heating thermostat'],
    ['px:15571823', 'radiator heating'], ['px:5691536', 'heating radiator install measuring'], ['px:31238728', 'bathroom shower fitting'], ['px:6492399', 'shower bathroom tiles'],
    ['px:6436787', 'shower bathroom fitting'], ['px:7534277', 'shower bathroom'], ['px:7616651', 'thermostat heating controls smart']],
});
registerPhotos('electric', {
  heroes: ['px:5691590', 'px:27928762', 'px:20500461', 'px:34054464'],
  pool: [['px:5691590', 'sockets socket outlets wiring repair'], ['px:257736', 'fuse board consumer unit wiring panel'], ['px:27928762', 'panel fuse board consumer unit installation'], ['px:20500461', 'wiring cables installation rewire rewiring'],
    ['px:4981772', 'lighting installation fitting'], ['px:4792522', 'lighting light fitting install'], ['px:33531830', 'testing inspection eicr meter'], ['px:34054464', 'testing inspection panel fuse']],
});
registerPhotos('cleaning', {
  heroes: ['px:5591852', 'px:6195275', 'px:6195277', 'px:6196692'],
  pool: [['px:5591852', 'kitchen wipe domestic regular surfaces home'], ['px:6196692', 'team deep clean office commercial'], ['px:6195275', 'vacuum carpet hoover domestic regular'], ['px:6195277', 'floor mop team deep clean'],
    ['px:3867598', 'bathroom shower deep clean glass'], ['px:9462635', 'bathroom tiles spray deep clean'], ['px:9462644', 'sink bathroom kitchen'], ['px:37440103', 'window windows glass'],
    ['px:34516670', 'office commercial janitorial'],     ['px:6195129', 'team staff uniform'], ['px:6196691', 'team end of tenancy move'],
    // 6 Nov 2026: apartment interior and a person cleaning glass, fetched and viewed (no readable branding)
    ['px:1643383', 'apartment interior home living residential lounge'], ['px:34023076', 'window windows glass exterior cleaner']],
});
LIB.photos.cleaning.heroes.push('px:34023076');
/* Exterior pressure washing. People-at-work shots are scarce without readable signs or vehicle badges;
   house exteriors fill galleries and are labelled as example stock, not a client's finished job.
   Viewed 6 Nov 2026. Rejected: px:37042566 (readable plate and car badge), px:12919779 (large sign and phone number). */
registerPhotos('pressure', {
  heroes: ['px:5248733', 'px:16001962'],
  pool: [['px:5248733', 'pressure wash facade exterior building rope siding'], ['px:16001962', 'pressure wash roof exterior facade'],
    ['px:1396122', 'driveway siding house exterior'], ['px:106399', 'driveway house siding garage exterior'],
    ['px:2102587', 'house front patio exterior'], ['px:1029599', 'siding house exterior'],
    ['px:1115804', 'house exterior modern patio'], ['px:259588', 'driveway house stone exterior'], ['px:280222', 'siding house exterior']],
});
/* Neutral local-business pool for trades we do not have a curated set for. No dental, plumbing or salon subjects.
   Viewed 6 Nov 2026. Rejected shots with readable sale signs, superhero logos or finance dashboards. */
registerPhotos('local', {
  heroes: ['px:3184291', 'px:5520327', 'px:36753978', 'px:8276630', 'px:3184360'],
  pool: [['px:3184291', 'meeting team handshake workspace'], ['px:7688336', 'planning desk workspace meeting'],
    ['px:3760067', 'notes paperwork desk'], ['px:3184360', 'meeting workspace laptops'], ['px:6348057', 'notebook notes planning'],
    ['px:36753978', 'shop owner storefront local'], ['px:3874033', 'handshake notebook meeting'], ['px:5520327', 'handshake meeting'],
    ['px:8276630', 'conversation desk meeting']],
});
registerPhotos('cafe', {
  heroes: ['px:36643337', 'px:28835887', 'px:11284048', 'px:30226603'],
  pool: [['px:36643337', 'latte coffee flat white barista'], ['px:30226603', 'latte art coffee'], ['px:30617889', 'cappuccino latte coffee'], ['px:28835887', 'coffee milk barista'],
    ['px:28495595', 'espresso coffee'], ['px:10163229', 'counter order'], ['px:4921263', 'counter staff'], ['px:11284048', 'barista counter friendly'],
    ['px:29250093', 'cafe interior seating'], ['px:2739760', 'cafe interior'], ['px:35183327', 'pastries croissant bakes'], ['px:19498996', 'croissant pastries'], ['px:3639538', 'pastries cakes counter']],
});
registerPhotos('bakery', { heroes: ['px:35183327'], pool: [['px:35183327', 'pastries croissant bakes'], ['px:19498996', 'croissant pastries viennoiserie'], ['px:3639538', 'pastries cakes counter']] });
registerPhotos('restaurant', {
  heroes: ['px:36430089', 'px:23910154', 'px:36430091', 'px:30021735', 'px:32399761'],
  pool: [['px:36430089', 'chef kitchen plating mains'], ['px:35490112', 'mains fish plating'], ['px:39022008', 'chef fish salmon mains'], ['px:36430091', 'chef kitchen open'],
    ['px:23910154', 'waiter service dining'], ['px:7969146', 'outdoor terrace lunch'], ['px:30622044', 'waiter service drinks'], ['px:30021735', 'bistro evening dining'],
    ['px:6876628', 'dining room interior'], ['px:32399761', 'dining room interior private'], ['px:18756733', 'interior dining'], ['px:7444789', 'dinner guests table'],
    ['px:26863814', 'friends group table events'], ['px:6954050', 'sharing dinner friends'], ['px:16774294', 'sharing starters'], ['px:3923416', 'dining evening'],
    ['px:16806516', 'cocktails bar drinks'], ['px:15496338', 'cocktails bartender bar'], ['px:30133544', 'cocktails drinks wine'], ['px:35420067', 'starters tasting dish'],
    ['px:36678411', 'lamb mains'], ['px:9637023', 'pasta mains dish']],
});
/* batch 3 (2 Nov 2026): grown for the smallest pools; every id fetched (200, image/jpeg) and checked on library/photo-check/sheet*.jpg */
registerPhotos('law', {
  heroes: ['px:8112164', 'px:7876052', 'px:8112153'],
  pool: [['px:8112164', 'consultation family divorce clients'], ['px:7876052', 'family divorce separation couple advice'], ['px:8112153', 'clients consultation meeting'], ['px:7875891', 'business commercial employment team'],
    ['px:4427543', 'wills probate signing documents'], ['px:8815849', 'contract signing conveyancing'], ['px:7875839', 'contract employment agreement'], ['px:8112134', 'reading contract review documents'],
    ['px:8428073', 'business commercial signing documents'], ['px:8730785', 'books law research'], ['px:8112162', 'meeting office handshake'], ['px:7876200', 'mediation family divorce'], ['px:8111863', 'phone call documents injury claim']],
});
registerPhotos('realestate', {
  heroes: ['px:7642008', 'px:8293693', 'px:7415097'],
  pool: [['px:7642008', 'buy buying keys agent'], ['px:7415097', 'keys family buying lettings'], ['px:8293693', 'sold selling sale sign keys'], ['px:8815932', 'keys buyers'],
    ['px:4857778', 'house exterior modern'], ['px:10981670', 'interior living room empty valuation'], ['px:35361412', 'house exterior luxury garden'], ['px:6908365', 'interior staircase living']],
});
registerPhotos('roofing', {
  heroes: ['px:38028508', 'px:33404248', 'px:37623622', 'px:31771166'],
  pool: [['px:39494029', 'new roof house tiles'], ['px:37623622', 'roofer tiles repair safety'], ['px:11467876', 'tiles tiling team install'], ['px:31771166', 'tiles new roof install'],
    ['px:33404248', 'shingles felt flat repair'], ['px:38028508', 'shingles new roof re-roof'], ['px:37704237', 'chimney repair repointing'], ['px:34020199', 'chimney inspection survey gutter']],
});
registerPhotos('build', {
  heroes: ['px:8820187', 'px:34006937', 'px:32913789', 'px:17410734'],
  pool: [['px:8830265', 'frame timber extension'], ['px:8829878', 'roof trusses timber loft'], ['px:8820187', 'carpentry carpenters joinery'], ['px:34006937', 'carpentry saw flooring kitchen'],
    ['px:17410734', 'build site extension'], ['px:39576104', 'brick bricklaying walls'], ['px:32913789', 'brick bricklaying walls extension'], ['px:39325789', 'brick wall repair'],
    ['px:32913797', 'brick bricklaying'], ['px:5242049', 'plastering render walls']],
});
registerPhotos('garden', {
  heroes: ['px:33688146', 'px:38897678', 'px:5163424'],
  pool: [['px:33688146', 'hedge hedges trimming'], ['px:38897678', 'hedge trimming pruning'], ['px:39069477', 'lawn mowing leaves clearance'], ['px:5163424', 'lawn mowing'],
    ['px:27176773', 'planting beds borders'], ['px:27176778', 'planting garden design'], ['px:6231854', 'planting flowers pots']],
});
registerPhotos('carwash', {
  heroes: ['px:6873183', 'px:28995187'],
  pool: [['px:30564616', 'foam wash exterior'], ['px:6873183', 'hand wash sponge mobile'], ['px:4870739', 'foam windows glass'], ['px:28995187', 'wash valet detail full'], ['px:14231669', 'foam detail wax']],
});
registerPhotos('gym', {
  heroes: ['px:4853332', 'px:35986381'],
  pool: [['px:4854256', 'personal training weights coach'], ['px:4854255', 'personal training coaching'], ['px:4853332', 'strength bench training coach'], ['px:35986381', 'personal training dumbbells strength']],
});
registerPhotos('auto', {
  heroes: ['px:3441895', 'px:12850801'],
  pool: [['px:3441895', 'repair engine servicing'], ['px:12850801', 'engine servicing service'], ['px:4116224', 'repair diagnostics engine'], ['px:29965631', 'mot inspection check'], ['px:10490623', 'repair brakes tools']],
});
registerPhotos('physio', {
  heroes: ['px:20860582', 'px:6094047'],
  pool: [['px:6094047', 'sports taping injury knee'], ['px:5793651', 'assessment posture'], ['px:20860606', 'massage back pain'], ['px:20860582', 'rehab exercise rehabilitation']],
});
registerPhotos('pets', {
  heroes: ['px:19145888', 'px:19145879'],
  pool: [['px:19145888', 'grooming bath wash'], ['px:6131165', 'bath wash puppy'], ['px:16145290', 'wash bath'], ['px:19145879', 'grooming brush trim groom']],
});

/* 10 Nov 2026: industry-match pass.
   - Neutral or off-trade shots are kept only for services that ask for them ({ only: true }), never as general fill:
     a plain kitchen (plumbing), city towers (estate agents), a body massage (hair salon), an empty boardroom (solicitors).
   - New Pexels shots, found via their pexels.com/photo pages, fetched (HTTP 200, image/jpeg at 360 and 1600 wide) and viewed.
   - More hero choices so each design number shows a different hero. */
LIB.photos.plumbing.pool.push(['1556911220-bff31c812dba', 'kitchen sink', { only: true }]);
LIB.photos.plumbing.heroes.push('px:6419128', 'px:7859953', 'px:5691536', '1607472586893-edb57bdc0e39');
LIB.photos.realestate.pool.push(['1582407947304-fd86f028f716', 'commercial office', { only: true }],
  ['px:23224991', 'viewing viewings buyers agent couple house'], ['px:7641868', 'viewing viewings buyers agent couple valuation'],
  ['px:7937361', 'viewing new build buyers agent tour'], ['px:7415063', 'family buyers agent viewing kitchen'], ['px:8815932', 'keys buyers']);
LIB.photos.realestate.heroes.push('px:23224991', 'px:7641868', 'px:7937361', 'px:7415063', 'px:8815932');
LIB.photos.salon.pool.push(['1544161515-4ab6ce6db874', 'massage spa body', { only: true }]);
LIB.photos.law.pool.push(['1497366811353-6870744d04b2', 'office commercial', { only: true }],
  ['px:7876104', 'divorce family separation couple advice'], ['px:5668806', 'lawyers team solicitors about practice']);
LIB.photos.law.heroes.push('px:7875891', 'px:8112162', 'px:5668806', 'px:7876104');
LIB.photos.local.pool.push(['px:5668855', 'consultation client meeting desk advice'], ['px:7734650', 'client handshake customers welcome'],
  ['px:8512176', 'client desk appointment consultation office']);
LIB.photos.local.heroes.push('px:5668855', 'px:7734650', 'px:8512176');
