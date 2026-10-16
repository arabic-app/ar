import test from 'node:test';import assert from 'node:assert/strict';
import {CARDS} from '../learning.mjs';import {getAudioPlan} from '../audio.mjs';
test('long vowels restore the original Google extension at normal playback speed',()=>{
 const p=getAudioPlan({ar:'بَا',audio:'بَا'});assert.equal(p.text,'بَااا');assert.equal(p.rate,1);assert.match(p.src,/translate_tts/);assert.equal(new URL(p.src).searchParams.get('q'),'بَااا');
 for(const c of CARDS.filter(c=>c.lesson==='long'))assert.equal(getAudioPlan(c).rate,1);
});
test('tanween in isolated letters is spoken as its vowel plus final n',()=>{
 for(const [ar,text]of [['تٍ','تِنْ'],['تٌ','تُنْ'],['تً','تَنْ'],['تًا','تَنْ']])assert.equal(getAudioPlan({ar,audio:ar}).text,text);
});
test('two-letter exercises remain one continuous utterance with their exact vowels',()=>{
 const p=getAudioPlan({ar:'تُبِ',audio:'تُبِ'});assert.equal(p.text,'تُبِ');assert.equal(p.parts,undefined);assert.equal(new URL(p.src).searchParams.get('q'),'تُبِ');
});
test('words keep their whole-word pronunciation and lām keeps its explicit ending',()=>{
 assert.equal(getAudioPlan(CARDS.find(c=>c.ar==='ل'&&c.lesson==='alphabet')).text,'لَامْ');
 assert.equal(getAudioPlan({ar:'كِتَابٌ',audio:'كِتَابٌ',kind:'word'}).text,'كِتَابٌ');
});
test('joiners never reach the speech engine and slow mode is optional',()=>{
 const p=getAudioPlan({ar:'\u200dتٍ\u200d',audio:'تٍ'},true);assert.equal(p.text,'تِنْ');assert.equal(p.rate,.75);
});
