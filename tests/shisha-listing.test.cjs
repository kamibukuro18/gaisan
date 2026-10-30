const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sandbox = {window:{}};
for (const file of ['content.js','catalog.js']) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox);
const ui = sandbox.window.portfolioUI;
const items = ui.works.filter(item=>item.slug==='shisha-spin');
test('SHISHA SPIN has one visible work card and an accessible app link',()=>{
  assert.equal(items.length,1);
  const item=items[0];
  assert.equal(item.kind,'game');
  assert.equal(ui.entryHref(item),'entry.html?type=games&slug=shisha-spin');
  assert.equal(ui.primaryAction(item).href,'shisha-spin/');
  assert.notEqual(ui.primaryAction(item).label,'BOOTHで購入');
  assert.ok(fs.existsSync(path.join(root,item.href,'index.html')));
});
test('listing uses a real image and a populated detail page',()=>{
  const item=items[0];
  assert.ok(fs.statSync(path.join(root,item.cover)).size>1000);
  assert.ok(item.page.intro && item.page.highlights.length===3 && item.page.sections.length===3);
  assert.ok(ui.illustration(item).includes('APP CAPTURE'));
  assert.ok(item.page.sections.some(section=>(section.links||[]).some(link=>link.href==='shisha-spin/')));
});
test('existing featured works and the model catalog remain present',()=>{
  for(const slug of ['neon-ikebukuro-run','star-finch','crabhouse','production-model-catalog']) assert.ok(ui.works.some(item=>item.slug===slug));
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'assets/models/index.json'))).count,103);
});
