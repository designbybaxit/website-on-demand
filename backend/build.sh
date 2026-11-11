#!/bin/sh
# Build ./public from the shared builder source in ../demo/src (same code as the GitHub Pages demo).
#  - public/index.html : the order app, in server mode (window.WOD_API = 1)
#  - public/admin.html : admin page (builder + app/admin.js)
set -e
cd "$(dirname "$0")"
SRC=../demo/src
mkdir -p public
BUILDER="$SRC/b1-config.js $SRC/b1b-industries.js $SRC/b1c-copy.js $SRC/b2-helpers.js $SRC/b3-model.js $SRC/b4-css.js $SRC/b5-hero.js $SRC/b6-sections.js $(ls $SRC/lib/*.js | sort) $SRC/b7-runtime.js $SRC/b8-assemble.js"
{ echo 'window.WOD_API = 1;'; cat $SRC/a0-examples.js $BUILDER $SRC/c1-app.js; } > /tmp/wod-app.js
cat $BUILDER app/admin.js > /tmp/wod-admin.js
node --check /tmp/wod-app.js && node --check /tmp/wod-admin.js
node -e '
const fs=require("fs");
const inject=(shell,jsFile,out)=>{const js=fs.readFileSync(jsFile,"utf8").replace(/<\/script/gi,"<\\/script").replace(/<!--/g,"<\\!--");
  const s=fs.readFileSync(shell,"utf8"), i=s.indexOf("/*__SCRIPT__*/"); if(i<0) throw new Error("no marker in "+shell);
  fs.writeFileSync(out, s.slice(0,i)+js+s.slice(i+14)); console.log(out, fs.statSync(out).size, "bytes");};
inject(process.argv[1]+"/shell.html","/tmp/wod-app.js","public/index.html");
inject("app/admin.html","/tmp/wod-admin.js","public/admin.html");' "$SRC"
cat > public/_headers <<'H'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
/admin
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-store
  X-Frame-Options: DENY
/admin.html
  X-Robots-Tag: noindex, nofollow
  X-Frame-Options: DENY
/
  Cache-Control: public, max-age=60
/brand/*
  Cache-Control: public, max-age=86400
/og-image.png
  Cache-Control: public, max-age=86400
/og-image.jpg
  Cache-Control: public, max-age=86400
/favicon.ico
  Cache-Control: public, max-age=86400
/favicon.svg
  Cache-Control: public, max-age=86400
/favicon-16.png
  Cache-Control: public, max-age=86400
/favicon-32.png
  Cache-Control: public, max-age=86400
/favicon-512.png
  Cache-Control: public, max-age=86400
/apple-touch-icon.png
  Cache-Control: public, max-age=86400
/site.webmanifest
  Cache-Control: public, max-age=86400
  Content-Type: application/manifest+json
/robots.txt
  Cache-Control: public, max-age=3600
/sitemap.xml
  Cache-Control: public, max-age=3600
H
cat > public/robots.txt <<'R'
User-agent: *
Allow: /
Disallow: /admin
Disallow: /p/
Disallow: /s/

Sitemap: https://webimade.com/sitemap.xml
R
cat > public/sitemap.xml <<'S'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://webimade.com/</loc>
  </url>
</urlset>
S
# Favicons from logo-final-v2; logo lockup, OG image and manifest from brand/web.
V2=../brand/logo-final-v2
ASSETS=../brand/web
if [ -d "$V2" ]; then
  cp -a "$V2/favicon-16.png" "$V2/favicon-32.png" "$V2/favicon.svg" "$V2/favicon-512.png" public/
  cp -a "$V2/favicon-180.png" public/apple-touch-icon.png
fi
if [ -d "$ASSETS" ]; then
  cp -a "$ASSETS/favicon.ico" "$ASSETS/og-image.png" "$ASSETS/site.webmanifest" public/
  if [ -f "$ASSETS/og-image.jpg" ]; then cp -a "$ASSETS/og-image.jpg" public/; fi
  mkdir -p public/brand
  cp -a "$ASSETS/brand/." public/brand/
fi
