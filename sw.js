const C="lumen-v12-6-1",ICS="lumen-ics",F=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==ICS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;
  /* naptár-export: az app ide teszi a generált .ics fájlt, innen valódi text/calendar válaszként jön */
  if(new URL(r.url).pathname.endsWith("/naptar.ics")){e.respondWith(caches.open(ICS).then(c=>c.match(r,{ignoreSearch:true})).then(x=>x?x.text().then(t=>new Response(t,{headers:{"Content-Type":"text/calendar; charset=utf-8","Content-Disposition":'inline; filename="lumen-muszakok.ics"',"Cache-Control":"no-store"}})):new Response("Nincs naptárfájl. Nyomd meg újra a Naptárba gombot.",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8"}})));return}
  /* azonnal a cache-ből (gyors indulás, net nélkül is), közben a háttérben letölti a frissét a következő indításra;
     ha még nincs a cache-ben, a netről jön */
  const p=caches.open(C).then(c=>{
    const net=fetch(r,{cache:"no-store"}).then(x=>x.ok?c.put(r,x.clone()).then(()=>x,()=>x):x);
    /* a ?query-t csak navigációnál hagyjuk figyelmen kívül (pl. ?x, #debug), máskor pontos egyezés kell */
    return c.match(r,{ignoreSearch:r.mode==="navigate"}).then(hit=>({hit,net}))});
  e.respondWith(p.then(({hit,net})=>hit||net));
  e.waitUntil(p.then(({net})=>net.catch(()=>{})))});
