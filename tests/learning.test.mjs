import test from 'node:test';
import assert from 'node:assert/strict';
const model = await import('../learning.mjs').catch(() => ({}));
test('Arabic input rejects Latin, numbers, marks alone and mixed scripts', () => {
 assert.equal(typeof model.validateInput, 'function');
 for (const text of ['a', '123', 'َ', 'بa', 'ب\u200D']) assert.equal(model.validateInput(text, 'word').ok, false, text);
});
test('Arabic validation counts letters independently of vowels and normalizes hamza', () => {
 assert.equal(typeof model.validateInput, 'function');
 assert.equal(model.validateInput('بِ', 'letter').ok, true);
 assert.equal(model.validateInput('ا\u0654َ', 'letter').ok, true);
 assert.equal(model.validateInput('بَتَ', 'letter').ok, false);
 assert.equal(model.validateInput('بَتَ', 'assembly').ok, true);
 assert.equal(model.validateInput('ب', 'assembly').ok, false);
 assert.equal(model.validateInput('بَابٌ', 'word').ok, true);
 assert.equal(model.validateInput('ب'.repeat(41), 'word').ok, false);
});
test('stored state tolerates corrupt, incomplete and obsolete data', () => {
 assert.equal(typeof model.restoreState, 'function');
 for(const value of [null, '{', 'null', '[]', '{"version":1}', '{"version":2,"prefs":{"lang":"xx"},"session":{"index":999}}']) {
  const state=model.restoreState(value); assert.equal(state.prefs.lang,'fr'); assert.equal(state.version,2);
 }
});
test('rating a card updates its review status without double counting', () => {
 assert.equal(typeof model.rateCard, 'function');
 let s=model.restoreState(null); const card=model.CARDS[0];
 s=model.rateCard(s,card.id,'review'); assert.equal(s.progress[card.id],'review');
 s=model.rateCard(s,card.id,'known'); assert.equal(s.progress[card.id],'known');
 assert.equal(Object.keys(s.progress).length,1);
});
test('curriculum has unique IDs, valid Arabic and unchanged audio text', () => {
 assert.ok(model.CARDS?.length>100);
 assert.equal(new Set(model.CARDS.map(c=>c.id)).size,model.CARDS.length);
 for(const c of model.CARDS) {
  assert.equal(model.validateInput(c.ar,'word').ok,true,c.id);
  assert.ok(c.audio); assert.equal(c.audio.includes('\u200d'),false);
  if(c.lesson!=='alphabet') assert.equal(c.audio,c.ar,c.id);
 }
 const long=model.CARDS.find(c=>c.ar==='بَا'); assert.equal(long.audio,'بَا');
});
test('alphabet covers 28 distinct letters and words retain both tracks', () => {
 assert.equal(new Set(model.CARDS.filter(c=>c.lesson==='alphabet').map(c=>c.ar)).size,28);
 assert.ok(model.CARDS.some(c=>c.track==='daily')); assert.ok(model.CARDS.some(c=>c.track==='quran'));
});
test('sessions restore their actual card and reject invalid IDs and index', () => {
 assert.equal(typeof model.createSession,'function');
 let s=model.restoreState(null); s.session=model.createSession('guided','vowels'); s.session.index=2;
 const restored=model.restoreState(JSON.stringify(s)); assert.equal(restored.session.index,2);
 s.session.ids=['missing']; s.session.index=500;
 assert.equal(model.restoreState(JSON.stringify(s)).session,null);
});
test('review sessions only contain cards explicitly marked for review', () => {
 let s=model.restoreState(null); const c=model.CARDS[5]; s=model.rateCard(s,c.id,'review');
 const session=model.createSession('review','alphabet',s); assert.deepEqual(session.ids,[c.id]);
});
test('custom vowels reject conflicting and duplicated marks while allowing shadda with a vowel',()=>{
 for(const text of ['بَِ','بُْ','بّّ','بََ','بّْ']) assert.equal(model.validateInput(text,'letter').ok,false,text);
 for(const text of ['بَّ','بِّ','بُّ','بْ','بً','أَ']) assert.equal(model.validateInput(text,'letter').ok,true,text);
});
