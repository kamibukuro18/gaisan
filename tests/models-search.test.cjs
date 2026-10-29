const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { normalize, matches } = require('../models.js');
const fixture = {id:'M300-001',name:'ドリップスタンド',nameEn:'Pour Over Stand',category:'カフェ',categoryEn:'Cafe',description:'コーヒー抽出用のスタンド',tags:['コーヒー','coffee'],formats:['BLEND','GLB','FBX']};
test('Japanese, English, ID, fullwidth, and case-insensitive search', () => {
  for (const query of ['コーヒー','coffee','COFFEE','ｍ３００－００１','M300-001','Pour Over','カフェ','cafe','GLB']) assert.ok(matches(fixture,query),query);
  assert.equal(normalize(' ＣＯＦＦＥＥ '),'coffee');
});
test('All whitespace-separated words must match and category combines with search', () => {
  assert.ok(matches(fixture,'coffee stand','カフェ'));
  assert.equal(matches(fixture,'coffee missing','カフェ'),false);
  assert.equal(matches(fixture,'coffee','植物'),false);
  assert.ok(matches(fixture,'  \n\t '));
});
test('User-entered punctuation is literal, not a regular expression', () => {
  for (const query of ['[','.*','<script>']) assert.equal(matches(fixture,query),false);
});
test('Final catalog contains exactly the 103 unique completed IDs and local previews', () => {
  const root = path.resolve(__dirname,'..');
  const data = JSON.parse(fs.readFileSync(path.join(root,'assets/models/index.json'),'utf8'));
  assert.equal(data.models.length,103);
  assert.equal(data.count,103);
  assert.deepEqual(data.models.map(model => model.id).sort(),Array.from({length:103},(_,i)=>`M300-${String(i+1).padStart(3,'0')}`));
  for (const model of data.models) {
    for (const key of ['name','nameEn','category','categoryEn','description','image']) assert.ok(model[key],`${model.id}: ${key}`);
    assert.ok(model.tags.length > 0);
    assert.ok(model.formats.length > 0);
    assert.ok(model.notes.length > 0);
    assert.match(model.image,/^assets\/models\/previews\/M300-\d{3}\.webp$/);
    assert.ok(fs.statSync(path.join(root,model.image)).size > 0,model.image);
  }
});
