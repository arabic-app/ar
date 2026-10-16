const CACHE='nour-v2-20261016-7';
const BASE=new URL('./',self.location.href);
const ASSETS=['./','index.html','styles.css','app.mjs','learning.mjs','i18n.mjs','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','audio.mjs','free.mjs'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new URL(path,BASE).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nour-v2-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin==='https://translate.google.com'&&url.pathname==='/translate_tts'){
  event.respondWith(caches.open('nour-google-audio-v1').then(async cache=>{
   const cached=await cache.match(event.request);if(cached)return cached;
   const response=await fetch(event.request);
   if(response.ok||response.type==='opaque'){
    try{await cache.put(event.request,response.clone());const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-128)))await cache.delete(key);}catch{}
   }
   return response;
  }).catch(()=>fetch(event.request)));return;
 }
 if(url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 // Only cache the app shell; arbitrary paths must not fill storage.
 const isAsset=ASSETS.some(path=>new URL(path,BASE).pathname===url.pathname);
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('index.html',BASE).href)));return;
 }
 if(isAsset)event.respondWith(caches.open(CACHE).then(async cache=>{return fetch(event.request).catch(()=>cache.match(event.request));}));
});
