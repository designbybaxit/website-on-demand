#!/bin/sh
# Build the site-test marketing copy into site-test/public.
# Does not write to demo/, backend/public, or brand-preview/.
set -e
cd "$(dirname "$0")"
SRC=src
mkdir -p public
cat $SRC/a0-examples.js $SRC/b1-config.js $SRC/b1b-industries.js $SRC/b1c-copy.js $SRC/b2-helpers.js $SRC/b3-model.js $SRC/b4-css.js $SRC/b5-hero.js $SRC/b6-sections.js $(ls $SRC/lib/*.js | sort) $SRC/b7-runtime.js $SRC/b8-assemble.js $SRC/c1-app.js > /tmp/wod-site-test-app.js
node --check /tmp/wod-site-test-app.js
node -e '
const fs=require("fs");
const js=fs.readFileSync("/tmp/wod-site-test-app.js","utf8").replace(/<\/script/gi,"<\\/script").replace(/<!--/g,"<\\!--");
const s=fs.readFileSync("src/shell.html","utf8"), i=s.indexOf("/*__SCRIPT__*/");
if(i<0) throw new Error("no marker in src/shell.html");
fs.writeFileSync("public/index.html", s.slice(0,i)+js+s.slice(i+14));
console.log("public/index.html", fs.statSync("public/index.html").size, "bytes");
'
cat > public/_headers <<'H'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Robots-Tag: noindex, nofollow
/
  Cache-Control: public, max-age=60
/brand/*
  Cache-Control: public, max-age=86400
/examples/*
  Cache-Control: public, max-age=86400
/og-image.jpg
  Cache-Control: public, max-age=86400
/favicon.ico
  Cache-Control: public, max-age=86400
/favicon-16.png
  Cache-Control: public, max-age=86400
/favicon-32.png
  Cache-Control: public, max-age=86400
/apple-touch-icon.png
  Cache-Control: public, max-age=86400
H
printf 'User-agent: *\nDisallow: /\n' > public/robots.txt
ASSETS=../brand/web
if [ -d "$ASSETS" ]; then
  cp -a "$ASSETS/favicon.ico" "$ASSETS/favicon-16.png" "$ASSETS/favicon-32.png" "$ASSETS/apple-touch-icon.png" "$ASSETS/og-image.jpg" public/
  mkdir -p public/brand
  cp -a "$ASSETS/brand/." public/brand/
fi
# Preserve any already-generated example stills
mkdir -p public/examples
echo "site-test public ready"
