const C="lumen-v8",F=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  e.respondWith(caches.open(C).then(c=>{
    const net=fetch(r,{cache:"no-store"}).then(x=>{if(x.ok)c.put(r,x.clone());return x});
    if(r.mode==="navigate"){const t=new Promise(res=>setTimeout(()=>c.match(r,{ignoreSearch:true}).then(res),1500));return Promise.race([net.catch(()=>c.match(r,{ignoreSearch:true})),t]).then(x=>x||net)}
    return c.match(r,{ignoreSearch:true}).then(hit=>hit||net)}))});
