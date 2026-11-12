/* Content-editor contracts: every autosave goes through sanitizeSiteData + sanitizeOpts
   on /api/save, image swaps reuse /api/img (magic-byte check), and WebiMade plan
   prices stay server-set. */
import { strict as assert } from 'node:assert';
import {
  sanitizeSiteData, sanitizeOpts, applyPrices, sniffImage, PRICES, FIELD_LIMITS
} from '../src/security.mjs';

let failed = 0;
function check(name, fn) {
  try { fn(); console.log('ok ', name); }
  catch (e) { failed++; console.log('FAIL', name, e.message); }
}

check('editor payload is sanitized on save (HTML stripped, URLs allowlisted)', () => {
  const saved = sanitizeSiteData({
    name: '<script>x</script>Oak Studio',
    about: 'Hello <img src=x>',
    bookingUrl: 'https://cal.com/oak',
    services: [
      { name: 'Brand kit', desc: 'Full <b>kit</b>', price: '$1,200' },
      { name: 'Hourly', desc: 'Support', price: '$100 per hour' },
    ],
    photoOverrides: {
      hero: '/i/AbC123xyz0/Key456abcd',
      about: 'http://evil.example/x.jpg',
    },
  }, { allowData: false });
  assert.equal(saved.name, 'xOak Studio');
  assert.ok(!saved.about.includes('<'));
  assert.equal(saved.bookingUrl, 'https://cal.com/oak');
  assert.equal(saved.services.length, 2);
  assert.equal(saved.services[1].price, '$100 per hour');
  assert.equal(saved.photoOverrides.hero, '/i/AbC123xyz0/Key456abcd');
  assert.ok(!saved.photoOverrides.about);
  const opts = sanitizeOpts({ headline: '<i>New</i> look', lead: 'Warm welcome', setup: 1 });
  assert.equal(opts.headline, 'New look');
  assert.equal(opts.setup, undefined);
});

check('autosave cannot change WebiMade plan prices', () => {
  const p = applyPrices({ setup: 1, monthly: 1, dueToday: 0, domain: 'connect' });
  assert.equal(p.setup, PRICES.setup);
  assert.equal(p.monthly, PRICES.monthly);
  assert.equal(p.dueToday, 89);
});

check('image swap only accepts real JPEG/PNG/WebP bytes', () => {
  assert.equal(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(sniffImage(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg">')), null);
  assert.equal(FIELD_LIMITS.headline, 90);
});

if (failed) { console.log(failed + ' failed'); process.exit(1); }
console.log('all editor unit tests passed');
