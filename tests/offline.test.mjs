import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {TEXT,tipFor} from '../i18n.mjs';
import {LESSONS} from '../learning.mjs';
const script=await fs.readFile(new URL('../sw.js',import.meta.url),'utf8');
function worker({online=true}={}) {
 const handlers={};const entries=new Map();let storedAssets=[];let fetched=[];let removed=[];
 const cache={addAll:async urls=>{storedAssets=urls;for(const url of urls)entries.set(url,`cached:${url}`);},match:async request=>entries.get(typeof request==='string'?request:request.url)};
 const context={URL,self:{location:{href:'https://example.com/arabic/sw.js'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>['unrelated-cache','nour-v2-old'],delete:async key=>removed.push(key),match:cache.match},fetch:async request=>{fetched.push(request);if(!online)throw new Error('offline');return 'network-response';}};
 vm.runInNewContext(script,context);
 return {handlers,entries,get assets(){return storedAssets;},get removed(){return removed;},get fetched(){return fetched;}};
}
async function install(w){let promise;w.handlers.install({waitUntil:p=>promise=p});await promise;}
async function request(w,url,mode='cors',method='GET'){
 let response;w.handlers.fetch({request:{url,method,mode},respondWith:p=>response=p});return response?await response:undefined;
}
test('offline install caches all application resources at a subdirectory URL',async()=>{
 const w=worker();await install(w);
 assert.ok(w.assets.includes('https://example.com/arabic/index.html'));
 for(const url of w.assets){const path=url.replace('https://example.com/arabic/','')||'index.html';assert.ok((await fs.stat(new URL('../'+path,import.meta.url))).isFile(),path);}
});
test('navigation and module requests remain available when the network is down',async()=>{
 const w=worker({online:false});await install(w);
 assert.equal(await request(w,'https://example.com/arabic/','navigate'),'cached:https://example.com/arabic/index.html');
 assert.equal(await request(w,'https://example.com/arabic/app.mjs'),'cached:https://example.com/arabic/app.mjs');
});
test('unrelated origins, paths and mutations are not intercepted',async()=>{
 const w=worker();await install(w);
 assert.equal(await request(w,'https://fonts.googleapis.com/css2'),undefined);
 assert.equal(await request(w,'https://example.com/private/file'),undefined);
 assert.equal(await request(w,'https://example.com/arabic/unknown.txt'),undefined);
 assert.equal(await request(w,'https://example.com/arabic/app.mjs','cors','POST'),undefined);
});
test('worker activation removes only obsolete Nour caches',async()=>{
 const w=worker();let promise;w.handlers.activate({waitUntil:p=>promise=p});await promise;assert.deepEqual(w.removed,['nour-v2-old']);
});
test('all UI languages and lesson tips are complete',()=>{
 const keys=Object.keys(TEXT.fr);for(const lang of ['fr','en','ar']){
  assert.deepEqual(Object.keys(TEXT[lang]),keys);for(const value of Object.values(TEXT[lang]))assert.ok(value.length>0);
  for(const lesson of LESSONS){assert.ok(lesson[lang]);assert.ok(lesson.description[lang]);assert.ok(tipFor(lesson.id,lang).text);}
 }
});
