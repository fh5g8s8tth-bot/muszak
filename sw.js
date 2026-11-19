const C="lumen-v11-9",ICS="lumen-ics",F=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==ICS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  /* naptĂˇr-export: az app ide teszi a generĂˇlt .ics fĂˇjlt, innen valĂłdi text/calendar vĂˇlaszkĂ©nt jĂ¶n */
  if(new URL(r.url).pathname.endsWith("/naptar.ics")){e.respondWith(caches.open(ICS).then(c=>c.match(r,{ignoreSearch:true})).then(x=>x?x.text().then(t=>new Response(t,{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'inline; filename="lumen-muszakok.ics"',"Cache-Control":"no-store"}})):new Response("Nincs naptĂˇrfĂˇjl. Nyomd meg Ăşjra a NaptĂˇrba gombot.",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8"}})));return}
  e.respondWith(caches.open(C).then(c=>{
    const net=fetch(r,{cache:"no-store"}).then(x=>{if(x.ok)c.put(r,x.clone());return x});
    if(r.mode==="navigate"){const t=new Promise(res=>setTimeout(()=>c.match(r,{ignoreSearch:true}).then(res),1500));return Promise.race([net.catch(()=>c.match(r,{ignoreSearch:true})),t]).then(x=>x||net)}
    return c.match(r,{ignoreSearch:true}).then(hit=>hit||net)}))});
