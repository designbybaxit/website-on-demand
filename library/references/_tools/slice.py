import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
D='/workspace/website-on-demand/library/references/dental/'
n=sys.argv[1]
im=Image.open(D+n+'/desktop-full.png').convert('RGB')
w,h=im.size; s=0.5
im=im.resize((int(w*s),int(h*s)))
CH=1400
for i,y in enumerate(range(0,im.size[1],CH)):
    im.crop((0,y,im.size[0],min(y+CH,im.size[1]))).save(f'/workspace/dental-ref-tools/view/{n}-{i}.jpg',quality=70)
print(n, im.size, (im.size[1]+CH-1)//CH)
