const VERSION="v4",SHELL=`amar-hishab-shell-${VERSION}`;
const FILES=["./","./index.html","./manifest.json","./icon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.allSettled(FILES.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==SHELL).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function networkFirst(req){const c=await caches.open(SHELL);try{const r=await Promise.race([fetch(req),new Promise((_,j)=>setTimeout(()=>j(0),4000))]);if(r&&r.ok)c.put(req,r.clone());return r}catch(e){return(await c.match(req,{ignoreSearch:true}))||(await c.match("./index.html"))||Response.error()}}
async function swr(req){const c=await caches.open(SHELL),m=await c.match(req),f=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r}).catch(()=>null);return m||(await f)||Response.error()}
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;const u=new URL(q.url);if(u.origin!==location.origin||u.pathname.endsWith("/sw.js"))return;e.respondWith(q.mode==="navigate"?networkFirst(q):swr(q))});
