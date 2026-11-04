const C='lovec-v3';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('lovec-')&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  const put=res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res;};
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(put).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(put)));});
