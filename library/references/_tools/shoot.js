const { chromium } = require('playwright');
const fs = require('fs');
const OUT = '/workspace/website-on-demand/library/references/dental/';
const list = [
['01-smilecare','https://smilecare.1onestrong.com/?storefront=envato-elements'],
['02-templateup-dental','https://templateup.site/dental/?storefront=envato-elements'],
['03-timan','https://demo.casethemes.net/timan/?storefront=envato-elements'],
['04-denty','https://fatma-studio.com/denty/?storefront=envato-elements'],
['05-dentara','https://askcreativelab.com/dentara/?storefront=envato-elements'],
['06-happy-smiles','https://happy-smiles.cmsmasters.studio/main/'],
['07-dentique','https://www.wordpress-dev.codeinsolution.com/dentique/?storefront=envato-elements'],
['08-usmile','https://askproject.net/usmile/home/?storefront=envato-elements'],
['09-dentacare','https://demo.moxcreative.com/dentacare/template-kit/homepage/?storefront=envato-elements'],
['10-shinental','https://show.creativemox.com/shinental/?storefront=envato-elements'],
['11-dentalkit','https://point.moxcreative.com/dentalkit/template-kit/homepage/?storefront=envato-elements'],
];
const only = process.argv[2];
const prep = async (p) => {
  await p.evaluate(async () => {
    document.documentElement.style.scrollBehavior='auto';
    for (let i=0;i<2;i++){ const h=document.documentElement.scrollHeight; for(let y=0;y<h;y+=400){scrollTo(0,y); await new Promise(r=>setTimeout(r,150));} }
    scrollTo(0,0);
    document.querySelectorAll('.elementor-invisible').forEach(e=>e.classList.remove('elementor-invisible'));
    document.querySelectorAll('[data-aos]').forEach(e=>e.classList.add('aos-animate'));
    document.querySelectorAll('.wow').forEach(e=>{e.style.visibility='visible';e.style.animationName='none'});
    document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
    await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r; setTimeout(r,6000)})));
  });
  await p.waitForTimeout(4000);
};
const settle = async (p) => {
  for (let i=0;i<20;i++){ await p.waitForTimeout(2500); if (!/sgcaptcha|challenge/.test(p.url())) break; }
  await p.waitForTimeout(2500);
  try { await p.waitForLoadState('networkidle',{timeout:15000}); } catch(e){}
  try { await p.evaluate(()=>{ const b=[...document.querySelectorAll('button,a')].find(x=>/^accept all$/i.test(x.innerText.trim())); if(b) b.click(); }); } catch(e){}
};
(async () => {
  const b = await chromium.launch({executablePath:'/usr/bin/google-chrome', args:['--headless=new']});
  for (const [name,url] of list) {
    if (only && !name.startsWith(only)) continue;
    const dir = OUT+name+'/'; fs.mkdirSync(dir,{recursive:true});
    if (!only && fs.existsSync(dir+'mobile-full.png')) { console.log(name,'skip'); continue; }
    let st;
    try {
      const ctx = await b.newContext({viewport:{width:1440,height:900}, userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'});
      const p = await ctx.newPage();
      const resp = await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await settle(p);
      await p.waitForTimeout(3000);
      await p.screenshot({path:dir+'hero-desktop.png'});
      await prep(p);
      await p.screenshot({path:dir+'desktop-full.png', fullPage:true});
      const data = await p.evaluate(() => {
        const cnt = (m,k)=>{m[k]=(m[k]||0)+1};
        const bg={}, fg={}, fonts={}, btns=[];
        const all=[...document.querySelectorAll('body *')].filter(e=>e.offsetWidth>0);
        for (const e of all){ const s=getComputedStyle(e);
          if (s.backgroundColor && s.backgroundColor!=='rgba(0, 0, 0, 0)') cnt(bg,s.backgroundColor);
          if ([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) { cnt(fg,s.color); cnt(fonts,s.fontFamily.split(',')[0].trim()); }
        }
        const heads={}; document.querySelectorAll('h1,h2,h3').forEach(h=>{const s=getComputedStyle(h); cnt(heads,h.tagName+'|'+s.fontFamily.split(',')[0]+'|'+s.fontWeight+'|'+s.fontSize)});
        document.querySelectorAll('.elementor-button, button, a.btn, .btn, [class*=button]').forEach(e=>{ if(e.offsetWidth>0&&btns.length<12){const s=getComputedStyle(e); btns.push({t:e.innerText.trim().slice(0,30), bg:s.backgroundColor, c:s.color, r:s.borderRadius, pad:s.padding, ff:s.fontFamily.split(',')[0], fw:s.fontWeight, tt:s.textTransform, border:s.border});}});
        let secs=[...document.querySelectorAll('body section, body .elementor-top-section, body .e-con.e-parent, main > div, header, footer')].filter(e=>e.offsetHeight>60);
        secs = secs.filter(e=>!secs.some(o=>o!==e&&o.contains(e)));
        const sections = secs.map(e=>{const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
          return {tag:e.tagName, cls:(e.className||'').toString().slice(0,100), y:Math.round(r.top+scrollY), h:Math.round(r.height), bg:s.backgroundColor, bgimg:s.backgroundImage.slice(0,50),
            heads:[...e.querySelectorAll('h1,h2,h3,h4,h5,h6')].slice(0,8).map(h=>h.tagName+': '+h.innerText.trim().replace(/\s+/g,' ').slice(0,70)),
            imgs:e.querySelectorAll('img').length, inputs:e.querySelectorAll('input,select,textarea').length,
            widgets:[...new Set([...e.querySelectorAll('[data-widget_type]')].map(w=>w.dataset.widget_type))].slice(0,20),
            swipers:e.querySelectorAll('.swiper,.swiper-container,.owl-carousel,.slick-slider').length,
            counters:e.querySelectorAll('[class*=counter],[data-to-value],[data-count]').length,
            accordions:e.querySelectorAll('[class*=accordion],[class*=toggle],details').length,
            videos:e.querySelectorAll('video,iframe,[class*=video]').length,
            anims:[...new Set([...e.querySelectorAll('[data-settings]')].map(w=>{try{const j=JSON.parse(w.dataset.settings);return j._animation||j.animation||''}catch(x){return ''}}).filter(Boolean))]
          }});
        const scripts=[...document.scripts].map(s=>s.src).filter(Boolean).map(s=>s.split('?')[0].split('/').slice(-2).join('/'));
        const links=[...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.href).filter(h=>/font/.test(h));
        const ff=[...document.fonts].map(f=>f.family+' '+f.weight+' '+f.style+' '+f.status).filter((v,i,a)=>a.indexOf(v)===i);
        const top=(m,n)=>Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,n);
        const vars={}; for (const sh of document.styleSheets){ try{ for(const r of sh.cssRules){ if(r.selectorText&& /:root|\.elementor-kit/.test(r.selectorText)){ for(const p of r.style){ if(/color|font-family/.test(p)&&p.startsWith('--')) vars[p]=r.style.getPropertyValue(p).trim(); } } } }catch(e){} }
        return {title:document.title, url:location.href, height:document.documentElement.scrollHeight, bg:top(bg,15), fg:top(fg,10), fonts:top(fonts,8), heads:top(heads,12), btns, sections, scripts, fontLinks:links, fontFaces:ff.slice(0,30), vars, cssAnims:[...new Set([...document.querySelectorAll('[class*=animate],[class*=marquee],[class*=parallax],[class*=tilt],[class*=hover-]')].map(e=>[...e.classList].filter(c=>/animate|marquee|parallax|tilt|hover-/.test(c)).join(' ')))].slice(0,40)};
      });
      data.httpStatus = resp ? resp.status() : null;
      fs.writeFileSync(dir+'extract.json', JSON.stringify(data,null,1));
      await ctx.close();
      const m = await b.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
      const mp = await m.newPage();
      await mp.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await settle(mp);
      await mp.waitForTimeout(2000);
      await mp.screenshot({path:dir+'hero-mobile.png'});
      await prep(mp);
      await mp.screenshot({path:dir+'mobile-full.png', fullPage:true});
      await m.close();
      st={ok:true,status:data.httpStatus,final:data.url,title:data.title,height:data.height};
    } catch(e) { st={ok:false,err:String(e).slice(0,300)}; }
    console.log(name, JSON.stringify(st));
  }
  await b.close();
})();
