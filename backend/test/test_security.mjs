import { strict as assert } from 'node:assert';
import {
  safeUrl, sanitizeSiteData, sanitizeOpts, applyPrices, sniffImage, leadHasHoneypot,
  adminHostAllowed, isAdminPath, PRICES, stripHtml, clipText, FIELD_LIMITS
} from '../src/security.mjs';

let failed = 0;
function check(name, fn) {
  try { fn(); console.log('ok ', name); }
  catch (e) { failed++; console.log('FAIL', name, e.message); }
}

check('allows https and /i/ uploads', () => {
  assert.equal(safeUrl('https://images.pexels.com/photos/1.jpg'), 'https://images.pexels.com/photos/1.jpg');
  assert.equal(safeUrl('/i/AbC123xyz0/Key456abcd'), '/i/AbC123xyz0/Key456abcd');
  assert.equal(safeUrl('https://webimade.com/i/AbC123xyz0/Key456abcd'), 'https://webimade.com/i/AbC123xyz0/Key456abcd');
});
check('rejects javascript, data, http, protocol-relative, and quoted breakout', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('data:text/html;base64,AAAA'), '');
  assert.equal(safeUrl('http://evil.example/x.jpg'), '');
  assert.equal(safeUrl('//evil.example/x.jpg'), '');
  assert.equal(safeUrl('/i/x/y" onerror="alert(1)'), '');
  assert.equal(safeUrl('/i/../etc/passwd'), '');
});
check('social is https-only; data images only in preview kind', () => {
  assert.equal(safeUrl('javascript:alert(1)', 'social'), '');
  assert.equal(safeUrl('/i/AbC123xyz0/Key456abcd', 'social'), '');
  assert.equal(safeUrl('https://instagram.com/shop', 'social'), 'https://instagram.com/shop');
  const data = 'data:image/png;base64,iVBORw0KGgo=';
  assert.equal(safeUrl(data, 'img'), '');
  assert.equal(safeUrl(data, 'preview'), data);
});
check('sanitizeSiteData strips bad logo, photos and socials', () => {
  const out = sanitizeSiteData({
    name: 'Ada',
    logo: 'javascript:alert(1)',
    photos: ['https://images.unsplash.com/a.jpg', 'javascript:x'],
    facebook: 'javascript:alert(1)',
    instagram: 'https://instagram.com/ok',
    other: '/i/not/asocial',
  });
  assert.equal(out.logo, '');
  assert.deepEqual(out.photos, ['https://images.unsplash.com/a.jpg']);
  assert.equal(out.facebook, '');
  assert.equal(out.instagram, 'https://instagram.com/ok');
  assert.equal(out.other, '');
  assert.equal(out.name, 'Ada');
});
check('applyPrices ignores client amounts', () => {
  const p = applyPrices({ domain: 'connect', dueToday: 0, setup: 1, monthly: 1, currency: 'XXX' });
  assert.equal(p.setup, 50);
  assert.equal(p.monthly, 29);
  assert.equal(p.dueToday, 89);
  assert.equal(p.currency, '$');
  assert.equal(p.domain, 'connect own domain');
  const q = applyPrices({ domain: 'free', dueToday: 0, setup: 0, monthly: 0 });
  assert.equal(q.dueToday, 79);
  assert.equal(q.domain, 'free address');
  assert.equal(PRICES.setup, 50);
});
check('sniffImage reads JPEG, PNG, WebP magic and rejects HTML', () => {
  assert.equal(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  const webp = new Uint8Array(12);
  webp.set([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
  assert.equal(sniffImage(webp), 'image/webp');
  assert.equal(sniffImage(new TextEncoder().encode('<!DOCTYPE html>')), null);
});
check('lead honeypot detects company_url', () => {
  assert.equal(leadHasHoneypot({ fields: { name: 'A' } }), false);
  assert.equal(leadHasHoneypot({ fields: { company_url: 'http://spam' } }), true);
  assert.equal(leadHasHoneypot({ company_url: 'x' }), true);
  assert.equal(leadHasHoneypot({ fields: { company_url: '  ' } }), false);
});
check('admin host is optional and matches Host exactly', () => {
  const req = host => ({ headers: { get: k => k.toLowerCase() === 'host' ? host : null }, url: 'https://' + (host || 'example') + '/admin' });
  assert.equal(adminHostAllowed(req('wod-brand-preview.designbybaxit.workers.dev'), {}), true);
  assert.equal(adminHostAllowed(req('evil.example'), { ADMIN_HOST: 'webimade.com' }), false);
  assert.equal(adminHostAllowed(req('webimade.com'), { ADMIN_HOST: 'webimade.com' }), true);
  assert.equal(adminHostAllowed(req('webimade.com:443'), { ADMIN_HOST: 'webimade.com' }), true);
  assert.equal(isAdminPath('/admin'), true);
  assert.equal(isAdminPath('/api/admin/list'), true);
  assert.equal(isAdminPath('/api/new'), false);
  assert.equal(isAdminPath('/'), false);
});

check('stripHtml and clipText remove tags and honour length limits', () => {
  assert.equal(stripHtml('Hi <script>alert(1)</script> there'), 'Hi alert(1) there');
  assert.equal(clipText('  hello   world  ', 20), 'hello world');
  assert.equal(clipText('x'.repeat(80), FIELD_LIMITS.name).length, 60);
  assert.equal(clipText('Mon: 9-5\nTue: 9-5', 300, true), 'Mon: 9-5\nTue: 9-5');
});

check('sanitizeSiteData strips HTML, clips fields, and sanitizes services and booking links', () => {
  const out = sanitizeSiteData({
    name: '<b>Ada</b> Studio',
    about: 'We are great.<img src=x onerror=alert(1)>',
    phone: '0113 496 0000',
    email: 'ada@example.com',
    bookingUrl: 'javascript:alert(1)',
    services: [
      { name: '<i>Design</i>', desc: 'Nice <script>x</script> work', price: 'From $100' },
      { name: '', desc: 'skip me', price: '1' },
    ],
    photoOverrides: {
      hero: 'https://images.pexels.com/photos/1.jpg',
      about: 'javascript:alert(1)',
      'services:0': '/i/AbC123xyz0/Key456abcd',
      evil: 'https://example.com/x.jpg',
    },
  });
  assert.equal(out.name, 'Ada Studio');
  assert.ok(!out.about.includes('<'));
  assert.equal(out.bookingUrl, '');
  assert.equal(out.services.length, 1);
  assert.equal(out.services[0].name, 'Design');
  assert.ok(!out.services[0].desc.includes('<'));
  assert.equal(out.services[0].price, 'From $100');
  assert.equal(out.photoOverrides.hero, 'https://images.pexels.com/photos/1.jpg');
  assert.equal(out.photoOverrides['services:0'], '/i/AbC123xyz0/Key456abcd');
  assert.ok(!out.photoOverrides.about);
  assert.ok(!out.photoOverrides.evil);
});

check('sanitizeOpts keeps edited copy and drops unknown keys; does not set plan prices', () => {
  const o = sanitizeOpts({ headline: '<em>Fresh</em> start', lead: 'A'.repeat(500), ctaLabel: 'Book now', design: 2, setup: 1, monthly: 1, __proto__: { x: 1 }, nested: { a: 1 } });
  assert.equal(o.headline, 'Fresh start');
  assert.equal(o.lead.length, FIELD_LIMITS.lead);
  assert.equal(o.ctaLabel, 'Book now');
  assert.equal(o.design, 2);
  assert.equal(o.setup, undefined);
  assert.equal(o.monthly, undefined);
  assert.equal(o.nested, undefined);
});

if (failed) { console.log(failed + ' failed'); process.exit(1); }
console.log('all security unit tests passed');
