import test from 'node:test';import assert from 'node:assert/strict';
import {createSession,restoreState} from '../learning.mjs';
let seed=12345;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const free=await import('../free.mjs').catch(()=>({}));
test('free letters have vowels and positional forms, rather than alphabet names',()=>{
 assert.equal(typeof free.generateFreeCard,'function');
 const positions=new Set();const signs=new Set();
 for(let i=0;i<500;i++){const c=free.generateFreeCard('letter',[],random);assert.match(c.ar,/[\u064B-\u0650]/);assert.equal(c.audio,c.ar);assert.equal(c.name,undefined);positions.add(c.position);for(const m of c.ar.match(/[\u064B-\u0650]/g))signs.add(m);}
 assert.equal(positions.size,4);assert.equal(signs.size,6);
});
test('free combinations are generated beyond the ten curated examples',()=>{
 assert.equal(typeof free.generateFreeCard,'function');const unique=new Set();let long=false,sukun=false,shadda=false;
 for(let i=0;i<500;i++){const c=free.generateFreeCard('assembly',[],random);unique.add(c.ar);long ||= c.isMadd;sukun ||= c.ar.includes('ْ');shadda ||= c.ar.includes('ّ');}
 assert.ok(unique.size>100);assert.ok(long&&sukun&&shadda);
});
test('non-joining final letters never receive a following connector',()=>{
 assert.equal(typeof free.generateFreeCard,'function');
 for(let i=0;i<500;i++){const c=free.generateFreeCard('assembly',[],random);const last=c.ar.replace(/[\u064B-\u0652]/g,'').at(-1);if('أادذرزو'.includes(last))assert.ok(['isolated','final'].includes(c.position));}
});

test('free practice persists as an unlimited generator rather than a ten-card session',()=>{
 const state=restoreState(null);state.session=createSession('free','alphabet',state);assert.deepEqual(state.session.ids,[]);
 assert.equal(restoreState(JSON.stringify(state)).session.kind,'free');
});
