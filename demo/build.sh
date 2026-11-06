#!/bin/sh
# Assemble the single-file demo.html from src/ (examples + builder + template library src/lib + app) into the shell.
set -e
cd "$(dirname "$0")/src"
cat a0-examples.js b1-config.js b1b-industries.js b1c-copy.js b2-helpers.js b3-model.js b4-css.js b5-hero.js b6-sections.js $(ls lib/*.js | sort) b7-runtime.js b8-assemble.js c1-app.js > /tmp/app.js
node --check /tmp/app.js
node -e '
const fs=require("fs");
const js=fs.readFileSync("/tmp/app.js","utf8").replace(/<\/script/gi,"<\\/script").replace(/<!--/g,"<\\!--");
const shell=fs.readFileSync("shell.html","utf8");
const i=shell.indexOf("/*__SCRIPT__*/");
fs.writeFileSync("../demo.html", shell.slice(0,i)+js+shell.slice(i+14));
console.log("demo.html", fs.statSync("../demo.html").size, "bytes");'
# GitHub Pages publishes the repository root (main:/), so the live demo is /demo.html, not demo/demo.html.
cp ../demo.html ../../demo.html
echo "copied to repo root demo.html"
