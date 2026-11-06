import json,re,sys
for n in sys.argv[1:]:
    d=json.load(open(n+'/extract.json'))
    print('=====',n,d['height'])
    print('fonts',d['fonts'][:5]); print('heads',d['heads'][:5])
    print('bg',[b[0] for b in d['bg'][:9]]); print('fg',[b[0] for b in d['fg'][:5]])
    v={k.replace('--e-global-color-',''):v for k,v in d['vars'].items() if k.startswith('--e-global-color') }
    if not v: v={k:v for k,v in d['vars'].items() if 'wp' not in k and re.match(r'#|rgb',v)}
    print('vars',dict(list(v.items())[:14]))
    print('btns',sorted(set((b['bg'],b['c'],b['r'],b['tt'],b['ff'],b['fw']) for b in d['btns'] if b['bg']!='rgba(0, 0, 0, 0)'))[:4])
    print('scripts',[s for s in d['scripts'] if re.search('swiper|gsap|wow|aos|lenis|slick|owl|counter|parallax|isotope|magnific|splitting|typed|lottie|scroll|tilt|marquee|anim|twenty|compar|juxta|before',s,re.I)][:12])
    an=set(); [an.update(s['anims']) for s in d['sections']]; print('anims',an)
    print('cssAnims',d['cssAnims'][:8])
    w=set(); [w.update(s['widgets']) for s in d['sections']]; print('widgets',sorted(w)[:40])
