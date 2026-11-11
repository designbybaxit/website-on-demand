/* ---------------- CSS: tokens once in the root, everything derives from them ---------------- */
function siteCSS(M) {
  const { S, P, key } = M;
  const headFont = S.headSerif ? 'var(--display)' : 'var(--sans)';
  const emFont = S.italic || 'var(--display)';
  const emRule = S.em === 'mark'
    ? `font-style:normal;color:inherit;background:linear-gradient(transparent 58%, var(--accent) 58%, var(--accent) 92%, transparent 92%);padding:0 .08em;`
    : S.em === 'color' ? `font-style:normal;color:var(--accent-text);`
    : `font-family:${emFont};font-style:${S.emStyle || 'italic'};font-weight:400;letter-spacing:-0.01em;color:var(--accent-text);`;
  const btnR = S.btnRadius || '999px';
  const SEC = { compact: '4.8rem', regular: '6rem', airy: '7.5rem' }[S.density] || '6rem';
  return `
.site{--bg:${P.bg};--surface:${P.surface};--text:${P.text};--muted:${P.muted};--brand:${P.brand};--btn:${P.btn};--on-btn:${P.onBtn};--accent:${P.accent};--soft:${P.soft};--accent-text:${P.accentText};--warm:${P.warm};--line:${P.line};--deep:${P.deep};--on-deep:${P.onDeep};${P.custom ? `--star:${P.dark ? P.accentText : P.accent};` : ''}
 --radius:${S.radius}px;--ease:cubic-bezier(.2,.8,.2,1);--spring:cubic-bezier(.34,1.56,.64,1);--display:${S.display};--sans:${S.sans};--sec:${SEC};--shadow:0 30px 60px -30px ${P.dark ? 'rgba(0,0,0,.7)' : rgba(/^#/.test(P.text) ? P.text : '#000000', .35)};
 position:relative;margin:0;background:var(--bg);color:var(--text);font:400 16px/1.6 var(--sans);overflow-x:clip;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.site *,.site *::before,.site *::after{box-sizing:border-box}
.site img{max-width:100%;height:auto;display:block}
.site a{color:inherit}
.site p{margin:0}
.site h1,.site h2,.site h3,.site h4{margin:0;font-family:${headFont};font-weight:${S.headWeight};letter-spacing:${S.headLs};line-height:1.08}
.site h1 em,.site h2 em,.site h3 em{${emRule}}
.site .wrap{width:min(1200px,100% - 2.5rem);margin-inline:auto}
.site .skip{position:absolute;left:-999px;top:0;background:var(--btn);color:var(--on-btn);padding:.6rem 1rem;z-index:100}
.site .skip:focus{left:1rem}
.site :focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:8px}
.site .i{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.site .wa-ic{width:20px;height:20px;flex:none}
.site .eyebrow{display:inline-flex;align-items:center;gap:.55rem;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-text)}
.site .eyebrow::before{content:"";width:22px;height:2px;background:currentColor;border-radius:2px;opacity:.7}
.site .head .eyebrow::before,.site .center .eyebrow::before{display:none}

/* progress bar */
.site .progress{position:fixed;left:0;right:0;top:0;height:3px;z-index:80;background:linear-gradient(90deg,var(--accent),var(--brand));transform-origin:0 50%;transform:scaleX(0);pointer-events:none}

/* top bar */
.site .topbar{background:var(--deep);color:${P.dark ? 'var(--muted)' : 'rgba(255,255,255,.82)'};font-size:13px;position:relative;z-index:51}
.site .topbar-in{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 0;align-items:center}
.site .topbar a{text-decoration:none;font-weight:700;color:#fff;display:inline-flex;gap:.4rem;align-items:center}
.site .topbar .i{width:15px;height:15px}
.site .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#3ee08f;box-shadow:0 0 0 0 rgba(62,224,143,.6);animation:s-ping 2s infinite;vertical-align:middle;margin-right:.4rem}
@keyframes s-ping{70%{box-shadow:0 0 0 8px rgba(62,224,143,0)}100%{box-shadow:0 0 0 0 rgba(62,224,143,0)}}

/* header */
.site .hdr{position:sticky;top:0;z-index:50;background:${P.dark ? rgba(/^#/.test(P.bg) ? P.bg : '#111111', .78) : rgba(/^#/.test(P.bg) ? P.bg : '#ffffff', .82)};backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid transparent;transition:border-color .3s,box-shadow .3s}
.site .hdr.scrolled{border-color:var(--line);box-shadow:0 10px 30px -22px rgba(0,0,0,.45)}
.site .hdr-in{display:flex;align-items:center;justify-content:space-between;gap:1rem;height:76px}
.site .brand{display:inline-flex;align-items:center;gap:.65rem;text-decoration:none;font-size:1.06rem;letter-spacing:-0.02em;min-width:0}
.site .brand b{font-weight:800}
.site .brand > span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.site .logo-mark{width:40px;height:40px;flex:none;border-radius:12px;display:grid;place-items:center;background:var(--brand);color:${lumC(P.brand) > .6 ? '#141414' : '#fff'};font:800 15px/1 var(--sans);letter-spacing:.02em;transition:transform .6s var(--spring)}
.site .logo-mark.img{background:transparent;width:auto;max-width:120px;height:44px;border-radius:0}
.site .logo-mark.img img{max-height:44px;width:auto}
.site .brand:hover .logo-mark{transform:rotate(-8deg) scale(1.06)}
.site .nav{display:flex;gap:1.8rem;font-size:15px;font-weight:500}
.site .nav a{text-decoration:none;color:var(--muted);position:relative;padding:.2rem 0;transition:color .25s}
.site .nav a::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .35s var(--ease)}
.site .nav a:hover{color:var(--text)}
.site .nav a:hover::after{transform:scaleX(1)}
.site .hdr-cta{display:flex;gap:.6rem;align-items:center;flex:none}
.site .burger{display:none;width:44px;height:44px;border:1px solid var(--line);background:var(--surface);border-radius:12px;cursor:pointer;position:relative;color:var(--text)}
.site .burger span{position:absolute;left:12px;right:12px;height:2px;background:currentColor;transition:transform .3s var(--ease)}
.site .burger span:first-child{top:17px}.site .burger span:last-child{top:25px}
.site .burger[aria-expanded="true"] span:first-child{transform:translateY(4px) rotate(45deg)}
.site .burger[aria-expanded="true"] span:last-child{transform:translateY(-4px) rotate(-45deg)}
.site .mnav{display:none}

/* buttons */
.site .btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.55rem;padding:.75rem 1.25rem;border-radius:${btnR};font:600 15px/1 var(--sans);text-decoration:none;border:1px solid transparent;cursor:pointer;transition:transform .35s var(--ease),box-shadow .35s,background-color .3s,border-color .3s,color .3s;white-space:nowrap}
.site .btn .i{width:18px;height:18px;stroke-width:2;transition:transform .35s var(--ease)}
.site .btn::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:translateX(-160%) skewX(-18deg);pointer-events:none}
.site .btn-primary{background:var(--btn);color:var(--on-btn);box-shadow:0 12px 26px -14px ${P.dark ? 'rgba(0,0,0,.8)' : rgba(/^#/.test(P.btn) ? P.btn : '#000000', .85)}}
.site .btn-ghost{background:${P.dark ? 'transparent' : 'var(--surface)'};border-color:var(--line);color:var(--text)}
.site .btn-light{background:#fff;color:#141414}
.site .btn-wa{background:#1fae5b;color:#fff}
.site .btn-lg{padding:1.02rem 1.65rem;font-size:16px}
.site .btn-block{width:100%}
@media (hover:hover) and (pointer:fine){
 .site .btn:hover{transform:translateY(-2px)}
 .site .btn:hover .i{transform:translateX(4px)}
 .site .btn-primary:hover::after,.site .btn-light:hover::after{transform:translateX(330%) skewX(-18deg);transition:transform .9s var(--ease)}
 .site .btn-ghost:hover{border-color:var(--text)}
}
.site .btn:active{transform:translateY(1px)}
.site .link{font-weight:700;font-size:14px;text-decoration:none;color:var(--accent-text);display:inline-flex;align-items:center;gap:.35rem}
.site .link .i{width:16px;height:16px;transition:transform .3s var(--ease)}
.site .link:hover .i{transform:translateX(4px)}

/* hero shared */
.site .hero{position:relative;padding:4.5rem 0 5rem;overflow:hidden;isolation:isolate}
.site .hero-bg{position:absolute;inset:0;z-index:-1;pointer-events:none}
.site .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55}
.site .b1{width:540px;height:540px;background:var(--soft);top:-170px;right:-90px;animation:s-drift 14s ease-in-out infinite alternate}
.site .b2{width:400px;height:400px;background:var(--warm);bottom:-170px;left:-130px;opacity:.42;animation:s-drift 18s ease-in-out infinite alternate-reverse}
.site .b3{width:260px;height:260px;background:var(--accent);top:40%;left:42%;opacity:.12;animation:s-drift 22s ease-in-out infinite alternate}
@keyframes s-drift{to{transform:translate(40px,30px) scale(1.08)}}
.site .hero-grid{position:relative;display:grid;grid-template-columns:1.05fr 1fr;gap:3.5rem;align-items:center}
.site .hero h1{font-size:clamp(2.6rem,5.6vw,4.6rem);margin-top:1rem}
.site .hero h1 .w{display:inline-block}
.site .lead{margin-top:1.4rem;font-size:1.12rem;color:var(--muted);max-width:35rem}
.site .hero-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:2rem}
.site .proof{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;margin-top:2rem;font-size:14px;color:var(--muted)}
.site .proof span{display:inline-flex;align-items:center;gap:.4rem}
.site .proof .i{width:17px;height:17px;color:var(--accent-text);stroke-width:2.2}
.site .hero-visual{position:relative;perspective:1200px}
.site .hero-img{border-radius:32px;overflow:hidden;box-shadow:var(--shadow);aspect-ratio:11/10;transform:rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg));transition:transform .5s var(--ease);background:var(--soft)}
.site .hero-img img{width:100%;height:100%;object-fit:cover;transform:translateY(var(--py-img,0px)) scale(1.14)}
.site .chip{position:absolute;display:flex;align-items:center;gap:.7rem;background:${P.dark ? 'rgba(20,16,13,.86)' : 'rgba(255,255,255,.92)'};color:var(--text);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:.8rem 1rem;border-radius:18px;box-shadow:0 20px 40px -20px rgba(0,0,0,.45);font-size:14px;border:1px solid var(--line);transform:translate(var(--px,0),var(--py,0));transition:transform .5s var(--ease);max-width:240px}
.site .chip small{display:block;font-size:12px;color:var(--muted);line-height:1.3}
.site .chip b{font-weight:700;display:block;line-height:1.3}
.site .chip-ico{width:34px;height:34px;display:grid;place-items:center;background:var(--soft);color:var(--accent-text);border-radius:10px;flex:none}
.site .chip-ico .i{width:18px;height:18px}
.site .chip-a{left:-6%;top:9%;animation:s-bob 6s ease-in-out infinite}
.site .chip-b{right:-5%;top:52%;animation:s-bob 7s ease-in-out infinite .6s}
.site .chip-c{left:12%;bottom:-5%;animation:s-bob 6.5s ease-in-out infinite 1.2s}
@keyframes s-bob{50%{translate:0 -8px}}

/* ribbon / marquee */
.site .ribbon{overflow:hidden;border-block:1px solid var(--line);background:var(--surface);padding:1.05rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.site .ribbon-track{display:flex;gap:2.2rem;width:max-content;animation:s-marq 32s linear infinite;align-items:center}
.site .ribbon:hover .ribbon-track{animation-play-state:paused}
.site .ribbon span{font:${S.headSerif ? 'italic 400 1.45rem/1 var(--display)' : '700 1.05rem/1 var(--sans)'};white-space:nowrap;${S.headSerif ? '' : 'text-transform:uppercase;letter-spacing:.06em;'}}
.site .ribbon i{font-style:normal;color:var(--accent-text);font-size:1rem}
@keyframes s-marq{to{transform:translateX(-50%)}}

/* sample tag (preview only) */
.site .sample-tag{display:inline-flex;align-items:center;gap:.35rem;font:700 11px/1.2 var(--sans);letter-spacing:.04em;text-transform:none;padding:.32rem .6rem;border-radius:999px;background:#fff4c2;color:#6b4e00;border:1px dashed #c9a000}
.site .sample-tag::before{content:"◆";font-size:9px}
.site .sample-row{display:flex;justify-content:center;margin-top:1rem}

/* stats */
.site .stats{padding:0 0 2.5rem}
.site .stats-grid{display:grid;grid-template-columns:repeat(var(--n,4),1fr);background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);position:relative}
.site .stat{padding:1.8rem 1.6rem;border-left:1px solid var(--line)}
.site .stat:first-child{border-left:0}
.site .stat b{display:block;font-size:2.5rem;letter-spacing:-0.04em;font-weight:800;line-height:1.1;font-family:${S.headSerif ? 'var(--display)' : 'var(--sans)'};${S.headSerif ? 'font-weight:500;' : ''}}
.site .stat span{font-size:14px;color:var(--muted)}
.site .stats.band{padding:4.5rem 0;background:var(--deep);color:var(--on-deep)}
.site .stats.band .stats-grid{background:transparent;border-color:rgba(255,255,255,.14)}
.site .stats.band .stat{border-color:rgba(255,255,255,.14)}
.site .stats.band .stat b{color:${S.btnFrom === 'accent' ? 'var(--accent)' : '#fff'}}
.site .stats.band .stat span{color:rgba(255,255,255,.72)}

/* sections */
.site .section{padding:var(--sec) 0;position:relative}
.site .section.alt{background:var(--surface)}
.site .head{max-width:660px;margin:0 auto 3.2rem;text-align:center}
.site .head.left{text-align:left;margin:0}
.site .head h2,.site .h2{font-size:clamp(2rem,4vw,3.2rem);margin-top:.8rem}
.site .head p:not(.eyebrow){margin-top:1rem;color:var(--muted)}

/* service cards */
.site .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}
.site .cards.n2{grid-template-columns:repeat(2,1fr)}
.site .cards.n4{grid-template-columns:repeat(2,1fr)}
.site .card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.8rem;transition:transform .45s var(--ease),box-shadow .45s,border-color .45s;position:relative;overflow:hidden;display:flex;flex-direction:column}
.site .section.alt .card{background:var(--bg)}
.site .card::before{content:"";position:absolute;right:-70px;bottom:-90px;width:220px;height:220px;border-radius:50%;background:var(--soft);transform:scale(0);transition:transform .6s var(--ease)}
.site .card > *{position:relative}
.site .ico{width:54px;height:54px;border-radius:16px;background:var(--soft);color:var(--accent-text);display:grid;place-items:center;margin-bottom:1.2rem;transition:transform .5s var(--spring),background-color .4s,color .4s}
.site .ico .i{width:26px;height:26px}
.site .card h3{font-size:1.25rem;font-family:${S.headSerif && S.id !== 'oxblood' ? 'var(--display)' : 'var(--sans)'};${S.headSerif && S.id !== 'oxblood' ? '' : 'font-weight:700;'}}
.site .card p{margin-top:.5rem;color:var(--muted);font-size:15px;flex:1}
.site .card .price{margin-top:1rem;font-weight:800;font-size:15px;color:var(--text)}
.site .dur{font-size:13px;letter-spacing:.04em;color:var(--accent-text);font-weight:650}
.site .card .dur{margin-top:.2rem}
.site .card .link{margin-top:1rem}
@media (hover:hover) and (pointer:fine){
 .site .card:hover{transform:translateY(-6px);box-shadow:var(--shadow);border-color:transparent}
 .site .card:hover::before{transform:scale(1.6)}
 .site .card:hover .ico{transform:rotate(-8deg) scale(1.08);background:var(--btn);color:var(--on-btn)}
}

/* split */
.site .split{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center}
.site .split.rev .split-media{order:2}
.site .split-media{position:relative}
.site .split-media .frame{border-radius:28px;overflow:hidden;aspect-ratio:5/4;background:var(--soft)}
.site .split-media img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.site .split-media:hover img{transform:scale(1.04)}
.site .badge-float{position:absolute;right:-1.2rem;bottom:-1.2rem;background:var(--deep);color:#fff;border-radius:22px;padding:1.1rem 1.3rem;display:flex;gap:.8rem;align-items:center;box-shadow:var(--shadow);max-width:280px}
.site .badge-float .bi{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.1);display:grid;place-items:center;color:var(--accent);flex:none}
.site .badge-float b{display:block;font-size:1rem}
.site .badge-float span{font-size:13px;line-height:1.35;opacity:.82}
.site .split-copy h2{font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 1.6rem}
.site .checks{list-style:none;margin:0 0 2rem;padding:0;display:grid;gap:1rem}
.site .checks li{padding-left:2.3rem;position:relative;color:var(--muted)}
.site .checks li b{color:var(--text)}
.site .checks li::before{content:"✓";position:absolute;left:0;top:.05rem;width:1.55rem;height:1.55rem;border-radius:50%;background:var(--soft);color:var(--accent-text);font-weight:800;font-size:13px;display:grid;place-items:center}

/* process */
.site .steps{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
.site .steps li{padding:1.7rem 1.6rem 0 0;position:relative;border-top:2px solid var(--line)}
.site .steps li::before{content:"";position:absolute;top:-2px;left:0;right:0;height:2px;background:var(--brand);transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease) .2s}
.site .steps li.in::before{transform:scaleX(1)}
.site .steps .num{font:italic 400 2.2rem/1 ${emFont};color:var(--accent-text)}
.site .steps h3{margin:.7rem 0 .4rem;font-size:1.2rem;font-family:var(--sans);font-weight:700;letter-spacing:-0.02em}
.site .steps p{color:var(--muted);font-size:15px}
.site .offer{margin-top:3rem;background:var(--deep);color:#fff;border-radius:28px;padding:2.6rem 3rem;display:flex;justify-content:space-between;align-items:center;gap:2rem;position:relative;overflow:hidden}
.site .offer::after{content:"";position:absolute;width:360px;height:360px;right:-80px;top:-150px;border-radius:50%;background:radial-gradient(circle,${rgba(/^#/.test(P.accent) ? P.accent : '#ffffff', .38)},transparent 70%);pointer-events:none}
.site .offer h3{font-size:clamp(1.6rem,3vw,2.3rem);margin:.5rem 0;color:#fff}
.site .offer h3 em{color:var(--accent)}
.site .offer p:not(.eyebrow){color:rgba(255,255,255,.75)}
.site .offer .eyebrow{color:var(--accent)}
.site .offer .btn{position:relative;z-index:1}

/* menu tabs (restaurant + salon) */
.site .menu-grid{display:grid;grid-template-columns:1fr;gap:2rem}
.site .menu-grid.with-basket{grid-template-columns:1.5fr .9fr;align-items:start}
.site .tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.6rem;justify-content:${key === 'salon' ? 'flex-start' : 'center'}}
.site .tab{font:600 15px/1 var(--sans);padding:.75rem 1.2rem;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--muted);cursor:pointer;transition:all .3s var(--ease)}
.site .tab[aria-selected="true"]{background:var(--btn);color:var(--on-btn);border-color:var(--btn)}
.site .tab:hover{transform:translateY(-2px);color:var(--text)}
.site .tab[aria-selected="true"]:hover{color:var(--on-btn)}
.site .menu-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:${key === 'salon' ? '1fr' : '1fr 1fr'};gap:.2rem 3rem}
.site .menu-list[hidden]{display:none}
.site .mi{display:grid;grid-template-columns:1fr auto;gap:.2rem 1rem;padding:1.15rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.site .mi h4{font:${S.headSerif ? '500 1.4rem/1.2 var(--display)' : '700 1.05rem/1.3 var(--sans)'};letter-spacing:-0.01em}
.site .mi p{grid-column:1/2;color:var(--muted);font-size:14.5px}
.site .mi.has-img{display:flex;gap:1rem;align-items:center}.site .mi-img{width:72px;height:72px;flex:none;border-radius:14px;object-fit:cover}.site .mi-b{flex:1;min-width:0;display:grid;grid-template-columns:1fr auto;gap:.2rem 1rem;align-items:baseline}.site .mi-b p{grid-column:1/-1}
.site .mi .pr{font-weight:700;color:var(--accent-text);white-space:nowrap}
.site .mi.svc{grid-template-columns:1fr auto auto;align-items:center}
.site .mi.svc .add{grid-row:1/3;grid-column:3;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--text);font-size:22px;line-height:1;cursor:pointer;display:grid;place-items:center;transition:transform .4s var(--spring),background-color .3s,color .3s}
.site .mi.svc .add[aria-pressed="true"]{background:var(--btn);color:var(--on-btn);border-color:var(--btn);transform:rotate(45deg)}
.site .mi.svc .add:hover{transform:scale(1.08)}
.site .mi.svc .add[aria-pressed="true"]:hover{transform:rotate(45deg) scale(1.08)}
.site .mi.svc .pr{grid-row:1/3;grid-column:2;align-self:center}
.site .basket{position:sticky;top:96px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.6rem;box-shadow:var(--shadow)}
.site .basket h3{font-size:1.4rem}
.site .basket ul{list-style:none;padding:0;margin:1rem 0;display:grid;gap:.55rem;min-height:2.5rem}
.site .basket li{display:flex;justify-content:space-between;gap:1rem;font-size:14.5px;animation:s-pop .4s var(--ease)}
.site .basket li span:last-child{font-weight:700}
.site .basket .empty{color:var(--muted);font-size:14px}
.site .basket .tot{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--line);padding-top:1rem;margin-bottom:1.2rem}
.site .basket .tot b{font:500 2rem/1 var(--display)}
@keyframes s-pop{from{opacity:0;transform:translateY(8px)}}

/* mortgage calculator (real estate) */
.site .calc{display:grid;grid-template-columns:1.1fr .9fr;gap:2.4rem;background:var(--surface);border:1px solid var(--line);border-radius:28px;padding:2.4rem;box-shadow:var(--shadow)}
.site .calc label{display:grid;gap:.5rem;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:1.3rem}
.site .calc .row{display:flex;justify-content:space-between;align-items:baseline}
.site .calc output{font:600 1.05rem var(--sans);color:var(--text);letter-spacing:0;text-transform:none}
.site input[type=range]{width:100%;accent-color:var(--brand);height:28px}
.site .calc-out{background:var(--deep);color:#fff;border-radius:22px;padding:2rem;display:flex;flex-direction:column;justify-content:center;gap:.6rem}
.site .calc-out .big{font:400 clamp(2.6rem,5vw,3.6rem)/1 var(--display);color:#fff}
.site .calc-out small{opacity:.75;font-size:13px}
.site .calc-out .btn{margin-top:1rem;align-self:flex-start}

/* gallery */
.site .gallery{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:240px;gap:1rem}
.site .gallery figure{margin:0;border-radius:var(--radius);overflow:hidden;position:relative;background:var(--soft)}
.site .gallery figure:first-child{grid-column:span 2;grid-row:span 2}
.site .gallery.g4 figure:last-child{grid-column:span 2}.site .gallery.g3{grid-template-columns:2fr 1fr 1fr}.site .gallery.g3 figure:first-child{grid-column:auto}.site .gallery.g2{grid-template-columns:1fr 1fr}.site .gallery.g2 figure:first-child,.site .gallery.g1 figure:first-child{grid-column:auto}.site .gallery.g1{grid-template-columns:1fr}
.site .gallery img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
@media (hover:hover) and (pointer:fine){.site .gallery figure:hover img{transform:scale(1.07)}}

/* reviews slider */
.site .rv{display:grid;grid-template-columns:.85fr 1.15fr;gap:3.5rem;align-items:center}
.site .rv-view{overflow:hidden;border-radius:28px}
.site .rv-track{display:flex;transition:transform .7s var(--ease)}
.site .rv-card{flex:0 0 100%;margin:0;background:${P.dark ? 'var(--surface)' : 'var(--bg)'};border:1px solid var(--line);border-radius:28px;padding:2.6rem;position:relative;min-height:290px;display:flex;flex-direction:column}
.site .section.alt .rv-card{background:var(--bg)}
.site .rv-card .qm{font:400 5rem/0.6 var(--display);color:var(--accent);height:2.2rem}
.site .rv-card p{font:400 clamp(1.35rem,2.4vw,1.75rem)/1.35 ${emFont};${S.em === 'mark' ? 'font-family:var(--sans);font-weight:500;letter-spacing:-0.02em;' : ''}flex:1;margin-top:.4rem}
.site .rv-card footer{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1.6rem;flex-wrap:wrap}
.site .rv-card cite{font:600 15px var(--sans);font-style:normal;display:flex;align-items:center;gap:.7rem}
.site .rv-card .av{width:42px;height:42px;border-radius:50%;background:var(--soft);color:var(--accent-text);display:grid;place-items:center;font-weight:800}
.site .stars{color:var(--star,#e7a300);letter-spacing:.08em;font-size:15px}
.site .rv-ctrl{display:flex;gap:.6rem;align-items:center;margin-top:2rem}
.site .rv-btn{width:48px;height:48px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer;display:grid;place-items:center;transition:transform .35s var(--spring),background-color .3s,color .3s}
.site .rv-btn:hover{background:var(--btn);color:var(--on-btn);transform:scale(1.06)}
.site .rv-btn .i{width:20px;height:20px}
.site .rv-btn.prev .i{transform:rotate(180deg)}
.site .dots{display:flex;gap:.4rem;margin-left:.6rem}
.site .dots button{width:9px;height:9px;border-radius:9px;border:0;background:var(--line);padding:0;cursor:pointer;transition:transform .35s var(--ease),background-color .3s}
.site .dots button[aria-current="true"]{background:var(--brand);transform:scaleX(2.2)}
.site.nojs .rv-ctrl{display:none}

/* booking / contact */
.site .book-sec{background:linear-gradient(180deg,var(--bg),var(--soft))}
.site .book{display:grid;grid-template-columns:1fr 1.05fr;gap:4rem;align-items:start}
.site .book-copy h2{font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 1rem}
.site .book-copy > p{color:var(--muted)}
.site .hours{list-style:none;padding:0;margin:2rem 0 0;border-top:1px solid var(--line)}
.site .hours li{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 0;border-bottom:1px solid var(--line);font-size:15px}
.site .hours span{color:var(--muted)}
.site .hours b{text-align:right;font-weight:600}
.site .hours a{text-decoration:none}
.site .form-card{background:var(--surface);border-radius:28px;padding:2rem;box-shadow:var(--shadow);display:grid;gap:1.1rem;border:1px solid var(--line);color:var(--text)}
.site .form-card label,.site .form-card legend{display:grid;gap:.45rem;font-size:12.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.site .form-card fieldset{border:0;padding:0;margin:0;min-width:0}
.site .form-card legend{margin-bottom:.45rem}
.site select,.site input[type=text],.site input[type=tel],.site input[type=email],.site input[type=number],.site input[type=date],.site textarea{font:500 16px var(--sans);color:var(--text);padding:.85rem 1rem;border:1px solid var(--line);border-radius:14px;background:var(--bg);width:100%;text-transform:none;letter-spacing:0;min-width:0}
.site textarea{min-height:110px;resize:vertical}
.site select:focus,.site input:focus,.site textarea:focus{outline:2px solid var(--accent);border-color:transparent}
.site .days{display:grid;grid-template-columns:repeat(5,1fr);gap:.5rem}
.site .slots{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}
.site .chipbtn{font:600 14px var(--sans);color:var(--text);background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:.7rem .3rem;cursor:pointer;transition:transform .25s var(--ease),background-color .25s,color .25s,border-color .25s;text-transform:none;letter-spacing:0;text-align:center}
.site .chipbtn small{display:block;font-weight:500;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.site .chipbtn:hover:not(:disabled){border-color:var(--text);transform:translateY(-2px)}
.site .chipbtn.is-on{background:var(--btn);color:var(--on-btn);border-color:var(--btn)}
.site .chipbtn.is-on small{color:inherit;opacity:.8}
.site .chipbtn:disabled{opacity:.4;text-decoration:line-through;cursor:not-allowed}
.site .row2{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
.site .fine{font-size:12px;color:var(--muted);text-align:center}
.site .fine a{color:inherit}
.site .hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}

/* two-step quote (home) and case review (law) */
.site .qcard{background:var(--surface);color:var(--text);border-radius:26px;padding:1.8rem;box-shadow:0 40px 80px -40px rgba(0,0,0,.6);border:1px solid var(--line);position:relative}
.site .qcard h3{font-size:1.45rem;font-family:var(--sans);font-weight:800;letter-spacing:-0.02em}
.site .qcard .sub{color:var(--muted);font-size:14px;margin-top:.3rem}
.site .qsteps{display:flex;gap:.4rem;margin:1.1rem 0 1.2rem}
.site .qsteps span{flex:1;height:5px;border-radius:5px;background:var(--line);position:relative;overflow:hidden}
.site .qsteps span::after{content:"";position:absolute;inset:0;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.site .qsteps span.on::after{transform:scaleX(1)}
.site .qopts{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}
.site .qopt{display:flex;gap:.6rem;align-items:center;text-align:left;font:600 14px/1.25 var(--sans);padding:.85rem .9rem;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer;transition:transform .25s var(--ease),border-color .25s,background-color .25s}
.site .qopt .i{width:20px;height:20px;color:var(--accent-text)}
.site .qopt:hover{transform:translateY(-2px);border-color:var(--text)}
.site .qopt.is-on{border-color:var(--text);background:var(--soft)}
.site .qpane[hidden]{display:none}
.site .qpane{display:grid;gap:.9rem}
.site .qpane label{display:grid;gap:.4rem;font-size:12.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.site .qresult{display:flex;justify-content:space-between;align-items:center;gap:1rem;background:var(--soft);border-radius:16px;padding:1rem 1.1rem;font-size:14px}
.site .qresult b{font-size:1.25rem;display:block;font-family:var(--sans)}
.site .qnav{display:flex;gap:.6rem;justify-content:space-between;margin-top:.4rem}

/* FAQ */
.site .faq-wrap{display:grid;grid-template-columns:.8fr 1.2fr;gap:4rem}
.site .faq-wrap .head a{font-weight:700}
.site .faq details{border-bottom:1px solid var(--line);padding:1.3rem 0}
.site .faq summary{cursor:pointer;list-style:none;font-weight:700;font-size:1.1rem;display:flex;justify-content:space-between;gap:1rem;align-items:center}
.site .faq summary::-webkit-details-marker{display:none}
.site .faq summary::after{content:"+";font-weight:400;font-size:1.7rem;line-height:1;transition:transform .35s var(--spring);color:var(--accent-text);flex:none}
.site .faq details[open] summary::after{transform:rotate(45deg)}
.site .faq details p{margin-top:.8rem;color:var(--muted)}
.site .faq details[open] p{animation:s-pop .45s var(--ease)}

/* CTA band (law) and area */
.site .cta-band{background:var(--deep);color:#fff;border-radius:30px;padding:3.4rem;display:flex;justify-content:space-between;align-items:center;gap:2rem;position:relative;overflow:hidden}
.site .cta-band h2{font-size:clamp(2rem,4vw,3rem);color:#fff}
.site .cta-band h2 em{color:var(--accent)}
.site .cta-band p{color:rgba(255,255,255,.75);margin-top:.6rem}
.site .area{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center}
.site .area span{padding:.6rem 1.1rem;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-weight:600;font-size:15px;display:inline-flex;gap:.4rem;align-items:center;transition:transform .3s var(--spring)}
.site .area span:hover{transform:translateY(-3px) rotate(-1.5deg)}
.site .area .i{width:16px;height:16px;color:var(--accent-text)}

/* footer */
.site .footer{background:var(--deep);color:rgba(255,255,255,.75);padding:3.5rem 0 6rem;font-size:14px}
.site .footer-in{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:2.5rem}
.site .footer .brand{color:#fff;margin-bottom:.8rem}
.site .footer .logo-mark{background:var(--accent);color:#141414}
.site .footer h4{font:700 12px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#fff;margin-bottom:1rem}
.site .footer ul{list-style:none;margin:0;padding:0;display:grid;gap:.5rem}
.site .footer a{text-decoration:none}
.site .footer a:hover{color:#fff}
.site .foot-base{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.12);margin-top:2.5rem;padding-top:1.4rem;font-size:13px}
.site .foot-base a{color:var(--accent)}
.site .legal{font-size:12.5px;opacity:.8;margin-top:1rem;max-width:720px}

/* fixed UI */
.site .wa-float{position:fixed;right:1.25rem;bottom:1.25rem;z-index:60;display:inline-flex;align-items:center;gap:.5rem;height:54px;padding:0 1.2rem 0 1rem;border-radius:999px;background:#1fae5b;color:#fff;font:700 14px var(--sans);text-decoration:none;box-shadow:0 16px 32px -14px rgba(0,0,0,.6);transition:transform .35s var(--spring)}
.site .wa-float .wa-ic{width:24px;height:24px}
.site .wa-float:hover{transform:translateY(-3px) scale(1.03)}
.site .wa-float::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 rgba(31,174,91,.55);animation:s-ring 2.6s infinite}
@keyframes s-ring{70%{box-shadow:0 0 0 14px rgba(31,174,91,0)}100%{box-shadow:0 0 0 0 rgba(31,174,91,0)}}
.site .callbar{display:none}
.site .modal{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:1.2rem;background:rgba(0,0,0,.5);backdrop-filter:blur(6px)}
.site .modal[hidden]{display:none}
.site .m-card{position:relative;width:min(460px,100%);background:var(--surface);color:var(--text);border-radius:26px;padding:2rem;box-shadow:var(--shadow);animation:s-pop .45s var(--ease)}
.site .m-card h3{font-size:1.6rem;margin:.5rem 0 .7rem}
.site .m-card p:not(.eyebrow){color:var(--muted)}
.site .m-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.4rem}
.site .m-x{position:absolute;top:.8rem;right:.8rem;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--surface);font-size:22px;cursor:pointer;color:var(--text)}

/* reveal: only hidden when JS runs, so the page is readable without it */
.site.js .reveal{opacity:0;transform:translateY(26px);transition:opacity .8s var(--ease),transform .8s var(--ease);transition-delay:var(--d,0s)}
.site.js .reveal.in{opacity:1;transform:none}
${motionCSS(M)}
.site.js .hero h1 .w{opacity:0;transform:translateY(.45em) rotate(2deg);transition:opacity .7s var(--ease),transform .9s var(--spring);transition-delay:calc(var(--wi,0) * 70ms + 120ms)}
.site.js.ready .hero h1 .w{opacity:1;transform:none}
.site section[id]{scroll-margin-top:84px}.site section[id]:focus{outline:none}
/* images in every section */
.site figure{margin:0}
.site .card.has-img{padding:0}
.site .card-img{aspect-ratio:16/10;overflow:hidden;background:var(--soft)}
.site .card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s var(--ease)}
.site .card.has-img:hover .card-img img{transform:scale(1.06)}
.site .card-body{padding:1.4rem 1.6rem 1.7rem;display:flex;flex-direction:column;flex:1}
.site .card.has-img .ico{position:relative;z-index:1;margin-top:-2.9rem;box-shadow:0 10px 24px -10px rgba(0,0,0,.35);border:3px solid var(--surface)}
.site .section.alt .card.has-img .ico{border-color:var(--bg)}
.site .step-img{aspect-ratio:16/10;border-radius:calc(var(--radius) * .8);overflow:hidden;margin-bottom:1.1rem;background:var(--soft)}
.site .step-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s var(--ease)}
.site .steps li:hover .step-img img{transform:scale(1.05)}
.site .menu-list .menu-img{grid-column:1/-1;aspect-ratio:21/7;border-radius:var(--radius);overflow:hidden;margin-bottom:1rem;padding:0;border:0;background:var(--soft)}
.site .menu-list .menu-img img{width:100%;height:100%;object-fit:cover;display:block}
.site .about{display:grid;grid-template-columns:1fr 1fr;gap:4.5rem;align-items:center}
.site .about-media{position:relative;padding-bottom:3rem}
.site .am-a{width:80%;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);background:var(--soft)}
.site .am-b{position:absolute;right:0;bottom:0;width:46%;aspect-ratio:1;border-radius:var(--radius);overflow:hidden;border:6px solid var(--bg);box-shadow:var(--shadow);background:var(--soft);transform:translateY(var(--py,0px))}
.site .about-media img{width:100%;height:100%;object-fit:cover;display:block}
.site .about-copy p{color:var(--muted);margin-top:1rem;font-size:1.05rem}
.site .about-copy h2{font-size:clamp(2rem,4vw,3.2rem);margin:.8rem 0 .4rem}
.site .about-facts{list-style:none;padding:0;margin:1.6rem 0 0;display:flex;flex-wrap:wrap;gap:.6rem}
.site .about-facts li{display:inline-flex;align-items:center;gap:.45rem;padding:.5rem .85rem;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:14px;font-weight:600}
.site .about-facts .i{width:16px;height:16px;color:var(--accent-text)}
.site .book-sec{position:relative;overflow:hidden;isolation:isolate}
.site .book-bg{position:absolute;inset:0;z-index:-1}
.site .book-bg img{width:100%;height:100%;object-fit:cover;opacity:.16;filter:saturate(.8)}
.site .book-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0%,transparent 30%,transparent 70%,var(--bg) 100%)}
@media (max-width:1000px){.site .about{grid-template-columns:1fr;gap:2.4rem}}
@media (max-width:640px){.site .menu-list .menu-img{aspect-ratio:16/8}.site .about-media{padding-bottom:2rem}.site .am-b{width:44%}}
${libCSS(M)}
@media (max-width:1000px){
.site section.hero .hero-grid{grid-template-columns:1fr}
 .site .nav{display:none}
 .site .burger{display:block}
 .site .mnav{display:grid;gap:.2rem;padding:0 1.25rem;max-height:0;overflow:hidden;transition:max-height .45s var(--ease),padding .45s;background:var(--bg)}
 .site .mnav.open{max-height:480px;padding:.5rem 1.25rem 1.2rem;border-bottom:1px solid var(--line)}
 .site .mnav a:not(.btn){padding:.8rem 0;text-decoration:none;font-weight:600;border-bottom:1px solid var(--line)}
 .site .mnav .btn{margin-top:.8rem}
 .site .hero-grid,.site .split,.site .book,.site .faq-wrap,.site .rv,.site .calc,.site .menu-grid.with-basket{grid-template-columns:1fr;gap:3rem}
 .site .split.rev .split-media{order:0}
 .site .cards{grid-template-columns:1fr 1fr}
 .site .stats-grid{grid-template-columns:1fr 1fr}
 .site .stat:nth-child(3){border-left:0}
 .site .stat:nth-child(n+3){border-top:1px solid var(--line)}
 .site .gallery{grid-template-columns:repeat(2,1fr);grid-auto-rows:200px}
 .site .footer-in{grid-template-columns:1fr 1fr}
 .site .basket{position:relative;top:0}
 .site .menu-list{grid-template-columns:1fr}
}
@media (max-width:640px){
 .site .hide-sm{display:none!important}
 .site .topbar-in{font-size:12px}
 .site .hdr-in{height:64px}
 .site .hdr-cta .btn-primary{padding:.65rem 1rem;font-size:14px}
 .site .brand{font-size:.98rem}
 .site .hero{padding:2.4rem 0 3.5rem}
 .site .hero h1{font-size:clamp(2.35rem,10.5vw,2.9rem)}
 .site .lead{font-size:1.04rem;margin-top:1.1rem}
 .site .hero-actions{margin-top:1.6rem}
 .site .hero-actions .btn{flex:1 1 100%}
 .site .chip{padding:.6rem .75rem;font-size:12.5px;max-width:200px}
 .site .chip-a{left:-2%;top:5%}
 .site .chip-b{right:-2%}
 .site .chip-c{display:none}
 .site .section{padding:4.2rem 0}
 .site .cards,.site .cards.n2,.site .cards.n4,.site .steps{grid-template-columns:1fr}
 .site .steps{gap:.4rem}
 .site .stat{padding:1.3rem 1rem}
 .site .stat b{font-size:1.9rem}
 .site .offer,.site .cta-band{flex-direction:column;align-items:flex-start;padding:2rem 1.5rem}
 .site .badge-float{right:.6rem;bottom:-1.4rem;padding:.9rem 1rem}
 .site .rv-card{padding:1.8rem;min-height:0}
 .site .form-card,.site .qcard{padding:1.3rem}
 .site .calc{padding:1.3rem}
 .site .row2,.site .qopts{grid-template-columns:1fr}
 .site .days{gap:.35rem}
 .site .chipbtn{padding:.6rem .1rem;font-size:13px}
 .site .gallery{grid-auto-rows:150px;gap:.6rem}
 .site .footer-in{grid-template-columns:1fr}
 .site .wa-float{width:52px;height:52px;padding:0;justify-content:center;right:1rem;bottom:1rem}
 .site .wa-float .wa-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
 .site .callbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:59;background:var(--deep);padding:.6rem .75rem;gap:.5rem}
 .site .callbar a{flex:1;justify-content:center}
 .site.has-callbar .wa-float{bottom:4.6rem}
 .site.has-callbar .footer{padding-bottom:8rem}
}
@media (max-width:380px){.site .hdr-cta .btn-primary{display:none}}
@media (prefers-reduced-motion:reduce){
 .site *,.site *::before,.site *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
 .site.js .reveal,.site.js .hero h1 .w{opacity:1!important;transform:none!important}
 .site .ribbon-track{flex-wrap:wrap;width:auto;justify-content:center;row-gap:.75rem;padding-inline:1rem}
 .site .ribbon-track .dup{display:none}
}
/* preview picture: fixed UI pinned to the first screen */
.site.pv *,.site.pv *::before,.site.pv *::after{animation:none!important;transition:none!important}
.site.pv .progress{display:none}
.site.pv .wa-float,.site.pv .callbar{position:absolute;bottom:auto}
.site.pv .wa-float{top:calc(var(--pvh) - 54px - 1.25rem)}
@media (max-width:640px){
 .site.pv .wa-float{top:calc(var(--pvh) - 52px - 1rem)}
 .site.pv .callbar{top:calc(var(--pvh) - 64px)}
 .site.pv.has-callbar .wa-float{top:calc(var(--pvh) - 52px - 4.6rem)}
}
`;
}
