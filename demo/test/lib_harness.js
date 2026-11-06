// Loads the builder (no app UI) into a Node VM so library logic can be unit-tested fast.
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(__dirname, '../src/');
const files = ['a0-examples', 'b1-config', 'b1b-industries', 'b1c-copy', 'b2-helpers', 'b3-model', 'b4-css', 'b5-hero', 'b6-sections',
  ...fs.readdirSync(SRC + 'lib').filter(f => f.endsWith('.js')).sort().map(f => 'lib/' + f.slice(0, -3)), 'b7-runtime', 'b8-assemble'];
const code = files.map(f => fs.readFileSync(SRC + f + '.js', 'utf8')).join('\n') +
  '\n;globalThis.__api={buildSite,siteModel,EXAMPLES,LIB,PROFILES,photoKey,detectProfile,extractFacts,hash32,STYLES,insuranceFacts,weekHours,offersEmergency,CX};';
const ctx = { console, Date, Math, JSON, Intl, encodeURIComponent, Set, Map };
vm.createContext(ctx); vm.runInContext(code, ctx, { filename: 'builder.js' });
module.exports = ctx.__api;
