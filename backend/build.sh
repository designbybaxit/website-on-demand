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
H
printf 'User-agent: *\nDisallow: /p/\nDisallow: /admin\nDisallow: /api/\n' > public/robots.txt
