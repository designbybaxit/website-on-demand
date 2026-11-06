/* ---------------- Runtime shipped inside each generated site (vanilla JS) ---------------- */
function siteRuntime() {
  var d = document, root = d.querySelector('.site'); if (!root) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
  root.classList.add('js'); root.classList.remove('nojs');
  $$('.hero h1 .w').forEach(function (w, i) { w.style.setProperty('--wi', i); });
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('ready'); }); });

  /* scroll reveal, staggered per parent */
  var rev = $$('.reveal, .steps li');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el) {
      var sib = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
      el.style.setProperty('--d', (Math.max(0, sib.indexOf(el)) % 6) * 0.08 + 's'); io.observe(el);
    });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* header state, progress bar, hero parallax (transform only) */
  var hdr = root.querySelector('.hdr'), bar = root.querySelector('.progress');
  var par = root.querySelector('.hero .bgimg img, .hero-img img, .arch');
  var queued = false;
  function onScroll() {
    queued = false; var y = window.scrollY || 0;
    if (hdr) hdr.classList.toggle('scrolled', y > 10);
    var h = d.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    if (par && !reduce && y < 1400) par.style.setProperty('--py-img', Math.min(y * 0.08, 36).toFixed(1) + 'px');
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();

  /* mobile menu */
  var burger = root.querySelector('.burger'), mnav = root.querySelector('#mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () { var o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); mnav.classList.toggle('open', o); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open'); }); });
  }

  /* count-up stats: the real number is in the HTML; JS only animates it */
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      var el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
      var fmt = function (v) { return (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-GB')) + suf; };
      if (reduce) { el.textContent = fmt(to); return; }
      var t0 = performance.now();
      (function tick(t) { var p = Math.min(1, (t - t0) / 1600), k = 1 - Math.pow(1 - p, 4); el.textContent = fmt(to * k); if (p < 1) requestAnimationFrame(tick); })(t0);
    }); }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* hero tilt + parallax chips (mouse only) */
  var vis = root.querySelector('[data-tilt]'), hero = root.querySelector('.hero');
  if (hero && fine && !reduce) {
    var img = vis && vis.querySelector('.hero-img'), deps = $$('[data-depth]', hero);
    hero.addEventListener('pointermove', function (ev) {
      var r = hero.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      if (img) { img.style.setProperty('--ry', x * 8 + 'deg'); img.style.setProperty('--rx', -y * 8 + 'deg'); }
      deps.forEach(function (c) { var k = +c.dataset.depth; c.style.setProperty('--px', -x * k + 'px'); c.style.setProperty('--py', -y * k + 'px'); });
    });
    hero.addEventListener('pointerleave', function () {
      if (img) { img.style.setProperty('--ry', '0deg'); img.style.setProperty('--rx', '0deg'); }
      deps.forEach(function (c) { c.style.setProperty('--px', '0px'); c.style.setProperty('--py', '0px'); });
    });
  }

  /* single-choice chip groups (days, times, urgency) */
  $$('[data-chips]').forEach(function (g) { g.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    $$('button', g).forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
    b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
  }); });

  /* tabs (menu) with arrow-key support */
  $$('[role=tablist]').forEach(function (list) {
    var tabs = $$('[role=tab]', list);
    function sel(t) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        var p = x.getAttribute('aria-controls') && root.querySelector('#' + x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t); });
      t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (n) { var nt = tabs[(i + n + tabs.length) % tabs.length]; sel(nt); nt.focus(); } });
    });
  });

  /* salon: build-your-booking basket with a live total */
  var basket = root.querySelector('[data-basket]');
  if (basket) {
    var cur = basket.closest('.basket').dataset.cur || '', tot = root.querySelector('[data-total]');
    var money = function (n) { return cur + (n % 1 ? n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toLocaleString('en-GB')); };
    var redraw = function () {
      var on = $$('.add[aria-pressed="true"]'), sum = 0;
      basket.innerHTML = on.length ? on.map(function (b) { sum += +b.dataset.price || 0; return '<li><span>' + b.dataset.name.replace(/</g, '&lt;') + '</span><span>' + money(+b.dataset.price || 0) + '</span></li>'; }).join('') : '<li class="empty">Tap + to add a service</li>';
      if (tot) tot.textContent = money(sum);
    };
    $$('.add').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); redraw(); }); });
    redraw();
  }

  /* two-step quote / case review */
  $$('[data-quote]').forEach(function (f) {
    var panes = $$('.qpane', f), bars = $$('.qsteps span', f), price = f.querySelector('[data-qprice]');
    function go(n) { panes.forEach(function (p, i) { p.hidden = i !== n; }); bars.forEach(function (b, i) { b.classList.toggle('on', i <= n); }); }
    $$('.qopt', f).forEach(function (o) { o.addEventListener('click', function () {
      $$('.qopt', f).forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      o.classList.add('is-on'); o.setAttribute('aria-pressed', 'true'); if (price) price.textContent = o.dataset.price || 'Ask us';
    }); });
    $$('[data-next]', f).forEach(function (b) { b.addEventListener('click', function () { go(1); }); });
    $$('[data-back]', f).forEach(function (b) { b.addEventListener('click', function () { go(0); }); });
  });

  /* real estate search tabs */
  $$('.hs-tabs').forEach(function (g) { g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', g).forEach(function (x) { x.setAttribute('aria-selected', x === b); }); }); });

  /* mortgage calculator */
  $$('[data-calc]').forEach(function (c) {
    var cur = c.dataset.cur || '', v = function (k) { return +c.querySelector('[data-k=' + k + ']').value; }, o = function (k) { return c.querySelector('[data-o=' + k + ']'); };
    var money = function (n) { return cur + Math.round(n).toLocaleString('en-GB'); };
    function calc() {
      var P = v('price') * (1 - v('dep') / 100), r = v('rate') / 1200, n = v('term') * 12, pm = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
      o('price').textContent = money(v('price')); o('dep').textContent = v('dep') + '%'; o('rate').textContent = v('rate').toFixed(1) + '%'; o('term').textContent = v('term') + ' years';
      o('pm').textContent = money(pm); o('loan').textContent = 'Loan ' + money(P) + ' over ' + v('term') + ' years';
    }
    $$('input', c).forEach(function (i) { i.addEventListener('input', calc); }); calc();
  });

  /* testimonial slider: buttons, dots, swipe, gentle autoplay */
  $$('.rv').forEach(function (s) {
    var track = s.querySelector('.rv-track'), cards = $$('.rv-card', s), dots = $$('.dots button', s), i = 0, timer = null;
    if (!track || cards.length < 2) return;
    function show(n) { i = (n + cards.length) % cards.length; track.style.transform = 'translateX(' + (-100 * i) + '%)';
      dots.forEach(function (d0, k) { d0.setAttribute('aria-current', k === i ? 'true' : 'false'); }); cards.forEach(function (c, k) { c.setAttribute('aria-hidden', k !== i); }); }
    var nx = s.querySelector('.next'), pv = s.querySelector('.prev');
    if (nx) nx.addEventListener('click', function () { show(i + 1); restart(); });
    if (pv) pv.addEventListener('click', function () { show(i - 1); restart(); });
    dots.forEach(function (d0, k) { d0.addEventListener('click', function () { show(k); restart(); }); });
    var x0 = null; track.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    track.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; if (Math.abs(dx) > 40) { show(i + (dx < 0 ? 1 : -1)); restart(); } x0 = null; });
    function restart() { if (reduce) return; clearInterval(timer); timer = setInterval(function () { if (!d.hidden) show(i + 1); }, 6500); }
    s.addEventListener('mouseenter', function () { clearInterval(timer); }); s.addEventListener('mouseleave', restart);
    show(0); restart();
  });

  /* gallery film strip: arrow buttons scroll the strip (it also scrolls by touch / trackpad / keyboard) */
  $$('[data-strip]').forEach(function (st) {
    var sec = st.closest('section'); if (!sec) return;
    var go = function (dir) { st.scrollBy({ left: dir * Math.max(240, st.clientWidth * 0.7), behavior: reduce ? 'auto' : 'smooth' }); };
    var n = sec.querySelector('[data-strip-next]'), p = sec.querySelector('[data-strip-prev]');
    if (n) n.addEventListener('click', function () { go(1); });
    if (p) p.addEventListener('click', function () { go(-1); });
  });

  /* before / after: the range input drives the split (keyboard and touch work too) */
  $$('[data-ba]').forEach(function (ba) {
    var r = ba.querySelector('.ba-r'); if (!r) return;
    var set = function (v) { ba.style.setProperty('--pos', v + '%'); };
    r.addEventListener('input', function () { set(r.value); });
    var sec = ba.closest('section');
    $$('.ba-p', sec).forEach(function (b) { b.addEventListener('click', function () {
      $$('.ba-p', sec).forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
      var ia = ba.querySelector('.ba-a'), ib = ba.querySelector('.ba-b img');
      ia.src = b.dataset.a; ib.src = b.dataset.b; ia.alt = ia.alt.replace(/after.*$/, 'after: ' + b.dataset.t); ib.alt = ib.alt.replace(/before.*$/, 'before: ' + b.dataset.t);
      r.value = 50; set(50);
    }); });
    /* a one-time nudge when it scrolls into view, so people see it moves */
    if ('IntersectionObserver' in window && !reduce && !root.classList.contains('pv')) {
      var bo = new IntersectionObserver(function (es) { es.forEach(function (e) {
        if (!e.isIntersecting) return; bo.disconnect(); var t0 = performance.now();
        (function tick(t) { var p = Math.min(1, (t - t0) / 1400), v = 50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p); set(v.toFixed(1)); if (p < 1) requestAnimationFrame(tick); else set(r.value); })(t0);
      }); }, { threshold: 0.5 });
      bo.observe(ba);
    }
  });

  /* quick-action strip: today's opening hours from the client's own lines */
  $$('[data-today]').forEach(function (el) {
    var wk; try { wk = JSON.parse(el.getAttribute('data-today')); } catch (_) { return; }
    var t = wk && wk[new Date().getDay()]; if (!t) return;
    var lab = el.parentNode.querySelector('[data-today-label]');
    if (/closed/i.test(t)) { if (lab) lab.textContent = 'Today'; el.textContent = 'Closed today'; }
    else { if (lab) lab.textContent = 'Open today'; el.textContent = t; }
  });

  /* in-page links: scroll inside this document (a new-tab or framed preview has no real URL, so a bare #hash would navigate away) */
  root.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1); e.preventDefault();
    var t = id && d.getElementById(id); if (!t) return;
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (t.matches('section') && !t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    try { t.focus({ preventScroll: true }); } catch (_) {}
  });

  /* service links pre-select the form */
  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { var s = root.querySelector('#book select[data-service]'); if (s) s.value = a.dataset.pick; }); });

  /* preview forms never send: open the modal instead */
  var modal = root.querySelector('.modal');
  function openM() { if (!modal) return; modal.hidden = false; var b = modal.querySelector('.m-x'); if (b) b.focus(); }
  function closeM() { if (modal) modal.hidden = true; }
  var lead = root.getAttribute('data-lead');
  function sendLead(f) {
    /* live sites only: post the enquiry to our server; preview sites never send */
    var o = {}; try { new FormData(f).forEach(function (v, k) { if (k === 'company_url' || typeof v !== 'string' || !v) return; o[k] = o[k] ? o[k] + ', ' + v : v; }); } catch (_) {}
    $$('[data-chips] [aria-pressed=true], .qopt[aria-pressed=true]', f).forEach(function (c, i) { o['choice' + (i || '')] = c.textContent.trim(); });
    var msg = modal && modal.querySelector('[data-m-msg]');
    fetch(lead, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ fields: o, page: location.href }) })
      .then(function (r) { if (!r.ok) throw 0; }).catch(function () { if (msg) msg.textContent = 'Sorry, that did not go through. Please call or message us instead.'; });
  }
  $$('[data-demo-form]').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); var hp = f.querySelector('[name=company_url]'); if (hp && hp.value) return; if (lead) sendLead(f); openM(); }); });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.m-x')) closeM(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM(); });
}
