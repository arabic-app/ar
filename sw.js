const CACHE='nour-v2-20261016-4';
const BASE=new URL('./',self.location.href);
const ASSETS=['./','index.html','styles.css','app.mjs','learning.mjs','i18n.mjs','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new URL(path,BASE).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nour-v2-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 // Only cache the app shell; arbitrary paths must not fill storage.
 const isAsset=ASSETS.some(path=>new URL(path,BASE).pathname===url.pathname);
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('index.html',BASE).href)));return;
 }
 if(isAsset)event.respondWith(caches.open(CACHE).then(async cache=>{return fetch(event.request).catch(()=>cache.match(event.request));}));
});
