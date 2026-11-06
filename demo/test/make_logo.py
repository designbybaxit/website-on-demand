import zlib, struct, math
W=H=200
rows=[]
for y in range(H):
    r=bytearray([0])
    for x in range(W):
        d=math.hypot(x-100,y-100)
        if d<90:
            # drop shape-ish: blue circle with white wave
            if abs(y-100-20*math.sin(x/18))<12: r+=bytes([255,255,255,255])
            else: r+=bytes([14,116,144,255])
        else: r+=bytes([0,0,0,0])
    rows.append(bytes(r))
raw=b''.join(rows)
def chunk(t,d): return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',W,H,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')
open('test/test-logo.png','wb').write(png)
